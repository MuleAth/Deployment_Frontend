import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Quote } from "lucide-react";

const testimonials = [
  {
    id: 1,
    name: "Atharv Mule",
    role: "Volleyball Team Captain",
    image: "/A.jpg",
    quote: "As a player on the SCOE volleyball team, I've experienced a wealth of growth and success, from memorable victories at Karandak to remarkable performances in university matches.",
  },
  {
    id: 2,
    name: "Atharv Pandhrikar",
    role: "Chess Player",
    image: "/At.jpg",
    quote: "As a chess player at Sinhgad, I've truly flourished in an environment enriched by exceptional training programs and state-of-the-art facilities.",
  },
  {
    id: 3,
    name: "Prof. Niraj Dharmadhikari",
    role: "Ex Physical Director",
    image: "/Ni.jpg",
    quote: "As an ex-physical director, I've witnessed how Sinhgad serves as a phenomenal platform for students to engage and participate actively in sports and physical activities.",
  },
];

const TestimonialsSection = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [autoplay, setAutoplay] = useState(true);

  // Autoplay functionality
  useEffect(() => {
    let interval;
    if (autoplay) {
      interval = setInterval(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % testimonials.length);
      }, 5000);
    }
    return () => clearInterval(interval);
  }, [autoplay]);

  // Pause autoplay on hover
  const handleMouseEnter = () => setAutoplay(false);
  const handleMouseLeave = () => setAutoplay(true);

  const handlePrev = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === 0 ? testimonials.length - 1 : prevIndex - 1
    );
  };

  const handleNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % testimonials.length);
  };

  return (
    <section 
      className="py-16 md:py-20 bg-gradient-to-br from-indigo-50 to-purple-50"
      id="testimonials"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 md:mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3 md:mb-4">
            Student Testimonials
          </h2>
          <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto px-4">
            Hear from our students about their experiences with our sports programs
          </p>
        </div>

        <div className="relative max-w-4xl mx-auto">
          {/* Decorative elements */}
          <div className="absolute -top-4 -left-4 md:-top-6 md:-left-6 w-8 h-8 md:w-12 md:h-12 text-indigo-400 opacity-30 hidden sm:block">
            <Quote size={window.innerWidth < 768 ? 32 : 48} />
          </div>
          <div className="absolute -bottom-4 -right-4 md:-bottom-6 md:-right-6 w-8 h-8 md:w-12 md:h-12 text-indigo-400 opacity-30 transform rotate-180 hidden sm:block">
            <Quote size={window.innerWidth < 768 ? 32 : 48} />
          </div>

          {/* Testimonial carousel */}
          <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8 lg:p-12 relative overflow-hidden">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentIndex}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
                className="flex flex-col md:flex-row items-center gap-6 md:gap-8"
              >
                <div className="w-24 h-24 md:w-32 md:h-32 lg:w-40 lg:h-40 rounded-full overflow-hidden flex-shrink-0 border-4 border-indigo-100">
                  <img
                    src={testimonials[currentIndex].image}
                    alt={testimonials[currentIndex].name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1 text-center md:text-left">
                  <blockquote className="text-base md:text-lg lg:text-xl text-gray-700 italic mb-4 md:mb-6">
                    "{testimonials[currentIndex].quote}"
                  </blockquote>
                  <div className="flex items-center justify-center md:justify-start">
                    <div className="h-px w-8 md:w-12 bg-indigo-300 mr-3 md:mr-4"></div>
                    <div>
                      <p className="font-bold text-gray-900 text-sm md:text-base">{testimonials[currentIndex].name}</p>
                      <p className="text-indigo-600 text-sm md:text-base">{testimonials[currentIndex].role}</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Navigation buttons */}
            <div className="absolute top-1/2 -translate-y-1/2 left-0 right-0 flex justify-between px-2 md:px-4 lg:px-0">
              <button
                onClick={handlePrev}
                className="bg-white/80 backdrop-blur-sm p-1.5 md:p-2 rounded-full shadow-md hover:bg-indigo-100 transition-colors -ml-2 md:-ml-4 lg:-ml-6"
                aria-label="Previous testimonial"
              >
                <ChevronLeft className="h-5 w-5 md:h-6 md:w-6 text-indigo-600" />
              </button>
              <button
                onClick={handleNext}
                className="bg-white/80 backdrop-blur-sm p-1.5 md:p-2 rounded-full shadow-md hover:bg-indigo-100 transition-colors -mr-2 md:-mr-4 lg:-mr-6"
                aria-label="Next testimonial"
              >
                <ChevronRight className="h-5 w-5 md:h-6 md:w-6 text-indigo-600" />
              </button>
            </div>
          </div>

          {/* Pagination dots */}
          <div className="flex justify-center mt-6 md:mt-8 space-x-2">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`w-2 h-2 md:w-2.5 md:h-2.5 rounded-full transition-all duration-300 ${
                  index === currentIndex
                    ? "bg-indigo-600 w-4 md:w-6"
                    : "bg-gray-300 hover:bg-indigo-300"
                }`}
                aria-label={`Go to testimonial ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;