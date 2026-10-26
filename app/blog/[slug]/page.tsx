import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Shell from "../../components/Shell";
import { ParallaxImage } from "../../components/Parallax";
import { formatDate, getPost, posts } from "../posts";

// 文章在建置時就預先產生；不存在的 slug 要在送出頁面前就回 404，所以不走串流
export const instant = false;

export function generateStaticParams() {
  return posts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata(props: PageProps<"/blog/[slug]">): Promise<Metadata> {
  const { slug } = await props.params;
  const post = getPost(slug);
  if (!post) return {};
  return { title: `${post.title} | 愛文果園`, description: post.excerpt };
}

export default async function PostPage(props: PageProps<"/blog/[slug]">) {
  const { slug } = await props.params;
  const post = getPost(slug);
  if (!post) notFound();

  const others = posts.filter((p) => p.slug !== post.slug);

  return (
    <Shell>
      <article className="mx-auto w-full max-w-3xl">
        <Link href="/blog" className="text-sm text-muted transition-opacity hover:opacity-60">
          回到文章列表
        </Link>
        <h1 className="font-display mt-6 text-3xl leading-tight sm:text-5xl">{post.title}</h1>
        <p className="mt-5 text-sm text-muted">
          {formatDate(post.date)}｜閱讀約 {post.readMinutes} 分鐘
        </p>

        <div className="relative mt-10 aspect-[3/2] overflow-hidden rounded-3xl sm:rounded-[2rem]">
          <ParallaxImage
            src={post.image}
            alt={post.imageAlt}
            priority
            sizes="(min-width: 768px) 768px, 100vw"
          />
        </div>

        <div className="mt-12 flex flex-col gap-6 text-base leading-9 sm:text-lg sm:leading-10">
          {post.body.map((block, i) => {
            if (block.type === "h2") {
              return (
                <h2 key={i} className="font-display mt-6 text-2xl sm:text-3xl">
                  {block.text}
                </h2>
              );
            }
            if (block.type === "list") {
              return (
                <ul key={i} className="flex list-disc flex-col gap-3 pl-6 marker:text-muted">
                  {block.items.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              );
            }
            return <p key={i}>{block.text}</p>;
          })}
        </div>

        <aside className="mt-16 rounded-3xl border border-white/50 bg-white/25 p-6 backdrop-blur-2xl sm:p-8">
          <p className="font-display text-2xl">想吃吃看？</p>
          <p className="mt-2 leading-8 text-muted">本季愛文芒果預購中，家庭箱 3 台斤 NT$ 580 起。</p>
          <Link
            href="/#products"
            className="mt-5 inline-block rounded-full bg-foreground px-6 py-3 text-sm text-background transition-opacity hover:opacity-80"
          >
            選購芒果
          </Link>
        </aside>
      </article>

      <section className="mx-auto w-full max-w-3xl">
        <h2 className="font-display text-2xl">其他文章</h2>
        <ul className="mt-6 border-t border-foreground/20">
          {others.map((p) => (
            <li key={p.slug} className="border-b border-foreground/20">
              <Link href={`/blog/${p.slug}`} className="block py-5 transition-opacity hover:opacity-60">
                <p className="text-sm text-muted">{formatDate(p.date)}</p>
                <p className="mt-1 font-medium">{p.title}</p>
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </Shell>
  );
}
