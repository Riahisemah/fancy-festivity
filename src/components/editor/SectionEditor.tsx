// Éditeur de section : un formulaire compact pour chaque type.
import { useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import type { Section } from "@/lib/sections";

type Props = {
  section: Section;
  onChange: (s: Section) => void;
};

export function SectionEditor({ section, onChange }: Props) {
  switch (section.kind) {
    case "hero":       return <HeroEditor s={section} onChange={onChange} />;
    case "event":      return <EventEditor s={section} onChange={onChange} />;
    case "timeline":   return <TimelineEditor s={section} onChange={onChange} />;
    case "card":       return <CardEditor s={section} onChange={onChange} />;
    case "gallery":    return <GalleryEditor s={section} onChange={onChange} />;
    case "image-text": return <ImageTextEditor s={section} onChange={onChange} />;
    case "map":        return <MapEditor s={section} onChange={onChange} />;
    case "program":    return <ProgramEditor s={section} onChange={onChange} />;
    case "quote":      return <QuoteEditor s={section} onChange={onChange} />;
    case "countdown":  return <CountdownEditor s={section} onChange={onChange} />;
    case "contact":    return <ContactEditor s={section} onChange={onChange} />;
    case "faq":        return <FaqEditor s={section} onChange={onChange} />;
  }
}

/* ---------- shared UI ---------- */
const input = "w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-accent/40 transition";
const label = "block text-[10px] uppercase tracking-widest text-muted-foreground mb-1.5";

function Field({ label: lbl, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className={label}>{lbl}</label>
      {children}
    </div>
  );
}

function MiniBtn({ children, onClick, danger }: { children: React.ReactNode; onClick: () => void; danger?: boolean }) {
  return (
    <button type="button" onClick={onClick}
      className={`inline-flex items-center gap-1 rounded-md border border-border px-2 py-1 text-[11px] hover:bg-muted transition ${danger ? "text-destructive hover:bg-destructive/10" : ""}`}>
      {children}
    </button>
  );
}

/* ---------- HERO ---------- */
function HeroEditor({ s, onChange }: { s: Extract<Section, { kind: "hero" }>; onChange: (s: Section) => void }) {
  const set = <K extends keyof typeof s>(k: K, v: (typeof s)[K]) => onChange({ ...s, [k]: v });
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
      <Field label="Eyebrow"><input className={input} value={s.eyebrow ?? ""} onChange={(e) => set("eyebrow", e.target.value)} /></Field>
      <Field label="Titre"><input className={input} value={s.title} onChange={(e) => set("title", e.target.value)} /></Field>
      <Field label="Sous-titre"><input className={input} value={s.subtitle ?? ""} onChange={(e) => set("subtitle", e.target.value)} /></Field>
      <Field label="Image (URL)"><input className={input} value={s.imageUrl ?? ""} onChange={(e) => set("imageUrl", e.target.value)} /></Field>
      <Field label="Date"><input type="datetime-local" className={input} value={toLocalInput(s.date)} onChange={(e) => set("date", e.target.value)} /></Field>
      <Field label="Lieu"><input className={input} value={s.location ?? ""} onChange={(e) => set("location", e.target.value)} /></Field>
    </div>
  );
}

/* ---------- EVENT ---------- */
function EventEditor({ s, onChange }: { s: Extract<Section, { kind: "event" }>; onChange: (s: Section) => void }) {
  const set = <K extends keyof typeof s>(k: K, v: (typeof s)[K]) => onChange({ ...s, [k]: v });
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
      <Field label="Icône (emoji)"><input className={input} value={s.icon ?? ""} onChange={(e) => set("icon", e.target.value)} /></Field>
      <Field label="Titre"><input className={input} value={s.title} onChange={(e) => set("title", e.target.value)} /></Field>
      <Field label="Date"><input type="date" className={input} value={s.date ?? ""} onChange={(e) => set("date", e.target.value)} /></Field>
      <Field label="Heure"><input type="time" className={input} value={s.time ?? ""} onChange={(e) => set("time", e.target.value)} /></Field>
      <div className="md:col-span-2"><Field label="Lieu"><input className={input} value={s.location ?? ""} onChange={(e) => set("location", e.target.value)} /></Field></div>
      <div className="md:col-span-2"><Field label="Description"><textarea rows={3} className={input} value={s.description ?? ""} onChange={(e) => set("description", e.target.value)} /></Field></div>
    </div>
  );
}

