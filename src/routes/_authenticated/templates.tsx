import { useState, useMemo } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Eye, Sparkles, Search, Wand2, Lock } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/lib/auth-context";
import { DashboardNav } from "@/components/dashboard/DashboardNav";
import { TemplatePreviewModal } from "@/components/templates/TemplatePreviewModal";
import { AIInvitationWizard } from "@/components/wizard/AIInvitationWizard";
import type { Lang } from "@/lib/i18n";
import {
  TEMPLATE_CATALOG,
  TEMPLATE_CATEGORIES,
  materializeTemplate,
  canAccessTemplate,
  countAccessibleTemplates,
  resolvePlanKey,
  type InvitationTemplate,
} from "@/lib/templates";
import { BADGE_META, COLLECTIONS, filterTemplates } from "@/lib/templates/marketplace";
import type { TemplateBadge } from "@/lib/templates/types";
import { createInvitation } from "@/lib/invitations";
import { resolveTheme, SUBTHEMES } from "@/lib/themes";

export const Route = createFileRoute("/_authenticated/templates")({
  ssr: false,
  head: () => ({ meta: [{ title: "Marketplace — Vélon" }] }),
  component: TemplatesPage,
});

function TemplatesPage() {
  const { user, logout, subscription, isSuperAdmin } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const planKey = resolvePlanKey(subscription?.plan?.key);
  const accessibleCount = countAccessibleTemplates(TEMPLATE_CATALOG, planKey, isSuperAdmin);
  const [preview, setPreview] = useState<InvitationTemplate | null>(null);
  const [showWizard, setShowWizard] = useState(false);
  const [category, setCategory] = useState<string>("all");
  const [collection, setCollection] = useState("all");
  const [badge, setBadge] = useState<TemplateBadge | "all">("all");
  const [search, setSearch] = useState("");

  const filtered = useMemo(
    () =>
      filterTemplates(TEMPLATE_CATALOG, {
        category: category === "all" ? "all" : (category as InvitationTemplate["category"]),
        collection,
        badge,
        search,
      }),
    [category, collection, badge, search],
  );

  const useMut = useMutation({
    mutationFn: async ({ template, language, data }: {
      template?: InvitationTemplate;
      language: Lang;
      data?: ReturnType<typeof materializeTemplate>;
    }) => {
      const payload = data ?? materializeTemplate(template!, language);
      return createInvitation(user!.id, payload, {
        publication_days: subscription?.default_publication_days ?? 30,
      });
    },
    onSuccess: (inv) => {
      toast.success("Invitation créée");
      queryClient.invalidateQueries({ queryKey: ["invitations", user?.id] });
      setPreview(null);
      setShowWizard(false);
      navigate({ to: "/editor/$id", params: { id: inv.id } });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  return (
    <div className="min-h-screen bg-background">
      <DashboardNav
        email={user?.email}
        onSignOut={async () => { await logout(); navigate({ to: "/auth", replace: true }); }}
        onCreate={() => setShowWizard(true)}
      />

      <main className="mx-auto max-w-7xl px-4 md:px-6 py-8 sm:py-10 pb-24 md:pb-10">
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
            <div>
              <span className="text-[11px] uppercase tracking-[0.3em] text-accent inline-flex items-center gap-2">
                <Sparkles className="size-3.5" /> Marketplace tunisien
              </span>
              <h1 className="mt-3 font-serif text-3xl sm:text-4xl md:text-5xl tracking-tight">
                {TEMPLATE_CATALOG.length} modèles authentiques
              </h1>
              <p className="mt-2 text-sm text-muted-foreground max-w-2xl">
                Mariage, fiançailles, henné, naissance, Ramadan… Trouvez votre style en un clic.
                {planKey === "bronze" && !isSuperAdmin && (
                  <span className="block mt-1 text-accent">
                    Votre pack Basic : {accessibleCount} modèles disponibles —{" "}
                    <button type="button" onClick={() => navigate({ to: "/profile" })} className="underline">
                      passer au Premium
                    </button>
                  </span>
                )}
              </p>
            </div>
            <button
              onClick={() => setShowWizard(true)}
              className="inline-flex items-center justify-center gap-2 rounded-full bg-primary text-primary-foreground px-6 min-h-12 py-3 text-sm font-medium hover:bg-accent transition shrink-0"
            >
              <Wand2 className="size-4" /> Créer avec l&apos;IA
            </button>
          </div>
        </motion.div>

        <div className="relative mb-4">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Rechercher un style, un thème, une catégorie…"
            className="w-full rounded-2xl border border-border bg-card pl-11 pr-4 py-3.5 text-base outline-none focus:ring-2 focus:ring-accent/30"
          />
        </div>

        <div className="flex gap-2 overflow-x-auto pb-2 mb-4 scrollbar-hide">
          {COLLECTIONS.map((c) => (
            <FilterChip key={c.id} active={collection === c.id} onClick={() => setCollection(c.id)} label={`${c.emoji} ${c.label}`} />
          ))}
        </div>

        <div className="flex flex-wrap gap-2 mb-4">
          <FilterChip active={category === "all"} onClick={() => setCategory("all")} label="Tous les événements" />
          {TEMPLATE_CATEGORIES.map((c) => (
            <FilterChip key={c.id} active={category === c.id} onClick={() => setCategory(c.id)} label={`${c.emoji} ${c.label}`} />
          ))}
        </div>

        <div className="flex flex-wrap gap-2 mb-8">
          <FilterChip active={badge === "all"} onClick={() => setBadge("all")} label="Tous les badges" />
          {(Object.keys(BADGE_META) as TemplateBadge[]).map((b) => (
            <FilterChip key={b} active={badge === b} onClick={() => setBadge(b)} label={`${BADGE_META[b].emoji} ${BADGE_META[b].label}`} />
          ))}
        </div>

        <p className="text-xs text-muted-foreground mb-4">{filtered.length} modèle{filtered.length > 1 ? "s" : ""} trouvé{filtered.length > 1 ? "s" : ""}</p>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {filtered.map((template, i) => {
            const access = canAccessTemplate(template, planKey, { isSuperAdmin, catalog: TEMPLATE_CATALOG });
            return (
            <TemplateCard
              key={template.id}
              template={template}
              index={i}
              locked={!access.allowed}
              lockReason={access.reason}
              onPreview={() => setPreview(template)}
              onUse={() => {
                if (!access.allowed) {
                  toast.error(access.reason ?? "Modèle non disponible avec votre pack");
                  return;
                }
                useMut.mutate({ template, language: template.language });
              }}
              loading={useMut.isPending && useMut.variables?.template?.id === template.id}
            />
            );
          })}
        </div>

        {!filtered.length && (
          <div className="text-center py-16 text-muted-foreground text-sm">
            Aucun modèle ne correspond. Essayez une autre catégorie ou l&apos;assistant IA.
          </div>
        )}
      </main>

      {preview && (
        <TemplatePreviewModal
          template={preview}
          onClose={() => setPreview(null)}
          onUse={(t, language) => {
            const access = canAccessTemplate(t, planKey, { isSuperAdmin, catalog: TEMPLATE_CATALOG });
            if (!access.allowed) {
              toast.error(access.reason ?? "Modèle non disponible avec votre pack");
              return;
            }
            useMut.mutate({ template: t, language });
          }}
          using={useMut.isPending}
          locked={!canAccessTemplate(preview, planKey, { isSuperAdmin, catalog: TEMPLATE_CATALOG }).allowed}
        />
      )}

      <AIInvitationWizard
        open={showWizard}
        onClose={() => setShowWizard(false)}
        loading={useMut.isPending}
        onGenerated={(result) => {
          toast.success(`Modèle « ${result.template.name} » sélectionné`);
          useMut.mutate({ language: result.data.language ?? "fr", data: result.data });
        }}
      />
    </div>
  );
}

function FilterChip({ active, onClick, label }: { active: boolean; onClick: () => void; label: string }) {
  return (
    <button onClick={onClick}
      className={`rounded-full border px-4 py-2 min-h-10 text-xs font-medium whitespace-nowrap transition shrink-0 ${
        active ? "border-accent bg-accent/10 text-foreground" : "border-border text-muted-foreground hover:bg-muted"
      }`}>
      {label}
    </button>
  );
}

function TemplateCard({
  template, index, onPreview, onUse, loading, locked, lockReason,
}: {
  template: InvitationTemplate;
  index: number;
  onPreview: () => void;
  onUse: () => void;
  loading?: boolean;
  locked?: boolean;
  lockReason?: string;
}) {
  const theme = resolveTheme(template.theme, template.subtheme);
  const sub = SUBTHEMES[template.theme]?.find((s) => s.key === template.subtheme);
  const badge = template.badge ?? "classic";
  const badgeMeta = BADGE_META[badge];

  return (
    <motion.article
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: Math.min(index * 0.02, 0.4) }}
      className={`group rounded-2xl border border-border bg-card overflow-hidden shadow-sm hover:shadow-xl transition-shadow ${locked ? "opacity-80" : ""}`}
    >
      <div
        className={`relative h-44 ${theme.pageBg} overflow-hidden`}
        style={{ background: `linear-gradient(135deg, ${template.colors.background} 0%, ${template.colors.primary}22 100%)` }}
      >
        {locked && (
          <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-black/40 backdrop-blur-[2px] text-white p-4 text-center">
            <Lock className="size-5 mb-2" />
            <p className="text-[10px] leading-snug">{lockReason ?? "Pack Premium requis"}</p>
          </div>
        )}
        <span className={`absolute top-3 left-3 z-10 inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[10px] font-medium ${badgeMeta.className}`}>
          {badgeMeta.emoji} {badgeMeta.label}
        </span>
        <div className="absolute inset-0 flex flex-col items-center justify-center p-4 text-center">
          <span className="text-[10px] uppercase tracking-[0.3em] opacity-60" style={{ color: template.colors.text }}>
            {template.language === "ar" ? "دعوة" : template.language === "bilingual" ? "دعوة · Invitation" : "Invitation"}
          </span>
          <p className={`mt-2 font-serif text-base sm:text-lg leading-tight line-clamp-2 ${template.language === "ar" || template.language === "bilingual" ? "font-arabic-display" : ""}`}
            style={{ color: template.colors.text }}>
            {template.event_name.slice(0, 50)}
          </p>
          {sub && (
            <div className="mt-3 flex gap-1">
              {sub.swatches.slice(0, 4).map((c, i) => (
                <span key={i} className="size-3 rounded-full ring-1 ring-black/10" style={{ background: c }} />
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="p-4">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <h3 className="font-medium text-sm truncate">{template.name}</h3>
            <p className="text-[11px] text-muted-foreground mt-0.5 line-clamp-1">{template.style}</p>
          </div>
          <span className="shrink-0 text-[10px] uppercase tracking-wider text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
            {TEMPLATE_CATEGORIES.find((c) => c.id === template.category)?.label ?? template.category}
          </span>
        </div>
        <p className="mt-2 text-[11px] text-muted-foreground">{template.sections.length} sections</p>
        <div className="mt-4 flex gap-2">
          <button onClick={onPreview}
            className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-lg border border-border min-h-11 py-2.5 text-xs font-medium hover:bg-muted transition touch-target">
            <Eye className="size-3.5" /> Voir
          </button>
          <button onClick={onUse} disabled={loading || locked}
            className="flex-1 rounded-lg bg-primary min-h-11 py-2.5 text-xs font-medium text-primary-foreground hover:bg-accent disabled:opacity-60 transition touch-target">
            {loading ? "…" : locked ? "Premium" : "Utiliser"}
          </button>
        </div>
      </div>
    </motion.article>
  );
}
