import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const pw = req.headers.get('x-admin-password');
  if (pw !== process.env.ADMIN_PASSWORD) return NextResponse.json({ error: '401' }, { status: 401 });

  const { pageId, blogForm } = await req.json();

  const res = await fetch(`https://api.notion.com/v1/pages/${pageId}`, {
    method: 'PATCH',
    headers: {
      'Authorization': `Bearer ${process.env.NOTION_API_KEY}`,
      'Notion-Version': '2022-06-28',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      properties: {
        이름: { title: [{ text: { content: blogForm.title } }] },
        슬러그: { rich_text: [{ text: { content: blogForm.slug } }] },
        카테고리: { select: { name: blogForm.category } },
        썸네일: { url: blogForm.thumbnail || null },
        제품슬러그: { rich_text: [{ text: { content: blogForm.productSlug || '' } }] },
        본문: { rich_text: [{ text: { content: blogForm.content } }] },
        공개: { checkbox: blogForm.published },
      },
    }),
  });

  const data = await res.json();
  if (!res.ok) return NextResponse.json({ error: data.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}