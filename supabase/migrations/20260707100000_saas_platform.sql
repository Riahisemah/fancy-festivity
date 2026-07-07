-- SaaS multi-tenant platform: roles, subscriptions, licenses, RLS
-- Ordre: enums → tables → fonctions → policies → backfill

-- ─── Enums (idempotent) ──────────────────────────────────────────────────────

DO $$ BEGIN
  CREATE TYPE public.user_role AS ENUM ('super_admin', 'client');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE public.account_status AS ENUM ('active', 'suspended', 'expired');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE public.plan_key AS ENUM ('bronze', 'silver', 'gold', 'unlimited');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE public.subscription_status AS ENUM ('active', 'expired', 'suspended');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- ─── Plans ───────────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS public.plans (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  key public.plan_key NOT NULL UNIQUE,
  name TEXT NOT NULL,
  max_invitations INTEGER,
  price_cents INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

INSERT INTO public.plans (key, name, max_invitations, price_cents) VALUES
  ('bronze', 'Bronze', 5, 2900),
  ('silver', 'Silver', 20, 7900),
  ('gold', 'Gold', 50, 14900),
  ('unlimited', 'Unlimited', NULL, 29900)
ON CONFLICT (key) DO NOTHING;

GRANT SELECT ON public.plans TO authenticated, anon;
GRANT ALL ON public.plans TO service_role;

-- ─── Profiles ────────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID NOT NULL PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL DEFAULT '',
  email TEXT NOT NULL,
  role public.user_role NOT NULL DEFAULT 'client',
  status public.account_status NOT NULL DEFAULT 'active',
  last_login_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE UNIQUE INDEX IF NOT EXISTS profiles_single_super_admin
  ON public.profiles ((true)) WHERE role = 'super_admin';

GRANT SELECT, UPDATE ON public.profiles TO authenticated;
GRANT ALL ON public.profiles TO service_role;

-- ─── Subscriptions ───────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS public.subscriptions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE REFERENCES public.profiles(id) ON DELETE CASCADE,
  plan_id UUID NOT NULL REFERENCES public.plans(id),
  status public.subscription_status NOT NULL DEFAULT 'active',
  starts_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  expires_at TIMESTAMPTZ NOT NULL,
  default_publication_days INTEGER,
  revenue_cents INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

GRANT SELECT ON public.subscriptions TO authenticated;
GRANT ALL ON public.subscriptions TO service_role;

-- ─── User limits ─────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS public.user_limits (
  user_id UUID NOT NULL PRIMARY KEY REFERENCES public.profiles(id) ON DELETE CASCADE,
  max_invitations INTEGER,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

GRANT SELECT ON public.user_limits TO authenticated;
GRANT ALL ON public.user_limits TO service_role;

-- ─── Invitations: publication duration ───────────────────────────────────────

ALTER TABLE public.invitations
  ADD COLUMN IF NOT EXISTS publication_days INTEGER,
  ADD COLUMN IF NOT EXISTS published_until TIMESTAMPTZ;

UPDATE public.invitations
SET publication_days = NULL, published_until = NULL
WHERE published_until IS NULL AND publication_days IS NULL;

-- ─── Invitation views ────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS public.invitation_views (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  invitation_id UUID NOT NULL REFERENCES public.invitations(id) ON DELETE CASCADE,
  viewed_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  ip_hash TEXT,
  user_agent TEXT
);

CREATE INDEX IF NOT EXISTS idx_invitation_views_invitation_id ON public.invitation_views(invitation_id);
CREATE INDEX IF NOT EXISTS idx_invitation_views_viewed_at ON public.invitation_views(viewed_at);

GRANT SELECT ON public.invitation_views TO authenticated;
GRANT ALL ON public.invitation_views TO service_role;

-- ─── Login sessions ──────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS public.login_sessions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  logged_in_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  ip_hash TEXT
);

CREATE INDEX IF NOT EXISTS idx_login_sessions_user_id ON public.login_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_login_sessions_logged_in_at ON public.login_sessions(logged_in_at);

GRANT SELECT, INSERT ON public.login_sessions TO authenticated;
GRANT ALL ON public.login_sessions TO service_role;

-- ─── Triggers (set_updated_at must already exist from initial migration) ─────

DROP TRIGGER IF EXISTS profiles_set_updated_at ON public.profiles;
CREATE TRIGGER profiles_set_updated_at BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

DROP TRIGGER IF EXISTS subscriptions_set_updated_at ON public.subscriptions;
CREATE TRIGGER subscriptions_set_updated_at BEFORE UPDATE ON public.subscriptions
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- ─── Helper functions (AFTER all tables exist) ───────────────────────────────

CREATE OR REPLACE FUNCTION public.is_super_admin()
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role = 'super_admin' AND status = 'active'
  );
