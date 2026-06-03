import { Client } from "@notionhq/client";

export const dynamic = 'force-dynamic';

export default async function Home() {
  const notion = new Client({ auth: process.env.NOTION_API_KEY });

  try {
    const response = await notion.search({
      query: "쿠팡목록",
      filter: { property: "object", value: "data_source" }
    });

    console.log("검색 결과:", JSON.stringify(response.results.map((r: any) => ({ id: r.id, title: r.title }))));
    return <main>{JSON.stringify(response.results.map((r: any) => ({ id: r.id, title: r.title })))}</main>;
  } catch (e: any) {
    console.error("에러 발생:", e.message);
    return <main>에러: {e.message}</main>;
  }
}