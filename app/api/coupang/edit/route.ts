import { NextRequest, NextResponse } from 'next/server';
import { Client } from '@notionhq/client';

const notion = new Client({ auth: process.env.NOTION_API_KEY });

export async function POST(request: NextRequest) {
  const password = request.headers.get('x-admin-password');
  if (password !== process.env.ADMIN_PASSWORD) {
    return NextResponse.json({ error: '인증 실패' }, { status: 401 });
  }

  const { pageId, form } = await request.json();

  try {
    await notion.pages.update({
      page_id: pageId,
      properties: {
        카테고리: form.category ? { select: { name: form.category } } : undefined,
        가격: { rich_text: [{ text: { content: form.price || '' } }] },
        원가: { rich_text: [{ text: { content: form.originalPrice || '' } }] },
        할인율: { rich_text: [{ text: { content: form.discount || '' } }] },
        별점: { rich_text: [{ text: { content: form.rating || '' } }] },
        설명: { rich_text: [{ text: { content: form.desc || '' } }] },
        한마디: { rich_text: [{ text: { content: form.hanmadi || '' } }] },
        태그: { rich_text: [{ text: { content: form.tag || '' } }] },
        비교: { rich_text: [{ text: { content: form.compare || '' } }] },
        ...(form.badge !== undefined ? { 뱃지: form.badge ? { select: { name: form.badge } } : { select: null } } : {}),
      } as any,
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}