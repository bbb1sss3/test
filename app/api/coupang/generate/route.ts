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
- 상품명에 포함된 모델명/스펙(용량, 사이즈, 출력 등)을 자연스럽게 본문에 반복 언급 (SEO 키워드)
- 장점뿐 아니라 실제 단점/한계도 1-2개 포함 (신뢰도 상승)
- "이런 사람에게 추천" / "이런 사람은 비추천" 형태로 타겟 명확화

아래 JSON 형식으로만 응답. 다른 텍스트 없이 JSON만:

{
  "desc": "마크다운 형식. ## 헤딩으로 섹션 구분 (예: ## 핵심 특징, ## 장단점, ## 이런 분께 추천). 모델명/스펙 키워드를 자연스럽게 2-3회 반복. 400자 이상. 단점 1-2개 포함",
  "hanmadi": "에디터의 솔직한 한마디. 친근한 ~요체. 실사용 경험을 암시하는 구체적 디테일 1개 포함. 2문장",
  "tag": "#태그1,#태그2,#태그3,#태그4,#태그5 - 실제 검색될만한 구체적 키워드 위주",
  "compare": "항목|이 제품|경쟁모델A|경쟁모델B 형식. 4-5행. 항목은 실제 차별점이 드러나는 것으로 (가격 항목은 제외)"
}`;

  try {
    const response = await anthropic.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 2000,
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