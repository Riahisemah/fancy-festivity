export type ThemeKey = "wedding" | "birthday" | "business" | "minimal" | "graduation" | "luxury" | "tunisian";

export type ThemeConfig = {
  label: string;
  emoji: string;
  description: string;
  pageBg: string;
  pageText: string;
  surface: string;
  border: string;
  accent: string;
  accentBg: string;
  font: string;
  headingFont: string;
  overlay?: string;
  decor: "petals" | "balloons" | "grid" | "stars" | "particles" | "arabesque" | "none";
  ctaClass: string;
};

export type SubthemeConfig = {
  key: string;
  label: string;
  emoji: string;
  tagline: string;
  swatches: string[]; // for preview chips
  overrides: Partial<ThemeConfig>;
};

export const THEMES: Record<ThemeKey, ThemeConfig> = {
  wedding: {
    label: "Mariage",
    emoji: "💍",
    description: "Luxe romantique",
    pageBg: "bg-[#faf5ee]",
    pageText: "text-[#2a1f17]",
    surface: "bg-white/60 backdrop-blur-xl",
    border: "border-[#c9a86a]/30",
    accent: "text-[#a8884a]",
    accentBg: "bg-[#a8884a]",
    font: "font-serif",
    headingFont: "font-serif italic",
    overlay:
      "radial-gradient(60% 40% at 20% 10%, rgba(201,168,106,0.25), transparent 60%), radial-gradient(50% 40% at 80% 90%, rgba(255,200,200,0.25), transparent 60%)",
    decor: "petals",
    ctaClass:
      "bg-gradient-to-r from-[#a8884a] to-[#d4b574] text-white shadow-lg shadow-[#a8884a]/30 hover:shadow-xl hover:shadow-[#a8884a]/40",
  },
  birthday: {
    label: "Anniversaire",
    emoji: "🎂",
    description: "Fun et festif",
    pageBg: "bg-gradient-to-br from-[#ff6ec7] via-[#a855f7] to-[#3b82f6]",
    pageText: "text-white",
    surface: "bg-white/15 backdrop-blur-xl",
    border: "border-white/30",
    accent: "text-yellow-200",
    accentBg: "bg-yellow-300",
    font: "font-sans",
    headingFont: "font-sans font-bold",
    decor: "balloons",
    ctaClass:
      "bg-white text-[#a855f7] shadow-xl shadow-purple-900/30 hover:scale-105",
  },
  business: {
    label: "Business",
    emoji: "💼",
    description: "Corporate premium",
    pageBg: "bg-[#0a0f1c]",
    pageText: "text-slate-100",
    surface: "bg-white/[0.04] backdrop-blur-xl",
    border: "border-white/10",
    accent: "text-blue-400",
    accentBg: "bg-blue-500",
    font: "font-sans",
    headingFont: "font-sans font-semibold tracking-tight",
    overlay:
      "radial-gradient(50% 50% at 50% 0%, rgba(59,130,246,0.15), transparent 60%)",
    decor: "grid",
    ctaClass: "bg-blue-500 text-white hover:bg-blue-400 shadow-lg shadow-blue-500/30",
  },
  minimal: {
    label: "Minimal",
    emoji: "✨",
    description: "Espace blanc, pur",
    pageBg: "bg-white",
    pageText: "text-neutral-900",
    surface: "bg-neutral-50",
    border: "border-neutral-200",
    accent: "text-neutral-500",
    accentBg: "bg-neutral-900",
    font: "font-sans",
    headingFont: "font-serif",
    decor: "none",
    ctaClass: "bg-neutral-900 text-white hover:bg-neutral-700",
  },
  graduation: {
    label: "Graduation",
    emoji: "🎓",
    description: "Académique inspirant",
    pageBg: "bg-gradient-to-br from-[#1e1b3a] via-[#2d1b4e] to-[#0f1830]",
    pageText: "text-amber-50",
    surface: "bg-white/[0.06] backdrop-blur-xl",
    border: "border-amber-300/20",
    accent: "text-amber-300",
    accentBg: "bg-amber-400",
    font: "font-serif",
    headingFont: "font-serif",
    overlay: "radial-gradient(40% 60% at 50% 0%, rgba(251,191,36,0.18), transparent 70%)",
    decor: "stars",
    ctaClass:
      "bg-gradient-to-r from-amber-400 to-amber-200 text-[#1e1b3a] font-semibold shadow-lg shadow-amber-500/30",
  },
  luxury: {
    label: "Luxury VIP",
    emoji: "🌙",
    description: "Ultra premium",
    pageBg: "bg-black",
    pageText: "text-[#f5e9c8]",
    surface: "bg-white/[0.04] backdrop-blur-2xl",
    border: "border-[#d4af37]/25",
    accent: "text-[#d4af37]",
    accentBg: "bg-[#d4af37]",
    font: "font-serif",
    headingFont: "font-serif tracking-tight",
    overlay:
      "radial-gradient(60% 50% at 50% 0%, rgba(212,175,55,0.15), transparent 70%), radial-gradient(40% 40% at 50% 100%, rgba(212,175,55,0.08), transparent 70%)",
    decor: "particles",
    ctaClass:
      "bg-gradient-to-r from-[#d4af37] via-[#f4d77a] to-[#d4af37] text-black font-medium shadow-2xl shadow-[#d4af37]/30 hover:shadow-[#d4af37]/50",
  },
  tunisian: {
    label: "Tunisian Wedding",
    emoji: "🇹🇳",
    description: "Élégance tunisienne, motifs & or",
    pageBg: "bg-[#f8f2e6]",
    pageText: "text-[#2a1f14]",
    surface: "bg-white/70 backdrop-blur-xl",
    border: "border-[#a8884a]/30",
    accent: "text-[#a8884a]",
    accentBg: "bg-[#a8884a]",
    font: "font-serif",
    headingFont: "font-serif italic",
    overlay:
      "radial-gradient(60% 40% at 20% 10%, rgba(168,136,74,0.18), transparent 60%), radial-gradient(50% 40% at 80% 90%, rgba(168,136,74,0.14), transparent 60%)",
    decor: "arabesque",
    ctaClass:
      "bg-gradient-to-r from-[#a8884a] via-[#d4b574] to-[#a8884a] text-white shadow-xl shadow-[#a8884a]/30 hover:shadow-2xl",
  },
};

