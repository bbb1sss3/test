'use client';
import { useState, useEffect } from 'react';
import { Heart } from 'lucide-react';

export default function WishButton({ id }: { id: string }) {
  const [wished, setWished] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('wishes');
    const ids = saved ? JSON.parse(saved) as string[] : [];
    setWished(ids.includes(id));
  }, [id]);

  const toggle = () => {
    const saved = localStorage.getItem('wishes');
    const ids = saved ? JSON.parse(saved) as string[] : [];
    const updated = ids.includes(id) ? ids.filter(w => w !== id) : [...ids, id];
    localStorage.setItem('wishes', JSON.stringify(updated));
    setWished(!wished);
  };

  return (
    <button onClick={toggle} style={{ background: 'none', border: '2px solid #e52c2c', borderRadius: '50px', padding: '10px 20px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '17px', fontWeight: 700, color: '#e52c2c', width: '100%', justifyContent: 'center' }}>
    <Heart size={16} color={wished ? '#e52c2c' : '#e52c2c'} fill={wished ? '#e52c2c' : 'none'} />
    {wished ? '찜 취소' : '찜하기'}
    </button>
  );
}