export default function Loading() {
  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: '#fff'
    }}>
      <style>{`
        .bar-logo span { color: #e52c2c; }
        .bar { height: 3px; background: #f0f0f0; border-radius: 3px; overflow: hidden; width: 200px; }
        .bar-inner { height: 100%; background: #e52c2c; border-radius: 3px; animation: bar 1.5s ease-in-out infinite; }
        .bar-sub { font-size: 11px; color: #aaa; margin-top: 8px; text-align: center; }
        @keyframes bar { 0% { width: 0%; margin-left: 0; } 50% { width: 60%; margin-left: 20%; } 100% { width: 0%; margin-left: 100%; } }
      `}</style>
      <div style={{ textAlign: 'center' }}>
        <div className="bar-logo" style={{ fontSize: '22px', fontWeight: 900, letterSpacing: '-1px', marginBottom: '1rem' }}>
          PRE<span style={{ color: '#e52c2c' }}>MY</span>
        </div>
        <div className="bar"><div className="bar-inner" /></div>
        <div className="bar-sub">상품 정보를 불러오는 중..</div>
      </div>
    </div>
  );
}