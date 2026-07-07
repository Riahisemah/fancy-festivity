import { useState, useRef, useEffect } from "react";
import { Music, Pause, Volume2 } from "lucide-react";
import type { InvitationAnimationSettings } from "@/lib/animations";
import { getMusicPresetLabel, getMusicPresetUrl } from "@/lib/animations";

export function InviteMusicPlayer({ settings }: { settings: InvitationAnimationSettings }) {
  const [playing, setPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const preset = settings.music?.preset ?? "none";
  const src = settings.music?.enabled && preset !== "none" ? getMusicPresetUrl(preset) : null;

  useEffect(() => {
    if (!audioRef.current || !src) return;
    audioRef.current.src = src;
    audioRef.current.load();
    if (playing) void audioRef.current.play().catch(() => setPlaying(false));
  }, [src, playing]);

  if (!settings.music?.enabled || preset === "none" || !src) return null;

  const label = getMusicPresetLabel(preset);

  function toggle() {
    if (!audioRef.current) return;
    if (playing) {
      audioRef.current.pause();
      setPlaying(false);
    } else {
      void audioRef.current.play().then(() => setPlaying(true)).catch(() => {});
    }
  }

  return (
    <>
      <button
        type="button"
        onClick={toggle}
        aria-label={playing ? "Pause musique" : "Lire la musique"}
        className="fixed bottom-20 right-4 z-50 flex items-center gap-2 rounded-full bg-black/60 backdrop-blur-md text-white px-4 min-h-11 py-2.5 text-xs font-medium shadow-lg safe-bottom touch-target"
      >
        {playing ? <Pause className="size-4" /> : <Music className="size-4" />}
        <span className="hidden sm:inline">{label}</span>
        <Volume2 className="size-3.5 opacity-70" />
      </button>
      <audio ref={audioRef} loop preload="none" />
    </>
  );
}
