"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const TOTAL_FRAMES = 120;

function buildFrameUrl(i: number) {
  const idx = String(i).padStart(3, "0");
  return `/sequence/frame_${idx}_delay-0.066s.png`;
}

interface LoaderProps {
  onComplete: () => void;
}

export default function Loader({ onComplete }: LoaderProps) {
  const [progress, setProgress] = useState(0);
  const [visible, setVisible] = useState(true);
  const loaded = useRef(0);

  useEffect(() => {
    let cancelled = false;

    const urls = Array.from({ length: TOTAL_FRAMES }, (_, i) => buildFrameUrl(i));

    urls.forEach((url) => {
      const img = new Image();
      img.onload = img.onerror = () => {
        if (cancelled) return;
        loaded.current += 1;
        setProgress(Math.round((loaded.current / TOTAL_FRAMES) * 100));
        if (loaded.current === TOTAL_FRAMES) {
          setTimeout(() => {
            setVisible(false);
            setTimeout(onComplete, 600);
          }, 400);
        }
      };
      img.src = url;
    });

    return () => {
      cancelled = true;
    };
  }, [onComplete]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="loader"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6, ease: "easeInOut" }}
          className="fixed inset-0 z-[9999] bg-[#0a0a0a] flex flex-col items-center justify-center"
        >
          {/* Counter */}
          <motion.p
            className="text-[clamp(4rem,12vw,10rem)] font-bold text-white leading-none select-none"
            style={{ fontVariantNumeric: "tabular-nums" }}
          >
            {String(progress).padStart(3, "0")}
            <span className="text-[#f97316]">%</span>
          </motion.p>

          <p className="mt-4 text-sm tracking-[0.4em] text-white/30 uppercase">
            Loading
          </p>

          {/* Progress bar */}
          <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-white/5">
            <motion.div
              className="h-full bg-[#f97316] origin-left"
              style={{ scaleX: progress / 100 }}
              transition={{ duration: 0.1 }}
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
