import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { MdDelete, MdEdit, MdAdd, MdEvent, MdLocationOn, MdPeople, MdSportsHandball, MdDateRange, MdAccessTime, MdSearch } from "react-icons/md";
import { FaCalendarAlt, FaMapMarkerAlt, FaTrophy, FaUserTie } from "react-icons/fa";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ImageUpload from "../components/ImageUpload";
import Select from 'react-select';

function Events() {
  const navigate = useNavigate();
  const id = useSelector((state) => state.auth.id);
  const email = useSelector((state) => state.auth.email);
  const [showForm, setShowForm] = useState(false);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [sortBy, setSortBy] = useState("startDate");
  const [sortOrder, setSortOrder] = useState("asc");
  const [activeTab, setActiveTab] = useState("upcoming");
  // Sports categories options for the dropdown
  const sportsOptions = [
    { value: 'football', label: 'Football' },
    { value: 'cricket', label: 'Cricket' },
    { value: 'basketball', label: 'Basketball' },
    { value: 'volleyball', label: 'Volleyball' },
    { value: 'tennis', label: 'Tennis' },
    { value: 'badminton', label: 'Badminton' },
    { value: 'table tennis', label: 'Table Tennis' },
    { value: 'chess', label: 'Chess' },
    { value: 'carrom', label: 'Carrom' },
    { value: 'swimming', label: 'Swimming' },
    { value: 'athletics', label: 'Athletics' },
    { value: 'hockey', label: 'Hockey' },
    { value: 'kabaddi', label: 'Kabaddi' },
    { value: 'kho kho', label: 'Kho Kho' },
    { value: 'boxing', label: 'Boxing' },
    { value: 'wrestling', label: 'Wrestling' },
    { value: 'martial arts', label: 'Martial Arts' },
    { value: 'yoga', label: 'Yoga' },
  ];

  const [selectedSportsCategories, setSelectedSportsCategories] = useState([]);
  const [formData, setFormData] = useState({
    title: "",
    startDate: "",
    endDate: "",
    applyLastDate: "",
    location: "",
    organizer: "",
    contact: "",
    coordinator_name: "",
    coordinator_no: "",
    description: "",
    rules: "",
    prizes: "",
    sportsCategory: "",
    imageUrl: "",
  });

  // Fetch events from the backend when the component mounts
  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    setLoading(true);
    try {
      const response = await fetch("https://sportalon-backend.onrender.com/api/admin/events");
      const data = await response.json();
      if (data.success) {
        setEvents(data.events);
      } else {
        console.error("Error fetching events:", data.message);
        toast.error("Failed to load events");
      }
    } catch (error) {
      console.error("Error fetching events:", error);
      toast.error("Network error while loading events");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  
  // Handle sports category selection
  const handleSportsCategoryChange = (selectedOptions) => {
    setSelectedSportsCategories(selectedOptions);
    
    // Convert the selected options to a comma-separated string and store in formData
    const sportsCategoryString = selectedOptions.map(option => option.value).join(',');
    setFormData(prev => ({
      ...prev,
      sportsCategory: sportsCategoryString
    }));
  };
  
  const handleImageUploaded = (imageUrl) => {
    setFormData((prev) => ({
      ...prev,
      imageUrl: imageUrl,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Create payload with user id and email
      const payload = { ...formData, _id: id, createdBy: email };

      const response = await fetch("https://sportalon-backend.onrender.com/api/admin/events", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();
      if (response.ok && data.success) {
        toast.success("Event created successfully!");
        // Refresh events list after creating a new event
        fetchEvents();
        // Close the form and reset formData
        setShowForm(false);
        setFormData({
          title: "",
          startDate: "",
          endDate: "",
          applyLastDate: "",
          location: "",
          organizer: "",
          contact: "",
          coordinator_name: "",
          coordinator_no: "",
          description: "",
          rules: "",
          prizes: "",
          sportsCategory: "",
          imageUrl: "",
        });
        // Reset selected sports categories
        setSelectedSportsCategories([]);
      } else {
        toast.error(`Failed to create event: ${data.message || "Unknown error"}`);
        console.error("Error creating event:", data.message);
      }
    } catch (error) {
      toast.error("Network error while creating event");
      console.error("Error submitting form:", error);
    }
  };

  // Function to handle deletion of an event
  const handleDelete = async (eventId) => {
    // Ask for confirmation before deleting
    if (!window.confirm("Are you sure you want to delete this event?")) {
      return;
    }

    try {
      const response = await fetch(
        `https://sportalon-backend.onrender.com/api/admin/events/${eventId}`,
        {
          method: "DELETE",
        }
      );
      const data = await response.json();
      if (response.ok && data.success) {
        // Remove the deleted event from the state
        setEvents((prevEvents) =>
          prevEvents.filter((event) => event._id !== eventId)
        );
        toast.success("Event deleted successfully");
      } else {
        toast.error(`Failed to delete event: ${data.message || "Unknown error"}`);
        console.error("Error deleting event:", data.message);
      }
    } catch (error) {
      toast.error("Network error while deleting event");
      console.error("Error deleting event:", error);
    }
  };

  const handleEventClick = (eventId) => {
    navigate(`/admin/events/${eventId}`);
  };

  // Filter events based on search term and category
  const filterEvents = () => {
    return events
      .filter(event =>
        event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.description.toLowerCase().includes(searchTerm.toLowerCase())
      )
      .filter(event =>
        categoryFilter === "" || event.sportsCategory.toLowerCase() === categoryFilter.toLowerCase()
      )
      .filter(event => {
        const today = new Date();
        const startDate = new Date(event.startDate);

        if (activeTab === "upcoming") {
          return startDate >= today;
        } else if (activeTab === "past") {
          return startDate < today;
        }
        return true; // "all" tab
      })
      .sort((a, b) => {
        let valueA = a[sortBy];
        let valueB = b[sortBy];

        // Handle date comparisons
        if (sortBy === "startDate" || sortBy === "endDate" || sortBy === "applyLastDate") {
          valueA = new Date(valueA);
          valueB = new Date(valueB);
        }

        if (sortOrder === "asc") {
          return valueA > valueB ? 1 : -1;
        } else {
          return valueA < valueB ? 1 : -1;
        }
      });
  };

  // Get unique categories from events
  const getCategories = () => {
    const categories = events.map(event => event.sportsCategory);
    return ["", ...new Set(categories)]; // Add empty option for "All Categories"
  };

  // Get filtered events
  const filteredEvents = filterEvents();

  // Get unique categories
  const categories = getCategories();

  return (
    <div className="content-area bg-gray-50 dark:bg-gray-800 min-h-screen p-6">
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} newestOnTop closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover />

      {/* Header with title and create button */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white flex items-center">
          <MdEvent className="mr-3 text-blue-500" size={32} /> Events Management
        </h1>
        <button
          className="mt-4 md:mt-0 flex items-center gap-2 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-300 shadow-md"
          onClick={() => setShowForm(true)}
        >
          <MdAdd size={20} /> Create New Event
        </button>
      </div>

      {/* Search and Filter Bar */}
      <div className="bg-white dark:bg-gray-900 rounded-lg shadow-md p-6 mb-6">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6">
          {/* Search */}
          <div className="relative w-full md:w-1/3">
            <input
              type="text"
              placeholder="Search events..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white transition-all duration-300"
            />
            <MdSearch className="absolute left-3 top-3 text-gray-400" size={20} />
          </div>

          {/* Category Filter */}
          <div className="w-full md:w-1/4">
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="w-full p-2 rounded-lg border border-gray-300 dark:border-gray-700 cursor-pointer dark:bg-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Categories</option>
              {categories.filter(cat => cat !== "").map((category, index) => (
                <option key={index} value={category}>{category}</option>
              ))}
            </select>
          </div>

          {/* Sort Options */}
          <div className="flex items-center gap-2 w-full md:w-auto">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="p-2 rounded-lg border border-gray-300 dark:border-gray-700 cursor-pointer dark:bg-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="startDate">Start Date</option>
              <option value="title">Title</option>
              <option value="location">Location</option>
              <option value="sportsCategory">Category</option>
            </select>
            <button
              onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
              className="p-2 rounded-lg border border-gray-300 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700"
              title={sortOrder === "asc" ? "Ascending" : "Descending"}
            >
              {sortOrder === "asc" ? "↑" : "↓"}
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-200 dark:border-gray-700">
          <button
            className={`py-2 px-4 font-medium text-sm focus:outline-none ${
              activeTab === "all"
                ? "border-b-2 border-blue-500 text-blue-600 dark:text-blue-400"
                : "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
            }`}
            onClick={() => setActiveTab("all")}
          >
            All Events
          </button>
          <button
            className={`py-2 px-4 font-medium text-sm focus:outline-none ${
              activeTab === "upcoming"
                ? "border-b-2 border-blue-500 text-blue-600 dark:text-blue-400"
                : "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
            }`}
            onClick={() => setActiveTab("upcoming")}
          >
            Upcoming
          </button>
          <button
            className={`py-2 px-4 font-medium text-sm focus:outline-none ${
              activeTab === "past"
                ? "border-b-2 border-blue-500 text-blue-600 dark:text-blue-400"
                : "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
            }`}
            onClick={() => setActiveTab("past")}
          >
            Past Events
          </button>
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      )}

      {/* No Events Message */}
      {!loading && filteredEvents.length === 0 && (
        <div className="bg-white dark:bg-gray-900 rounded-lg shadow-md p-10 text-center">
          <MdEvent className="mx-auto text-gray-400 dark:text-gray-600" size={64} />
          <h3 className="mt-4 text-xl font-medium text-gray-700 dark:text-gray-300">No events found</h3>
          <p className="mt-2 text-gray-500 dark:text-gray-400">
            {searchTerm || categoryFilter
              ? "Try adjusting your search or filters"
              : "Create your first event to get started"}
          </p>
        </div>
      )}

      {/* Events Grid */}
      {!loading && filteredEvents.length > 0 && (
        <div className="bg-white dark:bg-gray-900 rounded-lg shadow-md overflow-hidden p-6">
          {/* All Events */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredEvents.map((event) => {
              // Calculate if event is upcoming, ongoing, or past
              const today = new Date();
              const startDate = new Date(event.startDate);
              const endDate = new Date(event.endDate);
              const applyLastDate = new Date(event.applyLastDate);

              let status = "upcoming";
              let statusColor = "blue";

              if (today > endDate) {
                status = "completed";
                statusColor = "gray";
              } else if (today >= startDate && today <= endDate) {
                status = "ongoing";
                statusColor = "green";
              } else if (today > applyLastDate) {
                status = "registration closed";
                statusColor = "yellow";
              }

              return (
                <div
                  key={event._id}
                  className="bg-white dark:bg-gray-900 rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-all duration-300 relative group border border-gray-200 dark:border-gray-700"
                >
                  {/* Event Status Badge */}
                  <div className={`absolute top-4 right-4 px-2 py-1 rounded-full text-xs font-semibold bg-${statusColor}-100 text-${statusColor}-800 dark:bg-${statusColor}-900 dark:text-${statusColor}-200 z-10`}>
                    {status}
                  </div>

                  {/* Event Image */}
                  <div className="h-40 overflow-hidden">
                    <img 
                      src={event.imageUrl || "/default_img.jpeg"} 
                      alt={event.title}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.onerror = null; // Prevent infinite loop
                        e.target.src = "/default_img.jpeg";
                      }}
                    />
                  </div>

                  {/* Event Content */}
                  <div className="p-6" onClick={() => handleEventClick(event._id)}>
                    <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-2 cursor-pointer hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                      {event.title}
                    </h3>

                    <div className="mt-4 space-y-3">
                      <div className="flex items-center text-gray-600 dark:text-gray-400">
                        <FaCalendarAlt className="mr-2 text-blue-500" />
                        <span>
                          {new Date(event.startDate).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric'
                          })} - {new Date(event.endDate).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric'
                          })}
                        </span>
                      </div>

                      <div className="flex items-center text-gray-600 dark:text-gray-400">
                        <FaMapMarkerAlt className="mr-2 text-red-500" />
                        <span>{event.location}</span>
                      </div>

                      <div className="flex items-center text-gray-600 dark:text-gray-400">
                        <MdPeople className="mr-2 text-green-500" />
                        <span>
                          {event.participants ? event.participants.length : 0} Participants
                        </span>
                      </div>

                      <div className="flex items-center text-gray-600 dark:text-gray-400">
                        <FaUserTie className="mr-2 text-purple-500" />
                        <span>{event.coordinator_name}</span>
                      </div>
                    </div>

                    {/* Apply by date */}
                    <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/30 rounded-lg">
                      <div className="flex items-center text-blue-700 dark:text-blue-300 text-sm">
                        <MdAccessTime className="mr-2" />
                        <span>
                          Apply by: {new Date(event.applyLastDate).toLocaleDateString('en-US', {
                            month: 'long',
                            day: 'numeric',
                            year: 'numeric'
                          })}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="p-4 bg-gray-50 dark:bg-gray-800 flex justify-end space-x-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(event._id);
                      }}
                      className="p-2 rounded-full text-red-600 hover:text-white hover:bg-red-600 transition-colors duration-300"
                      title="Delete Event"
                    >
                      <MdDelete size={20} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Create Event Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-xl transform transition-all">
            <div className="bg-blue-600 p-4 rounded-t-lg">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold text-white flex items-center">
                  <MdAdd className="mr-2" /> Create New Event
                </h2>
                <button
                  onClick={() => setShowForm(false)}
                  className="text-white hover:text-gray-200 focus:outline-none"
                >
                  ✕
                </button>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              {/* Form Sections */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Left Column */}
                <div className="space-y-6">
                  {/* Title */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Event Title
                    </label>
                    <input
                      type="text"
                      name="title"
                      value={formData.title}
                      onChange={handleInputChange}
                      className="w-full p-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                      required
                      placeholder="Enter event title"
                    />
                  </div>

                  {/* Dates */}
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Start Date
                      </label>
                      <input
                        type="date"
                        name="startDate"
                        value={formData.startDate}
                        onChange={handleInputChange}
                        className="w-full p-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        End Date
                      </label>
                      <input
                        type="date"
                        name="endDate"
                        value={formData.endDate}
                        onChange={handleInputChange}
                        className="w-full p-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Last Date to Apply
                      </label>
                      <input
                        type="date"
                        name="applyLastDate"
                        value={formData.applyLastDate}
                        onChange={handleInputChange}
                        className="w-full p-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                        required
                      />
                    </div>
                  </div>

                  {/* Location */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Location
                    </label>
                    <input
                      type="text"
                      name="location"
                      value={formData.location}
                      onChange={handleInputChange}
                      className="w-full p-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                      required
                      placeholder="Enter event location"
                    />
                  </div>

                  {/* Sports Category */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Sports Category
                    </label>
                    <Select
                      isMulti
                      name="sportsCategory"
                      options={sportsOptions}
                      className="basic-multi-select"
                      classNamePrefix="select"
                      value={selectedSportsCategories}
                      onChange={handleSportsCategoryChange}
                      placeholder="Select sports categories..."
                      required
                      styles={{
                        control: (baseStyles) => ({
                          ...baseStyles,
                          backgroundColor: 'white',
                          borderColor: '#D1D5DB',
                          borderRadius: '0.5rem',
                          padding: '2px',
                        }),
                        multiValue: (baseStyles) => ({
                          ...baseStyles,
                          backgroundColor: '#EFF6FF',
                          borderRadius: '0.375rem',
                        }),
                        multiValueLabel: (baseStyles) => ({
                          ...baseStyles,
                          color: '#3B82F6',
                        }),
                        multiValueRemove: (baseStyles) => ({
                          ...baseStyles,
                          color: '#3B82F6',
                          ':hover': {
                            backgroundColor: '#DBEAFE',
                            color: '#2563EB',
                          },
                        }),
                      }}
                    />
                  </div>

                  {/* Organizer */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Organizer
                    </label>
                    <input
                      type="text"
                      name="organizer"
                      value={formData.organizer}
                      onChange={handleInputChange}
                      className="w-full p-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                      required
                      placeholder="Enter organizer name"
                    />
                  </div>
                  
                  {/* Event Image Upload */}
                  <div>
                    <ImageUpload 
                      onImageUploaded={handleImageUploaded}
                      defaultImage={formData.imageUrl}
                    />
                  </div>
                </div>

                {/* Right Column */}
                <div className="space-y-6">
                  {/* Contact */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Contact
                    </label>
                    <input
                      type="text"
                      name="contact"
                      value={formData.contact}
                      onChange={handleInputChange}
                      className="w-full p-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                      required
                      placeholder="Enter contact information"
                    />
                  </div>

                  {/* Coordinator Info */}
                  <div className="space-y-4">
                    <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-3">
                      <p className="text-sm text-blue-700 dark:text-blue-300">
                        <strong>Important:</strong> Coordinator details will be displayed in the Contact tab of event details page for participants to reach out.
                      </p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Coordinator Name
                      </label>
                      <input
                        type="text"
                        name="coordinator_name"
                        value={formData.coordinator_name}
                        onChange={handleInputChange}
                        className="w-full p-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                        required
                        placeholder="Enter coordinator name"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Coordinator Mobile Number
                      </label>
                      <input
                        type="tel"
                        name="coordinator_no"
                        value={formData.coordinator_no}
                        onChange={handleInputChange}
                        className="w-full p-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                        required
                        pattern="[0-9+\-\s\(\)]+"
                        placeholder="Enter coordinator mobile number (e.g., +91 98765 43210)"
                        title="Please enter a valid phone number"
                      />
                    </div>
                  </div>

                  {/* Description */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Description
                    </label>
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      className="w-full p-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                      rows="3"
                      required
                      placeholder="Enter event description"
                    ></textarea>
                  </div>

                  {/* Rules */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Rules
                    </label>
                    <textarea
                      name="rules"
                      value={formData.rules}
                      onChange={handleInputChange}
                      className="w-full p-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                      rows="3"
                      required
                      placeholder="Enter each rule on a new line"
                    ></textarea>
                  </div>

                  {/* Prizes */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Prizes
                    </label>
                    <textarea
                      name="prizes"
                      value={formData.prizes}
                      onChange={handleInputChange}
                      className="w-full p-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                      rows="3"
                      required
                      placeholder="Enter prize details"
                    ></textarea>
                  </div>
                </div>
              </div>

              {/* Form Buttons */}
              <div className="flex justify-end space-x-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center"
                >
                  <MdAdd className="mr-2" /> Create Event
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Events;
