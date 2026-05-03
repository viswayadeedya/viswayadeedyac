"use client";

import { useEffect, useRef } from "react";

export default function Cursor() {
  const outerRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let outerX = mouseX;
    let outerY = mouseY;
    let rafId: number;
    let isHovering = false;

    const onMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;

      // Inner dot snaps immediately
      if (innerRef.current) {
        innerRef.current.style.transform = `translate(${mouseX - 4}px, ${mouseY - 4}px)`;
      }

      // Check hover
      const target = e.target as Element;
      const hovered =
        target.closest("a, button, [data-hover]") !== null;

      if (hovered !== isHovering) {
        isHovering = hovered;
        if (outerRef.current) {
          outerRef.current.style.width = hovered ? "52px" : "36px";
          outerRef.current.style.height = hovered ? "52px" : "36px";
          outerRef.current.style.borderColor = hovered ? "#f97316" : "rgba(249,115,22,0.5)";
          outerRef.current.style.backgroundColor = hovered
            ? "rgba(249,115,22,0.08)"
            : "transparent";
        }
      }
    };

    const animate = () => {
      // Lag interpolation for outer ring
      outerX += (mouseX - outerX) * 0.12;
      outerY += (mouseY - outerY) * 0.12;

      if (outerRef.current) {
        const size = isHovering ? 52 : 36;
        outerRef.current.style.transform = `translate(${outerX - size / 2}px, ${outerY - size / 2}px)`;
      }

      rafId = requestAnimationFrame(animate);
    };

    const onMouseLeave = () => {
      if (outerRef.current) outerRef.current.style.opacity = "0";
      if (innerRef.current) innerRef.current.style.opacity = "0";
    };

    const onMouseEnter = () => {
      if (outerRef.current) outerRef.current.style.opacity = "1";
      if (innerRef.current) innerRef.current.style.opacity = "1";
    };

    document.addEventListener("mousemove", onMouseMove, { passive: true });
    document.addEventListener("mouseleave", onMouseLeave);
    document.addEventListener("mouseenter", onMouseEnter);
    rafId = requestAnimationFrame(animate);

    return () => {
      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseleave", onMouseLeave);
      document.removeEventListener("mouseenter", onMouseEnter);
      cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <>
      {/* Outer lagging ring */}
      <div
        ref={outerRef}
        className="fixed top-0 left-0 pointer-events-none z-[9998] rounded-full border transition-[width,height,border-color,background-color] duration-200"
        style={{
          width: 36,
          height: 36,
          borderWidth: 1.5,
          borderColor: "rgba(249,115,22,0.5)",
          willChange: "transform",
        }}
      />
      {/* Inner snapping dot */}
      <div
        ref={innerRef}
        className="fixed top-0 left-0 pointer-events-none z-[9998] rounded-full bg-[#f97316]"
        style={{
          width: 8,
          height: 8,
          willChange: "transform",
        }}
      />
    </>
  );
}
