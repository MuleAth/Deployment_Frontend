import React, { useEffect, useState } from "react";
import { Calendar, Users, MapPin } from "lucide-react";
import { Link } from "react-router-dom";

// Define default image and error handler directly in this file
const DEFAULT_EVENT_IMAGE = "/default_img.jpeg";

const handleImageError = (e) => {
  e.target.onerror = null; // Prevent infinite loop
  e.target.src = DEFAULT_EVENT_IMAGE;
};

const FeaturedEventSection = () => {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
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
        }
      } catch (error) {
        console.error("Error fetching events:", error);
      }
    };
    fetchEvents();
  }, []);

  const link = `https://sportalon-backend.onrender.com/events/${events._id}`;

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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {events.map((event) => (
            <div
              key={event._id}
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
                <a
                  href={`http://localhost:5173/events/${event.id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block mt-4 md:mt-6 w-full"
                >
                  <button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2.5 md:py-2 px-4 rounded-lg transition duration-300 text-sm md:text-base">
                    View Details
                  </button>
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedEventSection;
