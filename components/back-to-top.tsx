"use client";

import { useSyncExternalStore } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowUp } from "lucide-react";

import { useLocale } from "@/components/locale-provider";
import { Button } from "@/components/ui/button";
import type { Locale } from "@/lib/i18n";

const STRINGS = {
  en: { backToTop: "Back to top" },
  fr: { backToTop: "Retour en haut" },
} satisfies Record<Locale, Record<string, string>>;

const THRESHOLD_PX = 600;

function subscribe(onChange: () => void) {
  window.addEventListener("scroll", onChange, { passive: true });
  return () => window.removeEventListener("scroll", onChange);
}

const getSnapshot = () => window.scrollY > THRESHOLD_PX;
const getServerSnapshot = () => false;

/**
 * Floating control that appears once the reader has scrolled past the hero.
 * Reads scroll position through useSyncExternalStore so there is no
 * setState-in-effect and the server render is deterministic (hidden).
 */
export function BackToTop() {
  const locale = useLocale();
  const t = STRINGS[locale];
  const visible = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const reduce = useReducedMotion();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: reduce ? "auto" : "smooth" });
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="back-to-top"
          initial={{ opacity: 0, y: reduce ? 0 : 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: reduce ? 0 : 12 }}
          transition={{ duration: reduce ? 0 : 0.2, ease: "easeOut" }}
          className="fixed right-6 bottom-6 z-40"
        >
          <Button
            type="button"
            variant="outline"
            size="icon"
            aria-label={t.backToTop}
            onClick={scrollToTop}
            className="glass rounded-full shadow-lg shadow-black/30"
          >
            <ArrowUp aria-hidden="true" />
          </Button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
