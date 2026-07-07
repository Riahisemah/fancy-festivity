import type { PlanKey } from "@/lib/saas/types";
import type { InvitationTemplate, TemplateBadge } from "./types";

const BRONZE_TEMPLATE_LIMIT = 10;

const BADGE_ACCESS: Record<PlanKey, ReadonlySet<TemplateBadge>> = {
  bronze: new Set(["classic"]),
  silver: new Set(["classic", "premium", "new"]),
  gold: new Set(["classic", "premium", "new", "exclusive"]),
  unlimited: new Set(["classic", "premium", "new", "exclusive"]),
};

const UPGRADE_HINT: Record<PlanKey, string> = {
  bronze: "Passez au pack Premium pour débloquer ce modèle.",
  silver: "Passez au pack Pro pour les modèles exclusifs.",
  gold: "Contactez-nous pour accéder à ce modèle.",
  unlimited: "",
};

export type TemplateAccessResult = {
  allowed: boolean;
  reason?: string;
  upgradePlan?: "silver" | "gold";
};

let bronzeAllowlist: Set<string> | null = null;

function buildBronzeAllowlist(catalog: InvitationTemplate[]): Set<string> {
  const classics = catalog.filter((t) => (t.badge ?? "classic") === "classic");
  const sorted = [...classics].sort((a, b) => {
    if (a.featured !== b.featured) return a.featured ? -1 : 1;
    return a.id.localeCompare(b.id);
  });
  return new Set(sorted.slice(0, BRONZE_TEMPLATE_LIMIT).map((t) => t.id));
}

export function getBronzeAllowlist(catalog: InvitationTemplate[]): Set<string> {
  if (!bronzeAllowlist) bronzeAllowlist = buildBronzeAllowlist(catalog);
  return bronzeAllowlist;
}

export function resolvePlanKey(planKey?: PlanKey | null): PlanKey {
  return planKey ?? "bronze";
}

export function canAccessTemplate(
  template: InvitationTemplate,
  planKey: PlanKey,
  options?: { isSuperAdmin?: boolean; catalog?: InvitationTemplate[] },
): TemplateAccessResult {
  if (options?.isSuperAdmin) return { allowed: true };

  const badge = template.badge ?? "classic";
  if (!BADGE_ACCESS[planKey].has(badge)) {
    return {
      allowed: false,
      reason: UPGRADE_HINT[planKey],
      upgradePlan: planKey === "bronze" ? "silver" : "gold",
    };
  }

  if (planKey === "bronze" && options?.catalog) {
    const allowlist = getBronzeAllowlist(options.catalog);
    if (!allowlist.has(template.id)) {
      return {
        allowed: false,
        reason: `Le pack Basic inclut ${BRONZE_TEMPLATE_LIMIT} modèles classiques. Passez au Premium pour tout débloquer.`,
        upgradePlan: "silver",
      };
    }
  }

  return { allowed: true };
}

export function countAccessibleTemplates(
  catalog: InvitationTemplate[],
  planKey: PlanKey,
  isSuperAdmin = false,
): number {
  if (isSuperAdmin) return catalog.length;
  return catalog.filter((t) => canAccessTemplate(t, planKey, { catalog, isSuperAdmin }).allowed).length;
}
