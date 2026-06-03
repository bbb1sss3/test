import { Client } from "@notionhq/client";

export const dynamic = 'force-dynamic';

export default async function Home() {
  // 1. 환경 변수 확인
  console.log("API KEY 확인:", process.env.NOTION_API_KEY ? "정상" : "비어있음");
  console.log("DB ID 확인:", process.env.NOTION_DATABASE_ID);

  const notion = new Client({ auth: process.env.NOTION_API_KEY });

  // 하이픈 없는 32자리 ID를 하이픈 포함 UUID 형식으로 자동 변환
  const rawId = process.env.NOTION_DATABASE_ID!;
  const dbId = rawId.includes('-') 
    ? rawId 
    : rawId.replace(/^(.{8})(.{4})(.{4})(.{4})(.{12})$/, '$1-$2-$3-$4-$5');

  try {
    // 2. 변환된 dbId로 쿼리 실행
    const response = await (notion.databases as any).query({
      database_id: dbId,
    });
    
    console.log("데이터 조회 성공!");
    return <main>{JSON.stringify(response.results)}</main>;
  } catch (e: any) {
    console.error("API 에러 발생:", e.message);
    return <main>에러: {e.message}</main>;
  }
}