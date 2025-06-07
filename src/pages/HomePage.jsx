import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowUp, ChevronDown } from "lucide-react";

import FeaturedEventSection from "../components/FeaturedEventSection";
import HeroSection from "../components/HeroSection";
import TestimonialsSection from "../components/TestimonialsSection";
import SportsStatistics from "../components/SportsStatistics";

const HomePage = () => {
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState("hero");
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const sectionRefs = {
    hero: useRef(null),
    events: useRef(null),
    statistics: useRef(null),
    testimonials: useRef(null)
  };

  // Get token from Redux state
  const token = useSelector((state) => state.auth.token);

  // Handle initial loading animation
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  // Scroll to section functionality
  const scrollToSection = (sectionId) => {
    const section = sectionRefs[sectionId].current;
    if (section) {
      section.scrollIntoView({ behavior: 'smooth' });
      setActiveSection(sectionId);
    }
  };

  // Detect active section based on scroll position
  useEffect(() => {
    const handleScroll = () => {
      // Show/hide scroll to top button
      if (window.scrollY > 500) {
        setShowScrollTop(true);
      } else {
        setShowScrollTop(false);
      }

      // Determine which section is currently in view
      const scrollPosition = window.scrollY + 200;

      for (const section in sectionRefs) {
        const element = sectionRefs[section].current;
        if (element) {
          const offsetTop = element.offsetTop;
          const offsetBottom = offsetTop + element.offsetHeight;

          if (scrollPosition >= offsetTop && scrollPosition < offsetBottom) {
            setActiveSection(section);
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Scroll to top function
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // No longer needed
  // Removed feedback button handler

  return (
    <>
      <AnimatePresence>
        {isLoading ? (
          <motion.div
            className="fixed inset-0 bg-indigo-950 flex items-center justify-center z-50"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 1.2, opacity: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="text-5xl font-bold text-white">
                <span className="bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
                  Sinhgad Sports
                </span>
              </div>
              <div className="mt-4 w-64 h-2 bg-gray-700 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-indigo-500 to-purple-500"
                  initial={{ width: "0%" }}
                  animate={{ width: "100%" }}
                  transition={{ duration: 1.2 }}
                />
              </div>
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>

      {/* Navigation Dots */}
      <div className="fixed right-3 md:right-6 top-1/2 transform -translate-y-1/2 z-40 hidden sm:block">
        <div className="flex flex-col space-y-3 md:space-y-4">
          {Object.keys(sectionRefs).map((section) => (
            <button
              key={section}
              onClick={() => scrollToSection(section)}
              className={`w-2.5 h-2.5 md:w-3 md:h-3 rounded-full transition-all duration-300 ${
                activeSection === section
                  ? "bg-indigo-500 scale-150"
                  : "bg-gray-400 hover:bg-indigo-300"
              }`}
              aria-label={`Scroll to ${section} section`}
            />
          ))}
        </div>
      </div>

      {/* Scroll to top button */}
      <AnimatePresence>
        {showScrollTop && (
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.3 }}
            onClick={scrollToTop}
            className="fixed bottom-4 right-4 md:bottom-6 md:right-6 p-2.5 md:p-3 bg-indigo-600 text-white rounded-full shadow-lg z-40 hover:bg-indigo-700 transition-colors"
            aria-label="Scroll to top"
          >
            <ArrowUp size={20} className="md:w-6 md:h-6" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Feedback button removed */}

      {/* Scroll indicator on hero section */}
      <motion.div
        className="fixed bottom-6 md:bottom-10 left-1/2 transform -translate-x-1/2 z-40"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2, duration: 0.5 }}
        style={{ display: activeSection === 'hero' ? 'block' : 'none' }}
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 1.5 }}
          className="flex flex-col items-center text-white"
        >
          <span className="text-xs md:text-sm font-medium mb-1 md:mb-2">Scroll to explore</span>
          <ChevronDown size={20} className="md:w-6 md:h-6" />
        </motion.div>
      </motion.div>

      <main className="min-h-screen flex-grow">
        <div ref={sectionRefs.hero}>
          <HeroSection />
        </div>

        <div ref={sectionRefs.events}>
          <FeaturedEventSection />
        </div>

        <div ref={sectionRefs.statistics}>
          <SportsStatistics />
        </div>

        <div ref={sectionRefs.testimonials}>
          <TestimonialsSection />
        </div>
      </main>
    </>
  );
};

export default HomePage;
