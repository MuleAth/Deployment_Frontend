import React, { useState, useEffect, useRef } from "react";
import { Star, Send, MessageSquare, ChevronDown, ChevronUp, Camera, Award, Trophy, Medal, ArrowLeft, ArrowRight, Maximize, X, Heart, Share2, Download, ZoomIn, ZoomOut } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import AchievementSection from "../components/AchievementSection";

const FeedbackForm = () => {
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [formData, setFormData] = useState({
    reason: "",
    description: "",
  });
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showForm, setShowForm] = useState(false);
  const token = useSelector((state) => state.auth.token);
  const categories = [
    "Sports Facilities",
    "Equipment Quality",
    "Coaching Staff",
    "Events Organization",
    "Overall Experience",
    "Other",
  ];

  // Photo Gallery States
  const [isVisible, setIsVisible] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isZoomed, setIsZoomed] = useState(false);
  const galleryRef = useRef(null);

  // Achievement Photos Data - Two photos for slideshow
  const achievementPhotos = [
    {
      id: 1,
      src: "/Achieve.jpg", // Local photo from public directory
      caption: "Sinhgad Olympus 2024 Champions"
    },
    {
      id: 2,
      src: "/Achieve 2.jpg", // Second local photo
      caption: "Celebrating Excellence in Sports with HOD of IT Department"
    }
  ];

  // State for slideshow
  const [currentSlide, setCurrentSlide] = useState(0);

  // Handle image click to open modal
  const handleImageClick = () => {
    setSelectedImage(achievementPhotos[currentSlide]);
    setIsModalOpen(true);
  };
  
  // Navigate to next slide
  const nextSlide = (e) => {
    e.stopPropagation();
    setCurrentSlide((prev) => (prev + 1) % achievementPhotos.length);
  };
  
  // Navigate to previous slide
  const prevSlide = (e) => {
    e.stopPropagation();
    setCurrentSlide((prev) => (prev === 0 ? achievementPhotos.length - 1 : prev - 1));
  };

  // Handle modal close
  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedImage(null);
    setIsZoomed(false);
  };

  // No auto-advance - only change slides on click

  // Intersection Observer for gallery visibility
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

    if (galleryRef.current) {
      observer.observe(galleryRef.current);
    }

    return () => {
      if (galleryRef.current) {
        observer.unobserve(galleryRef.current);
      }
    };
  }, []);

  // Handle escape key to close modal
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        closeModal();
      }
    };

    if (isModalOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isModalOpen]);

  // Simplified gallery with no additional interactions

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setIsSubmitting(true);

    if (rating === 0) {
      setError("Please select a rating before submitting.");
      setIsSubmitting(false);
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
        setShowForm(false);
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

  return (
    <div className="flex flex-col min-h-screen">
      {/* Achievement Section */}
      <AchievementSection />

      {/* Achievement Photo Gallery Section - Simplified */}
      <section
        ref={galleryRef}
        className="py-16 bg-gradient-to-b from-purple-900 to-indigo-900 text-white relative overflow-hidden"
      >
        {/* Background decorative elements */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
          <div className="absolute top-20 right-20 w-72 h-72 bg-yellow-400 rounded-full opacity-10 blur-3xl"></div>
          <div className="absolute bottom-20 left-20 w-96 h-96 bg-purple-500 rounded-full opacity-10 blur-3xl"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          {/* Section Header */}
          <div
            className={`text-center mb-12 transition-all duration-700 ${
              isVisible ? "opacity-100 transform translate-y-0" : "opacity-0 transform -translate-y-8"
            }`}
          >
            <div className="flex items-center justify-center mb-4">
              <Camera className="h-10 w-10 text-yellow-400 mr-3" />
              <h2 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-yellow-300 to-yellow-500">
                Achievement Gallery
              </h2>
            </div>
            <p className="text-xl opacity-90 max-w-2xl mx-auto">
              Capturing moments of triumph, dedication, and excellence in our sporting journey
            </p>
          </div>

          {/* Mobile-Responsive Achievement Gallery - Single Image Slideshow */}
          <div
            className={`max-w-4xl mx-auto transition-all duration-700 delay-200 ${
              isVisible ? "opacity-100 transform translate-y-0" : "opacity-0 transform translate-y-8"
            }`}
          >
            <div className="relative cursor-pointer overflow-hidden rounded-xl shadow-2xl ring-2 ring-violet-500/30 hover:ring-violet-500/60 transition-all duration-300 transform hover:scale-[1.01]"
                onClick={handleImageClick}>
              <div className="relative aspect-[16/9]">
                <img
                  src={achievementPhotos[currentSlide].src}
                  alt={achievementPhotos[currentSlide].caption}
                  className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                />
                
                {/* Zoom indicator */}
                <div className="absolute top-3 right-3 bg-white/90 rounded-full p-2 shadow-lg z-10">
                  <ZoomIn className="h-5 w-5 text-gray-700" />
                </div>
                
                {/* Navigation buttons */}
                <button 
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white rounded-full p-2 transition-all duration-200 z-10"
                  onClick={prevSlide}
                >
                  <ArrowLeft className="h-5 w-5 md:h-6 md:w-6" />
                </button>
                
                <button 
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white rounded-full p-2 transition-all duration-200 z-10"
                  onClick={nextSlide}
                >
                  <ArrowRight className="h-5 w-5 md:h-6 md:w-6" />
                </button>
                
                {/* Text overlay at bottom */}
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-violet-900/95 via-violet-800/70 to-transparent p-4 md:p-6">
                  <h3 className="text-white font-bold text-lg md:text-2xl mb-2 leading-tight">
                    {achievementPhotos[currentSlide].caption}
                  </h3>
                  <div className="w-16 md:w-24 h-1 bg-gradient-to-r from-yellow-400 to-purple-400 mb-2 rounded-full"></div>
                  <p className="text-violet-100 text-sm md:text-base leading-tight">
                    {currentSlide === 0 ? "Victory through dedication and teamwork" : "Building champions on and off the field"}
                  </p>
                </div>
              </div>
            </div>
            
            {/* Slide indicators */}
            <div className="flex justify-center mt-4 space-x-2">
              {achievementPhotos.map((_, index) => (
                <button
                  key={index}
                  onClick={(e) => {
                    e.stopPropagation();
                    setCurrentSlide(index);
                  }}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    currentSlide === index ? "bg-yellow-400 w-6" : "bg-white/50 hover:bg-white/70"
                  }`}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>
          </div>

        </div>

        {/* Custom CSS for text effects */}
        <style jsx>{`
          .text-shadow-lg {
            text-shadow: 0 2px 10px rgba(0, 0, 0, 0.5);
          }
        `}</style>
      </section>

      {/* Feedback Button and Form Section */}
      <div className="relative flex flex-col items-center justify-center p-8 bg-gradient-to-b from-gray-50 to-gray-100 overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
          <div className="absolute top-20 right-20 w-72 h-72 bg-indigo-400 rounded-full opacity-5 blur-3xl"></div>
          <div className="absolute bottom-20 left-20 w-96 h-96 bg-purple-500 rounded-full opacity-5 blur-3xl"></div>
        </div>

        {/* Give Feedback Button */}
        <button
          onClick={() => setShowForm(!showForm)}
          className="mb-6 px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-full hover:from-indigo-700 hover:to-purple-700 transition-all font-semibold flex items-center gap-2 shadow-lg hover:shadow-xl transform hover:-translate-y-1 active:translate-y-0 active:shadow-md"
        >
          <MessageSquare className="h-5 w-5" />
          {showForm ? "Hide Feedback Form" : "Share Your Feedback"}
          {showForm ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
        </button>

        {/* Feedback Form - Only render when showForm is true */}
        {showForm && (
        <div
          className="bg-white shadow-2xl rounded-xl p-0 my-4 max-w-2xl w-full transition-all duration-500 ease-in-out transform opacity-100 scale-100"
        >
          {/* Form Header with Gradient */}
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-t-xl p-8 text-white relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-full">
              <div className="absolute top-10 right-10 w-40 h-40 bg-white rounded-full opacity-10 blur-2xl"></div>
              <div className="absolute bottom-5 left-5 w-20 h-20 bg-yellow-400 rounded-full opacity-20 blur-xl"></div>
            </div>

            <div className="relative z-10 text-center">
              <div className="inline-block p-3 bg-white/20 rounded-full mb-4">
                <MessageSquare className="h-8 w-8" />
              </div>
              <h2 className="text-3xl font-bold mb-2">
                Your Feedback Matters
              </h2>
              <p className="text-white/80 mt-2 max-w-md mx-auto">
                Help us improve our sports facilities and services. Your insights drive our excellence.
              </p>
            </div>
          </div>

          <div className="p-8">
            {error && (
              <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded mb-6 animate-pulse">
                <div className="flex items-center">
                  <X className="h-5 w-5 mr-2 flex-shrink-0" />
                  <p>{error}</p>
                </div>
              </div>
            )}

            {success && (
              <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 rounded mb-6 animate-pulse">
                <div className="flex items-center">
                  <div className="rounded-full bg-green-500 p-1 mr-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <p>{success}</p>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Rating with animated stars */}
              <div className="bg-gray-50 p-6 rounded-xl">
                <label className="block text-gray-700 font-medium mb-4 text-center">
                  How would you rate your experience?
                </label>
                <div className="flex justify-center gap-3">
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
                        className={`h-10 w-10 ${
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
                <div className="text-center mt-3 h-6">
                  {rating > 0 && (
                    <span className="inline-block px-3 py-1 bg-indigo-100 text-indigo-800 rounded-full text-sm font-medium animate-fade-in">
                      {rating === 1 && "Needs Improvement"}
                      {rating === 2 && "Fair"}
                      {rating === 3 && "Good"}
                      {rating === 4 && "Very Good"}
                      {rating === 5 && "Excellent!"}
                    </span>
                  )}
                </div>
              </div>

              {/* Category with icons */}
              <div className="relative">
                <label className="block text-gray-700 font-medium mb-2">
                  What area would you like to give feedback on?
                </label>
                <div className="relative">
                  <select
                    value={formData.reason}
                    onChange={(e) =>
                      setFormData({ ...formData, reason: e.target.value })
                    }
                    className="w-full p-3 pl-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent appearance-none bg-white"
                    required
                  >
                    <option value="">Select a category</option>
                    {categories.map((category) => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                  <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-indigo-500">
                    <Trophy className="h-5 w-5" />
                  </div>
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none">
                    <ChevronDown className="h-5 w-5" />
                  </div>
                </div>
              </div>

              {/* Feedback with character count */}
              <div>
                <label className="block text-gray-700 font-medium mb-2">
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
                    className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    rows={4}
                    required
                    minLength={10}
                    maxLength={400}
                    placeholder="What did you like about our services? What can we improve?"
                  />
                  <div className="absolute bottom-2 right-2 text-xs text-gray-500">
                    {formData.description.length}/400 characters
                  </div>
                </div>

                {/* Feedback tips */}
                {formData.description.length > 0 && formData.description.length < 30 && (
                  <p className="mt-2 text-sm text-amber-600">
                    <span className="inline-block align-middle mr-1">💡</span>
                    Consider adding more details to help us better understand your feedback.
                  </p>
                )}
              </div>

              {/* Submit Button with animation */}
              <div className="flex justify-between items-center pt-4 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800 font-medium transition-colors"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all font-semibold flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg"
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full"></div>
                      <span>Submitting...</span>
                    </>
                  ) : (
                    <>
                      <Send className="h-5 w-5" />
                      <span>Submit Feedback</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
        )}

        {/* Thank you message that appears after submission */}
        {success && (
          <div className="mt-6 text-center">
            <Heart className="h-8 w-8 text-red-500 mx-auto mb-2 animate-pulse" />
            <p className="text-gray-700 font-medium">Thank you for helping us improve!</p>
          </div>
        )}

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
        `}</style>
      </div>

      {/* Image Modal - Simplified with better image display */}
      {isModalOpen && selectedImage && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm p-2 md:p-4"
          onClick={closeModal}
        >
          <div 
            className="relative max-w-5xl max-h-[95vh] w-full rounded-xl overflow-hidden shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close button */}
            <button
              onClick={closeModal}
              className="absolute top-4 right-4 z-10 bg-black/60 hover:bg-black/80 text-white rounded-full p-2 md:p-3 transition-colors duration-200"
            >
              <X className="h-5 w-5 md:h-6 md:w-6" />
            </button>
            
            {/* Zoom button */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                setIsZoomed(!isZoomed);
              }}
              className="absolute top-4 right-16 z-10 bg-black/60 hover:bg-black/80 text-white rounded-full p-2 md:p-3 transition-colors duration-200"
            >
              {isZoomed ? 
                <ZoomOut className="h-5 w-5 md:h-6 md:w-6" /> : 
                <ZoomIn className="h-5 w-5 md:h-6 md:w-6" />
              }
            </button>

            {/* Image container with caption - optimized for full-screen viewing */}
            <div className="relative flex items-center justify-center h-[90vh] overflow-hidden">
              <div className={`relative transition-transform duration-300 ease-out ${isZoomed ? 'scale-150 cursor-zoom-out' : 'cursor-zoom-in'}`}
                   onClick={(e) => {
                     e.stopPropagation();
                     setIsZoomed(!isZoomed);
                   }}>
                <img
                  src={selectedImage.src}
                  alt={selectedImage.caption}
                  className="max-w-full max-h-full object-contain"
                />
                
                {/* Caption overlay at bottom - now part of the image container */}
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4 md:p-6 text-center">
                  <h2 className="text-xl md:text-2xl font-bold text-white">{selectedImage.caption}</h2>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FeedbackForm;
