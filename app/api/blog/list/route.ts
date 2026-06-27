import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const pw = req.headers.get('x-admin-password');
  if (pw !== process.env.ADMIN_PASSWORD) return NextResponse.json({ error: '401' }, { status: 401 });

  const rawId = process.env.NOTION_BLOG_DATABASE_ID!;
  const dbId = rawId.includes('-') ? rawId : rawId.replace(/^(.{8})(.{4})(.{4})(.{4})(.{12})$/, '$1-$2-$3-$4-$5');

  const res = await fetch(`https://api.notion.com/v1/databases/${dbId}/query`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.NOTION_API_KEY}`,
      'Notion-Version': '2022-06-28',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ sorts: [{ property: '발행일', direction: 'descending' }], page_size: 100 }),
  });

  const data = await res.json();
  if (!res.ok) return NextResponse.json({ error: data.message }, { status: 500 });

  const posts = data.results.map((page: any) => ({
    id: page.id,
    title: page.properties.이름?.title?.[0]?.plain_text ?? '',
    slug: page.properties.슬러그?.rich_text?.[0]?.plain_text ?? '',
    category: page.properties.카테고리?.select?.name ?? '',
    thumbnail: page.properties.썸네일?.url ?? '',
    productSlug: page.properties.제품슬러그?.rich_text?.[0]?.plain_text ?? '',
    content: page.properties.본문?.rich_text?.[0]?.plain_text ?? '',
    published: page.properties.공개?.checkbox ?? false,
  }));

  return NextResponse.json({ posts });
}