'use client';
import { Share2 } from 'lucide-react';

export default function ShareButton({ name }: { name: string }) {
  return (
    <button
      className="share-btn"
      onClick={() => {
        if (navigator.share) {
          navigator.share({ title: name, url: window.location.href });
        } else {
          navigator.clipboard.writeText(window.location.href);
          alert('링크가 복사되었습니다!');
        }
      }}
    >
      <Share2 size={16} /> 공유하기
    </button>
  );
}