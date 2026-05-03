"use client";

import { useEffect, useRef } from "react";

// ─── Text content ────────────────────────────────────────────────────────────
const NAME = "Viswa Yadeedya.";
const SUBTITLE = "<Full Stack Software Engineer/>";
const PURPOSE_LINES = [
  "I build the infrastructure AI runs on.",
  "Pipelines, APIs, systems that scale",
  "and never break under pressure.",
];
const FINAL_LINES = [
  "Anyone can follow instructions.",
  "I reverse engineer the thinking",
  "behind them.",
];

// ─── Scroll-% animation constants ────────────────────────────────────────────
// W = width of one character's own animation window (in scroll-% units)
const W = 1.5;

// Phase 1 → Phase 2: name + subtitle exit, purpose enters simultaneously
const NAME_EXIT_S = 19;
const NAME_STAGGER = 0.25; // 15 chars → last exits ~22.5%
const SUB_EXIT_S = 19.5;
const SUB_STAGGER = 0.18; // 31 chars → last exits ~25.1%
const PUR_ENTER_S = 19;
const PUR_E_STAGGER = 0.09; // 106 chars → last enters ~28.5%

// Phase 3: purpose exits upward
const PUR_EXIT_S = 31;
const PUR_X_STAGGER = 0.075; // 106 chars → last exits ~39%

// Phase 5: final lines enter one by one
const L_CHAR_STAGGER = 0.3;
const L1_S = 58; // Line 1 starts at 58%, completes ~68.5%
const L2_S = 70; // Line 2 starts at 70%, completes ~80%
const L3_S = 82; // Line 3 starts at 82%, completes ~86%

// ─── Utilities ────────────────────────────────────────────────────────────────
function clamp(v: number, lo: number, hi: number) {
  return Math.max(lo, Math.min(hi, v));
}

function smoothstep(t: number): number {
  const c = clamp(t, 0, 1);
  return c * c * (3 - 2 * c);
}

function getScrollPct(): number {
  const scrolly = document.querySelector(
    "[data-scrolly]",
  ) as HTMLElement | null;
  if (!scrolly) return 0;
  const maxScroll = scrolly.offsetHeight - window.innerHeight;
  return maxScroll > 0 ? clamp((window.scrollY / maxScroll) * 100, 0, 100) : 0;
}

// ─── Per-character config & state ─────────────────────────────────────────────
interface CharCfg {
  alwaysVisible: boolean; // Phase 1 text: starts fully visible
  enterS: number; // enter animation start scroll-% (-1 = no enter)
  enterE: number;
  exitS: number; // exit animation start scroll-% (-1 = no exit)
  exitE: number;
}

function charState(cfg: CharCfg, pct: number): { opacity: number; ty: number } {
  if (cfg.alwaysVisible) {
    if (cfg.exitS < 0 || pct <= cfg.exitS) return { opacity: 1, ty: 0 };
    if (pct < cfg.exitE) {
      const t = smoothstep((pct - cfg.exitS) / (cfg.exitE - cfg.exitS));
      return { opacity: 1 - t, ty: -40 * t };
    }
    return { opacity: 0, ty: -40 };
  }

  if (pct <= cfg.enterS) return { opacity: 0, ty: -40 };
  if (pct < cfg.enterE) {
    const t = smoothstep((pct - cfg.enterS) / (cfg.enterE - cfg.enterS));
    return { opacity: t, ty: -40 * (1 - t) };
  }
  if (cfg.exitS < 0 || pct <= cfg.exitS) return { opacity: 1, ty: 0 };
  if (pct < cfg.exitE) {
    const t = smoothstep((pct - cfg.exitS) / (cfg.exitE - cfg.exitS));
    return { opacity: 1 - t, ty: -40 * t };
  }
  return { opacity: 0, ty: -40 };
}

// ─── Render helper ────────────────────────────────────────────────────────────
function renderChars(text: string, initialOpacity: number, initialTy: number) {
  return text.split("").map((ch, i) => (
    <span
      key={i}
      style={{
        display: "inline-block",
        opacity: initialOpacity,
        transform: initialTy !== 0 ? `translateY(${initialTy}px)` : undefined,
        willChange: "opacity, transform",
      }}
    >
      {ch === " " ? " " : ch}
    </span>
  ));
}

