import React, { useState, useEffect } from 'react';
import { Trophy, Star, Calendar, User, School, Heart, Globe, BookOpen, MessageSquare, ChevronDown, Sparkles, Zap, Target, Users } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const AboutUsPage = () => {
  const [activeSection, setActiveSection] = useState('motivation');
  const [isScrolled, setIsScrolled] = useState(false);
  const [showContent, setShowContent] = useState(false);

  // Handle scroll for header effects
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 100);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Animation variants
  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6 }
    }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.3
      }
    }
  };

  const heroTextVariant = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        delay: 0.2
      }
    }
  };

  const buttonVariant = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.5,
        delay: 0.6
      }
    }
  };

  const floatingIconVariant = {
    initial: { y: 0 },
    animate: {
      y: [0, -15, 0],
      transition: {
        duration: 3,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  };

  // Timeline data
  const timelineEvents = [
    {
      year: "Stage 1",
      title: "The Idea",
      description: "The idea was developed during my time as a sports coordinator, when I identified a gap between students and sports caused by a lack of engagement in events."
    },
    {
      year: "Stage 2",
      title: "Development",
      description: "Our team of passionate developers and sports enthusiasts built the first prototype, focusing on ML-driven recommendations."
    },
    {
      year: "Stage 3",
      title: "Launch",
      description: "Sportalon is set to officially launch at our college, aiming to gain traction among student and sports departments while bridging the gap between students and sports."
    },
    {
      year: "Stage 4",
      title: "Growth & Expansion",
      description: "We are planning to expand to multiple institutions, with a focus on enhancing our ML capabilities and incorporating new features inspired by user feedback."
    }
  ];

  // Navigation buttons for sections
  const navButtons = [
    { id: 'motivation', label: 'Our Motivation', icon: <Heart className="h-5 w-5" /> },
    { id: 'vision', label: 'Our Vision', icon: <Globe className="h-5 w-5" /> },
    { id: 'journey', label: 'Our Journey', icon: <BookOpen className="h-5 w-5" /> },
    { id: 'message', label: 'Our Message', icon: <MessageSquare className="h-5 w-5" /> }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      {/* Hero Section with Parallax Effect */}
      <div className="relative h-screen flex items-center justify-center overflow-hidden">
        {/* Background Elements */}
        <motion.div
          className="absolute inset-0 z-0"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
        >
          <div className="absolute top-20 left-20 w-64 h-64 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
          <div className="absolute top-40 right-20 w-72 h-72 bg-indigo-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
          <div className="absolute bottom-20 left-1/3 w-80 h-80 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
        </motion.div>

        {/* Floating Icons */}
        <motion.div
          className="absolute top-1/4 left-1/4 text-purple-600 opacity-80"
          variants={floatingIconVariant}
          initial="initial"
          animate="animate"
        >
          <Trophy className="h-16 w-16" />
        </motion.div>

        <motion.div
          className="absolute bottom-1/3 right-1/4 text-indigo-600 opacity-80"
          variants={floatingIconVariant}
          initial="initial"
          animate="animate"
          style={{ animationDelay: "1s" }}
        >
          <Star className="h-12 w-12" />
        </motion.div>

        <motion.div
          className="absolute top-1/3 right-1/3 text-pink-600 opacity-80"
          variants={floatingIconVariant}
          initial="initial"
          animate="animate"
          style={{ animationDelay: "2s" }}
        >
          <Sparkles className="h-10 w-10" />
        </motion.div>

        {/* Hero Content */}
        <div className="relative z-10 text-center px-4 max-w-5xl">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={heroTextVariant}
          >
            <h1 className="text-4xl md:text-7xl font-extrabold text-gray-900 mb-6 bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-indigo-600">
              About Sportalon
            </h1>
            <p className="text-xl md:text-2xl text-gray-700 max-w-3xl mx-auto mb-10">
              Where passion for sports meets cutting-edge technology to create the ultimate platform for student athletes
            </p>
          </motion.div>

          <motion.div
            variants={buttonVariant}
            initial="hidden"
            animate="visible"
            className="flex justify-center"
          >
            <button
              onClick={() => {
                setShowContent(!showContent);
                if (!showContent) {
                  document.getElementById('content-section').scrollIntoView({ behavior: 'smooth' });
                }
              }}
              className="px-8 py-4 bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-semibold rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 flex items-center justify-center"
            >
              {showContent ? 'Hide Content' : 'Discover Our Story'}
              <ChevronDown className={`ml-2 h-5 w-5 transition-transform duration-300 ${showContent ? 'rotate-180' : ''}`} />
            </button>
          </motion.div>
        </div>

        {/* Scroll Indicator */}
        <motion.div
          className="absolute bottom-10 left-1/2 transform -translate-x-1/2"
          animate={{
            y: [0, 10, 0],
            opacity: [0.4, 1, 0.4]
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          <ChevronDown className="h-10 w-10 text-purple-600" />
        </motion.div>
      </div>

      {/* Content Section with Tabs */}
      <div id="content-section" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        {/* Section Navigation - Only shown after clicking Discover Our Story */}
        <AnimatePresence>
          {showContent && (
            <motion.div
              className="mb-12 sticky top-16 z-30 py-4 bg-white/80 backdrop-blur-md rounded-xl shadow-md"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
            >
              <div className="flex flex-wrap justify-center gap-2 md:gap-4">
                {navButtons.map((button) => (
                  <button
                    key={button.id}
                    onClick={() => setActiveSection(button.id)}
                    className={`px-4 py-2 md:px-6 md:py-3 rounded-full flex items-center transition-all duration-300 ${
                      activeSection === button.id
                        ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-md'
                        : 'bg-white text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <span className="mr-2">{button.icon}</span>
                    <span className="font-medium">{button.label}</span>
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Content Sections - Only shown after clicking Discover Our Story */}
        <AnimatePresence mode="wait">
          {showContent && activeSection === 'motivation' && (
            <motion.div
              key="motivation"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
              className="bg-white rounded-2xl shadow-xl p-8 mb-16 overflow-hidden relative"
            >
              <div className="absolute top-0 right-0 w-64 h-64 bg-purple-100 rounded-full -mr-32 -mt-32 opacity-50"></div>
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-indigo-100 rounded-full -ml-32 -mb-32 opacity-50"></div>

              <div className="relative">
                <div className="flex items-center mb-8">
                  <Heart className="h-10 w-10 text-purple-600 mr-4" />
                  <h2 className="text-3xl font-bold text-gray-900">Our Motivation</h2>
                </div>

                <div className="grid md:grid-cols-2 gap-12">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-800 mb-4">Why We Built Sportalon</h3>
                    <div className="space-y-6">
                      <div className="flex items-start">
                        <div className="flex-shrink-0 mt-1">
                          <Zap className="h-6 w-6 text-purple-600" />
                        </div>
                        <p className="ml-4 text-gray-600">
                          We saw students struggling with outdated systems and missed opportunities. Sportalon brings everything they need into one powerful platform.
                        </p>
                      </div>
                      <div className="flex items-start">
                        <div className="flex-shrink-0 mt-1">
                          <Target className="h-6 w-6 text-purple-600" />
                        </div>
                        <p className="ml-4 text-gray-600">
                          Our goal is simple: use platform to connect students with the perfect sports opportunities and resources to help them excel.
                        </p>
                      </div>
                      <div className="flex items-start">
                        <div className="flex-shrink-0 mt-1">
                          <Users className="h-6 w-6 text-purple-600" />
                        </div>
                        <p className="ml-4 text-gray-600">
                          We believe in building a community where students can showcase achievements, find opportunities, and grow together.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-xl font-semibold text-gray-800 mb-4">The Problems We're Solving</h3>
                    <ul className="space-y-4">
                      <li className="flex items-start">
                        <div className="flex-shrink-0 h-6 w-6 rounded-full bg-purple-100 flex items-center justify-center mr-3 mt-1">
                          <span className="text-purple-600 text-sm font-bold">1</span>
                        </div>
                        <p className="text-gray-600">Fragmented information about sports events and opportunities</p>
                      </li>
                      <li className="flex items-start">
                        <div className="flex-shrink-0 h-6 w-6 rounded-full bg-purple-100 flex items-center justify-center mr-3 mt-1">
                          <span className="text-purple-600 text-sm font-bold">2</span>
                        </div>
                        <p className="text-gray-600">Lack of personalized recommendations for student interests</p>
                      </li>
                      <li className="flex items-start">
                        <div className="flex-shrink-0 h-6 w-6 rounded-full bg-purple-100 flex items-center justify-center mr-3 mt-1">
                          <span className="text-purple-600 text-sm font-bold">3</span>
                        </div>
                        <p className="text-gray-600">Difficulty in tracking students participation and achievements</p>
                      </li>
                      <li className="flex items-start">
                        <div className="flex-shrink-0 h-6 w-6 rounded-full bg-purple-100 flex items-center justify-center mr-3 mt-1">
                          <span className="text-purple-600 text-sm font-bold">4</span>
                        </div>
                        <p className="text-gray-600">Limited access to quality equipment and resources</p>
                      </li>
                    </ul>
                  </div>
                </div>

                <div className="mt-10 p-6 bg-purple-50 rounded-xl border-l-4 border-purple-600">
                  <p className="text-xl italic text-gray-700">
                    "Sports have the power to change the world. It has the power to inspire, the power to unite people in a way that little else does."
                  </p>
                  <p className="mt-2 text-gray-600 font-semibold">— Nelson Mandela</p>
                </div>
              </div>
            </motion.div>
          )}

          {showContent && activeSection === 'vision' && (
            <motion.div
              key="vision"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
              className="bg-gradient-to-r from-purple-600 to-indigo-600 rounded-2xl shadow-xl p-8 mb-16 text-white"
            >
              <div className="flex items-center mb-8">
                <Globe className="h-10 w-10 text-white mr-4" />
                <h2 className="text-3xl font-bold">Our Vision</h2>
              </div>

              <div className="grid md:grid-cols-2 gap-12">
                <div>
                  <h3 className="text-xl font-semibold mb-4">Where We're Headed</h3>
                  <div className="space-y-6">
                    <div className="bg-white/10 p-6 rounded-xl backdrop-blur-sm">
                      <h4 className="font-bold text-lg mb-2">Build Network</h4>
                      <p className="text-purple-100">
                        We're building a platform connecting multiple institutions and thousands of students.
                      </p>
                    </div>
                    <div className="bg-white/10 p-6 rounded-xl backdrop-blur-sm">
                      <h4 className="font-bold text-lg mb-2">Complete Ecosystem</h4>
                      <p className="text-purple-100">
                        Beyond recommendations, we're creating a full suite of tools for managing and enhancing student involvement in sports.
                      </p>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-xl font-semibold mb-4">Our ML-Driven Approach</h3>
                  <div className="space-y-6">
                    <div className="bg-white/10 p-6 rounded-xl backdrop-blur-sm">
                      <h4 className="font-bold text-lg mb-2">Smart Recommendations</h4>
                      <p className="text-purple-100">
                        Our ML-model will match students with perfect opportunities based on their skills, interests, and goals.
                      </p>
                    </div>
                    <div className="bg-white/10 p-6 rounded-xl backdrop-blur-sm">
                      <h4 className="font-bold text-lg mb-2">Performance Reports</h4>
                      <p className="text-purple-100">
                        Pro-level analytics and reports will be available to every student on our platform.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-10 grid grid-cols-2 md:grid-cols-4 gap-6">
                <div className="bg-white/10 p-4 rounded-lg backdrop-blur-sm transform transition-all duration-300 hover:scale-105 hover:bg-white/20">
                  <div className="text-3xl font-bold">20+</div>
                  <div className="text-purple-100">Institutions</div>
                </div>
                <div className="bg-white/10 p-4 rounded-lg backdrop-blur-sm transform transition-all duration-300 hover:scale-105 hover:bg-white/20">
                  <div className="text-3xl font-bold">20K+</div>
                  <div className="text-purple-100">Students</div>
                </div>
                <div className="bg-white/10 p-4 rounded-lg backdrop-blur-sm transform transition-all duration-300 hover:scale-105 hover:bg-white/20">
                  <div className="text-3xl font-bold">500+</div>
                  <div className="text-purple-100">Events</div>
                </div>
                <div className="bg-white/10 p-4 rounded-lg backdrop-blur-sm transform transition-all duration-300 hover:scale-105 hover:bg-white/20">
                  <div className="text-3xl font-bold">99%</div>
                  <div className="text-purple-100">Satisfaction</div>
                </div>
              </div>
            </motion.div>
          )}

          {showContent && activeSection === 'journey' && (
            <motion.div
              key="journey"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
              className="mb-16"
            >
              <div className="text-center mb-12">
                <div className="flex items-center justify-center mb-6">
                  <BookOpen className="h-10 w-10 text-purple-600 mr-4" />
                  <h2 className="text-3xl font-bold text-gray-900">Our Journey</h2>
                </div>
                <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                  From a simple idea to a growing platform, our journey has been filled with challenges, breakthroughs, and continuous learning
                </p>
              </div>

              <div className="relative">
                {/* Timeline line */}
                <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-1 bg-purple-200"></div>

                {/* Timeline events */}
                <div className="space-y-12">
                  {timelineEvents.map((event, index) => (
                    <motion.div
                      key={index}
                      className="relative flex items-center justify-between"
                      initial={{ opacity: 0, y: 50 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                    >
                      {/* Left side content (only shown for even indices) */}
                      <div className={`hidden md:block w-5/12 ${index % 2 === 0 ? 'text-right pr-8' : 'invisible'}`}>
                        {index % 2 === 0 && (
                          <>
                            <h3 className="text-xl font-bold text-gray-900">{event.title}</h3>
                            <p className="text-gray-600 mt-2">{event.description}</p>
                          </>
                        )}
                      </div>

                      {/* Year marker */}
                      <div className="absolute left-1/2 transform -translate-x-1/2 flex flex-col items-center">
                        <motion.div
                          className="w-8 h-8 rounded-full bg-purple-600 flex items-center justify-center z-10"
                          whileHover={{ scale: 1.2 }}
                          transition={{ type: "spring", stiffness: 400, damping: 10 }}
                        >
                          <Calendar className="h-4 w-4 text-white" />
                        </motion.div>
                        <div className="mt-2 px-4 py-1 rounded-full bg-purple-100 text-purple-800 font-bold text-sm">
                          {event.year}
                        </div>
                      </div>

                      {/* Right side content (only shown for odd indices) */}
                      <div className={`hidden md:block w-5/12 ${index % 2 === 1 ? 'text-left pl-8' : 'invisible'}`}>
                        {index % 2 === 1 && (
                          <>
                            <h3 className="text-xl font-bold text-gray-900">{event.title}</h3>
                            <p className="text-gray-600 mt-2">{event.description}</p>
                          </>
                        )}
                      </div>

                      {/* Content for mobile - always on right */}
                      <div className="md:hidden ml-12 pl-4">
                        <h3 className="text-xl font-bold text-gray-900">{event.title}</h3>
                        <p className="text-gray-600 mt-2">{event.description}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>

                {/* Future marker */}
                <motion.div
                  className="relative flex justify-center mt-12"
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5 }}
                >
                  <motion.div
                    className="w-12 h-12 rounded-full bg-purple-600 flex items-center justify-center z-10"
                    animate={{
                      boxShadow: ["0px 0px 0px rgba(147, 51, 234, 0.3)", "0px 0px 20px rgba(147, 51, 234, 0.6)", "0px 0px 0px rgba(147, 51, 234, 0.3)"]
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                  >
                    <Star className="h-6 w-6 text-white" />
                  </motion.div>
                  <div className="mt-4 text-center">
                    <div className="px-4 py-1 rounded-full bg-purple-100 text-purple-800 font-bold text-sm inline-block">
                      Stage 5
                    </div>
                    <p className="text-gray-600 mt-2 max-w-md">
                      Our journey continues as we expand to new institutions and develop more advanced features
                    </p>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          )}

          {showContent && activeSection === 'message' && (
            <motion.div
              key="message"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
              className="bg-white rounded-2xl shadow-xl p-8 mb-16 relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-64 h-64 bg-purple-100 rounded-full -mr-32 -mt-32 opacity-30"></div>

              <div className="relative">
                <div className="flex items-center mb-8">
                  <MessageSquare className="h-10 w-10 text-purple-600 mr-4" />
                  <h2 className="text-3xl font-bold text-gray-900">Our Message</h2>
                </div>

                <div className="bg-gradient-to-br from-gray-50 to-white p-8 rounded-xl border-l-4 border-purple-600 max-w-3xl mx-auto shadow-lg">
                  <div className="flex items-center mb-6">
                    <motion.div
                      className="w-16 h-16 rounded-full bg-gradient-to-r from-purple-600 to-indigo-600 flex items-center justify-center text-white text-2xl font-bold mr-4 shadow-lg"
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      transition={{ type: "spring", stiffness: 400, damping: 10 }}
                    >
                      S
                    </motion.div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-900">Team Sportalon</h3>
                      <p className="text-gray-600">Building the future of sports</p>
                    </div>
                  </div>

                  <div className="space-y-4 text-gray-700 italic">
                    <p>
                      Dear Students,
                    </p>
                    <p>
                    We created Sportalon after experiencing firsthand the challenges of balancing academics with a passion for sports. Information was scattered, opportunities were missed, and there was no central platform to showcase achievements or connect with like-minded individuals.
                    </p>
                    <p>
                    This shared experience inspired us to create Sportalon—a platform that leverages technology to solve these problems and foster a thriving ecosystem for students.Today, we're incredibly proud of what we've built together. But this is just the beginning. With your continued support and feedback, we'll keep innovating and expanding.
                    </p>
                    <p>
                      <span className="font-bold">
                        Imagine standing on the field, representing Sinhgad College in a tournament. The thrill, the pride, the moment you win for your college—it is a feeling like no other. It is unforgettable, fulfilling, and truly worthy. We realized this through our journey, and now it's your turn.
                      </span>
                    </p>
                    <p>
                    We created Sportalon because we believe that technology can be a catalyst, not a barrier.
                    </p>
                    <p>
                    Thank you for being part of this journey.
                    </p>
                    <p className="font-bold text-xl not-italic bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-indigo-600">
                      The Sportalon Team
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Call to Action - Only shown after clicking Discover Our Story */}
        {showContent && (
          <motion.div
            className="text-center mb-16 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-2xl shadow-xl p-12 text-white"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
          <h2 className="text-3xl font-bold mb-6">Join Us in Shaping the Future of Student Sports</h2>
          <p className="text-xl text-purple-100 max-w-3xl mx-auto mb-8">
            Whether you're a student athlete, coach, or institution, Sportalon is built for you. Together, we can revolutionize how students engage with sports.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <motion.button
              onClick={() => {
                window.location.href = '/login';
              }}
              className="px-8 py-3 bg-white text-purple-600 font-semibold rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Join Sportalon Today
            </motion.button>
            <motion.button
              className="px-8 py-3 bg-transparent text-white font-semibold rounded-full shadow-lg border-2 border-white hover:bg-white/10 transition-all duration-300"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Learn More
            </motion.button>
          </div>
        </motion.div>
        )}
      </div>
    </div>
  );
};

export default AboutUsPage;