// Révélation lettre par lettre avec GSAP + SplitType.
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
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
  stagger?: number;
  duration?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current) return;
    const el = ref.current;
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
  }, [delay, stagger, duration]);

  return (
    <div ref={ref} className={className} style={{ perspective: 800 }}>
      {children}
    </div>
  );
}