// ─── Component ────────────────────────────────────────────────────────────────
export default function Overlay() {
  const nameRef = useRef<HTMLDivElement>(null);
  const subRef = useRef<HTMLDivElement>(null);
  const purposeRef = useRef<HTMLDivElement>(null);
  const finalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const qs = (parent: HTMLElement) =>
      Array.from(parent.querySelectorAll<HTMLSpanElement>("span"));

    const nameEls = nameRef.current ? qs(nameRef.current) : [];
    const subEls = subRef.current ? qs(subRef.current) : [];
    const purEls = purposeRef.current ? qs(purposeRef.current) : [];
    const finalEls = finalRef.current ? qs(finalRef.current) : [];

    type AnimRec = { el: HTMLSpanElement; cfg: CharCfg };
    const anims: AnimRec[] = [];

    // Phase 1 → Phase 2: name exits upward
    nameEls.forEach((el, i) =>
      anims.push({
        el,
        cfg: {
          alwaysVisible: true,
          enterS: -1,
          enterE: -1,
          exitS: NAME_EXIT_S + i * NAME_STAGGER,
          exitE: NAME_EXIT_S + i * NAME_STAGGER + W,
        },
      }),
    );

    // Phase 1 → Phase 2: subtitle exits upward (slightly after name starts)
    subEls.forEach((el, i) =>
      anims.push({
        el,
        cfg: {
          alwaysVisible: true,
          enterS: -1,
          enterE: -1,
          exitS: SUB_EXIT_S + i * SUB_STAGGER,
          exitE: SUB_EXIT_S + i * SUB_STAGGER + W,
        },
      }),
    );

    // Phase 2 enter / Phase 3 exit: purpose text (treated as a single flat sequence)
    purEls.forEach((el, i) =>
      anims.push({
        el,
        cfg: {
          alwaysVisible: false,
          enterS: PUR_ENTER_S + i * PUR_E_STAGGER,
          enterE: PUR_ENTER_S + i * PUR_E_STAGGER + W,
          exitS: PUR_EXIT_S + i * PUR_X_STAGGER,
          exitE: PUR_EXIT_S + i * PUR_X_STAGGER + W,
        },
      }),
    );

    // Phase 5: three lines, each with its own startScroll; char index resets per line
    const lineOffsets = [
      0,
      FINAL_LINES[0].length,
      FINAL_LINES[0].length + FINAL_LINES[1].length,
    ];
    const lineStarts = [L1_S, L2_S, L3_S];

    finalEls.forEach((el, gi) => {
      const li = gi < lineOffsets[1] ? 0 : gi < lineOffsets[2] ? 1 : 2;
      const ci = gi - lineOffsets[li];
      anims.push({
        el,
        cfg: {
          alwaysVisible: false,
          enterS: lineStarts[li] + ci * L_CHAR_STAGGER,
          enterE: lineStarts[li] + ci * L_CHAR_STAGGER + W,
          exitS: -1,
          exitE: -1,
        },
      });
    });

    const onScroll = () => {
      const pct = getScrollPct();
      for (const { el, cfg } of anims) {
        const { opacity, ty } = charState(cfg, pct);
        el.style.opacity = String(opacity);
        el.style.transform = ty !== 0 ? `translateY(${ty}px)` : "";
      }
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className="absolute inset-0 pointer-events-none select-none">
      {/* ── Phase 1: Name + Subtitle — static, fully visible ── */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <div
          ref={nameRef}
          className="text-[clamp(3rem,9vw,8.5rem)] font-bold text-white leading-[0.95] tracking-[-0.03em] text-center px-4"
          style={{ textShadow: "0 4px 60px rgba(0,0,0,0.6)" }}
        >
          {renderChars(NAME, 1, 0)}
        </div>
        <div
          ref={subRef}
          className="mt-5 font-mono text-[#f97316] text-[clamp(0.85rem,1.8vw,1.2rem)] tracking-wide"
        >
          {renderChars(SUBTITLE, 1, 0)}
        </div>
      </div>

      {/* ── Phase 2 / 3: Purpose text ── */}
      <div
        ref={purposeRef}
        className="absolute inset-0 flex flex-col items-center justify-center gap-1 px-6"
      >
        {PURPOSE_LINES.map((line, li) => (
          <div
            key={li}
            className="text-center text-[clamp(1.2rem,2.6vw,2.8rem)] font-semibold text-white leading-snug"
            style={{ textShadow: "0 4px 40px rgba(0,0,0,0.85)" }}
          >
            {renderChars(line, 0, -40)}
          </div>
        ))}
      </div>

      {/* ── Phase 5: Final three lines ── */}
      <div
        ref={finalRef}
        className="absolute inset-0 flex flex-col items-center justify-center gap-3 px-6"
      >
        {FINAL_LINES.map((line, li) => (
          <div
            key={li}
            className="text-center text-[clamp(1.8rem,4vw,4.2rem)] font-bold text-white leading-tight"
            style={{
              textShadow: "0 4px 50px rgba(0,0,0,0.7)",
              letterSpacing: "-0.02em",
            }}
          >
            {renderChars(line, 0, -40)}
          </div>
        ))}
      </div>
    </div>
  );
}
