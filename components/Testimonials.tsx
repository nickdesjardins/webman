"use client";

/* eslint-disable @next/next/no-img-element */
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";

interface Testimonial {
  name: string;
  role: string;
  img: string;
  /** Body split into paragraphs; line breaks within a paragraph use <br/>. */
  body: React.ReactNode;
}

const TESTIMONIALS: Testimonial[] = [
  {
    name: "Neil Abbott",
    role: "Marketing Manager",
    img: "/assets/img/testimonials/neil.jpg",
    body: (
      <>
        Nicolas was my direct report from April 2019 to Nov. 2020. <br />
        <br />
        Highly competent. Nicolas is an effective problem solver who is extremely
        responsive to changing market conditions. This combined with his polished
        writing/presentation skills and can do attitude makes him a natural team
        leader.
        <br />
        <br />
        When the COVID-19 pandemic hit, Nicolas seized the opportunity and was
        successful in creating, securing approval, and executing initiatives that
        generated $300,000+ of incremental sales in one month for a product that
        had $32,000 of annual sales.
        <br />
        <br />
        I can recommend Nicolas without reservation.
      </>
    ),
  },
  {
    name: "Rajwinder Rajashansi",
    role: "Software Engineer",
    img: "/assets/img/testimonials/pic.jpg",
    body: (
      <>
        I&apos;ve collaborated with Nic on numerous projects at New Roots Herbal
        Inc and I have to say it&apos;s been my utmost pleasure working with him.{" "}
        <br />
        His professionalism and attention to detail is second to none and he gives
        it his all, no matter how difficult, easy or mundane a task may be. <br />
        Nic&apos;s an incredible team player, as he&apos;s always had my back and I
        can always count on him, no matter the circumstance or situation. <br />
        His passion for web development and unending thirst for learning a new
        skill set or acquiring knowledge is what makes it so easy to work with him.{" "}
        <br />
        <br />
        Anyone who is lucky enough to employ his skills will be one lucky client or
        employer!
      </>
    ),
  },
  {
    name: "Chrisanell Salazar",
    role: "Digital & Social Media Specialist",
    img: "/assets/img/testimonials/chrissy.jpg",
    body: (
      <>
        With many skills under his belt, Nicolas is a Jack of all trades. <br />
        His ability to communicate clearly and his problem-solving skills makes him
        a valuable teammate in the Marketing team. <br />
        With his extensive knowledge, collaboration with him for any project is a
        breath of fresh air. <br />
        His biggest strength is his ability to deal with conflicting priorities in
        any situation. <br />
        He also has a big willing to learn - a valuable asset in the tech industry.{" "}
        <br />
        <br />
        Highly recommend Nicolas to get the job well done!
      </>
    ),
  },
  {
    name: "Francis Fontaine",
    role: "Corporal",
    img: "/assets/img/testimonials/fontaine.jpg",
    body: (
      <>
        We served together in the Canadian Armed Forces. <br />
        Nicolas was an exemplary soldier. Always on point and on time. <br />
        Great team player and showed leadership. <br />
        He will always be my first call when I have computer problems. <br />
        <br />
        Nicolas can be an asset for any project he puts his heart into.
      </>
    ),
  },
];

export default function Testimonials() {
  return (
    <section id="testimonials" className="testimonials section-bg">
      <div className="container" data-aos="fade-up">
        <div className="section-title">
          <h2>Testimonials</h2>
        </div>

        <Swiper
          className="testimonials-slider"
          modules={[Autoplay, Pagination]}
          speed={600}
          loop
          autoplay={{ delay: 5000, disableOnInteraction: false }}
          slidesPerView={1}
          autoHeight
          pagination={{ clickable: true }}
          data-aos="fade-up"
          data-aos-delay="100"
        >
          {TESTIMONIALS.map((t) => (
            <SwiperSlide key={t.name}>
              <div className="testimonial-item">
                <img src={t.img} className="testimonial-img" alt={t.name} />
                <h3>{t.name}</h3>
                <h4>{t.role}</h4>
                <p>
                  <i className="bx bxs-quote-alt-left quote-icon-left" />
                  {t.body}
                  <i className="bx bxs-quote-alt-right quote-icon-right" />
                </p>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
}
