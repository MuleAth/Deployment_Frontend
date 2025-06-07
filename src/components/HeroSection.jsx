import React, { useState, useEffect } from "react";
import { Play, Award, Users, ChevronDown, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const HeroSection = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const [animatedValue, setAnimatedValue] = useState(0);

  const stats = [
    { icon: Users, label: "Active Athletes", value: "500+", color: "from-blue-500 to-indigo-600" },
    { icon: Award, label: "Championships", value: "25+", color: "from-purple-500 to-pink-600" },
    { icon: Play, label: "Sports", value: "15+", color: "from-amber-500 to-orange-600" },
  ];

  const navigate = useNavigate();

  // Get token from Redux state
  const token = useSelector((state) => state.auth.token);

  // Animation on load
  useEffect(() => {
    setIsLoaded(true);

    // Animate counter
    const interval = setInterval(() => {
      setAnimatedValue(prev => {
        if (prev < 100) return prev + 1;
        clearInterval(interval);
        return 100;
      });
    }, 20);

    return () => clearInterval(interval);
  }, []);

  // Rotate through stats
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex(prev => (prev + 1) % stats.length);
    }, 3000);

    return () => clearInterval(interval);
  }, [stats.length]);

  const handleCreateAccountClick = () => {
    if (token) {
      // Show toast notification
      toast.info("You are logged in!", {
        position: "top-right",
        autoClose: 2900,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "dark",
      });
    } else {
      navigate("/login");
    }
  };

  const scrollToContent = () => {
    window.scrollTo({
      top: window.innerHeight,
      behavior: 'smooth'
    });
  };

  return (
    <>
      {/* ToastContainer must be present for toasts to show */}
      <ToastContainer />

      <div className="relative min-h-screen bg-gradient-to-br from-indigo-950 via-indigo-900 to-purple-900 overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-indigo-950/80 to-purple-900/80 backdrop-blur-sm"></div>

          {/* Animated circles */}
          <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-blue-500 rounded-full opacity-10 blur-3xl animate-pulse"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500 rounded-full opacity-10 blur-3xl animate-pulse" style={{animationDelay: '1s'}}></div>

          {/* Grid pattern */}
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiMyMTIxMjEiIGZpbGwtb3BhY2l0eT0iMC4wNCI+PHBhdGggZD0iTTM2IDM0djZoNnYtNmgtNnptMC0zMHY2aDZ2LTZoLTZ6TTYgNHYyaDJ2LTJINnptMCA1MHYyaDJ2LTJINnptMTggMHYyaDJ2LTJoLTJ6bTE4IDB2Mmgydi0yaC0yek02IDI0djJoMnYtMkg2em0wIDEwdjJoMnYtMkg2em0wLTIwdjJoMnYtMkg2em0xOCAyMHYyaDJ2LTJoLTJ6bTAtMjB2Mmgydi0yaC0yem0xOCAyMHYyaDJ2LTJoLTJ6bTAtMjB2Mmgydi0yaC0yeiIvPjwvZz48L2c+PC9zdmc+')] opacity-20"></div>
        </div>

        <div className="relative min-h-screen flex flex-col justify-center px-4 sm:px-6 lg:px-8">
          <div
            className={`max-w-7xl mx-auto w-full pt-16 md:pt-20 pb-12 md:pb-16 text-center mt-8 md:mt-12 transition-all duration-1000 ease-out ${
              isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
            }`}
          >
            <h1 className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-4 md:mb-6 tracking-tight leading-tight">
              <span className={`block mt-6 md:mt-10 transition-all duration-700 delay-300 ${
                isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
              }`}>
                Unleash Your Potential at
              </span>
              <span className={`block bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent py-2 md:py-4 transition-all duration-700 delay-500 ${
                isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
              }`}>
                Sinhgad College of Engineering
              </span>
            </h1>

            <p className={`mt-4 md:mt-6 text-lg sm:text-xl md:text-2xl text-indigo-200 max-w-3xl mx-auto px-4 transition-all duration-700 delay-700 ${
              isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
            }`}>
              Where Champions Are Made. Join Our Elite Sports Program.
            </p>

            <div className={`mt-8 md:mt-10 flex flex-col sm:flex-row justify-center gap-3 md:gap-4 px-4 transition-all duration-700 delay-900 ${
              isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
            }`}>
              <a href="/events" rel="noopener noreferrer" className="w-full sm:w-auto">
                <button className="group w-full sm:w-auto px-6 md:px-8 py-3 md:py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-xl hover:from-indigo-500 hover:to-purple-500 transform hover:scale-105 transition-all duration-300 shadow-lg flex items-center justify-center">
                  Explore Events
                  <ArrowRight className="ml-2 h-4 w-4 md:h-5 md:w-5 transform group-hover:translate-x-1 transition-transform" />
                </button>
              </a>
              <button
                onClick={handleCreateAccountClick}
                className="w-full sm:w-auto px-6 md:px-8 py-3 md:py-4 bg-white/10 text-white font-semibold rounded-xl hover:bg-white/20 backdrop-blur-sm transform hover:scale-105 transition-all duration-300 border border-white/20"
              >
                Sign In
              </button>
            </div>

            {/* Featured Stat with Animation */}
            <div className={`mt-12 md:mt-16 px-4 transition-all duration-700 delay-1000 ${
              isLoaded ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
            }`}>
              <div className="relative mx-auto max-w-xs md:max-w-md">
                <div className="absolute inset-0 flex items-center justify-center">
                  <svg className="w-full h-full" viewBox="0 0 100 100">
                    <circle
                      cx="50" cy="50" r="45"
                      fill="none"
                      stroke="rgba(255,255,255,0.1)"
                      strokeWidth="6"
                    />
                    <circle
                      cx="50" cy="50" r="45"
                      fill="none"
                      stroke="url(#gradient)"
                      strokeWidth="6"
                      strokeDasharray="283"
                      strokeDashoffset={283 - (283 * animatedValue / 100)}
                      strokeLinecap="round"
                      transform="rotate(-90 50 50)"
                    />
                    <defs>
                      <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#6366f1" />
                        <stop offset="100%" stopColor="#a855f7" />
                      </linearGradient>
                    </defs>
                  </svg>
                </div>

                <div className="relative h-48 md:h-64 w-full">
                  <div className="absolute inset-0 flex items-center justify-center">
                    {stats.map((stat, index) => (
                      <div
                        key={stat.label}
                        className={`absolute w-full h-full flex flex-col items-center justify-center transition-all duration-500 ${
                          index === activeIndex
                            ? 'opacity-100 scale-100'
                            : 'opacity-0 scale-90'
                        }`}
                        style={{ transformOrigin: 'center center' }}
                      >
                        <stat.icon className={`h-8 w-8 md:h-12 md:w-12 bg-gradient-to-r ${stat.color} bg-clip-text text-transparent`} />
                        <div className="text-3xl md:text-5xl font-bold text-white my-1 md:my-2">
                          {stat.value}
                        </div>
                        <div className="text-lg md:text-xl text-indigo-200">{stat.label}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Stats Grid */}
            <div className={`mt-12 md:mt-16 grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-8 max-w-4xl mx-auto px-4 transition-all duration-700 delay-1200 ${
              isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
            }`}>
              {stats.map(({ icon: Icon, label, value, color }) => (
                <div
                  key={label}
                  className="bg-white/10 backdrop-blur-sm rounded-xl p-4 md:p-6 transform hover:scale-105 transition-all duration-300 border border-white/5 hover:border-white/20 group"
                >
                  <div className={`p-2 md:p-3 rounded-full mx-auto mb-3 md:mb-4 w-12 h-12 md:w-16 md:h-16 flex items-center justify-center bg-gradient-to-r ${color} bg-opacity-20 group-hover:scale-110 transition-all duration-300`}>
                    <Icon className="h-6 w-6 md:h-8 md:w-8 text-white" />
                  </div>
                  <div className="text-2xl md:text-3xl font-bold text-white mb-1 md:mb-2">
                    {value}
                  </div>
                  <div className="text-sm md:text-base text-indigo-200">{label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div
          className={`absolute bottom-6 md:bottom-8 left-1/2 transform -translate-x-1/2 flex flex-col items-center cursor-pointer transition-opacity duration-500 ${
            isLoaded ? 'opacity-70 hover:opacity-100' : 'opacity-0'
          }`}
          onClick={scrollToContent}
        >
          <span className="text-white text-xs md:text-sm mb-1 md:mb-2">Scroll to explore</span>
          <ChevronDown className="text-white animate-bounce h-5 w-5 md:h-6 md:w-6" />
        </div>
      </div>
    </>
  );
};

export default HeroSection;
