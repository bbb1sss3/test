import Image from "next/image";
import { Client } from "@notionhq/client";
import Link from "next/link";
import ShareButton from "./ShareButton";
import ReactMarkdown from 'react-markdown';
import { notFound } from 'next/navigation';
import ScrollTop from './ScrollTop';
import RelatedProducts from './RelatedProducts';
import React from 'react'
export const revalidate = 3600;

const notion = new Client({ auth: process.env.NOTION_API_KEY });

const rawId = process.env.NOTION_DATABASE_ID!;
const dbId = rawId.includes('-')
  ? rawId
  : rawId.replace(/^(.{8})(.{4})(.{4})(.{4})(.{12})$/, '$1-$2-$3-$4-$5');

async function getProduct(slug: string) {
  const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/.test(slug);

  if (isUUID) {
    const page = await notion.pages.retrieve({ page_id: slug }) as any;
    return {
      id: page.id,
      name: page.properties.Name?.title?.[0]?.plain_text ?? '',
      category: page.properties.카테고리?.select?.name ?? '',
      image: page.properties.이미지?.url ?? '',
      link: page.properties.쿠팡링크?.url ?? '',
      desc: page.properties.설명?.rich_text?.[0]?.plain_text ?? '',
      badge: page.properties.뱃지?.select?.name ?? '',
      price: page.properties.가격?.rich_text?.[0]?.plain_text ?? '',
      discount: page.properties.할인율?.rich_text?.[0]?.plain_text ?? '',
      rating: page.properties.별점?.rich_text?.[0]?.plain_text ?? '',
      originalPrice: page.properties.원가?.rich_text?.[0]?.plain_text ?? '',
      hanmadi: page.properties.한마디?.rich_text?.[0]?.plain_text ?? '',
      tag: page.properties.태그?.rich_text?.[0]?.plain_text ?? '',
      compare: page.properties.비교?.rich_text?.[0]?.plain_text ?? '',
      isRocket: page.properties.로켓배송?.checkbox ?? false,
      isFreeShipping: page.properties.무료배송?.checkbox ?? false,
      keyword: page.properties.키워드?.rich_text?.[0]?.plain_text ?? '',
      slug: page.properties.슬러그?.rich_text?.[0]?.plain_text ?? '',
      iherbLink: page.properties.아이허브링크?.url ?? '',
    };
  }

  const response = await notion.dataSources.query({
    data_source_id: dbId,
    filter: {
      property: '슬러그',
      rich_text: { equals: slug },
    },
  });

  if (!response.results.length) return null;
  const page = response.results[0] as any;

  return {
    id: page.id,
    name: page.properties.Name?.title?.[0]?.plain_text ?? '',
    category: page.properties.카테고리?.select?.name ?? '',
    image: page.properties.이미지?.url ?? '',
    link: page.properties.쿠팡링크?.url ?? '',
    desc: page.properties.설명?.rich_text?.[0]?.plain_text ?? '',
    badge: page.properties.뱃지?.select?.name ?? '',
    price: page.properties.가격?.rich_text?.[0]?.plain_text ?? '',
    discount: page.properties.할인율?.rich_text?.[0]?.plain_text ?? '',
    rating: page.properties.별점?.rich_text?.[0]?.plain_text ?? '',
    originalPrice: page.properties.원가?.rich_text?.[0]?.plain_text ?? '',
    hanmadi: page.properties.한마디?.rich_text?.[0]?.plain_text ?? '',
    tag: page.properties.태그?.rich_text?.[0]?.plain_text ?? '',
    compare: page.properties.비교?.rich_text?.[0]?.plain_text ?? '',
    isRocket: page.properties.로켓배송?.checkbox ?? false,
    isFreeShipping: page.properties.무료배송?.checkbox ?? false,
    keyword: page.properties.키워드?.rich_text?.[0]?.plain_text ?? '',
    slug: page.properties.슬러그?.rich_text?.[0]?.plain_text ?? '',
    iherbLink: page.properties.아이허브링크?.url ?? '',
  };
}