$$;

CREATE OR REPLACE FUNCTION public.get_max_invitations(p_user_id UUID)
RETURNS INTEGER
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT COALESCE(ul.max_invitations, p.max_invitations)
  FROM public.subscriptions s
  JOIN public.plans p ON p.id = s.plan_id
  LEFT JOIN public.user_limits ul ON ul.user_id = s.user_id
  WHERE s.user_id = p_user_id
  LIMIT 1;
$$;

CREATE OR REPLACE FUNCTION public.count_user_invitations(p_user_id UUID)
RETURNS INTEGER
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT COUNT(*)::INTEGER FROM public.invitations WHERE user_id = p_user_id;
$$;

CREATE OR REPLACE FUNCTION public.can_create_invitation(p_user_id UUID)
RETURNS BOOLEAN
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_max INTEGER;
  v_count INTEGER;
  v_sub_status public.subscription_status;
  v_profile_status public.account_status;
  v_expires_at TIMESTAMPTZ;
BEGIN
  SELECT status INTO v_profile_status FROM public.profiles WHERE id = p_user_id;
  IF v_profile_status IS DISTINCT FROM 'active' THEN
    RETURN FALSE;
  END IF;

  SELECT s.status, s.expires_at INTO v_sub_status, v_expires_at
  FROM public.subscriptions s WHERE s.user_id = p_user_id;

  IF v_sub_status IS DISTINCT FROM 'active' THEN
    RETURN FALSE;
  END IF;
  IF v_expires_at IS NOT NULL AND v_expires_at <= now() THEN
    RETURN FALSE;
  END IF;

  v_max := public.get_max_invitations(p_user_id);
  IF v_max IS NULL THEN
    RETURN TRUE;
  END IF;

  v_count := public.count_user_invitations(p_user_id);
  RETURN v_count < v_max;
END;
$$;

CREATE OR REPLACE FUNCTION public.get_public_invitation(p_slug TEXT)
RETURNS SETOF public.invitations
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT * FROM public.invitations
  WHERE slug = p_slug
    AND (published_until IS NULL OR published_until > now());
$$;

GRANT EXECUTE ON FUNCTION public.get_public_invitation(TEXT) TO anon, authenticated;

CREATE OR REPLACE FUNCTION public.increment_invitation_views(invitation_slug TEXT)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_id UUID;
BEGIN
  SELECT id INTO v_id FROM public.invitations
  WHERE slug = invitation_slug
    AND (published_until IS NULL OR published_until > now());

  IF v_id IS NULL THEN
    RETURN;
  END IF;

  UPDATE public.invitations SET views_count = views_count + 1 WHERE id = v_id;
  INSERT INTO public.invitation_views (invitation_id) VALUES (v_id);
END;
$$;

GRANT EXECUTE ON FUNCTION public.increment_invitation_views(TEXT) TO anon, authenticated;

-- ─── Row Level Security ──────────────────────────────────────────────────────

ALTER TABLE public.plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_limits ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.invitation_views ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.login_sessions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can read plans" ON public.plans;
CREATE POLICY "Anyone can read plans" ON public.plans FOR SELECT USING (true);

DROP POLICY IF EXISTS "Users read own profile" ON public.profiles;
CREATE POLICY "Users read own profile" ON public.profiles FOR SELECT TO authenticated
  USING (id = auth.uid() OR public.is_super_admin());

DROP POLICY IF EXISTS "Super admin manages profiles" ON public.profiles;
CREATE POLICY "Super admin manages profiles" ON public.profiles FOR ALL TO authenticated
  USING (public.is_super_admin()) WITH CHECK (public.is_super_admin());

DROP POLICY IF EXISTS "Users update own profile" ON public.profiles;
CREATE POLICY "Users update own profile" ON public.profiles FOR UPDATE TO authenticated
  USING (id = auth.uid()) WITH CHECK (id = auth.uid());

DROP POLICY IF EXISTS "Users read own subscription" ON public.subscriptions;
CREATE POLICY "Users read own subscription" ON public.subscriptions FOR SELECT TO authenticated
  USING (user_id = auth.uid() OR public.is_super_admin());

DROP POLICY IF EXISTS "Super admin manages subscriptions" ON public.subscriptions;
CREATE POLICY "Super admin manages subscriptions" ON public.subscriptions FOR ALL TO authenticated
  USING (public.is_super_admin()) WITH CHECK (public.is_super_admin());

