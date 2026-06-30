// Service Supabase pour les invitations (RSVP supprimé).
import { getSupabase } from "@/integrations/supabase/get-client";
import type { Tables, Json } from "@/integrations/supabase/types";
import type { ThemeKey } from "./themes";
import type { Section } from "./sections";

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
  views_count: number;
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
}>;

type InvitationRow = Tables<"invitations">;

function mapInvitation(row: InvitationRow): Invitation {
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
    views_count: row.views_count,
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
  const { data, error } = await supabase.from("invitations").select("*").eq("slug", slug).maybeSingle();
  if (error) throw error;
  return data ? mapInvitation(data) : null;
}

export async function createInvitation(userId: string, input: InvitationCreateInput): Promise<Invitation> {
  const supabase = await getSupabase();
  const { data, error } = await supabase
    .from("invitations")
    .insert({
      user_id: userId,
      event_name: input.event_name,
      hosts: input.hosts,
      event_date: input.event_date,
      location: input.location,
      theme: input.theme,
      subtheme: input.subtheme ?? null,
      sections: (input.sections ?? []) as unknown as Json,
    })
    .select()
    .single();
  if (error) throw error;
  return mapInvitation(data);
}

export async function patchInvitation(id: string, patch: InvitationPatch): Promise<void> {
  const supabase = await getSupabase();
  const update: Record<string, unknown> = { ...patch };
  if (patch.sections) update.sections = patch.sections as unknown as Json;
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