function CompareTable({ text }: { text: string }) {
  const rows = text.trim().split('\n').map(row => row.split('|'));
  if (rows.length < 2) return <div className="compare-text">{text}</div>;
  const headers = rows[0];
  const dataRows = rows.slice(1);
  return (
    <table>
      <thead>
        <tr>
          {headers.map((h, i) => <th key={i}>{h}</th>)}
        </tr>
      </thead>
      <tbody>
        {dataRows.map((row, i) => (
          <tr key={i}>
            {row.map((cell, j) => <td key={j}>{cell}</td>)}
          </tr>
        ))}
      </tbody>
    </table>
  );
}

function Stars({ rating }: { rating: string }) {
  const num = parseFloat(rating);
  if (!num) return null;
  const full = Math.floor(num);
  const half = num % 1 >= 0.5;
  return (
    <div style={{ fontSize: '16px', color: '#f5a623', marginBottom: '8px' }}>
      {'★'.repeat(half ? full + 1 : full)}{'☆'.repeat(half ? 4 - full : 5 - full)}
      <span style={{ color: '#aaa', fontSize: '13px', marginLeft: '4px' }}>{rating}</span>
    </div>
  );
}



export async function generateMetadata({ params }: { params: { slug: string } }) {
  const product = await getProduct(params.slug);
  if (!product) return { title: 'Premy(프리미)' };
  const cleanDesc = (product.desc || '').replace(/##[^\n]*/g, '').replace(/\n+/g, ' ').trim()
  const sentences = cleanDesc.match(/[^.!?]+[.!?]+/g) || [];
  let metaDesc = '';
  const suffix = ' 장단점, 타사 비교 정보를 확인해보세요.';
  for (const s of sentences) {
    if ((metaDesc + s + suffix).length > 150) break;
    metaDesc += s;
  }
  metaDesc = (metaDesc || cleanDesc.slice(0, 120)) + suffix;
  const keywords = product.tag
    ? product.tag.split(',').map((t: string) => t.trim().replace('#', '')).join(',')
    : `${product.category}추천,프리미엄가전,${product.name}`;

  return {
    title: `${product.name} | Premy(프리미) - 프리미엄 가전 큐레이션`,
    description: metaDesc,
    keywords,
    openGraph: {
      title: `${product.name} | Premy(프리미)`,
      description: metaDesc,
      images: product.image ? [{ url: product.image, alt: product.name }] : [],
      locale: 'ko_KR',
      type: 'website',
      siteName: 'Premy(프리미)',
    },
  };
}

export default async function ProductPage({ params }: { params: { slug: string } }) {
  const product = await getProduct(params.slug);
  if (!product) notFound();


  const css = `
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { font-family: 'Apple SD Gothic Neo', 'Noto Sans KR', sans-serif; background: #fff; color: #111; }

  .header { background: #fff; border-bottom: 1px solid #e8e8e8; padding: 0; display: flex; align-items: center; height: 56px; position: sticky; top: 0; z-index: 100; }
  .header-inner { max-width: 1100px; margin: 0 auto; padding: 0 1.5rem; width: 100%; display: flex; align-items: center; height: 100%; }
  .logo { font-size: 26px; font-weight: 900; color: #111; letter-spacing: -1px; text-decoration: none; }
  .logo span { color: #e52c2c; }

  .breadcrumb { max-width: 1100px; margin: 0 auto; padding: 1rem 1.5rem; font-size: 14px; color: #555; display: flex; align-items: center; justify-content: flex-start; gap: 8px; overflow: hidden; white-space: nowrap; }
  .breadcrumb span:last-child { overflow: hidden; text-overflow: ellipsis; }
  .breadcrumb a { color: #333; text-decoration: none; font-weight: 700; }
  .breadcrumb a:hover { color: #e52c2c; }

  .container { max-width: 1100px; margin: 0 auto; padding: 2rem 1.5rem; }
  .product-wrap { display: grid; grid-template-columns: 1fr 1fr; gap: 3rem; margin-bottom: 4rem; }
  .product-img { aspect-ratio: 1; background: #f9f9f9; border-radius: 12px; overflow: hidden; display: flex; align-items: center; justify-content: center; font-size: 80px; position: sticky; top: 80px; }
  .product-img img { width: 100%; height: 100%; object-fit: cover; }
  .product-info { display: flex; flex-direction: column; gap: 12px; }
  .product-category { font-size: 12px; color: #333; font-weight: 700; }
  .product-name { font-size: 24px; font-weight: 800; color: #111; letter-spacing: -1px; line-height: 1.3; }
  .product-badge { display: inline-block; font-size: 11px; font-weight: 800; padding: 4px 10px; border-radius: 4px; }
  .badge-new { background: linear-gradient(135deg, #e52c2c, #ff6b6b); color: #fff; border-radius: 20px; box-shadow: 0 2px 8px rgba(229,44,44,0.4); }
  .badge-hot { background: linear-gradient(135deg, #B8860B, #D4A017, #B8860B); color: #fff; border-radius: 4px; box-shadow: 0 2px 8px rgba(184,134,11,0.4); }
  .badge-pick { background: linear-gradient(135deg, #666, #999, #666); color: #fff; border-radius: 4px; box-shadow: 0 2px 8px rgba(0,0,0,0.2); }

  .desc-box { background: #fff; border-radius: 8px; margin-bottom: 0.5rem; }
  .desc-title { font-size: 11px; font-weight: 800; color: #111; letter-spacing: 2px; text-transform: uppercase;  padding-bottom: 0.75rem; border-bottom: 2px solid #111; display: inline-block; }
 
.product-desc {
    font-size: 18px;
    color: #333;
    line-height: 1.8; /* 가독성을 위해 1.7 -> 1.8로 살짝 상향 추천 */
    letter-spacing: -0.02em;
    white-space: pre-wrap;
    word-break: keep-all;
     padding: 20px; /* 상하 여백을 좌우보다 넓게 주면 더 정돈되어 보임 */       
    max-width: 850px;
    
  
}
  .product-original-price { font-size: 14px; color: #aaa; text-decoration: line-through; }
  .product-discount { font-size: 14px; color: #e52c2c; font-weight: 700; }
  .product-price { font-size: 28px; font-weight: 900; color: #111; letter-spacing: -1px; }

  .delivery-badges { display: flex; gap: 0.5rem; flex-wrap: wrap; }
  .delivery-badge { display: flex; align-items: center; gap: 4px; padding: 5px 12px; border-radius: 20px; font-size: 12px; font-weight: 700; }
  .badge-rocket { background: #e3f2fd; color: #1565c0; }
  .badge-free { background: #e8f5e9; color: #2e7d32; }

  .share-btn { background: #fff; border: 2px solid #e52c2c; color: #e52c2c; padding: 14px 20px; border-radius: 50px; font-size: 14px; font-weight: 700; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 8px; width: 100%; transition: all 0.2s; box-shadow: 0 2px 8px rgba(229,44,44,0.15); }
  .share-btn:hover { background: #e52c2c; color: #fff; }
  .cta-btn { background: #e52c2c; color: #fff; border: none; width: 100%; padding: 18px; font-size: 17px; font-weight: 800; border-radius: 50px; cursor: pointer; text-align: center; text-decoration: none; display: block; margin-top: auto; box-shadow: 0 4px 12px rgba(229,44,44,0.3); }
  .cta-btn:hover { background: #c62020; }

  .hanmadi { background: linear-gradient(145deg, #202d3a, #1b2631); border-radius: 16px; padding: 2rem; border: 1px solid rgba(255,255,255,0.1); margin-bottom: 1.5rem; box-shadow: 0 10px 30px rgba(0,0,0,0.5); position: relative; overflow: hidden; }
  .hanmadi::before { content: ""; position: absolute; top: -5px; left: -25px; width: 90px; height: 25px; background: linear-gradient(135deg, #FFD700 0%, #D4A017 50%, #B8860B 100%); transform: rotate(-45deg); box-shadow: 0 0 15px rgba(255,215,0,0.5); z-index: 1; animation: shine 3s infinite linear; pointer-events: none; }
  @keyframes shine { 0% { opacity: 0.8; } 50% { opacity: 1; box-shadow: 0 0 30px rgba(255,215,0,0.9); } 100% { opacity: 0.8; } }
  .hanmadi-header { position: relative; z-index: 2; display: flex; align-items: center; gap: 15px; margin-bottom: 1.5rem; padding-bottom: 1rem; border-bottom: 1px solid rgba(255,255,255,0.05); }
  .hanmadi-avatar { width: 44px; height: 44px; background: radial-gradient(circle at 30% 30%, #fff, #bbb); border-radius: 12px; display: flex; align-items: center; justify-content: center; color: #1b2631; font-size: 22px; font-weight: 900; font-family: 'Arial Black', sans-serif; box-shadow: 0 4px 10px rgba(0,0,0,0.3); }
  .hanmadi-name { font-size: 15px; font-weight: 700; color: #fff; letter-spacing: 0.8px; }
  .hanmadi-role { font-size: 11px; color: #95a5a6; text-transform: uppercase; letter-spacing: 1.2px; }
  .hanmadi-badge { margin-left: auto; background: linear-gradient(135deg, #f1c40f, #e67e22); color: #000; font-size: 10px; font-weight: 900; padding: 4px 12px; border-radius: 6px; letter-spacing: 1px; text-transform: uppercase; }
.hanmadi-text {
    font-size: 18px;
    color: #ecf0f1;
    font-style: italic;
    line-height: 1.8;
    letter-spacing: 0.04em;
    
    /* 여기서 위로 끌어올립니다 */
    position: relative;
  
}

.hanmadi-text::before {
    content: '"';
    font-size: 24px;
    color: #ecf0f1;
    font-family: Georgia, serif;
    line-height: 0;
    vertical-align: middle; /* vertical-align은 middle 정도로 두고 위치는 top으로 제어 */
    margin-right: 4px;
}

.hanmadi-text::after {
    content: '"';
    font-size: 24px;
    color: #ecf0f1;
    font-family: Georgia, serif;
    line-height: 0;
    vertical-align: middle;
    margin-left: 4px;
}
  .tags { display: flex; flex-wrap: wrap; gap: 0.5rem; margin-bottom: 1rem; }
  .tag { background: #fff; border: 1.5px solid #e8e8e8; color: #555; font-size: 12px; font-weight: 600; padding: 5px 12px; border-radius: 20px; }

  .compare-box { background: #fff; border-radius: 8px; margin-bottom: 1rem; }
  .compare-title { font-size: 11px; font-weight: 800; color: #111; letter-spacing: 2px; text-transform: uppercase; margin-bottom: 1.3rem; padding-bottom: 0.75rem; border-bottom: 2px solid #111; display: inline-block; }
  .compare-text { font-size: 18px; color: #444; line-height: 1.8; letter-spacing: -0.01em; white-space: pre-wrap; word-break: keep-all; padding: 10px 0; }
 /* PC 및 가독성 개선 */
.compare-box thead th {
    padding: 16px 14px;
    background: #111;
    color: #fff;
    font-weight: 700;
    text-align: center; /* 중앙 정렬이 더 깔끔함 */
    font-size: 14px;
}

.compare-box tbody td {
    padding: 18px 14px;
    border-bottom: 1px solid #eee;
    color: #333;
    text-align: center; /* 데이터는 중앙 정렬이 비교하기 쉬움 */
}

/* 핵심: 첫 번째 열 고정 느낌 및 가독성 강조 */
.compare-box tbody td:first-child {
    background: #fcfcfc;
    font-weight: 800;
    text-align: left; /* 항목명은 왼쪽 정렬 */
    width: 25%;
}

.compare-box tbody td:nth-child(2) {
    background: #fffdf5; /* 강조할 열(한성) 배경색 살짝 추가 */
    color: #D4A017;
    font-weight: 800;
}

  .related-title { font-size: 18px; font-weight: 800; color: #111; margin-bottom: 1.25rem; }
  .related-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 1rem; }
  .related-card { text-decoration: none; display: block; }
  .related-img { aspect-ratio: 1; background: #f9f9f9; border-radius: 8px; overflow: hidden; display: flex; align-items: center; justify-content: center; font-size: 36px; margin-bottom: 8px; }
  .related-img img { width: 100%; height: 100%; object-fit: cover; }
  .related-name { font-size: 12px; color: #111; font-weight: 600; line-height: 1.4; overflow: hidden; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; }
  .related-price { font-size: 13px; color: #111; font-weight: 900; margin-top: 4px; }

  .footer { border-top: 1px solid #e8e8e8; background: #111; }
  .footer-inner { max-width: 1100px; margin: 0 auto; padding: 1rem 1.5rem; text-align: center; }
  .footer p { font-size: 12px; color: #999; line-height: 1.8; }

  .back-to-top { position: fixed; bottom: 2rem; right: 2rem; background: #111; color: #fff; border: none; width: 44px; height: 44px; border-radius: 50%; font-size: 18px; cursor: pointer; display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 12px rgba(0,0,0,0.2); z-index: 100; text-decoration: none; }
  .back-to-top:hover { background: #e52c2c; }
.product-desc h2 { font-size: 17px; font-weight: 800; color: #111; margin: 0.3em 0 0 0; }
.product-desc h3 { font-size: 15px; font-weight: 700; color: #333; }
.product-desc ul {
  margin: 0;
  padding-left: 1.2em;
  list-style-type: disc;
}
.product-desc li {
  margin: 0;
  padding: 0;
  line-height: 1.6;
}
.product-desc li + li {
  margin-top: 0;
}

  @media (max-width: 768px) {
    .header-inner { padding: 0 1rem; }
    .breadcrumb { padding: 1rem; }
    .container { padding: 1rem; }
    .product-wrap { grid-template-columns: 1fr; gap: 1.5rem; }
    .product-img { position: static; }
    .product-name { font-size: 20px; }
    .product-price { font-size: 24px; }
    .related-grid { grid-template-columns: repeat(2, 1fr); }
     .product-desc h2 { font-size: 15px;  }
     .product-desc h3 { font-size: 13px; }
     .tags { flex-wrap: wrap; }
  .tag { word-break: break-all; }
   
.product-desc {
        /* 1. 폰트 크기: 너무 크지도 작지도 않은 16px */
        font-size: 16px;
        
        /* 2. 패딩: 좌우 여백을 주어 글자가 화면 끝에 붙지 않게 함 */
        padding: 20px 15px;
        
        /* 3. 줄 간격: 모바일은 한 줄이 짧으므로 줄 간격을 여유 있게 */
        line-height: 1.7;     
        
        /* 5. 너비: 화면 너비를 100%로 쓰되, 여백(padding) 계산 고려 */
        width: 100%;
        box-sizing: border-box;
        overflow-x: hidden; word-break: break-all;
    }
    
    .hanmadi { padding: 1rem; }
    .hanmadi::before { width: 70px; height: 20px; top: -5px; left: -20px; }
    .hanmadi-header { gap: 10px; }
    .hanmadi-avatar { width: 32px; height: 32px; font-size: 14px; }
    .hanmadi-name { font-size: 12px; }
    .hanmadi-role { font-size: 10px; }
    .hanmadi-badge { font-size: 8px; padding: 3px 8px; }
    .hanmadi-text { font-size: 16px; line-height: 1.7;font-style: italic;position: relative; top: -10px; margin-bottom: -10px; }
    .hanmadi-text::before, .hanmadi-text::after { font-size: 20px; vertical-align: -5px; }
    .tag { font-size: 11px; padding: 4px 10px; }
    .compare-text { font-size: 16px; line-height: 1.6; padding: 5px 10px; }
.compare-box table { 
        font-size: 13px; 
        line-height: 1.4; /* 텍스트 줄 간격 확보 */
    }
    .compare-box thead th { 
        padding: 10px 8px; /* 위아래 패딩을 살짝 키워 터치 영역 확보 */
        font-size: 12px; 
    }
    .compare-box tbody td { 
        padding: 12px 8px; /* 글자가 많을 때 행 높이를 확보해 가독성 개선 */
        word-break: keep-all; /* 단어 단위로 줄바꿈하여 가독성 증대 */
    }
         .compare-title { margin-bottom: 1.3rem;}
    .back-to-top { bottom: 1.5rem; right: 1rem; }
  }
`;

  return (
    <main style={{ background: '#fff', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <style dangerouslySetInnerHTML={{ __html: css }} />

      <header className="header">
        <div className="header-inner">
          <Link href="/" className="logo">PRE<span>MY</span><small style={{ fontSize: '12px', fontWeight: 400, color: '#aaa', marginLeft: '8px', letterSpacing: 0 }}>프리미</small></Link>
        </div>
      </header>



      <div className="container" style={{ flex: 1 }}>
        <div className="breadcrumb">
          <Link href="/">홈</Link>
          <span>›</span>
          <span>{product.category}</span>
          <span>›</span>
          <span>{product.name.slice(0, 20)}...</span>
        </div>
        <div className="product-wrap">
          <div className="product-img">
            {product.image
              ? <Image src={product.image} alt={product.name} width={600} height={600} style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '12px' }} />
              : '🛒'
            }
          </div>
          <div className="product-info">
            <div className="product-category">{product.category}</div>
            <div style={{ display: 'flex' }}>
              {product.badge && (
                <span className={`product-badge ${product.badge === 'NEW' ? 'badge-new' : product.badge === '인기' ? 'badge-hot' : 'badge-pick'}`}>
                  {product.badge === 'NEW' ? 'NEW' : product.badge === '인기' ? '🥇 BEST' : '⭐ 추천'}
                </span>
              )}
            </div>
            <div className="product-name">{product.name}</div>
            <Stars rating={product.rating} />
            {(product.isRocket || product.isFreeShipping) && (
              <div className="delivery-badges">
                {product.isRocket && <div className="delivery-badge badge-rocket">🚀 로켓배송</div>}
                {product.isFreeShipping && <div className="delivery-badge badge-free">✓ 무료배송</div>}
              </div>
            )}
            <div>
              {product.originalPrice && <div className="product-original-price">{product.originalPrice}</div>}
              {product.discount && <div className="product-discount">{product.discount} 할인</div>}
              {product.price && <div className="product-price">{product.price}</div>}
            </div>


            {product.desc && (
              <div className="desc-box">
                <div className="desc-title">DESCRIPTION</div>
                <div className="product-desc">
                  <ReactMarkdown
                    components={{
                      ul: (props) => (
                        <ul style={{ margin: '0.2em 0', paddingLeft: '1.2em' }}>{props.children}</ul>
                      ),
                      li: (props) => (
                        <li style={{ margin: '0', lineHeight: '1.6' }}>
                          {React.Children.map(props.children as React.ReactNode, child =>
                            React.isValidElement(child) && (child as any).type === 'p'
                              ? (child as any).props.children
                              : child
                          )}
                        </li>
                      ),
                      p: (props) => (
                        <p style={{ margin: '0.4em 0' }}>{props.children}</p>
                      ),
                    }}
                  >
                    {product.desc}
                  </ReactMarkdown>
                </div>
              </div>
            )}


            {product.hanmadi && (
              <div className="hanmadi">
                <div className="hanmadi-header">
                  <div className="hanmadi-avatar">P</div>
                  <div>
                    <div className="hanmadi-name">PREMY 에디터</div>
                    <div className="hanmadi-role">프리미엄 가전 큐레이터</div>
                  </div>

                </div>
                <div className="hanmadi-text">{product.hanmadi}</div>
              </div>
            )}

            {product.tag && (
              <div className="tags">
                {product.tag.split(',').map((t: string, i: number) => (
                  <span key={i} className="tag">{t.trim()}</span>
                ))}
              </div>
            )}

            {product.compare && (
              <div className="compare-box">
                <h2 className="compare-title">COMPARISON</h2>
                <CompareTable text={product.compare} />
              </div>
            )}

            <ShareButton name={product.name} />
            {product.link && (
              <a href={product.link} target="_blank" rel="noopener noreferrer sponsored" className="cta-btn" style={{ marginTop: '8px' }}>
                {product.keyword || product.category} 쿠팡 최저가 확인
              </a>
            )}
            {product.iherbLink && (
              <a href={product.iherbLink} target="_blank" rel="noopener noreferrer sponsored" className="cta-btn" style={{ background: '#2d8a4e', marginTop: '8px' }}>
                {product.keyword || product.category} 아이허브 최저가 확인
              </a>
            )}
            <p style={{ fontSize: '12px', color: '#aaa', textAlign: 'center', marginTop: '8px' }}>
              이 링크는 쿠팡 파트너스 제휴 링크로, 구매 시 판매자로부터 일정 수수료를 받을 수 있습니다. 구매자에게는 추가 비용이 발생하지 않습니다.
            </p>
          </div>
        </div>

        <RelatedProducts category={product!.category} currentId={product!.id} />
      </div>

      <footer className="footer">
        <div className="footer-inner">
          <p>© 2026 Premy(프리미)</p>
        </div>
      </footer>
      <ScrollTop />

    </main>
  );
}