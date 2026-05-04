"use client";

import { useEffect, useRef } from "react";

// ─── Content ──────────────────────────────────────────────────────────────────
const NAME     = "Viswa Yadeedya.";
const SUBTITLE = "<Full Stack Software Engineer/>";
const BLOCK1_LINES = [
  "I build the infrastructure AI runs on.",
  "Pipelines, APIs, systems that scale",
  "and never break under pressure.",
];
const FINAL_LINES = [
  "Anyone can follow instructions.",
  "I reverse engineer the thinking",
  "behind them.",
];

// ─── Timeline (scroll %) ──────────────────────────────────────────────────────
// Phase 1:  0 – 18   name + subtitle static
// Phase 2: 19 – 25   name + subtitle exit upward
// Phase 3: 26 – 30   empty
// Phase 4: 31 – 40   block1 enters from below
// Phase 5: 41 – 46   block1 exits upward
// Phase 6: 47 – 56   empty
// Phase 7: 57 – 100  final lines drop in from above

// ─── Scroll helper ────────────────────────────────────────────────────────────
function getScrollPct(): number {
  const el = document.querySelector<HTMLElement>("[data-scrolly]");
  if (!el) return 0;
  const max = el.offsetHeight - window.innerHeight;
  return max > 0 ? Math.max(0, Math.min(100, (window.scrollY / max) * 100)) : 0;
}

// ─── Math ─────────────────────────────────────────────────────────────────────
function ss(t: number): number {
  const c = Math.max(0, Math.min(1, t));
  return c * c * (3 - 2 * c);
}

// ─── Character animation config ───────────────────────────────────────────────
// Each character's opacity + ty is a PURE FUNCTION of scroll %.
// Scrolling forward → forward animation. Scrolling backward → exact reverse.
// No state, no triggers — only math.
//
// phase1     : starts fully visible, no enter; only has an exit window
// eS / eE    : enter window start / end (%)
// eTy        : ty at the start of enter  (+40 = chars rise from below; -40 = drop from above)
// xS / xE    : exit window start / end (%)  (Infinity = never exits)
// xTy        : ty at the end of exit    (-40 = exits upward; +40 = exits downward)
interface CharCfg {
  phase1: boolean;
  eS: number; eE: number; eTy: number;
  xS: number; xE: number; xTy: number;
}

function applyChar(el: HTMLSpanElement, c: CharCfg, p: number): void {
  let op: number, ty: number;

  if (c.phase1) {
    if      (p <= c.xS) { op = 1;     ty = 0;              }
    else if (p <  c.xE) { const t = ss((p-c.xS)/(c.xE-c.xS)); op = 1-t; ty = c.xTy*t; }
    else                { op = 0;     ty = c.xTy;           }
  } else {
    if      (p <= c.eS) { op = 0;     ty = c.eTy;           }
    else if (p <  c.eE) { const t = ss((p-c.eS)/(c.eE-c.eS)); op = t;   ty = c.eTy*(1-t); }
    else if (p <= c.xS) { op = 1;     ty = 0;               }
    else if (p <  c.xE) { const t = ss((p-c.xS)/(c.xE-c.xS)); op = 1-t; ty = c.xTy*t; }
    else                { op = 0;     ty = c.xTy;            }
  }

  el.style.opacity   = String(op);
  el.style.transform = ty === 0 ? "" : `translateY(${ty}px)`;
}

// ─── JSX helpers ──────────────────────────────────────────────────────────────
function chars(text: string, op0: number, ty0: number) {
  return text.split("").map((ch, i) => (
    <span
      key={i}
      style={{
        display: "inline-block",
        opacity: op0,
        transform: ty0 !== 0 ? `translateY(${ty0}px)` : undefined,
        willChange: "opacity, transform",
      }}
    >
      {ch === " " ? " " : ch}
    </span>
  ));
}

