import { Client } from "@notionhq/client";
import Link from "next/link";
import ReactMarkdown from "react-markdown";
import { notFound } from "next/navigation";
import { unstable_cache } from "next/cache";

export const revalidate = 3600;

const notion = new Client({ auth: process.env.NOTION_API_KEY });

const rawId = process.env.NOTION_BLOG_DATABASE_ID!;
const dbId = rawId.includes('-')
    ? rawId
    : rawId.replace(/^(.{8})(.{4})(.{4})(.{4})(.{12})$/, '$1-$2-$3-$4-$5');

const getPost = unstable_cache(
    async (slug: string) => {
        const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/.test(slug);
        if (isUUID) {
            const page = await notion.pages.retrieve({ page_id: slug }) as any;
            return {
                id: page.id,
                title: page.properties.이름?.title?.[0]?.plain_text ?? '',
                slug: page.properties.슬러그?.rich_text?.[0]?.plain_text ?? slug,
                category: page.properties.카테고리?.select?.name ?? '',
                date: page.properties.발행일?.date?.start ?? '',
                thumbnail: page.properties.썸네일?.url ?? '',
                content: page.properties.본문?.rich_text?.[0]?.plain_text ?? '',
            };
        }
        const response = await (notion.databases as any).query({
            database_id: dbId,
            filter: { property: '슬러그', rich_text: { equals: slug } },
        });
        if (!response.results.length) return null;
        const page = response.results[0] as any;
        return {
            id: page.id,
            title: page.properties.이름?.title?.[0]?.plain_text ?? '',
            slug: page.properties.슬러그?.rich_text?.[0]?.plain_text ?? slug,
            category: page.properties.카테고리?.select?.name ?? '',
            date: page.properties.발행일?.date?.start ?? '',
            thumbnail: page.properties.썸네일?.url ?? '',
            content: page.properties.본문?.rich_text?.[0]?.plain_text ?? '',
        };
    },
    ['blog-post'],
    { revalidate: 3600 }
);

export async function generateMetadata({ params }: { params: { slug: string } }) {
    const post = await getPost(params.slug);
    if (!post) return { title: 'Premy(프리미)' };
    return {
        title: `${post.title} | Premy(프리미) 블로그`,
        description: post.content.slice(0, 150),
        openGraph: {
            title: post.title,
            description: post.content.slice(0, 150),
            images: post.thumbnail ? [{ url: post.thumbnail }] : [],
            locale: 'ko_KR',
            type: 'article',
        },
    };
}

export default async function BlogPostPage({ params }: { params: { slug: string } }) {
    const post = await getPost(params.slug);
    if (!post) notFound();

    return (
        <main style={{ background: '#fff', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
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
        .container { max-width: 780px; margin: 0 auto; padding: 2rem 1.5rem; flex: 1; }
        .breadcrumb { font-size: 13px; color: #aaa; margin-bottom: 1.5rem; }
        .breadcrumb a { color: #333; text-decoration: none; font-weight: 600; }
        .post-category { font-size: 12px; font-weight: 800; color: #e52c2c; letter-spacing: 1px; margin-bottom: 0.75rem; }
        .post-title { font-size: 32px; font-weight: 900; color: #111; letter-spacing: -1px; line-height: 1.3; margin-bottom: 1rem; }
        .post-date { font-size: 13px; color: #aaa; margin-bottom: 2rem; padding-bottom: 1.5rem; border-bottom: 1px solid #e8e8e8; }
        .post-thumbnail { width: 100%; aspect-ratio: 16/9; object-fit: cover; border-radius: 12px; margin-bottom: 2rem; }
        .post-content { font-size: 17px; color: #333; line-height: 1.9; letter-spacing: -0.02em; word-break: keep-all; }
        .post-content h2 { font-size: 22px; font-weight: 800; color: #111; margin: 2em 0 0.6em; }
        .post-content h3 { font-size: 18px; font-weight: 700; color: #333; margin: 1.5em 0 0.5em; }
        .post-content p { margin: 0.8em 0; }
        .post-content ul { padding-left: 1.4em; margin: 0.5em 0 1em; }
        .post-content li { margin: 0.3em 0; line-height: 1.7; }
        .post-content strong { font-weight: 800; color: #111; }
        .back-link { display: inline-flex; align-items: center; gap: 6px; font-size: 14px; font-weight: 600; color: #555; text-decoration: none; margin-top: 3rem; padding: 10px 20px; border: 1.5px solid #e8e8e8; border-radius: 50px; }
        .back-link:hover { border-color: #e52c2c; color: #e52c2c; }
        .footer { border-top: 1px solid #e8e8e8; background: #111; margin-top: 4rem; }
        .footer-inner { max-width: 1100px; margin: 0 auto; padding: 1rem 1.5rem; text-align: center; }
        .footer p { font-size: 12px; color: #999; }
        @media (max-width: 768px) {
          .container { padding: 1rem; }
          .post-title { font-size: 24px; }
          .post-content { font-size: 16px; }
        }
      `}</style>

            <header className="header">
                <div className="header-inner">
                    <Link href="/" className="logo">PRE<span>MY</span><small style={{ fontSize: '12px', fontWeight: 400, color: '#aaa', marginLeft: '8px' }}>프리미</small></Link>
                    <nav className="nav-links">
                        <Link href="/">제품</Link>
                        <Link href="/blog">블로그</Link>
                    </nav>
                </div>
            </header>

            <div className="container">
                <div className="breadcrumb">
                    <Link href="/">홈</Link> › <Link href="/blog">블로그</Link> › {post!.title.slice(0, 20)}...
                </div>
                {post!.category && <div className="post-category">{post!.category}</div>}
                <h1 className="post-title">{post!.title}</h1>
                {post!.date && <div className="post-date">{post!.date}</div>}
                {post!.thumbnail && <img src={post!.thumbnail} alt={post!.title} className="post-thumbnail" />}
                <div className="post-content">
                    <ReactMarkdown>{post!.content}</ReactMarkdown>
                </div>
                <Link href="/blog" className="back-link">← 블로그 목록</Link>
            </div>

            <footer className="footer">
                <div className="footer-inner"><p>© 2026 Premy(프리미)</p></div>
            </footer>
        </main>
    );
}