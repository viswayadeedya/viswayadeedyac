"use client";

import { useRef, ReactNode } from "react";
import { motion } from "framer-motion";
import ScrambleText from "@/components/ScrambleText";
import WordReveal from "@/components/WordReveal";
import SpotlightCard from "@/components/SpotlightCard";
import { useScrollReveal } from "@/hooks/useScrollReveal";

const experiences = [
  {
    company: "Flexport",
    role: "Software Engineer",
    period: "Jan 2025 – Present",
    description:
      "Building ML pipeline infrastructure and real-time systems at scale. Engineered WebSocket push notifications, designed OAuth2 RBAC authorization flows, and shipped React dashboards with full Prometheus/Grafana observability stacks.",
    tags: ["AWS", "Docker", "Prefect", "React", "Python", "GitHub Actions", "Prometheus", "Grafana"],
    accent: "#f97316",
  },
  {
    company: "SilviA",
    role: "Volunteer Software Engineer",
    period: "2024 — Present",
    description:
      "Building AI/ML infrastructure and geospatial data pipelines for an Earth Observation platform. Implemented cloud observability tooling, automated satellite data ingestion workflows, and contributed to scalable backend architecture processing large-scale geospatial datasets.",
    tags: ["Python", "AWS", "Geospatial", "ML Pipelines", "Observability", "Docker"],
    accent: "#3b82f6",
  },
  {
    company: "Impartial",
    role: "Volunteer Software Engineer",
    period: "2024 — Present",
    description:
      "Building Lawgivr — a micro-donation platform connecting merchants and nonprofits at checkout. Owns full stack architecture decisions including payment infrastructure via Stripe Connect Express, multi-role onboarding flows, and merchant/nonprofit web dashboards.",
    tags: ["Node.js", "Express", "PostgreSQL", "Stripe", "AWS", "Prisma", "React"],
    accent: "#f97316",
  },
  {
    company: "Central Michigan University",
    role: "Research Assistant",
    period: "Jun 2024 – Dec 2024",
    description:
      "Developed Python ETL pipelines processing large research datasets, built RESTful APIs backed by PostgreSQL, and created interactive React visualization dashboards to surface insights for academic researchers.",
    tags: ["Python", "PostgreSQL", "FastAPI", "React", "ETL"],
    accent: "#3b82f6",
  },
  {
    company: "JB Hunt (via Imaginnovate)",
    role: "Full Stack Engineer",
    period: "Dec 2019 – Jul 2023",
    description:
      "Led Angular 12 migration of 20+ legacy modules, upgraded Spring Boot 2→3 resolving 10+ CVEs, and built comprehensive Cypress/Jasmine test suites. Platform served 100+ daily active users.",
    tags: ["Angular", "Spring Boot", "Java", "Cypress", "Jasmine", "CI/CD"],
    accent: "#8b5cf6",
  },
];

function RevealItem({ delay, children }: { delay: number; children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useScrollReveal(ref, 0.1);

  return (
    <motion.div
      ref={ref}
      animate={{ opacity: inView ? 1 : 0, y: inView ? 0 : 40 }}
      transition={{ duration: 0.6, delay: inView ? delay : 0, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}

export default function Experience() {
  return (
    <section id="experience" className="py-32 px-6 md:px-16 lg:px-32 max-w-6xl mx-auto">
      <ScrambleText
        text="Experience"
        as="h2"
        className="text-[clamp(2.5rem,5vw,4rem)] font-bold text-white mb-16 tracking-tight"
      />

      <div className="space-y-6">
        {experiences.map((exp, i) => (
          <RevealItem key={exp.company} delay={i * 0.1}>
            <SpotlightCard className="p-8">
              <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-4">
                <div>
                  <h3 className="text-xl font-bold text-white">{exp.company}</h3>
                  <p className="text-sm mt-1" style={{ color: exp.accent }}>
                    {exp.role}
                  </p>
                </div>
                <span className="text-sm text-white/30 font-mono whitespace-nowrap">
                  {exp.period}
                </span>
              </div>

              <WordReveal
                text={exp.description}
                className="text-white/60 text-base leading-relaxed mb-6"
                direction="left"
                delay={i * 0.05}
              />

              <div className="flex flex-wrap gap-2">
                {exp.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-2.5 py-1 rounded-md text-xs font-mono border border-white/5 text-white/40 bg-white/[0.02]"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </SpotlightCard>
          </RevealItem>
        ))}
      </div>
    </section>
  );
}
