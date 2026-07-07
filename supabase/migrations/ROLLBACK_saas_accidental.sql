-- =====================================================================
-- ROLLBACK: annule la migration SaaS exécutée par erreur
-- Safe: ignore les tables/objets qui n'existent pas
-- Exécuter dans Supabase → SQL Editor
-- =====================================================================

-- Helper: drop policy only if table exists
DO $$
DECLARE
  pol RECORD;
BEGIN
  -- Triggers (only if parent table exists)
  IF EXISTS (SELECT 1 FROM pg_class c JOIN pg_namespace n ON n.oid = c.relnamespace
             WHERE n.nspname = 'public' AND c.relname = 'invitations') THEN
    DROP TRIGGER IF EXISTS invitations_enforce_limits ON public.invitations;
  END IF;
  IF EXISTS (SELECT 1 FROM pg_class c JOIN pg_namespace n ON n.oid = c.relnamespace
             WHERE n.nspname = 'public' AND c.relname = 'subscriptions') THEN
    DROP TRIGGER IF EXISTS subscriptions_set_updated_at ON public.subscriptions;
  END IF;
  IF EXISTS (SELECT 1 FROM pg_class c JOIN pg_namespace n ON n.oid = c.relnamespace
             WHERE n.nspname = 'public' AND c.relname = 'profiles') THEN
    DROP TRIGGER IF EXISTS profiles_guard_update ON public.profiles;
  END IF;
  DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

  -- Drop all known SaaS policies per table (skip missing tables)
  FOR pol IN
    SELECT * FROM (VALUES
      ('invitations', 'Owner or admin can view'),
      ('invitations', 'Owner can insert'),
      ('invitations', 'Owner or admin can update'),
      ('invitations', 'Owner or admin can delete'),
      ('invitations', 'Owners and super admin select invitations'),
      ('invitations', 'Owners insert within limits'),
      ('invitations', 'Super admin insert invitations'),
      ('invitations', 'Owners update invitations'),
      ('invitations', 'Owners delete invitations'),
      ('invitations', 'Anyone can view invitations'),
      ('invitations', 'Owners can insert'),
      ('invitations', 'Owners can update'),
      ('invitations', 'Owners can delete'),
      ('plans', 'Plans are readable'),
      ('plans', 'Super admin manages plans'),
      ('plans', 'Anyone can read plans'),
      ('profiles', 'Profiles readable by owner or admin'),
      ('profiles', 'Profiles updatable by owner or admin'),
      ('profiles', 'Users read own profile'),
      ('profiles', 'Super admin manages profiles'),
      ('profiles', 'Users update own profile'),
      ('subscriptions', 'Subscriptions readable by owner or admin'),
      ('subscriptions', 'Super admin manages subscriptions'),
      ('subscriptions', 'Users read own subscription'),
      ('user_limits', 'Users read own limits'),
      ('user_limits', 'Super admin manages limits'),
      ('invitation_views', 'Views readable by invitation owner or admin'),
      ('invitation_views', 'Owners read own invitation views'),
      ('login_sessions', 'Super admin reads login sessions'),
      ('login_sessions', 'Users insert own login session')
    ) AS t(tbl, policy_name)
  LOOP
    IF EXISTS (
      SELECT 1 FROM pg_class c
      JOIN pg_namespace n ON n.oid = c.relnamespace
      WHERE n.nspname = 'public' AND c.relname = pol.tbl
    ) THEN
      EXECUTE format('DROP POLICY IF EXISTS %I ON public.%I', pol.policy_name, pol.tbl);
    END IF;
  END LOOP;
END $$;

-- Restaurer RLS invitations (état d'origine)
CREATE POLICY "Anyone can view invitations" ON public.invitations FOR SELECT USING (true);
CREATE POLICY "Owners can insert" ON public.invitations FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Owners can update" ON public.invitations FOR UPDATE TO authenticated
  USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Owners can delete" ON public.invitations FOR DELETE TO authenticated
  USING (auth.uid() = user_id);

GRANT SELECT ON public.invitations TO anon;

-- Colonnes ajoutées sur invitations
ALTER TABLE public.invitations
  DROP COLUMN IF EXISTS publish_duration_days,
  DROP COLUMN IF EXISTS publish_expires_at,
  DROP COLUMN IF EXISTS publication_days,
  DROP COLUMN IF EXISTS published_until;

-- RPC / compteur de vues
DROP FUNCTION IF EXISTS public.get_public_invitation(TEXT);

CREATE OR REPLACE FUNCTION public.increment_invitation_views(invitation_slug TEXT)
RETURNS void
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  UPDATE public.invitations SET views_count = views_count + 1 WHERE slug = invitation_slug;
END; $$;

GRANT EXECUTE ON FUNCTION public.increment_invitation_views(TEXT) TO anon, authenticated;

-- Tables SaaS
DROP TABLE IF EXISTS public.invitation_views CASCADE;
DROP TABLE IF EXISTS public.login_sessions CASCADE;
DROP TABLE IF EXISTS public.user_limits CASCADE;
DROP TABLE IF EXISTS public.subscriptions CASCADE;
DROP TABLE IF EXISTS public.profiles CASCADE;
DROP TABLE IF EXISTS public.plans CASCADE;

-- Fonctions helper
DROP FUNCTION IF EXISTS public.enforce_invitation_limits();
DROP FUNCTION IF EXISTS public.guard_profile_update();
DROP FUNCTION IF EXISTS public.handle_new_user();
DROP FUNCTION IF EXISTS public.effective_max_invitations(UUID);
DROP FUNCTION IF EXISTS public.account_active(UUID);
DROP FUNCTION IF EXISTS public.account_status(UUID);
DROP FUNCTION IF EXISTS public.is_super_admin(UUID);
DROP FUNCTION IF EXISTS public.is_super_admin();
DROP FUNCTION IF EXISTS public.get_max_invitations(UUID);
DROP FUNCTION IF EXISTS public.count_user_invitations(UUID);
DROP FUNCTION IF EXISTS public.can_create_invitation(UUID);

-- Types enum
DROP TYPE IF EXISTS public.app_role CASCADE;
DROP TYPE IF EXISTS public.subscription_status CASCADE;
DROP TYPE IF EXISTS public.user_role CASCADE;
DROP TYPE IF EXISTS public.account_status CASCADE;
DROP TYPE IF EXISTS public.plan_key CASCADE;

-- OPTIONNEL — supprimer admin@velon.app (décommenter si besoin) :
-- DELETE FROM auth.identities WHERE user_id IN (SELECT id FROM auth.users WHERE email = 'admin@velon.app');
-- DELETE FROM auth.users WHERE email = 'admin@velon.app';

-- ✅ Rollback terminé.
