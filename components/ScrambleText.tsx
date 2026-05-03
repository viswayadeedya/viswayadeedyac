"use client";

import { useEffect, useRef, useState } from "react";

const CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%";

interface ScrambleTextProps {
  text: string;
  className?: string;
  as?: "h1" | "h2" | "h3" | "p" | "span";
  delay?: number;
}

function randomChar() {
  return CHARS[Math.floor(Math.random() * CHARS.length)];
}

function randomized(text: string) {
  return text.split("").map((ch) => (ch === " " ? " " : randomChar()));
}

export default function ScrambleText({
  text,
  className,
  as: Tag = "h2",
  delay = 0,
}: ScrambleTextProps) {
  const [displayed, setDisplayed] = useState(() => randomized(text));
  const [done, setDone] = useState(false);
  const ref = useRef<HTMLElement>(null);
  const rafRef = useRef<number | null>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    function cancel() {
      if (timeoutRef.current !== null) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
    }

    function scramble() {
      cancel();
      const total = text.length;
      let frame = 0;
      const maxFrames = total * 3;

      const tick = () => {
        setDisplayed(
          text.split("").map((ch, i) => {
            if (ch === " ") return " ";
            const revealAt = Math.floor((i / total) * maxFrames);
            if (frame >= revealAt + 6) return ch;
            return randomChar();
          })
        );
        frame++;
        if (frame < maxFrames + 6) {
          rafRef.current = requestAnimationFrame(tick);
        } else {
          rafRef.current = null;
          setDisplayed(text.split(""));
          setDone(true);
        }
      };

      rafRef.current = requestAnimationFrame(tick);
    }

    function reset() {
      cancel();
      setDone(false);
      setDisplayed(randomized(text));
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          timeoutRef.current = setTimeout(scramble, delay);
        } else if (entry.boundingClientRect.top > 0) {
          // Element is below the viewport — user scrolled back up
          reset();
        }
        // Element above viewport (scrolled past going down) — leave resolved
      },
      { threshold: 0.1 }
    );

    observer.observe(el);
    return () => {
      observer.disconnect();
      cancel();
    };
  }, [delay, text]);

  return (
    <Tag ref={ref as React.RefObject<HTMLHeadingElement>} className={className}>
      {displayed.map((ch, i) => (
        <span
          key={i}
          style={{
            color:
              !done && ch !== text[i] && ch !== " "
                ? "rgba(249,115,22,0.7)"
                : undefined,
            transition: "color 0.05s",
          }}
        >
          {ch}
        </span>
      ))}
    </Tag>
  );
}
