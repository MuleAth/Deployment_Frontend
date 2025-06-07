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
        const response = await fetch("http://localhost:5000/api/user/getevent");
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

  const link = `http://localhost:5000/events/${events._id}`;

  return (
    <section className="py-20 bg-gray-50" id="events">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Upcoming Events
          </h2>
          <p className="text-xl text-gray-600">
            Join our exciting sports events and showcase your talent
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {events.map((event) => (
            <div
              key={event._id}
              className="bg-white rounded-xl shadow-lg overflow-hidden transform hover:scale-105 transition duration-300"
            >
              <div className="h-48 overflow-hidden">
                <img
                  src={event.image}
                  alt={event.title}
                  className="w-full h-full object-cover"
                  onError={handleImageError}
                />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-4">
                  {event.title}
                </h3>
                <div className="space-y-2">
                  <div className="flex items-center text-gray-600">
                    <Calendar className="h-5 w-5 mr-2" />
                    <span>{event.date}</span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <Users className="h-5 w-5 mr-2" />
                    <span>{event.participants}</span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <MapPin className="h-5 w-5 mr-2" />
                    <span>{event.location}</span>
                  </div>
                </div>
                <a
                  href={`http://localhost:5173/events/${event.id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block mt-6 w-full"
                >
                  <button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-4 rounded-lg transition duration-300">
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
