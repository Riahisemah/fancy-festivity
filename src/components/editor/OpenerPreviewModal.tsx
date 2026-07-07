import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Monitor, RotateCcw, Smartphone, X } from "lucide-react";
import type { ThemeKey, ThemeConfig } from "@/lib/themes";
import type { Lang } from "@/lib/i18n";
import type { InvitationAnimationSettings } from "@/lib/animations";
import { getOpenerAnimation } from "@/lib/animations";
import { ThemeInvitationOpener } from "@/components/immersive/ThemeInvitationOpener";
import { ThemeDecor } from "@/components/ThemeDecor";

type Props = {
  open: boolean;
  onClose: () => void;
  settings: InvitationAnimationSettings;
  themeKey: ThemeKey;
  theme: ThemeConfig;
  title: string;
  hosts?: string;
  lang: Lang;
};

export function OpenerPreviewModal({
  open, onClose, settings, themeKey, theme, title, hosts, lang,
}: Props) {
  const [device, setDevice] = useState<"desktop" | "mobile">("desktop");
  const [replayKey, setReplayKey] = useState(0);

  useEffect(() => {
    if (open) setReplayKey((k) => k + 1);
  }, [open, settings.openerId, settings.params]);

  const meta = getOpenerAnimation(settings.openerId);

  if (!open) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[60] flex items-center justify-center bg-ink/60 backdrop-blur-sm p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.96, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.96, opacity: 0 }}
          transition={{ type: "spring", stiffness: 280, damping: 26 }}
          onClick={(e) => e.stopPropagation()}
          className="w-full max-w-5xl rounded-3xl bg-card ring-1 ring-border shadow-2xl overflow-hidden"
        >
          <div className="flex items-center justify-between gap-3 border-b border-border px-5 py-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl">{meta.emoji}</span>
                <h2 className="font-serif text-xl">{meta.nameFr}</h2>
              </div>
              <p className="text-xs text-muted-foreground mt-0.5">{meta.description}</p>
            </div>
            <div className="flex items-center gap-2">
              <div className="hidden sm:flex rounded-lg border border-border p-0.5">
                <DeviceBtn active={device === "desktop"} onClick={() => setDevice("desktop")} icon={Monitor} label="Desktop" />
                <DeviceBtn active={device === "mobile"} onClick={() => setDevice("mobile")} icon={Smartphone} label="Mobile" />
              </div>
              <button
                type="button"
                onClick={() => setReplayKey((k) => k + 1)}
                className="inline-flex items-center gap-1 rounded-lg border border-border px-2.5 py-1.5 text-xs hover:bg-muted"
              >
                <RotateCcw className="size-3.5" /> Rejouer
              </button>
              <button type="button" onClick={onClose} className="p-2 rounded-lg hover:bg-muted text-muted-foreground">
                <X className="size-4" />
              </button>
            </div>
          </div>

          <div className="p-5 bg-muted/30 flex justify-center min-h-[420px]">
            <div
              className={`relative rounded-2xl overflow-hidden shadow-2xl ring-1 ring-border transition-all duration-300 ${
                device === "mobile" ? "w-[320px] h-[580px]" : "w-full max-w-3xl h-[480px]"
              }`}
            >
              <div
                key={replayKey}
                className={`relative h-full w-full ${theme.pageBg} ${theme.pageText} ${theme.font} overflow-hidden`}
              >
                <ThemeDecor theme={theme} />
                <ThemeInvitationOpener
                  themeKey={themeKey}
                  theme={theme}
                  title={title}
                  hosts={hosts}
                  lang={lang}
                  storageKey={`velon:preview:${replayKey}:${settings.openerId}`}
                  animationSettings={settings}
                  previewMode
                  autoPlay
                />
                <div className="absolute bottom-4 inset-x-0 text-center pointer-events-none">
                  <span className="text-[10px] uppercase tracking-widest opacity-40">
                    {device === "mobile" ? "Aperçu mobile" : "Aperçu desktop"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

function DeviceBtn({
  active, onClick, icon: Icon, label,
}: {
  active: boolean;
  onClick: () => void;
  icon: typeof Monitor;
  label: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`inline-flex items-center gap-1 rounded-md px-2.5 py-1.5 text-[11px] transition ${
        active ? "bg-accent/10 text-foreground" : "text-muted-foreground hover:bg-muted"
      }`}
    >
      <Icon className="size-3.5" /> {label}
    </button>
  );
}
