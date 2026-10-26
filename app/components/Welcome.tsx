"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import { glass } from "./glass";
import { ASK_NAME_EVENT, askNameAgain, saveName, skipName, useVisitor } from "./visitor";

const MAX_LENGTH = 20;

/** 第一次進站時詢問稱呼；之後可由「更改稱呼」重新開啟 */
export function WelcomePrompt() {
  const { ready, name, decided } = useVisitor();
  const dialog = useRef<HTMLDialogElement>(null);
  const input = useRef<HTMLInputElement>(null);
  const [error, setError] = useState("");

  const show = () => {
    if (input.current) input.current.value = name;
    if (dialog.current && !dialog.current.open) dialog.current.showModal();
  };

  // 讀到瀏覽器資料後，如果從沒回答過就詢問
  useEffect(() => {
    if (ready && !decided) show();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ready, decided]);

  // 「更改稱呼」
  useEffect(() => {
    window.addEventListener(ASK_NAME_EVENT, show);
    return () => window.removeEventListener(ASK_NAME_EVENT, show);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [name]);

  const submit = (e: FormEvent) => {
    e.preventDefault();
    const trimmed = (input.current?.value ?? "").trim();
    if (!trimmed) {
      setError("請輸入稱呼，或按「先跳過」。");
      return;
    }
    saveName(trimmed);
    dialog.current?.close();
  };

  const skip = () => {
    if (!decided) skipName();
    dialog.current?.close();
  };

  return (
    <dialog
      ref={dialog}
      aria-labelledby="welcome-title"
      onClose={() => setError("")}
      // Esc 或點背景關閉，等同跳過
      onCancel={() => !decided && skipName()}
      onClick={(e) => {
        if (e.target === e.currentTarget) skip();
      }}
      className="m-auto w-[calc(100%-2rem)] max-w-md rounded-[2rem] bg-transparent p-0 text-foreground backdrop:bg-foreground/30 backdrop:backdrop-blur-sm"
    >
      <form onSubmit={submit} className={`${glass} rounded-[2rem] bg-white/70 p-7 sm:p-9`}>
        <h2 id="welcome-title" className="font-display text-2xl sm:text-3xl">
          歡迎來到陳大哥愛文果園
        </h2>
        <p className="mt-3 text-sm leading-7 text-muted">
          我們直接從果園寄出愛文芒果。先告訴我們怎麼稱呼你吧。
        </p>

        <label htmlFor="visitor-name" className="mt-6 block text-sm font-medium">
          你的稱呼
        </label>
        <input
          id="visitor-name"
          type="text"
          autoComplete="nickname"
          maxLength={MAX_LENGTH}
          ref={input}
          defaultValue=""
          onChange={() => error && setError("")}
          placeholder="例如：小美"
          aria-invalid={!!error}
          aria-describedby={error ? "visitor-name-error" : undefined}
          className="mt-2 w-full rounded-2xl border border-foreground/20 bg-white/70 px-4 py-3 text-base outline-none transition-colors placeholder:text-muted/70 focus:border-foreground"
        />
        {error && (
          <p id="visitor-name-error" role="alert" className="mt-2 text-sm text-[#b3261e]">
            {error}
          </p>
        )}

        <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row">
          <button
            type="button"
            onClick={skip}
            className="rounded-full border border-foreground/30 px-6 py-3 text-sm transition-colors hover:bg-white/60"
          >
            先跳過
          </button>
          <button
            type="submit"
            className="flex-1 rounded-full bg-foreground px-6 py-3 text-sm text-background transition-opacity hover:opacity-80"
          >
            開始逛逛
          </button>
        </div>
      </form>
    </dialog>
  );
}

/** 首頁主視覺上方的歡迎語。沒有稱呼時不顯示，但保留高度避免版面跳動。 */
export function WelcomeLine() {
  const { name } = useVisitor();

  return (
    <p className="mb-5 flex min-h-7 flex-wrap items-center gap-x-3 text-base text-muted">
      {name && (
        <>
          <span>
            歡迎光臨，<strong className="font-medium text-foreground">{name}</strong>
          </span>
          <button
            type="button"
            onClick={askNameAgain}
            className="text-sm underline underline-offset-4 transition-opacity hover:opacity-60"
          >
            更改稱呼
          </button>
        </>
      )}
    </p>
  );
}
