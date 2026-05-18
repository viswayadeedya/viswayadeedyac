"use client";

import { useRef, useEffect, useState, useMemo, MutableRefObject } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Stars, MeshDistortMaterial } from "@react-three/drei";
import * as THREE from "three";
import ScrambleText from "@/components/ScrambleText";

type Project = {
  name: string;
  tagline: string;
  description: string;
  tags: string[];
  stat: string;
  accent: string;
  badge?: string;
  url?: string;
};

const projects: Project[] = [
  {
    name: "SelahPath™",
    tagline: "Deep Bible Study",
    description:
      "A verse-by-verse Bible study tool that reveals what your translation couldn't fit — letter by letter, layer by layer, word by word. Built on a Next.js + GPT-4o pipeline with Hebrew and Greek root analysis, ancient pictograph letter breakdowns, PARDES rabbinic interpretation layers, and Myron Golden's four-level teaching framework. Analyses are permanently cached in PostgreSQL — every study is instant the second time. Supports KJV, WEB, BBE, and IRVTel.",
    tags: ["Next.js", "GPT-4o", "PostgreSQL", "Prompt Engineering", "Hebrew/Greek", "Vercel"],
    stat: "Selah — pause and reflect.",
    accent: "#f97316",
    badge: "Early MVP",
    url: "https://selahpath.vercel.app",
  },
  {
    name: "Clarito",
    tagline: "Visual Learning Canvas",
    description:
      "A chapter-based visual canvas for people who learn by drawing. Built for visual thinkers who need to sketch connections, not bullet points. Supabase + FastAPI backend with JWT auth, RBAC, and auto-saving Excalidraw canvas stored as JSONB. Scroll-driven landing page with a 120-frame cinematic sequence.",
    tags: ["FastAPI", "React", "PostgreSQL", "Excalidraw", "Python", "Supabase"],
    stat: "To draw is to understand.",
    accent: "#3b82f6",
    badge: "Early MVP",
    url: "https://getclarito.vercel.app",
  },
  {
    name: "Lawgivr",
    tagline: "Micro-Donation Platform",
    description:
      "Connects merchants and nonprofits at checkout customers donate spare change while paying. Built with Node/Express, PostgreSQL, Stripe Connect Express, AWS (RDS, Elastic Beanstalk, Cognito, S3), and Prisma.",
    tags: ["Node.js", "Express", "PostgreSQL", "Stripe", "AWS", "Prisma"],
    stat: "Merchants + nonprofits + customers, one checkout",
    accent: "#f97316",
    badge: "In Progress",
  },
  {
    name: "Coach OS",
    tagline: "Personal Development AI",
    description:
      "AI-powered coaching app that reduces decision fatigue and builds self-awareness. Supabase + FastAPI backend with a full schema designed around one north star metric guilt reduction score.",
    tags: ["Supabase", "FastAPI", "OpenAI", "PostgreSQL", "Python"],
    stat: "Less guilt. More momentum.",
    accent: "#f97316",
    badge: "In Progress",
  },
  {
    name: "NextRoleAI",
    tagline: "AI Job Market Intelligence",
    description:
      "Automated job market intelligence platform powered by LangGraph + LangChain orchestration. Cuts manual job research by 90%+ agents crawl, classify, and surface actionable insights in real time.",
    tags: ["LangGraph", "LangChain", "OpenAI", "FastAPI", "React", "Python"],
    stat: "90%+ less manual analysis",
    accent: "#f97316",
  },
  {
    name: "AI Video Content Assistant",
    tagline: "YouTube → Structured Knowledge",
    description:
      "Full-stack tool that generates TLDRs, summaries, and Q&A from any YouTube link. Gated behind Stripe subscriptions for freemium access. Built with React frontend, FastAPI backend, and OpenAI processing.",
    tags: ["React", "FastAPI", "OpenAI", "Stripe", "Python"],
    stat: "Instant TLDR + Q&A",
    accent: "#3b82f6",
  },
  {
    name: "PuzzlePulse",
    tagline: "Serverless Quiz Platform",
    description:
      "Serverless quiz platform on AWS Lambda + DynamoDB + Spring Boot. Eliminated server costs by 40% vs traditional deployment. CI/CD pipeline cut release time by 60% through automated testing and one-click deploys.",
    tags: ["AWS Lambda", "DynamoDB", "Java", "Spring Boot", "CI/CD"],
    stat: "40% cost reduction · 60% faster releases",
    accent: "#8b5cf6",
  },
];

