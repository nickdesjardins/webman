"use client";

import { useEffect, useRef, useState } from "react";

const SKILLS_LEFT = [
  { name: "HTML5", value: 100 },
  { name: "CSS3 / SCSS", value: 95 },
  { name: "JavaScript", value: 90 },
];

const SKILLS_RIGHT = [
  { name: "PHP", value: 85 },
  { name: "Angular / React / Laravel", value: 80 },
  { name: "WordPress / Drupal", value: 75 },
];

function Skill({ name, value, animate }: { name: string; value: number; animate: boolean }) {
  return (
    <div className="progress">
      <span className="skill">
        {name} <i className="val">{value}%</i>
      </span>
      <div className="progress-bar-wrap">
        <div
          className="progress-bar"
          role="progressbar"
          aria-valuenow={value}
          aria-valuemin={0}
          aria-valuemax={100}
          style={{ width: animate ? `${value}%` : "0%" }}
        />
      </div>
    </div>
  );
}

export default function Skills() {
  const contentRef = useRef<HTMLDivElement>(null);
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    const el = contentRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setAnimate(true);
          observer.disconnect();
        }
      },
      { threshold: 0.2 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <section id="skills" className="skills section-bg">
      <div className="container" data-aos="fade-up">
        <div className="section-title">
          <h2>Skills</h2>
          <p>
            This is only an overview of the many skills, languages, frameworks
            and other knowledge aquired through the years. <br />
            See more in the{" "}
            <a href="#services" className="scrollto">
              tools
            </a>{" "}
            section.
          </p>
        </div>

        <div className="row skills-content" ref={contentRef}>
          <div className="col-lg-6">
            {SKILLS_LEFT.map((s) => (
              <Skill key={s.name} {...s} animate={animate} />
            ))}
          </div>
          <div className="col-lg-6">
            {SKILLS_RIGHT.map((s) => (
              <Skill key={s.name} {...s} animate={animate} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
