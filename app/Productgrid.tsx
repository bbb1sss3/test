'use client';
import Image from "next/image";
import { useState, useEffect } from "react";
import Link from "next/link";
import { Laptop, Monitor, Tv, Refrigerator, WashingMachine, Wind, Sofa, AirVent, UtensilsCrossed, Tablet, Pill, Star, Flame, Sparkles, Home, Computer } from 'lucide-react';

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
  originalPrice: string;
  hanmadi: string;
  tag: string;
  compare: string;
  slug?: string;
};

const categories = [
  { label: '전체', icon: Home },
  { label: 'NEW', icon: Sparkles },
  { label: '추천', icon: Star },
  { label: '인기', icon: Flame },
  { label: '노트북', icon: Laptop },
  { label: '데스크탑', icon: Computer },
  { label: '모니터', icon: Monitor },
  { label: '냉장고', icon: Refrigerator },
  { label: '세탁기/건조기', icon: WashingMachine },
  { label: 'TV', icon: Tv },
  { label: '청소기', icon: Wind },
  { label: '에어컨', icon: AirVent },
  { label: '안마의자', icon: Sofa },
  { label: '공기청정기', icon: Wind },
  { label: '식기세척기', icon: UtensilsCrossed },
  { label: '태블릿', icon: Tablet },
  { label: '영양제', icon: Pill },
];



