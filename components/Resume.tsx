"use client";

import { useLanguage } from "@/lib/i18n";

export default function Resume() {
  const { t } = useLanguage();
  const r = t.resume;

  return (
    <section id="resume" className="resume">
      <div className="container" data-aos="fade-up">
        <div className="section-title">
          <h2>{r.title}</h2>
        </div>

        <div className="row">
          <div className="col-lg-6">
            <h3 className="resume-title">{r.summary}</h3>
            <div className="resume-item pb-0">
              <h4>Nicolas Desjardins</h4>
              <p>
                <em>{r.summaryBody}</em>
              </p>
              <ul>
                <li>3405 F.-X.-Tessier, Vaudreuil-Dorion (Québec) Canada, J7V 5V5</li>
                <li>1 800 268-9486 ext. 285</li>
                <li>desjardinsn@newrootsherbal.com</li>
              </ul>
            </div>

            <h3 className="resume-title">{r.education}</h3>
            {r.educationItems.map((item) => (
              <div key={item.degree} className="resume-item">
                <h4>{item.degree}</h4>
                <h5>{item.period}</h5>
                <p><em>{item.institution}</em></p>
                <p>{item.description}</p>
              </div>
            ))}

            <h3 className="resume-title">{r.canadianForces}</h3>
            {r.forcesItems.map((item) => (
              <div key={item.title} className="resume-item">
                <h4>{item.title}</h4>
                <h5>{item.period}</h5>
                <p><em>{item.institution}</em></p>
                <ul>
                  {item.bullets.map((b, i) => <li key={i}>{b}</li>)}
                </ul>
              </div>
            ))}
          </div>

          <div className="col-lg-6">
            <h3 className="resume-title">{r.experience}</h3>
            {r.experienceItems.map((item) => (
              <div key={item.title} className="resume-item">
                <h4>{item.title}</h4>
                <h5>{item.period}</h5>
                <p><em>{item.institution}</em></p>
                <ul>
                  {item.bullets.map((b, i) => <li key={i}>{b}</li>)}
                </ul>
              </div>
            ))}
            <br />
            <a href="/assets/resume.pdf" target="_blank" className="dldBtn">
              <i className="bi bi-download" /> {r.downloadPdf}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
