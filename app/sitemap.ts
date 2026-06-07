import { MetadataRoute } from 'next';
import { Client } from '@notionhq/client';

const notion = new Client({ auth: process.env.NOTION_API_KEY });

const rawId = process.env.NOTION_DATABASE_ID!;
const dataSourceId = rawId.includes('-')
  ? rawId
  : rawId.replace(/^(.{8})(.{4})(.{4})(.{4})(.{12})$/, '$1-$2-$3-$4-$5');

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  let allResults: any[] = [];
  let cursor: string | undefined = undefined;

  do {
    const response = await notion.dataSources.query({
      data_source_id: dataSourceId,
      start_cursor: cursor,
      page_size: 100,
    });
    allResults = [...allResults, ...response.results];
    cursor = response.has_more ? response.next_cursor ?? undefined : undefined;
  } while (cursor);

 const productUrls = allResults.map((page: any) => {
  const slug = page.properties.슬러그?.rich_text?.[0]?.plain_text;
  return {
    url: `https://premy.co.kr/products/${slug || page.id}`,
    lastModified: new Date(),
    changeFrequency: 'daily' as const,
    priority: 0.8,
  };
});

  return [
    {
      url: 'https://premy.co.kr',
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 1,
    },
    ...productUrls,
  ];
}