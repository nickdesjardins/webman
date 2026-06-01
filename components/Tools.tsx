"use client";

/* eslint-disable @next/next/no-img-element */
import { tools } from "@/data/tools";
import { useLanguage } from "@/lib/i18n";

export default function Tools() {
  const { t } = useLanguage();

  return (
    <section id="services" className="services">
      <div className="container" data-aos="fade-up">
        <div className="section-title">
          <h2>{t.tools.title}</h2>
          <p>
            {t.tools.description1} <br />
            {t.tools.description2}
          </p>
        </div>

        <div className="grid">
          {tools.map((tool) => (
            <div key={tool.name} data-aos="zoom-in" data-aos-delay="50">
              <a
                className="toolsLink"
                href={tool.href}
                target="_blank"
                rel="noopener noreferrer"
              >
                <div className="icon-box">
                  <p style={{ fontSize: 0 }}> </p>
                  <div className="icon">
                    <img src={tool.img} alt={tool.name} />
                  </div>
                  <h4>{tool.name}</h4>
                </div>
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
