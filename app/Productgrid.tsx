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
    discount: string;
    rating: string;
};

const categories = [
    { label: '전체', emoji: '🏠' },
    { label: 'NEW', emoji: '🆕' },
    { label: '추천', emoji: '⭐' },
    { label: '노트북', emoji: '💻' },
    { label: '데스크탑', emoji: '🖥️' },
    { label: '모니터', emoji: '🖥️' },
    { label: '냉장고', emoji: '❄️' },
    { label: '세탁기/건조기', emoji: '🫧' },
    { label: 'TV', emoji: '📺' },
    { label: '청소기', emoji: '🌀' },
    { label: '에어컨', emoji: '💨' },
    { label: '안마의자', emoji: '💆' },
    { label: '공기청정기', emoji: '🌬️' },
    { label: '식기세척기', emoji: '🍽️' },
];

const css = `
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { font-family: 'Apple SD Gothic Neo', 'Noto Sans KR', sans-serif; background: #fff; color: #111; }
  .header { background: #fff; border-bottom: 1px solid #e8e8e8; padding: 0 1.5rem; display: flex; align-items: center; justify-content: space-between; height: 56px; position: sticky; top: 0; z-index: 100; gap: 1rem; }
  .logo { font-size: 22px; font-weight: 900; color: #111; letter-spacing: -1px; flex-shrink: 0; }
  .logo span { color: #e52c2c; }
  .search-wrap { flex: 1; max-width: 400px; position: relative; }
  .search-input { width: 100%; padding: 8px 36px 8px 14px; border: 1.5px solid #e8e8e8; border-radius: 20px; font-size: 13px; outline: none; transition: border 0.15s; }
  .search-input:focus { border-color: #e52c2c; }
  .search-icon { position: absolute; right: 12px; top: 50%; transform: translateY(-50%); color: #aaa; font-size: 14px; pointer-events: none; }
  .filter-area { background: #fff; border-bottom: 1px solid #f0f0f0; position: sticky; top: 56px; z-index: 99; }
  .filter-wrap { padding: 0.75rem 1.5rem; display: flex; gap: 0.5rem; overflow-x: auto; scrollbar-width: none; }
  .filter-wrap::-webkit-scrollbar { display: none; }
  .filter-btn { background: #fff; color: #555; border: 1px solid #ddd; padding: 6px 14px; border-radius: 20px; font-size: 12px; font-weight: 500; cursor: pointer; white-space: nowrap; flex-shrink: 0; transition: all 0.15s; display: flex; align-items: center; gap: 4px; }
  .filter-btn.active, .filter-btn:hover { background: #e52c2c; color: #fff; border-color: #e52c2c; }
  .sort-wrap { padding: 0 1.5rem 0.75rem; display: flex; gap: 0.5rem; }
  .sort-btn { background: #fff; color: #888; border: 1px solid #eee; padding: 5px 12px; border-radius: 4px; font-size: 12px; font-weight: 500; cursor: pointer; transition: all 0.15s; }
  .sort-btn.active { background: #111; color: #fff; border-color: #111; }
  .sort-btn:hover { border-color: #111; color: #fff; background: #111; }
 .slider-wrap { position: relative; overflow: hidden; background: #111; width: 100%; max-width: 100vw; }
.slides { display: flex; width: 100%; transition: transform 0.5s cubic-bezier(.4,0,.2,1); }
.slide { min-width: 100%; max-width: 100%; width: 100%; height: 250px; padding: 2rem 3rem; display: flex; align-items: flex-end; justify-content: flex-start; text-decoration: none; color: inherit; box-sizing: border-box; overflow: hidden; flex-shrink: 0; position: relative; }
.slide-bg { position: absolute; top: 0; left: 0; width: 100%; height: 100%; object-fit: cover; object-position: center; z-index: 0; filter: brightness(0.5); }
.slide-content { position: relative; z-index: 1; }
.slide-tag { display: inline-block; font-size: 10px; font-weight: 800; color: #fff; border: 1.5px solid #fff; padding: 3px 10px; border-radius: 3px; letter-spacing: 2px; margin-bottom: 0.75rem; text-transform: uppercase; }
.slide h2 { font-size: 28px; font-weight: 900; color: #fff; letter-spacing: -1.5px; line-height: 1.2; margin-bottom: 0.5rem; }
.slide h2 em { font-style: normal; color: #fff; }
.slide-desc { font-size: 13px; color: rgba(255,255,255,0.7); margin-bottom: 0.75rem; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; max-width: 400px; }
.slide-price { font-size: 22px; font-weight: 900; color: #fff; letter-spacing: -1px; }
.slide-img { width: 220px; height: 220px; object-fit: cover; border-radius: 8px; flex-shrink: 0; }
.slide-emoji { font-size: 100px; flex-shrink: 0; line-height: 1; }
  .dots { position: absolute; bottom: 1rem; left: 50%; transform: translateX(-50%); display: flex; gap: 6px; }
  .dot { width: 6px; height: 6px; border-radius: 50%; background: #ddd; cursor: pointer; transition: all 0.2s; }
  .dot.active { background: #e52c2c; width: 18px; border-radius: 3px; }
  .section { padding: 1.5rem 1.5rem 3rem; flex: 1; }
  .section-header { margin-bottom: 1rem; font-size: 15px; font-weight: 800; color: #111; }
  .grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(180px, 1fr)); gap: 1.5rem; }
  .card { background: #fff; text-decoration: none; display: flex; flex-direction: column; position: relative; transition: all 0.2s; }
  .card:hover { transform: translateY(-2px); }
  .card-img-wrap { aspect-ratio: 1; background: #f9f9f9; overflow: hidden; border-radius: 8px; display: flex; align-items: center; justify-content: center; font-size: 56px; margin-bottom: 10px; }
  .card-img-wrap img { width: 100%; height: 100%; object-fit: cover; transition: transform 0.3s; }
  .card:hover .card-img-wrap img { transform: scale(1.05); }
  .card-body { display: flex; flex-direction: column; flex: 1; }
  .card-category { font-size: 11px; color: #aaa; margin-bottom: 3px; }
  .card-name { font-size: 13px; color: #111; font-weight: 600; line-height: 1.45; margin-bottom: 4px; overflow: hidden; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; }
  .card-desc { font-size: 11px; color: #aaa; margin-bottom: 6px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
  .card-rating { font-size: 11px; color: #f5a623; margin-bottom: 4px; }
  .card-rating span { color: #aaa; margin-left: 2px; }
  .card-discount { font-size: 12px; color: #e52c2c; font-weight: 700; margin-bottom: 2px; }
  .card-price { font-size: 16px; color: #111; font-weight: 900; letter-spacing: -0.5px; margin-bottom: 10px; }
  .card-cta { background: #e52c2c; color: #fff; border: none; width: 100%; padding: 9px; font-size: 13px; font-weight: 700; border-radius: 4px; text-align: center; display: block; margin-top: auto; }
  .badge { position: absolute; top: 8px; left: 8px; font-size: 10px; font-weight: 800; padding: 3px 8px; border-radius: 4px; z-index: 1; }
  .badge-new { background: #e52c2c; color: #fff; }
  .badge-hot { background: #ff6b00; color: #fff; }
  .empty { text-align: center; padding: 5rem 2rem; color: #ccc; font-size: 15px; }
.footer { background: #111; border-top: none; padding: 0.75rem 1.5rem; text-align: center; }
.footer p { font-size: 11px; color: #666; line-height: 1.7; }
.footer-mobile { display: none; }
  @media (max-width: 768px) {
    .header { padding: 0 1rem; }
    .filter-wrap { padding: 0.75rem 1rem; }
    .sort-wrap { padding: 0 1rem 0.75rem; }
  .slide { height: 200px; padding: 1.5rem 1rem; }
.slide h2 { font-size: 20px; }
    .slide-emoji { font-size: 60px; }
    .slide-img { width: 90px; height: 90px; }
    .section { padding: 1.25rem 1rem 3rem; }
    .grid { grid-template-columns: repeat(2, 1fr); gap: 1rem; }
    main { min-height: unset; }
.footer-mobile { display: block; font-size: 10px; color: #666; line-height: 1.6; }
  .footer-pc { display: none; }
  .slide { padding: 1.5rem 1rem; gap: 1rem; }
  .slide-img { width: 100px; height: 100px; }
  .slide h2 { font-size: 18px; }
  }
`;

