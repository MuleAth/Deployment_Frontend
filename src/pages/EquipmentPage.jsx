import React, { useState, useEffect, useRef } from "react";
import {
  Search,
  Filter,
  ChevronDown,
  ChevronUp,
  X,
  Clock,
  Calendar,
  Info,
  CheckCircle,
  AlertTriangle,
  Loader
} from "lucide-react";
import { useSelector } from "react-redux";
import { ToastContainer, toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";

const EquipmentPage = () => {
  const [equipmentList, setEquipmentList] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [showRequestForm, setShowRequestForm] = useState(false);
  const [selectedEquipment, setSelectedEquipment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState("name");
  const [viewMode, setViewMode] = useState("grid");
  const modalRef = useRef(null);
  const navigate = useNavigate();

  const id = useSelector((state) => state.auth["id"]);
  const isVerifiedByAdmin = useSelector(
    (state) => state.auth.isVerifiedByAdmin
  );

  const [formData, setFormData] = useState({
    _id: id,
    reason: "",
    duration: 1,
    quantity: 1,
    equipment_id: "",
  });

  useEffect(() => {
    setLoading(true);
    fetch("http://localhost:5000/api/user/equipment")
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          setTimeout(() => {
            setEquipmentList(
              data.data.map((item) => ({
                id: item._id,
                name: item.equipmentname,
                total: item.TotalQuantity,
                available: item.availableQuantity,
                isAvailable: item.isAvailable,
                category: "Sports Equipment",
                image: item.image,
              }))
            );
            setLoading(false);
          }, 600);
        }
      })
      .catch((error) => {
        console.error("Error fetching equipment:", error);
        setLoading(false);
      });
  }, []);

  // Close modal when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        setShowRequestForm(false);
      }
    };

    if (showRequestForm) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showRequestForm]);

  const categories = ["All", "Sports Equipment"];

  const sortedAndFilteredEquipment = equipmentList
    .filter((item) => {
      const matchesSearch = item.name
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
      const matchesCategory =
        selectedCategory === "All" || item.category === selectedCategory;
      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => {
      if (sortBy === "name") {
        return a.name.localeCompare(b.name);
      } else if (sortBy === "availability") {
        return b.available - a.available;
      }
      return 0;
    });

  const handleRequest = (equipment) => {
    setSelectedEquipment(equipment);
    setFormData((prevData) => ({
      ...prevData,
      equipment_id: equipment.id,
      quantity: 1,
    }));
    setShowRequestForm(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Form validation
    if (!formData.reason.trim()) {
      toast.error("Please provide a reason for your request", {
        position: "top-right",
        autoClose: 3000,
      });
      return;
    }

    try {
      const response = await fetch(
        "http://localhost:5000/api/user/equipment/request-equipment",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );

      const data = await response.json();
      if (data.success) {
        toast.success("Request submitted successfully!", {
          position: "top-right",
          autoClose: 3000,
        });
        setShowRequestForm(false);

        // Update available quantity locally
        setEquipmentList(prevList =>
          prevList.map(item =>
            item.id === selectedEquipment.id
              ? {...item, available: item.available - formData.quantity}
              : item
          )
        );
      } else {
        toast.error("Request failed: " + data.message, {
          position: "top-right",
          autoClose: 3000,
        });
      }
    } catch (error) {
      console.error("Error submitting request:", error);
      toast.error("Server error. Try again later.", {
        position: "top-right",
        autoClose: 3000,
      });
    }
  };

  // Loading skeleton component
  const EquipmentSkeleton = () => (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden animate-pulse">
      <div className="h-48 bg-gray-300"></div>
      <div className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div>
            <div className="h-6 bg-gray-300 rounded w-32 mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-24"></div>
          </div>
          <div className="h-6 bg-gray-300 rounded-full w-20"></div>
        </div>
        <div className="space-y-2 mb-6">
          <div className="flex justify-between">
            <div className="h-4 bg-gray-200 rounded w-20"></div>
            <div className="h-4 bg-gray-200 rounded w-8"></div>
          </div>
        </div>
        <div className="h-10 bg-gray-300 rounded-lg"></div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-50 to-white py-20 px-4 sm:px-6 lg:px-8">
      <ToastContainer />
      <div className="max-w-7xl mx-auto mt-4">
        {/* Hero Section */}
        <div className="bg-gradient-to-r from-indigo-800 via-purple-800 to-indigo-900 rounded-2xl p-8 mb-10 text-white shadow-xl relative overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute -right-20 -top-20 w-64 h-64 rounded-full bg-white/20"></div>
            <div className="absolute -left-20 -bottom-20 w-64 h-64 rounded-full bg-white/20"></div>
          </div>
          <div className="relative z-10">
            <h1 className="text-4xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-white to-indigo-200">
              Sports Equipment Management
            </h1>
            <p className="text-xl text-indigo-200 max-w-2xl">
              Browse and request high-quality equipment for your training and competitions
            </p>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-xl shadow-md p-4 mb-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="relative w-full md:w-1/2">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Search equipment..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 transition-all duration-300"
              />
            </div>

            <div className="flex items-center gap-4 w-full md:w-auto">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-2 px-4 py-2 bg-indigo-100 text-indigo-800 rounded-lg hover:bg-indigo-200 transition-colors"
              >
                <Filter className="h-4 w-4" />
                Filters
                {showFilters ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
              </button>

              <div className="flex border border-gray-300 rounded-lg overflow-hidden">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`px-3 py-2 ${viewMode === "grid" ? "bg-indigo-100 text-indigo-800" : "bg-white text-gray-600"}`}
                >
                  Grid
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`px-3 py-2 ${viewMode === "list" ? "bg-indigo-100 text-indigo-800" : "bg-white text-gray-600"}`}
                >
                  List
                </button>
              </div>
            </div>
          </div>

          {/* Expanded Filters */}
          {showFilters && (
            <div className="mt-4 pt-4 border-t border-gray-200 grid grid-cols-1 md:grid-cols-3 gap-4 animate-fadeIn">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                >
                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Sort By</label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="name">Name (A-Z)</option>
                  <option value="availability">Availability</option>
                </select>
              </div>

              <div className="flex items-end">
                <button
                  onClick={() => {
                    setSearchTerm("");
                    setSelectedCategory("All");
                    setSortBy("name");
                  }}
                  className="w-full py-2 px-4 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
                >
                  Reset Filters
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Equipment List */}
        {loading ? (
          <div className={viewMode === "grid" ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8" : "space-y-6"}>
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <EquipmentSkeleton key={i} />
            ))}
          </div>
        ) : sortedAndFilteredEquipment.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-xl shadow-md">
            <AlertTriangle className="h-16 w-16 text-yellow-500 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-gray-800 mb-2">No Equipment Found</h3>
            <p className="text-gray-600 max-w-md mx-auto">
              We couldn't find any equipment matching your search criteria. Try adjusting your filters or search term.
            </p>
            <button
              onClick={() => {
                setSearchTerm("");
                setSelectedCategory("All");
              }}
              className="mt-6 px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
            >
              Reset Search
            </button>
          </div>
        ) : viewMode === "grid" ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {sortedAndFilteredEquipment.map((equipment) => (
              <div
                key={equipment.id}
                className="bg-white rounded-xl shadow-lg overflow-hidden transform hover:scale-105 transition-all duration-300 hover:shadow-xl"
              >
                <div className="h-48 overflow-hidden relative group">
                  <img
                    src={equipment.image}
                    alt={equipment.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end">
                    <div className="p-4 text-white">
                      <p className="font-medium">Total: {equipment.total} units</p>
                    </div>
                  </div>
                </div>
                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-xl font-bold text-gray-900">
                        {equipment.name}
                      </h3>
                      <p className="text-gray-600">{equipment.category}</p>
                    </div>
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-semibold ${
                        equipment.available > 0
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {equipment.available > 0 ? "Available" : "Out of Stock"}
                    </span>
                  </div>
                  <div className="space-y-2 mb-6">
                    <div className="flex justify-between text-gray-600">
                      <span>Available:</span>
                      <span>{equipment.available}</span>
                    </div>

                    {/* Availability Indicator */}
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div
                        className={`h-2.5 rounded-full ${
                          equipment.available > equipment.total * 0.7
                            ? "bg-green-600"
                            : equipment.available > equipment.total * 0.3
                            ? "bg-yellow-500"
                            : "bg-red-600"
                        }`}
                        style={{ width: `${(equipment.available / equipment.total) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      if (!id) {
                        toast.error("Sign in required!", {
                          position: "top-right",
                          autoClose: 3000,
                        });
                      } else if (!isVerifiedByAdmin) {
                        toast.warning("Your profile is not yet approved!", {
                          position: "top-right",
                          autoClose: 3000,
                        });
                      } else {
                        handleRequest(equipment);
                      }
                    }}
                    disabled={equipment.available === 0 || !id}
                    className={`w-full py-2 px-4 rounded-lg font-semibold transition-all duration-300 ${
                      equipment.available > 0 && id && isVerifiedByAdmin
                        ? "bg-gradient-to-r from-indigo-800 to-purple-700 hover:from-indigo-700 hover:to-purple-600 text-white transform hover:-translate-y-1"
                        : "bg-gray-400 text-gray-700 cursor-not-allowed"
                    }`}
                  >
                    Request
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {sortedAndFilteredEquipment.map((equipment) => (
              <div
                key={equipment.id}
                className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
              >
                <div className="flex flex-col md:flex-row">
                  <div className="md:w-1/4 h-48 md:h-auto overflow-hidden">
                    <img
                      src={equipment.image}
                      alt={equipment.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="p-6 md:w-3/4 flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h3 className="text-xl font-bold text-gray-900">
                            {equipment.name}
                          </h3>
                          <p className="text-gray-600">{equipment.category}</p>
                        </div>
                        <span
                          className={`px-3 py-1 rounded-full text-sm font-semibold ${
                            equipment.available > 0
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {equipment.available > 0 ? "Available" : "Out of Stock"}
                        </span>
                      </div>
                      <div className="space-y-2 mb-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <p className="text-sm text-gray-500">Available</p>
                            <p className="font-medium">{equipment.available} units</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">Total</p>
                            <p className="font-medium">{equipment.total} units</p>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex justify-end">
                      <button
                        onClick={() => {
                          if (!id) {
                            toast.error("Sign in required!", {
                              position: "top-right",
                              autoClose: 3000,
                            });
                          } else if (!isVerifiedByAdmin) {
                            toast.warning("Your profile is not yet approved!", {
                              position: "top-right",
                              autoClose: 3000,
                            });
                          } else {
                            handleRequest(equipment);
                          }
                        }}
                        disabled={equipment.available === 0 || !id}
                        className={`py-2 px-6 rounded-lg font-semibold transition-all duration-300 ${
                          equipment.available > 0 && id && isVerifiedByAdmin
                            ? "bg-gradient-to-r from-indigo-800 to-purple-700 hover:from-indigo-700 hover:to-purple-600 text-white"
                            : "bg-gray-400 text-gray-700 cursor-not-allowed"
                        }`}
                      >
                        Request Equipment
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Request Form Modal */}
      {showRequestForm && selectedEquipment && (
        <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fadeIn">
          <div
            ref={modalRef}
            className="bg-white rounded-xl p-8 max-w-md w-full shadow-2xl transform transition-all duration-300"
          >
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-bold text-gray-900">
                Request {selectedEquipment.name}
              </h3>
              <button
                onClick={() => setShowRequestForm(false)}
                className="text-gray-500 hover:text-gray-700 transition-colors"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <div className="bg-indigo-50 p-4 rounded-lg mb-6 flex items-start">
              <Info className="h-5 w-5 text-indigo-600 mr-3 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-indigo-800">
                You are requesting <span className="font-semibold">{selectedEquipment.name}</span>.
                Please provide a valid reason for your request.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-gray-700 mb-2 font-medium">
                  Reason for Request:
                </label>
                <textarea
                  value={formData.reason}
                  onChange={(e) =>
                    setFormData({ ...formData, reason: e.target.value })
                  }
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-300 min-h-[100px]"
                  placeholder="Explain why you need this equipment..."
                  required
                />
              </div>

              <div>
                <label className="block text-gray-700 mb-2 font-medium">
                  Duration (days):
                </label>
                <div className="flex items-center">
                  <button
                    type="button"
                    onClick={() => setFormData(prev => ({...prev, duration: Math.max(1, prev.duration - 1)}))}
                    className="px-3 py-2 bg-gray-200 rounded-l-lg hover:bg-gray-300 transition-colors"
                  >
                    -
                  </button>
                  <input
                    type="number"
                    min="1"
                    max="30"
                    value={formData.duration}
                    onChange={(e) => setFormData({...formData, duration: parseInt(e.target.value) || 1})}
                    className="w-16 text-center py-2 border-t border-b border-gray-300"
                  />
                  <button
                    type="button"
                    onClick={() => setFormData(prev => ({...prev, duration: Math.min(30, prev.duration + 1)}))}
                    className="px-3 py-2 bg-gray-200 rounded-r-lg hover:bg-gray-300 transition-colors"
                  >
                    +
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-gray-700 mb-2 font-medium">
                  Quantity:
                </label>
                <div className="flex items-center">
                  <button
                    type="button"
                    onClick={() => setFormData(prev => ({...prev, quantity: Math.max(1, prev.quantity - 1)}))}
                    className="px-3 py-2 bg-gray-200 rounded-l-lg hover:bg-gray-300 transition-colors"
                    disabled={formData.quantity <= 1}
                  >
                    -
                  </button>
                  <input
                    type="number"
                    min="1"
                    max={selectedEquipment.available}
                    value={formData.quantity}
                    onChange={(e) => {
                      const val = parseInt(e.target.value) || 1;
                      setFormData({
                        ...formData,
                        quantity: Math.min(selectedEquipment.available, Math.max(1, val))
                      });
                    }}
                    className="w-16 text-center py-2 border-t border-b border-gray-300"
                  />
                  <button
                    type="button"
                    onClick={() => setFormData(prev => ({
                      ...prev,
                      quantity: Math.min(selectedEquipment.available, prev.quantity + 1)
                    }))}
                    className="px-3 py-2 bg-gray-200 rounded-r-lg hover:bg-gray-300 transition-colors"
                    disabled={formData.quantity >= selectedEquipment.available}
                  >
                    +
                  </button>
                </div>
                <p className="text-sm text-gray-500 mt-1">
                  Maximum available: {selectedEquipment.available}
                </p>
              </div>

              <div className="flex space-x-4 mt-8">
                <button
                  type="submit"
                  className="flex-1 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold py-3 rounded-lg transition-all duration-300 transform hover:-translate-y-1 flex justify-center items-center"
                >
                  <CheckCircle className="h-5 w-5 mr-2" />
                  Submit Request
                </button>
                <button
                  type="button"
                  onClick={() => setShowRequestForm(false)}
                  className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-3 rounded-lg transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default EquipmentPage;
