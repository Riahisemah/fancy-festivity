import { BilingualText, BilingualStack } from "./BilingualText";

export { BilingualText, BilingualStack };

/** Séparateur interne pour corps bilingue (fallback si pas de composant dédié) */
export const BILINGUAL_SEP = "\n\n—\n\n";

/** Détecte si un texte contient le séparateur bilingue */
export function isBilingualBody(text: string): boolean {
  return text.includes(BILINGUAL_SEP);
}

/** Sépare un corps bilingue en blocs AR / FR */
export function splitBilingualBody(text: string): { ar: string; fr: string } | null {
  if (!isBilingualBody(text)) return null;
  const [ar, fr] = text.split(BILINGUAL_SEP);
  return { ar: ar.trim(), fr: fr.trim() };
}

/** Sépare un titre combiné « AR · FR » */
export function splitBilingualTitle(text: string): { ar: string; fr: string } | null {
  const idx = text.indexOf(" · ");
  if (idx === -1) return null;
  return { ar: text.slice(0, idx).trim(), fr: text.slice(idx + 3).trim() };
}
