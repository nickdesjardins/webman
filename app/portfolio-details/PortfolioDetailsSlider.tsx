"use client";

/* eslint-disable @next/next/no-img-element */
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";

const SLIDES = [
  "/assets/img/portfolio/portfolio-details-1.jpg",
  "/assets/img/portfolio/portfolio-details-2.jpg",
  "/assets/img/portfolio/portfolio-details-3.jpg",
];

export default function PortfolioDetailsSlider() {
  return (
    <Swiper
      className="portfolio-details-slider"
      modules={[Autoplay, Pagination]}
      speed={400}
      loop
      autoplay={{ delay: 5000, disableOnInteraction: false }}
      pagination={{ clickable: true }}
    >
      {SLIDES.map((src) => (
        <SwiperSlide key={src}>
          <img src={src} alt="" />
        </SwiperSlide>
      ))}
    </Swiper>
  );
}
