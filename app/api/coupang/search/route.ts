import { NextRequest, NextResponse } from 'next/server';
import { searchProducts } from '@/lib/coupang';
import { Client } from '@notionhq/client';

const notion = new Client({ auth: process.env.NOTION_API_KEY });
const rawId = process.env.NOTION_DATABASE_ID!;
const dbId = rawId.includes('-')
  ? rawId
  : rawId.replace(/^(.{8})(.{4})(.{4})(.{4})(.{12})$/, '$1-$2-$3-$4-$5');

export async function GET(request: NextRequest) {
  const password = request.headers.get('x-admin-password');
  if (password !== process.env.ADMIN_PASSWORD) {
    return NextResponse.json({ error: '인증 실패' }, { status: 401 });
  }

  const keyword = request.nextUrl.searchParams.get('keyword');
  if (!keyword) {
    return NextResponse.json({ error: '키워드 필요' }, { status: 400 });
  }

  try {
    const products = await searchProducts(keyword, 5);

    const existingIds = new Set<string>();
    let cursor: string | undefined = undefined;
    do {
      const res: any = await notion.dataSources.query({
        data_source_id: dbId,
        start_cursor: cursor,
        page_size: 100,
      });
      for (const page of res.results) {
        const id = page.properties?.상품ID?.rich_text?.[0]?.plain_text;
        if (id) existingIds.add(String(id).trim());
      }
      cursor = res.has_more ? res.next_cursor : undefined;
    } while (cursor);

    const productsWithFlag = products.map((p: any) => ({
      ...p,
      isRegistered: existingIds.has(String(p.productId)),
    }));

    return NextResponse.json({ products: productsWithFlag });
  } catch (error: any) {
    if (error.message === 'API_RATE_LIMIT') {
      return NextResponse.json({ error: 'API 호출 한도 초과. 잠시 후 다시 시도하세요.' }, { status: 429 });
    }
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}