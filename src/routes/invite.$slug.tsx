// Page publique : rend les sections dynamiques de l'invitation.
import { createFileRoute, notFound, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Share2, Copy, MessageCircle, QrCode, Facebook, Instagram } from "lucide-react";
import { toast } from "sonner";
import QRCode from "qrcode";
import { resolveTheme, type ThemeKey, type ThemeConfig } from "@/lib/themes";
import { ThemeDecor } from "@/components/ThemeDecor";
import { SectionRenderer } from "@/components/sections/SectionRenderer";
import { getInvitationBySlug, incrementViews, type Invitation } from "@/lib/invitations";
import { t, dirFor, isRTL, type Lang } from "@/lib/i18n";
import { ThemeInvitationOpener } from "@/components/immersive/ThemeInvitationOpener";
import { resolveSectionTransitionVariant } from "@/lib/animations";
import { StaggeredReveal, StaggeredSection } from "@/components/immersive/openers/StaggeredReveal";
import { ParticleField } from "@/components/immersive/ParticleField";
import { SmoothScroll } from "@/components/immersive/SmoothScroll";
import { AmbientBackground } from "@/components/immersive/AmbientBackground";
import { MagneticButton } from "@/components/immersive/MagneticButton";
import { TunisianFrame, WaxSeal } from "@/components/immersive/TunisianOrnaments";
import { ThemedAmbient } from "@/components/immersive/ThemedAmbient";
import { InviteMusicPlayer } from "@/components/immersive/InviteMusicPlayer";
import { WelcomeSplash } from "@/components/immersive/WelcomeSplash";
import { StoryModeShell, StorySections, StorySlide, useStoryMode } from "@/components/immersive/StoryMode";

export const Route = createFileRoute("/invite/$slug")({
  ssr: false,
  loader: async ({ params }) => {
    const inv = await getInvitationBySlug(params.slug);
    if (!inv) throw notFound();
    return { invitation: inv };
  },
  head: ({ loaderData }) => ({
    meta: loaderData
      ? [
          { title: `${loaderData.invitation.event_name} — Invitation` },
          { name: "description", content: `${loaderData.invitation.hosts} — ${loaderData.invitation.location}` },
          { property: "og:title", content: loaderData.invitation.event_name },
          { property: "og:description", content: `${loaderData.invitation.hosts} — ${loaderData.invitation.location}` },
          ...(loaderData.invitation.image_url ? [{ property: "og:image", content: loaderData.invitation.image_url }] : []),
        ]
      : [],
  }),
  notFoundComponent: () => (
    <div className="min-h-screen flex items-center justify-center bg-background p-6 text-center">
      <div>
        <h1 className="font-serif text-4xl">Invitation introuvable</h1>
        <p className="mt-2 text-muted-foreground">Le lien est peut-être expiré ou incorrect.</p>
        <Link to="/" className="mt-6 inline-block text-sm underline">Retour</Link>
      </div>
    </div>
  ),
  errorComponent: () => (
    <div className="min-h-screen flex items-center justify-center bg-background p-6 text-center">
      <div>
        <h1 className="font-serif text-4xl">Invitation non disponible</h1>
        <p className="mt-2 text-muted-foreground">Cette invitation n&apos;est plus accessible. Sa durée de publication est expirée.</p>
        <Link to="/" className="mt-6 inline-block text-sm underline">Retour</Link>
      </div>
    </div>
  ),
  component: InvitePage,
});

