"use client";

import { useEffect, useState } from "react";

const NAV_LINKS = [
  { hash: "hero", label: "Home", icon: "bx-home" },
  { hash: "about", label: "About", icon: "bx-user" },
  { hash: "resume", label: "Resume", icon: "bx-file-blank" },
  { hash: "portfolio", label: "Portfolio", icon: "bx-book-content" },
  { hash: "services", label: "Tools", icon: "bx-server" },
  { hash: "contact", label: "Contact", icon: "bx-envelope" },
];

export default function Header() {
  const [mobileNavActive, setMobileNavActive] = useState(false);
  const [activeSection, setActiveSection] = useState("hero");

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
  }, []);

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
          </ul>
        </nav>
      </header>
    </>
  );
}
