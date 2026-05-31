"use client";

import Link from "next/link";
import { motion } from "motion/react";
import Reveal from "./Reveal";

const bodyFont = { fontFamily: "var(--font-inter), system-ui, sans-serif" };
const displayFont = {
  fontFamily: "var(--font-display), var(--font-inter), system-ui, sans-serif",
};

const COLUMNS = [
  {
    title: "Product",
    links: [
      { label: "Chart", href: "/chart" },
      { label: "Features", href: "#features" },
      { label: "Pricing", href: "#" },
      { label: "Changelog", href: "#" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About", href: "#" },
      { label: "Blog", href: "#" },
      { label: "Careers", href: "#" },
      { label: "Contact", href: "#" },
    ],
  },
  {
    title: "Legal",
    links: [
      { label: "Privacy", href: "#" },
      { label: "Terms", href: "#" },
      { label: "Disclaimer", href: "#" },
    ],
  },
];

export default function LandingFooter() {
  return (
    <footer
      id="contact"
      className="relative w-full bg-[#050b1f] text-white border-t border-white/10 scroll-mt-20"
      style={bodyFont}
    >
      {/* Big CTA strip */}
      <div className="px-6 sm:px-10 py-20 border-b border-white/10">
        <Reveal className="max-w-3xl mx-auto text-center">
          <h2
            className="font-bold tracking-[-0.02em] leading-[1.05] text-4xl sm:text-5xl"
            style={displayFont}
          >
            Ready to test your edge?
          </h2>
          <p className="mt-5 text-lg text-white/60 font-light">
            Open the chart and start your first replay — no signup needed.
          </p>
          <motion.div
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className="mt-8 inline-block"
          >
            <Link
              href="/chart"
              className="inline-flex items-center gap-2 bg-sky-300 hover:bg-sky-200 text-[#050b1f] text-base font-medium px-7 py-3.5 rounded-full shadow-[0_0_0_0_rgba(125,211,252,0)] hover:shadow-[0_0_30px_4px_rgba(125,211,252,0.45)] transition-shadow"
            >
              Open Chart
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="5" y1="12" x2="19" y2="12" />
                <polyline points="12 5 19 12 12 19" />
              </svg>
            </Link>
          </motion.div>
        </Reveal>
      </div>

      {/* Link columns */}
      <div className="px-6 sm:px-10 py-16 max-w-7xl mx-auto grid grid-cols-2 sm:grid-cols-4 gap-12">
        <div>
          <Link href="/" className="flex items-center gap-2.5 mb-4">
            <div className="w-8 h-8 rounded-md bg-white/95 flex items-center justify-center">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#050b1f" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="3 17 9 11 13 15 21 7" />
                <polyline points="14 7 21 7 21 14" />
              </svg>
            </div>
            <span
              className="text-lg font-semibold tracking-tight"
              style={displayFont}
            >
              Trade Replay
            </span>
          </Link>
          <p className="text-sm text-white/50 leading-relaxed max-w-56">
            A back-testing sandbox for traders who practice their edge.
          </p>
        </div>

        {COLUMNS.map((col) => (
          <div key={col.title}>
            <div
              className="text-xs uppercase tracking-[0.18em] text-white/45 mb-4"
              style={displayFont}
            >
              {col.title}
            </div>
            <ul className="space-y-2.5">
              {col.links.map((l) => (
                <li key={l.label}>
                  <Link
                    href={l.href}
                    className="text-sm text-white/70 hover:text-white transition-colors"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* Bottom strip */}
      <div className="border-t border-white/10 px-6 sm:px-10 py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <span className="text-xs text-white/40">
          © {new Date().getFullYear()} Trade Replay. Practice, not real trades.
        </span>
        <div className="flex items-center gap-3">
          <SocialIcon
            label="GitHub"
            path={
              <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 00-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0020 4.77 5.07 5.07 0 0019.91 1S18.73.65 16 2.48a13.38 13.38 0 00-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 005 4.77a5.44 5.44 0 00-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 009 18.13V22" />
            }
          />
          <SocialIcon
            label="Twitter"
            path={
              <path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z" />
            }
          />
          <SocialIcon
            label="Discord"
            path={
              <>
                <circle cx="9" cy="12" r="1" />
                <circle cx="15" cy="12" r="1" />
                <path d="M7.5 7.5C9 7 11 6.7 12 6.7s3 .3 4.5.8c2 .6 3.5 1.5 3.5 1.5l-1 9-3 1-1.5-2-2 1-2 0-2-1-1.5 2-3-1-1-9s1.5-.9 3.5-1.5z" />
              </>
            }
          />
        </div>
      </div>
    </footer>
  );
}

function SocialIcon({ label, path }: { label: string; path: React.ReactNode }) {
  return (
    <Link
      href="#"
      aria-label={label}
      className="w-9 h-9 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/60 hover:text-white hover:border-sky-300/40 hover:bg-white/10 transition-colors"
    >
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        {path}
      </svg>
    </Link>
  );
}
