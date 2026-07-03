// Page publique : rend les sections dynamiques de l'invitation.
import { createFileRoute, notFound, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Share2, Copy, MessageCircle, QrCode } from "lucide-react";
import { toast } from "sonner";
import QRCode from "qrcode";
import { resolveTheme, type ThemeKey, type ThemeConfig } from "@/lib/themes";
import { ThemeDecor } from "@/components/ThemeDecor";
import { SectionRenderer } from "@/components/sections/SectionRenderer";
import { getInvitationBySlug, incrementViews, type Invitation } from "@/lib/invitations";
import { t, dirFor, isRTL, type Lang } from "@/lib/i18n";
import { Cinematic3DOpener } from "@/components/immersive/Cinematic3DOpener";
import { ParticleField } from "@/components/immersive/ParticleField";
import { SmoothScroll } from "@/components/immersive/SmoothScroll";
import { AmbientBackground } from "@/components/immersive/AmbientBackground";
import { MagneticButton } from "@/components/immersive/MagneticButton";

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
        <p className="mt-2 text-muted-foreground">Le lien est peut-être expiré.</p>
        <Link to="/" className="mt-6 inline-block text-sm underline">Retour</Link>
      </div>
    </div>
  ),
  component: InvitePage,
});

function InvitePage() {
  const { invitation } = Route.useLoaderData() as { invitation: Invitation };
  const theme = resolveTheme(invitation.theme as ThemeKey, invitation.subtheme);
  const lang = invitation.language ?? "fr";
  const dir = dirFor(lang);
  const rtl = isRTL(lang);

  useEffect(() => { incrementViews(invitation.slug); }, [invitation.slug]);

  return (
    <SmoothScroll>
      <div dir={dir} className={`relative min-h-screen ${theme.pageBg} ${theme.pageText} ${rtl ? "font-arabic" : theme.font} overflow-x-hidden`}>
        <Cinematic3DOpener
          theme={theme}
          title={invitation.event_name}
          hosts={invitation.hosts}
          lang={lang}
          storageKey={`velon:opened:${invitation.slug}`}
        />
        <ThemeDecor theme={theme} />
        <AmbientBackground theme={theme} />
        <ParticleField color={theme.decor === "particles" || theme.decor === "arabesque" ? "#d4af37" : "#ffffff"} />

        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="relative z-10 mx-auto max-w-3xl px-6 py-12 md:py-20">
          {invitation.sections.length === 0 ? (
            <div className="text-center py-20 opacity-70"><p className="text-sm">—</p></div>
          ) : (
            invitation.sections.map((s, i) => (
              <SectionRenderer key={s.id} section={s} theme={theme} index={i} lang={lang} />
            ))
          )}

          <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            transition={{ duration: 0.7 }} className="mt-16">
            <ShareBar theme={theme} eventName={invitation.event_name} lang={lang} />
          </motion.div>

          <footer className="mt-20 text-center">
            <Link to="/" className="text-[10px] uppercase tracking-[0.3em] opacity-40 hover:opacity-80 transition-opacity">{t(lang, "footerBrand")}</Link>
          </footer>
        </motion.div>
      </div>
    </SmoothScroll>
  );
}

function ShareBar({ theme, eventName, lang }: { theme: ThemeConfig; eventName: string; lang: Lang }) {
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
  function whatsapp() { window.open(`https://wa.me/?text=${encodeURIComponent(`${eventName} — ${url}`)}`, "_blank"); }
  function nativeShare() { if (navigator.share) navigator.share({ title: eventName, url }).catch(() => {}); else copy(); }

  return (
    <>
      <div className={`rounded-3xl border ${theme.border} ${theme.surface} p-6`}>
        <p className={`text-center text-[10px] uppercase tracking-[0.3em] ${theme.accent} mb-4`}>{t(lang, "share")}</p>
        <div className="flex flex-wrap justify-center gap-2">
          <Btn theme={theme} onClick={nativeShare} icon={<Share2 className="size-3.5" />} label={t(lang, "share")} />
          <Btn theme={theme} onClick={copy} icon={<Copy className="size-3.5" />} label={t(lang, "copy")} />
          <Btn theme={theme} onClick={whatsapp} icon={<MessageCircle className="size-3.5" />} label={t(lang, "whatsapp")} />
          <Btn theme={theme} onClick={openQr} icon={<QrCode className="size-3.5" />} label={t(lang, "qrcode")} />
        </div>
      </div>

      <AnimatePresence>
        {showQr && qrUrl && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={() => setShowQr(false)}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md p-6">
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", stiffness: 260, damping: 24 }} onClick={(e) => e.stopPropagation()}
              className="rounded-3xl bg-white p-8 max-w-sm w-full text-center">
              <img src={qrUrl} alt="QR Code" className="mx-auto rounded-xl" />
              <p className="mt-4 text-xs uppercase tracking-widest text-neutral-500">{t(lang, "scanToOpen")}</p>
              <button onClick={() => setShowQr(false)} className="mt-4 text-sm text-neutral-700 underline">{t(lang, "close")}</button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

function Btn({ onClick, icon, label, theme }: { onClick: () => void; icon: React.ReactNode; label: string; theme: ThemeConfig }) {
  return (
    <MagneticButton
      onClick={onClick}
      className={`inline-flex items-center gap-2 rounded-full border ${theme.border} px-4 py-2.5 text-xs font-medium transition-colors hover:bg-white/10`}
    >
      {icon} {label}
    </MagneticButton>
  );
}
