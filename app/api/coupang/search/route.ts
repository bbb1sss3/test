import { NextRequest, NextResponse } from 'next/server';
import { searchProducts } from '@/lib/coupang';

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
    return NextResponse.json({ products });
  } catch (error: any) {
    if (error.message === 'API_RATE_LIMIT') {
      return NextResponse.json({ error: 'API 호출 한도 초과. 잠시 후 다시 시도하세요.' }, { status: 429 });
    }
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}