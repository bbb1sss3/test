import { NextRequest, NextResponse } from 'next/server';
import { Client } from '@notionhq/client';
import { unstable_cache } from 'next/cache';

const notion = new Client({ auth: process.env.NOTION_API_KEY });
const rawId = process.env.NOTION_DATABASE_ID!;
const dbId = rawId.includes('-')
  ? rawId
  : rawId.replace(/^(.{8})(.{4})(.{4})(.{4})(.{12})$/, '$1-$2-$3-$4-$5');

async function fetchCategories() {
  const dataSource: any = await notion.dataSources.retrieve({ data_source_id: dbId });
  const options = dataSource.properties?.['카테고리']?.select?.options || [];
  return options.map((o: any) => o.name);
}

const getCategoriesAdmin = unstable_cache(fetchCategories, ['categories-admin'], { revalidate: 60 });
const getCategoriesPublic = unstable_cache(fetchCategories, ['categories-public'], { revalidate: 3600 });

export async function GET(request: NextRequest) {
  const password = request.headers.get('x-admin-password');
  const isAdmin = password === process.env.ADMIN_PASSWORD;

  try {
    const categories = isAdmin ? await getCategoriesAdmin() : await getCategoriesPublic();
    return NextResponse.json({ categories });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}