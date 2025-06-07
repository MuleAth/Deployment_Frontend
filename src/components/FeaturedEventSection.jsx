import React, { useEffect, useState } from "react";
import { Calendar, Users, MapPin, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

// Define default image and error handler directly in this file
const DEFAULT_EVENT_IMAGE = "/default_img.jpeg";

const handleImageError = (e) => {
  e.target.onerror = null; // Prevent infinite loop
  e.target.src = DEFAULT_EVENT_IMAGE;
};

const FeaturedEventSection = () => {
  const navigate = useNavigate();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await fetch("https://sportalon-backend.onrender.com/api/user/getevent");
        const data = await response.json();
        if (data.success) {
          setEvents(
            data.events.slice(0, 3).map((event) => ({
              id: event._id,
              title: event.title,
              date: `${new Date(
                event.startDate
              ).toLocaleDateString()} - ${new Date(
                event.endDate
              ).toLocaleDateString()}`,
              participants: `${event.participants.length} participants`,
              location: event.location,
              image: "/default_img.jpeg",
            }))
          );
        } else {
          setError("Failed to fetch events");
        }
      } catch (error) {
        console.error("Error fetching events:", error);
        setError("Error loading events. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, []);

  // Handle navigation to event details
  const handleViewDetails = (eventId) => {
    console.log('Navigating to event details:', eventId);
    navigate(`/events/${eventId}`);
  };

  return (
    <section className="py-16 md:py-20 bg-gray-50" id="events">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 md:mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3 md:mb-4">
            Upcoming Events
          </h2>
          <p className="text-lg md:text-xl text-gray-600 px-4">
            Join our exciting sports events and showcase your talent
          </p>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white rounded-xl shadow-lg overflow-hidden animate-pulse">
                <div className="h-40 md:h-48 bg-gray-300"></div>
                <div className="p-4 md:p-6">
                  <div className="h-6 bg-gray-300 rounded mb-4"></div>
                  <div className="space-y-2">
                    <div className="h-4 bg-gray-200 rounded"></div>
                    <div className="h-4 bg-gray-200 rounded"></div>
                    <div className="h-4 bg-gray-200 rounded"></div>
                  </div>
                  <div className="h-10 bg-gray-300 rounded mt-4"></div>
                </div>
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <div className="text-red-500 text-lg font-semibold mb-2">{error}</div>
            <button 
              onClick={() => window.location.reload()} 
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
            >
              Try Again
            </button>
          </div>
        ) : events.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-500 text-lg">No upcoming events found</div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {events.map((event) => (
            <div
              key={event.id}
              className="bg-white rounded-xl shadow-lg overflow-hidden transform hover:scale-105 transition duration-300"
            >
              <div className="h-40 md:h-48 overflow-hidden">
                <img
                  src={event.image}
                  alt={event.title}
                  className="w-full h-full object-cover"
                  onError={handleImageError}
                />
              </div>
              <div className="p-4 md:p-6">
                <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-3 md:mb-4">
                  {event.title}
                </h3>
                <div className="space-y-2">
                  <div className="flex items-center text-gray-600">
                    <Calendar className="h-4 w-4 md:h-5 md:w-5 mr-2 flex-shrink-0" />
                    <span className="text-sm md:text-base truncate">{event.date}</span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <Users className="h-4 w-4 md:h-5 md:w-5 mr-2 flex-shrink-0" />
                    <span className="text-sm md:text-base">{event.participants}</span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <MapPin className="h-4 w-4 md:h-5 md:w-5 mr-2 flex-shrink-0" />
                    <span className="text-sm md:text-base truncate">{event.location}</span>
                  </div>
                </div>
                <button 
                  onClick={() => handleViewDetails(event.id)}
                  className="group w-full mt-4 md:mt-6 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2.5 md:py-2 px-4 rounded-lg transition-all duration-300 text-sm md:text-base cursor-pointer flex items-center justify-center gap-2 hover:shadow-lg transform hover:-translate-y-0.5"
                >
                  View Details
                  <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                </button>
              </div>
            </div>
            ))}
          </div>
        )}

        {/* View All Events Button */}
        {!loading && !error && events.length > 0 && (
          <div className="text-center mt-8 md:mt-12">
            <button
              onClick={() => navigate('/events')}
              className="group px-6 md:px-8 py-3 md:py-4 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold rounded-lg transition-all duration-300 text-sm md:text-base cursor-pointer flex items-center justify-center gap-2 mx-auto hover:shadow-lg transform hover:-translate-y-0.5"
            >
              View All Events
              <ArrowRight className="h-4 w-4 md:h-5 md:w-5 transition-transform duration-300 group-hover:translate-x-1" />
            </button>
          </div>
        )}
      </div>
    </section>
  );
};

export default FeaturedEventSection;
