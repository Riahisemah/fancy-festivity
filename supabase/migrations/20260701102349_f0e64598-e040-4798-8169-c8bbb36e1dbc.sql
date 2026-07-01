ALTER TYPE public.invitation_theme ADD VALUE IF NOT EXISTS 'tunisian';
ALTER TABLE public.invitations ADD COLUMN IF NOT EXISTS language text NOT NULL DEFAULT 'fr';