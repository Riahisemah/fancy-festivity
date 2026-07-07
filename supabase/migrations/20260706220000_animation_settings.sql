-- Animation settings (opening animation + section transitions + params)
ALTER TABLE public.invitations
  ADD COLUMN IF NOT EXISTS animation_settings jsonb NOT NULL DEFAULT '{}'::jsonb;

COMMENT ON COLUMN public.invitations.animation_settings IS 'User-selected opener animation, section transitions, and advanced params';
