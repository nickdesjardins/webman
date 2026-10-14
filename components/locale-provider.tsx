"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import {
  defaultLocale,
  htmlLang,
  LOCALE_COOKIE,
  LOCALE_COOKIE_MAX_AGE,
  localePath,
  stripLocale,
  type Locale,
} from "@/lib/i18n";

type Titles = Record<Locale, string>;

interface LocaleContextValue {
  locale: Locale;
  /** Switches the whole page instantly (client state), remembers the choice, and updates URL, lang and title. */
  setLocale: (next: Locale) => void;
  /** Lets the current page tell the provider its title in both languages. */
  registerTitles: (titles: Titles | null) => void;
}

const LocaleContext = createContext<LocaleContextValue>({
  locale: defaultLocale,
  setLocale: () => {},
  registerTitles: () => {},
});

/**
 * Holds the live locale. The route picks the initial value ("/" is English,
 * "/fr" is French), so the first paint is already in the right language.
 * The header switch then flips this state and every section re-renders
 * without a navigation; the address bar is rewritten in place to the other
 * edition's URL ("/" <-> "/fr", "/projects/x" <-> "/fr/projects/x"), so a
 * reload, a shared link or a bookmark lands on the language on screen.
 */
export function LocaleProvider({ locale: initial, children }: { locale: Locale; children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(initial);
  const titlesRef = useRef<Titles | null>(null);

  const setLocale = useCallback((next: Locale) => {
    setLocaleState(next);
    document.cookie = `${LOCALE_COOKIE}=${next}; path=/; max-age=${LOCALE_COOKIE_MAX_AGE}; samesite=lax`;
    document.documentElement.lang = htmlLang[next];

    const { pathname, search, hash } = window.location;
    const target = localePath(next, stripLocale(pathname));
    if (target !== pathname) {
      window.history.replaceState(window.history.state, "", `${target}${search}${hash}`);
    }

    const title = titlesRef.current?.[next];
    if (title) document.title = title;
  }, []);

  const registerTitles = useCallback((titles: Titles | null) => {
    titlesRef.current = titles;
  }, []);

  const value = useMemo(() => ({ locale, setLocale, registerTitles }), [locale, setLocale, registerTitles]);
  return <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>;
}

export function useLocale(): Locale {
  return useContext(LocaleContext).locale;
}

export function useSetLocale(): (next: Locale) => void {
  return useContext(LocaleContext).setLocale;
}

/**
 * Rendered once per page with its document title in both languages, so an
 * instant language switch also swaps the browser tab title.
 */
export function PageTitles({ en, fr }: Titles) {
  const { registerTitles } = useContext(LocaleContext);
  useEffect(() => {
    registerTitles({ en, fr });
    return () => registerTitles(null);
  }, [registerTitles, en, fr]);
  return null;
}
