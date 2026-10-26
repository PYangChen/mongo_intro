import type { Metadata } from "next";
import Link from "next/link";
import Shell from "../components/Shell";
import { ParallaxImage } from "../components/Parallax";
import { formatDate, posts } from "./posts";

export const metadata: Metadata = {
  title: "芒果文章 | 愛文果園",
  description: "怎麼挑、怎麼切、怎麼存：愛文果園整理的三篇芒果小知識。",
};

export default function BlogPage() {
  return (
    <Shell>
      <section>
        <h1 className="font-display text-4xl sm:text-5xl">芒果文章</h1>
        <p className="mt-4 max-w-lg leading-8 text-muted">
          從挑選到保存、再到怎麼吃，把我們在果園學到的芒果小知識寫下來。
        </p>

        <ul className="mt-12 border-t border-foreground/20">
          {posts.map((post) => (
            <li key={post.slug} className="border-b border-foreground/20">
              <Link
                href={`/blog/${post.slug}`}
                className="group grid gap-6 py-8 md:grid-cols-[20rem_1fr] md:gap-10 lg:grid-cols-[24rem_1fr]"
              >
                <div className="relative aspect-[3/2] overflow-hidden rounded-3xl">
                  <ParallaxImage
                    src={post.image}
                    alt={post.imageAlt}
                    sizes="(min-width: 1024px) 384px, (min-width: 768px) 320px, 100vw"
                  />
                </div>
                <div className="flex flex-col justify-center">
                  <p className="text-sm text-muted">
                    {formatDate(post.date)}｜閱讀約 {post.readMinutes} 分鐘
                  </p>
                  <h2 className="font-display mt-3 text-2xl leading-snug group-hover:underline group-hover:underline-offset-4 sm:text-3xl">
                    {post.title}
                  </h2>
                  <p className="mt-4 max-w-xl leading-8 text-muted">{post.excerpt}</p>
                  <span className="mt-5 text-sm font-medium">閱讀全文</span>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </Shell>
  );
}
