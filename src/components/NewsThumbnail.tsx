import logo from "@/assets/logo.jpg";

interface NewsThumbnailProps {
  title: string;
  category: string;
  className?: string;
}

// Per-category accent colours (bg gradient stops + text)
const categoryThemes: Record<string, { from: string; to: string; accent: string; label: string }> = {
  "Инициатива":    { from: "#1a3a5c", to: "#1e5fa8", accent: "#60a5fa", label: "ИНИЦИАТИВА" },
  "Новина":        { from: "#1e3a5f", to: "#1d4ed8", accent: "#93c5fd", label: "НОВИНА" },
  "Събитие":       { from: "#78350f", to: "#d97706", accent: "#fcd34d", label: "СЪБИТИЕ" },
  "Проект":        { from: "#14532d", to: "#16a34a", accent: "#86efac", label: "ПРОЕКТ" },
  "Ретроспекция":  { from: "#1e3a5f", to: "#334155", accent: "#cbd5e1", label: "РЕТРОСПЕКЦИЯ" },
  "Застъпничество":{ from: "#4c1d95", to: "#7c3aed", accent: "#c4b5fd", label: "ЗАСТЪПНИЧЕСТВО" },
};

const defaultTheme = { from: "#1a3a5c", to: "#1e5fa8", accent: "#60a5fa", label: "" };

// Deterministic "random" pattern seed from title string
const seed = (str: string) =>
  str.split("").reduce((acc, c) => acc + c.charCodeAt(0), 0);

export default function NewsThumbnail({ title, category, className = "" }: NewsThumbnailProps) {
  const theme = categoryThemes[category] ?? defaultTheme;
  const s = seed(title);

  // Generate 6 decorative circles with deterministic positions
  const circles = Array.from({ length: 6 }, (_, i) => ({
    cx: 20 + ((s * (i + 3) * 37) % 360),
    cy: 10 + ((s * (i + 7) * 19) % 160),
    r:  25 + ((s * (i + 2) * 13) % 55),
    op: 0.04 + (i * 0.025),
  }));

  // 3 diagonal lines
  const lines = Array.from({ length: 3 }, (_, i) => ({
    x1: (s * (i + 5) * 41) % 400,
    y1: 0,
    x2: ((s * (i + 5) * 41) % 400) + 120,
    y2: 180,
  }));

  return (
    <div className={`relative overflow-hidden ${className}`}>
      {/* SVG background */}
      <svg
        viewBox="0 0 400 180"
        xmlns="http://www.w3.org/2000/svg"
        className="absolute inset-0 h-full w-full"
        preserveAspectRatio="xMidYMid slice"
      >
        <defs>
          <linearGradient id={`grad-${s}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={theme.from} />
            <stop offset="100%" stopColor={theme.to} />
          </linearGradient>
        </defs>

        {/* Base gradient */}
        <rect width="400" height="180" fill={`url(#grad-${s})`} />

        {/* Decorative circles */}
        {circles.map((c, i) => (
          <circle key={i} cx={c.cx} cy={c.cy} r={c.r}
            fill="white" fillOpacity={c.op} />
        ))}

        {/* Diagonal lines */}
        {lines.map((l, i) => (
          <line key={i} x1={l.x1} y1={l.y1} x2={l.x2} y2={l.y2}
            stroke="white" strokeOpacity="0.06" strokeWidth="1.5" />
        ))}

        {/* Bottom accent bar */}
        <rect x="0" y="155" width="400" height="25"
          fill="black" fillOpacity="0.25" />

        {/* Category label in accent colour */}
        <text x="16" y="172" fontFamily="system-ui, sans-serif"
          fontSize="10" fontWeight="700" letterSpacing="2"
          fill={theme.accent} fillOpacity="0.95">
          {theme.label || category.toUpperCase()}
        </text>

        {/* Subtle grid dots */}
        {Array.from({ length: 5 }, (_, row) =>
          Array.from({ length: 9 }, (_, col) => (
            <circle key={`${row}-${col}`}
              cx={30 + col * 42} cy={20 + row * 35}
              r="1.2" fill="white" fillOpacity="0.07" />
          ))
        )}
      </svg>

      {/* Logo centred */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="flex flex-col items-center gap-2">
          <div className="rounded-full bg-white/15 p-2 backdrop-blur-sm ring-2 ring-white/20">
            <img
              src={logo}
              alt="УН към 163 ОУ"
              className="h-14 w-14 rounded-full object-cover opacity-90"
            />
          </div>
          <span className="text-xs font-semibold text-white/70 tracking-wide">
            163 ОУ „Черноризец Храбър"
          </span>
        </div>
      </div>
    </div>
  );
}
