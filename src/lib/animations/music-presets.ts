import type { InvitationAnimationSettings } from "./types";

export type MusicPresetId = NonNullable<InvitationAnimationSettings["music"]>["preset"];

export const MUSIC_PRESETS: {
  id: MusicPresetId;
  label: string;
  emoji: string;
  /** Mixkit — musique libre de droits pour démo / MVP */
  url: string | null;
}[] = [
  { id: "none", label: "Aucune", emoji: "🔇", url: null },
  { id: "romantic", label: "Romantique", emoji: "💕", url: "https://assets.mixkit.co/music/preview/mixkit-romantic-harp-1132.mp3" },
  { id: "oriental", label: "Orientale", emoji: "🌙", url: "https://assets.mixkit.co/music/preview/mixkit-arabian-mystery-harp-notification-2528.mp3" },
  { id: "tunisian", label: "Tunisienne", emoji: "🇹🇳", url: "https://assets.mixkit.co/music/preview/mixkit-desert-caravan-763.mp3" },
  { id: "classic", label: "Classique", emoji: "🎻", url: "https://assets.mixkit.co/music/preview/mixkit-classical-ensemble-667.mp3" },
  { id: "modern", label: "Moderne", emoji: "✨", url: "https://assets.mixkit.co/music/preview/mixkit-tech-house-vibes-130.mp3" },
];

export function getMusicPresetUrl(preset: MusicPresetId): string | null {
  return MUSIC_PRESETS.find((p) => p.id === preset)?.url ?? null;
}

export function getMusicPresetLabel(preset: MusicPresetId): string {
  return MUSIC_PRESETS.find((p) => p.id === preset)?.label ?? "Musique";
}
