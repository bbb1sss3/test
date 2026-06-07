import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: 'Premy(프리미) - 프리미엄 가전 큐레이션',
  description: '노트북, 냉장고, TV, 청소기 등 고가 가전제품을 직접 선별한 프리미엄 추천 사이트',
  keywords: '노트북추천, 냉장고추천, TV추천, 청소기추천, 프리미엄가전, 쿠팡추천, 프리미, 프리미가전, 가전큐레이션',
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
      <body>{children}</body>
    </html>
  );
}

