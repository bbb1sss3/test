import Image from "next/image";
import { Client } from "@notionhq/client";
import Link from "next/link";
import ShareButton from "./ShareButton";
export const revalidate = 60;

const notion = new Client({ auth: process.env.NOTION_API_KEY });

const rawId = process.env.NOTION_DATABASE_ID!;
const dbId = rawId.includes('-')
  ? rawId
  : rawId.replace(/^(.{8})(.{4})(.{4})(.{4})(.{12})$/, '$1-$2-$3-$4-$5');

async function getProduct(id: string) {
  const page = await notion.pages.retrieve({ page_id: id }) as any;
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
  };
}

async function getRelated(category: string, currentId: string) {
  const response = await notion.dataSources.query({ data_source_id: dbId });
  return response.results
    .map((page: any) => ({
      id: page.id,
      name: page.properties.Name?.title?.[0]?.plain_text ?? '',
      category: page.properties.카테고리?.select?.name ?? '',
      image: page.properties.이미지?.url ?? '',
      price: page.properties.가격?.rich_text?.[0]?.plain_text ?? '',
    }))
    .filter(p => p.category === category && p.id !== currentId)
    .slice(0, 4);
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

export async function generateMetadata({ params }: { params: { id: string } }) {
  const product = await getProduct(params.id);
  return {
    title: `${product.name} | Premy`,
    description: product.desc || `${product.category} 추천 - ${product.name}`,
    keywords: product.tag || `${product.category}, 쿠팡추천, 프리미엄가전`,
    openGraph: {
      title: `${product.name} | Premy`,
      description: product.desc || `${product.category} 추천 - ${product.name}`,
      images: product.image ? [{ url: product.image }] : [],
      locale: 'ko_KR',
      type: 'website',
    },
  };
}

export default async function ProductPage({ params }: { params: { id: string } }) {
  const product = await getProduct(params.id);
  const related = await getRelated(product.category, product.id);

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

   .desc-box { background: #fff; border-radius: 8px;  margin-bottom: 0.5rem; }
.desc-title { font-size: 11px; font-weight: 800; color: #111; letter-spacing: 2px; text-transform: uppercase; margin-bottom: 0.75rem; padding-bottom: 0.75rem; border-bottom: 2px solid #111; display: inline-block; }
.product-desc { font-size: 15px; color: #666; line-height: 1.9; white-space: pre-wrap; background: none; padding: 0; border: none; border-radius: 0; }
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

.hanmadi { background: #fafafa; border-radius: 12px; padding: 1.5rem; border: 1px solid #eee; margin-bottom: 1rem; }
.hanmadi-header { display: flex; align-items: center; gap: 10px; margin-bottom: 1rem; padding-bottom: 1rem; border-bottom: 1px solid #eee; }
.hanmadi-avatar { width: 40px; height: 40px; background: #e52c2c; border-radius: 8px; display: flex; align-items: center; justify-content: center; color: #fff; font-size: 20px; font-weight: 900; flex-shrink: 0; font-family: 'Arial Black', sans-serif; }
.hanmadi-name { font-size: 13px; font-weight: 800; color: #111; }
.hanmadi-role { font-size: 11px; color: #aaa; }
.hanmadi-badge { margin-left: auto; background: linear-gradient(135deg, #B8860B, #D4A017); color: #fff; font-size: 9px; font-weight: 800; padding: 3px 10px; border-radius: 20px; letter-spacing: 1px; }
.hanmadi-text { font-size: 16px; color: #222; line-height: 1.9; font-style: italic; }

    .tags { display: flex; flex-wrap: wrap; gap: 0.5rem; margin-bottom: 1rem; }
    .tag { background: #fff; border: 1.5px solid #e8e8e8; color: #555; font-size: 12px; font-weight: 600; padding: 5px 12px; border-radius: 20px; }
.compare-box { background: #fff; border-radius: 8px; margin-bottom: 1rem; }
.compare-title { font-size: 11px; font-weight: 800; color: #111; letter-spacing: 2px; text-transform: uppercase; margin-bottom: 0.75rem; padding-bottom: 0.75rem; border-bottom: 2px solid #111; display: inline-block; }
.compare-text { font-size: 15px; color: #666; line-height: 2; white-space: pre-wrap; }

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

    @media (max-width: 768px) {
      .header-inner { padding: 0 1rem; }
      .breadcrumb { padding: 1rem; }
      .container { padding: 1rem; }
      .product-wrap { grid-template-columns: 1fr; gap: 1.5rem; }
      .product-img { position: static; }
      .product-name { font-size: 20px; }
      .product-price { font-size: 24px; }
      .related-grid { grid-template-columns: repeat(2, 1fr); }
      .hanmadi { padding: 1.25rem; }
      .hanmadi-text { font-size: 18px; }
      .tag { font-size: 11px; padding: 4px 10px; }
      .compare-box { padding: 0.875rem; }
      .compare-text { font-size: 16px; }
      .product-desc { font-size: 16px; }
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
                <div className="product-desc">{product.desc}</div>
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
                <div className="hanmadi-badge">✦ PICK</div>
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
                <div className="compare-title">COMPARISON</div>
                <div className="compare-text">{product.compare}</div>
              </div>
            )}

            <ShareButton name={product.name} />
            <a href={product.link} target="_blank" rel="noopener noreferrer" className="cta-btn">
              쿠팡 최저가 보러가기
            </a>
          </div>
        </div>

        {related.length > 0 && (
          <div>
            <div className="related-title">연관 상품</div>
            <div className="related-grid">
              {related.map(p => (
                <Link key={p.id} href={`/products/${p.id}`} className="related-card">
                  <div className="related-img">
                    {p.image
                      ? <Image src={p.image} alt={p.name} width={200} height={200} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      : '🛒'
                    }
                  </div>
                  <div className="related-name">{p.name}</div>
                  <div className="related-price">{p.price}</div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>

      <footer className="footer">
        <div className="footer-inner">
          <p>© 2026 Premy(프리미) &nbsp;·&nbsp; 본 사이트는 쿠팡 파트너스 제휴 마케팅 프로그램에 참여하고 있으며, 링크를 통해 구매 시 일정 수수료를 받을 수 있습니다. 최종 가격은 쿠팡에서 확인하시기 바랍니다.</p>
        </div>
      </footer>

      <a href="#" className="back-to-top">↑</a>
    </main>
  );
}