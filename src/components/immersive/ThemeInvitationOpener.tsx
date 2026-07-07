import type { ThemeKey, ThemeConfig } from "@/lib/themes";
import type { Lang } from "@/lib/i18n";
import type { InvitationAnimationSettings } from "@/lib/animations";
import { resolveOpenerConfig, DEFAULT_ANIMATION_SETTINGS } from "@/lib/animations";
import { WeddingOpener } from "./openers/WeddingOpener";
import { TunisianOpener } from "./openers/TunisianOpener";
import { BirthdayOpener } from "./openers/BirthdayOpener";
import { BusinessOpener } from "./openers/BusinessOpener";
import { LuxuryOpener } from "./openers/LuxuryOpener";
import { MinimalOpener } from "./openers/MinimalOpener";
import { GraduationOpener } from "./openers/GraduationOpener";
import { CurtainOpener } from "./openers/CurtainOpener";
import { OpenerRuntimeContext } from "./openers/OpenerRuntimeContext";

export type ThemeInvitationOpenerProps = {
  themeKey: ThemeKey;
  theme: ThemeConfig;
  title: string;
  hosts?: string;
  lang?: Lang;
  storageKey: string;
  onReady?: () => void;
  animationSettings?: InvitationAnimationSettings;
  previewMode?: boolean;
  autoPlay?: boolean;
};

/** Route vers l'animation d'ouverture (choix utilisateur ou thème par défaut) */
export function ThemeInvitationOpener({
  themeKey,
  theme,
  title,
  hosts,
  lang = "fr",
  storageKey,
  onReady,
  animationSettings,
  previewMode = false,
  autoPlay = false,
}: ThemeInvitationOpenerProps) {
  const settings = animationSettings ?? DEFAULT_ANIMATION_SETTINGS;
  const config = resolveOpenerConfig(settings, themeKey, theme);
  const shared = { config, theme, title, hosts, lang, storageKey, onReady };

  const opener = (() => {
    switch (config.variant) {
      case "wedding-envelope":
        return <WeddingOpener {...shared} />;
      case "tunisian-scroll":
        return <TunisianOpener {...shared} />;
      case "birthday-burst":
        return <BirthdayOpener {...shared} />;
      case "business-fold":
        return <BusinessOpener {...shared} />;
      case "luxury-cinematic":
        return <LuxuryOpener {...shared} />;
      case "minimal-fold":
        return <MinimalOpener {...shared} />;
      case "graduation-scroll":
        return <GraduationOpener {...shared} />;
      case "curtain":
        return <CurtainOpener {...shared} />;
      default:
        return <WeddingOpener {...shared} />;
    }
  })();

  return (
    <OpenerRuntimeContext.Provider value={{ preview: previewMode, autoPlay }}>
      {opener}
    </OpenerRuntimeContext.Provider>
  );
}

export { getOpenerConfig } from "@/lib/opener-config";
