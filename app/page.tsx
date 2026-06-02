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

export default async function Home() {
  const products = await getProducts();

  return (
    <main className="p-10">
      <h1 className="text-2xl font-bold mb-5">상품 리스트 ({products.length}개 발견)</h1>
      <div className="grid gap-4">
        {products.map((p: any) => (
          <div key={p.id} className="border p-4 rounded shadow bg-gray-50">
            {/* 3. 데이터가 안 뜨면 아래 JSON을 보고 컬럼명을 수정하세요 */}
            <h2 className="font-bold text-lg">
              {p.properties.Name?.title?.[0]?.plain_text || "이름 속성 없음"}
            </h2>
            <pre className="text-[10px] text-gray-500 mt-2 overflow-x-auto">
              {JSON.stringify(p.properties, null, 2)}
            </pre>
          </div>
        ))}
      </div>
    </main>
  );
}