// ── Canvas texture builder ──────────────────────────────────────────────────────
function buildCardTexture(
  project: Project,
  active: boolean,
): THREE.CanvasTexture {
  const W = 800;
  const H = 960;
  const canvas = document.createElement("canvas");
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext("2d")!;

  ctx.clearRect(0, 0, W, H);

  // Background — active is noticeably lighter/warmer
  ctx.fillStyle = active ? "rgba(26,24,44,1.0)" : "rgba(12,12,18,0.82)";
  roundRect(ctx, 0, 0, W, H, 32);
  ctx.fill();

  // Outer glow painted BEHIND the border for active cards
  if (active) {
    // Wide soft halo
    const halo = ctx.createRadialGradient(
      W / 2,
      H / 2,
      H * 0.1,
      W / 2,
      H / 2,
      H * 0.95,
    );
    halo.addColorStop(0, `${project.accent}30`);
    halo.addColorStop(0.5, `${project.accent}12`);
    halo.addColorStop(1, "transparent");
    ctx.fillStyle = halo;
    roundRect(ctx, 0, 0, W, H, 32);
    ctx.fill();
  }

  // Border — thick solid orange when active, near-invisible when not
  if (active) {
    ctx.strokeStyle = project.accent;
    ctx.lineWidth = 6;
    roundRect(ctx, 3, 3, W - 6, H - 6, 30);
    ctx.stroke();
    // Inner thin highlight line
    ctx.strokeStyle = `${project.accent}50`;
    ctx.lineWidth = 1.5;
    roundRect(ctx, 9, 9, W - 18, H - 18, 26);
    ctx.stroke();
  } else {
    ctx.strokeStyle = "rgba(255,255,255,0.06)";
    ctx.lineWidth = 1.5;
    roundRect(ctx, 1, 1, W - 2, H - 2, 31);
    ctx.stroke();
  }

  const PX = 60;
  const alpha = active ? 1 : 0.5; // dim everything on inactive cards

  // Accent bar
  ctx.globalAlpha = alpha;
  ctx.fillStyle = project.accent;
  ctx.beginPath();
  ctx.roundRect(PX, 68, 52, 5, 2);
  ctx.fill();
  ctx.globalAlpha = 1;

  // Badge
  if (project.badge) {
    const bW = 160;
    ctx.globalAlpha = alpha;
    ctx.fillStyle = active ? `${project.accent}28` : `${project.accent}12`;
    ctx.strokeStyle = active ? `${project.accent}90` : `${project.accent}40`;
    ctx.lineWidth = active ? 2 : 1.5;
    ctx.beginPath();
    ctx.roundRect(W - PX - bW, 54, bW, 38, 19);
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = project.accent;
    ctx.font = `600 ${active ? 22 : 20}px -apple-system, BlinkMacSystemFont, sans-serif`;
    ctx.textAlign = "center";
    ctx.fillText(project.badge, W - PX - bW / 2, 80);
    ctx.textAlign = "left";
    ctx.globalAlpha = 1;
  }

  // Title — auto-shrink font until it fits, then wrap to max 2 lines if needed
  ctx.globalAlpha = alpha;
  ctx.fillStyle = "#ffffff";
  const maxTitleW = W - PX * 2;
  let titleSize = active ? 68 : 56;
  const titleFont = (sz: number) =>
    `700 ${sz}px -apple-system, BlinkMacSystemFont, sans-serif`;
  ctx.font = titleFont(titleSize);
  while (ctx.measureText(project.name).width > maxTitleW && titleSize > 32) {
    titleSize -= 4;
    ctx.font = titleFont(titleSize);
  }
  // If still too wide at minimum size, split into two lines at last fitting space
  if (ctx.measureText(project.name).width > maxTitleW) {
    const words = project.name.split(" ");
    let line1 = "";
    let line2 = "";
    let split = words.length - 1;
    for (let i = words.length - 1; i >= 1; i--) {
      const candidate = words.slice(0, i).join(" ");
      if (ctx.measureText(candidate).width <= maxTitleW) {
        split = i;
        break;
      }
    }
    line1 = words.slice(0, split).join(" ");
    line2 = words.slice(split).join(" ");
    const lineH = titleSize * 1.15;
    const baseY = active ? 158 : 150;
    ctx.fillText(line1, PX, baseY);
    ctx.fillText(line2, PX, baseY + lineH);
  } else {
    ctx.fillText(project.name, PX, active ? 172 : 162);
  }

  // Tagline
  ctx.fillStyle = active ? project.accent : `${project.accent}90`;
  ctx.font = `500 ${active ? 32 : 27}px -apple-system, BlinkMacSystemFont, sans-serif`;
  ctx.fillText(project.tagline, PX, active ? 222 : 208);

  // Divider
  ctx.strokeStyle = active
    ? "rgba(255,255,255,0.10)"
    : "rgba(255,255,255,0.04)";
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(PX, active ? 248 : 236);
  ctx.lineTo(W - PX, active ? 248 : 236);
  ctx.stroke();

  // Description
  ctx.fillStyle = active ? "rgba(255,255,255,0.72)" : "rgba(255,255,255,0.38)";
  ctx.font = `400 ${active ? 28 : 24}px -apple-system, BlinkMacSystemFont, sans-serif`;
  wrapText(
    ctx,
    project.description,
    PX,
    active ? 300 : 280,
    W - PX * 2,
    active ? 42 : 37,
  );

  // Stat box
  ctx.fillStyle = active
    ? "rgba(255,255,255,0.045)"
    : "rgba(255,255,255,0.015)";
  ctx.strokeStyle = active
    ? "rgba(255,255,255,0.10)"
    : "rgba(255,255,255,0.04)";
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.roundRect(PX, 592, W - PX * 2, 62, 10);
  ctx.fill();
  ctx.stroke();
  ctx.fillStyle = active ? "rgba(255,255,255,0.55)" : "rgba(255,255,255,0.22)";
  ctx.font = `400 ${active ? 24 : 20}px 'SF Mono', 'Fira Code', monospace`;
  ctx.fillText(project.stat, PX + 20, 632);

  // Tags
  let tx = PX;
  let ty = 706;
  ctx.font = `400 ${active ? 23 : 20}px 'SF Mono', 'Fira Code', monospace`;
  for (const tag of project.tags) {
    const tw = ctx.measureText(tag).width + 28;
    if (tx + tw > W - PX) {
      tx = PX;
      ty += active ? 52 : 46;
    }
    if (ty > H - 60) break;
    ctx.fillStyle = active
      ? "rgba(255,255,255,0.06)"
      : "rgba(255,255,255,0.02)";
    ctx.strokeStyle = active
      ? "rgba(255,255,255,0.14)"
      : "rgba(255,255,255,0.05)";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.roundRect(tx, ty, tw, active ? 38 : 34, 5);
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = active
      ? "rgba(255,255,255,0.60)"
      : "rgba(255,255,255,0.25)";
    ctx.fillText(tag, tx + 14, ty + (active ? 27 : 24));
    tx += tw + 10;
  }
  ctx.globalAlpha = 1;

  // Live link indicator — only for projects with a URL
  if (project.url) {
    const label = "Live →  " + project.url.replace("https://", "");
    ctx.font = `500 ${active ? 22 : 18}px 'SF Mono', 'Fira Code', monospace`;
    const lw = ctx.measureText(label).width + 32;
    const lx = PX;
    const ly = H - 70;
    ctx.globalAlpha = active ? 0.9 : 0.4;
    ctx.fillStyle = active ? `${project.accent}22` : `${project.accent}0a`;
    ctx.strokeStyle = active ? `${project.accent}80` : `${project.accent}30`;
    ctx.lineWidth = active ? 1.5 : 1;
    ctx.beginPath();
    ctx.roundRect(lx, ly, lw, active ? 36 : 30, 6);
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = active ? project.accent : `${project.accent}88`;
    ctx.fillText(label, lx + 16, ly + (active ? 25 : 21));
    ctx.globalAlpha = 1;
  }

  return new THREE.CanvasTexture(canvas);
}

function roundRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number,
) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + r);
  ctx.lineTo(x + w, y + h - r);
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  ctx.lineTo(x + r, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
}

function wrapText(
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  maxW: number,
  lineH: number,
) {
  const words = text.split(" ");
  let line = "";
  let cy = y;
  for (const word of words) {
    const test = line ? `${line} ${word}` : word;
    if (ctx.measureText(test).width > maxW && line) {
      ctx.fillText(line, x, cy);
      line = word;
      cy += lineH;
      if (cy > y + lineH * 7) {
        ctx.fillText(line + "…", x, cy);
        return;
      }
    } else {
      line = test;
    }
  }
  if (line) ctx.fillText(line, x, cy);
}

// ── Glitch+opacity shader ───────────────────────────────────────────────────────
const vertSrc = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const fragSrc = `
  uniform sampler2D uMap;
  uniform float uGlitch;
  uniform float uOpacity;
  varying vec2 vUv;

  float rand(vec2 co) {
    return fract(sin(dot(co, vec2(12.9898, 78.233))) * 43758.5453);
  }

  void main() {
    vec2 uv = vUv;
    float shift = rand(vec2(floor(uv.y * 18.0), floor(uv.x * 8.0))) * uGlitch * 0.035;
    float r  = texture2D(uMap, uv + vec2(shift,  0.0)).r;
    float g  = texture2D(uMap, uv               ).g;
    float b  = texture2D(uMap, uv - vec2(shift,  0.0)).b;
    float a  = texture2D(uMap, uv               ).a;
    gl_FragColor = vec4(r, g, b, a * uOpacity);
  }
`;

