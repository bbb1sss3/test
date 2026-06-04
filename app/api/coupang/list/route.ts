import { NextRequest, NextResponse } from 'next/server';
import { Client } from '@notionhq/client';

const notion = new Client({ auth: process.env.NOTION_API_KEY });

const rawId = process.env.NOTION_DATABASE_ID!;
const dataSourceId = rawId.includes('-')
  ? rawId
  : rawId.replace(/^(.{8})(.{4})(.{4})(.{4})(.{12})$/, '$1-$2-$3-$4-$5');

export async function GET(request: NextRequest) {
  const password = request.headers.get('x-admin-password');
  if (password !== process.env.ADMIN_PASSWORD) {
    return NextResponse.json({ error: '인증 실패' }, { status: 401 });
  }

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

    const products = allResults.map((page: any) => ({
      id: page.id,
      name: page.properties.Name?.title?.[0]?.plain_text ?? '',
      category: page.properties.카테고리?.select?.name ?? '',
      image: page.properties.이미지?.url ?? '',
      price: page.properties.가격?.rich_text?.[0]?.plain_text ?? '',
      isRocket: page.properties.로켓배송?.checkbox ?? false,
      isFreeShipping: page.properties.무료배송?.checkbox ?? false,
      badge: page.properties.뱃지?.select?.name ?? '',
    }));

    return NextResponse.json({ products });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}