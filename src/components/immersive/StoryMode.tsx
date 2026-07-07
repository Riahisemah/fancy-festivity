import { useState, type ReactNode } from "react";
import { Layers, List } from "lucide-react";

export function StoryModeShell({
  enabled,
  onToggle,
  storyContent,
  scrollContent,
}: {
  enabled: boolean;
  onToggle: (v: boolean) => void;
  storyContent: ReactNode;
  scrollContent: ReactNode;
}) {
  return (
    <>
      <button
        type="button"
        onClick={() => onToggle(!enabled)}
        className="fixed top-4 right-4 z-50 flex items-center gap-1.5 rounded-full bg-black/50 backdrop-blur-md text-white px-3 min-h-10 py-2 text-[11px] font-medium safe-top touch-target"
        aria-label={enabled ? "Mode défilement" : "Mode story"}
      >
        {enabled ? <List className="size-3.5" /> : <Layers className="size-3.5" />}
        {enabled ? "Défilement" : "Story"}
      </button>
      {enabled ? storyContent : scrollContent}
    </>
  );
}

export function StorySections({ children }: { children: ReactNode }) {
  return (
    <div className="h-dvh w-full overflow-y-auto snap-y snap-mandatory scroll-smooth">
      {children}
    </div>
  );
}

export function StorySlide({ children }: { children: ReactNode }) {
  return (
    <section className="min-h-dvh w-full snap-start snap-always flex flex-col items-center justify-center px-4 py-16 safe-bottom">
      <div className="w-full max-w-lg">{children}</div>
    </section>
  );
}

export function useStoryMode(defaultOn = false) {
  const [storyMode, setStoryMode] = useState(defaultOn);
  return { storyMode, setStoryMode };
}
