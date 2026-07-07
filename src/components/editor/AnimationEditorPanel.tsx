import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Play } from "lucide-react";
import type { ThemeKey, ThemeConfig } from "@/lib/themes";
import type { Lang } from "@/lib/i18n";
import {
  OPENER_ANIMATIONS,
  SECTION_TRANSITIONS,
  getOpenerAnimation,
  isOpenerCompatibleWithTheme,
  type InvitationAnimationSettings,
  type OpenerAnimationId,
  type SectionTransitionId,
  type AnimationParams,
} from "@/lib/animations";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { OpenerPreviewModal } from "./OpenerPreviewModal";

const INTENSITY_LABEL = { soft: "Doux", medium: "Modéré", intense: "Intense" } as const;

type Props = {
  settings: InvitationAnimationSettings;
  onChange: (next: InvitationAnimationSettings) => void;
  themeKey: ThemeKey;
  theme: ThemeConfig;
  title: string;
  hosts?: string;
  lang: Lang;
  persistWarning?: boolean;
};

export function AnimationEditorPanel({ settings, onChange, themeKey, theme, title, hosts, lang, persistWarning }: Props) {
  const [showPreview, setShowPreview] = useState(false);
  const [tab, setTab] = useState<"elegant" | "modern">("elegant");
  const [showAdvanced, setShowAdvanced] = useState(false);

  const openers = useMemo(
    () => OPENER_ANIMATIONS.filter((a) => a.category === tab || a.id === "auto"),
    [tab],
  );

  function patchParams(partial: Partial<AnimationParams>) {
    onChange({ ...settings, params: { ...settings.params, ...partial } });
  }

  const selected = getOpenerAnimation(settings.openerId);

  return (
    <>
      <div className="rounded-2xl border border-border bg-card p-4 space-y-4">
        <div className="flex items-center justify-between gap-2">
          <div>
            <div className="text-[10px] uppercase tracking-widest text-muted-foreground">Animations</div>
            <h3 className="font-serif text-lg mt-0.5">Ouverture & transitions</h3>
          </div>
          <button
            type="button"
            onClick={() => setShowPreview(true)}
            className="inline-flex items-center gap-1.5 rounded-full bg-primary text-primary-foreground px-3 py-1.5 text-xs font-medium hover:opacity-90 shrink-0"
          >
            <Play className="size-3.5" /> Aperçu
          </button>
        </div>

        {persistWarning && (
          <div className="rounded-xl border border-amber-500/40 bg-amber-500/10 px-3 py-2.5 text-[11px] text-amber-900 dark:text-amber-200 leading-relaxed">
            Les animations ne peuvent pas encore être enregistrées en base. Exécutez la migration Supabase{" "}
            <code className="text-[10px] bg-background/60 px-1 py-0.5 rounded">20260706220000_animation_settings.sql</code>{" "}
            dans le SQL Editor de votre projet, puis rechargez cette page.
          </div>
        )}

        {/* Opener gallery */}
        <div>
          <div className="flex gap-1 mb-3">
            {(["elegant", "modern"] as const).map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => setTab(c)}
                className={`flex-1 rounded-lg py-1.5 text-[11px] font-medium transition ${
                  tab === c ? "bg-accent/10 text-foreground border border-accent/30" : "text-muted-foreground hover:bg-muted"
                }`}
              >
                {c === "elegant" ? "✨ Élégantes" : "🚀 Modernes"}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-2 gap-2 max-h-[280px] overflow-y-auto pr-1">
            {openers.map((anim) => {
              const compatible = isOpenerCompatibleWithTheme(anim, themeKey);
              const active = settings.openerId === anim.id;
              return (
                <button
                  key={anim.id}
                  type="button"
                  onClick={() => onChange({ ...settings, openerId: anim.id })}
                  className={`relative rounded-xl border p-3 text-left transition ${
                    active ? "border-accent bg-accent/5 ring-1 ring-accent/40" : "border-border hover:border-accent/40 hover:bg-muted/50"
                  } ${!compatible ? "opacity-60" : ""}`}
                >
                  <OpenerThumb emoji={anim.emoji} id={anim.id} active={active} />
                  <div className="mt-2 font-medium text-xs leading-tight">{anim.nameFr}</div>
                  <div className="mt-1 flex items-center gap-1.5">
                    <span className="text-[9px] uppercase tracking-wider px-1.5 py-0.5 rounded-full bg-muted text-muted-foreground">
                      {INTENSITY_LABEL[anim.intensity]}
                    </span>
                    {!compatible && (
                      <span className="text-[9px] text-amber-600">Hors thème</span>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
          <p className="mt-2 text-[11px] text-muted-foreground leading-relaxed">{selected.description}</p>
        </div>

        {/* Section transitions */}
        <div>
          <div className="text-[10px] uppercase tracking-widest text-muted-foreground mb-2">Transitions entre sections</div>
          <div className="flex flex-wrap gap-1.5">
            {SECTION_TRANSITIONS.map((tr) => (
              <button
                key={tr.id}
                type="button"
                onClick={() => onChange({ ...settings, sectionTransitionId: tr.id as SectionTransitionId })}
                className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-[11px] transition ${
                  settings.sectionTransitionId === tr.id
                    ? "border-accent bg-accent/10"
                    : "border-border hover:bg-muted"
                }`}
              >
                <span>{tr.emoji}</span>
                <span>{tr.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Advanced params */}
        <div>
          <button
            type="button"
            onClick={() => setShowAdvanced((v) => !v)}
            className="text-xs text-muted-foreground hover:text-foreground underline underline-offset-2"
          >
            {showAdvanced ? "Masquer les paramètres avancés" : "Paramètres avancés"}
          </button>
          {showAdvanced && (
            <div className="mt-3 space-y-4 rounded-xl border border-border bg-background/50 p-3">
              <ParamSlider label="Vitesse" value={settings.params.speed} min={0.5} max={2} step={0.1}
                format={(v) => `${v.toFixed(1)}×`} onChange={(v) => patchParams({ speed: v })} />
              <ParamSlider label="Intensité" value={settings.params.intensity} min={0} max={100} step={5}
                format={(v) => `${v}%`} onChange={(v) => patchParams({ intensity: v })} />
              <ParamSlider label="Durée" value={settings.params.durationMs} min={1200} max={5000} step={100}
                format={(v) => `${(v / 1000).toFixed(1)}s`} onChange={(v) => patchParams({ durationMs: v })} />
              <ParamSlider label="Particules" value={settings.params.particleLevel} min={0} max={100} step={5}
                format={(v) => `${v}%`} onChange={(v) => patchParams({ particleLevel: v })} />
              <ParamSlider label="Profondeur 3D" value={settings.params.depth3d} min={0} max={100} step={5}
                format={(v) => `${v}%`} onChange={(v) => patchParams({ depth3d: v })} />
              <ToggleRow label="Effets lumineux" checked={settings.params.lightEffects}
                onCheckedChange={(v) => patchParams({ lightEffects: v })} />
              <ToggleRow label="Effets caméra" checked={settings.params.cameraEffects}
                onCheckedChange={(v) => patchParams({ cameraEffects: v })} />
            </div>
          )}
        </div>
      </div>

      <OpenerPreviewModal
        open={showPreview}
        onClose={() => setShowPreview(false)}
        settings={settings}
        themeKey={themeKey}
        theme={theme}
        title={title}
        hosts={hosts}
        lang={lang}
      />
    </>
  );
}

function OpenerThumb({ emoji, id, active }: { emoji: string; id: OpenerAnimationId; active: boolean }) {
  return (
    <div className="relative h-14 rounded-lg overflow-hidden bg-muted/60 flex items-center justify-center">
      <motion.span
        animate={active ? { scale: [1, 1.15, 1], rotate: [0, 5, -5, 0] } : { scale: 1 }}
        transition={{ duration: 2, repeat: active ? Infinity : 0, repeatDelay: 0.5 }}
        className="text-2xl relative z-10"
      >
        {emoji}
      </motion.span>
      <motion.div
        className="absolute inset-0 opacity-40"
        style={{
          background: thumbGradient(id),
        }}
        animate={active ? { opacity: [0.3, 0.6, 0.3] } : { opacity: 0.25 }}
        transition={{ duration: 1.8, repeat: Infinity }}
      />
      {active && (
        <span className="absolute top-1 right-1 size-2 rounded-full bg-emerald-500 ring-2 ring-background" />
      )}
    </div>
  );
}

function thumbGradient(id: OpenerAnimationId): string {
  const map: Partial<Record<OpenerAnimationId, string>> = {
    envelope: "linear-gradient(135deg, #8b6914, #f5e6c8)",
    curtain: "linear-gradient(180deg, #4a1020, #d4af37)",
    "luxury-reveal": "radial-gradient(circle, #d4af37, #1a1208)",
    portal: "radial-gradient(circle, #6366f1, #0f172a)",
    "card-3d": "linear-gradient(160deg, #334155, #94a3b8)",
  };
  return map[id] ?? "linear-gradient(135deg, hsl(var(--accent)/0.4), hsl(var(--primary)/0.2))";
}

function ParamSlider({
  label, value, min, max, step, format, onChange,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  format: (v: number) => string;
  onChange: (v: number) => void;
}) {
  return (
    <div>
      <div className="flex justify-between text-[11px] mb-1.5">
        <span className="text-muted-foreground">{label}</span>
        <span className="font-medium tabular-nums">{format(value)}</span>
      </div>
      <Slider value={[value]} min={min} max={max} step={step} onValueChange={([v]) => onChange(v)} />
    </div>
  );
}

function ToggleRow({
  label, checked, onCheckedChange,
}: {
  label: string;
  checked: boolean;
  onCheckedChange: (v: boolean) => void;
}) {
  return (
    <div className="flex items-center justify-between gap-3">
      <span className="text-[11px] text-muted-foreground">{label}</span>
      <Switch checked={checked} onCheckedChange={onCheckedChange} />
    </div>
  );
}
