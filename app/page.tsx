import { Client } from '@notionhq/client';

// 1. SDK 타입 문제 원천 차단
const notion = new Client({ auth: process.env.NOTION_API_KEY });

async function getProducts() {
  const databaseId = process.env.NOTION_DATABASE_ID;
  if (!databaseId) return [];

  try {
    // 2. any 타입 강제 변환으로 컴파일 에러 완전 삭제
    const response = await (notion.databases as any).query({
      database_id: databaseId,
    });
    return response.results;
  } catch (error) {
    console.error("Notion 에러:", error);
    return [];
  }
}

// app/page.tsx
export default async function Home() {
  const notion = new Client({ auth: process.env.NOTION_API_KEY });
  let errorMsg = "";
  let products: any[] = [];

  try {
    const response = await (notion.databases as any).query({
      database_id: process.env.NOTION_DATABASE_ID!,
    });
    products = response.results;
  } catch (e: any) {
    errorMsg = e.message; // 에러 메시지를 캡처합니다
  }

  return (
    <main className="p-10">
      {errorMsg ? (
        <div className="text-red-500">에러 발생: {errorMsg}</div>
      ) : (
        <h1>상품 리스트 ({products.length}개)</h1>
      )}
    </main>
  );
}