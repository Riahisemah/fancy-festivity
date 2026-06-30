import { useEffect, useState } from "react";
import { Toaster } from "sonner";

/** Sonner touches browser APIs — must not render during SSR on Netlify. */
export function ClientToaster() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return null;
  return <Toaster position="top-center" richColors />;
}
