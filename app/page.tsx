"use client";

import { useState, useCallback } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Loader from "@/components/Loader";
import Navbar from "@/components/Navbar";
import ScrollyCanvas from "@/components/ScrollyCanvas";
import Overlay from "@/components/Overlay";
import ScrollIndicator from "@/components/ScrollIndicator";
import Cursor from "@/components/Cursor";
import dynamic from "next/dynamic";
import About from "@/components/sections/About";
import Experience from "@/components/sections/Experience";
import Footer from "@/components/Footer";

const Projects = dynamic(() => import("@/components/sections/Projects"), {
  ssr: false,
  loading: () => (
    <div
      style={{ height: "500vh", background: "#030308" }}
      id="projects"
    />
  ),
});

export default function Home() {
  const [loaded, setLoaded] = useState(false);
  const handleLoadComplete = useCallback(() => setLoaded(true), []);

  return (
    <>
      <Cursor />
      <Loader onComplete={handleLoadComplete} />

      <AnimatePresence>
        {loaded && (
          <motion.div
            key="site"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          >
            <Navbar visible={loaded} />

            {/* 500vh scrolly hero with canvas + overlays */}
            <ScrollyCanvas>
              <ScrollIndicator />
              <Overlay />
            </ScrollyCanvas>

            <main>
              <About />
              <Experience />
            </main>

            <Projects />

            <Footer />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
