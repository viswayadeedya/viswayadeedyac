"use client";

import { useEffect, useRef } from "react";
import { motion } from "framer-motion";

export default function ScrollIndicator() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onScroll = () => {
      if (!ref.current) return;
      const opacity = Math.max(0, 1 - window.scrollY / 200);
      ref.current.style.opacity = String(opacity);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div
      ref={ref}
      className="absolute bottom-10 left-1/2 -translate-x-1/2 z-30 flex flex-col items-center gap-2"
      style={{ willChange: "opacity" }}
    >
      {/* Mouse SVG */}
      <svg
        width="24"
        height="38"
        viewBox="0 0 24 38"
        fill="none"
        stroke="rgba(255,255,255,0.5)"
        strokeWidth="1.5"
        className="rounded-[12px]"
      >
        <rect x="1" y="1" width="22" height="36" rx="11" />
        <motion.line
          x1="12"
          y1="8"
          x2="12"
          y2="14"
          strokeLinecap="round"
          animate={{ y: [0, 6, 0] }}
          transition={{ duration: 1.4, repeat: Infinity, ease: "easeInOut" }}
        />
      </svg>

      <p
        className="text-[10px] tracking-[0.35em] text-white/30 uppercase"
      >
        Scroll
      </p>
    </div>
  );
}
