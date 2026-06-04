import { NextRequest, NextResponse } from 'next/server';
import { Client } from '@notionhq/client';
import { searchProducts, delay } from '@/lib/coupang';

const notion = new Client({ auth: process.env.NOTION_API_KEY });

const rawId = process.env.NOTION_DATABASE_ID!;
const dataSourceId = rawId.includes('-')
    ? rawId
    : rawId.replace(/^(.{8})(.{4})(.{4})(.{4})(.{12})$/, '$1-$2-$3-$4-$5');

export async function POST(request: NextRequest) {
    const password = request.headers.get('x-admin-password');
    if (password !== process.env.ADMIN_PASSWORD) {
        return NextResponse.json({ error: '인증 실패' }, { status: 401 });
    }

    const body = await request.json();
    const { productId } = body;

    try {
        let allResults: any[] = [];
        let cursor: string | undefined = undefined;
        do {
            const response = await notion.dataSources.query({
                data_source_id: dataSourceId,
                start_cursor: cursor,
                page_size: 100,
            });
            allResults = [...allResults, ...response.results];
            cursor = response.has_more ? response.next_cursor ?? undefined : undefined;
        } while (cursor);

        const targets = productId
            ? allResults.filter(p => p.id === productId)
            : allResults;

        let updated = 0;
        let failed = 0;

        for (const page of targets) {
            const productName = page.properties.키워드?.rich_text?.[0]?.plain_text;

            if (!productName) continue;

            const currentPrice = page.properties.가격?.rich_text?.[0]?.plain_text ?? '';
            const currentDiscount = page.properties.할인율?.rich_text?.[0]?.plain_text ?? '';

            try {
                const searchKeyword = productName.slice(0, 20);
                const products = await searchProducts(searchKeyword, 10);
                const matchedProduct = products[0];

                if (!matchedProduct) {
                    failed++;
                    await delay(2000);
                    continue;
                }

                const newPrice = `${matchedProduct.productPrice.toLocaleString()}원~`;

                await notion.pages.update({
                    page_id: page.id,
                    properties: {
                        가격: { rich_text: [{ text: { content: newPrice } }] },
                        이미지: { url: matchedProduct.productImage },
                        쿠팡링크: { url: matchedProduct.productUrl },
                        이전가격: { rich_text: [{ text: { content: currentPrice } }] },
                        이전할인율: { rich_text: [{ text: { content: currentDiscount } }] },
                        로켓배송: { checkbox: matchedProduct.isRocket },
                        무료배송: { checkbox: matchedProduct.isFreeShipping },
                        검색순위: { rich_text: [{ text: { content: String(matchedProduct.rank || '') } }] },
                        상품ID: { rich_text: [{ text: { content: String(matchedProduct.productId) } }] },
                    } as any,
                });

                updated++;
                await delay(2000);

            } catch (err: any) {
                if (err.message === 'API_RATE_LIMIT') {
                    return NextResponse.json({ error: 'API 호출 한도 초과', updated, failed }, { status: 429 });
                }
                failed++;
                await delay(2000);
            }
        }

        return NextResponse.json({
            success: true,
            message: `업데이트 완료: ${updated}개 성공, ${failed}개 실패`,
            updated,
            failed,
        });

    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}