// ── Project card mesh ────────────────────────────────────────────────────────────
const SPREAD_X = 3.2;
const SPREAD_Z = 2.2; // deeper Z push for inactive cards
const CARD_W = 2.6;
const CARD_H = 3.12;

function ProjectCard({
  project,
  index,
  total,
  activeFloatRef,
}: {
  project: Project;
  index: number;
  total: number;
  activeFloatRef: MutableRefObject<number>;
}) {
  const meshRef = useRef<THREE.Mesh>(null);
  const matRef = useRef<THREE.ShaderMaterial>(null);
  const glitchRef = useRef(0);
  const prevActiveRef = useRef(false);
  const isActiveRef = useRef(false);

  // Build initial inactive texture on mount
  const initTex = useMemo(() => buildCardTexture(project, false), [project]);

  const uniforms = useMemo(
    () => ({
      uMap: { value: initTex },
      uGlitch: { value: 0 },
      uOpacity: { value: 0.3 },
    }),
    [initTex],
  );

  useFrame((_, delta) => {
    const mesh = meshRef.current;
    const mat = matRef.current;
    if (!mesh || !mat) return;

    const af = activeFloatRef.current;
    const d = index - af;
    const abs = Math.abs(d);
    const isActive = abs < 0.5;

    // Rebuild texture when active state flips
    if (isActive !== prevActiveRef.current) {
      mat.uniforms.uMap.value = buildCardTexture(project, isActive);
      glitchRef.current = isActive ? 1.0 : 0.6;
      prevActiveRef.current = isActive;
      isActiveRef.current = isActive;
    }

    // Lerp coefficient (frame-rate independent)
    const T = 1 - Math.pow(0.04, delta);

    // Target position
    const targetX = d * SPREAD_X;
    const targetZ = -abs * SPREAD_Z;
    const targetRotY = d * 0.22;
    // Center card 1.28 — falls off steeply so side cards are clearly smaller
    const targetScale = Math.max(0.48, 1.28 - abs * 0.44);
    const targetOpacity = Math.max(0.1, 1.0 - abs * 0.52);
    const breath = Math.sin(Date.now() * 0.0011 + index * 1.3) * 0.018;

    mesh.position.x += (targetX - mesh.position.x) * T;
    mesh.position.y += (breath - mesh.position.y) * T;
    mesh.position.z += (targetZ - mesh.position.z) * T;
    mesh.rotation.y += (targetRotY - mesh.rotation.y) * T;
    mesh.scale.x += (targetScale - mesh.scale.x) * T;
    mesh.scale.y += (targetScale - mesh.scale.y) * T;

    glitchRef.current *= 0.9;
    mat.uniforms.uGlitch.value = glitchRef.current;
    mat.uniforms.uOpacity.value +=
      (targetOpacity - mat.uniforms.uOpacity.value) * T;
  });

  const startX = (index - (total - 1) / 2) * SPREAD_X;

  return (
    <mesh
      ref={meshRef}
      position={[startX, 0, 0]}
      onClick={() => {
        if (project.url && isActiveRef.current) {
          window.open(project.url, "_blank", "noopener,noreferrer");
        }
      }}
      onPointerOver={() => {
        if (project.url && isActiveRef.current) {
          document.body.style.cursor = "pointer";
        }
      }}
      onPointerOut={() => {
        document.body.style.cursor = "auto";
      }}
    >
      <planeGeometry args={[CARD_W, CARD_H]} />
      <shaderMaterial
        ref={matRef}
        vertexShader={vertSrc}
        fragmentShader={fragSrc}
        uniforms={uniforms}
        transparent
        depthWrite={false}
        side={THREE.FrontSide}
      />
    </mesh>
  );
}

