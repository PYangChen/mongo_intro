import Shell from "./components/Shell";
import { glass } from "./components/glass";
import { Parallax, ParallaxImage } from "./components/Parallax";
import { WelcomeLine } from "./components/Welcome";

const products = [
  {
    name: "家庭箱",
    spec: "3 台斤｜約 5 到 7 顆",
    desc: "一家人 3 天吃得完的量，從產地直接寄出。",
    price: 580,
    image: "/images/mango-ai-1.jpg",
    alt: "木桌上堆放的三顆熟透愛文芒果",
  },
  {
    name: "送禮禮盒",
    spec: "5 台斤｜約 8 – 10 顆",
    desc: "挑選外觀完整的大果，附手提禮盒，可直接寄給收禮的人。",
    price: 980,
    image: "/images/mango-ai-gift.jpg",
    alt: "牛皮紙禮盒裡整齊排放的六顆愛文芒果",
    tag: "送禮首選",
  },
  {
    name: "冷凍芒果丁",
    spec: "1 公斤｜可做冰沙、芒果冰",
    desc: "熟果去皮切丁後急速冷凍，不在產季也能吃到。",
    price: 420,
    image: "/images/mango-ai-2.jpg",
    alt: "切成方格花瓣狀的金黃芒果果肉",
  },
];

const eating = [
  ["看顏色", "表皮轉紅、底色帶黃，並聞到淡淡果香，就是可以吃的時候。"],
  ["按一按", "用指腹輕壓，有微微彈性。整顆發軟代表過熟，要趕快吃。"],
  ["怎麼切", "沿著果核兩側各切一刀，在果肉上劃格子，翻過來就能直接用湯匙挖。"],
];

const steps = [
  ["選擇規格", "在上面的三種規格中選一種，每次最少訂一箱。"],
  ["聯絡我們", "用電話或 LINE 告訴我們數量和收件地址。"],
  ["確認出貨日", "我們依採收進度排出貨日，並在出貨前一天通知你。"],
  ["收貨後放常溫", "芒果寄到後先放常溫 1 到 2 天，轉為橘紅色再冷藏。"],
];

const faqs = [
  ["可以指定到貨日期嗎？", "可以指定星期幾到貨，但實際日期要看採收進度，我們會事先跟你確認。"],
  ["收到的芒果有壞掉怎麼辦？", "收貨後 24 小時內拍照傳給我們，確認後會補寄或退款。"],
  ["離島可以寄嗎？", "可以，運費依地區計算，訂購時會一併告知。"],
];

