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
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16 lg:py-24">
          <div className="grid md:grid-cols-2 gap-6 md:gap-8 items-center">
            <div className="order-2 md:order-1">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-3 md:mb-4">
                  Discover Amazing Sports Events
                </h1>
                <p className="text-lg md:text-xl text-indigo-200 mb-6 md:mb-8">
                  Find and register for the best sporting events at Sinhgad College
                </p>

                {/* Search Bar */}
                <div className={`relative transition-all duration-300 ${
                  isSearchFocused ? "md:scale-105" : ""
                }`}>
                  <input
                    type="text"
                    placeholder="Search for events..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    onFocus={() => setIsSearchFocused(true)}
                    onBlur={() => setIsSearchFocused(false)}
                    className="w-full py-3 md:py-4 px-4 md:px-6 pl-10 md:pl-12 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 focus:bg-white/20 focus:outline-none focus:ring-2 focus:ring-indigo-400 text-white placeholder-indigo-200 text-sm md:text-base"
                  />
                  <Search className="absolute left-3 md:left-4 top-1/2 transform -translate-y-1/2 text-indigo-300 h-4 w-4 md:h-5 md:w-5" />
                  {searchTerm && (
                    <button
                      onClick={() => setSearchTerm("")}
                      className="absolute right-3 md:right-4 top-1/2 transform -translate-y-1/2 text-indigo-300 hover:text-white"
                    >
                      <X size={16} className="md:w-5 md:h-5" />
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
                    className="w-full h-48 md:h-64 object-cover"
                    onError={(e) => {
                      e.target.onerror = null; // Prevent infinite loop
                      e.target.src = "/default_img.jpeg";
                    }}
                  />
                  <div className="absolute bottom-0 left-0 right-0 p-4 md:p-6 z-20">
                    <div className="flex items-center mb-2">
                      <span className="bg-indigo-500 text-white text-xs px-2 py-1 rounded-full uppercase font-semibold tracking-wider mr-2">
                        Featured
                      </span>
                      <span
                        className={`px-2 md:px-3 py-1 rounded-sm text-xs font-medium text-white ${
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
                    <h3 className="text-lg md:text-2xl font-bold text-white mb-2">{featuredEvent.title}</h3>
                    <div className="flex flex-col sm:flex-row sm:items-center text-indigo-200 mb-3 md:mb-4 gap-2 sm:gap-4">
                      <div className="flex items-center">
                        <Calendar className="h-3 w-3 md:h-4 md:w-4 mr-1" />
                        <span className="text-xs md:text-sm">{featuredEvent.date}</span>
                      </div>
                      <div className="flex items-center">
                        <MapPin className="h-3 w-3 md:h-4 md:w-4 mr-1" />
                        <span className="text-xs md:text-sm truncate">{featuredEvent.location}</span>
                      </div>
                    </div>
                    <Link
                      to={`/events/${featuredEvent.id}`}
                      className="inline-block px-4 md:px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors font-medium text-sm md:text-base"
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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        {/* Events Header */}
        <div className="mb-6 md:mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            <div className="flex flex-col sm:flex-row sm:items-center">
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mr-0 sm:mr-4">Events</h2>
              <div className="flex items-center text-gray-500 text-sm">
                <span className="mr-1">{filteredEvents.length}</span>
                <span>{filteredEvents.length === 1 ? 'event' : 'events'} found</span>
              </div>
            </div>
          </div>
        </div>

        {/* Loading State */}
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 md:gap-8">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
              <div key={i} className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100 animate-pulse">
                <div className="h-48 bg-gray-300"></div>
                <div className="p-4 md:p-6">
                  <div className="h-6 bg-gray-300 rounded mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded mb-4"></div>
                  <div className="space-y-2 mb-4">
                    <div className="h-4 bg-gray-200 rounded"></div>
                    <div className="h-4 bg-gray-200 rounded"></div>
                    <div className="h-4 bg-gray-200 rounded"></div>
                  </div>
                  <div className="h-2 bg-gray-200 rounded mb-4"></div>
                  <div className="h-10 bg-gray-300 rounded"></div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <>
            {/* Events Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 md:gap-8">
              <AnimatePresence>
                {filteredEvents.map((event, index) => (
                  <motion.div
                    key={event.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                    className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100 hover:shadow-xl hover:-translate-y-2 transition-all duration-300 group cursor-pointer"
                  >
                    {/* Event Image */}
                    <div className="relative h-48 overflow-hidden">
                      <img
                        src={event.image}
                        alt={event.title}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                        onError={handleImageError}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                      
                      {/* Status Badge */}
                      <div className="absolute top-3 left-3">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium text-white ${
                            event.status === "Available"
                              ? "bg-green-600"
                              : "bg-red-600"
                          }`}
                        >
                          {event.status === "Available" ? "Open" : "Closed"}
                        </span>
                      </div>

                      {/* Popular Badge */}
                      {event.popularity > 80 && (
                        <div className="absolute top-3 right-3">
                          <span className="px-2 py-1 bg-yellow-500 text-white rounded-full text-xs font-medium flex items-center">
                            <Star className="h-3 w-3 mr-1 fill-white" />
                            Popular
                          </span>
                        </div>
                      )}

                      {/* Date Overlay */}
                      <div className="absolute bottom-3 left-3 right-3">
                        <div className="flex items-center text-white text-sm">
                          <Calendar className="h-4 w-4 mr-2" />
                          <span className="truncate">{event.date}</span>
                        </div>
                      </div>
                    </div>

                    {/* Event Content */}
                    <div className="p-4 md:p-6">
                      <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-2 line-clamp-2">
                        {event.title}
                      </h3>
                      <p className="text-sm md:text-base text-gray-600 mb-4 line-clamp-3">
                        {event.description}
                      </p>

                      {/* Event Details */}
                      <div className="space-y-2 mb-4">
                        <div className="flex items-center text-gray-600">
                          <Clock className="h-4 w-4 mr-2 text-indigo-500 flex-shrink-0" />
                          <span className="text-sm truncate">Deadline: {event.registrationDeadline}</span>
                        </div>
                        <div className="flex items-center text-gray-600">
                          <MapPin className="h-4 w-4 mr-2 text-indigo-500 flex-shrink-0" />
                          <span className="text-sm truncate">{event.location}</span>
                        </div>
                        <div className="flex items-center text-gray-600">
                          <Users className="h-4 w-4 mr-2 text-indigo-500 flex-shrink-0" />
                          <span className="text-sm">{event.participantCount} participants</span>
                        </div>
                      </div>

                      {/* Popularity Bar */}
                      <div className="mb-4">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs text-gray-500">Popularity</span>
                          <span className="text-xs text-gray-600">{event.popularity}%</span>
                        </div>
                        <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 transition-all duration-300"
                            style={{ width: `${event.popularity}%` }}
                          ></div>
                        </div>
                      </div>

                      {/* View Details Button */}
                      <Link
                        to={`/events/${event.id}`}
                        className="group/button inline-flex items-center justify-center gap-2 w-full px-4 py-2 rounded-lg font-semibold text-center bg-indigo-600 text-white hover:bg-indigo-700 transition-all duration-300 text-sm md:text-base transform hover:scale-105"
                      >
                        View Details
                        <Trophy className="h-4 w-4 transition-transform duration-300 group-hover/button:rotate-12" />
                      </Link>
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
