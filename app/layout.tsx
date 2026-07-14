import type { Metadata } from "next";
import "./globals.css";
import Script from 'next/script';

export const metadata: Metadata = {
  title: 'Premy(프리미) - 프리미엄 가전·영양제 큐레이션',
  description: '노트북, 냉장고, TV, 청소기, 영양제 등 프리미엄 제품을 직접 선별한 추천 사이트',
  keywords: '노트북추천, 냉장고추천, TV추천, 청소기추천, 영양제추천, 프리미엄가전, 프리미, 가전큐레이션',
  openGraph: {
    title: 'Premy(프리미) - 프리미엄 가전 큐레이션',
    description: '직접 고른 프리미엄 가전만 모았습니다',
    locale: 'ko_KR',
    type: 'website',
  },
  verification: {
    google: 'Y4YM8WG3OWA-j2nL8ZVXQw6AcPaJiskBFunJzpVFSKo',
    other: {
      'naver-site-verification': 'b33fefbf7c5830931df331f5a66daf0146e683e3',
    },
  },
  other: {
    'google-adsense-account': 'ca-pub-7008742089841545',
  },
  icons: {
    icon: '/favicon.svg',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <body>
        {children}
        <Script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-7008742089841545"
          crossOrigin="anonymous"
          strategy="afterInteractive"
        />
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-0ZH4DXB4E6"
          strategy="afterInteractive"
        />
        <Script id="ga4" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-0ZH4DXB4E6');
          `}
        </Script>
      </body>
    </html>
  );
}