DROP POLICY IF EXISTS "Users read own limits" ON public.user_limits;
CREATE POLICY "Users read own limits" ON public.user_limits FOR SELECT TO authenticated
  USING (user_id = auth.uid() OR public.is_super_admin());

DROP POLICY IF EXISTS "Super admin manages limits" ON public.user_limits;
CREATE POLICY "Super admin manages limits" ON public.user_limits FOR ALL TO authenticated
  USING (public.is_super_admin()) WITH CHECK (public.is_super_admin());

DROP POLICY IF EXISTS "Owners read own invitation views" ON public.invitation_views;
CREATE POLICY "Owners read own invitation views" ON public.invitation_views FOR SELECT TO authenticated
  USING (
    EXISTS (SELECT 1 FROM public.invitations i WHERE i.id = invitation_id AND i.user_id = auth.uid())
    OR public.is_super_admin()
  );

DROP POLICY IF EXISTS "Super admin reads login sessions" ON public.login_sessions;
CREATE POLICY "Super admin reads login sessions" ON public.login_sessions FOR SELECT TO authenticated
  USING (public.is_super_admin());

DROP POLICY IF EXISTS "Users insert own login session" ON public.login_sessions;
CREATE POLICY "Users insert own login session" ON public.login_sessions FOR INSERT TO authenticated
  WITH CHECK (user_id = auth.uid());

-- ─── Invitations RLS ─────────────────────────────────────────────────────────

DROP POLICY IF EXISTS "Anyone can view invitations" ON public.invitations;
DROP POLICY IF EXISTS "Owners can insert" ON public.invitations;
DROP POLICY IF EXISTS "Owners can update" ON public.invitations;
DROP POLICY IF EXISTS "Owners can delete" ON public.invitations;
DROP POLICY IF EXISTS "Owner or admin can view" ON public.invitations;
DROP POLICY IF EXISTS "Owner can insert" ON public.invitations;
DROP POLICY IF EXISTS "Owner or admin can update" ON public.invitations;
DROP POLICY IF EXISTS "Owner or admin can delete" ON public.invitations;

REVOKE SELECT ON public.invitations FROM anon;

DROP POLICY IF EXISTS "Owners and super admin select invitations" ON public.invitations;
CREATE POLICY "Owners and super admin select invitations" ON public.invitations FOR SELECT TO authenticated
  USING (user_id = auth.uid() OR public.is_super_admin());

DROP POLICY IF EXISTS "Super admin select all invitations" ON public.invitations;
CREATE POLICY "Super admin select all invitations" ON public.invitations FOR SELECT TO service_role
  USING (true);

DROP POLICY IF EXISTS "Owners insert within limits" ON public.invitations;
CREATE POLICY "Owners insert within limits" ON public.invitations FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id AND public.can_create_invitation(auth.uid()));

DROP POLICY IF EXISTS "Super admin insert invitations" ON public.invitations;
CREATE POLICY "Super admin insert invitations" ON public.invitations FOR INSERT TO authenticated
  WITH CHECK (public.is_super_admin());

DROP POLICY IF EXISTS "Owners update invitations" ON public.invitations;
CREATE POLICY "Owners update invitations" ON public.invitations FOR UPDATE TO authenticated
  USING (user_id = auth.uid() OR public.is_super_admin())
  WITH CHECK (user_id = auth.uid() OR public.is_super_admin());

DROP POLICY IF EXISTS "Owners delete invitations" ON public.invitations;
CREATE POLICY "Owners delete invitations" ON public.invitations FOR DELETE TO authenticated
  USING (user_id = auth.uid() OR public.is_super_admin());

-- ─── Backfill existing users ─────────────────────────────────────────────────

INSERT INTO public.profiles (id, email, full_name, role, status)
SELECT
  u.id,
  COALESCE(u.email, ''),
  COALESCE(u.raw_user_meta_data->>'full_name', ''),
  'client',
  'active'
FROM auth.users u
WHERE NOT EXISTS (SELECT 1 FROM public.profiles p WHERE p.id = u.id)
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.subscriptions (user_id, plan_id, status, starts_at, expires_at, default_publication_days)
SELECT
  p.id,
  (SELECT id FROM public.plans WHERE key = 'bronze'),
  'active',
  now(),
  now() + INTERVAL '12 months',
  30
FROM public.profiles p
WHERE p.role = 'client'
  AND NOT EXISTS (SELECT 1 FROM public.subscriptions s WHERE s.user_id = p.id);
