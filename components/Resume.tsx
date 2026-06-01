export default function Resume() {
  return (
    <section id="resume" className="resume">
      <div className="container" data-aos="fade-up">
        <div className="section-title">
          <h2>Resume</h2>
        </div>

        <div className="row">
          <div className="col-lg-6">
            <h3 className="resume-title">Sumary</h3>
            <div className="resume-item pb-0">
              <h4>Nicolas Desjardins</h4>
              <p>
                <em>
                  Passionate and devoted. I will lose sleep thinking about how to
                  stay ahead of the competition and at the cutting edge of
                  technology. <br />
                  Working currently at New Roots Herbal inc.:
                </em>
              </p>
              <ul>
                <li>
                  3405 F.-X.-Tessier, Vaudreuil-Dorion (Québec) Canada, J7V 5V5
                </li>
                <li>1 800 268-9486 ext. 285</li>
                <li>desjardinsn@newrootsherbal.com</li>
              </ul>
            </div>

            <h3 className="resume-title">Education</h3>
            <div className="resume-item">
              <h4>Bach.: Computer Science General Program</h4>
              <h5>2016 - 2018</h5>
              <p>
                <em>Concordia University, Montreal, Qc</em>
              </p>
              <p>
                Started first year on the Software Engineer program. <br />
                Changed for Computer Science and still wasn&apos;t satisfied with
                the class curriculum.
              </p>
            </div>
            <div className="resume-item">
              <h4>DEC: Computer Science</h4>
              <h5>2009 - 2012</h5>
              <p>
                <em>John Abbott College, Sainte-Anne-de-Bellevue, Qc</em>
              </p>
              <p>
                32 classes completed. All classes related to the program are
                completed.
              </p>
            </div>
            <div className="resume-item">
              <h4>Secondary School Diploma</h4>
              <h5>2004 - 2009</h5>
              <p>
                <em>École Secondaire du Chêne-Bleu, Pincourt, Qc</em>
              </p>
              <p>Completed</p>
            </div>

            <h3 className="resume-title">Canadian Forces</h3>
            <div className="resume-item">
              <h4>
                Veteran: RCEME (Royal Canadian Electrical and Mechanical
                Engineers)
              </h4>
              <h5>2013 - 2016</h5>
              <p>
                <em>BFC Valcartier, Quebec</em>
              </p>
              <p>
                Diagnosed and repaired all Canadian Forces fire arms, artillery
                and more. <br />
                Knowledge acquired in soldering, electricity and hydraulics.
                First aid. Discipline.
              </p>
            </div>
          </div>

          <div className="col-lg-6">
            <h3 className="resume-title">Professional Experience</h3>
            <div className="resume-item">
              <h4>Lead Web Developer and Digital Marketer</h4>
              <h5>2018 - Present</h5>
              <p>
                <em>New Roots Herbal inc., Vaudreuil-Dorion, Qc </em>
              </p>
              <ul>
                <li>
                  Lead in the development and implementation of multiple websites
                  and landing pages.
                </li>
                <li>
                  Optimised all websites and landing pages for SEO and load
                  speed.
                </li>
                <li>
                  Migrations of websites to new hosts for speed, convenience and
                  price.
                </li>
                <li>
                  Created web applications for easier, faster and cheaper
                  management. (e.g.: Store Locator, Inventory App, CMS)
                </li>
                <li>
                  Used Facebook and Google Ads to promote products, then used
                  analytics to view efficiency of campaigns.
                </li>
              </ul>
            </div>
            <div className="resume-item">
              <h4>CEO &amp; Chief Technology Officer</h4>
              <h5>2012 - 2018</h5>
              <p>
                <em>PcSquad, Les Coteaux, Qc</em>
              </p>
              <ul>
                <li>Built my own SME (Small and mid-size enterprise)</li>
                <li>Managed financial and legal aspects.</li>
                <li>Managed Marketing and Social Media. (SEO and SEM)</li>
                <li>
                  Built 2 websites for different fronts: Website creator and
                  IT(Technical Support).
                </li>
              </ul>
            </div>
            <div className="resume-item">
              <h4>CTO: Chief Technology Officer and more</h4>
              <h5>2005 - 2018</h5>
              <p>
                <em>Animations Zakiry, Qc</em>
              </p>
              <ul>
                <li>Webmaster and computer technician</li>
                <li>Setting up sound systems.</li>
                <li>Assisting the master of ceremony.</li>
                <li>Co-animate parties.</li>
              </ul>
            </div>
            <br />
            <a href="/assets/resume.pdf" target="_blank" className="dldBtn">
              <i className="bi bi-download" /> Download PDF
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
