"use client";
import React from "react";
import { motion } from "framer-motion";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import { Autoplay, Pagination, Navigation } from "swiper/modules";
import Image from "next/image";

// ✅ Slides data array
const slides = [
  {
    image:
      "https://surgmedia.com/wp-content/uploads/2020/10/2171-blood-donation.jpg",
    slogan: "Donate Blood, Save Lives",
    quote: "Every drop you give brings hope to someone in need.",
  },
  {
    image:
      "https://surgmedia.com/wp-content/uploads/2020/10/2171-blood-donation.jpg",
    slogan: "Be a Lifesaver Today",
    quote: "Heroes aren't always in capes — sometimes, they're blood donors.",
  },
  {
    image:
      "https://surgmedia.com/wp-content/uploads/2020/10/2171-blood-donation.jpg",
    slogan: "Your Health, Our Priority",
    quote: "Together we build a healthier tomorrow.",
  },
];

export default function HeroSection() {
  return (
    <section className="hero-section max-w-[92vw] py-8 sm:py-10 md:py-16">
      <motion.div
        className="text-center mb-6 sm:mb-8"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          duration: 0.6,
          type: "spring",
          stiffness: 80,
          damping: 18,
        }}
      >
        <h1 className="text-2xl xs:text-3xl sm:text-4xl md:text-5xl font-bold text-primary">
          Welcome to VitaDrop
        </h1>
        <p className="text-base xs:text-lg md:text-xl text-gray-600 mt-3">
          Join the movement to save lives
        </p>
      </motion.div>

      <div className="w-full">
        <Swiper
          spaceBetween={16}
          centeredSlides={true}
          autoplay={{
            delay: 3000,
            disableOnInteraction: false,
          }}
          pagination={{
            clickable: true,
          }}
          navigation={true}
          modules={[Autoplay, Pagination, Navigation]}
          className="mySwiper w-full h-[220px] xs:h-[260px] sm:h-[320px] md:h-[400px] rounded-lg shadow-xl"
        >
          {slides.map((slide, index) => (
            <SwiperSlide key={index}>
              <motion.div
                className="relative w-full h-[220px] xs:h-[260px] sm:h-[320px] md:h-[400px] rounded-lg overflow-hidden"
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{
                  duration: 0.5,
                  type: "spring",
                  stiffness: 120,
                  damping: 18,
                }}
              >
                <Image
                  src={slide.image}
                  alt={slide.slogan}
                  fill
                  className="object-cover"
                  blurDataURL="https://via.placeholder.com/800x400?text=Loading"
                  priority
                />
                <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center text-center p-2 xs:p-4">
                  <h2 className="text-white text-lg xs:text-2xl sm:text-3xl md:text-4xl opacity-100 font-bold mb-2 drop-shadow-lg">
                    {slide.slogan}
                  </h2>
                  <p className="text-white text-xs xs:text-base md:text-lg opacity-90 drop-shadow-md max-w-xs xs:max-w-md md:max-w-xl">
                    {slide.quote}
                  </p>
                </div>
              </motion.div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
}
