"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { glass } from "./glass";

const WIN_RATE = 0.1;
const COUPON_CODE = "MANGO90";
const REEL = ["9 折優惠券", "再接再厲", "9 折優惠券", "銘謝惠顧"];
const DRAW_MS = 2000;

type Phase = "idle" | "drawing" | "win" | "lose";

export default function LuckyDraw() {
  const dialog = useRef<HTMLDialogElement>(null);
  const timers = useRef<{ tick?: number; done?: number }>({});
  const [phase, setPhase] = useState<Phase>("idle");
  const [reelIndex, setReelIndex] = useState(0);
  const [copied, setCopied] = useState(false);

  const clearTimers = () => {
    window.clearInterval(timers.current.tick);
    window.clearTimeout(timers.current.done);
  };

  useEffect(() => clearTimers, []);

  const open = () => dialog.current?.showModal();

  const reset = () => {
    clearTimers();
    setPhase("idle");
    setCopied(false);
  };

  const draw = () => {
    const won = Math.random() < WIN_RATE;
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    setCopied(false);
    setPhase("drawing");
    if (!reduceMotion) {
      timers.current.tick = window.setInterval(() => setReelIndex((i) => (i + 1) % REEL.length), 90);
    }
    timers.current.done = window.setTimeout(
      () => {
        window.clearInterval(timers.current.tick);
        setPhase(won ? "win" : "lose");
      },
      reduceMotion ? 300 : DRAW_MS,
    );
  };

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(COUPON_CODE);
      setCopied(true);
    } catch {
      setCopied(false);
    }
  };

  return (
    <>
      <button
        type="button"
        onClick={open}
        className={`${glass} fixed bottom-4 right-4 z-40 rounded-full px-5 py-3 text-sm font-medium transition-transform hover:-translate-y-0.5 sm:bottom-6 sm:right-6`}
      >
        抽芒果優惠
      </button>

      <dialog
        ref={dialog}
        aria-labelledby="draw-title"
        onClose={reset}
        onClick={(e) => {
          // 點到 dialog 本身（也就是背景遮罩）時關閉
          if (e.target === e.currentTarget) e.currentTarget.close();
        }}
        className="m-auto w-[calc(100%-2rem)] max-w-md rounded-[2rem] bg-transparent p-0 text-foreground backdrop:bg-foreground/30 backdrop:backdrop-blur-sm"
      >
        <div className={`${glass} rounded-[2rem] bg-white/70 p-7 sm:p-9`}>
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 id="draw-title" className="font-display text-2xl sm:text-3xl">
                試試手氣
              </h2>
              <p className="mt-2 text-sm leading-7 text-muted">
                抽一次，有 10% 的機會拿到芒果 9 折優惠券。
              </p>
            </div>
            <button
              type="button"
              aria-label="關閉"
              onClick={() => dialog.current?.close()}
              className="-mr-2 -mt-2 flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-xl transition-colors hover:bg-white/60"
            >
              ×
            </button>
          </div>

          {/* 結果區 */}
          <div
            aria-live="polite"
            className="mt-7 flex min-h-40 flex-col items-center justify-center rounded-3xl border border-foreground/10 bg-white/60 px-5 py-6 text-center"
          >
            {phase === "idle" && <p className="text-muted">按下「抽獎」開始</p>}

            {phase === "drawing" && (
              <p className="font-display text-3xl" aria-label="抽獎中">
                {REEL[reelIndex]}
              </p>
            )}

            {phase === "win" && (
              <>
                <p className="font-display text-3xl">恭喜中獎！</p>
                <p className="mt-2 text-sm leading-7">
                  你抽到芒果 9 折優惠券。訂購時告訴我們這組優惠碼，整單打 9 折。
                </p>
                <div className="mt-4 flex items-center gap-2">
                  <code className="rounded-full border border-dashed border-foreground/40 px-4 py-2 font-mono text-base tracking-widest">
                    {COUPON_CODE}
                  </code>
                  <button
                    type="button"
                    onClick={copy}
                    className="rounded-full bg-foreground px-4 py-2 text-sm text-background transition-opacity hover:opacity-80"
                  >
                    {copied ? "已複製" : "複製"}
                  </button>
                </div>
              </>
            )}

            {phase === "lose" && (
              <>
                <p className="font-display text-3xl">這次沒中</p>
                <p className="mt-2 text-sm leading-7 text-muted">別灰心，再抽一次試試。</p>
              </>
            )}
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            {phase === "win" ? (
              <Link
                href="/#products"
                onClick={() => dialog.current?.close()}
                className="flex-1 rounded-full bg-foreground px-6 py-3 text-center text-sm text-background transition-opacity hover:opacity-80"
              >
                去選購芒果
              </Link>
            ) : (
              <button
                type="button"
                onClick={draw}
                disabled={phase === "drawing"}
                className="flex-1 rounded-full bg-foreground px-6 py-3 text-sm text-background transition-opacity hover:opacity-80 disabled:opacity-50"
              >
                {phase === "drawing" ? "抽獎中…" : phase === "lose" ? "再抽一次" : "抽獎"}
              </button>
            )}
          </div>
        </div>
      </dialog>
    </>
  );
}
