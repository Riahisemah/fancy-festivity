import { hasArabicText } from "@/lib/i18n";

type BilingualTextProps = {
  ar?: string;
  fr?: string;
  /** Texte unique — détecte arabe vs latin automatiquement si un seul bloc */
  text?: string;
  className?: string;
  arClassName?: string;
  frClassName?: string;
  variant?: "stack" | "inline";
};

/** Affichage harmonieux AR (RTL) + FR (LTR) sur la même carte */
export function BilingualText({
  ar,
  fr,
  text,
  className = "",
  arClassName = "font-arabic-display leading-[1.5]",
  frClassName = "font-serif italic leading-relaxed",
  variant = "stack",
}: BilingualTextProps) {
  let arText = ar;
  let frText = fr;

  if (!arText && !frText && text) {
    if (hasArabicText(text)) {
      arText = text;
    } else {
      frText = text;
    }
  }

  if (!arText && !frText) return null;

  if (variant === "inline" && arText && frText) {
    return (
      <span className={className}>
        <span dir="rtl" lang="ar" className={arClassName}>{arText}</span>
        <span className="mx-2 opacity-40">·</span>
        <span dir="ltr" lang="fr" className={frClassName}>{frText}</span>
      </span>
    );
  }

  return (
    <div className={`space-y-4 ${className}`}>
      {arText && (
        <p dir="rtl" lang="ar" className={arClassName}>{arText}</p>
      )}
      {arText && frText && (
        <div className="mx-auto h-px w-12 bg-current opacity-20" aria-hidden />
      )}
      {frText && (
        <p dir="ltr" lang="fr" className={frClassName}>{frText}</p>
      )}
    </div>
  );
}

/** Empilement vertical pour hero bilingue */
export function BilingualStack({
  eyebrowAr,
  eyebrowFr,
  titleAr,
  titleFr,
  subtitleAr,
  subtitleFr,
  accentClass = "",
}: {
  eyebrowAr?: string;
  eyebrowFr?: string;
  titleAr?: string;
  titleFr?: string;
  subtitleAr?: string;
  subtitleFr?: string;
  accentClass?: string;
}) {
  return (
    <div className="space-y-6">
      {(eyebrowAr || eyebrowFr) && (
        <div className={`space-y-2 ${accentClass}`}>
          {eyebrowAr && (
            <p dir="rtl" lang="ar" className="font-arabic text-sm tracking-normal normal-case">{eyebrowAr}</p>
          )}
          {eyebrowFr && (
            <p dir="ltr" lang="fr" className="text-[10px] uppercase tracking-[0.35em]">{eyebrowFr}</p>
          )}
        </div>
      )}
      {titleAr && (
        <h1 dir="rtl" lang="ar" className="font-arabic-display text-5xl md:text-7xl leading-[1.35]">{titleAr}</h1>
      )}
      {titleFr && (
        <h2 dir="ltr" lang="fr" className="font-serif text-3xl md:text-4xl tracking-tight leading-tight">{titleFr}</h2>
      )}
      {(subtitleAr || subtitleFr) && (
        <div className="mx-auto max-w-xl space-y-3 opacity-85">
          {subtitleAr && <p dir="rtl" lang="ar" className="font-arabic text-base md:text-lg leading-relaxed">{subtitleAr}</p>}
          {subtitleFr && <p dir="ltr" lang="fr" className="font-serif text-sm md:text-base italic leading-relaxed">{subtitleFr}</p>}
        </div>
      )}
    </div>
  );
}
