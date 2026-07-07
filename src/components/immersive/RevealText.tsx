// Révélation texte avec GSAP + SplitType.
// Arabic/RTL: split by words only — char splitting breaks cursive letter joining.
import { useEffect, useRef, type ReactNode } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import SplitType from "split-type";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export function RevealText({
  children,
  className,
  delay = 0,
  stagger = 0.028,
  duration = 1.1,
  rtl = false,
  instant = false,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
  stagger?: number;
  duration?: number;
  rtl?: boolean;
  /** Affiche le texte immédiatement (aperçu éditeur). */
  instant?: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (instant || !ref.current) return;
    const el = ref.current;

    if (rtl) {
      gsap.set(el, { yPercent: 24, opacity: 0 });
      const anim = gsap.to(el, {
        yPercent: 0,
        opacity: 1,
        duration,
        delay,
        ease: "expo.out",
        scrollTrigger: { trigger: el, start: "top 88%", once: true },
      });
      return () => {
        anim.scrollTrigger?.kill();
        anim.kill();
      };
    }

    const split = new SplitType(el, { types: "chars,words" });
    gsap.set(split.chars, { yPercent: 110, opacity: 0, rotateX: -60 });

    const anim = gsap.to(split.chars, {
      yPercent: 0,
      opacity: 1,
      rotateX: 0,
      duration,
      stagger,
      delay,
      ease: "expo.out",
      scrollTrigger: { trigger: el, start: "top 88%", once: true },
    });
    return () => {
      anim.scrollTrigger?.kill();
      anim.kill();
      split.revert();
    };
  }, [delay, stagger, duration, rtl, instant]);

  return (
    <div ref={ref} className={className} style={{ perspective: rtl ? undefined : 800 }}>
      {children}
    </div>
  );
}
