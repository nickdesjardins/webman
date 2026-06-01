import type { Metadata } from "next";
import PortfolioDetailsSlider from "./PortfolioDetailsSlider";

export const metadata: Metadata = {
  title: "Portfolio Details - Nicolas Desjardins",
};

export default function PortfolioDetails() {
  return (
    <main id="main">
      <section id="portfolio-details" className="portfolio-details">
        <div className="container">
          <div className="row gy-4">
            <div className="col-lg-8">
              <PortfolioDetailsSlider />
            </div>

            <div className="col-lg-4">
              <div className="portfolio-info">
                <h3>Project information</h3>
                <ul>
                  <li>
                    <strong>Category</strong>: Web design
                  </li>
                  <li>
                    <strong>Client</strong>: ASU Company
                  </li>
                  <li>
                    <strong>Project date</strong>: 01 March, 2020
                  </li>
                  <li>
                    <strong>Project URL</strong>: <a href="#">www.example.com</a>
                  </li>
                </ul>
              </div>
              <div className="portfolio-description">
                <h2>This is an example of portfolio detail</h2>
                <p>
                  Autem ipsum nam porro corporis rerum. Quis eos dolorem eos
                  itaque inventore commodi labore quia quia. Exercitationem
                  repudiandae officiis neque suscipit non officia eaque itaque
                  enim. Voluptatem officia accusantium nesciunt est omnis tempora
                  consectetur dignissimos. Sequi nulla at esse enim cum deserunt
                  eius.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