function InvitePage() {
  const { invitation } = Route.useLoaderData() as { invitation: Invitation };
  const theme = resolveTheme(invitation.theme as ThemeKey, invitation.subtheme);
  const themeKey = invitation.theme as ThemeKey;
  const lang = invitation.language ?? "fr";
  const dir = dirFor(lang);
  const rtl = isRTL(lang);
  const [contentReady, setContentReady] = useState(false);
  const [welcomeDone, setWelcomeDone] = useState(!invitation.animation_settings?.welcomeMessage);
  const { storyMode, setStoryMode } = useStoryMode(invitation.animation_settings?.storyMode ?? false);
  const sectionTransitionVariant = (() => {
    const v = resolveSectionTransitionVariant(invitation.animation_settings);
    return v === "theme" ? undefined : v;
  })();

  useEffect(() => { incrementViews(invitation.slug); }, [invitation.slug]);

  useEffect(() => {
    try {
      if (sessionStorage.getItem(`velon:opened:${invitation.slug}`)) {
        setContentReady(true);
      }
    } catch {
      setContentReady(true);
    }
  }, [invitation.slug]);

  return (
    <SmoothScroll>
      <WelcomeSplash
        message={invitation.animation_settings?.welcomeMessage}
        onDone={() => setWelcomeDone(true)}
      />
      <div dir={dir} lang={lang === "ar" ? "ar" : lang === "en" ? "en" : "fr"} className={`relative min-h-dvh ${theme.pageBg} ${theme.pageText} ${rtl ? "font-arabic" : theme.font} overflow-x-hidden`}>
        {welcomeDone && (
        <>
        <ThemeInvitationOpener
          themeKey={themeKey}
          theme={theme}
          title={invitation.event_name}
          hosts={invitation.hosts}
          lang={lang}
          storageKey={`velon:opened:${invitation.slug}`}
          animationSettings={invitation.animation_settings}
          onReady={() => setContentReady(true)}
        />
        <ThemeDecor theme={theme} />
        <AmbientBackground theme={theme} />
        <ThemedAmbient theme={theme} />
        <ParticleField color={theme.decor === "particles" || theme.decor === "arabesque" ? "#d4af37" : "#ffffff"} />
        {invitation.theme === "tunisian" && <TunisianFrame />}

        <InviteMusicPlayer settings={invitation.animation_settings} />

        <StoryModeShell
          enabled={storyMode}
          onToggle={setStoryMode}
          storyContent={
            <StorySections>
              {invitation.sections.map((s, i) => (
                <StorySlide key={s.id}>
                  <SectionRenderer section={s} theme={theme} index={i} lang={lang} sectionTransitionVariant={sectionTransitionVariant} />
                </StorySlide>
              ))}
              <StorySlide>
                <ShareBar theme={theme} eventName={invitation.event_name} lang={lang} slug={invitation.slug} />
              </StorySlide>
            </StorySections>
          }
          scrollContent={
        <StaggeredReveal ready={contentReady} className="relative z-10 mx-auto max-w-5xl px-4 sm:px-6 md:px-8 py-6 sm:py-8 md:py-12 safe-x">
          {invitation.sections.length === 0 ? (
            <div className="text-center py-20 opacity-70"><p className="text-sm">—</p></div>
          ) : (
            invitation.sections.map((s, i) => (
              <SectionRenderer key={s.id} section={s} theme={theme} index={i} lang={lang} sectionTransitionVariant={sectionTransitionVariant} />
            ))
          )}

          <StaggeredSection index={invitation.sections.length} ready={contentReady}>
            <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
              transition={{ duration: 0.7 }} className="mt-16">
              <ShareBar theme={theme} eventName={invitation.event_name} lang={lang} slug={invitation.slug} />
            </motion.div>
          </StaggeredSection>

          {invitation.theme === "tunisian" && (
            <StaggeredSection index={invitation.sections.length + 1} ready={contentReady}>
              <div className="mt-14 flex justify-center">
                <WaxSeal label={invitation.event_name?.[0]?.toUpperCase() ?? "V"} />
              </div>
            </StaggeredSection>
          )}

          <footer className="mt-16 sm:mt-20 pb-6 safe-bottom text-center">
            <Link to="/" className="inline-block min-h-11 px-4 py-2 text-xs uppercase tracking-[0.3em] opacity-40 hover:opacity-80 transition-opacity">{t(lang, "footerBrand")}</Link>
          </footer>
        </StaggeredReveal>
          }
        />
        </>
        )}
      </div>
    </SmoothScroll>
  );
}

