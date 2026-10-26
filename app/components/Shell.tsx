import type { ReactNode } from "react";
import Footer from "./Footer";
import Header from "./Header";
import LuckyDraw from "./LuckyDraw";
import { Parallax } from "./Parallax";
import { WelcomePrompt } from "./Welcome";

/** 全站共用外殼：背景光球 + Header + 內容 + Footer */
export default function Shell({ children }: { children: ReactNode }) {
  return (
    <div className="relative flex-1 overflow-hidden">
      {/* 背景色塊：讓玻璃有東西可以折射 */}
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <Parallax mode="page" speed={0.15} className="absolute -right-24 top-24">
          <div className="h-[34rem] w-[34rem] rounded-full bg-[#ffb347]/50 blur-3xl" />
        </Parallax>
        <Parallax mode="page" speed={0.25} className="absolute -left-40 top-[60rem]">
          <div className="h-[30rem] w-[30rem] rounded-full bg-[#9bc43c]/35 blur-3xl" />
        </Parallax>
        <Parallax mode="page" speed={0.35} className="absolute right-0 top-[100rem]">
          <div className="h-[30rem] w-[30rem] rounded-full bg-[#ff8a1f]/30 blur-3xl" />
        </Parallax>
      </div>

      <div className="relative mx-auto flex max-w-6xl flex-col gap-20 px-4 pb-12 pt-3 sm:gap-24 sm:px-6 sm:pb-16 sm:pt-4 lg:gap-28">
        <Header />
        {children}
        <Footer />
      </div>

      <LuckyDraw />
      <WelcomePrompt />
    </div>
  );
}
