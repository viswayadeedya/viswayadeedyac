"use client";

import { useRef } from "react";
import { motion } from "framer-motion";
import ScrambleText from "@/components/ScrambleText";
import WordReveal from "@/components/WordReveal";
import { useScrollReveal } from "@/hooks/useScrollReveal";

const techStack = [
  "TypeScript",
  "React",
  "Next.js",
  "Node.js",
  "Python",
  "FastAPI",
  "Java",
  "Spring Boot",
  "PostgreSQL",
  "AWS",
  "Docker",
  "Kubernetes",
  "Prefect",
  "LangChain",
  "RAG",
  "Vector DB",
  "Prometheus",
  "Grafana",
];

export default function About() {
  const pillsRef = useRef<HTMLDivElement>(null);
  const pillsInView = useScrollReveal(pillsRef, 0.1);

  return (
    <section
      id="about"
      className="py-32 px-6 md:px-16 lg:px-32 max-w-6xl mx-auto"
    >
      <div className="grid md:grid-cols-2 gap-16 items-start">
        {/* Left */}
        <div>
          <ScrambleText
            text="About"
            as="h2"
            className="text-[clamp(2.5rem,5vw,4rem)] font-bold text-white mb-8 tracking-tight"
          />
          <WordReveal
            text="Full Stack Software Engineer with a knack for building reliable, observable systems from the ground up whether that's ML pipelines, freight logistics platforms, or AI-powered tooling."
            className="text-white/60 text-lg leading-relaxed mb-6"
            direction="left"
          />
          <WordReveal
            text="I thrive at the intersection of infrastructure and product instrumenting systems with Prometheus and Grafana, designing OAuth2 RBAC flows, and shipping React dashboards that users actually love."
            className="text-white/60 text-lg leading-relaxed"
            direction="left"
            delay={0.2}
          />

          <div className="mt-10 flex gap-4 flex-wrap">
            <a
              href="mailto:viswachatla@gmail.com"
              className="px-5 py-2.5 rounded-full bg-[#f97316] text-black font-semibold text-sm hover:bg-[#fb923c] transition-colors"
            >
              Get in touch
            </a>
            <a
              href="https://github.com/viswayadeedya"
              target="_blank"
              rel="noopener noreferrer"
              className="px-5 py-2.5 rounded-full border border-white/10 text-white/70 text-sm hover:border-white/30 hover:text-white transition-colors"
            >
              View GitHub
            </a>
          </div>
        </div>

        {/* Right — tech stack pills */}
        <div>
          <p className="text-xs tracking-[0.3em] text-white/30 uppercase mb-6">
            Tech Stack
          </p>
          <div ref={pillsRef} className="flex flex-wrap gap-2">
            {techStack.map((tech, i) => (
              <motion.span
                key={tech}
                animate={
                  pillsInView
                    ? { opacity: 1, scale: 1 }
                    : { opacity: 0, scale: 0.8 }
                }
                transition={{ delay: i * 0.04, duration: 0.3, ease: "backOut" }}
                className="px-3 py-1.5 rounded-full text-sm border border-white/8 text-white/60 bg-white/[0.02] hover:border-[#f97316]/30 hover:text-white/80 transition-colors"
              >
                {tech}
              </motion.span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
