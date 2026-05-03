"use client";

import { RefObject, useEffect, useState } from "react";

/**
 * Returns true while the element is in the viewport.
 * Resets to false ONLY when the element exits below the viewport
 * (i.e. the user scrolled back up past it), so elements that were
 * scrolled past going DOWN stay in their revealed state.
 */
export function useScrollReveal(
  ref: RefObject<HTMLElement | null>,
  threshold = 0.1
): boolean {
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
        } else if (entry.boundingClientRect.top > 0) {
          // Element is below the viewport — user scrolled back up past it
          setInView(false);
        }
        // Element above viewport (scrolled down past) → keep revealed
      },
      { threshold }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [ref, threshold]);

  return inView;
}
