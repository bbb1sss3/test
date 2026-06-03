'use client';

import { useState, useEffect } from "react";

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

const categories = ['전체', '노트북', '데스크탑', '모니터', '냉장고', '세탁기/건조기', 'TV', '청소기', '에어컨', '안마의자', '공기청정기', '식기세척기'];

const css = `
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { font-family: 'Apple SD Gothic Neo', 'Noto Sans KR', sans-serif; background: #fff; color: #111; }
  .header { background: #fff; border-bottom: 1px solid #e8e8e8; padding: 0 2rem; display: flex; align-items: center; height: 56px; position: sticky; top: 0; z-index: 100; }
  .logo { font-size: 22px; font-weight: 900; color: #111; letter-spacing: -1px; }
  .logo span { color: #e52c2c; }
  .filter-wrap { background: #fff; padding: 0.75rem 2rem; border-bottom: 1px solid #f0f0f0; display: flex; gap: 0.5rem; overflow-x: auto; scrollbar-width: none; position: sticky; top: 56px; z-index: 99; }
  .filter-wrap::-webkit-scrollbar { display: none; }
  .filter-btn { background: #fff; color: #555; border: 1px solid #ddd; padding: 6px 16px; border-radius: 20px; font-size: 13px; font-weight: 500; cursor: pointer; white-space: nowrap; flex-shrink: 0; transition: all 0.15s; }
  .filter-btn.active { background: #e52c2c; color: #fff; border-color: #e52c2c; }
  .filter-btn:hover { background: #e52c2c; color: #fff; border-color: #e52c2c; }
  .slider-wrap { position: relative; overflow: hidden; border-bottom: 2px solid #111; background: #fff; }
  .slides { display: flex; transition: transform 0.5s cubic-bezier(.4,0,.2,1); }
  .slide { min-width: 100%; padding: 3rem 2rem; display: flex; align-items: center; justify-content: space-between; gap: 2rem; }
  .slide-tag { display: inline-block; font-size: 10px; font-weight: 800; color: #e52c2c; border: 1.5px solid #e52c2c; padding: 3px 10px; border-radius: 3px; letter-spacing: 2px; margin-bottom: 1rem; text-transform: uppercase; }
  .slide h2 { font-size: 32px; font-weight: 900; color: #111; letter-spacing: -1.5px; line-height: 1.2; margin-bottom: 0.5rem; }
  .slide h2 em { font-style: normal; color: #e52c2c; }
  .slide p { font-size: 13px; color: #999; margin-bottom: 1.25rem; line-height: 1.6; }
  .slide-price { font-size: 22px; font-weight: 900; color: #111; letter-spacing: -1px; }
  .slide-right { font-size: 100px; flex-shrink: 0; line-height: 1; }
  .dots { position: absolute; bottom: 1rem; left: 50%; transform: translateX(-50%); display: flex; gap: 6px; }
  .dot { width: 6px; height: 6px; border-radius: 50%; background: #ddd; cursor: pointer; transition: all 0.2s; }
  .dot.active { background: #e52c2c; width: 18px; border-radius: 3px; }
  .arrow { position: absolute; top: 50%; transform: translateY(-50%); width: 32px; height: 32px; background: #fff; border: 1px solid #e8e8e8; border-radius: 50%; display: flex; align-items: center; justify-content: center; cursor: pointer; font-size: 16px; color: #555; transition: all 0.15s; z-index: 10; }
  .arrow:hover { background: #e52c2c; color: #fff; border-color: #e52c2c; }
  .arrow-prev { left: 1rem; }
  .arrow-next { right: 1rem; }
  .section { padding: 1.5rem 2rem 3rem; flex: 1; }
  .section-header { margin-bottom: 1rem; font-size: 15px; font-weight: 800; color: #111; }
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
  .card-cta { background: #e52c2c; color: #fff; border: none; width: 100%; padding: 9px; font-size: 13px; font-weight: 700; border-radius: 4px; text-align: center; display: block; }
  .badge { position: absolute; top: 8px; left: 8px; font-size: 10px; font-weight: 800; padding: 3px 8px; border-radius: 3px; z-index: 1; }
  .badge-new { background: #e52c2c; color: #fff; }
  .badge-hot { background: #ff6b00; color: #fff; }
  .empty { text-align: center; padding: 5rem 2rem; color: #ccc; font-size: 15px; }
  .footer { border-top: 1px solid #e8e8e8; padding: 1.25rem 2rem; text-align: center; }
  .footer p { font-size: 11px; color: #bbb; line-height: 1.7; }
  @media (max-width: 768px) {
    .header { padding: 0 1rem; }
    .filter-wrap { padding: 0.75rem 1rem; }
    .slide { padding: 2rem 1rem; }
    .slide h2 { font-size: 24px; }
    .slide-right { font-size: 64px; }
    .section { padding: 1.25rem 1rem 3rem; }
    .grid { grid-template-columns: repeat(2, 1fr); gap: 0.75rem; }
    .footer { padding: 1.25rem 1rem; }
  }
`;

