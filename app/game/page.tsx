import type { Metadata } from "next";
import Shell from "../components/Shell";
import Game from "./Game";

export const metadata: Metadata = {
  title: "射芒果小遊戲 | 愛文果園",
  description: "15 秒內射中飛起來的芒果，看你能拿幾分。",
};

export default function GamePage() {
  return (
    <Shell>
      <section>
        <h1 className="font-display mx-auto max-w-3xl text-4xl sm:text-5xl">射芒果</h1>
        <p className="mx-auto mt-4 max-w-3xl leading-8 text-muted">
          休息一下，玩 15 秒。射中越多芒果分數越高。
        </p>
        <div className="mt-10">
          <Game />
        </div>
      </section>
    </Shell>
  );
}
