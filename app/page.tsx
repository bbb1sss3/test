import { Client } from '@notionhq/client';


const notion = new Client({ auth: process.env.NOTION_API_KEY });

async function getProducts() {
  const databaseId = process.env.NOTION_DATABASE_ID;
  if (!databaseId) return [];

// 기존 코드 대신 아래 코드로 변경
const response = await (notion.databases as any).query({
  database_id: databaseId,
});
  return response.results;
}

export default async function Home() {
  const products = await getProducts();

  return (
    <main className="p-10">
      <h1 className="text-2xl font-bold mb-5">상품 리스트</h1>
      <div className="grid gap-4">
        {products.map((p: any) => (
          <div key={p.id} className="border p-4 rounded shadow">
            {/* 'Name' 컬럼을 가져옵니다. 본인 노션 컬럼명에 맞춰 수정하세요 */}
            {p.properties.Name?.title[0]?.plain_text}
          </div>
        ))}
      </div>
    </main>
  );
}