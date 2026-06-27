import Link from "next/link";
import ReactMarkdown from "react-markdown";
import { notFound } from "next/navigation";
import { unstable_cache } from "next/cache";
import { Client } from "@notionhq/client";
import BlogShare from './BlogShare';

export const revalidate = 3600;

const notion = new Client({ auth: process.env.NOTION_API_KEY });

const rawId = process.env.NOTION_BLOG_DATABASE_ID!;
const dbId = rawId.includes('-')
    ? rawId
    : rawId.replace(/^(.{8})(.{4})(.{4})(.{4})(.{12})$/, '$1-$2-$3-$4-$5');

const getPost = unstable_cache(
    async (slug: string) => {
        try {
            const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/.test(slug);
            if (isUUID) {
                const page = await notion.pages.retrieve({ page_id: slug }) as any;
                return {
                    id: page.id,
                    title: page.properties.이름?.title?.[0]?.plain_text ?? '',
                    slug: page.properties.슬러그?.rich_text?.[0]?.plain_text ?? slug,
                    category: page.properties.카테고리?.select?.name ?? '',
                    thumbnail: page.properties.썸네일?.url ?? '',
                    content: page.properties.본문?.rich_text?.[0]?.plain_text ?? '',
                    productSlug: page.properties.제품슬러그?.rich_text?.[0]?.plain_text ?? '',
                };
            }
            const res: Response = await fetch(`https://api.notion.com/v1/databases/${dbId}/query`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${process.env.NOTION_API_KEY}`,
                    'Notion-Version': '2022-06-28',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    filter: { property: '슬러그', rich_text: { equals: slug } },
                }),
            });
            const response = await res.json();
            if (!response.results?.length) return null;
            const page = response.results[0] as any;
            return {
                id: page.id,
                title: page.properties.이름?.title?.[0]?.plain_text ?? '',
                slug: page.properties.슬러그?.rich_text?.[0]?.plain_text ?? slug,
                category: page.properties.카테고리?.select?.name ?? '',
                thumbnail: page.properties.썸네일?.url ?? '',
                content: page.properties.본문?.rich_text?.[0]?.plain_text ?? '',
                productSlug: page.properties.제품슬러그?.rich_text?.[0]?.plain_text ?? '',
            };
        } catch (e) {
            console.warn('블로그 상세 조회 실패:', e);
            return null;
        }
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

async function getRelatedProducts(category: string) {
    try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'https://premy.co.kr'}/api/coupang/related?category=${encodeURIComponent(category)}&currentId=`, {
            next: { revalidate: 3600 },
        });
        return await res.json();
    } catch {
        return [];
    }
}

export default async function BlogPostPage({ params }: { params: { slug: string } }) {
    const post = await getPost(params.slug);
    if (!post) notFound();

    const related = post!.category ? await getRelatedProducts(post!.category) : [];

    return (
        <main suppressHydrationWarning style={{ background: '#fff', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
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
        .container { max-width: 900px; margin: 0 auto; padding: 2rem 1.5rem; flex: 1; }
        .breadcrumb { font-size: 13px; color: #aaa; margin-bottom: 1.5rem; }
        .breadcrumb a { color: #333; text-decoration: none; font-weight: 600; }
        .post-category { font-size: 12px; font-weight: 800; color: #e52c2c; letter-spacing: 1px; margin-bottom: 0.75rem; }
        .post-title { font-size: 24px; font-weight: 900; color: #111; letter-spacing: -1px; line-height: 1.3; margin-bottom: 1.5rem; }
        .post-thumbnail { width: 100%; aspect-ratio: 16/9; object-fit: cover; border-radius: 12px; margin-bottom: 2rem; }
        .post-content { font-size: 18px; color: #333; line-height: 1.9; letter-spacing: -0.02em; word-break: keep-all; }
        .post-content h2 { font-size: 22px; font-weight: 800; color: #111; margin: 2em 0 0.6em; }
        .post-content h3 { font-size: 19px; font-weight: 700; color: #333; margin: 1.5em 0 0.5em; }
        .post-content p { margin: 0.8em 0; }
        .post-content ul { padding-left: 1.4em; margin: 0.5em 0 1em; }
        .post-content li { margin: 0.3em 0; line-height: 1.7; }
        .post-content strong { font-weight: 800; color: #111; }
        .related { max-width: 780px; margin: 3rem auto 2rem; padding: 0 1.5rem; }
        .related-title { font-size: 16px; font-weight: 800; color: #111; margin-bottom: 1rem; padding-bottom: 0.75rem; border-bottom: 2px solid #111; display: inline-block; }
        .related-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 1rem; margin-top: 1rem; }
        .related-card { text-decoration: none; display: block; }
        .related-img { aspect-ratio: 1; background: #f4f4f4; border-radius: 8px; overflow: hidden; margin-bottom: 8px; }
        .related-img img { width: 100%; height: 100%; object-fit: cover; }
        .related-name { font-size: 12px; color: #111; font-weight: 600; line-height: 1.4; overflow: hidden; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; }
        .related-price { font-size: 13px; color: #111; font-weight: 900; margin-top: 4px; }
        @media (max-width: 768px) {
          .container { padding: 1rem; }
          .post-title { font-size: 20px; word-break: keep-all; }
          .post-content { font-size: 16px; }
          .related { padding: 0 1rem; }
          .related-grid { grid-template-columns: repeat(2, 1fr); }
        }
      `}</style>

            <header className="header">
                <div className="header-inner">
                    <Link href="/" className="logo">PRE<span>MY</span><small style={{ fontSize: '12px', fontWeight: 400, color: '#aaa', marginLeft: '8px', letterSpacing: 0 }}>프리미</small></Link>
                    <nav className="nav-links">                        
                        <Link href="/blog">블로그</Link>
                    </nav>
                </div>
            </header>

            <div className="container">
                <div className="breadcrumb">
                    <Link href="/">홈</Link> › <Link href="/blog">블로그</Link> › {post!.title.slice(0, 20)}...
                </div>
               {post!.category && <div className="post-category">{post!.category}</div>}
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', marginBottom: '1.5rem' }}>
                    <h1 className="post-title" style={{ flex: 1, marginBottom: 0 }}>{post!.title}</h1>
                    <BlogShare title={post!.title} />
                </div>
               
                
                {post!.thumbnail && <img src={post!.thumbnail} alt={post!.title} className="post-thumbnail" />}
                <div className="post-content" suppressHydrationWarning>
                    <ReactMarkdown>{post!.content}</ReactMarkdown>
                </div>
                {post!.productSlug && (                    
                    <Link
                        href={`/products/${post!.productSlug}`}
                        style={{
                        display: 'block',
                        background: '#e52c2c',
                        color: '#fff',
                        textAlign: 'center',
                        padding: '18px',
                        borderRadius: '50px',
                        fontSize: '16px',
                        fontWeight: 800,
                        textDecoration: 'none',
                        margin: '2rem 0',
                        boxShadow: '0 4px 12px rgba(229,44,44,0.3)',
                        }}
                    >
                        지금 가격 확인
                    </Link>
                    )}
                    
            </div>

            {related.length > 0 && (
                <div className="related">
                    <div className="related-title">연관 제품</div>
                    <div className="related-grid">
                        {related.map((p: any) => (
                            <Link href={`/products/${p.slug || p.id}`} key={p.id} className="related-card">
                                <div className="related-img">
                                    {p.image
                                        ? <img src={p.image} alt={p.name} />
                                        : <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '32px' }}>🛒</div>
                                    }
                                </div>
                                <div className="related-name">{p.name}</div>
                                {p.price && <div className="related-price">{p.price}</div>}
                            </Link>
                        ))}
                    </div>
                </div>
            )}
        </main>
    );
}