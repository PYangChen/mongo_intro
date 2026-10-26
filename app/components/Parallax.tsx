"use client";

import Image, { type ImageProps } from "next/image";
import { useEffect, useRef, type ReactNode } from "react";

/** 圖片在框內的最大位移，佔框高的比例（要小於下方圖片多出的 12%） */
const IMAGE_TRAVEL = 0.11;

/** 讓 el 在 onFrame 裡依捲動更新；回傳清除函式。使用者要求減少動態時不啟動。 */
function useScrollFrame(
  target: React.RefObject<HTMLElement | null>,
  onFrame: (el: HTMLElement) => void,
) {
  useEffect(() => {
    const el = target.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let raf = 0;
    let visible = true;
    const run = () => {
      raf = 0;
      onFrame(el);
    };
    const request = () => {
      if (visible && !raf) raf = requestAnimationFrame(run);
    };

    const io = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting;
        request();
      },
      { rootMargin: "200px 0px" },
    );
    io.observe(el);
    window.addEventListener("scroll", request, { passive: true });
    window.addEventListener("resize", request);
    request();

    return () => {
      io.disconnect();
      window.removeEventListener("scroll", request);
      window.removeEventListener("resize", request);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [target, onFrame]);
}

/**
 * 圖片視差：圖片比外框高一些，捲動時在框內比頁面慢移動。
 * 直接取代 <Image fill>，需放在 relative 的父層內。
 */
export function ParallaxImage({ className = "", alt, ...props }: ImageProps) {
  const frame = useRef<HTMLDivElement>(null);
  const inner = useRef<HTMLDivElement>(null);

  useScrollFrame(frame, (el) => {
    const r = el.getBoundingClientRect();
    const progress = (r.top + r.height / 2 - innerHeight / 2) / (innerHeight / 2 + r.height / 2);
    const clamped = Math.max(-1, Math.min(1, progress));
    if (inner.current) {
      inner.current.style.transform = `translate3d(0, ${(-clamped * r.height * IMAGE_TRAVEL).toFixed(1)}px, 0)`;
    }
  });

  return (
    <div ref={frame} className="absolute inset-0 overflow-hidden">
      <div ref={inner} className="absolute inset-x-0 -inset-y-[12%] will-change-transform">
        <Image {...props} alt={alt} fill className={`object-cover ${className}`} />
      </div>
    </div>
  );
}

/**
 * 元素視差：依元素與視窗中心的距離位移。
 * speed 為正：比頁面慢（有距離感）；為負：比頁面快（浮在上層）。
 * mode="page" 時改用捲動距離，適合整頁背景。
 */
export function Parallax({
  speed = 0.1,
  mode = "element",
  className = "",
  children,
}: {
  speed?: number;
  mode?: "element" | "page";
  className?: string;
  children?: ReactNode;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useScrollFrame(ref, (el) => {
    // 量測父層，避免自己的位移影響量測
    const host = el.parentElement ?? el;
    let offset: number;
    if (mode === "page") {
      offset = scrollY * speed;
    } else {
      const r = host.getBoundingClientRect();
      offset = (r.top + r.height / 2 - innerHeight / 2) * -speed;
    }
    el.style.transform = `translate3d(0, ${offset.toFixed(1)}px, 0)`;
  });

  return (
    <div ref={ref} className={`will-change-transform ${className}`}>
      {children}
    </div>
  );
}