export default function ProductGrid({ products }: { products: Product[] }) {
  const [active, setActive] = useState('전체');
  const [cur, setCur] = useState(0);

  const highlights = products.slice(0, 4);
  const total = highlights.length;

  const filtered = active === '전체'
    ? products
    : products.filter(p => p.category === active);

  useEffect(() => {
    if (total === 0) return;
    const timer = setInterval(() => {
      setCur(c => (c + 1) % total);
    }, 3500);
    return () => clearInterval(timer);
  }, [total]);

  const go = (n: number) => setCur((n + total) % total);

  return (
    <main style={{ background: '#fff', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <style dangerouslySetInnerHTML={{ __html: css }} />

      {/* 헤더 */}
      <header className="header">
        <div className="logo">PRE<span>MY</span></div>
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

      {/* 히어로 슬라이더 */}
      {highlights.length > 0 && (
        <div className="slider-wrap">
          <div className="slides" style={{ transform: `translateX(-${cur * 100}%)` }}>
            {highlights.map((p) => (
              <a key={p.id} href={p.link} target="_blank" rel="noopener noreferrer" className="slide" style={{ textDecoration: 'none', color: 'inherit' }}>
                <div>
                  <div className="slide-tag">✦ PREMY PICK · {p.category}</div>
                  <h2 dangerouslySetInnerHTML={{ __html: p.name.replace(/\s(\S+)$/, '<br/><em>$1</em>') }} />
                  <p>{p.desc}</p>
                  <div className="slide-price">{p.price}</div>
                </div>
                <div className="slide-right">
                  {p.image ? <img src={p.image} alt={p.name} style={{ width: '140px', height: '140px', objectFit: 'cover', borderRadius: '8px' }} /> : '🛒'}
                </div>
              </a>
            ))}
          </div>
          {total > 1 && (
            <>
              <div className="arrow arrow-prev" onClick={() => go(cur - 1)}>‹</div>
              <div className="arrow arrow-next" onClick={() => go(cur + 1)}>›</div>
              <div className="dots">
                {highlights.map((_, i) => (
                  <div key={i} className={`dot${cur === i ? ' active' : ''}`} onClick={() => go(i)} />
                ))}
              </div>
            </>
          )}
        </div>
      )}

      {/* 상품 그리드 */}
      <section className="section">
        <div className="section-header">
          {active === '전체' ? '추천 제품' : active}
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
        <p>© 2026 Premy &nbsp;·&nbsp; 본 사이트는 쿠팡 파트너스 제휴 마케팅 프로그램에 참여하고 있으며, 링크를 통해 구매 시 일정 수수료를 받을 수 있습니다. 단, 구매자에게 추가 비용이 발생하지 않습니다. 최종 가격은 쿠팡에서 확인하시기 바랍니다.</p>
      </footer>
    </main>
  );
}