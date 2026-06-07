import ProductGrid from "./Productgrid";

export const revalidate = 3600;

export const metadata = {
  title: 'Premy(프리미) - 프리미엄 가전 큐레이션',
  description: '노트북·냉장고·TV·청소기 등 프리미엄 가전을 직접 선별해 장단점과 타사 비교까지 정리했습니다.',
  keywords: '노트북추천,냉장고추천,TV추천,청소기추천,프리미엄가전,가전큐레이션',
};

import { Client } from "@notionhq/client";

const notion = new Client({ auth: process.env.NOTION_API_KEY });

const rawId = process.env.NOTION_DATABASE_ID!;
const dbId = rawId.includes('-')
  ? rawId
  : rawId.replace(/^(.{8})(.{4})(.{4})(.{4})(.{12})$/, '$1-$2-$3-$4-$5');
  

async function getProducts() {
  let allResults: any[] = [];
  let cursor: string | undefined = undefined;

  do {
    const response = await notion.dataSources.query({
      data_source_id: dbId,
      start_cursor: cursor,
      page_size: 100,
    });
    allResults = [...allResults, ...response.results];
    cursor = response.has_more ? response.next_cursor ?? undefined : undefined;
  } while (cursor);

  return allResults.map((page: any) => ({
    id: page.id,
    name: page.properties.Name?.title?.[0]?.plain_text ?? '',
    category: page.properties.카테고리?.select?.name ?? '',
    image: page.properties.이미지?.url ?? '',
    link: page.properties.쿠팡링크?.url ?? '',
    desc: page.properties.설명?.rich_text?.[0]?.plain_text ?? '',
    badge: page.properties.뱃지?.select?.name ?? '',
    price: page.properties.가격?.rich_text?.[0]?.plain_text ?? '',
    discount: page.properties.할인율?.rich_text?.[0]?.plain_text ?? '',
    rating: page.properties.별점?.rich_text?.[0]?.plain_text ?? '',
    originalPrice: page.properties.원가?.rich_text?.[0]?.plain_text ?? '',
    hanmadi: page.properties.한마디?.rich_text?.[0]?.plain_text ?? '',
    tag: page.properties.태그?.rich_text?.[0]?.plain_text ?? '',
    compare: page.properties.비교?.rich_text?.[0]?.plain_text ?? '',
     slug: page.properties.슬러그?.rich_text?.[0]?.plain_text ?? '',
  }));
}

export default async function Home() {
  const products = await getProducts();
  return (
    <div>
      <ProductGrid products={products} />
    </div>
  );
}