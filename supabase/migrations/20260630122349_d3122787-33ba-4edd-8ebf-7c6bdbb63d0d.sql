
-- Add sections JSONB column to invitations
ALTER TABLE public.invitations
  ADD COLUMN IF NOT EXISTS sections jsonb NOT NULL DEFAULT '[]'::jsonb;

-- Drop the RSVP feature entirely
DROP TABLE IF EXISTS public.rsvps CASCADE;
DROP TYPE IF EXISTS public.rsvp_status CASCADE;
