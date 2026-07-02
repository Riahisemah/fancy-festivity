// Rendu d'une section sur la page publique d'invitation.
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Calendar, Clock, MapPin, Phone, Mail, Link as LinkIcon, ChevronDown } from "lucide-react";
import type { ThemeConfig } from "@/lib/themes";
import type { Section } from "@/lib/sections";
import { t, formatDateLong as fmtDate, isRTL, type Lang } from "@/lib/i18n";
import { SectionShell } from "@/components/immersive/SectionShell";
import { TiltCard } from "@/components/immersive/TiltCard";

const reveal = {
  initial: { opacity: 0, y: 32 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-80px" },
  transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] as const },
};

export function SectionRenderer({
  section, theme, index, lang = "fr",
}: { section: Section; theme: ThemeConfig; index: number; lang?: Lang }) {
  const depth = 0.6 + ((index % 3) * 0.35);
  const inner = (() => {
    switch (section.kind) {
      case "hero":       return <HeroBlock s={section} t={theme} lang={lang} />;
      case "event":      return <TiltCard><EventBlock s={section} t={theme} lang={lang} /></TiltCard>;
      case "timeline":   return <TimelineBlock s={section} t={theme} />;
      case "card":       return <TiltCard><CardBlock s={section} t={theme} /></TiltCard>;
      case "gallery":    return <GalleryBlock s={section} t={theme} />;
      case "image-text": return <ImageTextBlock s={section} t={theme} index={index} />;
      case "map":        return <MapBlock s={section} t={theme} />;
      case "program":    return <TiltCard><ProgramBlock s={section} t={theme} /></TiltCard>;
      case "quote":      return <QuoteBlock s={section} t={theme} />;
      case "countdown":  return <CountdownBlock s={section} t={theme} lang={lang} />;
      case "contact":    return <TiltCard><ContactBlock s={section} t={theme} /></TiltCard>;
      case "faq":        return <FaqBlock s={section} t={theme} />;
    }
  })();
  return <SectionShell depth={depth}>{inner}</SectionShell>;
}

/* ---------- HERO ---------- */
function HeroBlock({ s, t, lang }: { s: Extract<Section, { kind: "hero" }>; t: ThemeConfig; lang: Lang }) {
  const rtl = isRTL(lang);
  return (
    <section className="relative text-center py-12 md:py-20" dir={rtl ? "rtl" : "ltr"}>
      {s.eyebrow && (
        <motion.p initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}
          className={`text-[11px] uppercase tracking-[0.4em] ${t.accent} ${rtl ? "font-arabic" : ""}`}>{s.eyebrow}</motion.p>
      )}
      <motion.div initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ duration: 1, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
        className={`mx-auto mt-6 h-px w-16 ${t.accentBg} origin-left`} />
      {s.imageUrl && (
        <motion.div initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.1, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="my-10 md:my-12 overflow-hidden rounded-3xl shadow-2xl ring-1 ring-black/10">
          <img src={s.imageUrl} alt={s.title} className="w-full h-auto object-cover" />
        </motion.div>
      )}
      <motion.h1 initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
        className={`mt-8 ${rtl ? "font-arabic-display" : t.headingFont} text-5xl md:text-7xl lg:text-8xl leading-[1.05] tracking-tight`}>
        {s.title}
      </motion.h1>
      {s.subtitle && (
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 0.85 }} transition={{ duration: 1, delay: 0.6 }}
          className={`mt-6 text-xl md:text-2xl ${rtl ? "font-arabic" : "italic"}`}>{s.subtitle}</motion.p>
      )}
      {(s.date || s.location) && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1, delay: 0.75 }}
          className="mt-8 flex flex-wrap justify-center gap-x-8 gap-y-2 text-sm md:text-base opacity-80">
          {s.date && <span>{fmtDate(s.date, lang)}</span>}
          {s.location && <span>· {s.location}</span>}
        </motion.div>
      )}
    </section>
  );
}

