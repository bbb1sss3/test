import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: 'Premy - 프리미엄 가전 큐레이션',
  description: '노트북, 냉장고, TV, 청소기 등 고가 가전제품을 직접 선별한 프리미엄 쿠팡 파트너스 추천 사이트',
  keywords: '노트북추천, 냉장고추천, TV추천, 청소기추천, 프리미엄가전, 쿠팡추천',
  openGraph: {
    title: 'Premy - 프리미엄 가전 큐레이션',
    description: '직접 고른 프리미엄 가전만 모았습니다',
    locale: 'ko_KR',
    type: 'website',
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

