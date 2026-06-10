import WishlistClient from './WishlistClient';
import { Client } from '@notionhq/client';
import { unstable_cache } from 'next/cache';

const notion = new Client({ auth: process.env.NOTION_API_KEY });
const rawId = process.env.NOTION_DATABASE_ID!;
const dbId = rawId.includes('-') ? rawId : rawId.replace(/^(.{8})(.{4})(.{4})(.{4})(.{12})$/, '$1-$2-$3-$4-$5');

const getProducts = unstable_cache(
  async () => {
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
      price: page.properties.가격?.rich_text?.[0]?.plain_text ?? '',
      slug: page.properties.슬러그?.rich_text?.[0]?.plain_text ?? '',
    }));
  },
  ['wishlist-products'],
  { revalidate: 3600 }
);

export default async function WishlistPage() {
  const products = await getProducts();
  return <WishlistClient products={products} />;
}