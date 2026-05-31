"use client";

import { motion, type Variants } from "motion/react";
import type { ReactNode } from "react";

interface RevealProps {
  children: ReactNode;
  delay?: number;
  y?: number;
  className?: string;
  once?: boolean;
}

const variants: Variants = {
  hidden: { opacity: 0, y: 24 },
  show: (custom: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay: custom, ease: [0.16, 1, 0.3, 1] },
  }),
};

export default function Reveal({
  children,
  delay = 0,
  y = 24,
  className,
  once = true,
}: RevealProps) {
  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="show"
      viewport={{ once, margin: "-80px" }}
      custom={delay}
      variants={{
        hidden: { opacity: 0, y },
        show: variants.show,
      }}
    >
      {children}
    </motion.div>
  );
}
