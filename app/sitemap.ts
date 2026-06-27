import { MetadataRoute } from 'next';
import { Client } from '@notionhq/client';

const notion = new Client({ auth: process.env.NOTION_API_KEY });

const rawId = process.env.NOTION_DATABASE_ID!;
const dbId = rawId.includes('-')
  ? rawId
  : rawId.replace(/^(.{8})(.{4})(.{4})(.{4})(.{12})$/, '$1-$2-$3-$4-$5');

const rawBlogId = process.env.NOTION_BLOG_DATABASE_ID!;
const blogDbId = rawBlogId.includes('-')
  ? rawBlogId
  : rawBlogId.replace(/^(.{8})(.{4})(.{4})(.{4})(.{12})$/, '$1-$2-$3-$4-$5');

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // 제품
  let productResults: any[] = [];
  let cursor: string | undefined = undefined;
  do {
    const response = await notion.dataSources.query({
      data_source_id: dbId,
      start_cursor: cursor,
      page_size: 100,
    });
    productResults = [...productResults, ...response.results];
    cursor = response.has_more ? response.next_cursor ?? undefined : undefined;
  } while (cursor);

  const productUrls = productResults.map((page: any) => {
    const slug = page.properties.슬러그?.rich_text?.[0]?.plain_text;
    return {
      url: `https://premy.co.kr/products/${slug || page.id}`,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 0.8,
    };
  });

  // 블로그
  let blogUrls: MetadataRoute.Sitemap = [];
  try {
    let blogResults: any[] = [];
    let blogCursor: string | undefined = undefined;
    do {
      const response: any = await (notion as any).databases.query({
        database_id: blogDbId,
        filter: { property: '공개', checkbox: { equals: true } },
        start_cursor: blogCursor,
        page_size: 100,
      });
      blogResults = [...blogResults, ...response.results];
      blogCursor = response.has_more ? response.next_cursor ?? undefined : undefined;
    } while (blogCursor);

    blogUrls = blogResults.map((page: any) => {
      const slug = page.properties.슬러그?.rich_text?.[0]?.plain_text;
      return {
        url: `https://premy.co.kr/blog/${slug || page.id}`,
        lastModified: new Date(),
        changeFrequency: 'weekly' as const,
        priority: 0.7,
      };
    });
  } catch (e) {
    console.warn('블로그 sitemap 생성 실패:', e);
  }

  return [
    { url: 'https://premy.co.kr', lastModified: new Date(), changeFrequency: 'daily' as const, priority: 1 },
    { url: 'https://premy.co.kr/blog', lastModified: new Date(), changeFrequency: 'daily' as const, priority: 0.9 },
    ...productUrls,
    ...blogUrls,
  ];
}