export const SUBTHEMES: Record<ThemeKey, SubthemeConfig[]> = {
  wedding: [
    {
      key: "luxury-gold",
      label: "Luxury Gold",
      emoji: "💎",
      tagline: "Or, blanc & floral royal",
      swatches: ["#faf5ee", "#d4b574", "#a8884a", "#fff"],
      overrides: {},
    },
    {
      key: "romantic-garden",
      label: "Romantic Garden",
      emoji: "🌸",
      tagline: "Pétales, douceur, nature",
      swatches: ["#fdf2f6", "#f4c2c2", "#9ca77a", "#fff"],
      overrides: {
        pageBg: "bg-[#fdf2f6]",
        pageText: "text-[#3a2a30]",
        accent: "text-[#c97b8a]",
        accentBg: "bg-[#c97b8a]",
        border: "border-[#c97b8a]/30",
        overlay:
          "radial-gradient(60% 40% at 20% 10%, rgba(244,194,194,0.45), transparent 60%), radial-gradient(50% 40% at 80% 90%, rgba(156,167,122,0.25), transparent 60%)",
        ctaClass:
          "bg-gradient-to-r from-[#c97b8a] to-[#e8a7b3] text-white shadow-lg shadow-pink-400/30",
      },
    },
    {
      key: "dark-elegant",
      label: "Dark Elegant",
      emoji: "🕯️",
      tagline: "Noir, doré, candle light",
      swatches: ["#0e0a08", "#d4af37", "#3a2c1f", "#f5e9c8"],
      overrides: {
        pageBg: "bg-[#0e0a08]",
        pageText: "text-[#f5e9c8]",
        surface: "bg-white/[0.05] backdrop-blur-xl",
        border: "border-[#d4af37]/25",
        accent: "text-[#d4af37]",
        accentBg: "bg-[#d4af37]",
        overlay:
          "radial-gradient(50% 40% at 50% 0%, rgba(212,175,55,0.2), transparent 70%), radial-gradient(40% 60% at 50% 100%, rgba(255,140,80,0.08), transparent 70%)",
        decor: "particles",
        ctaClass:
          "bg-gradient-to-r from-[#d4af37] to-[#f4d77a] text-black font-medium shadow-xl shadow-[#d4af37]/30",
      },
    },
    {
      key: "beach",
      label: "Beach Wedding",
      emoji: "🏝️",
      tagline: "Sable, océan, ambiance été",
      swatches: ["#eaf4f7", "#5aa8c2", "#e8d8a8", "#fff"],
      overrides: {
        pageBg: "bg-gradient-to-b from-[#eaf4f7] via-[#f7eed8] to-[#fff8e7]",
        pageText: "text-[#1d3a48]",
        accent: "text-[#3d8aa3]",
        accentBg: "bg-[#3d8aa3]",
        border: "border-[#3d8aa3]/25",
        font: "font-sans",
        headingFont: "font-serif",
        overlay:
          "radial-gradient(60% 50% at 50% 10%, rgba(90,168,194,0.18), transparent 70%)",
        decor: "particles",
        ctaClass:
          "bg-gradient-to-r from-[#3d8aa3] to-[#7bbcd1] text-white shadow-lg shadow-sky-500/30",
      },
    },
  ],
  birthday: [
    {
      key: "party-neon",
      label: "Party Neon",
      emoji: "🎉",
      tagline: "Glow vif, confetti intense",
      swatches: ["#0a0014", "#ff2bd6", "#00f0ff", "#fffb00"],
      overrides: {
        pageBg: "bg-[#0a0014]",
        pageText: "text-white",
        accent: "text-[#ff2bd6]",
        accentBg: "bg-[#ff2bd6]",
        border: "border-[#ff2bd6]/30",
        overlay:
          "radial-gradient(40% 30% at 20% 10%, rgba(255,43,214,0.35), transparent 60%), radial-gradient(40% 30% at 80% 80%, rgba(0,240,255,0.25), transparent 60%)",
        decor: "particles",
        ctaClass:
          "bg-gradient-to-r from-[#ff2bd6] via-[#a855f7] to-[#00f0ff] text-white shadow-2xl shadow-fuchsia-500/50",
      },
    },
    {
      key: "cute-pastel",
      label: "Cute Pastel",
      emoji: "🎈",
      tagline: "Rose pastel, kawaii",
      swatches: ["#fff0f7", "#ffc8dd", "#bde0fe", "#a2d2ff"],
      overrides: {
        pageBg: "bg-gradient-to-br from-[#fff0f7] via-[#ffe5ec] to-[#e7f0ff]",
        pageText: "text-[#5b3d4d]",
        accent: "text-[#e879a8]",
        accentBg: "bg-[#ffb3c6]",
        border: "border-[#ffb3c6]/40",
        decor: "balloons",
        ctaClass: "bg-[#ffb3c6] text-[#5b3d4d] shadow-lg shadow-pink-300/40",
      },
    },
    {
      key: "luxury-birthday",
      label: "Luxury Birthday",
      emoji: "🖤",
      tagline: "Noir & or, très premium",
      swatches: ["#000", "#d4af37", "#1a1a1a", "#f5e9c8"],
      overrides: {
        pageBg: "bg-black",
        pageText: "text-[#f5e9c8]",
        accent: "text-[#d4af37]",
        accentBg: "bg-[#d4af37]",
        border: "border-[#d4af37]/25",
        font: "font-serif",
        headingFont: "font-serif tracking-tight",
        decor: "particles",
        overlay:
          "radial-gradient(60% 50% at 50% 0%, rgba(212,175,55,0.18), transparent 70%)",
        ctaClass:
          "bg-gradient-to-r from-[#d4af37] to-[#f4d77a] text-black shadow-2xl shadow-[#d4af37]/40",
      },
    },
    {
      key: "fun-retro",
      label: "Fun Retro",
      emoji: "🕹️",
      tagline: "Arcade, pixel vibes",
      swatches: ["#1a103d", "#ff6b9d", "#feca57", "#48dbfb"],
      overrides: {
        pageBg: "bg-gradient-to-br from-[#1a103d] via-[#3d1a5b] to-[#0d1b3d]",
        pageText: "text-[#feca57]",
        accent: "text-[#ff6b9d]",
        accentBg: "bg-[#ff6b9d]",
        border: "border-[#feca57]/30",
        font: "font-mono",
        headingFont: "font-mono font-bold uppercase tracking-wider",
        decor: "grid",
        overlay:
          "radial-gradient(40% 40% at 30% 20%, rgba(255,107,157,0.25), transparent 60%), radial-gradient(40% 40% at 70% 80%, rgba(72,219,251,0.2), transparent 60%)",
        ctaClass:
          "bg-[#feca57] text-[#1a103d] font-bold uppercase tracking-wider shadow-lg shadow-yellow-400/40",
      },
    },
  ],
  minimal: [
    {
      key: "pure-white",
      label: "Pure White",
      emoji: "✨",
      tagline: "Espace blanc, typographie pure",
      swatches: ["#fff", "#0a0a0a", "#737373", "#e5e5e5"],
      overrides: {},
    },
    {
      key: "soft-cream",
      label: "Soft Cream",
      emoji: "🤎",
      tagline: "Ivoire chaleureux, encre",
      swatches: ["#f8f4ec", "#2a1f17", "#a8884a", "#e8dfcc"],
      overrides: {
        pageBg: "bg-[#f8f4ec]",
        pageText: "text-[#2a1f17]",
        surface: "bg-white/70",
        border: "border-[#2a1f17]/15",
        accent: "text-[#a8884a]",
        accentBg: "bg-[#2a1f17]",
      },
    },
    {
      key: "mono-dark",
      label: "Mono Dark",
      emoji: "◼️",
      tagline: "Noir mat, contraste pur",
      swatches: ["#0a0a0a", "#fff", "#737373", "#262626"],
      overrides: {
        pageBg: "bg-[#0a0a0a]",
        pageText: "text-neutral-100",
        surface: "bg-white/[0.04]",
        border: "border-white/10",
        accent: "text-neutral-400",
        accentBg: "bg-white",
        ctaClass: "bg-white text-black hover:bg-neutral-200",
      },
    },
  ],

  business: [
    {
      key: "startup-modern",
      label: "Startup Modern",
      emoji: "📊",
      tagline: "SaaS minimal, bleu tech",
      swatches: ["#0a0f1c", "#3b82f6", "#1e293b", "#fff"],
      overrides: {},
    },
    {
      key: "executive",
      label: "Executive Corporate",
      emoji: "🏢",
      tagline: "Sobre, blanc & bleu nuit",
      swatches: ["#f5f6f8", "#1e2a4a", "#94a3b8", "#fff"],
      overrides: {
        pageBg: "bg-[#f5f6f8]",
        pageText: "text-[#1e2a4a]",
        surface: "bg-white",
        border: "border-[#1e2a4a]/15",
        accent: "text-[#1e2a4a]",
        accentBg: "bg-[#1e2a4a]",
        overlay: undefined,
        decor: "none",
        ctaClass: "bg-[#1e2a4a] text-white hover:bg-[#2a3a60]",
      },
    },
    {
      key: "tech-futuristic",
      label: "Tech Futuristic",
      emoji: "🚀",
      tagline: "Gradients glow, UI futuriste",
      swatches: ["#020617", "#06b6d4", "#a855f7", "#22d3ee"],
      overrides: {
        pageBg: "bg-[#020617]",
        pageText: "text-cyan-100",
        accent: "text-cyan-300",
        accentBg: "bg-cyan-400",
        border: "border-cyan-400/25",
        overlay:
          "radial-gradient(40% 40% at 20% 10%, rgba(6,182,212,0.25), transparent 60%), radial-gradient(40% 40% at 80% 90%, rgba(168,85,247,0.25), transparent 60%)",
        decor: "grid",
        ctaClass:
          "bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500 text-white shadow-2xl shadow-cyan-500/40",
      },
    },
  ],
  graduation: [
    {
      key: "classic-academic",
      label: "Classic Academic",
      emoji: "🎓",
      tagline: "Sobre, marine & bordeaux",
      swatches: ["#f8f5ef", "#1e2a4a", "#8b1f2f", "#d4b574"],
      overrides: {
        pageBg: "bg-[#f8f5ef]",
        pageText: "text-[#1e2a4a]",
        surface: "bg-white/70 backdrop-blur",
        border: "border-[#8b1f2f]/25",
        accent: "text-[#8b1f2f]",
        accentBg: "bg-[#8b1f2f]",
        decor: "none",
        overlay: undefined,
        ctaClass: "bg-[#8b1f2f] text-white hover:bg-[#a83548]",
      },
    },
    {
      key: "inspirational-glow",
      label: "Inspirational Glow",
      emoji: "✨",
      tagline: "Étoiles, lumière dorée",
      swatches: ["#1e1b3a", "#fbbf24", "#fde68a", "#2d1b4e"],
      overrides: {},
    },
    {
      key: "night-ceremony",
      label: "Night Ceremony",
      emoji: "🌌",
      tagline: "Cérémonie nocturne élégante",
      swatches: ["#050816", "#6366f1", "#c4b5fd", "#fbbf24"],
      overrides: {
        pageBg: "bg-gradient-to-br from-[#050816] via-[#0f1233] to-[#1a0f3d]",
        pageText: "text-indigo-100",
        accent: "text-indigo-300",
        accentBg: "bg-indigo-400",
        border: "border-indigo-400/25",
        overlay:
          "radial-gradient(50% 50% at 50% 0%, rgba(99,102,241,0.2), transparent 70%)",
        ctaClass:
          "bg-gradient-to-r from-indigo-500 to-violet-500 text-white shadow-xl shadow-indigo-500/40",
      },
    },
  ],
  luxury: [
    {
      key: "black-gold",
      label: "Black & Gold",
      emoji: "🌟",
      tagline: "Ultra premium noir & or",
      swatches: ["#000", "#d4af37", "#1a1a1a", "#f5e9c8"],
      overrides: {},
    },
    {
      key: "glass-nightclub",
      label: "Glass Night Club",
      emoji: "🥂",
      tagline: "Glassmorphism, ambiance club",
      swatches: ["#0d0820", "#ec4899", "#8b5cf6", "#f0abfc"],
      overrides: {
        pageBg: "bg-gradient-to-br from-[#0d0820] via-[#1f0a3d] to-[#0a0a1f]",
        pageText: "text-pink-100",
        surface: "bg-white/[0.06] backdrop-blur-3xl",
        accent: "text-pink-300",
        accentBg: "bg-pink-400",
        border: "border-pink-400/25",
        overlay:
          "radial-gradient(40% 40% at 20% 10%, rgba(236,72,153,0.3), transparent 60%), radial-gradient(40% 40% at 80% 90%, rgba(139,92,246,0.3), transparent 60%)",
        decor: "particles",
        ctaClass:
          "bg-gradient-to-r from-pink-500 via-fuchsia-500 to-violet-500 text-white shadow-2xl shadow-pink-500/40",
      },
    },
    {
      key: "minimal-white",
      label: "Minimal Luxury White",
      emoji: "🤍",
      tagline: "Espace blanc, luxe discret",
      swatches: ["#fafaf7", "#1a1a1a", "#d4af37", "#e8e3d8"],
      overrides: {
        pageBg: "bg-[#fafaf7]",
        pageText: "text-[#1a1a1a]",
        surface: "bg-white",
        border: "border-[#d4af37]/30",
        accent: "text-[#a8884a]",
        accentBg: "bg-[#1a1a1a]",
        overlay: undefined,
        decor: "none",
        font: "font-serif",
        headingFont: "font-serif tracking-tight",
        ctaClass: "bg-[#1a1a1a] text-white hover:bg-[#333]",
      },
    },
  ],
  tunisian: [
    {
      key: "tunisian-classic",
      label: "Tunisian Classic",
      emoji: "🕌",
      tagline: "Ivoire & or, encre profonde",
      swatches: ["#f8f2e6", "#a8884a", "#2a1f14", "#fff"],
      overrides: {},
    },
    {
      key: "tunisian-luxury-gold",
      label: "Tunisian Luxury Gold",
      emoji: "👑",
      tagline: "Doré somptueux, damas royal",
      swatches: ["#0f0a04", "#d4af37", "#8a1e1e", "#f5e9c8"],
      overrides: {
        pageBg: "bg-[#0f0a04]",
        pageText: "text-[#f5e9c8]",
        surface: "bg-white/[0.05] backdrop-blur-xl",
        border: "border-[#d4af37]/30",
        accent: "text-[#d4af37]",
        accentBg: "bg-[#d4af37]",
        overlay:
          "radial-gradient(60% 40% at 50% 0%, rgba(212,175,55,0.25), transparent 70%), radial-gradient(50% 40% at 50% 100%, rgba(138,30,30,0.15), transparent 70%)",
        decor: "particles",
        ctaClass:
          "bg-gradient-to-r from-[#d4af37] via-[#f4d77a] to-[#d4af37] text-black font-medium shadow-2xl shadow-[#d4af37]/40",
      },
    },
    {
      key: "tunisian-floral",
      label: "Tunisian Floral",
      emoji: "🌹",
      tagline: "Bouquets, pastel & doré",
      swatches: ["#fdf5f0", "#c47a7a", "#a8884a", "#e8c8b0"],
      overrides: {
        pageBg: "bg-gradient-to-br from-[#fdf5f0] via-[#f9ecec] to-[#faf1e2]",
        pageText: "text-[#3a221f]",
        accent: "text-[#a8884a]",
        accentBg: "bg-[#c47a7a]",
        border: "border-[#c47a7a]/30",
        overlay:
          "radial-gradient(50% 40% at 15% 10%, rgba(196,122,122,0.28), transparent 60%), radial-gradient(40% 40% at 85% 90%, rgba(168,136,74,0.22), transparent 60%)",
        decor: "petals",
        ctaClass:
          "bg-gradient-to-r from-[#c47a7a] to-[#e0a8a8] text-white shadow-lg shadow-rose-400/30",
      },
    },
    {
      key: "tunisian-minimal",
      label: "Tunisian Minimal",
      emoji: "🤍",
      tagline: "Crème pur, filet doré",
      swatches: ["#fbf7f0", "#e8dfcc", "#a8884a", "#2a1f14"],
      overrides: {
        pageBg: "bg-[#fbf7f0]",
        pageText: "text-[#2a1f14]",
        surface: "bg-white",
        border: "border-[#a8884a]/25",
        accent: "text-[#a8884a]",
        accentBg: "bg-[#2a1f14]",
        overlay: undefined,
        decor: "none",
        ctaClass: "bg-[#2a1f14] text-[#f8f2e6] hover:bg-[#3a2f22]",
      },
    },
    {
      key: "tunisian-royal",
      label: "Tunisian Royal",
      emoji: "♛",
      tagline: "Bordeaux, or & motifs damas",
      swatches: ["#f6ecdc", "#8a1e1e", "#d4af37", "#fff"],
      overrides: {
        pageBg: "bg-gradient-to-b from-[#f8f0e0] via-[#f4e7cd] to-[#efdcb0]",
        pageText: "text-[#2a1f14]",
        surface: "bg-white/80 backdrop-blur",
        border: "border-[#8a1e1e]/30",
        accent: "text-[#8a1e1e]",
        accentBg: "bg-[#8a1e1e]",
        overlay:
          "radial-gradient(50% 30% at 50% 0%, rgba(138,30,30,0.15), transparent 60%), radial-gradient(50% 30% at 50% 100%, rgba(212,175,55,0.25), transparent 60%)",
        decor: "arabesque",
        ctaClass:
          "bg-gradient-to-r from-[#8a1e1e] to-[#a83030] text-[#f5e9c8] shadow-xl shadow-red-900/30",
      },
    },
    {
      key: "tunisian-modern-elegant",
      label: "Tunisian Modern Elegant",
      emoji: "✨",
      tagline: "Contemporain, beige et bronze",
      swatches: ["#efe8dc", "#8a7350", "#3a2e22", "#d4b98a"],
      overrides: {
        pageBg: "bg-[#efe8dc]",
        pageText: "text-[#3a2e22]",
        surface: "bg-white/70 backdrop-blur-lg",
        border: "border-[#8a7350]/30",
        accent: "text-[#8a7350]",
        accentBg: "bg-[#8a7350]",
        font: "font-sans",
        headingFont: "font-serif tracking-tight",
        overlay:
          "radial-gradient(60% 50% at 50% 0%, rgba(138,115,80,0.12), transparent 70%)",
        decor: "particles",
        ctaClass:
          "bg-[#3a2e22] text-[#efe8dc] hover:bg-[#4a3e32] shadow-lg",
      },
    },
    {
      key: "tunisian-white-gold",
      label: "White & Gold",
      emoji: "🤍",
      tagline: "Blanc immaculé, or délicat",
      swatches: ["#ffffff", "#f8f2e6", "#c9a86a", "#2a1f14"],
      overrides: {
        pageBg: "bg-white",
        pageText: "text-[#2a1f14]",
        surface: "bg-[#faf8f4]",
        border: "border-[#c9a86a]/35",
        accent: "text-[#c9a86a]",
        accentBg: "bg-[#c9a86a]",
        decor: "none",
        overlay: "radial-gradient(50% 40% at 50% 0%, rgba(201,168,106,0.08), transparent 70%)",
        ctaClass: "bg-[#c9a86a] text-white shadow-lg shadow-[#c9a86a]/30",
      },
    },
    {
      key: "tunisian-elegant",
      label: "Tunisian Elegant",
      emoji: "🥂",
      tagline: "Champagne & encre",
      swatches: ["#f5efe3", "#9a7b4f", "#2a1f14", "#d4c4a8"],
      overrides: {
        pageBg: "bg-[#f5efe3]",
        pageText: "text-[#2a1f14]",
        accent: "text-[#9a7b4f]",
        accentBg: "bg-[#9a7b4f]",
        border: "border-[#9a7b4f]/30",
        decor: "arabesque",
        ctaClass: "bg-[#2a1f14] text-[#f5efe3] hover:bg-[#3a2f24]",
      },
    },
    {
      key: "tunisian-prestige",
      label: "Tunisian Prestige",
      emoji: "🏛️",
      tagline: "Prestige & damas",
      swatches: ["#1a1208", "#b8860b", "#f5e9c8", "#8a1e1e"],
      overrides: {
        pageBg: "bg-[#1a1208]",
        pageText: "text-[#f5e9c8]",
        accent: "text-[#b8860b]",
        accentBg: "bg-[#b8860b]",
        border: "border-[#b8860b]/30",
        decor: "particles",
        overlay: "radial-gradient(60% 40% at 50% 0%, rgba(184,134,11,0.22), transparent 70%)",
        ctaClass: "bg-gradient-to-r from-[#b8860b] to-[#d4a843] text-black shadow-xl",
      },
    },
    {
      key: "tunisian-premium",
      label: "Premium Tunisian",
      emoji: "💫",
      tagline: "Signature premium",
      swatches: ["#0a0804", "#e8c547", "#d4af37", "#f5e9c8"],
      overrides: {
        pageBg: "bg-[#0a0804]",
        pageText: "text-[#f5e9c8]",
        accent: "text-[#e8c547]",
        accentBg: "bg-[#e8c547]",
        border: "border-[#e8c547]/35",
        decor: "particles",
        ctaClass: "bg-gradient-to-r from-[#e8c547] to-[#d4af37] text-black font-medium shadow-2xl",
      },
    },
    {
      key: "tunisian-arabic-luxury",
      label: "Arabic Luxury",
      emoji: "📜",
      tagline: "Calligraphie & or",
      swatches: ["#f8f0e0", "#c9a227", "#2a1f14", "#fff"],
      overrides: {
        pageBg: "bg-[#f8f0e0]",
        pageText: "text-[#2a1f14]",
        accent: "text-[#c9a227]",
        accentBg: "bg-[#c9a227]",
        font: "font-arabic",
        headingFont: "font-arabic-display",
        decor: "arabesque",
        ctaClass: "bg-[#c9a227] text-white shadow-lg",
      },
    },
    {
      key: "tunisian-oriental",
      label: "Oriental Floral",
      emoji: "🌺",
      tagline: "Motifs orientaux",
      swatches: ["#fdf0f0", "#b56576", "#a8884a", "#fff"],
      overrides: {
        pageBg: "bg-gradient-to-br from-[#fdf0f0] to-[#faf1e2]",
        pageText: "text-[#3a221f]",
        accent: "text-[#b56576]",
        accentBg: "bg-[#b56576]",
        decor: "petals",
        ctaClass: "bg-[#b56576] text-white shadow-lg",
      },
    },
    {
      key: "tunisian-traditional",
      label: "Traditional Tunisian",
      emoji: "🕌",
      tagline: "Tradition authentique",
      swatches: ["#f4e8d0", "#8b4513", "#a8884a", "#2a1f14"],
      overrides: {
        pageBg: "bg-[#f4e8d0]",
        pageText: "text-[#2a1f14]",
        accent: "text-[#8b4513]",
        accentBg: "bg-[#8b4513]",
        decor: "arabesque",
        ctaClass: "bg-[#8b4513] text-[#f4e8d0]",
      },
    },
    {
      key: "tunisian-ivory",
      label: "Ivory Wedding",
      emoji: "🕊️",
      tagline: "Ivoire nuptial",
      swatches: ["#fffef8", "#b8956a", "#e8dcc8", "#3a2e22"],
      overrides: {
        pageBg: "bg-[#fffef8]",
        pageText: "text-[#3a2e22]",
        accent: "text-[#b8956a]",
        accentBg: "bg-[#b8956a]",
        decor: "none",
        border: "border-[#b8956a]/25",
        ctaClass: "bg-[#b8956a] text-white",
      },
    },
    {
      key: "tunisian-royal-palace",
      label: "Royal Palace",
      emoji: "👑",
      tagline: "Palais royal",
      swatches: ["#2a0a0a", "#7a1f1f", "#d4af37", "#f5e9c8"],
      overrides: {
        pageBg: "bg-gradient-to-b from-[#2a0a0a] to-[#1a0505]",
        pageText: "text-[#f5e9c8]",
        accent: "text-[#d4af37]",
        accentBg: "bg-[#7a1f1f]",
        border: "border-[#d4af37]/30",
        decor: "arabesque",
        ctaClass: "bg-gradient-to-r from-[#7a1f1f] to-[#9a2f2f] text-[#f5e9c8]",
      },
    },
    {
      key: "tunisian-golden-roses",
      label: "Golden Roses",
      emoji: "🌹",
      tagline: "Roses & dorure",
      swatches: ["#fdf5f0", "#c9956b", "#d4af37", "#fff"],
      overrides: {
        pageBg: "bg-gradient-to-br from-[#fdf5f0] via-[#faf0e6] to-[#f5e6d3]",
        pageText: "text-[#3a221f]",
        accent: "text-[#c9956b]",
        accentBg: "bg-[#c9956b]",
        decor: "petals",
        ctaClass: "bg-gradient-to-r from-[#c9956b] to-[#d4af37] text-white",
      },
    },
    {
      key: "tunisian-emerald",
      label: "Emerald Wedding",
      emoji: "💚",
      tagline: "Vert émeraude & or",
      swatches: ["#f0f5f2", "#1a6b4a", "#d4af37", "#fff"],
      overrides: {
        pageBg: "bg-[#f0f5f2]",
        pageText: "text-[#1a3a2a]",
        accent: "text-[#1a6b4a]",
        accentBg: "bg-[#1a6b4a]",
        border: "border-[#1a6b4a]/30",
        decor: "arabesque",
        ctaClass: "bg-[#1a6b4a] text-white shadow-lg",
      },
    },
  ],
};

export function resolveTheme(themeKey: ThemeKey, subKey?: string | null): ThemeConfig {
  const base = THEMES[themeKey] ?? THEMES.minimal;
  if (!subKey) return base;
  const variant = SUBTHEMES[themeKey]?.find((s) => s.key === subKey);
  if (!variant) return base;
  return { ...base, ...variant.overrides };
}

export function defaultSubtheme(themeKey: ThemeKey): string {
  return SUBTHEMES[themeKey]?.[0]?.key ?? "";
}
