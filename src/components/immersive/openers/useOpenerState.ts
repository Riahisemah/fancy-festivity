import { useCallback, useEffect, useState } from "react";
import { useOpenerRuntime } from "./OpenerRuntimeContext";

export function useOpenerState(storageKey: string) {
  const { preview, autoPlay } = useOpenerRuntime();
  const [visible, setVisible] = useState(false);
  const [opened, setOpened] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (preview) {
      setVisible(true);
      setOpened(false);
      setReady(false);
      return;
    }
    try {
      if (!sessionStorage.getItem(storageKey)) {
        setVisible(true);
      } else {
        setReady(true);
      }
    } catch {
      setVisible(true);
    }
  }, [storageKey, preview]);

  const open = useCallback((durationMs = 2200) => {
    setOpened(true);
    if (!preview) {
      try { sessionStorage.setItem(storageKey, "1"); } catch { /* ignore */ }
    }
    window.setTimeout(() => {
      setVisible(false);
      setReady(true);
    }, durationMs);
  }, [storageKey, preview]);

  useEffect(() => {
    if (!preview || !autoPlay || !visible || opened) return;
    const t = window.setTimeout(() => {
      const btn = document.querySelector<HTMLButtonElement>("[data-opener-cta]");
      btn?.click();
    }, 700);
    return () => window.clearTimeout(t);
  }, [preview, autoPlay, visible, opened, storageKey]);

  return { visible, opened, ready, open };
}
