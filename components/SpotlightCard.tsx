"use client";

import { useRef, MouseEvent, ReactNode } from "react";

interface SpotlightCardProps {
  children: ReactNode;
  className?: string;
}

export default function SpotlightCard({ children, className }: SpotlightCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const spotRef = useRef<HTMLDivElement>(null);

  const onMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    const card = cardRef.current;
    const spot = spotRef.current;
    if (!card || !spot) return;

    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    spot.style.background = `radial-gradient(300px circle at ${x}px ${y}px, rgba(249,115,22,0.12), transparent 70%)`;
  };

  const onMouseLeave = () => {
    if (spotRef.current) {
      spotRef.current.style.background = "transparent";
    }
  };

  return (
    <div
      ref={cardRef}
      data-hover
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
      className={`relative group overflow-hidden rounded-2xl border border-white/5 bg-white/[0.01] backdrop-blur-lg transition-transform duration-300 hover:-translate-y-2 ${className ?? ""}`}
    >
      {/* Spotlight layer */}
      <div
        ref={spotRef}
        className="absolute inset-0 z-0 pointer-events-none transition-all duration-100 rounded-2xl"
      />
      {/* Border glow on hover */}
      <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
        style={{ boxShadow: "inset 0 0 0 1px rgba(249,115,22,0.15)" }}
      />
      <div className="relative z-10">{children}</div>
    </div>
  );
}
