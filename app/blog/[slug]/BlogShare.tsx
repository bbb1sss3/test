'use client';
import { Share2 } from 'lucide-react';

export default function BlogShare({ title }: { title: string }) {
  const handleShare = async () => {
    if (navigator.share) {
      await navigator.share({ title, url: window.location.href });
    } else {
      await navigator.clipboard.writeText(window.location.href);
      alert('링크가 복사됐습니다');
    }
  };
  return (
    <button onClick={handleShare} style={{ background: 'none', border: '1.5px solid #e8e8e8', cursor: 'pointer', padding: '6px 12px', borderRadius: '20px', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '12px', fontWeight: 700, color: '#555', flexShrink: 0, marginTop: '6px', whiteSpace: 'nowrap' }}>
      <Share2 size={13} />
      
    </button>
  );
}