// ─── Component ────────────────────────────────────────────────────────────────
export default function Overlay() {
  const nameRef  = useRef<HTMLDivElement>(null);
  const subRef   = useRef<HTMLDivElement>(null);
  const b1Ref    = useRef<HTMLDivElement>(null);
  const finalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const spans = (el: HTMLElement) =>
      Array.from(el.querySelectorAll<HTMLSpanElement>("span"));

    const nEls = nameRef.current  ? spans(nameRef.current)  : [];
    const sEls = subRef.current   ? spans(subRef.current)   : [];
    const bEls = b1Ref.current    ? spans(b1Ref.current)    : [];
    const fEls = finalRef.current ? spans(finalRef.current) : [];

    const all: { el: HTMLSpanElement; cfg: CharCfg }[] = [];
    const W = 1.5; // default animation window width (scroll %)

    // ── Phase 2: Name exits upward [19 → 25] ─────────────────────────────
    {
      const n  = nEls.length;
      const st = n > 1 ? (25 - W - 19) / (n - 1) : 0;
      nEls.forEach((el, i) => all.push({ el, cfg: {
        phase1: true,
        eS: -Infinity, eE: -Infinity, eTy: 0,
        xS: 19 + i * st, xE: 19 + i * st + W, xTy: -40,
      }}));
    }

    // ── Phase 2: Subtitle exits upward [19.5 → 25] ───────────────────────
    {
      const n  = sEls.length;
      const st = n > 1 ? (25 - W - 19.5) / (n - 1) : 0;
      sEls.forEach((el, i) => all.push({ el, cfg: {
        phase1: true,
        eS: -Infinity, eE: -Infinity, eTy: 0,
        xS: 19.5 + i * st, xE: 19.5 + i * st + W, xTy: -40,
      }}));
    }

    // ── Phase 4/5: Block 1 ────────────────────────────────────────────────
    // Phase 4: enters from below (+40 → 0) [31 → 40]
    // Phase 5: exits upward     (0 → -40)  [41 → 46]
    // Reverse of Phase 4: chars fall back down (0 → +40) = "exits downward" ✓
    // Reverse of Phase 5: chars come back from above (-40 → 0) = "enters downward" ✓
    {
      const n   = bEls.length;
      const BW  = 1.2;
      const eSt = n > 1 ? (40 - BW - 31) / (n - 1) : 0;
      const xSt = n > 1 ? (46 - BW - 41) / (n - 1) : 0;
      bEls.forEach((el, i) => all.push({ el, cfg: {
        phase1: false,
        eS: 31 + i * eSt, eE: 31 + i * eSt + BW, eTy: 40,
        xS: 41 + i * xSt, xE: 41 + i * xSt + BW, xTy: -40,
      }}));
    }

    // ── Phase 7: Final lines drop in from above (-40 → 0) [57 → 100] ─────
    // Three lines stagger in one by one.
    // Reverse: lines stagger out bottom-to-top (last line entered reverses first).
    {
      const lineLens = FINAL_LINES.map(l => l.length);
      const lineOff  = [0, lineLens[0], lineLens[0] + lineLens[1]];
      const lS       = [57, 70, 84]; // line start %
      const lE       = [68, 81, 91]; // line end %

      fEls.forEach((el, gi) => {
        const li = gi < lineOff[1] ? 0 : gi < lineOff[2] ? 1 : 2;
        const ci = gi - lineOff[li];
        const n  = lineLens[li];
        const st = n > 1 ? (lE[li] - W - lS[li]) / (n - 1) : 0;
        all.push({ el, cfg: {
          phase1: false,
          eS: lS[li] + ci * st, eE: lS[li] + ci * st + W, eTy: -40,
          xS: Infinity, xE: Infinity, xTy: -40,
        }});
      });
    }

    const tick = () => {
      const p = getScrollPct();
      for (const { el, cfg } of all) applyChar(el, cfg, p);
    };

    window.addEventListener("scroll", tick, { passive: true });
    tick();
    return () => window.removeEventListener("scroll", tick);
  }, []);

  return (
    <div className="absolute inset-0 pointer-events-none select-none">

      {/* ── Phase 1 / 2: Name + Subtitle ─────────────────────────────────── */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <div
          ref={nameRef}
          className="text-[clamp(3rem,9vw,8.5rem)] font-bold text-white leading-[0.95] tracking-[-0.03em] text-center px-4"
          style={{ textShadow: "0 4px 60px rgba(0,0,0,0.6)" }}
        >
          {chars(NAME, 1, 0)}
        </div>
        <div
          ref={subRef}
          className="mt-5 font-mono text-[#f97316] text-[clamp(0.85rem,1.8vw,1.2rem)] tracking-wide"
        >
          {chars(SUBTITLE, 1, 0)}
        </div>
      </div>

      {/* ── Phase 4 / 5: Block 1 ─────────────────────────────────────────── */}
      <div
        ref={b1Ref}
        className="absolute inset-0 flex flex-col items-center justify-center gap-1 px-6"
      >
        {BLOCK1_LINES.map((line, i) => (
          <div
            key={i}
            className="text-center text-[clamp(1.2rem,2.6vw,2.8rem)] font-semibold text-white leading-snug"
            style={{ textShadow: "0 4px 40px rgba(0,0,0,0.85)" }}
          >
            {chars(line, 0, 40)}
          </div>
        ))}
      </div>

      {/* ── Phase 7: Final block ─────────────────────────────────────────── */}
      <div
        ref={finalRef}
        className="absolute inset-0 flex flex-col items-center justify-center gap-3 px-6"
      >
        {FINAL_LINES.map((line, i) => (
          <div
            key={i}
            className="text-center text-[clamp(1.8rem,4vw,4.2rem)] font-bold text-white leading-tight"
            style={{ textShadow: "0 4px 50px rgba(0,0,0,0.7)", letterSpacing: "-0.02em" }}
          >
            {chars(line, 0, -40)}
          </div>
        ))}
      </div>

    </div>
  );
}