const css = `
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { font-family: 'Apple SD Gothic Neo', 'Noto Sans KR', sans-serif; background: #fff; color: #111; }

  .header { background: #fff; border-bottom: 1px solid #e8e8e8; padding: 0; display: flex; align-items: center; height: 56px; position: sticky; top: 0; z-index: 100; }
  .header-inner { max-width: 1100px; width: 100%; margin: 0 auto; padding: 0 1.5rem; display: flex; align-items: center; justify-content: space-between; gap: 1rem; height: 100%; }
   .logo { font-size: 26px; font-weight: 900; color: #111; letter-spacing: -1px; text-decoration: none; }
    .logo span { color: #e52c2c; }
.search-wrap { flex: 1; max-width: 400px; position: relative; margin-left: auto; }
  .search-input { width: 100%; padding: 8px 36px 8px 14px; border: 1.5px solid #e8e8e8; border-radius: 20px; font-size: 13px; outline: none; transition: border 0.15s; }
  .search-input:focus { border-color: #e52c2c; }
  .search-icon { position: absolute; right: 12px; top: 50%; transform: translateY(-50%); color: #aaa; font-size: 14px; pointer-events: none; }

.filter-area { background: #fff; border-bottom: 1px solid #f0f0f0; position: sticky; top: 56px; z-index: 99; }
.filter-wrap { max-width: 1100px; margin: 0 auto; padding: 0.75rem 1.5rem; display: flex; gap: 0.5rem; overflow-x: auto; scrollbar-width: none; flex-wrap: wrap; }
  .filter-wrap::-webkit-scrollbar { display: none; }
 .filter-btn { background: #fff; color: #555; border: 1.5px solid #e8e8e8; padding: 6px 14px 6px 10px; border-radius: 8px; font-size: 12px; font-weight: 600; cursor: pointer; white-space: nowrap; flex-shrink: 0; transition: all 0.15s; display: inline-flex; align-items: center; gap: 5px; }
.filter-btn.active, .filter-btn:hover { background: #e52c2c; color: #fff; border-color: #e52c2c; }
.filter-btn svg { flex-shrink: 0; opacity: 0.6; }
.filter-btn.active svg, .filter-btn:hover svg { opacity: 1; }

  .slider-wrap { position: relative; overflow: hidden; background: #fff; width: 100%; max-width: 100vw; }
  .slides { display: flex; width: 100%; transition: transform 0.5s cubic-bezier(.4,0,.2,1); will-change: transform; }
  .slide { min-width: 100%; max-width: 100%; width: 100%; height: 250px; padding: 2rem 3rem; display: flex; align-items: flex-end; justify-content: flex-start; text-decoration: none; color: inherit; box-sizing: border-box; overflow: hidden; flex-shrink: 0; position: relative; }
  .slide-bg { position: absolute; top: 0; left: 0; width: 100%; height: 100%; object-fit: cover; object-position: center; z-index: 0; filter: brightness(0.6); animation: zoomout 8s ease-in-out infinite alternate; transform-origin: center; }
  @keyframes zoomout { from { transform: scale(1.2); } to { transform: scale(1); } }
  .slide-content { position: relative; z-index: 1; }
  .slide-tag { display: inline-block; font-size: 10px; font-weight: 800; color: #D4A017; border: 1.5px solid #D4A017; padding: 3px 10px; border-radius: 3px; letter-spacing: 2px; margin-bottom: 0.75rem; text-transform: uppercase; }
  .slide h2 { font-size: 28px; font-weight: 900; color: #fff; letter-spacing: -1.5px; line-height: 1.2; margin-bottom: 0.5rem; }
  .slide h2 em { font-style: normal; color: #fff; }
  .slide-desc { font-size: 13px; color: rgba(255,255,255,0.7); margin-bottom: 0.75rem; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; max-width: 400px; }
  .slide-price { font-size: 22px; font-weight: 900; color: #fff; letter-spacing: -1px; }

  .hero-banner { background: #111; border-bottom: 1px solid #222; }
  .hero-banner-inner { max-width: 1100px; margin: 0 auto; padding: 2rem 1.5rem; display: flex; align-items: center; justify-content: space-between; }
  .hero-banner h2 { font-size: 36px; font-weight: 900; color: #fff; letter-spacing: -2px; line-height: 1.1; }
  .hero-banner h2 em { font-style: normal; color: #e52c2c; }
  .hero-banner p { font-size: 12px; color: #444; margin-top: 0.5rem; }
  .hero-badge { background: #e52c2c; color: #fff; font-size: 12px; font-weight: 800; padding: 8px 20px; border-radius: 4px; white-space: nowrap; }

  .section { padding: 0.5rem 0 3rem; flex: 1; }
  .section-inner { max-width: 1100px; margin: 0 auto; padding: 0 1.5rem; }
  .section-header { margin-bottom: 1rem; font-size: 15px; font-weight: 800; color: #111; display: flex; align-items: center; justify-content: space-between; }
  .sort-btn { background: #fff; color: #888; border: 1px solid #eee; padding: 5px 12px; border-radius: 4px; font-size: 12px; font-weight: 500; cursor: pointer; transition: all 0.15s; }
  .sort-btn.active { background: #111; color: #fff; border-color: #111; }
  .sort-btn:hover { border-color: #111; color: #fff; background: #111; }
  .grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(180px, 1fr)); gap: 1.5rem; }

  .card { background: #fff; text-decoration: none; display: flex; flex-direction: column; position: relative; transition: all 0.2s; }
  .card:hover { transform: translateY(-2px); }
  .card-img-wrap { aspect-ratio: 1; background: #f9f9f9; overflow: hidden; border-radius: 8px; display: flex; align-items: center; justify-content: center; font-size: 56px; margin-bottom: 10px; }
  .card-img-wrap img { width: 100%; height: 100%; object-fit: cover; transition: transform 0.3s; }
  .card:hover .card-img-wrap img { transform: scale(1.05); }
  .card-body { display: flex; flex-direction: column; flex: 1; }
  .card-category { font-size: 11px; color: #aaa; margin-bottom: 3px; }
  .card-name { font-size: 13px; color: #111; font-weight: 600; line-height: 1.45; margin-bottom: 4px; overflow: hidden; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; }
  .card-desc { font-size: 11px; color: #aaa; margin-bottom: 6px; overflow: hidden; display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical; }
  .card-rating { font-size: 11px; color: #f5a623; margin-bottom: 4px; }
  .card-rating span { color: #aaa; margin-left: 2px; }
  .card-discount { font-size: 12px; color: #e52c2c; font-weight: 700; margin-bottom: 2px; }
  .card-original-price { font-size: 12px; color: #aaa; text-decoration: line-through; margin-bottom: 2px; }
  .card-price { font-size: 16px; color: #111; font-weight: 900; letter-spacing: -0.5px; margin-bottom: 10px; }
  .badge { position: absolute; top: 8px; left: 8px; font-size: 10px; font-weight: 800; padding: 3px 8px; border-radius: 4px; z-index: 1; }
  .badge-new { background: linear-gradient(135deg, #e52c2c, #ff6b6b); color: #fff; border-radius: 20px; box-shadow: 0 2px 8px rgba(229,44,44,0.4); }
  .badge-hot { background: linear-gradient(135deg, #B8860B, #D4A017, #B8860B); color: #fff; border-radius: 4px; box-shadow: 0 2px 8px rgba(184,134,11,0.4); }
  .badge-pick { background: linear-gradient(135deg, #666, #999, #666); color: #fff; border-radius: 4px; box-shadow: 0 2px 8px rgba(0,0,0,0.2); }
  .wish-btn { position: absolute; top: 8px; right: 8px; background: rgba(255,255,255,0.9); border: none; border-radius: 50%; width: 30px; height: 30px; display: flex; align-items: center; justify-content: center; cursor: pointer; font-size: 16px; z-index: 1; transition: all 0.15s; }
  .wish-btn:hover { transform: scale(1.1); }
  .empty { text-align: center; padding: 5rem 2rem; color: #ccc; font-size: 15px; }

.recent-wrap { max-width: 1100px; margin: 0 auto; padding: 0.75rem 1.5rem; width: 100%; }
.recent-title { font-size: 14px; font-weight: 800; color: #111; margin-bottom: 0.75rem; text-align: left; }
  .recent-list { display: flex; gap: 0.75rem; overflow-x: auto; scrollbar-width: none; }
  .recent-list::-webkit-scrollbar { display: none; }
  .recent-item { flex-shrink: 0; width: 80px; text-decoration: none; }
  .recent-img { width: 80px; height: 80px; background: #f9f9f9; border-radius: 8px; overflow: hidden; display: flex; align-items: center; justify-content: center; font-size: 28px; margin-bottom: 4px; }
  .recent-img img { width: 100%; height: 100%; object-fit: cover; }
  .recent-name { font-size: 10px; color: #555; line-height: 1.3; overflow: hidden; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; }

  .footer { border-top: 1px solid #e8e8e8; background: #111; }
  .footer-inner { max-width: 1100px; margin: 0 auto; padding: 0.75rem 1.5rem; text-align: center; }
  .footer-pc { font-size: 11px; color: #666; line-height: 1.7; }
  .footer-mobile { display: none; }

  .back-to-top { position: fixed; bottom: 2rem; right: 2rem; background: #111; color: #fff; border: none; width: 44px; height: 44px; border-radius: 50%; font-size: 18px; cursor: pointer; display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 12px rgba(0,0,0,0.2); z-index: 100; text-decoration: none; }
  .back-to-top:hover { background: #e52c2c; }
  .filter-hidden { display: none; }
.filter-more { display: none; }
.filter-toggle { display: none; }
  @media (max-width: 768px) {
    .header-inner { padding: 0 1rem; }
    .filter-wrap { flex-wrap: nowrap; padding: 0.75rem 1rem; }
  .filter-more { display: none; }
 .filter-hidden { display: inline-flex !important; }
    .slide { height: 200px; padding: 1.5rem 1rem; gap: 1rem; }
    .slide h2 { font-size: 18px; }
    .slide-desc { white-space: normal; overflow: hidden; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; max-width: 100%; }
    .section-inner { padding: 0 0.5rem; }
    .section { padding: 0.5rem 0 3rem; }
    .grid { display: grid; grid-template-columns: repeat(2, 1fr) !important; gap: 8px; padding: 0 8px; }
    .card { display: flex; flex-direction: column; min-width: 0; width: 100%; }
    .card-img-wrap { width: 100%; height: 140px; aspect-ratio: unset; overflow: hidden; }
    .card-img-wrap img { width: 100%; height: 100%; object-fit: cover; }
    main { min-height: unset; }
    .footer-mobile { display: block; font-size: 10px; color: #666; line-height: 1.6; }
    .footer-pc { display: none; } 
    .recent-wrap { padding: 0.75rem 1rem; margin-top: 0; }
   .slider-wrap { display: none; }
    .section-header { flex-direction: column; align-items: flex-start; gap: 0.5rem; }
    .back-to-top { bottom: 1.5rem; right: 1rem; }
      .filter-toggle { display: flex; align-items: center; justify-content: space-between; padding: 0.75rem 1rem; font-size: 13px; font-weight: 700; color: #111; cursor: pointer; background: none; border: none; width: 100%; }
  .filter-toggle-arrow { font-size: 12px; color: #aaa; transition: transform 0.2s; }
  .filter-toggle-arrow.open { transform: rotate(180deg); }
  .filter-list { display: none; }
  .filter-list.open { display: flex; }
   .filter-hidden { display: none; }
  .filter-more { display: flex; }
  .hero-banner-inner { flex-direction: column; align-items: flex-start; gap: 1rem; padding: 1.25rem 1rem; }
  .hero-banner h2 { font-size: 22px; letter-spacing: -1px; }
  .hero-banner p { font-size: 11px; }
  }
  @media (min-width: 769px) {
    .slider-wrap { display: none; }
    .dots { display: none !important; }
    .filter-hidden { display: flex !important; }
  .filter-more { display: none !important; }
  }
`;

