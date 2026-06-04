export default function Loading() {
  return (
    <div style={{ 
      minHeight: '100vh', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center',
      background: '#fff'
    }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontSize: '22px', fontWeight: 900, letterSpacing: '-1px', marginBottom: '1rem' }}>
          PRE<span style={{ color: '#e52c2c' }}>MY</span>
        </div>
        <div style={{ fontSize: '13px', color: '#aaa' }}>상품 정보를 불러오는 중...</div>
      </div>
    </div>
  );
}