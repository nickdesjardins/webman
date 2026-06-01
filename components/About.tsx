/* eslint-disable @next/next/no-img-element */
export default function About() {
  return (
    <section id="about" className="about">
      <div className="container" data-aos="fade-up">
        <div className="section-title">
          <h2>About</h2>
          <p>
            Technology is my passion. Programming is my language. Success is my
            legacy.
            <br />I built my first website in 2004 and never stopped sharpening
            my skills.
          </p>
        </div>

        <div className="row">
          <div className="col-lg-4">
            <img src="/assets/img/ah-ha.png" className="img-fluid" alt="" />
          </div>
          <div className="col-lg-8 pt-4 pt-lg-0 content">
            <h3>Digital Marketer &amp; Fullstack Developer.</h3>
            <p className="fst-italic">
              This is me. I made this website for fun and laughter. <br />
              Who said recruting a developer should be a boring task? <br />
              If you wanted to see only the corporate side of me, here&apos;s my{" "}
              <a href="#resume" className="scrollto">
                resume
              </a>
              . <br />
            </p>
            <div className="row">
              <div className="col-lg-6">
                <ul>
                  <li>
                    <i className="bi bi-chevron-right" /> <strong>Website:</strong>{" "}
                    <span>www.webman.dev</span>
                  </li>
                  <li>
                    <i className="bi bi-chevron-right" /> <strong>Phone:</strong>{" "}
                    <span>+1 514-318-8025</span>
                  </li>
                  <li>
                    <i className="bi bi-chevron-right" /> <strong>City:</strong>{" "}
                    <span>Montreal, CA</span>
                  </li>
                </ul>
              </div>
              <div className="col-lg-6">
                <ul>
                  <li>
                    <i className="bi bi-chevron-right" />{" "}
                    <strong>Highest Education:</strong> <span>University</span>
                  </li>
                  <li>
                    <i className="bi bi-chevron-right" /> <strong>Email:</strong>{" "}
                    <span>nick.desjardins@live.com</span>
                  </li>
                  <li>
                    <i className="bi bi-chevron-right" />{" "}
                    <strong>Freelance:</strong> <span>Available</span>
                  </li>
                </ul>
              </div>
            </div>
            <p>
              I&apos;ve been working at New Roots Herbal inc. since November
              2018, managing every aspect of our web presence. <br />
              From websites to digital ads, social media to internal networking.
              What I do not know, I learn. <br />
              <br />
              “Don&apos;t tell me the sky&apos;s the limit when there are
              footprints on the moon.” ― Paul Brandt
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
