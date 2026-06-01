"use client";

/* eslint-disable @next/next/no-img-element */
import { useLanguage } from "@/lib/i18n";

export default function About() {
  const { t } = useLanguage();
  const a = t.about;

  return (
    <section id="about" className="about">
      <div className="container" data-aos="fade-up">
        <div className="section-title">
          <h2>{a.title}</h2>
          <p>
            {a.tagline}
            <br />{a.builtFirst}
          </p>
        </div>

        <div className="row">
          <div className="col-lg-4">
            <img src="/assets/img/ah-ha.png" className="img-fluid" alt="" />
          </div>
          <div className="col-lg-8 pt-4 pt-lg-0 content">
            <h3>{a.subtitle}</h3>
            <p className="fst-italic">
              {a.intro} <br />
              {a.recruitLine} <br />
              {a.resumePrompt}{" "}
              <a href="#resume" className="scrollto">
                {a.resumeLink}
              </a>
              . <br />
            </p>
            <div className="row">
              <div className="col-lg-6">
                <ul>
                  <li>
                    <i className="bi bi-chevron-right" /> <strong>{a.labels.website}:</strong>{" "}
                    <span>www.webman.dev</span>
                  </li>
                  <li>
                    <i className="bi bi-chevron-right" /> <strong>{a.labels.phone}:</strong>{" "}
                    <span>+1 514-318-8025</span>
                  </li>
                  <li>
                    <i className="bi bi-chevron-right" /> <strong>{a.labels.city}:</strong>{" "}
                    <span>Montreal, CA</span>
                  </li>
                </ul>
              </div>
              <div className="col-lg-6">
                <ul>
                  <li>
                    <i className="bi bi-chevron-right" />{" "}
                    <strong>{a.labels.education}:</strong> <span>{a.values.education}</span>
                  </li>
                  <li>
                    <i className="bi bi-chevron-right" /> <strong>{a.labels.email}:</strong>{" "}
                    <span>nick.desjardins@live.com</span>
                  </li>
                  <li>
                    <i className="bi bi-chevron-right" />{" "}
                    <strong>{a.labels.freelance}:</strong> <span>{a.values.freelance}</span>
                  </li>
                </ul>
              </div>
            </div>
            <p>
              {a.bio1} <br />
              {a.bio2} <br />
              <br />
              &quot;{a.quote}&quot; ― {a.quoteAuthor}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