export default function Home() {
  return (
    <Shell>

      {/* Hero */}
      <section id="top" className="grid items-center gap-12 lg:grid-cols-[1fr_1.1fr]">
        <div>
          <WelcomeLine />
          <h1 className="font-display text-5xl leading-[1.15] sm:text-6xl lg:text-7xl">
            熟了才摘，
            <br />
            兩天到你家。
          </h1>
          <p className="mt-6 max-w-md text-base leading-8 text-muted sm:mt-8 sm:text-lg">
            我們種愛文芒果，也自己出貨。果子在樹上轉紅、熟到剛好才採收，不經盤商，直接寄到你手上。
          </p>
          <div className="mt-10 flex flex-wrap gap-4">
            <a
              href="#products"
              className="rounded-full bg-foreground px-7 py-3 text-sm text-background transition-opacity hover:opacity-80"
            >
              選購芒果
            </a>
            <a
              href="#story"
              className="rounded-full border border-foreground/30 px-7 py-3 text-sm transition-colors hover:bg-white/40"
            >
              看看果園
            </a>
          </div>
        </div>

        {/* 照片 + 疊在上面的玻璃價格板 */}
        <div className="relative mb-8 sm:mb-6 lg:mb-0">
          <div className="relative aspect-[3/2] overflow-hidden rounded-3xl sm:rounded-[2rem] shadow-[0_30px_60px_-25px_rgba(255,138,31,0.6)]">
            <ParallaxImage
              src="/images/mango-ai-1.jpg"
              alt="木桌上堆放的三顆熟透愛文芒果"
              priority
              sizes="(min-width: 1024px) 560px, 100vw"
            />
          </div>
          <div className="absolute -bottom-6 left-4 max-w-[15rem] sm:left-auto sm:right-4 sm:max-w-[17rem] lg:right-[-1rem]">
            <Parallax speed={-0.12}>
              <div className={`${glass} rounded-3xl p-4 sm:p-5`}>
                <p className="text-sm text-muted">本季預購中</p>
                <p className="font-display mt-1 text-2xl">5 – 8 月</p>
                <p className="mt-2 text-sm leading-6">家庭箱 3 台斤，NT$ 580 起</p>
              </div>
            </Parallax>
          </div>
        </div>
      </section>

      {/* 產品 */}
      <section id="products">
        <h2 className="font-display text-3xl sm:text-4xl">選購愛文芒果</h2>
        <p className="mt-3 max-w-lg leading-7 text-muted">
          三種規格，運費另計，滿 NT$ 1,500 免運。
        </p>
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((p) => (
            <article key={p.name} className={`${glass} flex flex-col overflow-hidden rounded-3xl sm:rounded-[2rem] sm:max-lg:last:col-span-2 sm:max-lg:last:flex-row`}>
              <div className="relative aspect-[4/3] sm:max-lg:last:aspect-auto sm:max-lg:last:w-1/2">
                <ParallaxImage
                  src={p.image}
                  alt={p.alt}
                  sizes="(min-width: 1024px) 360px, (min-width: 640px) 50vw, 100vw"
                />
                {p.tag && (
                  <span className="absolute left-4 top-4 rounded-full bg-foreground px-3 py-1 text-xs text-background">
                    {p.tag}
                  </span>
                )}
              </div>
              <div className="flex flex-1 flex-col p-6">
                <h3 className="font-display text-2xl">{p.name}</h3>
                <p className="mt-1 text-sm text-muted">{p.spec}</p>
                <p className="mt-4 flex-1 leading-7">{p.desc}</p>
                <div className="mt-6 flex items-center justify-between">
                  <span className="font-display text-2xl">NT$ {p.price}</span>
                  <a
                    href="#order"
                    className="rounded-full bg-foreground px-5 py-2 text-sm text-background transition-opacity hover:opacity-80"
                  >
                    預購
                  </a>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* 果園故事 */}
      <section id="story" className="grid items-center gap-10 lg:grid-cols-2">
        <div className="grid grid-cols-2 gap-4">
          <div className="relative col-span-2 aspect-[16/10] overflow-hidden rounded-[2rem]">
            <ParallaxImage
              src="/images/mango-ai-3.jpg"
              alt="果園裡垂掛在枝頭的紅色愛文芒果"
              sizes="(min-width: 1024px) 560px, 100vw"
            />
          </div>
          <div className="relative col-span-2 aspect-[16/8] overflow-hidden rounded-[2rem]">
            <ParallaxImage
              src="/images/mango-ai-5.jpg"
              alt="農夫雙手捧著剛採收的愛文芒果"
              sizes="(min-width: 1024px) 560px, 100vw"
              className="object-bottom"
            />
          </div>
        </div>
        <div>
          <h2 className="font-display text-3xl sm:text-4xl">在樹上熟，比較甜。</h2>
          <div className="mt-6 flex max-w-md flex-col gap-5 leading-8">
            <p>
              愛文芒果在南台灣的陽光下長大。每一顆都套上紙袋，避開蟲害和曬傷，也少用農藥。
            </p>
            <p>
              我們等果皮轉紅、果肉飽滿才人工採收，當天分級包裝。不用催熟，所以你收到的芒果還在慢慢變甜。
            </p>
          </div>
          <dl className="mt-8 grid max-w-md grid-cols-3 gap-4 border-t border-foreground/20 pt-6 text-sm">
            <div>
              <dt className="text-muted">採收</dt>
              <dd className="mt-1 font-medium">人工逐顆</dd>
            </div>
            <div>
              <dt className="text-muted">出貨</dt>
              <dd className="mt-1 font-medium">採後 2 天內</dd>
            </div>
            <div>
              <dt className="text-muted">產季</dt>
              <dd className="mt-1 font-medium">5 – 8 月</dd>
            </div>
          </dl>
        </div>
      </section>

      {/* 怎麼吃 */}
      <section id="eat" className={`${glass} overflow-hidden rounded-3xl sm:rounded-[2rem]`}>
        <div className="grid lg:grid-cols-[1.1fr_1fr]">
          <div className="relative aspect-[3/2] lg:aspect-auto lg:min-h-[26rem]">
            <ParallaxImage
              src="/images/mango-ai-4.jpg"
              alt="芒果冰和芒果汁擺在夏日餐桌上"
              sizes="(min-width: 1024px) 600px, 100vw"
            />
          </div>
          <div className="p-6 sm:p-10 lg:p-12">
            <h2 className="font-display text-3xl sm:text-4xl">收到之後怎麼吃</h2>
            <ul className="mt-8 flex flex-col gap-6">
              {eating.map(([title, text]) => (
                <li key={title}>
                  <h3 className="font-medium">{title}</h3>
                  <p className="mt-1 text-sm leading-7 text-muted">{text}</p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* 怎麼訂 */}
      <section id="order" className="grid gap-10 lg:grid-cols-[1fr_1.2fr] lg:gap-12">
        <div>
          <h2 className="font-display text-3xl sm:text-4xl">怎麼訂</h2>
          <p className="mt-4 max-w-sm leading-8 text-muted">
            目前用電話和 LINE 接單，我們會當天回覆。
          </p>
          <div className={`${glass} mt-8 rounded-3xl p-6`}>
            <p className="text-sm text-muted">訂購專線</p>
            <p className="font-display mt-1 text-2xl sm:text-3xl">0900-000-000</p>
            <p className="mt-3 text-sm text-muted">週一至週六 9:00 – 18:00</p>
          </div>
        </div>
        <ol className="flex flex-col border-t border-foreground/20">
          {steps.map(([title, text], i) => (
            <li
              key={title}
              className="grid grid-cols-[2.5rem_1fr] gap-4 border-b border-foreground/20 py-6"
            >
              <span className="font-display text-2xl text-muted">{i + 1}</span>
              <div>
                <h3 className="font-medium">{title}</h3>
                <p className="mt-1 text-sm leading-7 text-muted">{text}</p>
              </div>
            </li>
          ))}
        </ol>
      </section>

      {/* 常見問題 */}
      <section>
        <h2 className="font-display text-3xl sm:text-4xl">常見問題</h2>
        <div className="mt-8 border-t border-foreground/20">
          {faqs.map(([q, a]) => (
            <details key={q} className="group border-b border-foreground/20 py-5">
              <summary className="flex cursor-pointer list-none items-center justify-between font-medium">
                {q}
                <span className="text-xl text-muted transition-transform group-open:rotate-45">+</span>
              </summary>
              <p className="mt-3 max-w-2xl leading-8 text-muted">{a}</p>
            </details>
          ))}
        </div>
      </section>
    </Shell>
  );
}
