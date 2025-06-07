import React, { useEffect, useState, useRef } from "react";
import { Calendar, MapPin, Clock, Search, X, Loader, Star, Users, Trophy } from "lucide-react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
// Define default image and error handler directly in this file
const DEFAULT_EVENT_IMAGE = "/default_img.jpeg";

const handleImageError = (e) => {
  e.target.onerror = null; // Prevent infinite loop
  e.target.src = DEFAULT_EVENT_IMAGE;
};



const EventsPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [events, setEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [highlightedEvent, setHighlightedEvent] = useState(null);
  const [isSearchFocused, setIsSearchFocused] = useState(false);



  // Enhanced images array with more variety
  const images = [
    "/default_img.jpeg",
    "/default_img.jpeg",
    "/default_img.jpeg",
    "/default_img.jpeg",
    "/default_img.jpeg",
  ];

  // Fetch events data
  useEffect(() => {
    const fetchEvents = async () => {
      setIsLoading(true);
      try {
        const response = await fetch("https://sportalon-backend.onrender.com/api/user/getevent");
        const data = await response.json();

        if (data.success) {
          // Add a small delay to show loading animation
          setTimeout(() => {
            setEvents(
              data.events.map((event) => {
                const applyLastDate = new Date(event.applyLastDate);
                const today = new Date();
                today.setHours(0, 0, 0, 0);

                // Extract date objects for sorting
                const startDate = new Date(event.startDate);

                // Random popularity metrics for demo
                const popularity = Math.floor(Math.random() * 100);
                const participantCount = Math.floor(Math.random() * 200) + 10;

                return {
                  id: event._id,
                  title: event.title,
                  description: event.description,
                  date: `${new Date(event.startDate).toLocaleDateString()} - ${new Date(event.endDate).toLocaleDateString()}`,
                  startDate: startDate,
                  registrationDeadline: applyLastDate.toLocaleDateString(),
                  deadlineDate: applyLastDate,
                  location: event.location,
                  image: event.imageUrl || DEFAULT_EVENT_IMAGE,
                  status: applyLastDate >= today ? "Available" : "Closed",
                  popularity: popularity,
                  participantCount: participantCount,
                  featured: popularity > 80, // Mark high popularity events as featured
                };
              })
            );
            setIsLoading(false);
          }, 800);
        }
      } catch (error) {
        console.error("Error fetching events:", error);
        setIsLoading(false);
      }
    };

    fetchEvents();
  }, []);



  // Filter events based on search term only
  const getFilteredEvents = () => {
    return events.filter((event) => {
      // Search term filter
      const searchMatch =
        event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.location.toLowerCase().includes(searchTerm.toLowerCase());

      return searchMatch;
    }).sort((a, b) => a.startDate - b.startDate); // Sort by date by default
  };

  const filteredEvents = getFilteredEvents();

  // Find a featured event for the hero section
  const featuredEvent = events.find(event => event.featured && event.status === "Available") ||
                        (events.length > 0 ? events[0] : null);

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-50 to-white">
      {/* Hero Section with Featured Event */}
      <div className="bg-gradient-to-r from-indigo-900 to-purple-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div className="order-2 md:order-1">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <h1 className="text-4xl md:text-5xl font-bold mb-4">
                  Discover Amazing Sports Events
                </h1>
                <p className="text-xl text-indigo-200 mb-8">
                  Find and register for the best sporting events at Sinhgad College
                </p>

                {/* Search Bar */}
                <div className={`relative transition-all duration-300 ${
                  isSearchFocused ? "scale-105" : ""
                }`}>
                  <input
                    type="text"
                    placeholder="Search for events..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    onFocus={() => setIsSearchFocused(true)}
                    onBlur={() => setIsSearchFocused(false)}
                    className="w-full py-4 px-6 pl-12 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 focus:bg-white/20 focus:outline-none focus:ring-2 focus:ring-indigo-400 text-white placeholder-indigo-200"
                  />
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-indigo-300" />
                  {searchTerm && (
                    <button
                      onClick={() => setSearchTerm("")}
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 text-indigo-300 hover:text-white"
                    >
                      <X size={18} />
                    </button>
                  )}
                </div>
              </motion.div>
            </div>

            {featuredEvent && (
              <div className="order-1 md:order-2">
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  className="relative rounded-xl overflow-hidden shadow-2xl"
                >
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent z-10" />
                  <img
                    src={featuredEvent.image}
                    alt={featuredEvent.title}
                    className="w-full h-64 object-cover"
                    onError={(e) => {
                      e.target.onerror = null; // Prevent infinite loop
                      e.target.src = "/default_img.jpeg";
                    }}
                  />
                  <div className="absolute bottom-0 left-0 right-0 p-6 z-20">
                    <div className="flex items-center mb-2">
                      <span className="bg-indigo-500 text-white text-xs px-2 py-1 rounded-full uppercase font-semibold tracking-wider mr-2">
                        Featured
                      </span>
                      <span
                        className={`px-3 py-1 rounded-sm text-xs font-medium text-white ${
                          featuredEvent.status === "Available"
                            ? "bg-green-600"
                            : "bg-red-600"
                        }`}
                      >
                        {featuredEvent.status === "Available"
                          ? "Open"
                          : "Closed"}
                      </span>
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-2">{featuredEvent.title}</h3>
                    <div className="flex items-center text-indigo-200 mb-4">
                      <Calendar className="h-4 w-4 mr-1" />
                      <span className="text-sm mr-4">{featuredEvent.date}</span>
                      <MapPin className="h-4 w-4 mr-1" />
                      <span className="text-sm">{featuredEvent.location}</span>
                    </div>
                    <Link
                      to={`/events/${featuredEvent.id}`}
                      className="inline-block px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors font-medium"
                    >
                      View Details
                    </Link>
                  </div>
                </motion.div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Events Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <h2 className="text-3xl font-bold text-gray-900 mr-4">Events</h2>
              <div className="flex items-center text-gray-500 text-sm">
                <span className="mr-1">{filteredEvents.length}</span>
                <span>{filteredEvents.length === 1 ? 'event' : 'events'} found</span>
              </div>
            </div>
          </div>
        </div>

        {/* Loading State */}
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader className="h-12 w-12 text-indigo-600 animate-spin mb-4" />
            <p className="text-gray-600">Loading events...</p>
          </div>
        ) : (
          <>
            {/* Events List */}
            <div className="space-y-4">
              <AnimatePresence>
                {filteredEvents.map((event, index) => (
                  <motion.div
                    key={event.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                    className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100 hover:shadow-lg transition-all duration-300"
                  >
                    <div className="flex flex-col md:flex-row">
                      <div className="md:w-1/4 h-48 md:h-auto relative">
                        <img
                          src={event.image}
                          alt={event.title}
                          className="w-full h-full object-cover"
                          onError={handleImageError}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent md:bg-gradient-to-r" />

                        {/* Horizontal Status Bar */}
                        <div className="absolute top-0 left-0 w-full h-2">
                          <div
                            className={`w-full h-full ${
                              event.status === "Available"
                                ? "bg-green-600"
                                : "bg-red-600"
                            }`}
                          ></div>
                        </div>
                      </div>

                      <div className="p-6 md:w-3/4 flex flex-col justify-between">
                        <div>
                          <div className="flex flex-wrap items-center gap-2 mb-2">
                            <span
                              className={`px-2 py-1 rounded-full text-xs font-medium text-white ${
                                event.status === "Available"
                                  ? "bg-green-600"
                                  : "bg-red-600"
                              }`}
                            >
                              {event.status === "Available" ? "Open" : "Closed"}
                            </span>
                            {event.popularity > 80 && (
                              <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs font-medium flex items-center">
                                <Star className="h-3 w-3 mr-1 fill-yellow-500" />
                                Popular
                              </span>
                            )}
                          </div>

                          <h3 className="text-xl font-bold text-gray-900 mb-2">
                            {event.title}
                          </h3>
                          <p className="text-gray-600 mb-4 line-clamp-2">
                            {event.description}
                          </p>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                          <div className="flex items-center text-gray-600">
                            <Calendar className="h-5 w-5 mr-2 text-indigo-500" />
                            <span>{event.date}</span>
                          </div>
                          <div className="flex items-center text-gray-600">
                            <Clock className="h-5 w-5 mr-2 text-indigo-500" />
                            <span>Deadline: {event.registrationDeadline}</span>
                          </div>
                          <div className="flex items-center text-gray-600">
                            <MapPin className="h-5 w-5 mr-2 text-indigo-500" />
                            <span>{event.location}</span>
                          </div>
                          <div className="flex items-center text-gray-600">
                            <Users className="h-5 w-5 mr-2 text-indigo-500" />
                            <span>{event.participantCount} participants</span>
                          </div>
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
                              <div
                                className="h-full bg-indigo-600"
                                style={{ width: `${event.popularity}%` }}
                              ></div>
                            </div>
                            <span className="ml-2 text-sm text-gray-600">{event.popularity}% popularity</span>
                          </div>
                          <Link
                            to={`/events/${event.id}`}
                            className="px-6 py-2 rounded-lg font-semibold text-center bg-indigo-600 text-white hover:bg-indigo-700 transition-all duration-300"
                          >
                            View Details
                          </Link>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            {/* No Results Message */}
            {filteredEvents.length === 0 && !isLoading && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-16"
              >
                <div className="bg-indigo-50 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6">
                  <Calendar className="h-10 w-10 text-indigo-500" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">No events found</h3>
                <p className="text-gray-600 mb-6">
                  Try adjusting your search criteria
                </p>
                <button
                  onClick={() => setSearchTerm("")}
                  className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium"
                >
                  Clear Search
                </button>
              </motion.div>
            )}
          </>
        )}
      </div>
    </div>
  );
};


export default EventsPage;
