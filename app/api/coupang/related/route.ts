import { NextRequest, NextResponse } from 'next/server';
import { Client } from '@notionhq/client';

const notion = new Client({ auth: process.env.NOTION_API_KEY });
const rawId = process.env.NOTION_DATABASE_ID ?? '';
const dbId = rawId.includes('-') ? rawId : rawId.replace(/^(.{8})(.{4})(.{4})(.{4})(.{12})$/, '$1-$2-$3-$4-$5');

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get('category') || '';
  const currentId = searchParams.get('currentId') || '';

  const response = await notion.dataSources.query({
    data_source_id: dbId,
    filter: {
      property: '카테고리',
      select: { equals: category },
    },
    sorts: [{ timestamp: 'created_time', direction: 'descending' }],
  });

  const related = response.results
    .map((page: any) => ({
      id: page.id,
      name: page.properties.Name?.title?.[0]?.plain_text ?? '',
      category: page.properties.카테고리?.select?.name ?? '',
      image: page.properties.이미지?.url ?? '',
      price: page.properties.가격?.rich_text?.[0]?.plain_text ?? '',
      slug: page.properties.슬러그?.rich_text?.[0]?.plain_text ?? '',
    }))
    .filter((p: any) => p.id !== currentId)
    .slice(0, 4);

  return NextResponse.json(related);
}