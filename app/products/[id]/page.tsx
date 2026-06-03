import { Client } from "@notionhq/client";
import Link from "next/link";

export const revalidate = 3600;

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
      {'★'.repeat(full)}{half ? '½' : ''}{'☆'.repeat(5 - full - (half ? 1 : 0))}
      <span style={{ color: '#aaa', fontSize: '13px', marginLeft: '4px' }}>{rating}</span>
    </div>
  );
}

export default async function ProductPage({ params }: { params: { id: string } }) {
  const product = await getProduct(params.id);
  const related = await getRelated(product.category, product.id);

  const css = `
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: 'Apple SD Gothic Neo', 'Noto Sans KR', sans-serif; background: #fff; color: #111; }
    .header { background: #fff; border-bottom: 1px solid #e8e8e8; padding: 0 2rem; display: flex; align-items: center; height: 56px; position: sticky; top: 0; z-index: 100; }
    .logo { font-size: 22px; font-weight: 900; color: #111; letter-spacing: -1px; text-decoration: none; }
    .logo span { color: #e52c2c; }
    .breadcrumb { padding: 1rem 2rem; font-size: 13px; color: #aaa; display: flex; align-items: center; gap: 8px; }
    .breadcrumb a { color: #aaa; text-decoration: none; }
    .breadcrumb a:hover { color: #111; }
    .container { max-width: 1100px; margin: 0 auto; padding: 2rem; }
    .product-wrap { display: grid; grid-template-columns: 1fr 1fr; gap: 3rem; margin-bottom: 4rem; }
    .product-img { aspect-ratio: 1; background: #f9f9f9; border-radius: 12px; overflow: hidden; display: flex; align-items: center; justify-content: center; font-size: 80px; }
    .product-img img { width: 100%; height: 100%; object-fit: cover; }
    .product-info { display: flex; flex-direction: column; gap: 12px; }
    .product-category { font-size: 12px; color: #e52c2c; font-weight: 700; }
    .product-name { font-size: 24px; font-weight: 800; color: #111; letter-spacing: -1px; line-height: 1.3; }
    .product-badge { display: inline-block; font-size: 11px; font-weight: 800; padding: 4px 10px; border-radius: 4px; }
    .badge-new { background: #e52c2c; color: #fff; }
    .badge-hot { background: #ff6b00; color: #fff; }
    .product-desc { font-size: 14px; color: #666; line-height: 1.8; padding: 1rem; background: #f9f9f9; border-radius: 8px; }
    .product-original-price { font-size: 14px; color: #aaa; text-decoration: line-through; }
    .product-discount { font-size: 14px; color: #e52c2c; font-weight: 700; }
    .product-price { font-size: 28px; font-weight: 900; color: #111; letter-spacing: -1px; }
    .share-btn { background: #fff; border: 1px solid #e8e8e8; color: #555; padding: 10px 20px; border-radius: 6px; font-size: 13px; font-weight: 600; cursor: pointer; display: flex; align-items: center; gap: 6px; }
    .cta-btn { background: #e52c2c; color: #fff; border: none; width: 100%; padding: 16px; font-size: 16px; font-weight: 800; border-radius: 8px; cursor: pointer; text-align: center; text-decoration: none; display: block; margin-top: auto; }
    .related-title { font-size: 18px; font-weight: 800; color: #111; margin-bottom: 1.25rem; }
    .related-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 1rem; }
    .related-card { text-decoration: none; display: block; }
    .related-img { aspect-ratio: 1; background: #f9f9f9; border-radius: 8px; overflow: hidden; display: flex; align-items: center; justify-content: center; font-size: 36px; margin-bottom: 8px; }
    .related-img img { width: 100%; height: 100%; object-fit: cover; }
    .related-name { font-size: 12px; color: #111; font-weight: 600; line-height: 1.4; overflow: hidden; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; }
    .related-price { font-size: 13px; color: #111; font-weight: 900; margin-top: 4px; }
    .footer { border-top: 1px solid #e8e8e8; padding: 1rem 2rem; text-align: center; background: #111; }
    .footer p { font-size: 11px; color: #666; line-height: 1.7; }
    @media (max-width: 768px) {
      .container { padding: 1rem; }
      .product-wrap { grid-template-columns: 1fr; gap: 1.5rem; }
      .product-name { font-size: 20px; }
      .product-price { font-size: 24px; }
      .related-grid { grid-template-columns: repeat(2, 1fr); }
    }
  `;

  return (
    <main style={{ background: '#fff', minHeight: '100vh' }}>
      <style dangerouslySetInnerHTML={{ __html: css }} />

      <header className="header">
        <Link href="/" className="logo">PRE<span>MY</span></Link>
      </header>

      <div className="breadcrumb">
        <Link href="/">홈</Link>
        <span>›</span>
        <span>{product.category}</span>
        <span>›</span>
        <span>{product.name.slice(0, 20)}...</span>
      </div>

      <div className="container">
        <div className="product-wrap">
          <div className="product-img">
            {product.image ? <img src={product.image} alt={product.name} /> : '🛒'}
          </div>
          <div className="product-info">
            <div className="product-category">{product.category}</div>
            {product.badge && (
              <span className={`product-badge ${product.badge === 'NEW' ? 'badge-new' : 'badge-hot'}`}>
                {product.badge}
              </span>
            )}
            <div className="product-name">{product.name}</div>
            <Stars rating={product.rating} />
            {product.desc && <div className="product-desc">{product.desc}</div>}
            <div>
              {product.originalPrice && <div className="product-original-price">{product.originalPrice}</div>}
              {product.discount && <div className="product-discount">{product.discount} 할인</div>}
              {product.price && <div className="product-price">{product.price}</div>}
            </div>
            <ShareButton name={product.name} />
            <a href={product.link} target="_blank" rel="noopener noreferrer" className="cta-btn">
              쿠팡에서 구매하기 →
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
                    {p.image ? <img src={p.image} alt={p.name} /> : '🛒'}
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
        <p>© 2026 Premy &nbsp;·&nbsp; 본 사이트는 쿠팡 파트너스 제휴 마케팅 프로그램에 참여하고 있으며, 링크를 통해 구매 시 일정 수수료를 받을 수 있습니다. 최종 가격은 쿠팡에서 확인하시기 바랍니다.</p>
      </footer>
    </main>
  );
}

function ShareButton({ name }: { name: string }) {
  return (
    <button
      className="share-btn"
      onClick={() => {
        if (navigator.share) {
          navigator.share({ title: name, url: window.location.href });
        } else {
          navigator.clipboard.writeText(window.location.href);
          alert('링크가 복사되었습니다!');
        }
      }}
    >
      🔗 공유하기
    </button>
  );
}