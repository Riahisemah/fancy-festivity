// Rendu d'une section sur la page publique d'invitation.
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Calendar, Clock, MapPin, Phone, Mail, Link as LinkIcon, ChevronDown } from "lucide-react";
import type { ThemeConfig } from "@/lib/themes";
import type { Section } from "@/lib/sections";
import { t, formatDateLong as fmtDate, isRTL, isBilingual, arabicFont, labelClass, type Lang } from "@/lib/i18n";
import type { SectionStyle } from "@/lib/section-style";
import {
  sectionStyleVars, fontFamilyClass, titleSizeClass, bodySizeClass,
  accentInlineStyle, accentBgInlineStyle,
} from "@/lib/section-style";
import { SectionShell } from "@/components/immersive/SectionShell";
import { TiltCard } from "@/components/immersive/TiltCard";
import { RevealText } from "@/components/immersive/RevealText";
import { BilingualText } from "@/components/sections/BilingualText";
import { splitBilingualBody, splitBilingualTitle } from "@/components/sections/bilingual-utils";
import { SceneSection } from "@/components/sections/SceneSection";
import { ThemeSectionDivider } from "@/components/sections/ThemeSectionDivider";
import { sceneItem, sceneStaggerDelay } from "@/components/sections/scene-motion";
import { resolveSceneLayout } from "@/lib/section-layouts";
import type { SectionShellVariant } from "@/lib/animations";

const revealEase = [0.16, 1, 0.3, 1] as const;

function motionReveal(preview: boolean) {
  if (preview) {
    return { initial: false as const, animate: { opacity: 1, y: 0 } };
  }
  return {
    initial: { opacity: 0, y: 32 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, margin: "-80px" },
    transition: { duration: 0.8, ease: revealEase },
  };
}

function motionItem(preview: boolean, axis: "x" | "y", from: number, rtl = false) {
  const offset = axis === "x" ? (rtl ? -from : from) : from;
  const key = axis === "x" ? "x" : "y";
  if (preview) {
    return { initial: false as const, animate: { opacity: 1, [key]: 0 } };
  }
  return {
    initial: { opacity: 0, [key]: offset },
    whileInView: { opacity: 1, [key]: 0 },
    viewport: { once: true },
    transition: { duration: 0.6 },
  };
}

function sx(s: { style?: SectionStyle }, lang: Lang, theme: ThemeConfig) {
  const st = s.style;
  const ff = fontFamilyClass(st?.fontFamily, lang);
  return {
    wrapClass: `${ff}${st?.backgroundColor ? " rounded-2xl p-4 md:p-8" : ""}`.trim(),
    wrapStyle: sectionStyleVars(st),
    titleClass: (kind?: string, fallback = "") => `${titleSizeClass(st, kind)} ${ff || fallback}`.trim(),
    bodyClass: `${bodySizeClass(st)} ${ff}`.trim(),
    accentClass: st?.accentColor ? "" : theme.accent,
    accentStyle: accentInlineStyle(st),
    accentBgClass: st?.accentColor ? "" : theme.accentBg,
    accentBgStyle: accentBgInlineStyle(st),
  };
}

