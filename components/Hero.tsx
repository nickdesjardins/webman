"use client";

import { useEffect, useRef } from "react";
import Typed from "typed.js";

const TYPED_STRINGS = [
  "Software Developer",
  "Digital Marketer",
  "UX Designer",
  "Front End Developer",
  "Back End Developer",
  "Fullstack Developer",
  "Photo Editor",
  "Music Producer",
  "Video Editor",
  "... your next hire!",
];

const SOCIALS = [
  { href: "https://github.com/nickdesjardins", cls: "twitter", icon: "bxl-github" },
  { href: "https://www.facebook.com/desjardins.nick/", cls: "facebook", icon: "bxl-facebook" },
  { href: "https://www.linkedin.com/in/nicolas-desjardins/", cls: "linkedin", icon: "bxl-linkedin" },
  { href: "https://www.youtube.com/channel/UClgIfTUZnrCOw81q-xSOVGA", cls: "instagram", icon: "bxl-youtube" },
  { href: "https://www.twitch.tv/qcteamnick", cls: "google-plus", icon: "bxl-twitch" },
];

export default function Hero() {
  const typedEl = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (!typedEl.current) return;
    const typed = new Typed(typedEl.current, {
      strings: TYPED_STRINGS,
      loop: true,
      typeSpeed: 100,
      backSpeed: 50,
      backDelay: 2000,
    });
    return () => typed.destroy();
  }, []);

  return (
    <section id="hero" className="d-flex flex-column justify-content-center">
      <div className="container" data-aos="zoom-in" data-aos-delay="100">
        <h1>Nicolas Desjardins</h1>
        <p>
          I&apos;m a <span className="typed" ref={typedEl} />
        </p>
        <div className="social-links">
          {SOCIALS.map((s) => (
            <a
              key={s.icon}
              href={s.href}
              target="_blank"
              rel="noopener noreferrer"
              className={s.cls}
            >
              <i className={`bx ${s.icon}`} />
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
