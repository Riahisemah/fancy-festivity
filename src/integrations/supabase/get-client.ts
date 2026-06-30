import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "./types";

let clientPromise: Promise<SupabaseClient<Database>> | undefined;

/** Lazy client import — avoids loading @supabase/auth-js during Netlify SSR shell. */
export function getSupabase() {
  if (!clientPromise) {
    clientPromise = import("./client").then((m) => m.supabase);
  }
  return clientPromise;
}
