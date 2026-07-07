import type { SectionStyle } from "@/lib/section-style";

import type { TemplateLanguage } from "./texts/types";

import type { ResolvedCopy } from "./texts/resolve";

import type { TemplateSection } from "./types";



const d = (days: number) => {

  const dt = new Date();

  dt.setDate(dt.getDate() + days);

  return dt.toISOString();

};



function st(partial: SectionStyle): SectionStyle {

  return partial;

}



export function buildInvitationSections(

  texts: ResolvedCopy,

  opts: {

    accent: string;

    text?: string;

    language: TemplateLanguage;

    headingFont?: SectionStyle["fontFamily"];

    bodyFont?: SectionStyle["fontFamily"];

    layout?: "full" | "minimal" | "royal" | "modern";

    eventDateOffsetDays?: number;

  },

): TemplateSection[] {

  const heading = opts.headingFont ?? (opts.language === "fr" ? "serif" : "arabic-display");

  const body = opts.bodyFont ?? (opts.language === "fr" ? "inherit" : "arabic");

  const accent = opts.accent;

  const offset = opts.eventDateOffsetDays ?? 45;

  const baseStyle = st({

    accentColor: accent,

    ...(opts.text ? { textColor: opts.text } : {}),

    fontFamily: body,

  });

  const titleStyle = st({ ...baseStyle, fontFamily: heading, titleFontSize: "5xl" });



  const sections: TemplateSection[] = [];



  if (texts.bismillah) {

    sections.push({

      kind: "quote",

      text: texts.bismillah,

      style: st({ ...baseStyle, fontFamily: "arabic-display", textAlign: "center", titleFontSize: "2xl" }),

    });

  }



  const hero: TemplateSection = {

    kind: "hero",

    eyebrow: texts.heroEyebrow,

    title: texts.heroTitle,

    subtitle: texts.heroSubtitle,

    date: d(offset),

    location: texts.mapAddress.split("\n")[0],

    style: st({ ...titleStyle, titleFontSize: "7xl", textAlign: "center" }),

  };

  sections.push(hero);



  if (texts.quote) {

    sections.push({

      kind: "quote",

      text: texts.quote,

      author: texts.quoteAuthor,

      style: st({ ...baseStyle, fontFamily: heading, textAlign: "center" }),

    });

  }



  const civil: TemplateSection = {

    kind: "event",

    icon: "📜",

    title: texts.civilTitle,

    date: d(offset).slice(0, 10),

    time: "10:00",

    location: opts.language === "ar" ? "بلدية المرسى" : "Municipalité — La Marsa",

    description: texts.civilDescription ?? (opts.layout === "modern" ? "Cérémonie intime." : "Cérémonie officielle."),

    style: baseStyle,

  };



  const contract: TemplateSection = {

    kind: "event",

    icon: "🕌",

    title: texts.contractTitle,

    date: d(offset).slice(0, 10),

    time: "14:00",

    location: opts.language === "ar" ? "قاعة الأندلس" : "Salle Al-Andalous",

    description: texts.contractDescription ?? "Union selon les traditions.",

    style: baseStyle,

  };



  const program: TemplateSection = {

    kind: "program",

    title: texts.programTitle,

    items: [

      { time: "16:00", label: texts.receptionTitle },

      { time: "19:00", label: texts.dinnerTitle },

      ...(texts.afterTitle ? [{ time: "23:00", label: texts.afterTitle }] : []),

    ],

    style: baseStyle,

  };



  const timeline: TemplateSection = {

    kind: "timeline",

    title: texts.programTitle,

    items: [

      { time: "16:00", label: texts.receptionTitle, description: opts.language === "ar" ? "استقبال الضيوف" : "Accueil des invités" },

      { time: "19:00", label: texts.dinnerTitle, description: opts.language === "ar" ? "مأدبة تقليدية" : "Repas traditionnel" },

      ...(texts.afterTitle ? [{ time: "23:00", label: texts.afterTitle, description: opts.language === "ar" ? "موسيقى و رقص" : "Musique & danse" }] : []),

    ],

    style: baseStyle,

  };



  const families: TemplateSection = {

    kind: "card",

    title: texts.familiesTitle,

    body: texts.familiesBody,

    style: st({ ...baseStyle, textAlign: "center" }),

  };



  const gallery: TemplateSection = {

    kind: "gallery",

    title: opts.layout === "minimal" ? undefined : (opts.language === "ar" ? "معرض الصور" : "Galerie"),

    images: [],

    style: baseStyle,

  };



  const map: TemplateSection = {

    kind: "map",

    title: texts.mapTitle ?? (opts.language === "ar" ? "مكان الحفل" : "Localisation"),

    address: texts.mapAddress,

    style: baseStyle,

  };



  const thanks: TemplateSection = {

    kind: "card",

    title: texts.thanksTitle,

    body: texts.thanksBody,

    style: st({ ...baseStyle, textAlign: "center", bodyFontSize: "lg" }),

  };



  const countdown: TemplateSection = {

    kind: "countdown",

    targetDate: d(offset),

    label: texts.countdownLabel ?? (opts.language === "ar" ? "متبقٍ على يوم الفرح" : "Jusqu'au grand jour"),

    style: baseStyle,

  };



  if (opts.layout === "minimal") {

    return [...sections, program, map, thanks];

  }

  if (opts.layout === "modern") {

    return [...sections, civil, contract, timeline, gallery, map, thanks];

  }

  if (opts.layout === "royal") {

    return [...sections, civil, contract, program, families, gallery, countdown, map, thanks];

  }

  return [...sections, civil, contract, program, families, gallery, map, thanks];

}



/** @deprecated Utiliser buildInvitationSections avec resolveCopy */

export { buildInvitationSections as buildWeddingSections };


