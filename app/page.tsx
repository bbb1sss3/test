import { Client } from "@notionhq/client";
import ProductGrid from "./Productgrid";

export const dynamic = 'force-dynamic';

const notion = new Client({ auth: process.env.NOTION_API_KEY });

const rawId = process.env.NOTION_DATABASE_ID!;
const dbId = rawId.includes('-')
  ? rawId
  : rawId.replace(/^(.{8})(.{4})(.{4})(.{4})(.{12})$/, '$1-$2-$3-$4-$5');

async function getProducts() {
  const response = await notion.dataSources.query({ data_source_id: dbId });
  return response.results.map((page: any) => ({
    id: page.id,
    name: page.properties.Name?.title?.[0]?.plain_text ?? '',
    category: page.properties.카테고리?.select?.name ?? '',
    image: page.properties.이미지?.url ?? '',
    link: page.properties.쿠팡링크?.url ?? '',
    desc: page.properties.설명?.rich_text?.[0]?.plain_text ?? '',
    badge: page.properties.뱃지?.select?.name ?? '',
    price: page.properties.가격?.rich_text?.[0]?.plain_text ?? '',
  }));
}

export default async function Home() {
  const products = await getProducts();
  return <ProductGrid products={products} />;
}