function Stars({ rating }: { rating: string }) {
    const num = parseFloat(rating);
    if (!num) return null;
    const full = Math.floor(num);
    const half = num % 1 >= 0.5;
    return (
        <div className="card-rating">
            {'★'.repeat(full)}{half ? '½' : ''}{'☆'.repeat(5 - full - (half ? 1 : 0))}
            <span>{rating}</span>
        </div>
    );
}

function parsePrice(price: string) {
    return parseInt(price.replace(/[^0-9]/g, '') || '0');
}

export default function ProductGrid({ products }: { products: Product[] }) {
    const [active, setActive] = useState('전체');
    const [search, setSearch] = useState('');
    const [sort, setSort] = useState('기본');
    const [cur, setCur] = useState(0);

    const highlights = products.filter(p => p.badge === '인기').slice(0, 4);
    console.log('highlights length:', highlights.length);

    const total = highlights.length;


    useEffect(() => {
        if (total === 0) return;
        const timer = setInterval(() => setCur(c => (c + 1) % total), 3500);
        return () => clearInterval(timer);
    }, [total]);

    const go = (n: number) => setCur((n + total) % total);

    let filtered = products
        .filter(p => {
            if (active === '전체') return true;
            if (active === 'NEW') return p.badge === 'NEW';
            if (active === '추천') return p.badge === '인기' || p.badge === '추천';
            return p.category === active;
        })
        .filter(p => !search || p.name.toLowerCase().includes(search.toLowerCase()) || p.category.toLowerCase().includes(search.toLowerCase()));

    if (sort === '낮은가격순') filtered = [...filtered].sort((a, b) => parsePrice(a.price) - parsePrice(b.price));
    if (sort === '높은가격순') filtered = [...filtered].sort((a, b) => parsePrice(b.price) - parsePrice(a.price));

    return (
        <main style={{ background: '#fff', minHeight: '100vh', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
            <style dangerouslySetInnerHTML={{ __html: css }} />

            <header className="header">
                <div className="logo">PRE<span>MY</span></div>
                <div className="search-wrap">
                    <input className="search-input" type="text" placeholder="상품 검색..." value={search} onChange={e => setSearch(e.target.value)} />
                    <span className="search-icon">🔍</span>
                </div>
            </header>

            <div className="filter-area">
                <div className="filter-wrap">
                    {categories.map(cat => (
                        <button key={cat.label} className={`filter-btn${active === cat.label ? ' active' : ''}`} onClick={() => setActive(cat.label)}>
                            <span>{cat.emoji}</span>{cat.label}
                        </button>
                    ))}
                </div>
            </div>

            {highlights.length > 0 && (
                <div className="slider-wrap">
                    <div className="slides" style={{ transform: `translateX(-${cur * 100}%)` }}>
                        {highlights.map((p) => (
                            <a key={p.id} href={p.link} target="_blank" rel="noopener noreferrer" className="slide">
                                {p.image && <img src={p.image} alt={p.name} className="slide-bg" />}
                                <div className="slide-content">
                                    <div className="slide-tag">✦ PREMY PICK · {p.category}</div>
                                    <h2>{p.name.length > 20 ? p.name.slice(0, 20) + '...' : p.name}<br /><em>{p.category}</em></h2>
                                    <p className="slide-desc">{p.desc}</p>
                                    <div className="slide-price">{p.price}</div>
                                </div>
                            </a>
                        ))}
                    </div>
                </div>

            )}


            <section className="section">
                <div className="section-header" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <span>{search ? `"${search}" 검색 결과` : active === '전체' ? '추천 제품' : active}</span>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                        {['기본', '낮은가격순', '높은가격순'].map(s => (
                            <button key={s} className={`sort-btn${sort === s ? ' active' : ''}`} onClick={() => setSort(s)}>{s}</button>
                        ))}
                    </div>
                </div>
                {filtered.length === 0 ? (
                    <div className="empty">
                        {search ? `"${search}"에 대한 검색 결과가 없습니다` : '해당 카테고리의 상품이 없습니다'}
                    </div>
                ) : (
                    <div className="grid">
                        {filtered.map((p) => (
                            <a key={p.id} href={p.link} target="_blank" rel="noopener noreferrer" className="card">
                                {p.badge && (
                                    <span className={`badge ${p.badge === 'NEW' ? 'badge-new' : 'badge-hot'}`}>{p.badge}</span>
                                )}
                                <div className="card-img-wrap">
                                    {p.image ? <img src={p.image} alt={p.name} /> : '🛒'}
                                </div>
                                <div className="card-body">
                                    {p.category && <div className="card-category">{p.category}</div>}
                                    <div className="card-name">{p.name}</div>
                                    {p.desc && <div className="card-desc">{p.desc}</div>}
                                    <Stars rating={p.rating} />
                                    {p.discount && <div className="card-discount">{p.discount} 할인</div>}
                                    {p.price && <div className="card-price">{p.price}</div>}
                                    <div className="card-cta">쿠팡에서 보기</div>
                                </div>
                            </a>
                        ))}
                    </div>
                )}
            </section>

            <footer className="footer">
                <p className="footer-pc">© 2026 Premy &nbsp;·&nbsp; 본 사이트는 쿠팡 파트너스 제휴 마케팅 프로그램에 참여하고 있으며, 링크를 통해 구매 시 일정 수수료를 받을 수 있습니다. 단, 구매자에게 추가 비용이 발생하지 않습니다. 최종 가격은 쿠팡에서 확인하시기 바랍니다.</p>
                <p className="footer-mobile">© 2026 Premy &nbsp;·쿠팡 파트너스 활동의 일환으로 수수료를 받을 수 있음.</p>
            </footer>
        </main>
    );
}