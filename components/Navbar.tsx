"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiGithub, FiLinkedin } from "react-icons/fi";

const links = [
  { label: "About", href: "#about" },
  { label: "Experience", href: "#experience" },
  { label: "Projects", href: "#projects" },
];

interface NavbarProps {
  visible: boolean;
}

export default function Navbar({ visible }: NavbarProps) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.header
          initial={{ y: -80, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="fixed top-5 left-[75%] -translate-x-1/2 z-[100]"
        >
          <nav
            className={`flex items-center gap-2 px-5 py-2.5 rounded-full border transition-all duration-300 ${
              scrolled
                ? "bg-white/[0.06] border-white/10 backdrop-blur-xl shadow-[0_8px_32px_rgba(0,0,0,0.4)]"
                : "bg-white/[0.03] border-white/5 backdrop-blur-md"
            }`}
          >
            {links.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="px-3 py-1 text-sm text-white/70 hover:text-white transition-colors duration-200 rounded-full hover:bg-white/5"
                onClick={(e) => {
                  e.preventDefault();
                  document
                    .querySelector(link.href)
                    ?.scrollIntoView({ behavior: "smooth" });
                }}
              >
                {link.label}
              </a>
            ))}

            <div className="w-px h-4 bg-white/10 mx-1" />

            <a
              href="https://github.com/viswayadeedya"
              target="_blank"
              rel="noopener noreferrer"
              className="p-1.5 text-white/60 hover:text-white transition-colors rounded-full hover:bg-white/5"
              aria-label="GitHub"
            >
              <FiGithub size={16} />
            </a>
            <a
              href="https://www.linkedin.com/in/viswachatla"
              target="_blank"
              rel="noopener noreferrer"
              className="p-1.5 text-white/60 hover:text-white transition-colors rounded-full hover:bg-white/5"
              aria-label="LinkedIn"
            >
              <FiLinkedin size={16} />
            </a>
          </nav>
        </motion.header>
      )}
    </AnimatePresence>
  );
}
