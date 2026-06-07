'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';

export default function RelatedProducts({ category, currentId }: { category: string; currentId: string }) {
  const [related, setRelated] = useState<any[]>([]);

  useEffect(() => {
    fetch(`/api/coupang/related?category=${category}&currentId=${currentId}`)
      .then(res => res.json())
      .then(data => setRelated(data));
  }, [category, currentId]);

  if (related.length === 0) return null;

  return (
    <div className="recent-wrap">
      <div className="recent-title">관련 상품</div>
      <div className="recent-list">
        {related.map(p => (
          <Link key={p.id} href={`/products/${p.slug || p.id}`} className="recent-item">
            <div className="recent-img">
              {p.image && <Image src={p.image} alt={p.name} width={80} height={80} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />}
            </div>
            <div className="recent-name">{p.name}</div>
            <div className="recent-price">{p.price}</div>
          </Link>
        ))}
      </div>
    </div>
  );
}