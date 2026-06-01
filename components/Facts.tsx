"use client";

import { useEffect, useRef, useState } from "react";
import { useLanguage } from "@/lib/i18n";

/** Animated count-up that triggers when scrolled into view (replaces PureCounter). */
function CountUp({
  end,
  decimals = 0,
  duration = 1000,
}: {
  end: number;
  decimals?: number;
  duration?: number;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const [value, setValue] = useState(0);
  const started = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !started.current) {
          started.current = true;
          const start = performance.now();
          const tick = (now: number) => {
            const progress = Math.min((now - start) / duration, 1);
            setValue(end * progress);
            if (progress < 1) requestAnimationFrame(tick);
          };
          requestAnimationFrame(tick);
        }
      },
      { threshold: 0.4 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [end, duration]);

  return <span ref={ref}>{value.toFixed(decimals)}</span>;
}

/** Live count of hours of support since the company opened (Dec 31, 2011). */
function LiveHours() {
  const [hours, setHours] = useState<number | null>(null);

  useEffect(() => {
    const startStamp = new Date(2012, 0, 0).getTime();
    const update = () => {
      const diff = Math.round((Date.now() - startStamp) / 1000);
      setHours(Math.floor(diff / (60 * 60)));
    };
    update();
    const timer = setInterval(update, 1000);
    return () => clearInterval(timer);
  }, []);

  return <span id="time-elapsed">{hours ?? ""}</span>;
}

export default function Facts() {
  const { t } = useLanguage();
  const f = t.facts;

  return (
    <section id="facts" className="facts">
      <div className="container" data-aos="fade-up">
        <div className="section-title">
          <h2>{f.title}</h2>
          <p>
            {f.description1}{" "}
            <br />
            {f.description2} <br />
            {f.description3}
          </p>
        </div>

        <div className="row">
          <div className="col-lg-3 col-md-6">
            <div className="count-box">
              <i className="bi bi-award" />
              <CountUp end={20} />
              <p>{f.yearsOfStudies}</p>
            </div>
          </div>

          <div className="col-lg-3 col-md-6 mt-5 mt-lg-0">
            <div className="count-box">
              <i className="bi bi-headset" />
              <LiveHours />
              <p>{f.hoursOfSupport}</p>
            </div>
          </div>

          <div className="col-lg-3 col-md-6 mt-5 mt-md-0">
            <div className="count-box">
              <i className="bi bi-emoji-smile" />
              <CountUp end={98.94} decimals={2} />
              <p>{f.happyCustomers}</p>
            </div>
          </div>

          <div className="col-lg-3 col-md-6 mt-5 mt-lg-0">
            <div className="count-box">
              <i className="bi bi-journal-richtext" />
              <CountUp end={68.6} decimals={1} />
              <p>{f.statsLies}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