// ── Background crystal ───────────────────────────────────────────────────────────
function CrystalBg() {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((_, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += delta * 0.06;
      meshRef.current.rotation.x += delta * 0.04;
    }
  });

  return (
    <mesh ref={meshRef} position={[0, 0, -7]} scale={[3.2, 3.2, 3.2]}>
      <icosahedronGeometry args={[1, 1]} />
      <MeshDistortMaterial
        color="#0a0a18"
        distort={0.42}
        speed={1.0}
        roughness={0.75}
        metalness={0.25}
        opacity={0.5}
        transparent
      />
    </mesh>
  );
}

// ── Scene ─────────────────────────────────────────────────────────────────────────
function Scene({
  scrollProgress,
}: {
  scrollProgress: MutableRefObject<number>;
}) {
  const activeFloatRef = useRef(0);

  useFrame(() => {
    const target = scrollProgress.current * (projects.length - 1);
    activeFloatRef.current += (target - activeFloatRef.current) * 0.07;
  });

  return (
    <>
      <color attach="background" args={["#030308"]} />
      <fog attach="fog" args={["#030308", 12, 28]} />
      <ambientLight intensity={0.55} />
      <pointLight position={[3, 3, 4]} intensity={1.0} color="#f97316" />
      <pointLight position={[-3, -2, 2]} intensity={0.5} color="#3b82f6" />

      <Stars
        radius={55}
        depth={28}
        count={1200}
        factor={2.8}
        saturation={0}
        fade
        speed={0.35}
      />

      <CrystalBg />

      {projects.map((project, i) => (
        <ProjectCard
          key={project.name}
          project={project}
          index={i}
          total={projects.length}
          activeFloatRef={activeFloatRef}
        />
      ))}
    </>
  );
}

// ── Section wrapper ───────────────────────────────────────────────────────────────
export default function Projects() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const scrollProgress = useRef(0);
  const [activeIdx, setActiveIdx] = useState(0);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    let prev = -1;
    const update = () => {
      const rect = section.getBoundingClientRect();
      const scrolled = -rect.top; // px scrolled into section
      const total = section.offsetHeight - window.innerHeight;
      const p = total > 0 ? Math.max(0, Math.min(1, scrolled / total)) : 0;
      scrollProgress.current = p;
      const next = Math.min(
        projects.length - 1,
        Math.max(0, Math.floor(p * projects.length)),
      );
      if (next !== prev) {
        prev = next;
        setActiveIdx(next);
      }
    };

    update();
    window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, []);

  return (
    // Outer: matches ScrollyCanvas pattern exactly — div.relative, height 500vh
    <div
      id="projects"
      ref={sectionRef}
      className="relative"
      style={{ height: "500vh" }}
    >
      {/* Inner: sticky viewport — same Tailwind classes ScrollyCanvas uses */}
      <div className="sticky top-0 h-screen w-full overflow-hidden">
        {/* R3F canvas */}
        <Canvas
          style={{ position: "absolute", inset: 0 }}
          camera={{ position: [0, 0, 7], fov: 50 }}
          gl={{ antialias: true, alpha: false }}
          dpr={[1, 1.5]}
        >
          <Scene scrollProgress={scrollProgress} />
        </Canvas>

        {/* Section title */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            padding: "56px 80px 0",
            zIndex: 10,
            pointerEvents: "none",
          }}
        >
          <ScrambleText
            text="Projects"
            as="h2"
            className="text-[clamp(2.5rem,5vw,4rem)] font-bold text-white tracking-tight"
          />
        </div>

        {/* Counter */}
        <div
          style={{
            position: "absolute",
            bottom: 36,
            left: 0,
            right: 0,
            display: "flex",
            justifyContent: "center",
            zIndex: 10,
            pointerEvents: "none",
          }}
        >
          <span
            style={{
              fontSize: "13px",
              fontFamily: "monospace",
              letterSpacing: "0.15em",
              color: "#f97316",
            }}
          >
            {String(activeIdx + 1).padStart(2, "0")} /{" "}
            {String(projects.length).padStart(2, "0")}
          </span>
        </div>
      </div>
    </div>
  );
}
