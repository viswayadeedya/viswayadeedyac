"use client";

import { FiGithub, FiLinkedin, FiMail } from "react-icons/fi";

export default function Footer() {
  return (
    <footer className="relative overflow-hidden border-t border-[#f97316]/40 py-16 px-6 md:px-16 bg-[#0a0a0a]">
      {/* Watermark */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 flex items-center justify-center select-none"
      >
        <span
          className="text-[clamp(6rem,18vw,14rem)] font-black tracking-tighter leading-none whitespace-nowrap"
          style={{ color: "rgba(249,115,22,0.07)" }}
        >
          AVAILABLE.
        </span>
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-6xl mx-auto flex flex-col gap-8">
        {/* Middle row */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <span className="text-white/70 text-lg font-semibold tracking-wide">
            Viswa Yadeedya
          </span>
          <div className="flex items-center gap-6">
            <a
              href="mailto:viswayadeedya.vy@gmail.com"
              className="text-white/40 hover:text-[#f97316] transition-colors"
              aria-label="Email"
            >
              <FiMail size={20} />
            </a>
            <a
              href="https://github.com/viswayadeedya"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white/40 hover:text-[#f97316] transition-colors"
              aria-label="GitHub"
            >
              <FiGithub size={20} />
            </a>
            <a
              href="https://www.linkedin.com/in/viswachatla"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white/40 hover:text-[#f97316] transition-colors"
              aria-label="LinkedIn"
            >
              <FiLinkedin size={20} />
            </a>
          </div>
        </div>

        {/* Bottom copyright */}
        <p className="text-center text-white/25 text-xs font-mono">
          © 2026 Viswa Yadeedya
        </p>
      </div>
    </footer>
  );
}
