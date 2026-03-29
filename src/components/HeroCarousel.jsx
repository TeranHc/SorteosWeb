"use client";

import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const HeroCarousel = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlay, setIsAutoPlay] = useState(true);

  const slides = [
    {
      id: 1,
      title: "Gran Rifa de Año Nuevo",
      subtitle: "Gana hasta $100,000 en premios exclusivos",
      cta: "Compra tus boletos",
      image: "linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)",
      overlay: "rgba(0, 0, 0, 0.4)",
      accentColor: "from-red-600 to-red-500",
      icon: "🎰",
    },
    {
      id: 2,
      title: "Escapada de Lujo",
      subtitle: "Viaje para 2 personas a Galápagos + $5,000 en efectivo",
      cta: "Ver detalles del premio",
      image: "linear-gradient(135deg, #0f3460 0%, #16213e 100%)",
      overlay: "rgba(0, 0, 0, 0.5)",
      accentColor: "from-blue-500 to-blue-400",
      icon: "✈️",
    },
    {
      id: 3,
      title: "Ganadores de Hoy",
      subtitle: "Celebra con nuestros últimos afortunados ganadores",
      cta: "Ver ganadores",
      image: "linear-gradient(135deg, #2d1b3d 0%, #16213e 100%)",
      overlay: "rgba(0, 0, 0, 0.45)",
      accentColor: "from-yellow-400 to-yellow-300",
      icon: "👑",
    },
    {
      id: 4,
      title: "¡Últimas Oportunidades!",
      subtitle: "Solo quedan 47 números disponibles en este sorteo",
      cta: "Actúa ahora",
      image: "linear-gradient(135deg, #1a1a2e 0%, #0f3460 100%)",
      overlay: "rgba(0, 0, 0, 0.55)",
      accentColor: "from-orange-500 to-red-600",
      icon: "⏰",
    },
  ];

  // Auto-play carousel
  useEffect(() => {
    if (!isAutoPlay) return;

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [isAutoPlay, slides.length]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
    setIsAutoPlay(false);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
    setIsAutoPlay(false);
  };

  const goToSlide = (index) => {
    setCurrentSlide(index);
    setIsAutoPlay(false);
  };

  const handleMouseEnter = () => setIsAutoPlay(false);
  const handleMouseLeave = () => setIsAutoPlay(true);

  const slide = slides[currentSlide];

  return (
    <div
      className="relative w-full h-screen min-h-[600px] overflow-hidden bg-gray-950"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Carousel Container */}
      <div className="relative w-full h-full">
        {slides.map((s, index) => (
          <div
            key={s.id}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              index === currentSlide ? "opacity-100 z-10" : "opacity-0 z-0"
            }`}
          >
            {/* Background Image/Gradient */}
            <div
              className="absolute inset-0 bg-cover bg-center"
              style={{
                background: s.image,
              }}
            />

            {/* Overlay Gradient for Readability */}
            <div
              className="absolute inset-0"
              style={{
                background: `radial-gradient(ellipse at bottom right, rgba(0, 0, 0, 0.3), ${s.overlay})`,
              }}
            />

            {/* Additional gradient overlay for luxury effect */}
            <div
              className="absolute inset-0"
              style={{
                background:
                  "linear-gradient(90deg, rgba(0, 0, 0, 0.6) 0%, transparent 50%, rgba(0, 0, 0, 0.6) 100%)",
              }}
            />

            {/* Content Container */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="relative z-20 text-center px-4 sm:px-6 md:px-12 max-w-4xl mx-auto">
                {/* Icon */}
                <div className="text-6xl sm:text-7xl md:text-8xl mb-4 sm:mb-6 drop-shadow-lg animate-pulse">
                  {s.icon}
                </div>

                {/* Title */}
                <h1
                  className={`text-4xl sm:text-5xl md:text-7xl font-black mb-3 sm:mb-4 md:mb-6 drop-shadow-xl tracking-tighter`}
                  style={{
                    background: `linear-gradient(90deg, #fbbf24 0%, #fbbf24 50%, #ef4444 100%)`,
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                    textShadow:
                      "2px 2px 4px rgba(0, 0, 0, 0.8), 4px 4px 8px rgba(0, 0, 0, 0.6)",
                  }}
                >
                  {s.title}
                </h1>

                {/* Subtitle */}
                <p className="text-lg sm:text-xl md:text-2xl text-gray-100 mb-6 sm:mb-8 md:mb-10 font-light drop-shadow-lg max-w-2xl mx-auto">
                  {s.subtitle}
                </p>

                {/* CTA Button */}
                <div className="flex justify-center gap-4 sm:gap-6">
                  <button
                    className={`bg-gradient-to-r ${s.accentColor} hover:shadow-2xl hover:shadow-red-500/50 text-white font-bold py-3 sm:py-4 px-6 sm:px-10 md:px-12 rounded-lg text-base sm:text-lg md:text-xl transition-all duration-300 transform hover:scale-105 active:scale-95 drop-shadow-lg border-2 border-transparent hover:border-white`}
                  >
                    {s.cta}
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Navigation Arrows */}
      <button
        onClick={prevSlide}
        className="absolute left-4 sm:left-6 md:left-8 top-1/2 -translate-y-1/2 z-30 bg-white/20 hover:bg-white/40 text-white p-2 sm:p-3 md:p-4 rounded-full backdrop-blur-sm transition-all duration-300 group border border-white/30 hover:border-white/60"
        aria-label="Previous slide"
      >
        <ChevronLeft className="w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10 group-hover:scale-110 transition-transform" />
      </button>

      <button
        onClick={nextSlide}
        className="absolute right-4 sm:right-6 md:right-8 top-1/2 -translate-y-1/2 z-30 bg-white/20 hover:bg-white/40 text-white p-2 sm:p-3 md:p-4 rounded-full backdrop-blur-sm transition-all duration-300 group border border-white/30 hover:border-white/60"
        aria-label="Next slide"
      >
        <ChevronRight className="w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10 group-hover:scale-110 transition-transform" />
      </button>

      {/* Dots Indicators */}
      <div className="absolute bottom-6 sm:bottom-8 md:bottom-10 left-1/2 -translate-x-1/2 z-30 flex gap-2 sm:gap-3">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`transition-all duration-300 rounded-full backdrop-blur-sm border border-white/50 ${
              index === currentSlide
                ? "w-8 h-3 sm:w-10 sm:h-3 md:w-12 md:h-3 bg-gradient-to-r from-yellow-400 to-red-500"
                : "w-3 h-3 sm:w-3 sm:h-3 bg-white/40 hover:bg-white/60"
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>

      {/* Slide Counter */}
      <div className="absolute top-6 sm:top-8 md:top-10 right-6 sm:right-8 md:right-10 z-30 text-white text-sm sm:text-base font-mono bg-black/40 px-3 sm:px-4 py-2 rounded-full backdrop-blur-sm border border-white/30">
        {String(currentSlide + 1).padStart(2, "0")} / {String(slides.length).padStart(2, "0")}
      </div>

      {/* Decorative Elements */}
      <div className="absolute top-0 left-0 w-32 h-32 sm:w-48 sm:h-48 bg-gradient-to-br from-yellow-500/10 to-transparent blur-3xl pointer-events-none z-5" />
      <div className="absolute bottom-0 right-0 w-40 h-40 sm:w-64 sm:h-64 bg-gradient-to-tl from-red-500/10 to-transparent blur-3xl pointer-events-none z-5" />
    </div>
  );
};

export default HeroCarousel;
