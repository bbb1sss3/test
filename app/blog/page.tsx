import Link from "next/link";
import { unstable_cache } from "next/cache";

export const revalidate = 3600;

const rawId = process.env.NOTION_BLOG_DATABASE_ID!;
const dbId = rawId.includes('-')
  ? rawId
  : rawId.replace(/^(.{8})(.{4})(.{4})(.{4})(.{12})$/, '$1-$2-$3-$4-$5');

const getPosts = unstable_cache(
  async () => {
    try {
      let allResults: any[] = [];
      let cursor: string | undefined = undefined;
      do {
        const res: Response = await fetch(`https://api.notion.com/v1/databases/${dbId}/query`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${process.env.NOTION_API_KEY}`,
            'Notion-Version': '2022-06-28',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            filter: { property: '공개', checkbox: { equals: true } },
            sorts: [{ property: '발행일', direction: 'descending' }],
            ...(cursor ? { start_cursor: cursor } : {}),
            page_size: 100,
          }),
        });
        const response = await res.json();
        allResults = [...allResults, ...response.results];
        cursor = response.has_more ? response.next_cursor ?? undefined : undefined;
      } while (cursor);
      return allResults.map((page: any) => ({
        id: page.id,
        title: page.properties.이름?.title?.[0]?.plain_text ?? '',
        slug: page.properties.슬러그?.rich_text?.[0]?.plain_text ?? page.id,
        category: page.properties.카테고리?.select?.name ?? '',
        thumbnail: page.properties.썸네일?.url ?? '',
      }));
    } catch (e) {
      console.warn('블로그 목록 조회 실패:', e);
      return [];
    }
  },
  ['blog-posts'],
  { revalidate: 3600 }
);

export default async function BlogPage() {
  const posts = await getPosts();

  return (
    <main suppressHydrationWarning style={{ background: '#fff', minHeight: '100vh' }}>
      <style suppressHydrationWarning>{`
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { font-family: 'Apple SD Gothic Neo', 'Noto Sans KR', sans-serif; }
        .header { background: #fff; border-bottom: 1px solid #e8e8e8; height: 56px; display: flex; align-items: center; position: sticky; top: 0; z-index: 100; }
        .header-inner { max-width: 1100px; margin: 0 auto; padding: 0 1.5rem; width: 100%; display: flex; align-items: center; }
        .logo { font-size: 26px; font-weight: 900; color: #111; letter-spacing: -1px; text-decoration: none; }
        .logo span { color: #e52c2c; }
        .nav-links { display: flex; gap: 1.5rem; margin-left: 2rem; }
        .nav-links a { font-size: 14px; font-weight: 600; color: #333; text-decoration: none; }
        .nav-links a:hover { color: #e52c2c; }
        .hero { background: #111; padding: 2rem 1.5rem; text-align: center; }
        .hero-label { font-size: 11px; font-weight: 800; color: #e52c2c; letter-spacing: 3px; text-transform: uppercase; margin-bottom: 0.75rem; }
        .hero-title { font-size: 32px; font-weight: 900; color: #fff; letter-spacing: -1px; }
        .hero-sub { font-size: 14px; color: #888; margin-top: 0.5rem; }
        .container { max-width: 1100px; margin: 0 auto; padding: 2.5rem 1.5rem; }
        .grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 1.5rem; }
        .card { text-decoration: none; display: block; background: #fff; border-radius: 12px; overflow: hidden; transition: transform 0.2s, box-shadow 0.2s; }
        .card:hover { transform: translateY(-4px); box-shadow: 0 8px 24px rgba(0,0,0,0.1); }
        .card-img { aspect-ratio: 16/9; background: #f4f4f4; overflow: hidden; }
        .card-img img { width: 100%; height: 100%; object-fit: cover; transition: transform 0.3s; }
        .card:hover .card-img img { transform: scale(1.03); }
        .card-img-empty { width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; font-size: 40px; background: #f4f4f4; }
        .card-body { padding: 1rem 1.2rem 1.4rem; }
        .card-category { font-size: 10px; font-weight: 800; color: #e52c2c; letter-spacing: 1.5px; text-transform: uppercase; margin-bottom: 6px; }
        .card-title { font-size: 15px; font-weight: 700; color: #111; line-height: 1.55; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
        .card-arrow { font-size: 12px; color: #aaa; margin-top: 10px; }
        .empty { text-align: center; padding: 4rem; color: #aaa; font-size: 16px; }
        @media (max-width: 768px) {
          .hero-title { font-size: 24px; }
          .grid { grid-template-columns: 1fr; gap: 1rem; }
          .container { padding: 1.5rem 1rem; }
        }
        @media (min-width: 640px) and (max-width: 768px) {
          .grid { grid-template-columns: repeat(2, 1fr); }
        }
      `}</style>

      <header className="header">
        <div className="header-inner">
          <Link href="/" className="logo">PRE<span>MY</span><small style={{ fontSize: '12px', fontWeight: 400, color: '#aaa', marginLeft: '8px', letterSpacing: 0 }}>프리미</small></Link>
          <nav className="nav-links">            
            <Link href="/blog" style={{ color: '#e52c2c' }}>블로그</Link>
          </nav>
        </div>
      </header>

      <div className="hero">
        <div className="hero-label">PREMY BLOG</div>
        <h1 className="hero-title">프리미엄 제품 리뷰</h1>
        <p className="hero-sub">직접 써보고 쓰는 솔직한 후기</p>
      </div>

      <div className="container">
        {posts.length === 0
          ? <div className="empty">아직 게시된 글이 없습니다.</div>
          : (
            <div className="grid">
              {posts.map((post) => (
                <Link href={`/blog/${post.slug}`} key={post.id} className="card">
                  <div className="card-img">
                    {post.thumbnail
                      ? <img src={post.thumbnail} alt={post.title} />
                      : <div className="card-img-empty">📝</div>
                    }
                  </div>
                  <div className="card-body">
                    {post.category && <div className="card-category">{post.category}</div>}
                    <div className="card-title">{post.title}</div>
                    <div className="card-arrow">읽기 →</div>
                  </div>
                </Link>
              ))}
            </div>
          )
        }
      </div>
    </main>
  );
}