/* ---------- TIMELINE ---------- */
function TimelineEditor({ s, onChange }: { s: Extract<Section, { kind: "timeline" }>; onChange: (s: Section) => void }) {
  const updateItem = (i: number, patch: Partial<(typeof s.items)[number]>) => {
    const items = s.items.map((it, idx) => (idx === i ? { ...it, ...patch } : it));
    onChange({ ...s, items });
  };
  return (
    <div className="space-y-3">
      <Field label="Titre"><input className={input} value={s.title ?? ""} onChange={(e) => onChange({ ...s, title: e.target.value })} /></Field>
      <div className="space-y-2">
        {s.items.map((it, i) => (
          <div key={i} className="grid grid-cols-12 gap-2 items-start rounded-lg border border-border p-2">
            <input className={`${input} col-span-3`} placeholder="15:00" value={it.time} onChange={(e) => updateItem(i, { time: e.target.value })} />
            <input className={`${input} col-span-4`} placeholder="Étape" value={it.label} onChange={(e) => updateItem(i, { label: e.target.value })} />
            <input className={`${input} col-span-4`} placeholder="Description" value={it.description ?? ""} onChange={(e) => updateItem(i, { description: e.target.value })} />
            <div className="col-span-1 flex justify-end">
              <MiniBtn danger onClick={() => onChange({ ...s, items: s.items.filter((_, idx) => idx !== i) })}><Trash2 className="size-3" /></MiniBtn>
            </div>
          </div>
        ))}
      </div>
      <MiniBtn onClick={() => onChange({ ...s, items: [...s.items, { time: "", label: "", description: "" }] })}>
        <Plus className="size-3" /> Ajouter une étape
      </MiniBtn>
    </div>
  );
}

/* ---------- CARD ---------- */
function CardEditor({ s, onChange }: { s: Extract<Section, { kind: "card" }>; onChange: (s: Section) => void }) {
  return (
    <div className="space-y-3">
      <Field label="Titre"><input className={input} value={s.title} onChange={(e) => onChange({ ...s, title: e.target.value })} /></Field>
      <Field label="Texte"><textarea rows={4} className={input} value={s.body} onChange={(e) => onChange({ ...s, body: e.target.value })} /></Field>
    </div>
  );
}

