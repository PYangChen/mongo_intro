import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-foreground/20 pt-10">
      <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-[2fr_1fr_1fr]">
        <div className="sm:col-span-2 lg:col-span-1">
          <p className="font-display text-2xl">愛文果園</p>
          <p className="mt-3 max-w-sm text-sm leading-7 text-muted">
            南台灣果園直送的愛文芒果。每年 5 到 8 月開放預購，採收後 2 天內出貨。
          </p>
        </div>
        <nav className="flex flex-col gap-2 text-sm">
          <Link href="/#products" className="hover:opacity-60">選購芒果</Link>
          <Link href="/#story" className="hover:opacity-60">果園故事</Link>
          <Link href="/blog" className="hover:opacity-60">芒果文章</Link>
          <Link href="/game" className="hover:opacity-60">射芒果小遊戲</Link>
          <Link href="/#order" className="hover:opacity-60">訂購方式</Link>
        </nav>
        <div className="flex flex-col gap-2 text-sm text-muted">
          <span>訂購專線 0900-000-000</span>
          <span>hello@example.com</span>
          <span>週一至週六 9:00 – 18:00</span>
        </div>
      </div>
      <p className="mt-10 text-xs text-muted">© 2026 愛文果園</p>
    </footer>
  );
}
