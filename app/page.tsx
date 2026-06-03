import { Client } from "@notionhq/client";

export const dynamic = 'force-dynamic';

export default async function Home() {
  const notion = new Client({ auth: process.env.NOTION_API_KEY });

  const rawId = process.env.NOTION_DATABASE_ID!;
  const dbId = rawId.includes('-')
    ? rawId
    : rawId.replace(/^(.{8})(.{4})(.{4})(.{4})(.{12})$/, '$1-$2-$3-$4-$5');

  try {
    const response = await notion.dataSources.query({
      data_source_id: dbId,
    });

    console.log("데이터 조회 성공!");
    return <main>{JSON.stringify(response.results)}</main>;
  } catch (e: any) {
    console.error("에러 발생:", e.message);
    return <main>에러: {e.message}</main>;
  }
}