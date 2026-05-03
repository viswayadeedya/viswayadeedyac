"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";

interface WordRevealProps {
  text: string;
  className?: string;
  direction?: "left" | "right";
  delay?: number;
}

export default function WordReveal({
  text,
  className,
  direction = "left",
  delay = 0,
}: WordRevealProps) {
  const [visible, setVisible] = useState(false);
  const ref = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
        } else if (entry.boundingClientRect.top > 0) {
          // Below viewport — user scrolled back up past this element
          setVisible(false);
        }
        // Above viewport (scrolled past going down) — stay visible
      },
      { threshold: 0.1 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const words = text.split(" ");
  const xStart = direction === "left" ? -24 : 24;

  return (
    <p ref={ref} className={`flex flex-wrap gap-x-[0.35em] ${className ?? ""}`}>
      {words.map((word, i) => (
        <motion.span
          key={i}
          animate={
            visible
              ? { opacity: 1, x: 0, filter: "blur(0px)" }
              : { opacity: 0, x: xStart, filter: "blur(4px)" }
          }
          transition={{
            duration: 0.5,
            delay: visible ? delay + i * 0.06 : i * 0.03,
            ease: [0.22, 1, 0.36, 1],
          }}
          style={{ display: "inline-block" }}
        >
          {word}
        </motion.span>
      ))}
    </p>
  );
}