/* ---------- GALLERY ---------- */
function GalleryEditor({ s, onChange }: { s: Extract<Section, { kind: "gallery" }>; onChange: (s: Section) => void }) {
  const [draft, setDraft] = useState("");
  return (
    <div className="space-y-3">
      <Field label="Titre"><input className={input} value={s.title ?? ""} onChange={(e) => onChange({ ...s, title: e.target.value })} /></Field>
      <div className="flex gap-2">
        <input className={input} placeholder="URL d'image…" value={draft} onChange={(e) => setDraft(e.target.value)} />
        <MiniBtn onClick={() => { if (draft) { onChange({ ...s, images: [...s.images, draft] }); setDraft(""); } }}>
          <Plus className="size-3" /> Ajouter
        </MiniBtn>
      </div>
      {!!s.images.length && (
        <div className="grid grid-cols-3 md:grid-cols-4 gap-2">
          {s.images.map((src, i) => (
            <div key={i} className="relative aspect-square overflow-hidden rounded-lg border border-border">
              <img src={src} alt="" className="w-full h-full object-cover" />
              <button type="button" onClick={() => onChange({ ...s, images: s.images.filter((_, idx) => idx !== i) })}
                className="absolute top-1 right-1 rounded-md bg-black/60 text-white p-1">
                <Trash2 className="size-3" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* ---------- IMAGE + TEXT ---------- */
function ImageTextEditor({ s, onChange }: { s: Extract<Section, { kind: "image-text" }>; onChange: (s: Section) => void }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
      <Field label="Titre"><input className={input} value={s.title} onChange={(e) => onChange({ ...s, title: e.target.value })} /></Field>
      <Field label="Image (URL)"><input className={input} value={s.imageUrl} onChange={(e) => onChange({ ...s, imageUrl: e.target.value })} /></Field>
      <div className="md:col-span-2"><Field label="Texte"><textarea rows={4} className={input} value={s.body} onChange={(e) => onChange({ ...s, body: e.target.value })} /></Field></div>
      <label className="md:col-span-2 inline-flex items-center gap-2 text-xs text-muted-foreground">
        <input type="checkbox" checked={!!s.reverse} onChange={(e) => onChange({ ...s, reverse: e.target.checked })} />
        Inverser image / texte
      </label>
    </div>
  );
}

/* ---------- MAP ---------- */
function MapEditor({ s, onChange }: { s: Extract<Section, { kind: "map" }>; onChange: (s: Section) => void }) {
  return (
    <div className="space-y-3">
      <Field label="Titre"><input className={input} value={s.title ?? ""} onChange={(e) => onChange({ ...s, title: e.target.value })} /></Field>
      <Field label="Adresse"><input className={input} value={s.address} onChange={(e) => onChange({ ...s, address: e.target.value })} /></Field>
      <Field label="URL d'embed (optionnel)"><input className={input} value={s.embedUrl ?? ""} onChange={(e) => onChange({ ...s, embedUrl: e.target.value })} /></Field>
    </div>
  );
}

/* ---------- PROGRAM ---------- */
function ProgramEditor({ s, onChange }: { s: Extract<Section, { kind: "program" }>; onChange: (s: Section) => void }) {
  const updateItem = (i: number, patch: Partial<(typeof s.items)[number]>) => {
    onChange({ ...s, items: s.items.map((it, idx) => (idx === i ? { ...it, ...patch } : it)) });
  };
  return (
    <div className="space-y-3">
      <Field label="Titre"><input className={input} value={s.title ?? ""} onChange={(e) => onChange({ ...s, title: e.target.value })} /></Field>
      <div className="space-y-2">
        {s.items.map((it, i) => (
          <div key={i} className="grid grid-cols-12 gap-2 items-center">
            <input className={`${input} col-span-3`} placeholder="16:00" value={it.time} onChange={(e) => updateItem(i, { time: e.target.value })} />
            <input className={`${input} col-span-8`} placeholder="Libellé" value={it.label} onChange={(e) => updateItem(i, { label: e.target.value })} />
            <div className="col-span-1 flex justify-end">
              <MiniBtn danger onClick={() => onChange({ ...s, items: s.items.filter((_, idx) => idx !== i) })}><Trash2 className="size-3" /></MiniBtn>
            </div>
          </div>
        ))}
      </div>
      <MiniBtn onClick={() => onChange({ ...s, items: [...s.items, { time: "", label: "" }] })}>
        <Plus className="size-3" /> Ajouter
      </MiniBtn>
    </div>
  );
}

/* ---------- QUOTE ---------- */
function QuoteEditor({ s, onChange }: { s: Extract<Section, { kind: "quote" }>; onChange: (s: Section) => void }) {
  return (
    <div className="space-y-3">
      <Field label="Texte"><textarea rows={3} className={input} value={s.text} onChange={(e) => onChange({ ...s, text: e.target.value })} /></Field>
      <Field label="Auteur"><input className={input} value={s.author ?? ""} onChange={(e) => onChange({ ...s, author: e.target.value })} /></Field>
    </div>
  );
}

/* ---------- COUNTDOWN ---------- */
function CountdownEditor({ s, onChange }: { s: Extract<Section, { kind: "countdown" }>; onChange: (s: Section) => void }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
      <Field label="Date cible">
        <input type="datetime-local" className={input}
          value={toLocalInput(s.targetDate)}
          onChange={(e) => onChange({ ...s, targetDate: new Date(e.target.value).toISOString() })} />
      </Field>
      <Field label="Légende"><input className={input} value={s.label ?? ""} onChange={(e) => onChange({ ...s, label: e.target.value })} /></Field>
    </div>
  );
}

/* ---------- CONTACT ---------- */
function ContactEditor({ s, onChange }: { s: Extract<Section, { kind: "contact" }>; onChange: (s: Section) => void }) {
  const updateItem = (i: number, patch: Partial<(typeof s.items)[number]>) => {
    onChange({ ...s, items: s.items.map((it, idx) => (idx === i ? { ...it, ...patch } : it)) });
  };
  return (
    <div className="space-y-3">
      <Field label="Titre"><input className={input} value={s.title ?? ""} onChange={(e) => onChange({ ...s, title: e.target.value })} /></Field>
      <div className="space-y-2">
        {s.items.map((it, i) => (
          <div key={i} className="grid grid-cols-12 gap-2">
            <input className={`${input} col-span-3`} placeholder="Libellé" value={it.label} onChange={(e) => updateItem(i, { label: e.target.value })} />
            <input className={`${input} col-span-5`} placeholder="Valeur" value={it.value} onChange={(e) => updateItem(i, { value: e.target.value })} />
            <select className={`${input} col-span-3`} value={it.type ?? "link"} onChange={(e) => updateItem(i, { type: e.target.value as "phone" | "email" | "link" })}>
              <option value="phone">Téléphone</option>
              <option value="email">Email</option>
              <option value="link">Lien</option>
            </select>
            <div className="col-span-1 flex justify-end">
              <MiniBtn danger onClick={() => onChange({ ...s, items: s.items.filter((_, idx) => idx !== i) })}><Trash2 className="size-3" /></MiniBtn>
            </div>
          </div>
        ))}
      </div>
      <MiniBtn onClick={() => onChange({ ...s, items: [...s.items, { label: "", value: "", type: "link" }] })}>
        <Plus className="size-3" /> Ajouter
      </MiniBtn>
    </div>
  );
}

/* ---------- FAQ ---------- */
function FaqEditor({ s, onChange }: { s: Extract<Section, { kind: "faq" }>; onChange: (s: Section) => void }) {
  const updateItem = (i: number, patch: Partial<(typeof s.items)[number]>) => {
    onChange({ ...s, items: s.items.map((it, idx) => (idx === i ? { ...it, ...patch } : it)) });
  };
  return (
    <div className="space-y-3">
      <Field label="Titre"><input className={input} value={s.title ?? ""} onChange={(e) => onChange({ ...s, title: e.target.value })} /></Field>
      <div className="space-y-2">
        {s.items.map((it, i) => (
          <div key={i} className="space-y-2 rounded-lg border border-border p-2">
            <div className="flex gap-2">
              <input className={input} placeholder="Question" value={it.q} onChange={(e) => updateItem(i, { q: e.target.value })} />
              <MiniBtn danger onClick={() => onChange({ ...s, items: s.items.filter((_, idx) => idx !== i) })}><Trash2 className="size-3" /></MiniBtn>
            </div>
            <textarea rows={2} className={input} placeholder="Réponse" value={it.a} onChange={(e) => updateItem(i, { a: e.target.value })} />
          </div>
        ))}
      </div>
      <MiniBtn onClick={() => onChange({ ...s, items: [...s.items, { q: "", a: "" }] })}>
        <Plus className="size-3" /> Ajouter
      </MiniBtn>
    </div>
  );
}

function toLocalInput(iso?: string) {
  if (!iso) return "";
  try {
    const d = new Date(iso);
    if (isNaN(d.getTime())) return "";
    const pad = (n: number) => String(n).padStart(2, "0");
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
  } catch { return ""; }
}
