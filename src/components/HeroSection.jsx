import React, { useState, useEffect } from "react";
import { Play, Award, Users, ChevronDown, ArrowRight, Info, X, MessageSquare, ChevronUp, Trophy, Star, Send } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { toast, ToastContainer } from "react-toastify";
import axios from "axios";
import "react-toastify/dist/ReactToastify.css";

const HeroSection = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const [animatedValue, setAnimatedValue] = useState(0);
  const [showNotification, setShowNotification] = useState(false);
  const [showFeedbackForm, setShowFeedbackForm] = useState(false);
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [formData, setFormData] = useState({
    reason: "",
    description: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  
  const categories = [
    "Sports Facilities",
    "Equipment Quality",
    "Coaching Staff",
    "Events Organization",
    "Overall Experience",
    "Other",
  ];

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

    // Show notification after a delay
    const notificationTimer = setTimeout(() => {
      setShowNotification(true);
      
      // Auto-hide notification after 8 seconds
      const hideTimer = setTimeout(() => {
        setShowNotification(false);
      }, 8000);
      
      return () => clearTimeout(hideTimer);
    }, 1500);

    return () => {
      clearInterval(interval);
      clearTimeout(notificationTimer);
    };
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
  
  // Handle feedback form submission
  const handleFeedbackSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setIsSubmitting(true);

    if (rating === 0) {
      setError("Please select a rating before submitting.");
      setIsSubmitting(false);
      return;
    }

    // Check if user is logged in
    if (!token) {
      setIsSubmitting(false);
      // Show toast notification for login
      toast.warning("Please log in before giving feedback", {
        position: "top-center",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        onClose: () => navigate("/login?redirect=/")
      });
      return;
    }

    const feedbackData = {
      token,
      rating,
      reason: formData.reason,
      description: formData.description,
    };

    try {
      const response = await axios.post(
        "https://sportalon-backend.onrender.com/api/feedback/submit",
        feedbackData,
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      // Handle success response
      setFormData({ reason: "", description: "" });
      setRating(0);
      setSuccess(response.data.message || "Feedback submitted successfully!");
      console.log("Server response:", response.data.feedback);

      // Hide the form after successful submission
      setTimeout(() => {
        setShowFeedbackForm(false);
        setSuccess("");
      }, 3000); // Hide after 3 seconds
    } catch (err) {
      console.error("Full error context:", {
        error: err.response?.data?.message || err.message,
        stack: err.stack,
      });

      setError(
        err.response?.data?.message ||
          "An error occurred while submitting feedback."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const scrollToContent = () => {
    window.scrollTo({
      top: window.innerHeight,
      behavior: 'smooth'
    });
  };

  return (
    <div className="relative">
      {/* ToastContainer must be present for toasts to show */}
      <ToastContainer />
      
      {/* Development notification popup */}
      {showNotification && (
        <div className="fixed top-6 left-1/2 transform -translate-x-1/2 z-50 w-full max-w-md">
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl shadow-xl overflow-hidden animate-fade-in-down">
            <div className="relative p-5">
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <Info className="h-6 w-6 text-indigo-200" />
                </div>
                <div className="ml-3 w-0 flex-1 pt-0.5">
                  <p className="text-sm font-medium text-white">Under Development</p>
                  <p className="mt-1 text-sm text-indigo-100">
                    Some features are still under development. We're working hard to bring you more functionality soon. Stay tuned!
                  </p>
                </div>
                <div className="ml-4 flex-shrink-0 flex">
                  <button
                    className="bg-indigo-800/30 rounded-md inline-flex text-indigo-200 hover:text-white focus:outline-none focus:ring-2 focus:ring-white p-1.5 transition-all duration-200"
                    onClick={() => setShowNotification(false)}
                  >
                    <span className="sr-only">Close</span>
                    <X className="h-5 w-5" />
                  </button>
                </div>
              </div>
              
              {/* Progress bar for auto-close */}
              <div className="absolute bottom-0 left-0 h-1 bg-white/30 w-full">
                <div 
                  className="h-full bg-white/70" 
                  style={{ 
                    width: '100%', 
                    animation: 'shrink 8s linear forwards' 
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      )}

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

        <div className="relative min-h-screen flex flex-col justify-center px-2 sm:px-6 lg:px-8">
          <div
            className={`max-w-7xl mx-auto w-full pt-16 sm:pt-20 pb-12 sm:pb-16 text-center mt-8 sm:mt-12 transition-all duration-1000 ease-out ${
              isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
            }`}
          >
            <h1 className="text-3xl sm:text-6xl lg:text-7xl font-bold text-white mb-4 sm:mb-6 tracking-tight px-2">
              <span className={`block mt-4 sm:mt-10 transition-all duration-700 delay-300 ${
                isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
              }`}>
                Unleash Your Potential at
              </span>
              <span className={`block bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent py-2 sm:py-4 transition-all duration-700 delay-500 ${
                isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
              }`}>
                Sinhgad College of Engineering
              </span>
            </h1>

            <p className={`mt-4 sm:mt-6 text-lg sm:text-2xl text-indigo-200 max-w-3xl mx-auto transition-all duration-700 delay-700 px-4 ${
              isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
            }`}>
              Where Champions Are Made. Join Our Elite Sports Program.
            </p>

            <div className={`mt-10 flex flex-row justify-center gap-3 sm:gap-4 transition-all duration-700 delay-900 ${
              isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
            }`}>
              <a href="/events" rel="noopener noreferrer" className="flex-1 sm:flex-none">
                <button className="w-full sm:w-auto group px-4 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-xl hover:from-indigo-500 hover:to-purple-500 transform hover:scale-105 transition-all duration-300 shadow-lg flex items-center justify-center">
                  Explore Events
                  <ArrowRight className="ml-2 h-5 w-5 transform group-hover:translate-x-1 transition-transform" />
                </button>
              </a>
              <button
                onClick={handleCreateAccountClick}
                className="flex-1 sm:flex-none w-full sm:w-auto px-4 sm:px-8 py-3 sm:py-4 bg-white/10 text-white font-semibold rounded-xl hover:bg-white/20 backdrop-blur-sm transform hover:scale-105 transition-all duration-300 border border-white/20"
              >
                Sign In
              </button>
            </div>
            
            {/* Feedback Button - Centered below main buttons */}
            <div className={`mt-6 transition-all duration-700 delay-1000 ${
              isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
            }`}>
              <button
                onClick={() => setShowFeedbackForm(!showFeedbackForm)}
                className="px-4 sm:px-5 py-2 sm:py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-full hover:from-indigo-500 hover:to-purple-500 transition-all font-semibold flex items-center gap-2 shadow-lg hover:shadow-xl transform hover:-translate-y-1 active:translate-y-0 active:shadow-md mx-auto text-sm sm:text-base"
              >
                <MessageSquare className="h-4 w-4 sm:h-5 sm:w-5" />
                {showFeedbackForm ? "Hide Feedback" : 
                  <span className="hidden sm:inline">Share Your Feedback</span>
                }
                {showFeedbackForm ? 
                  <span className="sm:hidden">Hide</span> : 
                  <span className="sm:hidden">Feedback</span>
                }
                {showFeedbackForm ? <ChevronUp className="h-4 w-4 sm:h-5 sm:w-5" /> : <ChevronDown className="h-4 w-4 sm:h-5 sm:w-5" />}
              </button>
            </div>

            {/* Stats Grid */}
            <div className={`mt-10 sm:mt-16 grid grid-cols-3 sm:grid-cols-3 gap-2 sm:gap-8 max-w-4xl mx-auto transition-all duration-700 delay-1200 ${
              isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
            }`}>
              {stats.map(({ icon: Icon, label, value, color }) => (
                <div
                  key={label}
                  className="bg-white/10 backdrop-blur-sm rounded-xl p-2 sm:p-6 transform hover:scale-105 transition-all duration-300 border border-white/5 hover:border-white/20 group"
                >
                  <div className={`p-2 sm:p-3 rounded-full mx-auto mb-2 sm:mb-4 w-10 h-10 sm:w-16 sm:h-16 flex items-center justify-center bg-gradient-to-r ${color} bg-opacity-20 group-hover:scale-110 transition-all duration-300`}>
                    <Icon className="h-5 w-5 sm:h-8 sm:w-8 text-white" />
                  </div>
                  <div className="text-xl sm:text-3xl font-bold text-white mb-1 sm:mb-2">
                    {value}
                  </div>
                  <div className="text-xs sm:text-base text-indigo-200">{label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        {/* Feedback Form - Only render when showFeedbackForm is true */}
        {showFeedbackForm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/30 backdrop-blur-sm animate-fade-in">
            <div className="w-full max-w-md bg-white rounded-xl shadow-2xl overflow-hidden animate-scale-up max-h-[80vh] overflow-y-auto">
              {/* Form Header with Gradient - Smaller and more compact */}
              <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-t-xl p-4 text-white relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-full">
                  <div className="absolute top-10 right-10 w-20 h-20 bg-white rounded-full opacity-10 blur-xl"></div>
                </div>

                <div className="relative z-10 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="p-2 bg-white/20 rounded-full">
                      <MessageSquare className="h-5 w-5" />
                    </div>
                    <h2 className="text-xl font-bold">Your Feedback Matters</h2>
                  </div>
                  <button 
                    onClick={() => setShowFeedbackForm(false)}
                    className="text-white/80 hover:text-white p-1"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
              </div>

              <div className="p-5">
                {error && (
                  <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-3 rounded mb-4 text-sm animate-pulse">
                    <div className="flex items-center">
                      <X className="h-4 w-4 mr-2 flex-shrink-0" />
                      <p>{error}</p>
                    </div>
                  </div>
                )}

                {success && (
                  <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-3 rounded mb-4 text-sm animate-pulse">
                    <div className="flex items-center">
                      <div className="rounded-full bg-green-500 p-1 mr-2">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-white" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <p>{success}</p>
                    </div>
                  </div>
                )}

                <form onSubmit={handleFeedbackSubmit} className="space-y-4">
                  {/* Rating with animated stars - more compact */}
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <label className="block text-gray-700 text-sm font-medium mb-2 text-center">
                      How would you rate your experience?
                    </label>
                    <div className="flex justify-center gap-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setRating(star)}
                          onMouseEnter={() => setHoveredRating(star)}
                          onMouseLeave={() => setHoveredRating(0)}
                          className="focus:outline-none transform transition-transform hover:scale-110 active:scale-95"
                        >
                          <Star
                            className={`h-8 w-8 ${
                              star <= (hoveredRating || rating)
                                ? "fill-yellow-400 text-yellow-400"
                                : "text-gray-300"
                            } transition-all duration-200 ${
                              star <= rating ? "animate-pulse-once" : ""
                            }`}
                          />
                        </button>
                      ))}
                    </div>

                    {/* Rating label */}
                    <div className="text-center mt-2 h-5 text-sm">
                      {rating > 0 && (
                        <span className="inline-block px-2 py-0.5 bg-indigo-100 text-indigo-800 rounded-full text-xs font-medium animate-fade-in">
                          {rating === 1 && "Needs Improvement"}
                          {rating === 2 && "Fair"}
                          {rating === 3 && "Good"}
                          {rating === 4 && "Very Good"}
                          {rating === 5 && "Excellent!"}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Category with icons (disabled) - more compact */}
                  <div className="relative">
                    <label className="block text-gray-700 text-sm font-medium mb-1">
                      Category
                    </label>
                    <div className="relative">
                      <select
                        disabled
                        className="w-full p-2 pl-10 border border-gray-300 rounded-lg bg-gray-100 text-gray-700 appearance-none cursor-not-allowed text-sm"
                      >
                        <option>Feature Request</option>
                      </select>
                      <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-indigo-500">
                        <Trophy className="h-4 w-4" />
                      </div>
                      <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none">
                        <ChevronDown className="h-4 w-4" />
                      </div>
                    </div>
                  </div>
                  
                  {/* Message about upcoming features */}
                  <div className="p-2 bg-indigo-50 text-indigo-700 rounded-lg text-xs">
                    New features and improvements are on the way. Share your thoughts and help us shape the future!
                  </div>

                  {/* Feedback with character count */}
                  <div>
                    <label className="block text-gray-700 text-sm font-medium mb-1">
                      Share your thoughts with us
                    </label>
                    <div className="relative">
                      <textarea
                        value={formData.description}
                        onChange={(e) => {
                          if (e.target.value.length <= 400) {
                            setFormData({ ...formData, description: e.target.value })
                          }
                        }}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm"
                        rows={3}
                        required
                        minLength={10}
                        maxLength={400}
                        placeholder="What did you like about our services? What can we improve?"
                      />
                      <div className="absolute bottom-1 right-2 text-xs text-gray-500">
                        {formData.description.length}/400
                      </div>
                    </div>

                    {/* Feedback tips - simplified */}
                    {formData.description.length > 0 && formData.description.length < 30 && (
                      <p className="mt-1 text-xs text-amber-600">
                        💡 Consider adding more details to help us understand your feedback.
                      </p>
                    )}
                  </div>

                  {/* Submit Button with animation - more compact */}
                  <div className="flex justify-between items-center pt-3 border-t border-gray-200">
                    <button
                      type="button"
                      onClick={() => setShowFeedbackForm(false)}
                      className="px-3 py-1.5 text-gray-600 hover:text-gray-800 text-sm font-medium transition-colors"
                    >
                      Cancel
                    </button>

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all text-sm font-semibold flex items-center gap-1.5 disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg"
                    >
                      {isSubmitting ? (
                        <>
                          <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
                          <span>Submitting...</span>
                        </>
                      ) : (
                        <>
                          <Send className="h-4 w-4" />
                          <span>Submit Feedback</span>
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
        
        {/* Thank you message that appears after submission */}
        {success && (
          <div className="fixed bottom-6 right-6 bg-white p-4 rounded-xl shadow-xl z-50 animate-fade-in">
            <div className="flex items-center">
              <div className="bg-green-100 p-3 rounded-full mr-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div>
                <h3 className="font-bold text-gray-900">Thank you!</h3>
                <p className="text-gray-600">{success}</p>
              </div>
            </div>
          </div>
        )}

        {/* Scroll indicator - positioned at the very bottom */}
        <div
          className={`absolute bottom-6 left-1/2 transform -translate-x-1/2 flex flex-col items-center cursor-pointer transition-opacity duration-500 ${
            isLoaded ? 'opacity-70 hover:opacity-100' : 'opacity-0'
          }`}
          onClick={scrollToContent}
        >
          <span className="text-white text-xs md:text-sm mb-1">Scroll to explore</span>
          <ChevronDown className="text-white animate-bounce h-5 w-5 md:h-6 md:w-6" />
        </div>
      </div>
      
      {/* Custom animations */}
      <style jsx>{`
        @keyframes pulse-once {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.2); }
        }
        .animate-pulse-once {
          animation: pulse-once 0.5s ease-in-out;
        }

        @keyframes fade-in {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fade-in 0.3s ease-out forwards;
        }

        @keyframes scale-up {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }
        .animate-scale-up {
          animation: scale-up 0.3s ease-out forwards;
        }

        @keyframes shrink {
          from { width: 100%; }
          to { width: 0%; }
        }
      `}</style>
    </div>
  );
};

export default HeroSection;