export function SectionRenderer({
  section, theme, index, lang = "fr", preview = false, sectionTransitionVariant,
}: {
  section: Section;
  theme: ThemeConfig;
  index: number;
  lang?: Lang;
  preview?: boolean;
  sectionTransitionVariant?: SectionShellVariant;
}) {
  const depth = 0.6 + ((index % 3) * 0.35);
  const reveal = motionReveal(preview);
  const layout = resolveSceneLayout(section.kind, index);
  const inner = (() => {
    switch (section.kind) {
      case "hero":       return <HeroBlock s={section} t={theme} lang={lang} preview={preview} />;
      case "event":      return <TiltCard><EventBlock s={section} t={theme} lang={lang} reveal={reveal} preview={preview} /></TiltCard>;
      case "timeline":   return <TimelineBlock s={section} t={theme} lang={lang} reveal={reveal} preview={preview} />;
      case "card":       return <TiltCard><CardBlock s={section} t={theme} lang={lang} reveal={reveal} /></TiltCard>;
      case "gallery":    return <GalleryBlock s={section} t={theme} lang={lang} reveal={reveal} masonry={layout === "masonry"} />;
      case "image-text": return <ImageTextBlock s={section} t={theme} index={index} lang={lang} reveal={reveal} />;
      case "map":        return <MapBlock s={section} t={theme} lang={lang} reveal={reveal} />;
      case "program":    return <TiltCard><ProgramBlock s={section} t={theme} lang={lang} reveal={reveal} preview={preview} /></TiltCard>;
      case "quote":      return <QuoteBlock s={section} t={theme} lang={lang} reveal={reveal} />;
      case "countdown":  return <CountdownBlock s={section} t={theme} lang={lang} reveal={reveal} />;
      case "contact":    return <TiltCard><ContactBlock s={section} t={theme} lang={lang} reveal={reveal} /></TiltCard>;
      case "faq":        return <FaqBlock s={section} t={theme} lang={lang} reveal={reveal} />;
    }
  })();
  if ("hidden" in section && section.hidden) return null;
  const styles = sx(section, lang, theme);

  return (
    <>
      {index > 0 && <ThemeSectionDivider theme={theme} index={index} preview={preview} />}
      <SectionShell depth={depth} index={index} themeDecor={theme.decor} preview={preview} variantOverride={sectionTransitionVariant}>
        <SceneSection kind={section.kind} index={index} theme={theme} preview={preview} layout={layout}>
          <div className={`${styles.wrapClass} ${layout === "floating-glass" ? "!bg-transparent !border-0 !shadow-none !p-0" : ""}`.trim()} style={styles.wrapStyle}>
            {inner}
          </div>
        </SceneSection>
      </SectionShell>
    </>
  );
}

