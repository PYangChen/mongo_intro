"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState, type PointerEvent } from "react";
import { glass } from "../components/glass";

const W = 800;
const GAME_SECONDS = 15;
const GRAVITY = 900;

type Kind = "normal" | "gold" | "rotten";
type Fruit = { x: number; y: number; vx: number; vy: number; r: number; rot: number; vr: number; kind: Kind };
type Spark = { x: number; y: number; vx: number; vy: number; life: number; color: string; size: number };
type Pop = { x: number; y: number; text: string; life: number; color: string };
type Ripple = { x: number; y: number; life: number };

const POINTS: Record<Kind, number> = { normal: 10, gold: 30, rotten: -15 };
const COLORS: Record<Kind, string> = { normal: "#ff8a1f", gold: "#f2c230", rotten: "#5c6b3a" };

type Phase = "idle" | "playing" | "over";

function rank(score: number) {
  if (score >= 200) return "射芒果大師";
  if (score >= 120) return "神射手";
  if (score >= 60) return "手感不錯";
  return "再接再厲";
}

function drawMango(ctx: CanvasRenderingContext2D, f: Fruit) {
  ctx.save();
  ctx.translate(f.x, f.y);
  ctx.rotate(f.rot);

  const rx = f.r * 1.08;
  const ry = f.r * 0.86;
  const g = ctx.createRadialGradient(-rx * 0.35, -ry * 0.4, f.r * 0.1, 0, 0, f.r * 1.2);
  if (f.kind === "gold") {
    g.addColorStop(0, "#fff6b8");
    g.addColorStop(0.5, "#f2c230");
    g.addColorStop(1, "#c98a00");
    ctx.shadowColor = "rgba(242,194,48,0.9)";
    ctx.shadowBlur = 22;
  } else if (f.kind === "rotten") {
    g.addColorStop(0, "#a3aa82");
    g.addColorStop(0.55, "#5c6b3a");
    g.addColorStop(1, "#33361f");
  } else {
    g.addColorStop(0, "#ffd36b");
    g.addColorStop(0.5, "#ff8a1f");
    g.addColorStop(1, "#d8334a");
  }
  ctx.fillStyle = g;
  ctx.beginPath();
  ctx.ellipse(0, 0, rx, ry, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.shadowBlur = 0;

  if (f.kind === "rotten") {
    ctx.fillStyle = "rgba(30,25,10,0.55)";
    for (const [dx, dy, s] of [[-0.3, 0.1, 0.16], [0.25, -0.2, 0.12], [0.1, 0.35, 0.1]]) {
      ctx.beginPath();
      ctx.arc(dx * f.r, dy * f.r, s * f.r, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  // 葉子
  ctx.fillStyle = f.kind === "rotten" ? "#4a4f2c" : "#4f9d3a";
  ctx.beginPath();
  ctx.ellipse(rx * 0.15, -ry * 1.02, f.r * 0.34, f.r * 0.14, -0.6, 0, Math.PI * 2);
  ctx.fill();

  // 亮面高光
  ctx.fillStyle = "rgba(255,255,255,0.6)";
  ctx.beginPath();
  ctx.ellipse(-rx * 0.4, -ry * 0.42, f.r * 0.26, f.r * 0.14, -0.6, 0, Math.PI * 2);
  ctx.fill();

  ctx.restore();
}

export default function Game() {
  const canvas = useRef<HTMLCanvasElement>(null);
  const world = useRef({
    fruits: [] as Fruit[],
    sparks: [] as Spark[],
    pops: [] as Pop[],
    ripples: [] as Ripple[],
  });
  const scoreRef = useRef(0);
  // 邏輯座標：寬固定 800，高依畫面比例；k 為手機上放大芒果的倍率
  const dims = useRef({ H: 500, k: 1 });

  const [phase, setPhase] = useState<Phase>("idle");
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(GAME_SECONDS);
  const [best, setBest] = useState(0);
  const [hits, setHits] = useState({ hit: 0, shots: 0 });
  const hitsRef = useRef({ hit: 0, shots: 0 });

  const start = () => {
    world.current = { fruits: [], sparks: [], pops: [], ripples: [] };
    scoreRef.current = 0;
    hitsRef.current = { hit: 0, shots: 0 };
    setScore(0);
    setTimeLeft(GAME_SECONDS);
    setHits({ hit: 0, shots: 0 });
    setPhase("playing");
  };

  const spawn = useCallback(() => {
    const roll = Math.random();
    const kind: Kind = roll < 0.12 ? "gold" : roll < 0.28 ? "rotten" : "normal";
    const { H, k } = dims.current;
    const r = (kind === "gold" ? 26 : kind === "rotten" ? 32 : 36) * k;
    const x = 110 + Math.random() * (W - 220);
    const apex = H * (0.52 + Math.random() * (kind === "gold" ? 0.44 : 0.34));
    const vy = -Math.sqrt(2 * GRAVITY * apex) * (kind === "gold" ? 1.1 : 1);
    const vx = ((W / 2 - x) / W) * 260 + (Math.random() - 0.5) * 160 * (kind === "gold" ? 1.6 : 1);
    world.current.fruits.push({
      x,
      y: H + r,
      vx,
      vy,
      r,
      rot: Math.random() * Math.PI * 2,
      vr: (Math.random() - 0.5) * 6,
      kind,
    });
  }, []);

  // 遊戲迴圈
  useEffect(() => {
    if (phase !== "playing") return;
    const el = canvas.current;
    const ctx = el?.getContext("2d");
    if (!el || !ctx) return;

    const rect = el.getBoundingClientRect();
    const H = Math.round((W * rect.height) / rect.width);
    dims.current = { H, k: rect.width < 560 ? 1.45 : 1 };
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    el.width = W * dpr;
    el.height = H * dpr;

    let raf = 0;
    let last = performance.now();
    let elapsed = 0;
    let spawnIn = 0.3;
    let shownTenths = GAME_SECONDS * 10;

    const frame = (now: number) => {
      const dt = Math.min((now - last) / 1000, 0.05);
      last = now;
      elapsed += dt;
      const w = world.current;

      // 生成：越後面越密
      spawnIn -= dt;
      if (spawnIn <= 0 && elapsed < GAME_SECONDS) {
        spawn();
        if (Math.random() < 0.25) spawn();
        spawnIn = 0.75 - (elapsed / GAME_SECONDS) * 0.3;
      }

      for (const f of w.fruits) {
        f.vy += GRAVITY * dt;
        f.x += f.vx * dt;
        f.y += f.vy * dt;
        f.rot += f.vr * dt;
      }
      w.fruits = w.fruits.filter((f) => f.y - f.r < H + 80 || f.vy < 0);
      for (const s of w.sparks) {
        s.vy += 600 * dt;
        s.x += s.vx * dt;
        s.y += s.vy * dt;
        s.life -= dt;
      }
      w.sparks = w.sparks.filter((s) => s.life > 0);
      for (const p of w.pops) {
        p.y -= 50 * dt;
        p.life -= dt;
      }
      w.pops = w.pops.filter((p) => p.life > 0);
      for (const r of w.ripples) r.life -= dt;
      w.ripples = w.ripples.filter((r) => r.life > 0);

      // 繪製
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const bg = ctx.createLinearGradient(0, 0, 0, H);
      bg.addColorStop(0, "#cfe0e6");
      bg.addColorStop(0.65, "#e9eee6");
      bg.addColorStop(1, "#f6e3c4");
      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, W, H);

      for (const f of w.fruits) drawMango(ctx, f);

      for (const r of w.ripples) {
        ctx.strokeStyle = `rgba(20,38,43,${r.life * 3})`;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(r.x, r.y, 8 + (0.3 - r.life) * 70, 0, Math.PI * 2);
        ctx.stroke();
      }
      for (const s of w.sparks) {
        ctx.globalAlpha = Math.max(0, s.life * 2);
        ctx.fillStyle = s.color;
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.size, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;
      ctx.textAlign = "center";
      ctx.font = '900 30px "Noto Serif TC","Songti TC",serif';
      for (const p of w.pops) {
        ctx.globalAlpha = Math.min(1, p.life * 2);
        ctx.fillStyle = p.color;
        ctx.fillText(p.text, p.x, p.y);
      }
      ctx.globalAlpha = 1;

      // 倒數（每 0.1 秒更新一次畫面上的數字）
      const tenths = Math.max(0, Math.ceil((GAME_SECONDS - elapsed) * 10));
      if (tenths !== shownTenths) {
        shownTenths = tenths;
        setTimeLeft(tenths / 10);
      }

      if (elapsed >= GAME_SECONDS) {
        setScore(scoreRef.current);
        setHits({ ...hitsRef.current });
        setBest((b) => Math.max(b, scoreRef.current));
        setPhase("over");
        return;
      }
      raf = requestAnimationFrame(frame);
    };

    raf = requestAnimationFrame(frame);
    return () => cancelAnimationFrame(raf);
  }, [phase, spawn]);

  const shoot = (e: PointerEvent<HTMLCanvasElement>) => {
    if (phase !== "playing") return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) * W) / rect.width;
    const y = ((e.clientY - rect.top) * dims.current.H) / rect.height;
    const w = world.current;
    hitsRef.current.shots += 1;

    // 找距離最近、且在範圍內的芒果（範圍多留一點，手指點比較好中）
    let target: Fruit | null = null;
    let nearest = Infinity;
    for (const f of w.fruits) {
      const d = Math.hypot(f.x - x, f.y - y);
      if (d <= f.r + 8 * dims.current.k && d < nearest) {
        nearest = d;
        target = f;
      }
    }

    if (!target) {
      w.ripples.push({ x, y, life: 0.3 });
      return;
    }

    const pts = POINTS[target.kind];
    hitsRef.current.hit += 1;
    scoreRef.current = Math.max(0, scoreRef.current + pts);
    setScore(scoreRef.current);
    w.fruits = w.fruits.filter((f) => f !== target);
    w.pops.push({
      x: target.x,
      y: target.y,
      text: pts > 0 ? `+${pts}` : `${pts}`,
      life: 0.8,
      color: pts > 0 ? "#c2410c" : "#33361f",
    });
    for (let i = 0; i < 12; i++) {
      const a = (Math.PI * 2 * i) / 12 + Math.random() * 0.5;
      const sp = 140 + Math.random() * 220;
      w.sparks.push({
        x: target.x,
        y: target.y,
        vx: Math.cos(a) * sp,
        vy: Math.sin(a) * sp - 80,
        life: 0.5 + Math.random() * 0.3,
        color: COLORS[target.kind],
        size: 3 + Math.random() * 4,
      });
    }
  };

  const accuracy = hits.shots ? Math.round((hits.hit / hits.shots) * 100) : 0;

  return (
    <div className="mx-auto w-full max-w-3xl">
      {/* 計分板 */}
      <div className="mb-4 grid grid-cols-[1fr_auto] items-end gap-4">
        <div>
          <p className="text-sm text-muted">剩餘時間</p>
          <p className="font-display text-3xl tabular-nums" aria-live="off">
            {timeLeft.toFixed(1)} 秒
          </p>
        </div>
        <div className="text-right">
          <p className="text-sm text-muted">得分</p>
          <p className="font-display text-3xl tabular-nums">{score}</p>
        </div>
        <div className="col-span-2 h-1.5 overflow-hidden rounded-full bg-foreground/10">
          <div
            className="h-full rounded-full bg-[#ff8a1f] transition-[width] duration-100 ease-linear"
            style={{ width: `${(timeLeft / GAME_SECONDS) * 100}%` }}
          />
        </div>
      </div>

      {/* 遊戲區 */}
      <div className="relative aspect-square overflow-hidden rounded-3xl sm:aspect-[8/5] shadow-[0_30px_60px_-30px_rgba(255,138,31,0.55)] sm:rounded-[2rem]">
        <canvas
          ref={canvas}
          width={W}
          height={500}
          onPointerDown={shoot}
          aria-label="射芒果遊戲畫面"
          className="absolute inset-0 h-full w-full touch-none select-none bg-[#dfe9ec]"
          style={{ cursor: phase === "playing" ? "crosshair" : "default" }}
        />

        {phase !== "playing" && (
          <div className="absolute inset-0 flex items-center justify-center bg-foreground/15 p-4 backdrop-blur-[2px]">
            <div className={`${glass} w-full max-w-sm rounded-3xl bg-white/75 p-6 text-center sm:p-8`}>
              {phase === "idle" ? (
                <>
                  <h2 className="font-display text-2xl sm:text-3xl">射芒果</h2>
                  <p className="mt-3 text-sm leading-7 text-muted">
                    芒果會飛上來，在它飛行時點中它。限時 {GAME_SECONDS} 秒。
                  </p>
                </>
              ) : (
                <>
                  <p className="text-sm text-muted">時間到</p>
                  <p className="font-display mt-1 text-4xl tabular-nums sm:text-5xl">{score}</p>
                  <p className="font-display mt-2 text-xl">{rank(score)}</p>
                  <p className="mt-3 text-sm leading-7 text-muted">
                    命中 {hits.hit} 次｜命中率 {accuracy}%｜本次最高 {best} 分
                  </p>
                </>
              )}
              <button
                type="button"
                onClick={start}
                autoFocus
                className="mt-6 w-full rounded-full bg-foreground px-6 py-3 text-sm text-background transition-opacity hover:opacity-80"
              >
                {phase === "idle" ? "開始遊戲" : "再玩一次"}
              </button>
              {phase === "over" && (
                <Link
                  href="/#products"
                  className="mt-3 block rounded-full border border-foreground/30 px-6 py-3 text-sm transition-colors hover:bg-white/60"
                >
                  去買真的芒果
                </Link>
              )}
            </div>
          </div>
        )}
      </div>

      <ul className="mt-5 grid gap-2 text-sm sm:grid-cols-3">
        <li className="rounded-2xl border border-foreground/10 bg-white/50 px-4 py-3">
          <strong className="text-[#c2410c]">橘紅芒果</strong>
          <span className="ml-2 text-muted">+10 分</span>
        </li>
        <li className="rounded-2xl border border-foreground/10 bg-white/50 px-4 py-3">
          <strong className="text-[#a37400]">金芒果</strong>
          <span className="ml-2 text-muted">+30 分，又小又快</span>
        </li>
        <li className="rounded-2xl border border-foreground/10 bg-white/50 px-4 py-3">
          <strong className="text-[#4a5a2a]">爛芒果</strong>
          <span className="ml-2 text-muted">−15 分，別射到</span>
        </li>
      </ul>
      <p className="mt-4 text-sm leading-7 text-muted">
        這是單純好玩的小遊戲，分數不會影響優惠。
      </p>
    </div>
  );
}
