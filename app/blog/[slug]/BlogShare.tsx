'use client';

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
    <button onClick={handleShare} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '4px', flexShrink: 0, marginTop: '6px', fontSize: '18px' }}>
      공유
    </button>
  );
}