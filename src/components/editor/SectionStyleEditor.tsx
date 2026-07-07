import type { SectionStyle, FontFamilyKey, FontSizeKey } from "@/lib/section-style";
import { FONT_FAMILY_OPTIONS, FONT_SIZE_OPTIONS } from "@/lib/section-style";

const select = "w-full rounded-lg border border-border bg-background px-2.5 py-2 text-sm outline-none focus:ring-2 focus:ring-accent/40";
const label = "block text-[10px] uppercase tracking-widest text-muted-foreground mb-1";

type Props = {
  style?: SectionStyle;
  onChange: (style: SectionStyle) => void;
};

export function SectionStyleEditor({ style = {}, onChange }: Props) {
  const set = <K extends keyof SectionStyle>(key: K, value: SectionStyle[K]) => {
    onChange({ ...style, [key]: value || undefined });
  };

  const clear = () => onChange({});

  return (
    <div className="space-y-3 rounded-xl border border-border bg-muted/20 p-3">
      <div className="flex items-center justify-between">
        <span className="text-[10px] uppercase tracking-widest text-muted-foreground font-medium">Style visuel</span>
        <button type="button" onClick={clear} className="text-[10px] text-muted-foreground hover:text-foreground underline">
          Réinitialiser
        </button>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <div>
          <label className={label}>Couleur texte</label>
          <div className="flex gap-2">
            <input type="color" value={style.textColor ?? "#2a1f14"} onChange={(e) => set("textColor", e.target.value)}
              className="h-9 w-10 rounded border border-border cursor-pointer bg-transparent" />
            <input type="text" value={style.textColor ?? ""} placeholder="Auto"
              onChange={(e) => set("textColor", e.target.value || undefined)} className={select} />
          </div>
        </div>
        <div>
          <label className={label}>Couleur accent</label>
          <div className="flex gap-2">
            <input type="color" value={style.accentColor ?? "#a8884a"} onChange={(e) => set("accentColor", e.target.value)}
              className="h-9 w-10 rounded border border-border cursor-pointer bg-transparent" />
            <input type="text" value={style.accentColor ?? ""} placeholder="Auto"
              onChange={(e) => set("accentColor", e.target.value || undefined)} className={select} />
          </div>
        </div>
        <div className="col-span-2">
          <label className={label}>Fond de section</label>
          <div className="flex gap-2">
            <input type="color" value={style.backgroundColor ?? "#ffffff"} onChange={(e) => set("backgroundColor", e.target.value)}
              className="h-9 w-10 rounded border border-border cursor-pointer bg-transparent" />
            <input type="text" value={style.backgroundColor ?? ""} placeholder="Transparent"
              onChange={(e) => set("backgroundColor", e.target.value || undefined)} className={select} />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <div>
          <label className={label}>Taille titre</label>
          <select value={style.titleFontSize ?? ""} onChange={(e) => set("titleFontSize", (e.target.value || undefined) as FontSizeKey | undefined)} className={select}>
            <option value="">Auto</option>
            {FONT_SIZE_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
          </select>
        </div>
        <div>
          <label className={label}>Taille texte</label>
          <select value={style.bodyFontSize ?? ""} onChange={(e) => set("bodyFontSize", (e.target.value || undefined) as FontSizeKey | undefined)} className={select}>
            <option value="">Auto</option>
            {FONT_SIZE_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
          </select>
        </div>
        <div>
          <label className={label}>Police</label>
          <select value={style.fontFamily ?? "inherit"} onChange={(e) => set("fontFamily", e.target.value as FontFamilyKey)} className={select}>
            {FONT_FAMILY_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
          </select>
        </div>
        <div>
          <label className={label}>Alignement</label>
          <select value={style.textAlign ?? ""} onChange={(e) => set("textAlign", (e.target.value || undefined) as SectionStyle["textAlign"])} className={select}>
            <option value="">Auto</option>
            <option value="left">Gauche</option>
            <option value="center">Centre</option>
            <option value="right">Droite</option>
          </select>
        </div>
      </div>
    </div>
  );
}
