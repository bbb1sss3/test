'use client';

import { useState } from "react";

type Product = {
  id: string;
  name: string;
  category: string;
  image: string;
  link: string;
  desc: string;
  badge: string;
  price: string;
};

const css = `
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { font-family: 'Apple SD Gothic Neo', 'Noto Sans KR', sans-serif; background: #fff; color: #111; }
  .header { background: #fff; border-bottom: 1px solid #e8e8e8; padding: 0 2rem; display: flex; align-items: center; justify-content: space-between; height: 56px; position: sticky; top: 0; z-index: 100; }
  .logo { font-size: 22px; font-weight: 900; color: #111; letter-spacing: -1px; }
  .logo span { color: #e52c2c; }
  .nav { display: flex; gap: 1.5rem; }
  .nav a { color: #444; font-size: 13px; font-weight: 500; text-decoration: none; cursor: pointer; }
  .nav a:hover { color: #e52c2c; }
  .filter-wrap { background: #fff; padding: 0.75rem 2rem; border-bottom: 1px solid #f0f0f0; display: flex; gap: 0.5rem; overflow-x: auto; scrollbar-width: none; position: sticky; top: 56px; z-index: 99; }
  .filter-wrap::-webkit-scrollbar { display: none; }
  .filter-btn { background: #fff; color: #555; border: 1px solid #ddd; padding: 6px 16px; border-radius: 20px; font-size: 13px; font-weight: 500; cursor: pointer; white-space: nowrap; flex-shrink: 0; transition: all 0.15s; }
  .filter-btn.active { background: #e52c2c; color: #fff; border-color: #e52c2c; }
  .filter-btn:hover { background: #e52c2c; color: #fff; border-color: #e52c2c; }
  .banner { background: #fff5f5; padding: 1.5rem 2rem; border-bottom: 1px solid #ffe0e0; display: flex; align-items: center; justify-content: space-between; }
  .banner-text h2 { font-size: 22px; font-weight: 800; color: #111; letter-spacing: -0.5px; margin-bottom: 4px; }
  .banner-text h2 em { color: #e52c2c; font-style: normal; }
  .banner-text p { font-size: 13px; color: #888; }
  .banner-badge { background: #e52c2c; color: #fff; font-size: 12px; font-weight: 800; padding: 8px 20px; border-radius: 4px; white-space: nowrap; }
  .section { padding: 1.5rem 2rem 3rem; }
  .section-header { margin-bottom: 1rem; }
  .section-header h3 { font-size: 16px; font-weight: 800; color: #111; letter-spacing: -0.5px; }
  .grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 1.25rem; }
  .card { background: #fff; text-decoration: none; display: flex; flex-direction: column; position: relative; border: 1px solid #f0f0f0; border-radius: 8px; overflow: hidden; transition: box-shadow 0.2s; }
  .card:hover { box-shadow: 0 4px 16px rgba(0,0,0,0.1); }
  .card-img { aspect-ratio: 1; background: #f9f9f9; display: flex; align-items: center; justify-content: center; font-size: 56px; overflow: hidden; }
  .card-img img { width: 100%; height: 100%; object-fit: cover; }
  .card-body { padding: 12px; flex: 1; display: flex; flex-direction: column; }
  .card-category { font-size: 11px; color: #e52c2c; font-weight: 700; margin-bottom: 4px; }
  .card-name { font-size: 13px; color: #111; font-weight: 600; line-height: 1.45; margin-bottom: 4px; }
  .card-desc { font-size: 11px; color: #aaa; line-height: 1.5; flex: 1; margin-bottom: 10px; }
  .card-price { font-size: 16px; color: #111; font-weight: 900; letter-spacing: -0.5px; margin-bottom: 10px; }
  .card-cta { background: #e52c2c; color: #fff; border: none; width: 100%; padding: 9px; font-size: 13px; font-weight: 700; cursor: pointer; border-radius: 4px; text-align: center; display: block; text-decoration: none; }
  .badge { position: absolute; top: 8px; left: 8px; font-size: 10px; font-weight: 800; padding: 3px 8px; border-radius: 3px; z-index: 1; }
  .badge-new { background: #e52c2c; color: #fff; }
  .badge-hot { background: #ff6b00; color: #fff; }
  .empty { text-align: center; padding: 5rem 2rem; color: #ccc; font-size: 15px; }
  .footer { background: #f7f7f7; border-top: 1px solid #e8e8e8; padding: 1.25rem 2rem; display: flex; align-items: center; justify-content: space-between; gap: 2rem; flex-wrap: wrap; }
  .footer-logo { font-size: 16px; font-weight: 900; color: #111; letter-spacing: -1px; }
  .footer-logo span { color: #e52c2c; }
  .footer-copy { color: #aaa; font-size: 11px; margin-top: 2px; }
  .footer-disc { color: #aaa; font-size: 11px; line-height: 1.6; max-width: 480px; text-align: right; }
  @media (max-width: 768px) {
    .header { padding: 0 1rem; }
    .nav { display: none; }
    .filter-wrap { padding: 0.75rem 1rem; }
    .banner { padding: 1.25rem 1rem; flex-direction: column; align-items: flex-start; gap: 0.75rem; }
    .banner-text h2 { font-size: 18px; }
    .section { padding: 1.25rem 1rem 3rem; }
    .grid { grid-template-columns: repeat(2, 1fr); gap: 0.75rem; }
    .footer { padding: 1.25rem 1rem; flex-direction: column; align-items: flex-start; }
    .footer-disc { text-align: left; max-width: 100%; }
  }
`;

