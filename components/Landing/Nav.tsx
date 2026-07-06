import Link from "next/link";

const NAV_ITEMS: { label: string; href: string }[] = [
  { label: "Product", href: "#product" },
  { label: "Features", href: "#features" },
  { label: "Pricing", href: "#how-it-works" },
  { label: "About", href: "#about" },
  { label: "Contact", href: "#contact" },
];

const displayFont = {
  fontFamily: "var(--font-display), var(--font-inter), system-ui, sans-serif",
};

export default function LandingNav() {
  return (
    <header className="relative z-10 flex items-center justify-between px-6 sm:px-10 py-6">
      <Link href="/" className="group flex items-center gap-3 outline-none">
        <div className="w-10 h-10 rounded-md bg-white/95 flex items-center justify-center transition-transform duration-300 group-hover:scale-110 group-hover:-rotate-6">
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#050b1f"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="3 17 9 11 13 15 21 7" />
            <polyline points="14 7 21 7 21 14" />
          </svg>
        </div>
        <span
          className="text-xl sm:text-2xl font-semibold tracking-tight text-white transition-colors group-hover:text-sky-200"
          style={displayFont}
        >
          Trade Replay
        </span>
      </Link>

      <nav className="hidden md:flex items-center gap-1 rounded-full bg-white/5 border border-white/10 backdrop-blur px-2 py-1.5">
        {NAV_ITEMS.map((item) => (
          <a
            key={item.label}
            href={item.href}
            className="relative px-5 py-2 text-[15px] text-white/70 hover:text-white rounded-full transition-colors duration-200 after:absolute after:left-1/2 after:-translate-x-1/2 after:bottom-1 after:h-px after:w-0 after:bg-sky-300 after:transition-all after:duration-300 hover:after:w-6"
          >
            {item.label}
          </a>
        ))}
      </nav>

      <Link
        href="/login"
        className="group hidden sm:flex items-center gap-2 bg-white text-[#050b1f] text-[15px] font-medium px-5 py-2.5 rounded-full hover:bg-white shadow-[0_0_0_0_rgba(125,211,252,0)] hover:shadow-[0_0_20px_2px_rgba(125,211,252,0.35)] transition-shadow duration-300 active:scale-[0.97]"
      >
        Login / Sign in
        <svg
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="transition-transform duration-300 group-hover:translate-x-0.5"
        >
          <line x1="5" y1="12" x2="19" y2="12" />
          <polyline points="12 5 19 12 12 19" />
        </svg>
      </Link>
    </header>
  );
}
