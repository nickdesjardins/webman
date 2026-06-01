"use client";

import { useState } from "react";
import { useLanguage } from "@/lib/i18n";

type Status = "idle" | "loading" | "sent" | "error";

export default function Contact() {
  const { t } = useLanguage();
  const c = t.contact;
  const [status, setStatus] = useState<Status>("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus("loading");
    setErrorMessage("");

    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form).entries());

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || c.error);
      setStatus("sent");
      form.reset();
    } catch (err) {
      setStatus("error");
      setErrorMessage(
        err instanceof Error ? err.message : c.error
      );
    }
  };

  return (
    <section id="contact" className="contact">
      <div className="container" data-aos="fade-up">
        <div className="section-title">
          <h2>{c.title}</h2>
        </div>

        <div className="row mt-1">
          <div className="col-lg-4">
            <div className="info">
              <div className="address">
                <i className="bi bi-geo-alt" />
                <h4>{c.location}</h4>
                <p>Les Coteaux, Quebec, J7X 0A4</p>
              </div>

              <div className="email">
                <i className="bi bi-envelope" />
                <h4>{c.email}</h4>
                <p>nick.desjardins@live.com</p>
              </div>

              <div className="phone">
                <i className="bi bi-phone" />
                <h4>{c.call}</h4>
                <p>+1 514-318-8025</p>
              </div>
            </div>
          </div>

          <div className="col-lg-8 mt-5 mt-lg-0">
            <form
              name="WebmanContact"
              onSubmit={handleSubmit}
              className="php-email-form"
            >
              <div className="row">
                <div className="col-md-6 form-group">
                  <input
                    type="text"
                    name="name"
                    className="form-control"
                    id="name"
                    placeholder={c.namePlaceholder}
                    required
                  />
                </div>
                <div className="col-md-6 form-group mt-3 mt-md-0">
                  <input
                    type="email"
                    className="form-control"
                    name="email"
                    id="email"
                    placeholder={c.emailPlaceholder}
                    required
                  />
                </div>
              </div>
              <div className="form-group mt-3">
                <input
                  type="text"
                  className="form-control"
                  name="subject"
                  id="subject"
                  placeholder={c.subjectPlaceholder}
                  required
                />
              </div>
              <div className="form-group mt-3">
                <textarea
                  className="form-control"
                  name="message"
                  rows={5}
                  placeholder={c.messagePlaceholder}
                  required
                />
              </div>
              <div className="my-3">
                {status === "loading" && <div className="loading">{c.loading}</div>}
                {status === "error" && (
                  <div className="error-message">{errorMessage}</div>
                )}
                {status === "sent" && (
                  <div className="sent-message">{c.sent}</div>
                )}
              </div>
              <div className="text-center">
                <button type="submit" disabled={status === "loading"}>
                  {c.send}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