/* ---------- EVENT CARD ---------- */
function EventBlock({ s, t, lang }: { s: Extract<Section, { kind: "event" }>; t: ThemeConfig; lang: Lang }) {
  return (
    <motion.section {...reveal} dir={isRTL(lang) ? "rtl" : "ltr"}
      className={`relative rounded-3xl border ${t.border} ${t.surface} p-8 md:p-12 my-8 overflow-hidden group`}>
      <motion.div className={`absolute inset-0 ${t.accentBg} opacity-0 group-hover:opacity-[0.04] transition-opacity`} />
      <div className="relative text-center">
        {s.icon && <div className="text-4xl mb-4">{s.icon}</div>}
        <div className={`text-[10px] uppercase tracking-[0.35em] ${t.accent} mb-3`}>{t2(lang, "program")}</div>
        <h2 className={`${isRTL(lang) ? "font-arabic-display" : t.headingFont} text-3xl md:text-5xl tracking-tight`}>{s.title}</h2>
        {s.description && <p className={`mt-4 max-w-xl mx-auto opacity-75 leading-relaxed ${isRTL(lang) ? "font-arabic" : ""}`}>{s.description}</p>}
        <div className={`mt-7 flex flex-wrap justify-center gap-2 text-sm`}>
          {s.date && <Pill t={t} icon={<Calendar className="size-3.5" />}>{fmtDate(s.date, lang)}</Pill>}
          {s.time && <Pill t={t} icon={<Clock className="size-3.5" />}>{s.time}</Pill>}
          {s.location && <Pill t={t} icon={<MapPin className="size-3.5" />}>{s.location}</Pill>}
        </div>
      </div>
    </motion.section>
  );
}

const t2 = t;

