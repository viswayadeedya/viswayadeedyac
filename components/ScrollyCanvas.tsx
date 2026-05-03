"use client";

import { useEffect, useRef, useCallback, ReactNode } from "react";
import { useScroll, useMotionValueEvent } from "framer-motion";

const TOTAL_FRAMES = 120;

function frameUrl(i: number) {
  return `/sequence/frame_${String(i).padStart(3, "0")}_delay-0.066s.png`;
}

interface ScrollyCanvasProps {
  children?: ReactNode;
}

export default function ScrollyCanvas({ children }: ScrollyCanvasProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const framesRef = useRef<HTMLImageElement[]>([]);
  const currentFrameRef = useRef(0);
  const rafRef = useRef<number | null>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  const drawFrame = useCallback((index: number) => {
    const canvas = canvasRef.current;
    const img = framesRef.current[index];
    if (!canvas || !img || !img.complete) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      drawFrame(currentFrameRef.current);
    };
    resize();
    window.addEventListener("resize", resize);

    framesRef.current = Array.from({ length: TOTAL_FRAMES }, (_, i) => {
      const img = new Image();
      img.src = frameUrl(i);
      return img;
    });

    framesRef.current[0].onload = () => drawFrame(0);

    return () => window.removeEventListener("resize", resize);
  }, [drawFrame]);

  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    const target = Math.min(
      TOTAL_FRAMES - 1,
      Math.round(latest * (TOTAL_FRAMES - 1))
    );
    if (target === currentFrameRef.current) return;
    currentFrameRef.current = target;
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    rafRef.current = requestAnimationFrame(() => drawFrame(target));
  });

  return (
    <div
      ref={containerRef}
      className="relative"
      style={{ height: "500vh" }}
      data-scrolly
    >
      <div className="sticky top-0 h-screen w-full overflow-hidden">
        <canvas
          ref={canvasRef}
          className="absolute inset-0 w-full h-full"
          style={{ display: "block", objectFit: "cover" }}
        />

        {/* Vignette */}
        <div
          className="absolute inset-0 z-10 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse at center, transparent 45%, rgba(10,10,10,0.65) 100%)",
          }}
        />

        {/* Bottom fade into content */}
        <div
          className="absolute bottom-0 left-0 right-0 z-10 pointer-events-none"
          style={{
            height: "22%",
            background: "linear-gradient(to bottom, transparent, #0a0a0a)",
          }}
        />

        {/* Overlay children (hero, scroll indicator, text overlays) */}
        <div className="absolute inset-0 z-20">{children}</div>
      </div>
    </div>
  );
}
