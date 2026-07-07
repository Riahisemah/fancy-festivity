export type UserRole = "super_admin" | "client";
export type AccountStatus = "active" | "suspended" | "expired";
export type PlanKey = "bronze" | "silver" | "gold" | "unlimited";
export type SubscriptionStatus = "active" | "expired" | "suspended";

export type Plan = {
  id: string;
  key: PlanKey;
  name: string;
  max_invitations: number | null;
  price_cents: number;
};

export type Profile = {
  id: string;
  full_name: string;
  email: string;
  role: UserRole;
  status: AccountStatus;
  last_login_at: string | null;
  created_at: string;
  updated_at: string;
};

export type Subscription = {
  id: string;
  user_id: string;
  plan_id: string;
  status: SubscriptionStatus;
  starts_at: string;
  expires_at: string;
  default_publication_days: number | null;
  revenue_cents: number;
  plan?: Plan;
};

export type UserLimits = {
  user_id: string;
  max_invitations: number | null;
};

export type UserWithDetails = Profile & {
  subscription: Subscription | null;
  limits: UserLimits | null;
  invitations_count: number;
};

export type AdminStats = {
  total_users: number;
  active_users: number;
  expired_users: number;
  suspended_users: number;
  total_invitations: number;
  invitations_today: number;
  active_invitations: number;
  expired_invitations: number;
  top_invitations: { id: string; event_name: string; views_count: number; slug: string }[];
  logins_today: number;
  logins_week: number;
  total_revenue_cents: number;
};

export type CreateUserInput = {
  full_name: string;
  email: string;
  password: string;
  plan_key: PlanKey;
  max_invitations?: number | null;
  expires_at: string;
  default_publication_days: number | null;
  revenue_cents?: number;
};

export type UpdateUserInput = {
  user_id: string;
  full_name?: string;
  email?: string;
  status?: AccountStatus;
  plan_key?: PlanKey;
  max_invitations?: number | null;
  expires_at?: string;
  default_publication_days?: number | null;
  revenue_cents?: number;
};

export const PUBLICATION_DURATIONS = [
  { label: "7 jours", days: 7 },
  { label: "15 jours", days: 15 },
  { label: "30 jours", days: 30 },
  { label: "60 jours", days: 60 },
  { label: "90 jours", days: 90 },
  { label: "Illimité", days: null },
] as const;

export const ACCOUNT_DURATIONS = [
  { label: "1 mois", months: 1 },
  { label: "3 mois", months: 3 },
  { label: "6 mois", months: 6 },
  { label: "12 mois", months: 12 },
] as const;

export function addMonths(date: Date, months: number): Date {
  const d = new Date(date);
  d.setMonth(d.getMonth() + months);
  return d;
}

export function computePublishedUntil(publicationDays: number | null): string | null {
  if (publicationDays === null) return null;
  const d = new Date();
  d.setDate(d.getDate() + publicationDays);
  return d.toISOString();
}

export function isInvitationPublished(publishedUntil: string | null): boolean {
  if (!publishedUntil) return true;
  return new Date(publishedUntil) > new Date();
}

export function isAccountActive(profile: Profile, subscription: Subscription | null): boolean {
  if (profile.status !== "active") return false;
  if (!subscription) return false;
  if (subscription.status !== "active") return false;
  return new Date(subscription.expires_at) > new Date();
}
