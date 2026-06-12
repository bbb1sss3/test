import { NextRequest, NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

export async function POST(req: NextRequest) {
  const adminPw = req.headers.get('x-admin-password');
  if (adminPw !== process.env.ADMIN_PASSWORD) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { productName, category, price } = await req.json();

  const prompt = `당신은 가전/제품 리뷰 전문 에디터입니다. 다음 상품의 쇼핑몰 상세페이지 콘텐츠를 작성하세요.

상품명: ${productName}
카테고리: ${category}
가격대: ${price}

작성 원칙:
- 가격, 할인율, 원가는 절대 언급하지 말 것 (변동되는 정보)
- 실제 사용 경험이 있는 것처럼, 구체적이고 신뢰감 있는 톤
- 모호한 칭찬("좋아요", "추천해요") 대신 구체적 근거 제시
- 상품명에 포함된 모델명/스펙(용량, 사이즈, 출력 등)을 본문에 자연스럽게 3-4회 반복 (SEO 키워드)
- 이모지(✅❌🔥⭐ 등) 사용하지 말 것

desc 작성 규칙:
- 다음 5개 섹션을 ## 헤딩으로 구분: "핵심 특징", "상세 스펙", "장단점", "이런 분께 추천", "자주 묻는 질문"
- "핵심 특징": 제품의 핵심 가치를 2-3문장으로
- "상세 스펙": 주요 스펙을 - 리스트로 3-5개
- "장단점": ### 장점, ### 단점으로 구분. 장점 3개, 단점 최소 2개를 각각 - 리스트로
- "이런 분께 추천": "추천:"으로 시작하는 문단과 "비추천:"으로 시작하는 문단을 빈 줄로 구분해서 작성
- "자주 묻는 질문": Q&A 2개. "**Q. 질문내용**" 다음 줄에 답변 2-3문장
- 모든 섹션/단락 사이에는 실제 줄바꿈(\\n\\n)을 넣을 것. 절대 한 줄로 이어쓰지 말 것
- 전체 800자 이상

아래 JSON 형식으로만 응답. 다른 텍스트, 코드블록 표시 없이 순수 JSON만:

{
  "slug": "영문 소문자와 하이픈으로 구성된 SEO 슬러그. 브랜드-제품명-모델명-주요특징 순서. 예: winix-tower-edge-at8e430-msk-13py-air-purifier",
  "desc": "위 규칙에 따른 마크다운 본문",
  "hanmadi": "에디터의 솔직한 한마디. 친근한 ~요체. 실사용 경험을 암시하는 구체적 디테일 1개 포함. 2문장",
  "tag": "#태그1,#태그2,#태그3,#태그4,#태그5 - 실제 검색될만한 구체적 키워드 위주",
  "compare": "항목|이 제품|경쟁모델A|경쟁모델B 형식. 4-5행. 가격 항목은 제외"
}`;

  try {
    const response = await anthropic.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 3000,
      messages: [{ role: 'user', content: prompt }],
    });

    const textBlock = response.content.find(b => b.type === 'text');
    const text = textBlock && 'text' in textBlock ? textBlock.text : '';

    const cleaned = text.replace(/```json|```/g, '').trim();
    const parsed = JSON.parse(cleaned);

    return NextResponse.json(parsed);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}