function Pill({ t, icon, children }: { t: ThemeConfig; icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full border ${t.border} px-4 py-2 backdrop-blur-sm`}>
      {icon}{children}
    </span>
  );
}

/* ---------- TIMELINE ---------- */
function TimelineBlock({ s, t }: { s: Extract<Section, { kind: "timeline" }>; t: ThemeConfig }) {
  return (
    <motion.section {...reveal} className="my-12">
      {s.title && <h2 className={`${t.headingFont} text-3xl md:text-4xl text-center mb-10`}>{s.title}</h2>}
      <div className="relative max-w-xl mx-auto">
        <div className={`absolute left-4 top-2 bottom-2 w-px ${t.accentBg} opacity-30`} />
        <ul className="space-y-7">
          {s.items.map((it, i) => (
            <motion.li key={i} initial={{ opacity: 0, x: -16 }} whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }} transition={{ duration: 0.6, delay: i * 0.08 }}
              className="relative pl-12">
              <div className={`absolute left-2.5 top-1.5 size-3 rounded-full ${t.accentBg} ring-4 ring-white/10`} />
              <div className={`text-xs uppercase tracking-widest ${t.accent}`}>{it.time}</div>
              <div className="mt-1 text-lg font-medium">{it.label}</div>
              {it.description && <div className="mt-1 text-sm opacity-70">{it.description}</div>}
            </motion.li>
          ))}
        </ul>
      </div>
    </motion.section>
  );
}

/* ---------- CARD ---------- */
function CardBlock({ s, t }: { s: Extract<Section, { kind: "card" }>; t: ThemeConfig }) {
  return (
    <motion.section {...reveal} className={`my-8 rounded-3xl border ${t.border} ${t.surface} p-8 md:p-12 text-center`}>
      <h2 className={`${t.headingFont} text-3xl md:text-4xl`}>{s.title}</h2>
      <p className="mt-5 max-w-2xl mx-auto leading-relaxed opacity-80 whitespace-pre-line">{s.body}</p>
    </motion.section>
  );
}

/* ---------- GALLERY ---------- */
function GalleryBlock({ s, t }: { s: Extract<Section, { kind: "gallery" }>; t: ThemeConfig }) {
  if (!s.images.length) return null;
  return (
    <motion.section {...reveal} className="my-12">
      {s.title && <h2 className={`${t.headingFont} text-3xl md:text-4xl text-center mb-8`}>{s.title}</h2>}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
        {s.images.map((src, i) => (
          <motion.div key={i} whileHover={{ scale: 1.02 }} transition={{ type: "spring", stiffness: 220, damping: 22 }}
            className="aspect-square overflow-hidden rounded-2xl ring-1 ring-black/10">
            <img src={src} alt="" className="w-full h-full object-cover transition-transform duration-700 hover:scale-110" loading="lazy" />
          </motion.div>
        ))}
      </div>
    </motion.section>
  );
}

/* ---------- IMAGE + TEXT ---------- */
function ImageTextBlock({ s, t, index }: { s: Extract<Section, { kind: "image-text" }>; t: ThemeConfig; index: number }) {
  void index;
  return (
    <motion.section {...reveal} className={`my-12 grid md:grid-cols-2 gap-8 md:gap-12 items-center ${s.reverse ? "md:[direction:rtl]" : ""}`}>
      <div className="md:[direction:ltr]">
        {s.imageUrl ? (
          <motion.img whileHover={{ scale: 1.02 }} transition={{ duration: 0.6 }}
            src={s.imageUrl} alt={s.title} className="w-full aspect-[4/5] object-cover rounded-3xl shadow-2xl ring-1 ring-black/10" />
        ) : (
          <div className={`w-full aspect-[4/5] rounded-3xl ${t.surface} border ${t.border}`} />
        )}
      </div>
      <div className="md:[direction:ltr]">
        <h2 className={`${t.headingFont} text-3xl md:text-5xl tracking-tight`}>{s.title}</h2>
        <p className="mt-5 leading-relaxed opacity-80 whitespace-pre-line">{s.body}</p>
      </div>
    </motion.section>
  );
}

/* ---------- MAP ---------- */
function MapBlock({ s, t }: { s: Extract<Section, { kind: "map" }>; t: ThemeConfig }) {
  const embed = s.embedUrl || `https://www.google.com/maps?q=${encodeURIComponent(s.address)}&output=embed`;
  return (
    <motion.section {...reveal} className="my-12">
      {s.title && <h2 className={`${t.headingFont} text-3xl md:text-4xl text-center mb-6`}>{s.title}</h2>}
      <div className={`rounded-3xl overflow-hidden border ${t.border} shadow-2xl`}>
        <iframe title="Carte" src={embed} className="w-full h-[360px] md:h-[440px]" loading="lazy" />
      </div>
      <p className="mt-4 text-center text-sm opacity-70">{s.address}</p>
    </motion.section>
  );
}

/* ---------- PROGRAM ---------- */
function ProgramBlock({ s, t }: { s: Extract<Section, { kind: "program" }>; t: ThemeConfig }) {
  return (
    <motion.section {...reveal} className={`my-12 rounded-3xl border ${t.border} ${t.surface} p-8 md:p-10`}>
      {s.title && <h2 className={`${t.headingFont} text-2xl md:text-3xl text-center mb-6`}>{s.title}</h2>}
      <ul className="divide-y divide-current/10 max-w-md mx-auto">
        {s.items.map((it, i) => (
          <motion.li key={i} initial={{ opacity: 0, y: 8 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            transition={{ duration: 0.5, delay: i * 0.05 }}
            className="flex items-center justify-between py-3.5 text-base">
            <span className={`font-mono text-sm ${t.accent}`}>{it.time}</span>
            <span className="text-right">{it.label}</span>
          </motion.li>
        ))}
      </ul>
    </motion.section>
  );
}

/* ---------- QUOTE ---------- */
function QuoteBlock({ s, t }: { s: Extract<Section, { kind: "quote" }>; t: ThemeConfig }) {
  return (
    <motion.section {...reveal} className="my-16 text-center max-w-2xl mx-auto">
      <div className={`text-6xl ${t.accent} opacity-50 leading-none`}>“</div>
      <p className={`${t.headingFont} text-2xl md:text-3xl italic leading-snug mt-2`}>{s.text}</p>
      {s.author && <p className={`mt-6 text-sm uppercase tracking-[0.3em] ${t.accent}`}>— {s.author}</p>}
    </motion.section>
  );
}

/* ---------- COUNTDOWN ---------- */
function CountdownBlock({ s, t, lang }: { s: Extract<Section, { kind: "countdown" }>; t: ThemeConfig; lang: Lang }) {
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    const i = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(i);
  }, []);
  const target = new Date(s.targetDate).getTime();
  const diff = Math.max(0, target - now);
  const d = Math.floor(diff / 86400000);
  const h = Math.floor((diff % 86400000) / 3600000);
  const m = Math.floor((diff % 3600000) / 60000);
  const sec = Math.floor((diff % 60000) / 1000);
  const cells: [string, number][] = [[t2(lang, "days"), d], [t2(lang, "hours"), h], [t2(lang, "minutes"), m], [t2(lang, "seconds"), sec]];

  return (
    <motion.section {...reveal} className="my-12 text-center">
      {s.label && <p className={`text-[11px] uppercase tracking-[0.4em] ${t.accent} mb-6`}>{s.label}</p>}
      <div className="grid grid-cols-4 gap-2 md:gap-4 max-w-xl mx-auto">
        {cells.map(([label, v]) => (
          <div key={label} className={`rounded-2xl border ${t.border} ${t.surface} p-4 md:p-6`}>
            <div className={`${t.headingFont} text-3xl md:text-5xl tabular-nums`}>{String(v).padStart(2, "0")}</div>
            <div className={`mt-2 text-[10px] uppercase tracking-widest opacity-70`}>{label}</div>
          </div>
        ))}
      </div>
    </motion.section>
  );
}

/* ---------- CONTACT ---------- */
function ContactBlock({ s, t }: { s: Extract<Section, { kind: "contact" }>; t: ThemeConfig }) {
  const iconFor = (type?: string) => type === "phone" ? <Phone className="size-4" /> : type === "email" ? <Mail className="size-4" /> : <LinkIcon className="size-4" />;
  const hrefFor = (it: { value: string; type?: string }) =>
    it.type === "phone" ? `tel:${it.value}` : it.type === "email" ? `mailto:${it.value}` : it.value;
  return (
    <motion.section {...reveal} className={`my-12 rounded-3xl border ${t.border} ${t.surface} p-8 md:p-10`}>
      {s.title && <h2 className={`${t.headingFont} text-2xl md:text-3xl text-center mb-6`}>{s.title}</h2>}
      <ul className="space-y-3 max-w-md mx-auto">
        {s.items.map((it, i) => (
          <li key={i}>
            <a href={hrefFor(it)} target="_blank" rel="noreferrer"
              className={`flex items-center gap-3 rounded-2xl border ${t.border} px-4 py-3.5 hover:opacity-80 transition-all`}>
              <span className={t.accent}>{iconFor(it.type)}</span>
              <span className="flex-1">
                <span className="block text-[11px] uppercase tracking-widest opacity-60">{it.label}</span>
                <span className="block">{it.value}</span>
              </span>
            </a>
          </li>
        ))}
      </ul>
    </motion.section>
  );
}

/* ---------- FAQ ---------- */
function FaqBlock({ s, t }: { s: Extract<Section, { kind: "faq" }>; t: ThemeConfig }) {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <motion.section {...reveal} className="my-12 max-w-2xl mx-auto">
      {s.title && <h2 className={`${t.headingFont} text-2xl md:text-3xl text-center mb-6`}>{s.title}</h2>}
      <ul className="space-y-2">
        {s.items.map((it, i) => {
          const isOpen = open === i;
          return (
            <li key={i} className={`rounded-2xl border ${t.border} ${t.surface} overflow-hidden`}>
              <button onClick={() => setOpen(isOpen ? null : i)}
                className="w-full flex items-center justify-between gap-4 px-5 py-4 text-left">
                <span className="font-medium">{it.q}</span>
                <ChevronDown className={`size-4 transition-transform ${isOpen ? "rotate-180" : ""}`} />
              </button>
              <motion.div initial={false} animate={{ height: isOpen ? "auto" : 0, opacity: isOpen ? 1 : 0 }}
                transition={{ duration: 0.3 }} className="overflow-hidden">
                <p className="px-5 pb-4 text-sm opacity-80 leading-relaxed">{it.a}</p>
              </motion.div>
            </li>
          );
        })}
      </ul>
    </motion.section>
  );
}

