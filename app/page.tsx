import { Client } from "@notionhq/client";

export const dynamic = 'force-dynamic';

const notion = new Client({ auth: process.env.NOTION_API_KEY });

const rawId = process.env.NOTION_DATABASE_ID!;
const dbId = rawId.includes('-')
  ? rawId
  : rawId.replace(/^(.{8})(.{4})(.{4})(.{4})(.{12})$/, '$1-$2-$3-$4-$5');

async function getProducts() {
  const response = await notion.dataSources.query({ data_source_id: dbId });
  return response.results.map((page: any) => ({
    id: page.id,
    name: page.properties.Name?.title?.[0]?.plain_text ?? '',
    category: page.properties.카테고리?.select?.name ?? '',
    image: page.properties.이미지?.url ?? '',
    link: page.properties.쿠팡링크?.url ?? '',
    desc: page.properties.설명?.rich_text?.[0]?.plain_text ?? '',
    badge: page.properties.뱃지?.select?.name ?? '',
    price: page.properties.가격?.rich_text?.[0]?.plain_text ?? '',
  }));
}

export default async function Home() {
  const products = await getProducts();

  return (
    <main style={{ fontFamily: 'sans-serif', background: '#fff', minHeight: '100vh' }}>
      {/* 헤더 */}
      <header style={{ background: '#fff', borderBottom: '1px solid #E8D5A0', padding: '0 1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '64px' }}>
        <div>
          <span style={{ fontSize: '22px', fontWeight: 700, letterSpacing: '-1px' }}>
            Pre<span style={{ color: '#B8860B' }}>my</span>
          </span>
          <div style={{ fontSize: '9px', color: '#B8860B', letterSpacing: '2px' }}>PREMIUM CURATION</div>
        </div>
      </header>

      {/* 히어로 */}
      <section style={{ background: 'linear-gradient(135deg, #FDF8EE 0%, #fff 60%)', padding: '3rem 1.5rem 2.5rem', textAlign: 'center', borderBottom: '1px solid #E8D5A0' }}>
        <div style={{ display: 'inline-block', background: '#fff', color: '#B8860B', fontSize: '11px', padding: '4px 14px', borderRadius: '20px', border: '1px solid #E8D5A0', marginBottom: '1rem', letterSpacing: '1px' }}>
          ✦ PREMIUM PICK
        </div>
        <h1 style={{ fontSize: '28px', fontWeight: 700, color: '#1a1a1a', marginBottom: '0.5rem', letterSpacing: '-1px', lineHeight: 1.3 }}>
          가치 있는 소비를 위한<br />
          <span style={{ color: '#B8860B' }}>프리미엄 가전</span> 큐레이션
        </h1>
        <p style={{ color: '#888', fontSize: '14px' }}>직접 선별한 고가 IT·가전 제품만 모았습니다</p>
      </section>

      {/* 상품 그리드 */}
      <section style={{ padding: '1.5rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1rem' }}>
          {products.map((p) => {
            const badgeStyle: React.CSSProperties = {
              position: 'absolute', top: '8px', left: '8px',
              fontSize: '10px', fontWeight: 700, padding: '2px 7px', borderRadius: '4px',
              background: p.badge === 'NEW' ? '#B8860B' : '#e74c3c', color: '#fff'
            };
            const cardStyle: React.CSSProperties = {
              background: '#fff', border: '1px solid #eee', borderRadius: '12px',
              overflow: 'hidden', textDecoration: 'none', display: 'block',
              position: 'relative', transition: 'all 0.2s'
            };
            return (
              <a key={p.id} href={p.link} target="_blank" rel="noopener noreferrer" style={cardStyle}>
                {p.badge && <span style={badgeStyle}>{p.badge}</span>}
                {p.image ? (
                  <img src={p.image} alt={p.name} style={{ width: '100%', aspectRatio: '1', objectFit: 'cover' }} />
                ) : (
                  <div style={{ background: '#FDF8EE', aspectRatio: '1', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '48px' }}>🛒</div>
                )}
                <div style={{ padding: '0.875rem' }}>
                  {p.category && <div style={{ fontSize: '10px', color: '#B8860B', fontWeight: 600, letterSpacing: '0.5px', textTransform: 'uppercase', marginBottom: '3px' }}>{p.category}</div>}
                  <div style={{ fontSize: '13px', color: '#1a1a1a', fontWeight: 500, marginBottom: '4px', lineHeight: 1.4 }}>{p.name}</div>
                  {p.desc && <div style={{ fontSize: '11px', color: '#aaa', lineHeight: 1.5, marginBottom: '0.5rem' }}>{p.desc}</div>}
                  {p.price && <div style={{ fontSize: '14px', color: '#1a1a1a', fontWeight: 700 }}>{p.price}</div>}
                </div>
              </a>
            );
          })}
        </div>
      </section>

      {/* 푸터 */}
      <footer style={{ background: '#1a1a1a', padding: '1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1.5rem', flexWrap: 'wrap' }}>
        <div>
          <div style={{ fontSize: '16px', fontWeight: 700, color: '#fff' }}>Pre<span style={{ color: '#B8860B' }}>my</span></div>
          <div style={{ color: '#444', fontSize: '11px', marginTop: '2px' }}>© 2026 Premy. All rights reserved.</div>
        </div>
        <p style={{ color: '#555', fontSize: '11px', lineHeight: 1.7, maxWidth: '520px' }}>
          본 사이트는 쿠팡 파트너스 제휴 마케팅 프로그램에 참여하고 있으며, 링크를 통해 구매 시 일정 수수료를 받을 수 있습니다. 단, 구매자에게 추가 비용이 발생하지 않습니다. 상품 가격 및 재고 정보는 실시간으로 변동될 수 있으며, 최종 가격은 쿠팡에서 확인하시기 바랍니다.
        </p>
      </footer>
    </main>
  );
}