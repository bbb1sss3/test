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
        date: page.properties.발행일?.date?.start ?? '',
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
    <main style={{ background: '#fff', minHeight: '100vh' }}>
      <style>{`
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { font-family: 'Apple SD Gothic Neo', 'Noto Sans KR', sans-serif; }
        .header { background: #fff; border-bottom: 1px solid #e8e8e8; height: 56px; display: flex; align-items: center; position: sticky; top: 0; z-index: 100; }
        .header-inner { max-width: 1100px; margin: 0 auto; padding: 0 1.5rem; width: 100%; display: flex; align-items: center; }
        .logo { font-size: 26px; font-weight: 900; color: #111; letter-spacing: -1px; text-decoration: none; }
        .logo span { color: #e52c2c; }
        .nav-links { display: flex; gap: 1.5rem; margin-left: 2rem; }
        .nav-links a { font-size: 14px; font-weight: 600; color: #333; text-decoration: none; }
        .nav-links a:hover { color: #e52c2c; }
        .container { max-width: 1100px; margin: 0 auto; padding: 2rem 1.5rem; }
        .page-title { font-size: 28px; font-weight: 900; color: #111; margin-bottom: 2rem; letter-spacing: -1px; }
        .grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 2rem; }
        .card { text-decoration: none; display: block; }
        .card-img { aspect-ratio: 16/9; background: #f4f4f4; border-radius: 10px; overflow: hidden; margin-bottom: 12px; }
        .card-img img { width: 100%; height: 100%; object-fit: cover; }
        .card-img-empty { width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; font-size: 40px; }
        .card-category { font-size: 11px; font-weight: 800; color: #e52c2c; letter-spacing: 1px; margin-bottom: 6px; }
        .card-title { font-size: 16px; font-weight: 700; color: #111; line-height: 1.5; margin-bottom: 8px; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
        .card-date { font-size: 12px; color: #aaa; }
        .empty { text-align: center; padding: 4rem; color: #aaa; font-size: 16px; }
        .footer { border-top: 1px solid #e8e8e8; background: #111; margin-top: 4rem; }
        .footer-inner { max-width: 1100px; margin: 0 auto; padding: 1rem 1.5rem; text-align: center; }
        .footer p { font-size: 12px; color: #999; }
        @media (max-width: 768px) {
          .grid { grid-template-columns: 1fr; gap: 1.5rem; }
          .container { padding: 1rem; }
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

      <div className="container">
        <h1 className="page-title">블로그</h1>
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
                  {post.category && <div className="card-category">{post.category}</div>}
                  <div className="card-title">{post.title}</div>
                  {post.date && <div className="card-date">{post.date}</div>}
                </Link>
              ))}
            </div>
          )
        }
      </div>
    </main>
  );
}