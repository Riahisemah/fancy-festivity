import type { TemplateLanguage } from "./types";
import type { InvitationCopyEntry, InvitationCopyTexts } from "./types";

/** Textes aplatis pour la construction de sections */
export type ResolvedCopy = InvitationCopyTexts & {
  hosts: string;
  eventName: string;
  /** Texte arabe parallèle (mode bilingue) */
  _ar?: InvitationCopyTexts;
  _fr?: InvitationCopyTexts;
  _hostsAr?: string;
  _hostsFr?: string;
  _eventNameAr?: string;
  _eventNameFr?: string;
};

function pick(entry: InvitationCopyEntry, side: "ar" | "fr"): InvitationCopyTexts {
  return entry[side];
}

/**
 * Résout les textes selon la langue choisie.
 * Bilingue : hero en AR + FR, champs combinés pour affichage double.
 */
export function resolveCopy(entry: InvitationCopyEntry, language: TemplateLanguage): ResolvedCopy {
  const ar = pick(entry, "ar");
  const fr = pick(entry, "fr");

  if (language === "ar") {
    return {
      ...ar,
      hosts: entry.hosts.ar,
      eventName: entry.eventName.ar,
    };
  }

  if (language === "fr") {
    return {
      ...fr,
      hosts: entry.hosts.fr,
      eventName: entry.eventName.fr,
    };
  }

  // Bilingue : titre AR, sous-titre FR, corps combinés où pertinent
  return {
    ...ar,
    heroEyebrow: ar.heroEyebrow,
    heroTitle: ar.heroTitle,
    heroSubtitle: fr.heroSubtitle,
    quote: ar.quote ?? fr.quote,
    quoteAuthor: ar.quoteAuthor ?? fr.quoteAuthor,
    civilTitle: `${ar.civilTitle} · ${fr.civilTitle}`,
    civilDescription: fr.civilDescription ?? ar.civilDescription,
    contractTitle: `${ar.contractTitle} · ${fr.contractTitle}`,
    contractDescription: fr.contractDescription ?? ar.contractDescription,
    receptionTitle: `${ar.receptionTitle} · ${fr.receptionTitle}`,
    dinnerTitle: `${ar.dinnerTitle} · ${fr.dinnerTitle}`,
    afterTitle: ar.afterTitle && fr.afterTitle ? `${ar.afterTitle} · ${fr.afterTitle}` : ar.afterTitle ?? fr.afterTitle,
    programTitle: `${ar.programTitle} · ${fr.programTitle}`,
    familiesTitle: `${ar.familiesTitle} · ${fr.familiesTitle}`,
    familiesBody: `${ar.familiesBody}\n\n—\n\n${fr.familiesBody}`,
    thanksTitle: `${ar.thanksTitle} · ${fr.thanksTitle}`,
    thanksBody: `${ar.thanksBody}\n\n${fr.thanksBody}`,
    mapAddress: `${ar.mapAddress}\n${fr.mapAddress}`,
    mapTitle: ar.mapTitle && fr.mapTitle ? `${ar.mapTitle} · ${fr.mapTitle}` : ar.mapTitle ?? fr.mapTitle,
    countdownLabel: ar.countdownLabel ?? fr.countdownLabel,
    bismillah: ar.bismillah,
    hosts: `${entry.hosts.ar}\n${entry.hosts.fr}`,
    eventName: `${entry.eventName.ar} · ${entry.eventName.fr}`,
    _ar: ar,
    _fr: fr,
    _hostsAr: entry.hosts.ar,
    _hostsFr: entry.hosts.fr,
    _eventNameAr: entry.eventName.ar,
    _eventNameFr: entry.eventName.fr,
  };
}
