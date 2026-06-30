
-- Themes enum
CREATE TYPE public.invitation_theme AS ENUM ('wedding', 'birthday', 'business', 'minimal');
CREATE TYPE public.rsvp_status AS ENUM ('yes', 'no', 'maybe');

-- Invitations table
CREATE TABLE public.invitations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  slug TEXT NOT NULL UNIQUE DEFAULT replace(gen_random_uuid()::text, '-', ''),
  event_name TEXT NOT NULL,
  hosts TEXT NOT NULL,
  event_date TIMESTAMPTZ NOT NULL,
  location TEXT NOT NULL,
  message TEXT,
  image_url TEXT,
  theme public.invitation_theme NOT NULL DEFAULT 'minimal',
  views_count INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.invitations TO authenticated;
GRANT SELECT, UPDATE ON public.invitations TO anon; -- anon: read public + increment views_count
GRANT ALL ON public.invitations TO service_role;

ALTER TABLE public.invitations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view invitations" ON public.invitations FOR SELECT USING (true);
CREATE POLICY "Anyone can increment views" ON public.invitations FOR UPDATE TO anon USING (true) WITH CHECK (true);
CREATE POLICY "Owners can insert" ON public.invitations FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Owners can update" ON public.invitations FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Owners can delete" ON public.invitations FOR DELETE TO authenticated USING (auth.uid() = user_id);

CREATE INDEX idx_invitations_user_id ON public.invitations(user_id);
CREATE INDEX idx_invitations_slug ON public.invitations(slug);

-- RSVPs table
CREATE TABLE public.rsvps (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  invitation_id UUID NOT NULL REFERENCES public.invitations(id) ON DELETE CASCADE,
  guest_name TEXT NOT NULL,
  guest_email TEXT,
  status public.rsvp_status NOT NULL DEFAULT 'yes',
  guests_count INTEGER NOT NULL DEFAULT 1,
  message TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT ON public.rsvps TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.rsvps TO authenticated;
GRANT ALL ON public.rsvps TO service_role;

ALTER TABLE public.rsvps ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can RSVP" ON public.rsvps FOR INSERT WITH CHECK (true);
CREATE POLICY "Owners can view RSVPs" ON public.rsvps FOR SELECT TO authenticated
  USING (EXISTS (SELECT 1 FROM public.invitations i WHERE i.id = rsvps.invitation_id AND i.user_id = auth.uid()));
CREATE POLICY "Owners can delete RSVPs" ON public.rsvps FOR DELETE TO authenticated
  USING (EXISTS (SELECT 1 FROM public.invitations i WHERE i.id = rsvps.invitation_id AND i.user_id = auth.uid()));

CREATE INDEX idx_rsvps_invitation_id ON public.rsvps(invitation_id);

-- updated_at trigger
CREATE OR REPLACE FUNCTION public.set_updated_at() RETURNS TRIGGER
LANGUAGE plpgsql SET search_path = public AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END; $$;

CREATE TRIGGER invitations_set_updated_at BEFORE UPDATE ON public.invitations
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
