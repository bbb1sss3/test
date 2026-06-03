import { Client } from "@notionhq/client";
import React from "react";

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

  const css = `
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: 'Apple SD Gothic Neo', 'Noto Sans KR', Arial, sans-serif; background: #fafaf8; }
    .header { position: sticky; top: 0; z-index: 100; background: rgba(255,255,255,0.95); backdrop-filter: blur(8px); border-bottom: 1px solid #e8d5a0; padding: 0 2.5rem; display: flex; align-items: center; justify-content: space-between; height: 68px; }
    .logo-wrap { display: flex; flex-direction: column; gap: 1px; }
    .logo { font-size: 24px; font-weight: 800; letter-spacing: -1.5px; color: #1a1a1a; }
    .logo em { color: #b8860b; font-style: normal; }
    .logo-sub { font-size: 8px; color: #b8860b; letter-spacing: 3px; font-weight: 500; }
    .nav { display: flex; gap: 2rem; }
    .nav a { color: #999; font-size: 13px; text-decoration: none; cursor: pointer; letter-spacing: 0.3px; transition: color 0.2s; font-weight: 400; }
    .nav a:hover { color: #b8860b; }
    .hero { background: linear-gradient(160deg, #fdf8ee 0%, #fffdf7 40%, #ffffff 100%); padding: 5rem 2.5rem 4rem; text-align: center; border-bottom: 1px solid #f0e5c0; position: relative; overflow: hidden; }
    .hero::before { content: ''; position: absolute; top: -80px; right: -80px; width: 400px; height: 400px; border-radius: 50%; background: radial-gradient(circle, rgba(184,134,11,0.06) 0%, transparent 70%); }
    .hero-tag { display: inline-flex; align-items: center; gap: 8px; background: #fff; color: #b8860b; font-size: 11px; padding: 6px 18px; border-radius: 30px; border: 1px solid #e8d5a0; margin-bottom: 1.5rem; letter-spacing: 2px; font-weight: 600; box-shadow: 0 2px 12px rgba(184,134,11,0.08); }
    .hero h1 { font-size: 40px; font-weight: 800; color: #1a1a1a; margin-bottom: 1rem; letter-spacing: -2px; line-height: 1.2; }
    .hero h1 em { color: #b8860b; font-style: normal; position: relative; }
    .hero p { color: #aaa; font-size: 15px; font-weight: 400; }
    .filter-wrap { background: #fff; padding: 1rem 2.5rem; border-bottom: 1px solid #f0f0f0; display: flex; gap: 0.5rem; overflow-x: auto; -webkit-overflow-scrolling: touch; scrollbar-width: none; }
    .filter-wrap::-webkit-scrollbar { display: none; }
    .filter-btn { background: #fff; color: #888; border: 1px solid #e8e8e8; padding: 7px 18px; border-radius: 30px; font-size: 12px; cursor: pointer; white-space: nowrap; transition: all 0.2s; font-weight: 500; flex-shrink: 0; }
    .filter-btn:hover { border-color: #b8860b; color: #b8860b; }
    .section { padding: 2.5rem; }
    .section-header { display: flex; align-items: center; gap: 12px; margin-bottom: 1.5rem; }
    .section-header h2 { font-size: 18px; font-weight: 700; color: #1a1a1a; letter-spacing: -0.5px; }
    .section-header span { font-size: 11px; color: #b8860b; background: #fdf8ee; padding: 3px 12px; border-radius: 20px; border: 1px solid #e8d5a0; letter-spacing: 1px; font-weight: 600; }
    .grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(220px, 1fr)); gap: 1.25rem; }
    .card { background: #fff; border: 1px solid #f0f0f0; border-radius: 16px; overflow: hidden; text-decoration: none; display: block; position: relative; transition: all 0.25s; }
    .card:hover { border-color: #e8d5a0; box-shadow: 0 12px 40px rgba(184,134,11,0.1); transform: translateY(-3px); }
    .card:active { transform: translateY(0); }
    .card-img { background: linear-gradient(135deg, #fdf8ee, #fff9f0); aspect-ratio: 1; display: flex; align-items: center; justify-content: center; font-size: 56px; overflow: hidden; }
    .card-img img { width: 100%; height: 100%; object-fit: cover; }
    .card-body { padding: 1rem 1.1rem 1.1rem; }
    .card-category { font-size: 10px; color: #b8860b; font-weight: 700; letter-spacing: 1px; text-transform: uppercase; margin-bottom: 5px; }
    .card-name { font-size: 14px; color: #1a1a1a; font-weight: 600; margin-bottom: 5px; line-height: 1.45; }
    .card-desc { font-size: 12px; color: #bbb; line-height: 1.5; margin-bottom: 0.75rem; }
    .card-price { font-size: 15px; color: #1a1a1a; font-weight: 800; letter-spacing: -0.5px; }
    .badge { position: absolute; top: 10px; left: 10px; font-size: 10px; font-weight: 800; padding: 3px 9px; border-radius: 6px; letter-spacing: 0.5px; }
    .badge-new { background: #b8860b; color: #fff; }
    .badge-hot { background: #e74c3c; color: #fff; }
    .empty { text-align: center; padding: 5rem 2rem; color: #ccc; font-size: 15px; }
    .footer { background: #111; padding: 2rem 2.5rem; display: flex; align-items: center; justify-content: space-between; gap: 2rem; flex-wrap: wrap; border-top: 1px solid #222; }
    .footer-logo { font-size: 18px; font-weight: 800; color: #fff; letter-spacing: -1px; }
    .footer-logo em { color: #b8860b; font-style: normal; }
    .footer-copy { color: #444; font-size: 11px; margin-top: 3px; }
    .footer-disc { color: #444; font-size: 11px; line-height: 1.8; max-width: 540px; }
    @media (max-width: 768px) {
      .header { padding: 0 1.25rem; }
      .nav { display: none; }
      .hero { padding: 3.5rem 1.25rem 3rem; }
      .hero h1 { font-size: 28px; }
      .filter-wrap { padding: 0.875rem 1.25rem; }
      .section { padding: 1.5rem 1.25rem; }
      .grid { grid-template-columns: repeat(2, 1fr); gap: 0.875rem; }
      .footer { padding: 1.5rem 1.25rem; flex-direction: column; align-items: flex-start; }
      .footer-disc { max-width: 100%; }
    }
  `;

  const categories = ['전체', '노트북', '데스크탑', '모니터', '냉장고', '세탁기/건조기', 'TV', '청소기', '에어컨', '안마의자', '공기청정기', '식기세척기'];
  const navMenus = ['전체', '노트북/PC', '냉장고', '세탁기', 'TV', '청소기', '가전'];

  return (
    <main style={{ background: '#fafaf8', minHeight: '100vh' }}>
      <style dangerouslySetInnerHTML={{ __html: css }} />

      {/* 헤더 */}
      <header className="header">
        <div className="logo-wrap">
          <span className="logo">Pre<em>my</em></span>
          <span className="logo-sub">PREMIUM CURATION</span>
        </div>
        <nav className="nav">
          {navMenus.map(menu => (
            <a key={menu}>{menu}</a>
          ))}
        </nav>
      </header>

      {/* 히어로 */}
      <section className="hero">
        <div className="hero-tag">✦ PREMIUM PICK</div>
        <h1>가치 있는 소비를 위한<br /><em>프리미엄 가전</em> 큐레이션</h1>
        <p>직접 선별한 고가 IT·가전 제품만 모았습니다</p>
      </section>

      {/* 필터바 */}
      <div className="filter-wrap">
        {categories.map(cat => (
          <button key={cat} className="filter-btn">{cat}</button>
        ))}
      </div>

      {/* 상품 그리드 */}
      <section className="section">
        <div className="section-header">
          <h2>추천 제품</h2>
          <span>PREMY PICK</span>
        </div>
        {products.length === 0 ? (
          <div className="empty">등록된 상품이 없습니다</div>
        ) : (
          <div className="grid">
            {products.map((p) => (
              <a key={p.id} href={p.link} target="_blank" rel="noopener noreferrer" className="card">
                {p.badge && (
                  <span className={`badge ${p.badge === 'NEW' ? 'badge-new' : 'badge-hot'}`}>
                    {p.badge}
                  </span>
                )}
                <div className="card-img">
                  {p.image
                    ? <img src={p.image} alt={p.name} />
                    : '🛒'
                  }
                </div>
                <div className="card-body">
                  {p.category && <div className="card-category">{p.category}</div>}
                  <div className="card-name">{p.name}</div>
                  {p.desc && <div className="card-desc">{p.desc}</div>}
                  {p.price && <div className="card-price">{p.price}</div>}
                </div>
              </a>
            ))}
          </div>
        )}
      </section>

      {/* 푸터 */}
      <footer className="footer">
        <div>
          <div className="footer-logo">Pre<em>my</em></div>
          <div className="footer-copy">© 2026 Premy. All rights reserved.</div>
        </div>
        <p className="footer-disc">
          본 사이트는 쿠팡 파트너스 제휴 마케팅 프로그램에 참여하고 있으며, 링크를 통해 구매 시 일정 수수료를 받을 수 있습니다. 단, 구매자에게 추가 비용이 발생하지 않습니다. 상품 가격 및 재고 정보는 실시간으로 변동될 수 있으며, 최종 가격은 쿠팡에서 확인하시기 바랍니다.
        </p>
      </footer>
    </main>
  );
}
