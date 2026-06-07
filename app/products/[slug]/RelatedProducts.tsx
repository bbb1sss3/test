'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';

export default function RelatedProducts({ category, currentId }: { category: string; currentId: string }) {
  const [related, setRelated] = useState<any[]>([]);

  useEffect(() => {
    fetch(`/api/coupang/related?category=${encodeURIComponent(category)}&currentId=${currentId}`)
      .then(res => res.json())
      .then(data => setRelated(data));
  }, [category, currentId]);

  if (related.length === 0) return null;

  return (
    <div>
      <div className="related-title">연관 상품</div>
      <div className="related-grid">
        {related.map(p => (
          <Link key={p.id} href={`/products/${p.slug || p.id}`} className="related-card">
            <div className="related-img">
              {p.image
                ? <Image src={p.image} alt={p.name} width={200} height={200} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                : '🛒'
              }
            </div>
            <div className="related-name">{p.name}</div>
            <div className="related-price">{p.price}</div>
          </Link>
        ))}
      </div>
    </div>
  );
}