import { newId, type Section } from "@/lib/sections";
import type { Lang } from "@/lib/i18n";
import type { InvitationTemplate, TemplateSection } from "./types";
import { rebuildTemplateLanguage } from "./catalog";

function cloneSection(s: TemplateSection): Section {
  return { ...structuredClone(s), id: newId() } as Section;
}

/** Deep-clone template into editable invitation payload (does not touch catalog). */
export function materializeTemplate(template: InvitationTemplate, language?: Lang) {
  const resolved = language && language !== template.language
    ? rebuildTemplateLanguage(template, language)
    : template;

  const eventDate = new Date();
  eventDate.setDate(eventDate.getDate() + resolved.eventDateOffsetDays);
  eventDate.setHours(18, 0, 0, 0);

  return {
    event_name: resolved.event_name,
    hosts: resolved.hosts,
    event_date: eventDate.toISOString(),
    location: resolved.location,
    theme: resolved.theme,
    subtheme: resolved.subtheme,
    language: resolved.language,
    sections: resolved.sections.map(cloneSection),
  };
}
