import React, { useEffect, useState, useRef } from "react";
import { useSelector } from "react-redux";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Award,
  Calendar,
  FileText,
  Edit,
  ChevronDown,
  ChevronUp,
  Loader,
  Trophy,
  Star,
  Clock,
  ArrowRight
} from "lucide-react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { FiFileText } from "react-icons/fi";
import { toast } from "react-toastify";
import RecommendedEvents from "../components/RecommendedEvents";
import EditProfileModal from "../components/EditProfileModal";

const ProfilePage = () => {
  const token = useSelector((state) => state.auth.token);
  const id = useSelector((state) => state.auth.id); // Get user ID from Redux
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchParams] = useSearchParams();
  const tabParam = searchParams.get('tab');
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [refreshRecommendations, setRefreshRecommendations] = useState(0); // Counter to trigger recommendation refresh

  const [activeTab, setActiveTab] = useState(tabParam || "personal");
  const navigate = useNavigate();
  
  // Set active tab
  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };
  
  // Open edit profile modal
  const openEditModal = () => {
    setIsEditModalOpen(true);
  };
  
  // Close edit profile modal
  const closeEditModal = () => {
    setIsEditModalOpen(false);
  };
  
  // Handle profile update
  const handleProfileUpdate = (updatedProfile) => {
    setProfile(updatedProfile);
    // Increment the refresh counter to trigger recommendation refresh
    setRefreshRecommendations(prev => prev + 1);
    toast.success("Profile updated successfully");
  };

  useEffect(() => {
    if (!token) {
      navigate("/login");
    }
  }, [token, navigate]);
  
  // Set active tab when URL parameter changes
  useEffect(() => {
    if (tabParam) {
      setActiveTab(tabParam);
    }
  }, [tabParam]);

  useEffect(() => {
    const fetchUserProfile = async () => {
      setLoading(true);
      try {
        // Make sure we have a valid ID and token before making the request
        if (!id || !token) {
          console.log("Missing ID or token, skipping profile fetch");
          setLoading(false);
          return;
        }

        console.log("Fetching user profile with ID:", id);

        // Add authorization header with token
        const response = await fetch(
          `https://sportalon-backend.onrender.com/api/admin/users/getUser/${id}`,
          {
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          }
        );
        
        // For debugging
        console.log("Profile API response status:", response.status);
        
        // For debugging
        console.log("Profile API response status:", response.status);

        if (!response.ok) {
          throw new Error(`API request failed with status ${response.status}`);
        }

        const data = await response.json();
        console.log("Profile data received:", data);

        if (data.success) {
          // Store the raw user data and add UI-specific fields
          const profileData = {
            // Original data from API
            ...data.user || data.user.collegeid,
            // UI-specific fields
            name: data.user.fullname,
            dob: "", // No DOB in response, add if available
            email: data.user.email,
            phone: data.user.mobile_number,
            studentId: data.user.prn_number || data.user.collegeid,
            institution: "Sinhgad College of Engineering",
            department: data.user.department,
            year: data.user.year,
            preferredSports: data.user.sports_interest ? 
              (typeof data.user.sports_interest === 'string' ? 
                (typeof data.user.sports_interest === 'string' ? 
                data.user.sports_interest.split(',').map(sport => sport.trim()) : 
                data.user.sports_interest) : 
                data.user.sports_interest) : 
              [],
            participationHistory: data.user.registeredEvents || [],
            skillLevel: "Intermediate", // Default value
            achievements: [], // No achievements in response
            profileImage: data.user.profile_picture,
            feeReceipt: data.user.collegeid,
            address: data.user.address,
          };
          
          console.log("Transformed profile data:", profileData);
          setProfile(profileData);
          
          console.log("Transformed profile data:", profileData);
          setProfile(profileData);
          setLoading(false);
        } else {
          console.error("API returned success: false", data);
          setLoading(false);
        }
      } catch (error) {
        console.error("Error fetching user data:", error);

        // Try alternative endpoint as fallback
        try {
          console.log("Trying alternative endpoint for user profile");
          const response = await fetch(
            `https://sportalon-backend.onrender.com/api/user/profile`,
            {
              method: 'GET',
              headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
              }
            }
          );

          if (!response.ok) {
            throw new Error(`Alternative API request failed with status ${response.status}`);
          }

          const data = await response.json();
          console.log("Profile data received from alternative endpoint:", data);

          if (data.success) {
            setProfile({
              name: data.user.fullname || data.user.name,
              dob: "",
              email: data.user.email,
              phone: data.user.mobile_number || data.user.phone,
              studentId: data.user.prn_number || data.user.studentId,
              institution: "Sinhgad College of Engineering",
              department: data.user.department,
              year: data.user.year,
              preferredSports: data.user.sports_interest ? 
                data.user.sports_interest.split(',').map(sport => sport.trim()) : 
                [],
              participationHistory: data.user.registeredEvents || [],
              skillLevel: "Intermediate",
              achievements: [],
              profileImage: data.user.profile_picture || data.user.profileImage,
              feeReceipt: data.user.collegeid || data.user.feeReceipt,
              address: data.user.address,
            });
          }
        } catch (fallbackError) {
          console.error("Fallback endpoint also failed:", fallbackError);
        } finally {
          setLoading(false);
        }
      }
    };

    // Only fetch if we have both token and id
    if (token && id) {
      fetchUserProfile();
    } else {
      setLoading(false);
    }
  }, [id, token]);

  // Loading state with animated elements
  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-indigo-50 to-white">
        <div className="relative w-28 h-28">
          <div className="absolute inset-0 rounded-full border-t-4 border-indigo-600 animate-spin"></div>
          <div className="absolute inset-0 rounded-full border-r-4 border-purple-500 animate-pulse opacity-75"></div>
          <div className="absolute inset-4 rounded-full border-2 border-indigo-200"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <Trophy className="h-10 w-10 text-indigo-600 animate-bounce" />
          </div>
        </div>
        <div className="mt-8 text-center">
          <p className="text-gray-700 font-medium text-lg">Loading your profile</p>
          <div className="flex items-center justify-center mt-2 space-x-1">
            <div className="w-2 h-2 rounded-full bg-indigo-600 animate-bounce" style={{ animationDelay: "0ms" }}></div>
            <div className="w-2 h-2 rounded-full bg-indigo-600 animate-bounce" style={{ animationDelay: "150ms" }}></div>
            <div className="w-2 h-2 rounded-full bg-indigo-600 animate-bounce" style={{ animationDelay: "300ms" }}></div>
          </div>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-indigo-50 to-white">
        <div className="text-center max-w-md p-8 bg-white rounded-xl shadow-lg transform transition-all duration-500 hover:shadow-2xl">
          <div className="relative mx-auto w-24 h-24 mb-6">
            <div className="absolute inset-0 bg-red-100 rounded-full animate-pulse"></div>
            <User className="h-16 w-16 text-red-500 absolute inset-0 m-auto" />
          </div>
          <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-pink-600 mb-4">
            Profile not found
          </h2>
          <p className="text-gray-600 mb-8">
            We couldn't load your profile information. Please try again later.
          </p>
          <div className="flex space-x-4">
            <button
              onClick={() => window.location.reload()}
              className="flex-1 px-6 py-3 bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold rounded-lg transition-all duration-300 transform hover:-translate-y-1"
            >
              Retry
            </button>
            <button
              onClick={() => navigate("/")}
              className="flex-1 px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold rounded-lg transition-all duration-300 transform hover:-translate-y-1"
            >
              Go to Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-50 to-white py-12 px-4 sm:px-6 lg:px-8">
      {/* Edit Profile Modal */}
      <EditProfileModal 
        isOpen={isEditModalOpen} 
        onClose={closeEditModal} 
        userData={profile} 
        onProfileUpdate={handleProfileUpdate} 
      />
      
      <div className="max-w-4xl mx-auto mt-8">
        {/* Profile Header */}
        <div className="bg-gradient-to-r from-indigo-800 via-purple-800 to-indigo-900 rounded-t-2xl p-8 text-white shadow-lg relative overflow-hidden">
          {/* Decorative elements */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full -mr-20 -mt-20"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-white opacity-5 rounded-full -ml-20 -mb-20"></div>

          <div className="flex flex-col sm:flex-row items-center gap-6 relative z-10">
            <div className="relative group">
              <div className="w-36 h-36 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center overflow-hidden border-4 border-white/30 shadow-lg group-hover:scale-105 transition-all duration-300">
                {profile.profileImage ? (
                  <img
                    src={profile.profileImage}
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <User className="h-20 w-20 text-white/80" />
                )}
              </div>
              <button 
                onClick={openEditModal}
                className="absolute bottom-1 right-1 bg-white/90 text-indigo-800 p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:bg-white"
              >
                <Edit className="h-4 w-4" />
              </button>
            </div>

            <div className="text-center sm:text-left">
              <h1 className="text-4xl font-bold mb-2 text-transparent bg-clip-text bg-gradient-to-r from-white to-indigo-200">
                {profile.name}
              </h1>
              <p className="text-indigo-200 mb-2 flex items-center justify-center sm:justify-start">
                <Calendar className="h-4 w-4 mr-2" /> Student ID: {profile.studentId}
              </p>
              <div className="flex flex-wrap gap-2 justify-center sm:justify-start">
                <span className="px-3 py-1 bg-indigo-700/50 rounded-full text-xs font-medium text-indigo-100 backdrop-blur-sm">
                  {profile.department}
                </span>
                <span className="px-3 py-1 bg-purple-700/50 rounded-full text-xs font-medium text-purple-100 backdrop-blur-sm">
                  Year {profile.year}
                </span>
                <span className="px-3 py-1 bg-blue-700/50 rounded-full text-xs font-medium text-blue-100 backdrop-blur-sm flex items-center">
                  <Star className="h-3 w-3 mr-1" /> {profile.skillLevel}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs Navigation */}
        <div className="bg-white border-b border-gray-200 flex overflow-x-auto">
          {["personal", "sports", "history", "documents", "recommendations"].map((tab) => (
            <button
              key={tab}
              onClick={() => handleTabChange(tab)}
              className={`px-4 py-3 font-medium text-sm whitespace-nowrap transition-colors duration-200 ${
                activeTab === tab
                  ? "text-indigo-600 border-b-2 border-indigo-600"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        {/* Content Area */}
        <div className="bg-white rounded-b-2xl shadow-lg p-6 sm:p-8">
          {/* Personal Info Tab */}
          <div className={activeTab === "personal" ? "block" : "hidden"}>
            <div className="mb-4">
              <h2 className="text-2xl font-bold text-gray-900">Personal Information</h2>
            </div>

            {/* Always show content when tab is active */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-fadeIn">
                <div className="bg-gray-50 p-4 rounded-lg flex items-start hover:shadow-md transition-shadow duration-300 transform hover:-translate-y-1">
                  <Mail className="h-5 w-5 text-indigo-600 mt-1 mr-3" />
                  <div>
                    <p className="text-gray-500 text-sm">Email</p>
                    <p className="text-gray-800 font-medium">{profile.email || "N/A"}</p>
                  </div>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg flex items-start hover:shadow-md transition-shadow duration-300 transform hover:-translate-y-1">
                  <Phone className="h-5 w-5 text-indigo-600 mt-1 mr-3" />
                  <div>
                    <p className="text-gray-500 text-sm">Phone</p>
                    <p className="text-gray-800 font-medium">{profile.phone || "N/A"}</p>
                  </div>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg flex items-start hover:shadow-md transition-shadow duration-300 transform hover:-translate-y-1">
                  <User className="h-5 w-5 text-indigo-600 mt-1 mr-3" />
                  <div>
                    <p className="text-gray-500 text-sm">Student ID</p>
                    <p className="text-gray-800 font-medium">{profile.studentId || "N/A"}</p>
                  </div>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg flex items-start hover:shadow-md transition-shadow duration-300 transform hover:-translate-y-1">
                  <MapPin className="h-5 w-5 text-indigo-600 mt-1 mr-3" />
                  <div>
                    <p className="text-gray-500 text-sm">Address</p>
                    <p className="text-gray-800 font-medium">{profile.address || "N/A"}</p>
                  </div>
                </div>
              </div>
          </div>

          {/* Sports Tab */}
          <div className={activeTab === "sports" ? "block" : "hidden"}>
            <div className="mb-4">
              <h2 className="text-2xl font-bold text-gray-900">Sports Interests</h2>
            </div>

            {/* Always show content when tab is active */}
              <div className="animate-fadeIn">
                <div className="mb-6">
                  <h3 className="text-lg font-semibold mb-3 text-gray-800">Preferred Sports</h3>
                  {profile.preferredSports && profile.preferredSports.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {profile.preferredSports.map((sport, index) => (
                        <span
                          key={index}
                          className="px-4 py-2 bg-indigo-100 text-indigo-800 rounded-lg font-medium text-sm hover:bg-indigo-200 transition-colors"
                        >
                          {sport}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <div className="bg-gray-50 p-4 rounded-lg text-gray-500 text-center">
                      <p className="mb-2">No sports preferences added yet</p>
                      <p className="text-sm text-indigo-600">
                        Your sports interests will appear here once you've added them to your profile.
                      </p>
                    </div>
                  )}
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-3 text-gray-800">Skill Level</h3>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="flex justify-between mb-2">
                      <span className="text-gray-700 font-medium">{profile.skillLevel}</span>
                      <span className="text-gray-500 text-sm">
                        {profile.skillLevel === "Beginner" ? "25%" :
                         profile.skillLevel === "Intermediate" ? "50%" :
                         profile.skillLevel === "Advanced" ? "75%" : "100%"}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div
                        className="h-2.5 rounded-full bg-gradient-to-r from-indigo-600 to-purple-600"
                        style={{
                          width: profile.skillLevel === "Beginner" ? "25%" :
                                 profile.skillLevel === "Intermediate" ? "50%" :
                                 profile.skillLevel === "Advanced" ? "75%" : "100%"
                        }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
          </div>

          {/* History Tab */}
          <div className={activeTab === "history" ? "block" : "hidden"}>
            <div className="mb-4">
              <h2 className="text-2xl font-bold text-gray-900">Participation History</h2>
            </div>

            {/* Always show content when tab is active */}
              <div className="animate-fadeIn">
                {profile.participationHistory.length > 0 ? (
                  <div className="space-y-4">
                    {profile.participationHistory.map((event, index) => (
                      <div
                        key={index}
                        className="bg-gray-50 p-4 rounded-lg hover:shadow-md transition-all duration-300 transform hover:-translate-y-1"
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-semibold text-gray-900">{event.title}</h3>
                            <p className="text-gray-600 text-sm mt-1">
                              Category: {event.sportsCategory}
                            </p>
                          </div>
                          <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
                            Participated
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="bg-gray-50 p-8 rounded-lg text-center">
                    <Trophy className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                    <h3 className="text-lg font-medium text-gray-800 mb-1">No Past Records</h3>
                    <p className="text-gray-500">You haven't participated in any events yet.</p>
                    <button
                      onClick={() => navigate("/events")}
                      className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors inline-flex items-center"
                    >
                      Browse Events <ArrowRight className="ml-2 h-4 w-4" />
                    </button>
                  </div>
                )}
              </div>
          </div>

          {/* Documents Tab */}
          <div className={activeTab === "documents" ? "block" : "hidden"}>
            <div className="mb-4">
              <h2 className="text-2xl font-bold text-gray-900">Documents</h2>
            </div>

            {/* Always show content when tab is active */}
              <div className="animate-fadeIn">
                <div className="bg-gray-50 p-5 rounded-lg hover:shadow-md transition-all duration-300">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center">
                      <div className="p-3 bg-indigo-100 rounded-lg mr-4">
                        <FileText className="h-6 w-6 text-indigo-600" />
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-900">College Fee Receipt</h3>
                        <p className="text-gray-500 text-sm">Required for verification</p>
                      </div>
                    </div>

                    {profile.feeReceipt ? (
                      <a
                        href={profile.feeReceipt}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700 transition-colors flex items-center"
                      >
                        <FileText className="h-4 w-4 mr-2" /> View Document
                      </a>
                    ) : (
                      <span className="px-4 py-2 bg-red-100 text-red-800 rounded-lg text-sm font-medium">
                        Not Uploaded
                      </span>
                    )}
                  </div>
                </div>
              </div>
          </div>

          {/* Recommendations Tab */}
          <div className={activeTab === "recommendations" ? "block" : "hidden"}>
            <div className="mb-4">
              <h2 className="text-2xl font-bold text-gray-900">Recommended Events</h2>
            </div>

            {/* Always show content when tab is active */}
              <div className="animate-fadeIn">
                <RecommendedEvents refreshTrigger={refreshRecommendations} />
              </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
