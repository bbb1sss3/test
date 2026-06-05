import ProductGrid from "./Productgrid";

export const revalidate = 600;

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