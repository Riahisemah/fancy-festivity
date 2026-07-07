import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

export function WelcomeSplash({
  message,
  onDone,
}: {
  message?: string;
  onDone: () => void;
}) {
  const [visible, setVisible] = useState(!!message);

  useEffect(() => {
    if (!message) {
      onDone();
      return;
    }
    const t = setTimeout(() => {
      setVisible(false);
      onDone();
    }, 2800);
    return () => clearTimeout(t);
  }, [message, onDone]);

  if (!message) return null;

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8 }}
          className="fixed inset-0 z-[110] flex items-center justify-center bg-black/90 backdrop-blur-sm min-h-dvh"
        >
          <motion.p
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 1.05 }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            className="font-serif text-3xl sm:text-5xl text-white text-center px-8 tracking-wide"
          >
            {message}
          </motion.p>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
