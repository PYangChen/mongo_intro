"use client";

import Link from "next/link";
import { useState } from "react";
import { glass } from "./glass";

const links = [
  { href: "/#products", label: "選購" },
  { href: "/#story", label: "果園故事" },
  { href: "/#eat", label: "怎麼吃" },
  { href: "/#order", label: "怎麼訂" },
  { href: "/blog", label: "文章" },
  { href: "/game", label: "小遊戲" },
];

export default function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-3 z-50 sm:top-4">
      <div
        className={`${glass} flex items-center justify-between rounded-full py-2 pl-5 pr-2 sm:py-2.5 sm:pl-6 sm:pr-2.5`}
      >
        <Link href="/" className="font-display text-lg">
          愛文果園
        </Link>

        {/* 平板以上：橫向導覽 */}
        <nav className="hidden gap-5 text-sm md:flex lg:gap-7">
          {links.map((l) => (
            <Link key={l.href} href={l.href} className="transition-opacity hover:opacity-60">
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <Link
            href="/#order"
            className="rounded-full bg-foreground px-4 py-2 text-sm text-background transition-opacity hover:opacity-80 sm:px-5"
          >
            預購芒果
          </Link>
          {/* 手機：選單按鈕 */}
          <button
            type="button"
            aria-label={open ? "關閉選單" : "開啟選單"}
            aria-expanded={open}
            aria-controls="mobile-menu"
            onClick={() => setOpen((v) => !v)}
            className="flex h-10 w-10 flex-col items-center justify-center gap-1.5 rounded-full transition-colors hover:bg-white/40 md:hidden"
          >
            <span
              className={`h-0.5 w-5 bg-foreground transition-transform ${open ? "translate-y-2 rotate-45" : ""}`}
            />
            <span className={`h-0.5 w-5 bg-foreground transition-opacity ${open ? "opacity-0" : ""}`} />
            <span
              className={`h-0.5 w-5 bg-foreground transition-transform ${open ? "-translate-y-2 -rotate-45" : ""}`}
            />
          </button>
        </div>
      </div>

      {open && (
        <nav
          id="mobile-menu"
          className={`${glass} mt-2 flex flex-col rounded-3xl p-3 md:hidden`}
        >
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              className="rounded-2xl px-4 py-3 transition-colors hover:bg-white/40"
            >
              {l.label}
            </Link>
          ))}
        </nav>
      )}
    </header>
  );
}