const categories = ['전체', '노트북', '데스크탑', '모니터', '냉장고', '세탁기/건조기', 'TV', '청소기', '에어컨', '안마의자', '공기청정기', '식기세척기'];
const navMenus = ['전체', '노트북/PC', '냉장고', '세탁기', 'TV', '청소기', '생활가전'];

export default function ProductGrid({ products }: { products: Product[] }) {
  const [active, setActive] = useState('전체');

  const filtered = active === '전체'
    ? products
    : products.filter(p => p.category === active);

  return (
    <main style={{ background: '#fff', minHeight: '100vh' }}>
      <style dangerouslySetInnerHTML={{ __html: css }} />

      {/* 헤더 */}
      <header className="header">
        <div className="logo">PRE<span>MY</span></div>
        <nav className="nav">
          {navMenus.map(menu => (
            <a key={menu}>{menu}</a>
          ))}
        </nav>
      </header>

      {/* 필터바 */}
      <div className="filter-wrap">
        {categories.map(cat => (
          <button
            key={cat}
            className={`filter-btn${active === cat ? ' active' : ''}`}
            onClick={() => setActive(cat)}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* 배너 */}
      <div className="banner">
        <div className="banner-text">
          <h2>직접 고른 <em>프리미엄 가전</em></h2>
          <p>노트북 · 냉장고 · TV · 청소기 · 생활가전 큐레이션</p>
        </div>
        <div className="banner-badge">PREMY PICK ✦</div>
      </div>

      {/* 상품 그리드 */}
      <section className="section">
        <div className="section-header">
          <h3>{active === '전체' ? '추천 제품' : active}</h3>
        </div>
        {filtered.length === 0 ? (
          <div className="empty">해당 카테고리의 상품이 없습니다</div>
        ) : (
          <div className="grid">
            {filtered.map((p) => (
              <a key={p.id} href={p.link} target="_blank" rel="noopener noreferrer" className="card">
                {p.badge && (
                  <span className={`badge ${p.badge === 'NEW' ? 'badge-new' : 'badge-hot'}`}>
                    {p.badge}
                  </span>
                )}
                <div className="card-img">
                  {p.image ? <img src={p.image} alt={p.name} /> : '🛒'}
                </div>
                <div className="card-body">
                  {p.category && <div className="card-category">{p.category}</div>}
                  <div className="card-name">{p.name}</div>
                  {p.desc && <div className="card-desc">{p.desc}</div>}
                  {p.price && <div className="card-price">{p.price}</div>}
                  <div className="card-cta">쿠팡에서 보기</div>
                </div>
              </a>
            ))}
          </div>
        )}
      </section>

      {/* 푸터 */}
      <footer className="footer">
        <div>
          <div className="footer-logo">PRE<span>MY</span></div>
          <div className="footer-copy">© 2026 Premy. All rights reserved.</div>
        </div>
        <p className="footer-disc">
          본 사이트는 쿠팡 파트너스 제휴 마케팅 프로그램에 참여하고 있으며, 링크를 통해 구매 시 일정 수수료를 받을 수 있습니다. 단, 구매자에게 추가 비용이 발생하지 않습니다. 최종 가격은 쿠팡에서 확인하시기 바랍니다.
        </p>
      </footer>
    </main>
  );
}