function Stars({ rating }: { rating: string }) {
  const num = parseFloat(rating);
  if (!num) return null;
  const full = Math.floor(num);
  const half = num % 1 >= 0.5;
  return (
    <div className="card-rating">
      {'★'.repeat(half ? full + 1 : full)}{'☆'.repeat(half ? 4 - full : 5 - full)}
      <span>{rating}</span>
    </div>
  );
}

function parsePrice(price: string) {
  return parseInt(price.replace(/[^0-9]/g, '') || '0');
}

export default function ProductGrid({ products }: { products: Product[] }) {
  const [showAllFilter, setShowAllFilter] = useState(false);
  const [active, setActive] = useState('전체');
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState('기본');
  const [cur, setCur] = useState(0);
  const [showWish, setShowWish] = useState(false);
  const [wishes, setWishes] = useState<string[]>([]);
  const [recent, setRecent] = useState<Product[]>([]);

  const highlights = products.filter(p => p.badge === '인기').slice(0, 4);
  const total = highlights.length;
  const [showTop, setShowTop] = useState(false);
  useEffect(() => {
  const saved = localStorage.getItem('wishes');
  if (saved) setWishes(JSON.parse(saved));
  const savedRecent = localStorage.getItem('recent');
  if (savedRecent) {
    const ids = JSON.parse(savedRecent) as string[];
    const recentProducts = ids.map(id => products.find(p => p.id === id)).filter(Boolean) as Product[];
    setRecent(recentProducts);
  }
  const handleScroll = () => setShowTop(window.scrollY > 300);
  window.addEventListener('scroll', handleScroll);
  return () => window.removeEventListener('scroll', handleScroll);
}, [products]);

  useEffect(() => {
    if (total === 0) return;
    const timer = setInterval(() => setCur(c => (c + 1) % total), 3500);
    return () => clearInterval(timer);
  }, [total]);

  const go = (n: number) => setCur((n + total) % total);

  const toggleWish = (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const newWishes = wishes.includes(id) ? wishes.filter(w => w !== id) : [...wishes, id];
    setWishes(newWishes);
    localStorage.setItem('wishes', JSON.stringify(newWishes));
  };

  let filtered = products
    .filter(p => {
      if (active === '전체') return true;
      if (active === 'NEW') return p.badge === 'NEW';
      if (active === '추천') return p.badge === '추천';
      if (active === '인기') return p.badge === '인기';
      return p.category === active;
    })
    .filter(p => !search || p.name.toLowerCase().includes(search.toLowerCase()) || p.category.toLowerCase().includes(search.toLowerCase()));

  if (sort === '낮은가격순') filtered = [...filtered].sort((a, b) => parsePrice(a.price) - parsePrice(b.price));
  if (sort === '높은가격순') filtered = [...filtered].sort((a, b) => parsePrice(b.price) - parsePrice(a.price));

  return (
    <main style={{ background: '#fff', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <style dangerouslySetInnerHTML={{ __html: css }} />

      <header className="header">
        <div className="header-inner">
          <Link href="/" className="logo">PRE<span>MY</span><small style={{ fontSize: '12px', fontWeight: 400, color: '#aaa', marginLeft: '8px', letterSpacing: 0 }}>프리미</small></Link>
          <div className="search-wrap">
            <input className="search-input" type="text" placeholder="상품 검색..." value={search} onChange={e => setSearch(e.target.value)} />
            <span className="search-icon">🔍</span>
          </div>
          <button
            onClick={() => {
              if (!showWish) window.scrollTo({ top: 0, behavior: 'smooth' });
              setShowWish(!showWish);
            }}
            style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '22px', position: 'relative', flexShrink: 0 }}
          >
            ❤️
            {wishes.length > 0 && (
              <span style={{ position: 'absolute', top: '-4px', right: '-4px', background: '#e52c2c', color: '#fff', fontSize: '10px', fontWeight: 800, borderRadius: '50%', width: '16px', height: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {wishes.length}
              </span>
            )}
          </button>
        </div>
      </header>

    <div className="filter-area">
      <div className="filter-wrap">
        {categories.map((cat) => (
          <button 
            key={cat.label} 
            className={`filter-btn${active === cat.label ? ' active' : ''}`} 
            onClick={() => setActive(cat.label)}
          >
            <cat.icon size={12} strokeWidth={2} />
            {cat.label}
          </button>
        ))}
      </div>
    </div>

      {showWish && (
        <div style={{ background: '#fff', borderBottom: '1px solid #f0f0f0' }}>
          <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '1rem 1.5rem' }}>
            <div style={{ fontSize: '15px', fontWeight: 800, color: '#111', marginBottom: '1rem' }}>찜한 상품 ({wishes.length})</div>
            {wishes.length === 0 ? (
              <div style={{ color: '#ccc', fontSize: '14px' }}>찜한 상품이 없습니다</div>
            ) : (
              <div className="grid">
                {products.filter(p => wishes.includes(p.id)).map(p => (
                  <Link key={p.id} href={`/products/${p.slug || p.id}`} className="card">
                    <div className="card-img-wrap">
                      {p.image
                        ? <Image src={p.image} alt={p.name} width={400} height={400} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        : '🛒'
                      }
                    </div>
                    <div className="card-body">
                      <div className="card-category">{p.category}</div>
                      <div className="card-name">{p.name}</div>
                      {p.price && <div className="card-price">{p.price}</div>}
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      <div className="hero-banner">
        <div className="hero-banner-inner">
          <div>
            <p style={{ fontSize: '10px', fontWeight: 800, color: '#e52c2c', letterSpacing: '3px', textTransform: 'uppercase', marginBottom: '0.75rem' }}>✦ PREMY PICK</p>
            <h2>살 거면 제대로,<br /><em>프리미엄만</em> 모았습니다</h2>
            <p>노트북 · 냉장고 · TV · 청소기 · 생활가전· 영양제</p>
          </div>
          <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '22px', fontWeight: 900, color: '#fff', letterSpacing: '-1px' }}>100<span style={{ color: '#e52c2c' }}>+</span></div>
              <div style={{ fontSize: '10px', color: '#444', letterSpacing: '1px', textTransform: 'uppercase', marginTop: '2px' }}>PRODUCTS</div>
            </div>
            <div style={{ width: '1px', height: '30px', background: '#333' }} />
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '22px', fontWeight: 900, color: '#fff', letterSpacing: '-1px' }}>12<span style={{ color: '#e52c2c' }}>+</span></div>
              <div style={{ fontSize: '10px', color: '#444', letterSpacing: '1px', textTransform: 'uppercase', marginTop: '2px' }}>CATEGORIES</div>
            </div>
            <div style={{ width: '1px', height: '30px', background: '#333' }} />
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '22px', fontWeight: 900, color: '#fff', letterSpacing: '-1px' }}>NO<span style={{ color: '#e52c2c' }}>.1</span></div>
              <div style={{ fontSize: '10px', color: '#444', letterSpacing: '1px', textTransform: 'uppercase', marginTop: '2px' }}>CURATION</div>
            </div>
          </div>
          <div className="hero-badge">PREMY PICK ✦</div>
        </div>
      </div>

      {highlights.length > 0 && (
        <div className="slider-wrap">
          <div className="slides" style={{ transform: `translateX(-${cur * 100}%)` }}>
            {highlights.map((p) => (
              <Link key={p.id} href={`/products/${p.slug || p.id}`} className="slide">
                {p.image && <Image src={p.image} alt={p.name} className="slide-bg" fill style={{ objectFit: 'cover', filter: 'brightness(0.6)' }} />}
                <div className="slide-content">
                  <div className="slide-tag">✦ PREMY PICK · {p.category}</div>
                  <h2>{p.name.length > 20 ? p.name.slice(0, 20) + '...' : p.name}<br /><em>{p.category}</em></h2>
                  <p className="slide-desc">{p.desc}</p>
                  <div className="slide-price">{p.price}</div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {recent.length > 0 && (
        <div className="recent-wrap">
          <div className="recent-title">최근 본 상품</div>
          <div className="recent-list">
            {recent.map(p => (
              <Link key={p.id} href={`/products/${p.slug || p.id}`} className="recent-item">
                <div className="recent-img">
                  {p.image
                    ? <Image src={p.image} alt={p.name} width={80} height={80} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    : '🛒'
                  }
                </div>
                <div className="recent-name">{p.name}</div>
              </Link>
            ))}
          </div>
        </div>
      )}

      <section className="section">
        <div className="section-inner">
          <div className="section-header">
            <span>{search ? `"${search}" 검색 결과` : active === '전체' ? '추천 제품' : active}</span>
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
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
                <Link key={p.id} href={`/products/${p.slug || p.id}`} className="card" onClick={() => {
                  const saved = localStorage.getItem('recent');
                  const ids = saved ? JSON.parse(saved) as string[] : [];
                  const updated = [p.id, ...ids.filter(id => id !== p.id)].slice(0, 10);
                  localStorage.setItem('recent', JSON.stringify(updated));
                }}>
                  {p.badge && (
                    <span className={`badge ${p.badge === 'NEW' ? 'badge-new' : p.badge === '인기' ? 'badge-hot' : 'badge-pick'}`}>
                      {p.badge === 'NEW' ? 'NEW' : p.badge === '인기' ? '🥇 BEST' : '⭐ 추천'}
                    </span>
                  )}
                  <button className="wish-btn" onClick={(e) => toggleWish(p.id, e)}>
                    {wishes.includes(p.id) ? '❤️' : '🤍'}
                  </button>
                  <div className="card-img-wrap">
                    {p.image
                      ? <Image src={p.image} alt={p.name} width={400} height={400} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      : '🛒'
                    }
                  </div>
                  <div className="card-body">
                    {p.category && <div className="card-category">{p.category}</div>}
                    <div className="card-name">{p.name}</div>
                   {p.desc && <div className="card-desc">{p.desc.replace(/##[^\n]*/g, '').replace(/\n+/g, ' ').trim().slice(0, 100)}</div>}
                    <Stars rating={p.rating} />
                    {p.discount && <div className="card-discount">{p.discount} 할인</div>}
                    {p.originalPrice && <div className="card-original-price">{p.originalPrice}</div>}
                    {p.price && <div className="card-price">{p.price}</div>}
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      <footer className="footer">
        <div className="footer-inner">
          <p className="footer-pc">© 2026 Premy(프리미)</p>
          <p className="footer-mobile">© 2026 Premy(프리미)</p>
        </div>
      </footer>
      {showTop && (
        <button className="back-to-top" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>↑</button>
      )}
    </main>
  );
}