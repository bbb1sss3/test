'use client';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Share2, Trash2, Search, Heart } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function WishlistClient({ products }: { products: any[] }) {
  const [wishes, setWishes] = useState<string[]>([]);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const router = useRouter();

  useEffect(() => {
    const saved = localStorage.getItem('wishes');
    if (saved) setWishes(JSON.parse(saved));
  }, []);

  const wishProducts = products
    .filter(p => wishes.includes(p.id))
    .filter(p => !search || p.name.toLowerCase().includes(search.toLowerCase()));

  const removeWish = (id: string) => {
    const updated = wishes.filter(w => w !== id);
    setWishes(updated);
    localStorage.setItem('wishes', JSON.stringify(updated));
  };

  const handleShare = (slug: string, id: string) => {
    const url = `${window.location.origin}/products/${slug || id}`;
    if (navigator.share) {
      navigator.share({ title: '', url });
    } else {
      navigator.clipboard.writeText(url);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    }
  };

  return (
    <main style={{ background: '#fff', minHeight: '100vh' }}>
      <header className="header">
        <div className="header-inner">
          <Link href="/" className="logo">PRE<span>MY</span><small style={{ fontSize: '12px', fontWeight: 400, color: '#aaa', marginLeft: '8px', letterSpacing: 0 }}>프리미</small></Link>
          <div className="search-wrap">
            <input className="search-input" type="text" placeholder="상품 검색..." value={search} onChange={e => setSearch(e.target.value)} />
            <span className="search-icon"><Search size={14} color="#aaa" /></span>
          </div>
          <button
            onClick={() => router.push('/wishlist')}
            style={{ background: 'none', border: 'none', cursor: 'pointer', position: 'relative', flexShrink: 0, display: 'flex', alignItems: 'center' }}
            >
              <Heart size={22} color={wishes.length > 0 ? '#e52c2c' : '#aaa'} fill={wishes.length > 0 ? '#e52c2c' : 'none'} />
              {wishes.length > 0 && (
                <span style={{ position: 'absolute', top: '-4px', right: '-4px', background: '#e52c2c', color: '#fff', fontSize: '10px', fontWeight: 800, borderRadius: '50%', width: '16px', height: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {wishes.length}
                </span>
              )}
          </button>
        </div>
  </header>
  
      <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '2rem 1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '1.5rem' }}>
          <span style={{ fontSize: '18px', fontWeight: 800 }}>찜한 상품</span>
          <span style={{ fontSize: '14px', color: '#aaa' }}>{wishProducts.length}개</span>
        </div>

        {wishProducts.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '5rem 2rem', color: '#ccc' }}>
            <p style={{ fontSize: '15px' }}>찜한 상품이 없습니다</p>
            <Link href="/" style={{ display: 'inline-block', marginTop: '1rem', padding: '10px 24px', background: '#e52c2c', color: '#fff', borderRadius: '8px', textDecoration: 'none', fontSize: '14px', fontWeight: 700 }}>
              상품 보러가기
            </Link>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '1.5rem' }}>
            {wishProducts.map(p => (
              <div key={p.id} style={{ position: 'relative' }}>
                <Link href={`/products/${p.slug || p.id}`} style={{ textDecoration: 'none', display: 'block' }}>
                  <div style={{ aspectRatio: '1', background: '#f9f9f9', borderRadius: '8px', overflow: 'hidden', marginBottom: '8px' }}>
                    {p.image
                      ? <Image src={p.image} alt={p.name} width={400} height={400} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      : '🛒'
                    }
                  </div>
                  <div style={{ fontSize: '11px', color: '#aaa', marginBottom: '3px' }}>{p.category}</div>
                  <div style={{ fontSize: '14px', fontWeight: 700, color: '#111', lineHeight: 1.4, overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>{p.name}</div>
                  <div style={{ fontSize: '16px', fontWeight: 900, color: '#111', marginTop: '4px' }}>{p.price}</div>
                </Link>
                <button onClick={() => handleShare(p.slug, p.id)} style={{ position: 'absolute', top: '8px', left: '8px', background: 'rgba(255,255,255,0.9)', border: 'none', borderRadius: '50%', width: '30px', height: '30px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                  <Share2 size={14} color={copiedId === p.id ? '#e52c2c' : '#555'} />
                </button>
                <button onClick={() => removeWish(p.id)} style={{ position: 'absolute', top: '8px', right: '8px', background: 'rgba(255,255,255,0.9)', border: 'none', borderRadius: '50%', width: '30px', height: '30px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                  <Trash2 size={14} color="#e52c2c" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}