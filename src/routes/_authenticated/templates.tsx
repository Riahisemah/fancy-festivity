import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { motion } from "framer-motion";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Eye, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/lib/auth-context";
import { DashboardNav } from "@/components/dashboard/DashboardNav";
import { TemplatePreviewModal } from "@/components/templates/TemplatePreviewModal";
import type { Lang } from "@/lib/i18n";
import {
  TEMPLATE_CATALOG,
  TEMPLATE_CATEGORIES,
  materializeTemplate,
  type InvitationTemplate,
} from "@/lib/templates";
import { createInvitation } from "@/lib/invitations";
import { resolveTheme, SUBTHEMES } from "@/lib/themes";

export const Route = createFileRoute("/_authenticated/templates")({
  ssr: false,
  head: () => ({ meta: [{ title: "Templates — Vélon" }] }),
  component: TemplatesPage,
});

function TemplatesPage() {
  const { user, logout, subscription } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [preview, setPreview] = useState<InvitationTemplate | null>(null);
  const [category, setCategory] = useState<string>("all");

  const useMut = useMutation({
    mutationFn: async ({ template, language }: { template: InvitationTemplate; language: Lang }) => {
      const data = materializeTemplate(template, language);
      return createInvitation(user!.id, data, {
        publication_days: subscription?.default_publication_days ?? 30,
      });
    },
    onSuccess: (inv) => {
      toast.success("Invitation créée depuis le modèle");
      queryClient.invalidateQueries({ queryKey: ["invitations", user?.id] });
      setPreview(null);
      navigate({ to: "/editor/$id", params: { id: inv.id } });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const filtered = category === "all"
    ? TEMPLATE_CATALOG
    : TEMPLATE_CATALOG.filter((t) => t.category === category);

  return (
    <div className="min-h-screen bg-background">
      <DashboardNav
        email={user?.email}
        onSignOut={async () => { await logout(); navigate({ to: "/auth", replace: true }); }}
        onCreate={() => navigate({ to: "/dashboard", search: { create: true } })}
      />

      <main className="mx-auto max-w-7xl px-4 md:px-6 py-8 sm:py-10 pb-24 md:pb-10">
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="mb-10">
          <span className="text-[11px] uppercase tracking-[0.3em] text-accent inline-flex items-center gap-2">
            <Sparkles className="size-3.5" /> Templates prédéfinis
          </span>
          <h1 className="mt-3 font-serif text-4xl md:text-5xl tracking-tight">Invitations tunisiennes</h1>
          <p className="mt-2 text-sm text-muted-foreground max-w-2xl">
            Choisissez un modèle professionnel, personnalisez-le entièrement dans l'éditeur — textes, couleurs, sections, photos et typographie.
          </p>
        </motion.div>

        <div className="flex flex-wrap gap-2 mb-8">
          <FilterChip active={category === "all"} onClick={() => setCategory("all")} label="Tous" />
          {TEMPLATE_CATEGORIES.map((c) => (
            <FilterChip key={c.id} active={category === c.id} onClick={() => setCategory(c.id)} label={`${c.emoji} ${c.label}`} />
          ))}
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {filtered.map((template, i) => (
            <TemplateCard
              key={template.id}
              template={template}
              index={i}
              onPreview={() => setPreview(template)}
              onUse={() => useMut.mutate({ template, language: template.language })}
              loading={useMut.isPending && useMut.variables?.id === template.id}
            />
          ))}
        </div>
      </main>

      {preview && (
        <TemplatePreviewModal
          template={preview}
          onClose={() => setPreview(null)}
          onUse={(t, language) => useMut.mutate({ template: t, language })}
          using={useMut.isPending}
        />
      )}
    </div>
  );
}

function FilterChip({ active, onClick, label }: { active: boolean; onClick: () => void; label: string }) {
  return (
    <button onClick={onClick}
      className={`rounded-full border px-4 py-1.5 text-xs font-medium transition ${
        active ? "border-accent bg-accent/10 text-foreground" : "border-border text-muted-foreground hover:bg-muted"
      }`}>
      {label}
    </button>
  );
}

function TemplateCard({
  template, index, onPreview, onUse, loading,
}: {
  template: InvitationTemplate;
  index: number;
  onPreview: () => void;
  onUse: () => void;
  loading?: boolean;
}) {
  const theme = resolveTheme(template.theme, template.subtheme);
  const sub = SUBTHEMES[template.theme]?.find((s) => s.key === template.subtheme);

  return (
    <motion.article
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.03 }}
      whileHover={{ y: -4 }}
      className="group rounded-2xl border border-border bg-card overflow-hidden shadow-sm hover:shadow-xl transition-shadow"
    >
      <div
        className={`relative h-44 ${theme.pageBg} overflow-hidden`}
        style={{ background: `linear-gradient(135deg, ${template.colors.background} 0%, ${template.colors.primary}22 100%)` }}
      >
        <div className="absolute inset-0 flex flex-col items-center justify-center p-4 text-center">
          <span className="text-[10px] uppercase tracking-[0.3em] opacity-60" style={{ color: template.colors.text }}>
            {template.language === "ar" ? "دعوة" : template.language === "bilingual" ? "دعوة · Invitation" : "Invitation"}
          </span>
          <p className={`mt-2 font-serif text-lg leading-tight ${template.language === "ar" || template.language === "bilingual" ? "font-arabic-display" : ""}`}
            style={{ color: template.colors.text }}>
            {template.event_name.slice(0, 40)}
          </p>
          {sub && (
            <div className="mt-3 flex gap-1">
              {sub.swatches.slice(0, 4).map((c, i) => (
                <span key={i} className="size-3 rounded-full ring-1 ring-black/10" style={{ background: c }} />
              ))}
            </div>
          )}
        </div>
        <div className="absolute inset-x-0 bottom-0 h-12 bg-gradient-to-t from-black/20 to-transparent" />
      </div>

      <div className="p-4">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <h3 className="font-medium text-sm truncate">{template.name}</h3>
            <p className="text-[11px] text-muted-foreground mt-0.5">{template.style}</p>
          </div>
          <span className="shrink-0 text-[10px] uppercase tracking-wider text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
            {TEMPLATE_CATEGORIES.find((c) => c.id === template.category)?.label ?? template.category}
          </span>
        </div>
        <p className="mt-2 text-[11px] text-muted-foreground">{template.sections.length} sections · {template.tags.join(" · ")}</p>
        <div className="mt-4 flex gap-2">
          <button onClick={onPreview}
            className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-lg border border-border py-2 text-xs font-medium hover:bg-muted transition">
            <Eye className="size-3.5" /> Prévisualiser
          </button>
          <button onClick={onUse} disabled={loading}
            className="flex-1 rounded-lg bg-primary py-2 text-xs font-medium text-primary-foreground hover:bg-accent disabled:opacity-60 transition">
            {loading ? "…" : "Utiliser"}
          </button>
        </div>
      </div>
    </motion.article>
  );
}