/* ---------- HERO ---------- */
function HeroBlock({ s, t, lang, preview = false }: { s: Extract<Section, { kind: "hero" }>; t: ThemeConfig; lang: Lang; preview?: boolean }) {
  const rtl = isRTL(lang);
  const bilingual = isBilingual(lang);
  const st = sx(s, lang, t);
  const headingFallback = rtl || bilingual ? arabicFont(lang, "display") : t.headingFont;

  if (bilingual) {
    return (
      <section className="relative text-center py-12 md:py-20" dir="ltr" style={s.style?.textAlign ? { textAlign: s.style.textAlign } : undefined}>
        <motion.div initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ duration: 1, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className={`mx-auto mt-2 h-px w-16 ${st.accentBgClass} origin-center`} style={st.accentBgStyle} />
        {s.eyebrow && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }} className="mt-6 space-y-2">
            <p dir="rtl" lang="ar" className={`font-arabic text-sm ${st.accentClass}`} style={st.accentStyle}>{s.eyebrow}</p>
          </motion.div>
        )}
        <RevealText rtl={false} instant={preview} className={`mt-8 ${st.titleClass("hero", headingFallback)} leading-[1.35]`}>
          <h1 dir="rtl" lang="ar" className={`inline-block font-arabic-display ${t.decor === "arabesque" ? "text-gold-foil" : ""}`}>{s.title}</h1>
        </RevealText>
        {s.subtitle && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 0.9 }} transition={{ duration: 1, delay: 0.6 }} className="mt-6 mx-auto max-w-2xl">
            <p dir="ltr" lang="fr" className={`font-serif text-base md:text-lg italic leading-relaxed ${st.bodyClass}`}>{s.subtitle}</p>
          </motion.div>
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

  return (
    <section className="relative text-center py-12 md:py-20" dir={rtl ? "rtl" : "ltr"} style={s.style?.textAlign ? { textAlign: s.style.textAlign } : undefined}>
      {s.eyebrow && (
        <motion.p initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}
          className={labelClass(lang, st.accentClass)} style={st.accentStyle}>{s.eyebrow}</motion.p>
      )}
      <motion.div initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ duration: 1, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
        className={`mx-auto mt-6 h-px w-16 ${st.accentBgClass} ${rtl ? "origin-right" : "origin-left"}`} style={st.accentBgStyle} />
      {s.imageUrl && (
        <motion.div initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.1, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="my-10 md:my-12 overflow-hidden rounded-3xl shadow-2xl ring-1 ring-black/10">
          <img src={s.imageUrl} alt={s.title} className="w-full h-auto object-cover" />
        </motion.div>
      )}
      <RevealText
        rtl={rtl}
        instant={preview}
        className={`mt-8 ${st.titleClass("hero", headingFallback)} ${rtl ? "leading-[1.35]" : "leading-[1.05] tracking-tight"}`}
      >
        <h1 className={`inline-block ${t.decor === "arabesque" ? "text-gold-foil" : ""}`}>{s.title}</h1>
      </RevealText>
      {s.subtitle && (
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 0.85 }} transition={{ duration: 1, delay: 0.6 }}
          className={`mt-6 ${st.bodyClass} ${rtl ? "" : "italic"}`}>{s.subtitle}</motion.p>
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
function EventBlock({ s, t, lang, reveal, preview = false }: { s: Extract<Section, { kind: "event" }>; t: ThemeConfig; lang: Lang; reveal: ReturnType<typeof motionReveal>; preview?: boolean }) {
  const st = sx(s, lang, t);
  const bilingual = isBilingual(lang);
  const headingFallback = isRTL(lang) || bilingual ? arabicFont(lang, "display") : t.headingFont;
  const titleParts = bilingual ? splitBilingualTitle(s.title) : null;
  return (
    <motion.section {...reveal} dir={isRTL(lang) ? "rtl" : "ltr"}
      className={`surface-premium relative rounded-3xl border ${t.border} p-8 md:p-12 overflow-hidden group`}
      style={s.style?.textAlign ? { textAlign: s.style.textAlign } : undefined}>
      <motion.div className={`absolute inset-0 ${st.accentBgClass} opacity-0 group-hover:opacity-[0.05] transition-opacity`} style={st.accentBgStyle} />
      <div className="relative text-center">
        {s.icon && (
          <motion.div variants={sceneItem} custom={0} initial="hidden" whileInView="show" viewport={{ once: true }}
            transition={{ delay: sceneStaggerDelay(0, preview) }} className="text-4xl mb-4">{s.icon}</motion.div>
        )}
        <motion.div variants={sceneItem} initial="hidden" whileInView="show" viewport={{ once: true }}
          transition={{ delay: sceneStaggerDelay(1, preview) }}
          className={`${isRTL(lang) || bilingual ? labelClass(lang, st.accentClass) : `text-[10px] uppercase tracking-[0.35em] ${st.accentClass}`}`} style={st.accentStyle}>{t2(lang, "program")}</motion.div>
        <motion.div variants={sceneItem} initial="hidden" whileInView="show" viewport={{ once: true }}
          transition={{ delay: sceneStaggerDelay(2, preview) }}>
          {titleParts ? (
            <BilingualText ar={titleParts.ar} fr={titleParts.fr} className="mt-3" arClassName="text-3xl md:text-4xl font-arabic-display" frClassName="text-xl md:text-2xl font-serif" />
          ) : (
            <h2 className={`${st.titleClass("event", headingFallback)} ${isRTL(lang) ? "" : "tracking-tight"} mt-3`}>{s.title}</h2>
          )}
        </motion.div>
        {s.description && (
          <motion.p variants={sceneItem} initial="hidden" whileInView="show" viewport={{ once: true }}
            transition={{ delay: sceneStaggerDelay(3, preview) }}
            className={`mt-4 max-w-xl mx-auto opacity-75 leading-relaxed ${st.bodyClass}`}>{s.description}</motion.p>
        )}
        <motion.div variants={sceneItem} initial="hidden" whileInView="show" viewport={{ once: true }}
          transition={{ delay: sceneStaggerDelay(4, preview) }}
          className="mt-7 flex flex-wrap justify-center gap-2 text-sm">
          {s.date && <Pill t={t} icon={<Calendar className="size-3.5" />}>{fmtDate(s.date, lang)}</Pill>}
          {s.time && <Pill t={t} icon={<Clock className="size-3.5" />}>{s.time}</Pill>}
          {s.location && <Pill t={t} icon={<MapPin className="size-3.5" />}>{s.location}</Pill>}
        </motion.div>
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
function TimelineBlock({ s, t, lang, reveal, preview }: { s: Extract<Section, { kind: "timeline" }>; t: ThemeConfig; lang: Lang; reveal: ReturnType<typeof motionReveal>; preview: boolean }) {
  const rtl = isRTL(lang);
  return (
    <motion.section {...reveal} dir={rtl ? "rtl" : "ltr"} className="my-12">
      {s.title && <h2 className={`${arabicFont(lang, "display") || t.headingFont} text-3xl md:text-4xl text-center mb-10`}>{s.title}</h2>}
      <div className="relative max-w-xl mx-auto">
        <div className={`absolute ${rtl ? "right-4" : "left-4"} top-2 bottom-2 w-px ${t.accentBg} opacity-30`} />
        <ul className="space-y-7">
          {s.items.map((it, i) => (
            <motion.li key={i} {...motionItem(preview, "x", 16, rtl)}
              transition={{ duration: 0.6, delay: preview ? 0 : i * 0.08 }}
              className={`relative ${rtl ? "pr-12" : "pl-12"}`}>
              <div className={`absolute ${rtl ? "right-2.5" : "left-2.5"} top-1.5 size-3 rounded-full ${t.accentBg} ring-4 ring-white/10`} />
              <div className={`text-xs ${rtl ? labelClass(lang, t.accent) : `uppercase tracking-widest ${t.accent}`}`}>{it.time}</div>
              <div className={`mt-1 text-lg font-medium ${arabicFont(lang)}`}>{it.label}</div>
              {it.description && <div className={`mt-1 text-sm opacity-70 ${arabicFont(lang)}`}>{it.description}</div>}
            </motion.li>
          ))}
        </ul>
      </div>
    </motion.section>
  );
}

/* ---------- CARD ---------- */
function CardBlock({ s, t, lang, reveal }: { s: Extract<Section, { kind: "card" }>; t: ThemeConfig; lang: Lang; reveal: ReturnType<typeof motionReveal> }) {
  const rtl = isRTL(lang);
  const bilingual = isBilingual(lang);
  const st = sx(s, lang, t);
  const titleParts = bilingual ? splitBilingualTitle(s.title) : null;
  const bodyParts = bilingual ? splitBilingualBody(s.body) : null;
  return (
    <motion.section {...reveal} dir={rtl ? "rtl" : "ltr"} className={`surface-premium my-8 rounded-3xl border ${t.border} p-8 md:p-12 text-center overflow-hidden`}
      style={s.style?.textAlign ? { textAlign: s.style.textAlign } : undefined}>
      {titleParts ? (
        <BilingualText ar={titleParts.ar} fr={titleParts.fr} arClassName="text-3xl md:text-4xl font-arabic-display" frClassName="text-xl font-serif" />
      ) : (
        <h2 className={st.titleClass("card", rtl || bilingual ? arabicFont(lang, "display") : t.headingFont)}>{s.title}</h2>
      )}
      {bodyParts ? (
        <div className="mt-5 max-w-2xl mx-auto">
          <BilingualText ar={bodyParts.ar} fr={bodyParts.fr} arClassName="font-arabic text-base leading-relaxed opacity-90" frClassName="font-serif text-sm italic leading-relaxed opacity-80" />
        </div>
      ) : (
        <p className={`mt-5 max-w-2xl mx-auto leading-relaxed opacity-80 whitespace-pre-line ${st.bodyClass}`}>{s.body}</p>
      )}
    </motion.section>
  );
}

/* ---------- GALLERY ---------- */
function GalleryBlock({ s, t, lang, reveal, masonry = false }: { s: Extract<Section, { kind: "gallery" }>; t: ThemeConfig; lang: Lang; reveal: ReturnType<typeof motionReveal>; masonry?: boolean }) {
  if (!s.images.length) return null;
  return (
    <motion.section {...reveal} dir={isRTL(lang) ? "rtl" : "ltr"}>
      {s.title && (
        <motion.h2 variants={sceneItem} initial="hidden" whileInView="show" viewport={{ once: true }}
          className={`${arabicFont(lang, "display") || t.headingFont} text-3xl md:text-4xl text-center mb-8`}>{s.title}</motion.h2>
      )}
      <div className={masonry
        ? "columns-2 md:columns-3 gap-3 md:gap-4 space-y-3 md:space-y-4"
        : "grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4"}>
        {s.images.map((src, i) => (
          <motion.div
            key={i}
            variants={sceneItem}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            transition={{ delay: i * 0.08 }}
            whileHover={{ scale: 1.02, y: -4 }}
            className={`overflow-hidden rounded-2xl ring-1 ring-black/10 shadow-lg ${masonry ? "break-inside-avoid mb-3 md:mb-4" : "aspect-square"}`}
          >
            <img src={src} alt="" className={`w-full object-cover transition-transform duration-700 hover:scale-110 ${masonry ? "h-auto" : "h-full"}`} loading="lazy" />
          </motion.div>
        ))}
      </div>
    </motion.section>
  );
}

/* ---------- IMAGE + TEXT ---------- */
function ImageTextBlock({ s, t, index, lang, reveal }: { s: Extract<Section, { kind: "image-text" }>; t: ThemeConfig; index: number; lang: Lang; reveal: ReturnType<typeof motionReveal> }) {
  void index;
  const rtl = isRTL(lang);
  const orderText = s.reverse ? "md:order-1" : "md:order-2";
  const orderImage = s.reverse ? "md:order-2" : "md:order-1";
  return (
    <motion.section {...reveal} dir={rtl ? "rtl" : "ltr"} className="my-12 grid md:grid-cols-2 gap-8 md:gap-12 items-center">
      <div className={orderImage}>
        {s.imageUrl ? (
          <motion.img whileHover={{ scale: 1.02 }} transition={{ duration: 0.6 }}
            src={s.imageUrl} alt={s.title} className="w-full aspect-[4/5] object-cover rounded-3xl shadow-2xl ring-1 ring-black/10" />
        ) : (
          <div className={`w-full aspect-[4/5] rounded-3xl ${t.surface} border ${t.border}`} />
        )}
      </div>
      <div className={orderText}>
        <h2 className={`${arabicFont(lang, "display") || t.headingFont} text-3xl md:text-5xl ${rtl ? "" : "tracking-tight"}`}>{s.title}</h2>
        <p className={`mt-5 leading-relaxed opacity-80 whitespace-pre-line ${arabicFont(lang)}`}>{s.body}</p>
      </div>
    </motion.section>
  );
}

/* ---------- MAP ---------- */
function MapBlock({ s, t, lang, reveal }: { s: Extract<Section, { kind: "map" }>; t: ThemeConfig; lang: Lang; reveal: ReturnType<typeof motionReveal> }) {
  const embed = s.embedUrl || `https://www.google.com/maps?q=${encodeURIComponent(s.address)}&output=embed`;
  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(s.address)}`;
  return (
    <motion.section {...reveal} dir={isRTL(lang) ? "rtl" : "ltr"} className="my-12">
      {s.title && <h2 className={`${arabicFont(lang, "display") || t.headingFont} text-2xl sm:text-3xl md:text-4xl text-center mb-6`}>{s.title}</h2>}
      <div className={`rounded-3xl overflow-hidden border ${t.border} shadow-2xl`}>
        <iframe title="Carte" src={embed} className="w-full h-[280px] sm:h-[360px] md:h-[440px]" loading="lazy" allowFullScreen />
      </div>
      <p className={`mt-4 text-center text-sm opacity-70 px-4 ${arabicFont(lang)}`}>{s.address}</p>
      {s.address && (
        <div className="mt-4 flex justify-center">
          <a href={mapsUrl} target="_blank" rel="noopener noreferrer"
            className={`inline-flex items-center justify-center gap-2 rounded-full border ${t.border} min-h-11 px-6 py-2.5 text-sm font-medium hover:bg-white/10 transition touch-target`}>
            📍 {lang === "ar" ? "فتح في خرائط Google" : "Ouvrir dans Google Maps"}
          </a>
        </div>
      )}
    </motion.section>
  );
}

/* ---------- PROGRAM ---------- */
function ProgramBlock({ s, t, lang, reveal, preview }: { s: Extract<Section, { kind: "program" }>; t: ThemeConfig; lang: Lang; reveal: ReturnType<typeof motionReveal>; preview: boolean }) {
  const rtl = isRTL(lang);
  return (
    <motion.section {...reveal} dir={rtl ? "rtl" : "ltr"} className={`surface-premium my-12 rounded-3xl border ${t.border} p-8 md:p-10 overflow-hidden`}>
      {s.title && <h2 className={`${arabicFont(lang, "display") || t.headingFont} text-2xl md:text-3xl text-center mb-6`}>{s.title}</h2>}
      <ul className="divide-y divide-current/10 max-w-md mx-auto">
        {s.items.map((it, i) => (
          <motion.li key={i} {...motionItem(preview, "y", 8)}
            transition={{ duration: 0.5, delay: preview ? 0 : i * 0.05 }}
            className={`flex items-center justify-between gap-4 py-3.5 text-base ${rtl ? "flex-row-reverse" : ""}`}>
            <span className={`font-mono text-sm tabular-nums ${t.accent}`}>{it.time}</span>
            <span className={arabicFont(lang)}>{it.label}</span>
          </motion.li>
        ))}
      </ul>
    </motion.section>
  );
}

/* ---------- QUOTE ---------- */
function QuoteBlock({ s, t, lang, reveal }: { s: Extract<Section, { kind: "quote" }>; t: ThemeConfig; lang: Lang; reveal: ReturnType<typeof motionReveal> }) {
  const rtl = isRTL(lang);
  return (
    <motion.section {...reveal} dir={rtl ? "rtl" : "ltr"} className="my-16 text-center max-w-2xl mx-auto">
      <div className={`text-6xl ${t.accent} opacity-50 leading-none`}>{rtl ? "”" : "“"}</div>
      <p className={`${arabicFont(lang, "display") || t.headingFont} text-2xl md:text-3xl ${rtl ? "" : "italic"} leading-snug mt-2`}>{s.text}</p>
      {s.author && <p className={`mt-6 ${labelClass(lang, t.accent)}`}>— {s.author}</p>}
    </motion.section>
  );
}

/* ---------- COUNTDOWN ---------- */
function CountdownBlock({ s, t, lang, reveal }: { s: Extract<Section, { kind: "countdown" }>; t: ThemeConfig; lang: Lang; reveal: ReturnType<typeof motionReveal> }) {
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
    <motion.section {...reveal} dir={isRTL(lang) ? "rtl" : "ltr"} className="my-12 text-center">
      {s.label && <p className={`${labelClass(lang, t.accent)} mb-6`}>{s.label}</p>}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 md:gap-4 max-w-xl mx-auto">
        {cells.map(([label, v]) => (
          <div key={label} className={`rounded-2xl border ${t.border} ${t.surface} p-3 sm:p-4 md:p-6`}>
            <div className={`${arabicFont(lang, "display") || t.headingFont} text-2xl sm:text-3xl md:text-5xl tabular-nums`}>{String(v).padStart(2, "0")}</div>
            <div className={`mt-1.5 sm:mt-2 ${isRTL(lang) ? "font-arabic text-xs opacity-70" : "text-[10px] sm:text-xs uppercase tracking-widest opacity-70"}`}>{label}</div>
          </div>
        ))}
      </div>
    </motion.section>
  );
}

/* ---------- CONTACT ---------- */
function ContactBlock({ s, t, lang, reveal }: { s: Extract<Section, { kind: "contact" }>; t: ThemeConfig; lang: Lang; reveal: ReturnType<typeof motionReveal> }) {
  const rtl = isRTL(lang);
  const iconFor = (type?: string) => type === "phone" ? <Phone className="size-4" /> : type === "email" ? <Mail className="size-4" /> : <LinkIcon className="size-4" />;
  const hrefFor = (it: { value: string; type?: string }) =>
    it.type === "phone" ? `tel:${it.value}` : it.type === "email" ? `mailto:${it.value}` : it.value;
  return (
    <motion.section {...reveal} dir={rtl ? "rtl" : "ltr"} className={`surface-premium my-12 rounded-3xl border ${t.border} p-8 md:p-10 overflow-hidden`}>
      {s.title && <h2 className={`${arabicFont(lang, "display") || t.headingFont} text-2xl md:text-3xl text-center mb-6`}>{s.title}</h2>}
      <ul className="space-y-3 max-w-md mx-auto">
        {s.items.map((it, i) => (
          <li key={i}>
            <a href={hrefFor(it)} target="_blank" rel="noreferrer"
              className={`flex items-center gap-3 rounded-2xl border ${t.border} px-4 py-3.5 hover:opacity-80 transition-all ${rtl ? "flex-row-reverse text-right" : ""}`}>
              <span className={t.accent}>{iconFor(it.type)}</span>
              <span className="flex-1">
                <span className={`block ${rtl ? "font-arabic text-xs opacity-60" : "text-[11px] uppercase tracking-widest opacity-60"}`}>{it.label}</span>
                <span className={`block ${arabicFont(lang)}`}>{it.value}</span>
              </span>
            </a>
          </li>
        ))}
      </ul>
    </motion.section>
  );
}

/* ---------- FAQ ---------- */
function FaqBlock({ s, t, lang, reveal }: { s: Extract<Section, { kind: "faq" }>; t: ThemeConfig; lang: Lang; reveal: ReturnType<typeof motionReveal> }) {
  const rtl = isRTL(lang);
  const [open, setOpen] = useState<number | null>(0);
  return (
    <motion.section {...reveal} dir={rtl ? "rtl" : "ltr"} className="my-12 max-w-2xl mx-auto">
      {s.title && <h2 className={`${arabicFont(lang, "display") || t.headingFont} text-2xl md:text-3xl text-center mb-6`}>{s.title}</h2>}
      <ul className="space-y-2">
        {s.items.map((it, i) => {
          const isOpen = open === i;
          return (
            <li key={i} className={`rounded-2xl border ${t.border} ${t.surface} overflow-hidden`}>
              <button onClick={() => setOpen(isOpen ? null : i)}
                className={`w-full flex items-center justify-between gap-4 px-5 py-4 ${rtl ? "text-right flex-row-reverse" : "text-left"}`}>
                <span className={`font-medium ${arabicFont(lang)}`}>{it.q}</span>
                <ChevronDown className={`size-4 shrink-0 transition-transform ${isOpen ? "rotate-180" : ""}`} />
              </button>
              <motion.div initial={false} animate={{ height: isOpen ? "auto" : 0, opacity: isOpen ? 1 : 0 }}
                transition={{ duration: 0.3 }} className="overflow-hidden">
                <p className={`px-5 pb-4 text-sm opacity-80 leading-relaxed ${arabicFont(lang)}`}>{it.a}</p>
              </motion.div>
            </li>
          );
        })}
      </ul>
    </motion.section>
  );
}

