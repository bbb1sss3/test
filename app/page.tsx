import { Client } from "@notionhq/client";

export default async function Home() {
  const notion = new Client({ auth: process.env.NOTION_API_KEY });

  let products: any[] = [];
  try {
    // 껍데기(databases.query) 대신 직접 API 요청을 보냄
    const response = await notion.request({
      path: `databases/${process.env.NOTION_DATABASE_ID}/query`,
      method: "post",
    }) as any;
    
    products = response.results;
  } catch (error) {
    console.error("에러 발생:", error);
  }

  return (
    <main className="p-10">
      <h1>상품 리스트 ({products.length}개 발견)</h1>
      <ul>
        {products.map((p: any) => (
          <li key={p.id}>
            {/* 노션 DB 속성 이름이 'Name'이라고 가정 */}
            {p.properties?.Name?.title?.[0]?.plain_text || "이름 없음"}
          </li>
        ))}
      </ul>
    </main>
  );
}