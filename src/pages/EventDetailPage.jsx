import React, { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useSelector } from "react-redux";
import { useParams, useNavigate, Link, useSearchParams } from "react-router-dom";
import {
  Calendar,
  MapPin,
  Clock,
  Award,
  CheckCircle,
  AlertCircle,
  Info,
  Star,
  Clipboard,
  Medal,
  User,
  Phone,
  Mail,
  Heart,
  ArrowLeft,
  Share2,
  Users,
  X,
  Loader,
} from "lucide-react";

const EventDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const shouldRegister = searchParams.get('register') === 'true';

  const [event, setEventDetails] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    termsAccepted: false,
    rulesAccepted: false,
    teamName: "",
    teamMembers: "",
  });
  const user = useSelector((state) => state.auth.id);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [activeSection, setActiveSection] = useState("details");
  const [showShareOptions, setShowShareOptions] = useState(false);

  // Retrieve the current user from Redux
  const token = useSelector((state) => state.auth.token);
  const isVerifiedByAdmin = useSelector(
    (state) => state.auth.isVerifiedByAdmin
  );

  // Calculate days remaining until registration deadline
  const calculateDaysRemaining = (dateString) => {
    const eventDate = new Date(dateString);
    const today = new Date();
    const diffTime = eventDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 0;
  };

  useEffect(() => {
    const fetchEventDetails = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(
          `https://sportalon-backend.onrender.com/api/user/getevent/${id}`
        );
        const data = await response.json();
        if (data.success) {
          // Add a small delay to show loading animation
          setTimeout(() => {
            console.log("Event data received:", data.event);
            console.log("Coordinator name:", data.event.coordinator_name);
            console.log("Coordinator phone:", data.event.coordinator_no);
            setEventDetails(data.event);
            setIsLoading(false);

            // If register=true parameter is present and user can register, show the form
            if (shouldRegister && token && isVerifiedByAdmin) {
              setShowForm(true);
            }
          }, 600);
        } else {
          console.error("Error fetching event details:", data.message);
          setIsLoading(false);
        }
      } catch (error) {
        console.error("Fetch error:", error);
        setIsLoading(false);
      }
    };
    fetchEventDetails();
  }, [id, shouldRegister, token, isVerifiedByAdmin]);

  // Handle registration form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    if (!user || !token) {
      toast.error("User not authenticated. Please log in again.", {
        position: "top-right",
        theme: "colored",
      });
      setIsSubmitting(false);
      return;
    }
    
    if (!isVerifiedByAdmin) {
      toast.error("Your profile is not yet approved by admin. Please wait for approval.", {
        position: "top-right",
        theme: "colored",
      });
      setIsSubmitting(false);
      return;
    }
    
    // Check if registration is still open
    const isRegistrationOpen = new Date(event.applyLastDate) >= new Date();
    if (!isRegistrationOpen) {
      toast.error("Registration for this event has closed.", {
        position: "top-right",
        theme: "colored",
      });
      setIsSubmitting(false);
      return;
    }
    
    // Check if terms and rules are accepted
    if (!formData.termsAccepted || !formData.rulesAccepted) {
      toast.error("Please accept the terms and rules to continue.", {
        position: "top-right",
        theme: "colored",
      });
      setIsSubmitting(false);
      return;
    }

    try {
      const response = await fetch(
        `https://sportalon-backend.onrender.com/api/user/getevent/register-event/${event._id}/${user}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
          },
          body: JSON.stringify(formData),
        }
      );

      // Check if response is JSON
      const textResponse = await response.text();
      console.log("Raw Response:", textResponse);

      const data = JSON.parse(textResponse); // Convert to JSON
      console.log("Parsed JSON:", data);

      if (response.ok) {
        toast.success(`Successfully registered for ${event.title}!`, {
          position: "top-right",
          autoClose: 2500,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          theme: "colored",
        });

        // Update the UI to reflect the registration
        setShowForm(false);
        
        // Refresh the event details to show updated participant count
        setTimeout(() => {
          window.location.reload();
        }, 2000);
      } else {
        toast.error(data.message, {
          position: "top-right",
          autoClose: 2500,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          theme: "colored",
        });
      }
    } catch (error) {
      console.error("Registration error:", error);
      
      // Provide more specific error messages based on the error
      let errorMessage = "An error occurred during registration. Please try again later.";
      
      if (error.message && error.message.includes("Failed to fetch")) {
        errorMessage = "Unable to connect to the server. Please check your internet connection.";
      } else if (error.message && error.message.includes("Unauthorized")) {
        errorMessage = "Your session has expired. Please log in again.";
      }
      
      toast.error(errorMessage, {
        position: "top-right",
        theme: "colored",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Share event
  const shareEvent = (platform) => {
    const eventUrl = window.location.href;
    const eventTitle = event.title;

    let shareUrl;

    switch (platform) {
      case 'facebook':
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(eventUrl)}`;
        break;
      case 'twitter':
        shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(`Check out this event: ${eventTitle}`)}&url=${encodeURIComponent(eventUrl)}`;
        break;
      case 'whatsapp':
        shareUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(`Check out this event: ${eventTitle} ${eventUrl}`)}`;
        break;
      case 'copy':
        navigator.clipboard.writeText(eventUrl);
        toast.success("Link copied to clipboard!", {
          position: "bottom-center",
          autoClose: 2000,
          hideProgressBar: true,
          theme: "colored",
        });
        setShowShareOptions(false);
        return;
      default:
        return;
    }

    window.open(shareUrl, '_blank', 'noopener,noreferrer');
    setShowShareOptions(false);
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-indigo-50 to-white">
        <Loader className="h-12 w-12 text-indigo-600 animate-spin mb-4" />
        <p className="text-gray-600 animate-pulse">Loading event details...</p>
      </div>
    );
  }

  // Error state
  if (!event) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-indigo-50 to-white">
        <div className="text-center max-w-md p-8 bg-white rounded-xl shadow-lg">
          <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Event not found
          </h2>
          <p className="text-gray-600 mb-6">
            The event you're looking for doesn't exist or has been removed.
          </p>
          <button
            onClick={() => navigate("/events")}
            className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg transition-colors flex items-center justify-center mx-auto"
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            Back to Events
          </button>
        </div>
      </div>
    );
  }

  // Calculate registration status
  const isRegistrationOpen = new Date(event.applyLastDate) >= new Date();
  const daysRemaining = calculateDaysRemaining(event.applyLastDate);
  const canRegister = token && isVerifiedByAdmin && isRegistrationOpen;

  // Format dates for display
  const formattedStartDate = new Date(event.startDate).toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  const formattedEndDate = new Date(event.endDate).toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  const formattedDeadline = new Date(event.applyLastDate).toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-50 to-white">
      <ToastContainer />

      {/* Hero Section */}
      <div className="bg-gradient-to-r from-indigo-900 to-purple-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Back button */}
          <div className="mb-6">
            <button
              onClick={() => navigate("/events")}
              className="flex items-center text-indigo-200 hover:text-white transition-colors"
            >
              <ArrowLeft className="h-5 w-5 mr-2" />
              Back to Events
            </button>
          </div>

          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <div className="flex items-center mb-4">
                <span className={`px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider mr-3 ${
                  isRegistrationOpen ? "bg-green-500 text-white" : "bg-red-500 text-white"
                }`}>
                  {isRegistrationOpen ? "Registration Open" : "Registration Closed"}
                </span>
                <span className="text-indigo-200 text-sm">
                  {event.participants?.length || 0} participants
                </span>
              </div>

              <h1 className="text-4xl md:text-5xl font-bold mb-4">
                {event.title}
              </h1>

              <div className="flex flex-wrap gap-4 text-indigo-200 mb-6">
                <span className="flex items-center">
                  <Calendar className="h-5 w-5 mr-2" />
                  {formattedStartDate}
                </span>
                <span className="flex items-center">
                  <MapPin className="h-5 w-5 mr-2" />
                  {event.location}
                </span>
              </div>

              <div className="flex flex-wrap gap-3">
                <button
                  onClick={() => setShowForm(true)}
                  disabled={!canRegister}
                  className={`px-6 py-3 rounded-lg font-semibold flex items-center transition-all duration-300 ${
                    canRegister
                      ? "bg-indigo-500 hover:bg-indigo-600 text-white"
                      : "bg-gray-300 cursor-not-allowed text-gray-500"
                  }`}
                >
                  {!token
                    ? "Login To Register"
                    : !isVerifiedByAdmin
                    ? "Profile Not Approved"
                    : isRegistrationOpen
                    ? "Register Now"
                    : "Registration Closed"}
                </button>

                <div className="relative">
                  <button
                    onClick={() => setShowShareOptions(!showShareOptions)}
                    className="px-4 py-3 bg-white/10 hover:bg-white/20 rounded-lg font-semibold text-white flex items-center transition-colors"
                  >
                    <Share2 className="h-5 w-5 mr-2" />
                    Share
                  </button>

                  {/* Share options dropdown */}
                  {showShareOptions && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg overflow-hidden z-50">
                      <div className="p-2">
                        <button
                          onClick={() => shareEvent('facebook')}
                          className="w-full text-left px-4 py-2 text-gray-700 hover:bg-indigo-50 rounded flex items-center"
                        >
                          <span className="w-8 h-8 flex items-center justify-center bg-blue-500 text-white rounded-full mr-2">f</span>
                          Facebook
                        </button>
                        <button
                          onClick={() => shareEvent('twitter')}
                          className="w-full text-left px-4 py-2 text-gray-700 hover:bg-indigo-50 rounded flex items-center"
                        >
                          <span className="w-8 h-8 flex items-center justify-center bg-blue-400 text-white rounded-full mr-2">t</span>
                          Twitter
                        </button>
                        <button
                          onClick={() => shareEvent('whatsapp')}
                          className="w-full text-left px-4 py-2 text-gray-700 hover:bg-indigo-50 rounded flex items-center"
                        >
                          <span className="w-8 h-8 flex items-center justify-center bg-green-500 text-white rounded-full mr-2">w</span>
                          WhatsApp
                        </button>
                        <button
                          onClick={() => shareEvent('copy')}
                          className="w-full text-left px-4 py-2 text-gray-700 hover:bg-indigo-50 rounded flex items-center"
                        >
                          <span className="w-8 h-8 flex items-center justify-center bg-gray-500 text-white rounded-full mr-2">
                            <Clipboard className="h-4 w-4" />
                          </span>
                          Copy Link
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="relative rounded-xl overflow-hidden shadow-2xl h-64 md:h-80">
              <img
                src={event.imageUrl || "/default_img.jpeg"}
                alt={event.title}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.onerror = null; // Prevent infinite loop
                  e.target.src = "/default_img.jpeg";
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />

              {/* Event countdown */}
              {isRegistrationOpen && (
                <div className="absolute bottom-4 left-4 right-4">
                  <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                    <div className="text-center">
                      <p className="text-indigo-200 mb-2">Registration closes in</p>
                      <div className="flex justify-center gap-3">
                        <div className="bg-indigo-900/60 rounded-lg px-3 py-2 min-w-[60px]">
                          <div className="text-2xl font-bold">{daysRemaining}</div>
                          <div className="text-xs text-indigo-200">days</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="sticky top-0 bg-white shadow-md z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex overflow-x-auto hide-scrollbar">
            <button
              onClick={() => setActiveSection('details')}
              className={`px-6 py-4 font-medium whitespace-nowrap border-b-2 transition-colors ${
                activeSection === 'details'
                  ? 'border-indigo-600 text-indigo-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Details
            </button>
            <button
              onClick={() => setActiveSection('rules')}
              className={`px-6 py-4 font-medium whitespace-nowrap border-b-2 transition-colors ${
                activeSection === 'rules'
                  ? 'border-indigo-600 text-indigo-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Rules
            </button>
            <button
              onClick={() => setActiveSection('contact')}
              className={`px-6 py-4 font-medium whitespace-nowrap border-b-2 transition-colors ${
                activeSection === 'contact'
                  ? 'border-indigo-600 text-indigo-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Contact
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Details Section */}
            <div className={activeSection === 'details' ? 'block' : 'hidden'}>
              {/* Event Overview */}
              <section className="bg-white rounded-xl p-6 shadow-lg mb-6">
                <h2 className="text-2xl font-bold mb-6 flex items-center">
                  <Info className="h-6 w-6 text-indigo-600 mr-2" />
                  Event Overview
                </h2>

                <div className="prose max-w-none text-gray-600">
                  <p className="mb-4">{event.description}</p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                    <div className="bg-indigo-50 rounded-lg p-4">
                      <h3 className="font-semibold text-indigo-900 mb-2">Date & Time</h3>
                      <div className="space-y-2 text-gray-700">
                        <div className="flex items-start">
                          <Calendar className="h-5 w-5 text-indigo-600 mr-2 mt-0.5" />
                          <div>
                            <p className="font-medium">Start Date:</p>
                            <p>{formattedStartDate}</p>
                          </div>
                        </div>
                        <div className="flex items-start">
                          <Calendar className="h-5 w-5 text-indigo-600 mr-2 mt-0.5" />
                          <div>
                            <p className="font-medium">End Date:</p>
                            <p>{formattedEndDate}</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="bg-indigo-50 rounded-lg p-4">
                      <h3 className="font-semibold text-indigo-900 mb-2">Location</h3>
                      <div className="flex items-start">
                        <MapPin className="h-5 w-5 text-indigo-600 mr-2 mt-0.5" />
                        <div>
                          <p className="font-medium">{event.location}</p>
                          <p className="text-gray-700">Sinhgad College Campus</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </section>

              {/* Event Highlights */}
              <section className="bg-white rounded-xl p-6 shadow-lg mb-6">
                <h2 className="text-2xl font-bold mb-6 flex items-center">
                  <Star className="h-6 w-6 text-indigo-600 mr-2" />
                  Event Highlights
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="flex flex-col items-center p-4 bg-gradient-to-br from-indigo-50 to-purple-50 rounded-lg text-center hover:shadow-md transition-shadow">
                    <div className="bg-indigo-100 p-3 rounded-full mb-3">
                      <Medal className="h-8 w-8 text-indigo-600" />
                    </div>
                    <h3 className="font-semibold text-gray-900">Medals & Trophies</h3>
                    <p className="text-sm text-gray-600 mt-1">
                      For winners & runners-up
                    </p>
                  </div>

                  <div className="flex flex-col items-center p-4 bg-gradient-to-br from-indigo-50 to-purple-50 rounded-lg text-center hover:shadow-md transition-shadow">
                    <div className="bg-indigo-100 p-3 rounded-full mb-3">
                      <Award className="h-8 w-8 text-indigo-600" />
                    </div>
                    <h3 className="font-semibold text-gray-900">Certificates</h3>
                    <p className="text-sm text-gray-600 mt-1">
                      For all participants
                    </p>
                  </div>

                  <div className="flex flex-col items-center p-4 bg-gradient-to-br from-indigo-50 to-purple-50 rounded-lg text-center hover:shadow-md transition-shadow">
                    <div className="bg-indigo-100 p-3 rounded-full mb-3">
                      <Users className="h-8 w-8 text-indigo-600" />
                    </div>
                    <h3 className="font-semibold text-gray-900">Networking</h3>
                    <p className="text-sm text-gray-600 mt-1">
                      Connect with peers
                    </p>
                  </div>
                </div>
              </section>

              {/* Prizes */}
              <section className="bg-white rounded-xl p-6 shadow-lg">
                <h2 className="text-2xl font-bold mb-6 flex items-center">
                  <Award className="h-6 w-6 text-indigo-600 mr-2" />
                  Prizes & Rewards
                </h2>

                <div className="prose max-w-none text-gray-600">
                  <p className="mb-6">{event.prizes || "Exciting prizes await the winners of this event!"}</p>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-gradient-to-b from-yellow-50 to-yellow-100 rounded-lg p-4 text-center border border-yellow-200 hover:shadow-md transition-shadow">
                      <div className="bg-yellow-200 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3">
                        <span className="text-2xl font-bold text-yellow-700">1st</span>
                      </div>
                      <h3 className="font-bold text-gray-900">First Prize</h3>
                      <p className="text-gray-700">Trophy + Certificate + ₹5,000</p>
                    </div>

                    <div className="bg-gradient-to-b from-gray-50 to-gray-100 rounded-lg p-4 text-center border border-gray-200 hover:shadow-md transition-shadow">
                      <div className="bg-gray-200 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3">
                        <span className="text-2xl font-bold text-gray-700">2nd</span>
                      </div>
                      <h3 className="font-bold text-gray-900">Second Prize</h3>
                      <p className="text-gray-700">Trophy + Certificate + ₹3,000</p>
                    </div>

                    <div className="bg-gradient-to-b from-orange-50 to-orange-100 rounded-lg p-4 text-center border border-orange-200 hover:shadow-md transition-shadow">
                      <div className="bg-orange-200 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3">
                        <span className="text-2xl font-bold text-orange-700">3rd</span>
                      </div>
                      <h3 className="font-bold text-gray-900">Third Prize</h3>
                      <p className="text-gray-700">Trophy + Certificate + ₹2,000</p>
                    </div>
                  </div>
                </div>
              </section>
            </div>

            {/* Rules Section */}
            <div className={activeSection === 'rules' ? 'block' : 'hidden'}>
              <section className="bg-white rounded-xl p-6 shadow-lg">
                <h2 className="text-2xl font-bold mb-6 flex items-center">
                  <Clipboard className="h-6 w-6 text-indigo-600 mr-2" />
                  Rules & Requirements
                </h2>
                <div className="space-y-6">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-3">
                      Eligibility
                    </h3>
                    <ul className="space-y-3">
                      <li className="flex items-start">
                        <CheckCircle className="h-5 w-5 text-green-500 mr-3 mt-1 flex-shrink-0" />
                        <span>
                          Must be a current student with valid college ID
                        </span>
                      </li>
                      <li className="flex items-start">
                        <CheckCircle className="h-5 w-5 text-green-500 mr-3 mt-1 flex-shrink-0" />
                        <span>Age between 18-25 years</span>
                      </li>
                    </ul>
                  </div>

                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-3">
                      Equipment & Dress Code
                    </h3>
                    <ul className="space-y-3">
                      <li className="flex items-start">
                        <CheckCircle className="h-5 w-5 text-green-500 mr-3 mt-1 flex-shrink-0" />
                        <span>Standard sports equipment will be provided</span>
                      </li>
                      <li className="flex items-start">
                        <CheckCircle className="h-5 w-5 text-green-500 mr-3 mt-1 flex-shrink-0" />
                        <span>
                          Participants must wear appropriate sports attire
                        </span>
                      </li>
                    </ul>
                  </div>

                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-3">
                      Important Notes
                    </h3>
                    <ul className="space-y-3">
                      <li className="flex items-start">
                        <AlertCircle className="h-5 w-5 text-yellow-500 mr-3 mt-1 flex-shrink-0" />
                        <span>
                          Participants must report 30 minutes before their
                          scheduled time
                        </span>
                      </li>
                      <li className="flex items-start">
                        <AlertCircle className="h-5 w-5 text-yellow-500 mr-3 mt-1 flex-shrink-0" />
                        <span>Decision of judges will be final and binding</span>
                      </li>
                      <li className="flex items-start">
                        <AlertCircle className="h-5 w-5 text-yellow-500 mr-3 mt-1 flex-shrink-0" />
                        <span>
                          Any form of misbehavior will lead to immediate
                          disqualification
                        </span>
                      </li>
                    </ul>
                  </div>
                </div>
              </section>
            </div>

            {/* Contact Section */}
            <div className={activeSection === 'contact' ? 'block' : 'hidden'}>
              <section className="bg-white rounded-xl p-6 shadow-lg">
                <h2 className="text-2xl font-bold mb-6 flex items-center">
                  <Phone className="h-6 w-6 text-indigo-600 mr-2" />
                  Contact Information
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="flex items-start">
                    <User className="h-5 w-5 text-indigo-600 mr-3 mt-1" />
                    <div>
                      <h3 className="font-semibold">Event Coordinator</h3>
                      <p className="text-gray-600">
                        {event.coordinator_name || "Coordinator information not available"}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <Phone className="h-5 w-5 text-indigo-600 mr-3 mt-1" />
                    <div>
                      <h3 className="font-semibold">Phone</h3>
                      <p className="text-gray-600">
                        {event.coordinator_no ? (
                          <div className="space-y-1">
                            <a 
                              href={`tel:${event.coordinator_no}`}
                              className="text-indigo-600 hover:text-indigo-800 hover:underline transition-colors block"
                            >
                              {event.coordinator_no}
                            </a>
                            <a 
                              href={`https://wa.me/${event.coordinator_no.replace(/[^0-9]/g, '')}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-green-600 hover:text-green-800 text-sm flex items-center hover:underline transition-colors"
                            >
                              <span className="mr-1">📱</span> WhatsApp
                            </a>
                          </div>
                        ) : (
                          "Phone number not available"
                        )}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <Mail className="h-5 w-5 text-indigo-600 mr-3 mt-1" />
                    <div>
                      <h3 className="font-semibold">Email</h3>
                      <p className="text-gray-600">
                        <a 
                          href="mailto:sports@sinhgad.edu"
                          className="text-indigo-600 hover:text-indigo-800 hover:underline transition-colors"
                        >
                          sports@sinhgad.edu
                        </a>
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <Heart className="h-5 w-5 text-indigo-600 mr-3 mt-1" />
                    <div>
                      <h3 className="font-semibold">Emergency Support</h3>
                      <p className="text-gray-600">
                        <a 
                          href="tel:+919876543211"
                          className="text-indigo-600 hover:text-indigo-800 hover:underline transition-colors"
                        >
                          +91 98765 43211
                        </a>
                      </p>
                    </div>
                  </div>
                </div>
              </section>
            </div>
          </div>

          {/* Right Column - Sidebar */}
          <div className="lg:col-span-1">
            {/* Registration Card */}
            <div className="bg-white rounded-xl p-6 shadow-lg sticky top-24">
              <div className="mb-6">
                <div className="text-2xl font-bold mb-2">
                  Registration Details
                </div>
                <div className="text-gray-600 mb-4">
                  <div className="flex items-center">
                    <Clock className="h-5 w-5 text-indigo-500 mr-2" />
                    <span>Deadline: {formattedDeadline}</span>
                  </div>
                </div>

                {/* Registration status */}
                <div className={`mt-4 p-4 rounded-lg ${
                  isRegistrationOpen
                    ? "bg-green-50 border border-green-200"
                    : "bg-red-50 border border-red-200"
                }`}>
                  <h3 className={`font-semibold mb-2 ${
                    isRegistrationOpen ? "text-green-800" : "text-red-800"
                  }`}>
                    {isRegistrationOpen ? "Registration Open" : "Registration Closed"}
                  </h3>
                  <p className={`text-sm ${
                    isRegistrationOpen ? "text-green-700" : "text-red-700"
                  }`}>
                    {isRegistrationOpen
                      ? `${daysRemaining} days remaining to register`
                      : "The registration deadline has passed"}
                  </p>
                </div>

                {/* Event details summary */}
                <div className="mt-6 space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Event Type:</span>
                    <span className="font-medium text-gray-900">Sports Competition</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Duration:</span>
                    <span className="font-medium text-gray-900">
                      {Math.ceil((new Date(event.endDate) - new Date(event.startDate)) / (1000 * 60 * 60 * 24))} days
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Participants:</span>
                    <span className="font-medium text-gray-900">{event.participants?.length || 0} registered</span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => setShowForm(true)}
                disabled={!canRegister}
                className={`w-full py-3 px-4 rounded-lg font-semibold text-center transition-all duration-300 ${
                  canRegister
                    ? "bg-indigo-600 hover:bg-indigo-700 text-white"
                    : "bg-gray-300 cursor-not-allowed text-gray-500"
                }`}
              >
                {!token
                  ? "Login To Register"
                  : !isVerifiedByAdmin
                  ? "Your Profile is not Yet Approved!"
                  : isRegistrationOpen
                  ? "Register Now"
                  : "Registration Closed"}
              </button>

              {/* Share button */}
              <button
                onClick={() => setShowShareOptions(!showShareOptions)}
                className="w-full mt-4 py-2 px-4 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors flex items-center justify-center"
              >
                <Share2 className="h-5 w-5 mr-2" />
                Share Event
              </button>
            </div>
          </div>
        </div>

        {/* Registration Form Modal */}
        {showForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-bold">
                  Register for {event.title}
                </h3>
                <button
                  onClick={() => setShowForm(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Team Information */}
                <div className="space-y-4">
                  <div>
                    <label htmlFor="teamName" className="block text-sm font-medium text-gray-700 mb-1">
                      Team Name (if applicable)
                    </label>
                    <input
                      type="text"
                      id="teamName"
                      value={formData.teamName}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          teamName: e.target.value,
                        })
                      }
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      placeholder="Enter your team name"
                    />
                  </div>

                  <div>
                    <label htmlFor="teamMembers" className="block text-sm font-medium text-gray-700 mb-1">
                      Team Members (if applicable)
                    </label>
                    <textarea
                      id="teamMembers"
                      value={formData.teamMembers}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          teamMembers: e.target.value,
                        })
                      }
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      placeholder="Enter team members' names (one per line)"
                      rows={3}
                    />
                  </div>
                </div>

                {/* Terms and Conditions */}
                <div className="space-y-4 border-t border-gray-200 pt-6">
                  <h4 className="font-medium text-gray-900">Terms and Conditions</h4>

                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="terms"
                      checked={formData.termsAccepted}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          termsAccepted: e.target.checked,
                        })
                      }
                      className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                      required
                    />
                    <label
                      htmlFor="terms"
                      className="ml-2 block text-sm text-gray-700"
                    >
                      I agree to the <span className="text-indigo-600 hover:underline cursor-pointer">terms and conditions</span> *
                    </label>
                  </div>

                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="rules"
                      checked={formData.rulesAccepted}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          rulesAccepted: e.target.checked,
                        })
                      }
                      className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                      required
                    />
                    <label
                      htmlFor="rules"
                      className="ml-2 block text-sm text-gray-700"
                    >
                      I have read and agree to follow all event rules *
                    </label>
                  </div>
                </div>

                <div className="flex gap-4 pt-4">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 rounded-lg transition-all duration-300 flex items-center justify-center"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader className="h-5 w-5 mr-2 animate-spin" />
                        Submitting...
                      </>
                    ) : (
                      "Submit Registration"
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowForm(false)}
                    className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-3 rounded-lg transition-all duration-300"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};





export default EventDetailPage;
