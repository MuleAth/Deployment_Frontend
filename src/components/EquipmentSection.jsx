import React, { useState, useEffect } from "react";
import { CheckCircle, ChevronRight, Clock, User, Calendar, AlertCircle, Search, Package } from "lucide-react";

const EquipmentSection = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [activeTab, setActiveTab] = useState("available");
  const [searchTerm, setSearchTerm] = useState("");

  // Equipment data - concise list
  const equipmentItems = [
    { name: "Basketball Court Equipment", category: "basketball", available: 12 },
    { name: "Football Gear", category: "football", available: 8 },
    { name: "Cricket Kit", category: "cricket", available: 5 },
    { name: "Swimming Accessories", category: "swimming", available: 20 },
    { name: "Gym Equipment", category: "gym", available: 30 },
    { name: "Badminton Rackets & Shuttlecocks", category: "badminton", available: 25 },
  ];

  // Guidelines with icons
  const guidelines = [
    { icon: Clock, text: "Equipment must be requested 24 hours in advance" },
    { icon: User, text: "Valid student ID required for equipment checkout" },
    { icon: Calendar, text: "Maximum checkout duration is 7 days" },
    { icon: AlertCircle, text: "Equipment must be returned in original condition" },
    { icon: Package, text: "Students are responsible for any damage to equipment" },
    { icon: User, text: "Only registered students can borrow equipment" },
  ];

  // Filter equipment based on search term
  const filteredEquipment = equipmentItems.filter(item =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Intersection Observer for animations
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    const section = document.getElementById("equipment");
    if (section) {
      observer.observe(section);
    }

    return () => {
      if (section) {
        observer.unobserve(section);
      }
    };
  }, []);

  return (
    <>
      <section
        className="py-20 bg-gradient-to-b from-white to-gray-50"
        id="equipment"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div
            className={`text-center mb-12 transition-all duration-700 ${
              isVisible ? "opacity-100 transform translate-y-0" : "opacity-0 transform translate-y-8"
            }`}
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Sports Equipment
            </h2>
            <p className="text-xl text-gray-600">
              Access top-quality equipment for your training needs
            </p>
          </div>

          {/* Tabs */}
          <div
            className={`flex justify-center mb-8 transition-all duration-700 delay-100 ${
              isVisible ? "opacity-100 transform translate-y-0" : "opacity-0 transform translate-y-8"
            }`}
          >
            <div className="inline-flex bg-gray-100 p-1 rounded-lg">
              <button
                onClick={() => setActiveTab("available")}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                  activeTab === "available"
                    ? "bg-white shadow-sm text-indigo-600"
                    : "text-gray-500 hover:text-gray-900"
                }`}
              >
                Available Equipment
              </button>
              <button
                onClick={() => setActiveTab("guidelines")}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                  activeTab === "guidelines"
                    ? "bg-white shadow-sm text-indigo-600"
                    : "text-gray-500 hover:text-gray-900"
                }`}
              >
                Guidelines
              </button>
            </div>
          </div>

          {/* Content based on active tab */}
          {activeTab === "available" ? (
            <div
              className={`transition-all duration-700 delay-200 ${
                isVisible ? "opacity-100 transform translate-y-0" : "opacity-0 transform translate-y-8"
              }`}
            >
              {/* Search */}
              <div className="relative max-w-md mx-auto mb-8">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search equipment..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 shadow-sm"
                />
              </div>

              {/* Equipment list */}
              <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-200">
                <div className="bg-indigo-50 px-6 py-4 border-b border-gray-200">
                  <div className="grid grid-cols-12 font-medium text-gray-700">
                    <div className="col-span-7 sm:col-span-8">Equipment</div>
                    <div className="col-span-3 sm:col-span-2 text-center">Available</div>
                    <div className="col-span-2 text-right">Action</div>
                  </div>
                </div>

                <div className="divide-y divide-gray-200">
                  {filteredEquipment.length > 0 ? (
                    filteredEquipment.map((item, index) => (
                      <div
                        key={index}
                        className="px-6 py-4 hover:bg-gray-50 transition-colors duration-150"
                      >
                        <div className="grid grid-cols-12 items-center">
                          <div className="col-span-7 sm:col-span-8 flex items-center">
                            <CheckCircle className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
                            <span className="font-medium text-gray-800">{item.name}</span>
                          </div>
                          <div className="col-span-3 sm:col-span-2 text-center">
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                              {item.available} units
                            </span>
                          </div>
                          <div className="col-span-2 text-right">
                            <a
                              href="/equipment-list"
                              className="inline-flex items-center text-indigo-600 font-medium text-sm hover:text-indigo-800"
                            >
                              Request
                              <ChevronRight className="ml-1 h-4 w-4" />
                            </a>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="px-6 py-10 text-center text-gray-500">
                      No equipment found matching your search.
                    </div>
                  )}
                </div>
              </div>

              <div className="mt-6 text-center">
                <a href="/equipment-list">
                  <button className="px-6 py-3 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition duration-300 shadow-md">
                    View All Equipment
                  </button>
                </a>
              </div>
            </div>
          ) : (
            <div
              className={`bg-indigo-900 rounded-xl p-8 text-white shadow-md transition-all duration-700 delay-200 ${
                isVisible ? "opacity-100 transform translate-y-0" : "opacity-0 transform translate-y-8"
              }`}
            >
              <h3 className="text-2xl font-bold mb-6 text-center">Equipment Guidelines</h3>
              <div className="space-y-4">
                {guidelines.map((guideline, index) => (
                  <div
                    key={index}
                    className="flex items-start space-x-4 p-3 rounded-lg hover:bg-white/10 transition-colors duration-200"
                  >
                    <div className="p-2 bg-white/20 rounded-full">
                      <guideline.icon className="h-5 w-5 text-indigo-300" />
                    </div>
                    <div>
                      <p className="text-base">{guideline.text}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-8 text-center">
                <a href="/equipment-policy">
                  <button className="px-6 py-3 bg-white text-indigo-900 font-semibold rounded-lg hover:bg-indigo-100 transition duration-300 shadow-md">
                    View Complete Policy
                  </button>
                </a>
              </div>
            </div>
          )}
        </div>
      </section>
    </>
  );
};

export default EquipmentSection;
