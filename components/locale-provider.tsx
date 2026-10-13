"use client";

import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react";
import { getContent } from "@/lib/content";
import { defaultLocale, htmlLang, LOCALE_COOKIE, LOCALE_COOKIE_MAX_AGE, type Locale } from "@/lib/i18n";

interface LocaleContextValue {
  locale: Locale;
  /** Switches the whole page instantly (client state), remembers the choice, and updates lang and title. */
  setLocale: (next: Locale) => void;
}

const LocaleContext = createContext<LocaleContextValue>({
  locale: defaultLocale,
  setLocale: () => {},
});

/**
 * Holds the live locale. The server picks the initial value (cookie, then
 * Accept-Language) so the first paint is already in the right language; the
 * switch in the header then flips this state and every section re-renders
 * without a navigation.
 */
export function LocaleProvider({ locale: initial, children }: { locale: Locale; children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(initial);

  const setLocale = useCallback((next: Locale) => {
    setLocaleState(next);
    document.cookie = `${LOCALE_COOKIE}=${next}; path=/; max-age=${LOCALE_COOKIE_MAX_AGE}; samesite=lax`;
    document.documentElement.lang = htmlLang[next];
    const { site } = getContent(next);
    document.title = `${site.name} | ${site.title}`;
  }, []);

  const value = useMemo(() => ({ locale, setLocale }), [locale, setLocale]);
  return <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>;
}

export function useLocale(): Locale {
  return useContext(LocaleContext).locale;
}

export function useSetLocale(): (next: Locale) => void {
  return useContext(LocaleContext).setLocale;
}
