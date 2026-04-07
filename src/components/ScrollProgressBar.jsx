// src/components/ScrollProgressBar.jsx
import { useState, useEffect } from "react";
import { motion, useSpring } from "framer-motion";

const ScrollProgressBar = () => {
  const [progress, setProgress] = useState(0);

  // useSpring pour un suivi fluide, pas saccadé
  const scaleX = useSpring(progress, {
    stiffness: 200,
    damping: 30,
    restDelta: 0.001,
  });

  useEffect(() => {
    const updateProgress = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(docHeight > 0 ? scrollTop / docHeight : 0);
    };

    window.addEventListener("scroll", updateProgress, { passive: true });
    return () => window.removeEventListener("scroll", updateProgress);
  }, []);

  return (
    <motion.div
      style={{
        scaleX,
        transformOrigin: "left",
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        height: "3px",
        background: "linear-gradient(90deg, #6366f1, #8b5cf6)",
        zIndex: 9999,
        borderRadius: "0 2px 2px 0",
      }}
    />
  );
};

export default ScrollProgressBar;