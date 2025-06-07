import React, { useState, useEffect, useRef } from "react";
import { Trophy, Medal, Star, Award, Users, Target, ChevronRight, ChevronDown } from 'lucide-react';

const AchievementSection = () => {
  const [activeTab, setActiveTab] = useState("teams");
  const [expandedCard, setExpandedCard] = useState(null);
  const [counts, setCounts] = useState({ gold: 0, silver: 0, bronze: 0 });
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef(null);

  // Counter animation effect
  useEffect(() => {
    // Fetch department achievement counts
    const fetchDepartmentCounts = async () => {
      try {
        // In a real implementation, this would be an API call
        // For now, we'll simulate the data
        setTimeout(() => {
          setCounts({
            gold: 50,    // IT department achievements
            silver: 30,  // CS department achievements
            bronze: 25   // EnTC department achievements
          });
        }, 500);
      } catch (error) {
        console.error("Error fetching department counts:", error);
      }
    };

    fetchDepartmentCounts();

    const interval = setInterval(() => {
      setCounts(prev => {
        const newGold = prev.gold < 50 ? prev.gold + 1 : prev.gold;
        const newSilver = prev.silver < 30 ? prev.silver + 1 : prev.silver;
        const newBronze = prev.bronze < 25 ? prev.bronze + 1 : prev.bronze;

        if (newGold === 50 && newSilver === 30 && newBronze === 25) {
          clearInterval(interval);
        }

        return { gold: newGold, silver: newSilver, bronze: newBronze };
      });
    }, 50);

    return () => clearInterval(interval);
  }, []);

  // Intersection Observer for section visibility
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, []);



  // Achievement data organized by categories
  const achievementData = {
    teams: [
      { title: "Basketball Team", year: "2023", description: "National Champions in the Collegiate Basketball League", icon: <Trophy /> },
      { title: "Swimming Team", year: "2023", description: "First place in National Aquatics Championship with 12 individual gold medals", icon: <Medal /> },
      { title: "Athletics Team", year: "2022", description: "Broke 3 national records in track and field events", icon: <Star /> }
    ],
    individuals: [
      { title: "Atharv Mule", achievement: "Karandak Champion", sport: "Volleyball", icon: <Users /> },
      { title: "Atharva Pandharikar", achievement: "Winner Sinhgad Olympus", sport: "Chess", icon: <Award /> },
      { title: "Sakshi Maluskar", achievement: "Runner up in University", sport: "Badminton", icon: <Target /> }
    ],
    recognition: [
      { title: "Best Sports College 2023", description: "Awarded by National Sports Association for excellence in athletic programs", icon: <Star /> },
      { title: "Excellence in Sports Education", description: "Recognized for innovative coaching methods and athlete development", icon: <Award /> },
      { title: "Outstanding Athletic Program", description: "Top-ranked facilities and support services for student athletes", icon: <Trophy /> }
    ]
  };

  // Toggle card expansion
  const toggleCard = (index) => {
    setExpandedCard(expandedCard === index ? null : index);
  };



  return (
    <section
      ref={sectionRef}
      className="py-20 bg-gradient-to-b from-indigo-900 via-indigo-800 to-purple-900 text-white relative overflow-hidden"
      id="achievements"
    >
      {/* Background decorative elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-10 left-10 w-64 h-64 bg-yellow-400 rounded-full opacity-10 blur-3xl"></div>
        <div className="absolute bottom-10 right-10 w-80 h-80 bg-purple-500 rounded-full opacity-10 blur-3xl"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div
          className={`text-center mb-12 md:mb-16 transition-all duration-700 ${
            isVisible ? "opacity-100 transform translate-y-0" : "opacity-0 transform -translate-y-8"
          }`}
        >
          <h2 className="text-3xl md:text-5xl font-bold mb-3 md:mb-4 bg-clip-text text-transparent bg-gradient-to-r from-yellow-300 to-yellow-500">
            College Achievements
          </h2>
          <p className="text-base md:text-xl opacity-90 max-w-2xl mx-auto px-4">
            Celebrating our sporting excellence and the remarkable accomplishments of our athletes and teams
          </p>
        </div>

        {/* Tab navigation */}
        <div className={`flex justify-center mb-8 md:mb-12 space-x-1 md:space-x-2 overflow-x-auto pb-2 transition-all duration-700 delay-100 ${
          isVisible ? "opacity-100 transform translate-y-0" : "opacity-0 transform -translate-y-8"
        }`}>
          {Object.keys(achievementData).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 md:px-6 py-2 md:py-3 rounded-full font-medium text-sm md:text-base transition-all duration-300 transform hover:scale-105 active:scale-95 whitespace-nowrap ${
                activeTab === tab
                  ? "bg-white text-indigo-900 shadow-lg"
                  : "bg-white/10 hover:bg-white/20"
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        {/* Department achievement counter section */}
        <div
          className={`bg-white/5 backdrop-blur-lg rounded-2xl p-4 md:p-8 mb-8 md:mb-12 shadow-xl transition-all duration-700 delay-200 ${
            isVisible ? "opacity-100 transform scale-100" : "opacity-0 transform scale-90"
          }`}
        >
          <div className="grid md:grid-cols-3 gap-4 md:gap-8 items-center">
            <div className="text-center">
              <div className="inline-block animate-spin-slow">
                <Trophy className="h-10 w-10 md:h-16 md:w-16 mx-auto mb-2 md:mb-4 text-yellow-400" />
              </div>
              <h3 className="text-lg md:text-2xl font-bold mb-1 md:mb-2">Department Achievements</h3>
              <p className="opacity-80 text-sm md:text-base">Our departments continue to excel</p>
            </div>

            <div className="md:col-span-2">
              <div className="grid grid-cols-3 gap-2 md:gap-4">
                <div className="text-center p-2 md:p-4 bg-purple-500/20 rounded-xl">
                  <p className="text-2xl md:text-5xl font-bold text-purple-400 mb-1 md:mb-2">{counts.gold}+</p>
                  <p className="font-medium text-xs md:text-base">IT</p>
                </div>
                <div className="text-center p-2 md:p-4 bg-indigo-500/20 rounded-xl">
                  <p className="text-2xl md:text-5xl font-bold text-indigo-400 mb-1 md:mb-2">{counts.silver}+</p>
                  <p className="font-medium text-xs md:text-base">CS</p>
                </div>
                <div className="text-center p-2 md:p-4 bg-blue-500/20 rounded-xl">
                  <p className="text-2xl md:text-5xl font-bold text-blue-400 mb-1 md:mb-2">{counts.bronze}+</p>
                  <p className="font-medium text-xs md:text-base">EnTC</p>
                </div>
              </div>
            </div>
          </div>
        </div>



        {/* Achievement cards */}
        <div className="grid md:grid-cols-3 gap-4 md:gap-8">
          {achievementData[activeTab].map((item, index) => (
            <div
              key={index}
              className={`bg-white/10 backdrop-blur-lg rounded-xl p-4 md:p-6 shadow-xl border border-white/10 transition-all duration-500 cursor-pointer overflow-hidden hover:-translate-y-1 ${
                expandedCard === index ? "md:col-span-3" : ""
              } ${isVisible ? "opacity-100 transform translate-y-0" : "opacity-0 transform translate-y-8"}`}
              style={{ transitionDelay: `${300 + index * 100}ms` }}
              onClick={() => toggleCard(index)}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="p-2 md:p-3 bg-indigo-600/30 rounded-lg mr-3 md:mr-4 flex-shrink-0">
                    <div className="h-5 w-5 md:h-8 md:w-8 text-yellow-400 transition-transform duration-300 hover:rotate-12">
                      {item.icon}
                    </div>
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="text-base md:text-xl font-bold truncate">{item.title}</h3>
                    <p className="opacity-80 text-xs md:text-sm">
                      {item.year || item.sport || "Recognition"}
                    </p>
                  </div>
                </div>
                <div
                  className="transition-transform duration-300 flex-shrink-0 ml-2"
                  style={{ transform: expandedCard === index ? 'rotate(180deg)' : 'rotate(0deg)' }}
                >
                  <div className="h-4 w-4 md:h-6 md:w-6">
                    {expandedCard === index ? <ChevronDown /> : <ChevronRight />}
                  </div>
                </div>
              </div>

              {expandedCard === index && (
                <div
                  className="mt-3 md:mt-4 pt-3 md:pt-4 border-t border-white/10 transition-all duration-500 overflow-hidden"
                  style={{
                    maxHeight: expandedCard === index ? '500px' : '0',
                    opacity: expandedCard === index ? 1 : 0
                  }}
                >
                  <p className="text-sm md:text-lg mb-2 md:mb-3">
                    {item.description || item.achievement || "Outstanding achievement in collegiate sports"}
                  </p>

                  {/* Additional details based on category */}
                  {activeTab === "teams" && (
                    <div className="bg-white/5 p-3 md:p-4 rounded-lg">
                      <h4 className="font-bold mb-2 text-sm md:text-base">Team Highlights</h4>
                      <ul className="list-disc list-inside space-y-1 opacity-90 text-xs md:text-sm">
                        <li>Undefeated season record</li>
                        <li>3 All-Star team selections</li>
                        <li>Featured in National Sports Magazine</li>
                      </ul>
                    </div>
                  )}

                  {activeTab === "individuals" && (
                    <div className="bg-white/5 p-3 md:p-4 rounded-lg">
                      <h4 className="font-bold mb-2 text-sm md:text-base">Profile</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-4">
                        {item.title === "Atharv Mule" && (
                          <>
                            <div>
                              <p className="text-xs md:text-sm opacity-80">Department</p>
                              <p className="text-sm md:text-base">Information Technology</p>
                            </div>
                            <div>
                              <p className="text-xs md:text-sm opacity-80">Year</p>
                              <p className="text-sm md:text-base">Final Year</p>
                            </div>
                            <div>
                              <p className="text-xs md:text-sm opacity-80">Achievements</p>
                              <p className="text-sm md:text-base">Karandak Champion</p>
                            </div>
                            <div>
                              <p className="text-xs md:text-sm opacity-80">Position</p>
                              <p className="text-sm md:text-base">Team Captain</p>
                            </div>
                          </>
                        )}

                        {item.title === "Atharva Pandharikar" && (
                          <>
                            <div>
                              <p className="text-xs md:text-sm opacity-80">Department</p>
                              <p className="text-sm md:text-base">Information Technology</p>
                            </div>
                            <div>
                              <p className="text-xs md:text-sm opacity-80">Year</p>
                              <p className="text-sm md:text-base">Final Year</p>
                            </div>
                            
                          </>
                        )}

                        {item.title === "Sakshi Maluskar" && (
                          <>
                            <div>
                              <p className="text-xs md:text-sm opacity-80">Department</p>
                              <p className="text-sm md:text-base">Information Technology</p>
                            </div>
                            <div>
                              <p className="text-xs md:text-sm opacity-80">Year</p>
                              <p className="text-sm md:text-base">Final Year</p>
                            </div>
                            
                          </>
                        )}
                      </div>
                    </div>
                  )}

                  {activeTab === "recognition" && (
                    <div className="bg-white/5 p-3 md:p-4 rounded-lg">
                      <h4 className="font-bold mb-2 text-sm md:text-base">Award Details</h4>
                      <p className="mb-2 text-xs md:text-sm">Presented on May 15, 2023 at the National Sports Gala</p>
                      <div className="flex items-center justify-center mt-3 md:mt-4">
                        <button
                          className="px-3 md:px-4 py-2 bg-indigo-600 rounded-lg text-white font-medium text-xs md:text-sm transition-all duration-300 hover:scale-105 active:scale-95 hover:bg-indigo-500"
                        >
                          View Certificate
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Interactive call to action */}
        <div
          className={`mt-12 md:mt-16 text-center transition-all duration-700 delay-700 ${
            isVisible ? "opacity-100 transform translate-y-0" : "opacity-0 transform translate-y-8"
          }`}
        >
          <button
            className="px-6 md:px-8 py-3 md:py-4 bg-gradient-to-r from-yellow-400 to-yellow-500 rounded-full text-indigo-900 font-bold text-base md:text-lg shadow-lg transition-all duration-300 hover:scale-105 active:scale-95 hover:shadow-xl"
          >
            Explore All Achievements
          </button>
        </div>
      </div>



      {/* Add custom CSS for animations */}
      <style jsx>{`
        @keyframes spin-slow {
          0% { transform: rotateY(0deg); }
          100% { transform: rotateY(360deg); }
        }
        .animate-spin-slow {
          animation: spin-slow 3s linear 1;
        }
      `}</style>
    </section>
  );
};

export default AchievementSection;
