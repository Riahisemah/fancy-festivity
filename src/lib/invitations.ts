// Service Supabase pour les invitations (RSVP supprimé).
import { getSupabase } from "@/integrations/supabase/get-client";
import type { Tables, Json } from "@/integrations/supabase/types";
import type { ThemeKey } from "./themes";
import type { Section } from "./sections";
import type { Lang } from "./i18n";
import type { InvitationAnimationSettings } from "./animations";
import { parseAnimationSettings } from "./animations";

export type Invitation = {
  id: string;
  slug: string;
  user_id: string;
  event_name: string;
  hosts: string;
  event_date: string;
  location: string;
  message: string | null;
  image_url: string | null;
  theme: ThemeKey;
  subtheme: string | null;
  sections: Section[];
  language: Lang;
  animation_settings: InvitationAnimationSettings;
  views_count: number;
  publication_days: number | null;
  published_until: string | null;
  created_at: string;
  updated_at: string;
};

export type InvitationCreateInput = {
  event_name: string;
  hosts: string;
  event_date: string;
  location: string;
  theme: ThemeKey;
  subtheme?: string | null;
  sections?: Section[];
  language?: Lang;
};

export type InvitationPatch = Partial<{
  event_name: string;
  hosts: string;
  event_date: string;
  location: string;
  message: string | null;
  image_url: string | null;
  theme: ThemeKey;
  subtheme: string | null;
  sections: Section[];
  language: Lang;
  animation_settings: InvitationAnimationSettings;
}>;

type InvitationRow = Tables<"invitations"> & {
  language?: string | null;
  animation_settings?: Json | null;
  publication_days?: number | null;
  published_until?: string | null;
};

let animationSettingsColumnCached: boolean | null = null;

/** Vérifie si la migration `animation_settings` a été appliquée sur Supabase. */
export async function hasAnimationSettingsColumn(): Promise<boolean> {
  if (animationSettingsColumnCached !== null) return animationSettingsColumnCached;
  const supabase = await getSupabase();
  const { error } = await supabase.from("invitations").select("animation_settings").limit(0);
  animationSettingsColumnCached = !error;
  return animationSettingsColumnCached;
}

export function invalidateAnimationSettingsColumnCache() {
  animationSettingsColumnCached = null;
}

function mapInvitation(row: InvitationRow): Invitation {
  const lang = (row.language ?? "fr") as Lang;
  return {
    id: row.id,
    slug: row.slug,
    user_id: row.user_id,
    event_name: row.event_name,
    hosts: row.hosts,
    event_date: row.event_date,
    location: row.location,
    message: row.message,
    image_url: row.image_url,
    theme: row.theme as ThemeKey,
    subtheme: row.subtheme,
    sections: (Array.isArray(row.sections) ? row.sections : []) as unknown as Section[],
    language: (["fr", "ar", "en", "bilingual"] as const).includes(lang) ? lang : "fr",
    animation_settings: parseAnimationSettings(row.animation_settings),
    views_count: row.views_count,
    publication_days: row.publication_days ?? null,
    published_until: row.published_until ?? null,
    created_at: row.created_at,
    updated_at: row.updated_at,
  };
}

export async function listInvitationsByUser(userId: string): Promise<Invitation[]> {
  const supabase = await getSupabase();
  const { data, error } = await supabase
    .from("invitations")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });
  if (error) throw error;
  return (data ?? []).map(mapInvitation);
}

export async function getInvitationById(id: string): Promise<Invitation | null> {
  const supabase = await getSupabase();
  const { data, error } = await supabase.from("invitations").select("*").eq("id", id).maybeSingle();
  if (error) throw error;
  return data ? mapInvitation(data) : null;
}

export async function getInvitationBySlug(slug: string): Promise<Invitation | null> {
  const supabase = await getSupabase();
  const { data, error } = await supabase.rpc("get_public_invitation", { p_slug: slug });
  if (error) {
    const { data: fallback, error: fallbackErr } = await supabase
      .from("invitations")
      .select("*")
      .eq("slug", slug)
      .maybeSingle();
    if (fallbackErr) throw fallbackErr;
    if (!fallback) return null;
    const inv = mapInvitation(fallback);
    if (inv.published_until && new Date(inv.published_until) <= new Date()) return null;
    return inv;
  }
  const row = Array.isArray(data) ? data[0] : data;
  return row ? mapInvitation(row as InvitationRow) : null;
}

export async function createInvitation(
  userId: string,
  input: InvitationCreateInput,
  options?: { publication_days?: number | null },
): Promise<Invitation> {
  const supabase = await getSupabase();
  const publicationDays = options?.publication_days ?? null;
  let publishedUntil: string | null = null;
  if (publicationDays !== null && publicationDays !== undefined) {
    const d = new Date();
    d.setDate(d.getDate() + publicationDays);
    publishedUntil = d.toISOString();
  }
  const insertRow = {
    user_id: userId,
    event_name: input.event_name,
    hosts: input.hosts,
    event_date: input.event_date,
    location: input.location,
    theme: input.theme,
    subtheme: input.subtheme ?? null,
    sections: (input.sections ?? []) as unknown as Json,
    language: input.language ?? "fr",
    publication_days: publicationDays,
    published_until: publishedUntil,
  };
  const { data, error } = await (supabase.from("invitations") as unknown as {
    insert: (r: unknown) => { select: () => { single: () => Promise<{ data: InvitationRow; error: Error | null }> } };
  }).insert(insertRow).select().single();
  if (error) throw error;
  return mapInvitation(data);
}

export async function patchInvitation(id: string, patch: InvitationPatch): Promise<void> {
  const supabase = await getSupabase();
  const update: Record<string, unknown> = { ...patch };
  if (patch.sections) update.sections = patch.sections as unknown as Json;

  const columnReady = patch.animation_settings
    ? await hasAnimationSettingsColumn()
    : false;
  if (patch.animation_settings && columnReady) {
    update.animation_settings = patch.animation_settings as unknown as Json;
  } else {
    delete update.animation_settings;
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { error } = await (supabase.from("invitations") as any).update(update).eq("id", id);
  if (error) throw error;
}

export async function deleteInvitation(id: string): Promise<void> {
  const supabase = await getSupabase();
  const { error } = await supabase.from("invitations").delete().eq("id", id);
  if (error) throw error;
}

export async function incrementViews(slug: string): Promise<void> {
  try {
    const supabase = await getSupabase();
    await supabase.rpc("increment_invitation_views", { invitation_slug: slug });
  } catch {
    // non bloquant
  }
}

export async function uploadInvitationImage(userId: string, file: File): Promise<string> {
  const supabase = await getSupabase();
  const path = `${userId}/${Date.now()}-${file.name}`;
  const { error: uploadError } = await supabase.storage.from("invitations").upload(path, file);
  if (uploadError) throw uploadError;
  const { data } = supabase.storage.from("invitations").getPublicUrl(path);
  return data.publicUrl;
}
