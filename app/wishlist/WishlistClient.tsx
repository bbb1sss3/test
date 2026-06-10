'use client';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Share2, Trash2 } from 'lucide-react';

export default function WishlistClient({ products }: { products: any[] }) {
  const [wishes, setWishes] = useState<string[]>([]);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem('wishes');
    if (saved) setWishes(JSON.parse(saved));
  }, []);

  const wishProducts = products.filter(p => wishes.includes(p.id));

  const removeWish = (id: string) => {
    const updated = wishes.filter(w => w !== id);
    setWishes(updated);
    localStorage.setItem('wishes', JSON.stringify(updated));
  };

  const handleShare = (slug: string, id: string) => {
    navigator.clipboard.writeText(`${window.location.origin}/products/${slug || id}`);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <main style={{ background: '#fff', minHeight: '100vh' }}>
      <header style={{ background: '#fff', borderBottom: '1px solid #e8e8e8', height: '56px', position: 'sticky', top: 0, zIndex: 100, display: 'flex', alignItems: 'center' }}>
        <div style={{ maxWidth: '1100px', width: '100%', margin: '0 auto', padding: '0 1.5rem', display: 'flex', alignItems: 'center' }}>
          <Link href="/" style={{ fontSize: '26px', fontWeight: 900, color: '#111', letterSpacing: '-1px', textDecoration: 'none' }}>
            PRE<span style={{ color: '#e52c2c' }}>MY</span><small style={{ fontSize: '12px', fontWeight: 400, color: '#aaa', marginLeft: '8px', letterSpacing: 0 }}>프리미</small>
          </Link>
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