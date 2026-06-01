"use client";

/* eslint-disable @next/next/no-img-element */
import { useMemo, useState } from "react";
import { portfolioItems, PortfolioFilter } from "@/data/portfolio";
import Lightbox, { LightboxSlide } from "./Lightbox";
import { useLanguage } from "@/lib/i18n";

export default function Portfolio() {
  const { t } = useLanguage();
  const p = t.portfolio;

  const FILTERS: { label: string; value: "*" | PortfolioFilter }[] = [
    { label: p.filters.all, value: "*" },
    { label: p.filters.apps, value: "filter-app" },
    { label: p.filters.landingPages, value: "filter-card" },
    { label: p.filters.websites, value: "filter-web" },
  ];

  const [activeFilter, setActiveFilter] = useState<"*" | PortfolioFilter>("*");
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const visibleItems = useMemo(
    () =>
      activeFilter === "*"
        ? portfolioItems
        : portfolioItems.filter((item) => item.filter === activeFilter),
    [activeFilter]
  );

  // The lightbox gallery follows whatever is currently filtered in view.
  const slides: LightboxSlide[] = useMemo(
    () =>
      visibleItems.map((item) => ({
        src: item.lightboxImg ?? item.img,
        caption: item.caption,
      })),
    [visibleItems]
  );

  return (
    <section id="portfolio" className="portfolio section-bg">
      <div className="container" data-aos="fade-up">
        <div className="section-title">
          <h2>{p.title}</h2>
          <p>{p.description}</p>
        </div>

        <div className="row">
          <div
            className="col-lg-12 d-flex justify-content-center"
            data-aos="fade-up"
            data-aos-delay="100"
          >
            <ul id="portfolio-flters">
              {FILTERS.map((f) => (
                <li
                  key={f.value}
                  className={activeFilter === f.value ? "filter-active" : ""}
                  onClick={() => setActiveFilter(f.value)}
                >
                  {f.label}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div
          className="row portfolio-container"
          data-aos="fade-up"
          data-aos-delay="200"
        >
          {visibleItems.map((item, i) => (
            <div
              key={item.title}
              className={`col-lg-4 col-md-6 portfolio-item ${item.filter}`}
            >
              <div className="portfolio-wrap">
                <img src={item.img} className="img-fluid" alt={item.title} />
                <div className="portfolio-info">
                  <h4>{item.title}</h4>
                  <p>
                    <a
                      href={item.url}
                      target={item.external ? "_blank" : undefined}
                      rel={item.external ? "noopener noreferrer" : undefined}
                    >
                      {item.displayUrl ?? item.url}
                    </a>
                  </p>
                  <div className="portfolio-links">
                    <button
                      type="button"
                      className="portfolio-lightbox"
                      title={item.caption}
                      onClick={() => setLightboxIndex(i)}
                      aria-label={`Preview ${item.title}`}
                    >
                      <i className="bx bx-search-alt" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <Lightbox slides={slides} index={lightboxIndex} onChange={setLightboxIndex} />
    </section>
  );
}