function ShareBar({ theme, eventName, lang, slug }: { theme: ThemeConfig; eventName: string; lang: Lang; slug: string }) {
  const [showQr, setShowQr] = useState(false);
  const [qrUrl, setQrUrl] = useState<string | null>(null);
  const url = typeof window !== "undefined" ? window.location.href : "";

  async function openQr() {
    if (!qrUrl) {
      const dataUrl = await QRCode.toDataURL(url, { width: 480, margin: 2, color: { dark: "#000000", light: "#ffffff" } });
      setQrUrl(dataUrl);
    }
    setShowQr(true);
  }
  function copy() { navigator.clipboard.writeText(url); toast.success(t(lang, "linkCopied")); }
  function nativeShare() { if (navigator.share) navigator.share({ title: eventName, url }).catch(() => {}); else copy(); }
  function whatsapp() { window.open(`https://wa.me/?text=${encodeURIComponent(`${eventName} — ${url}`)}`, "_blank"); }
  function facebook() { window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, "_blank"); }
  function instagramHint() {
    copy();
    toast.message(lang === "ar" ? "انسخ الرابط وألصقه في ستوري إنستغرام" : "Lien copié — collez-le dans votre story Instagram");
  }

  const shortUrl = url.replace(/^https?:\/\//, "");

  return (
    <>
      <div className={`rounded-3xl border ${theme.border} ${theme.surface} p-4 sm:p-6`}>
        <p className={`text-center ${isRTL(lang) ? "font-arabic text-sm" : "text-xs sm:text-sm uppercase tracking-[0.2em] sm:tracking-[0.3em]"} ${theme.accent} mb-4`}>{t(lang, "share")}</p>
        {shortUrl && (
          <p className="text-center text-[11px] opacity-50 mb-3 truncate px-2" dir="ltr">{shortUrl}</p>
        )}
        <div className="grid grid-cols-2 sm:grid-cols-3 justify-center gap-2">
          <Btn theme={theme} onClick={nativeShare} icon={<Share2 className="size-4" />} label={t(lang, "share")} />
          <Btn theme={theme} onClick={copy} icon={<Copy className="size-4" />} label={t(lang, "copy")} />
          <Btn theme={theme} onClick={whatsapp} icon={<MessageCircle className="size-4" />} label={t(lang, "whatsapp")} />
          <Btn theme={theme} onClick={facebook} icon={<Facebook className="size-4" />} label="Facebook" />
          <Btn theme={theme} onClick={instagramHint} icon={<Instagram className="size-4" />} label="Instagram" />
          <Btn theme={theme} onClick={openQr} icon={<QrCode className="size-4" />} label={t(lang, "qrcode")} />
        </div>
      </div>

      <AnimatePresence>
        {showQr && qrUrl && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={() => setShowQr(false)}
            className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/70 backdrop-blur-md p-0 sm:p-6">
            <motion.div initial={{ y: "100%", opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: "100%", opacity: 0 }}
              transition={{ type: "spring", stiffness: 280, damping: 28 }} onClick={(e) => e.stopPropagation()}
              className="rounded-t-3xl sm:rounded-3xl bg-white p-6 sm:p-8 max-w-sm w-full text-center safe-bottom">
              <img src={qrUrl} alt="QR Code" className="mx-auto rounded-xl max-w-[min(100%,280px)]" />
              <p className="mt-4 text-xs uppercase tracking-widest text-neutral-500">{t(lang, "scanToOpen")}</p>
              <button onClick={() => setShowQr(false)} className="mt-4 min-h-11 px-6 text-sm text-neutral-700 underline touch-target">{t(lang, "close")}</button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

function Btn({ onClick, icon, label, theme }: { onClick: () => void; icon: React.ReactNode; label: string; theme: ThemeConfig }) {
  const [isCoarse, setIsCoarse] = useState(false);
  useEffect(() => {
    setIsCoarse(window.matchMedia("(pointer: coarse)").matches);
  }, []);

  const className = `inline-flex items-center justify-center gap-2 rounded-full border ${theme.border} min-h-11 px-4 sm:px-5 py-2.5 text-sm font-medium transition-colors hover:bg-white/10 w-full sm:w-auto`;

  if (isCoarse) {
    return (
      <button type="button" onClick={onClick} className={className}>
        {icon} <span className="truncate">{label}</span>
      </button>
    );
  }

  return (
    <MagneticButton onClick={onClick} className={className}>
      {icon} <span className="truncate">{label}</span>
    </MagneticButton>
  );
}
