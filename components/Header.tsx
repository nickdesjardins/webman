"use client";

import { useEffect, useState } from "react";
import { useLanguage } from "@/lib/i18n";

export default function Header() {
  const { t, lang, setLang } = useLanguage();
  const [mobileNavActive, setMobileNavActive] = useState(false);
  const [activeSection, setActiveSection] = useState("hero");

  const NAV_LINKS = [
    { hash: "hero", label: t.nav.home, icon: "bx-home" },
    { hash: "about", label: t.nav.about, icon: "bx-user" },
    { hash: "resume", label: t.nav.resume, icon: "bx-file-blank" },
    { hash: "portfolio", label: t.nav.portfolio, icon: "bx-book-content" },
    { hash: "services", label: t.nav.tools, icon: "bx-server" },
    { hash: "contact", label: t.nav.contact, icon: "bx-envelope" },
  ];

  // Toggle the body class the template's CSS uses to slide the mobile nav in.
  useEffect(() => {
    document.body.classList.toggle("mobile-nav-active", mobileNavActive);
  }, [mobileNavActive]);

  // Scrollspy: highlight the nav link of the section currently in view.
  useEffect(() => {
    const sectionIds = NAV_LINKS.map((l) => l.hash);
    const onScroll = () => {
      const position = window.scrollY + 200;
      for (const id of sectionIds) {
        const section = document.getElementById(id);
        if (!section) continue;
        if (
          position >= section.offsetTop &&
          position <= section.offsetTop + section.offsetHeight
        ) {
          setActiveSection(id);
        }
      }
    };
    onScroll();
    document.addEventListener("scroll", onScroll);
    return () => document.removeEventListener("scroll", onScroll);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lang]);

  const handleNavClick = (
    e: React.MouseEvent<HTMLAnchorElement>,
    hash: string
  ) => {
    const section = document.getElementById(hash);
    if (!section) return;
    e.preventDefault();
    setMobileNavActive(false);
    window.scrollTo({ top: section.offsetTop, behavior: "smooth" });
  };

  return (
    <>
      <i
        className={`bi ${mobileNavActive ? "bi-x" : "bi-list"} mobile-nav-toggle d-xl-none`}
        onClick={() => setMobileNavActive((v) => !v)}
        role="button"
        aria-label="Toggle navigation"
      />

      <header id="header" className="d-flex flex-column justify-content-center">
        <nav id="navbar" className="navbar nav-menu">
          <ul>
            {NAV_LINKS.map((link) => (
              <li key={link.hash}>
                <a
                  href={`#${link.hash}`}
                  className={`nav-link scrollto${
                    activeSection === link.hash ? " active" : ""
                  }`}
                  onClick={(e) => handleNavClick(e, link.hash)}
                >
                  <i className={`bx ${link.icon}`} /> <span>{link.label}</span>
                </a>
              </li>
            ))}
            <li>
              <button
                className="nav-link lang-toggle"
                onClick={() => setLang(lang === "en" ? "fr" : "en")}
                aria-label={`Switch to ${t.nav.switchTo}`}
              >
                <i className="bx bx-globe" /> <span>{t.nav.switchTo}</span>
              </button>
            </li>
          </ul>
        </nav>
      </header>
    </>
  );
}
