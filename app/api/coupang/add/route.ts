import { NextRequest, NextResponse } from 'next/server';
import { Client } from '@notionhq/client';

const notion = new Client({ auth: process.env.NOTION_API_KEY });

const rawId = process.env.NOTION_DATABASE_ID!;
const dataSourceId = rawId.includes('-')
  ? rawId
  : rawId.replace(/^(.{8})(.{4})(.{4})(.{4})(.{12})$/, '$1-$2-$3-$4-$5');

async function getDbId() {
  const response = await notion.dataSources.query({ data_source_id: dataSourceId });
  const first = response.results[0] as any;
  console.log('parent:', JSON.stringify(first?.parent));
  const dbId = first?.parent?.database_id;
  if (!dbId) throw new Error('DB ID를 가져올 수 없습니다');
  return dbId;
}

export async function POST(request: NextRequest) {
  const password = request.headers.get('x-admin-password');
  if (password !== process.env.ADMIN_PASSWORD) {
    return NextResponse.json({ error: '인증 실패' }, { status: 401 });
  }

  const { product, keyword, form } = await request.json();

  try {
    const dbId = await getDbId();

    await notion.pages.create({
      parent: { database_id: dbId },
      properties: {
        Name: { title: [{ text: { content: product.productName } }] },
        카테고리: { select: { name: form.category } },
        가격: { rich_text: [{ text: { content: form.price || `${product.productPrice.toLocaleString()}원~` } }] },
        원가: { rich_text: [{ text: { content: form.originalPrice || '' } }] },
        할인율: { rich_text: [{ text: { content: form.discount || '' } }] },
        별점: { rich_text: [{ text: { content: form.rating || '' } }] },
        이미지: { url: product.productImage },
        쿠팡링크: { url: product.productUrl },
        로켓배송: { checkbox: product.isRocket },
        무료배송: { checkbox: product.isFreeShipping },
        키워드: { rich_text: [{ text: { content: keyword || '' } }] },
        상품ID: { rich_text: [{ text: { content: String(product.productId) } }] },
        검색순위: { rich_text: [{ text: { content: String(product.rank || '') } }] },
        설명: { rich_text: [{ text: { content: form.desc || '' } }] },
        한마디: { rich_text: [{ text: { content: form.hanmadi || '' } }] },
        태그: { rich_text: [{ text: { content: form.tag || '' } }] },
        비교: { rich_text: [{ text: { content: form.compare || '' } }] },
        슬러그: { rich_text: [{ text: { content: form.slug || '' } }] },
        ...(form.badge ? { 뱃지: { select: { name: form.badge } } } : {}),
      } as any,
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}