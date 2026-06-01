/* eslint-disable @next/next/no-img-element */
import { tools } from "@/data/tools";

export default function Tools() {
  return (
    <section id="services" className="services">
      <div className="container" data-aos="fade-up">
        <div className="section-title">
          <h2>Tools: My Kung Fu</h2>
          <p>
            Here&apos;s a list of some Operating System, Softwares, Environments,
            Languages and tools I&apos;ve used. <br />
            In a completely un-ordered list.
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
