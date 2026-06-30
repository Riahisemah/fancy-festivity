
DROP POLICY IF EXISTS "Anyone can increment views" ON public.invitations;
REVOKE UPDATE ON public.invitations FROM anon;

CREATE OR REPLACE FUNCTION public.increment_invitation_views(invitation_slug TEXT)
RETURNS void
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  UPDATE public.invitations SET views_count = views_count + 1 WHERE slug = invitation_slug;
END; $$;

GRANT EXECUTE ON FUNCTION public.increment_invitation_views(TEXT) TO anon, authenticated;

DROP POLICY IF EXISTS "Anyone can RSVP" ON public.rsvps;
CREATE POLICY "Anyone can RSVP with valid data" ON public.rsvps FOR INSERT
  WITH CHECK (
    guest_name IS NOT NULL
    AND length(trim(guest_name)) BETWEEN 1 AND 120
    AND guests_count BETWEEN 1 AND 20
    AND EXISTS (SELECT 1 FROM public.invitations i WHERE i.id = rsvps.invitation_id)
  );
