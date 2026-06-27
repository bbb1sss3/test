import Link from 'next/link';

export const metadata = {
  title: '개인정보처리방침 | Premy(프리미)',
  description: 'Premy(프리미) 개인정보처리방침',
};

export default function PrivacyPage() {
  return (
    <main style={{ background: '#fff', minHeight: '100vh' }}>
      <style>{`
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { font-family: 'Apple SD Gothic Neo', 'Noto Sans KR', sans-serif; }
        .header { background: #fff; border-bottom: 1px solid #e8e8e8; height: 56px; display: flex; align-items: center; position: sticky; top: 0; z-index: 100; }
        .header-inner { max-width: 1100px; margin: 0 auto; padding: 0 1.5rem; width: 100%; display: flex; align-items: center; }
        .logo { font-size: 26px; font-weight: 900; color: #111; letter-spacing: -1px; text-decoration: none; }
        .logo span { color: #e52c2c; }
        .container { max-width: 780px; margin: 0 auto; padding: 3rem 1.5rem; }
        h1 { font-size: 24px; font-weight: 900; color: #111; margin-bottom: 2rem; }
        h2 { font-size: 16px; font-weight: 800; color: #111; margin: 2rem 0 0.75rem; }
        p { font-size: 14px; color: #444; line-height: 1.8; margin-bottom: 0.5rem; }
        .footer { border-top: 1px solid #e8e8e8; background: #111; margin-top: 4rem; }
        .footer-inner { max-width: 1100px; margin: 0 auto; padding: 1rem 1.5rem; text-align: center; }
        .footer p { font-size: 12px; color: #999; }
        @media (max-width: 768px) { .container { padding: 2rem 1rem; } }
      `}</style>

      <header className="header">
        <div className="header-inner">
          <Link href="/" className="logo">PRE<span>MY</span><small style={{ fontSize: '12px', fontWeight: 400, color: '#aaa', marginLeft: '8px' }}>프리미</small></Link>
        </div>
      </header>

      <div className="container">
        <h1>개인정보처리방침</h1>

        <h2>1. 수집하는 정보</h2>
        <p>Premy(프리미)는 별도의 회원가입 없이 이용 가능하며, 개인정보를 직접 수집하지 않습니다.</p>
        <p>다만, Google Analytics를 통해 방문자의 접속 통계(방문 페이지, 체류 시간, 접속 기기 등)가 익명으로 수집될 수 있습니다.</p>

        <h2>2. 쿠키 사용</h2>
        <p>본 사이트는 Google Analytics 운영을 위해 쿠키를 사용합니다. 브라우저 설정에서 쿠키를 거부할 수 있으나, 일부 기능이 제한될 수 있습니다.</p>

        <h2>3. 제3자 서비스</h2>
        <p>본 사이트는 쿠팡 파트너스 및 아이허브 제휴 프로그램에 참여하고 있습니다. 제휴 링크를 통해 구매 시 일정 수수료를 받을 수 있으며, 구매자에게 추가 비용은 발생하지 않습니다.</p>
        <p>Google Analytics의 개인정보 처리에 대한 자세한 내용은 Google 개인정보처리방침을 참고하세요.</p>

        <h2>4. 문의</h2>
        <p>개인정보 관련 문의사항이 있으시면 아래로 연락해 주세요.</p>
        <p>이메일: bbb1sss3@gmail.com</p>

        <h2>5. 시행일</h2>
        <p>본 방침은 2026년 1월 1일부터 시행됩니다.</p>
      </div>

      <footer className="footer">
        <div className="footer-inner"><p>© 2026 Premy(프리미)</p></div>
      </footer>
    </main>
  );
}