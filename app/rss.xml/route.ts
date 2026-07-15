import { NextResponse } from 'next/server';
import { Client } from '@notionhq/client';

const notion = new Client({ auth: process.env.NOTION_API_KEY });

const rawId = process.env.NOTION_DATABASE_ID!;
const dbId = rawId.includes('-')
  ? rawId
  : rawId.replace(/^(.{8})(.{4})(.{4})(.{4})(.{12})$/, '$1-$2-$3-$4-$5');

async function getProducts() {
  let allResults: any[] = [];
  let cursor: string | undefined = undefined;

  do {
    const response: any = await notion.dataSources.query({
      data_source_id: dbId,
      start_cursor: cursor,
      page_size: 100,
    });
    allResults = [...allResults, ...response.results];
    cursor = response.has_more ? response.next_cursor ?? undefined : undefined;
  } while (cursor);

  return allResults.map((page: any) => ({
    name: page.properties.Name?.title?.[0]?.plain_text ?? '',
    desc: page.properties.설명?.rich_text?.[0]?.plain_text ?? '',
    slug: page.properties.슬러그?.rich_text?.[0]?.plain_text ?? '',
  }));
}

export async function GET() {
  const products = await getProducts();

  const items = products
    .filter((p) => p.slug) // 슬러그 없는 건 링크 생성 불가하니 제외
    .slice(0, 50)
    .map((p) => {
      const url = `https://premy.co.kr/products/${p.slug}`;
      return `
    <item>
      <title><![CDATA[${p.name}]]></title>
      <link>${url}</link>
      <guid>${url}</guid>
      <description><![CDATA[${p.desc}]]></description>
    </item>`;
    })
    .join('');

  const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>premy.co.kr</title>
    <link>https://premy.co.kr</link>
    <description>프리미엄 제품 큐레이션</description>
    <language>ko-kr</language>
    ${items}
  </channel>
</rss>`;

  return new NextResponse(rss, {
    headers: { 'Content-Type': 'application/xml; charset=utf-8' },
  });
}