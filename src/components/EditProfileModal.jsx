import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { X, Upload, Loader, User } from "lucide-react";
import { toast } from "react-toastify";
import Select from 'react-select';

const EditProfileModal = ({ isOpen, onClose, userData, onProfileUpdate }) => {
  const token = useSelector((state) => state.auth.token);
  const [loading, setLoading] = useState(false);
  
  // Sports options for the dropdown
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
  
  const [selectedSportsInterests, setSelectedSportsInterests] = useState([]);
  const [formData, setFormData] = useState({
    mobile_number: "",
    collegeid: "",
    department: "",
    year: "",
    age: "",
    description: "",
    address: "",
    sports_interest: "",
    profile_picture: ""
  });
  const [profilePic, setProfilePic] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");

  // Initialize form data when userData changes
  useEffect(() => {
    if (userData) {
      console.log("Initializing form with userData:", userData);
      
      // Initialize form data with user data
      setFormData({
        mobile_number: userData.mobile_number || userData.phone || "",
        collegeid: userData.collegeid || userData.studentId || "",
        department: userData.department || "",
        year: userData.year || "",
        age: userData.age || "",
        description: userData.description || "",
        address: userData.address || "",
        sports_interest: userData.sports_interest || 
          (userData.preferredSports && Array.isArray(userData.preferredSports) ? 
            userData.preferredSports.join(',') : 
            userData.preferredSports || ""),
        profile_picture: userData.profile_picture || userData.profileImage || ""
      });
      
      // Initialize selected sports interests
      let sportsInterestValue = userData.sports_interest || userData.preferredSports || "";
      let sportsArray = [];
      
      if (typeof sportsInterestValue === 'string' && sportsInterestValue) {
        sportsArray = sportsInterestValue.split(',').map(sport => sport.trim());
      } else if (Array.isArray(sportsInterestValue)) {
        sportsArray = sportsInterestValue;
      }
      
      if (sportsArray.length > 0) {
        const sportOptions = sportsArray.map(sport => ({
          value: sport.toLowerCase(),
          label: sport.charAt(0).toUpperCase() + sport.slice(1)
        }));
        setSelectedSportsInterests(sportOptions);
      } else {
        setSelectedSportsInterests([]);
      }
      
      // Set preview URL for profile picture
      const profilePicUrl = userData.profile_picture || userData.profileImage;
      if (profilePicUrl) {
        setPreviewUrl(profilePicUrl);
      }
    }
  }, [userData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  // Handle sports interest selection
  const handleSportsInterestChange = (selectedOptions) => {
    setSelectedSportsInterests(selectedOptions || []);
    
    // Convert the selected options to a comma-separated string and store in formData
    const sportsInterestString = selectedOptions ? 
      selectedOptions.map(option => option.value).join(',') : 
      "";
      
    setFormData(prev => ({
      ...prev,
      sports_interest: sportsInterestString
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfilePic(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const uploadProfilePicture = async () => {
    if (!profilePic) return formData.profile_picture;

    try {
      const formDataUpload = new FormData();
      formDataUpload.append("image", profilePic);

      console.log("Uploading profile picture...");
      const response = await fetch("https://sportalon-backend.onrender.com/api/upload/image", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`
        },
        body: formDataUpload
      });

      if (!response.ok) {
        throw new Error(`Failed to upload profile picture: ${response.status}`);
      }

      const data = await response.json();
      console.log("Profile picture upload response:", data);
      return data.imageUrl;
    } catch (error) {
      console.error("Error uploading profile picture:", error);
      toast.error("Failed to upload profile picture: " + error.message);
      return formData.profile_picture;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Upload profile picture if changed
      let profilePictureUrl = formData.profile_picture;
      if (profilePic) {
        profilePictureUrl = await uploadProfilePicture();
      }

      // Prepare data for API
      const updateData = {
        ...formData,
        profile_picture: profilePictureUrl
      };

      console.log("Sending profile update with data:", updateData);
      
      // Send update request
      const response = await fetch("https://sportalon-backend.onrender.com/api/user/profile/update", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(updateData)
      });
      
      console.log("Profile update response status:", response.status);

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to update profile: ${response.status} - ${errorText}`);
      }

      const data = await response.json();
      console.log("Profile update response data:", data);
      
      if (data.success) {
        toast.success("Profile updated successfully");
        
        // Create updated user data that preserves both original and UI-specific fields
        const updatedUserData = {
          ...userData,
          // Update backend fields
          mobile_number: updateData.mobile_number,
          collegeid: updateData.collegeid,
          department: updateData.department,
          year: updateData.year,
          age: updateData.age,
          description: updateData.description,
          address: updateData.address,
          sports_interest: updateData.sports_interest,
          profile_picture: profilePictureUrl,
          
          // Also update UI-specific fields for immediate UI update
          phone: updateData.mobile_number,
          studentId: updateData.collegeid,
          profileImage: profilePictureUrl,
          preferredSports: updateData.sports_interest ? 
            updateData.sports_interest.split(',').map(s => s.trim()) : 
            []
        };
        
        onProfileUpdate(updatedUserData);
        onClose();
      } else {
        toast.error(data.message || "Failed to update profile");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error(error.message || "An error occurred while updating profile");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-xl font-semibold text-gray-800">Edit Profile</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4">
          <div className="mb-6 flex flex-col items-center">
            <div className="relative w-32 h-32 mb-3">
              <div className="w-full h-full rounded-full overflow-hidden border-4 border-indigo-100">
                {previewUrl ? (
                  <img
                    src={previewUrl}
                    alt="Profile Preview"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = "/default_img.jpeg";
                    }}
                  />
                ) : (
                  <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                    <User className="h-10 w-10 text-gray-400" />
                  </div>
                )}
              </div>
              <label
                htmlFor="profile_picture"
                className="absolute bottom-0 right-0 bg-indigo-600 text-white p-2 rounded-full cursor-pointer hover:bg-indigo-700 transition-colors"
              >
                <Upload className="h-4 w-4" />
              </label>
              <input
                type="file"
                id="profile_picture"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />
            </div>
            <p className="text-sm text-gray-500">Click the icon to upload a new profile picture</p>
          </div>

          <div className="space-y-4">
            {/* Read-only fields (name and email) */}
            <div className="grid grid-cols-1 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Name (Cannot be changed)
                </label>
                <input
                  type="text"
                  value={userData?.name || userData?.fullname || ""}
                  disabled
                  className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100 text-gray-600"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email (Cannot be changed)
                </label>
                <input
                  type="email"
                  value={userData?.email || ""}
                  disabled
                  className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100 text-gray-600"
                />
              </div>
            </div>

            {/* Editable fields */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="mobile_number" className="block text-sm font-medium text-gray-700 mb-1">
                  Phone Number
                </label>
                <input
                  type="text"
                  id="mobile_number"
                  name="mobile_number"
                  value={formData.mobile_number}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <div>
                <label htmlFor="collegeid" className="block text-sm font-medium text-gray-700 mb-1">
                  Student ID
                </label>
                <input
                  type="text"
                  id="collegeid"
                  name="collegeid"
                  value={formData.collegeid}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="department" className="block text-sm font-medium text-gray-700 mb-1">
                  Department
                </label>
                <select
                  id="department"
                  name="department"
                  value={formData.department}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="">Select Department</option>
                  <option value="IT">Information Technology (IT)</option>
                  <option value="CS">Computer Science (CS)</option>
                  <option value="EnTC">Electronics & Telecom (EnTC)</option>
                  <option value="Mech">Mechanical (Mech)</option>
                  <option value="Biotech">Biotechnology</option>
                  <option value="Civil">Civil</option>
                  <option value="Electrical">Electrical</option>
                </select>
              </div>
              <div>
                <label htmlFor="year" className="block text-sm font-medium text-gray-700 mb-1">
                  Year
                </label>
                <select
                  id="year"
                  name="year"
                  value={formData.year}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="">Select Year</option>
                  <option value="FE">First Year (FE)</option>
                  <option value="SE">Second Year (SE)</option>
                  <option value="TE">Third Year (TE)</option>
                  <option value="BE">Fourth Year (BE)</option>
                </select>
              </div>
            </div>

            <div>
              <label htmlFor="age" className="block text-sm font-medium text-gray-700 mb-1">
                Age
              </label>
              <input
                type="number"
                id="age"
                name="age"
                min="16"
                max="30"
                value={formData.age}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label htmlFor="sports_interest" className="block text-sm font-medium text-gray-700 mb-1">
                Sports Interests
              </label>
              <Select
                isMulti
                id="sports_interest"
                name="sports_interest"
                options={sportsOptions}
                className="basic-multi-select"
                classNamePrefix="select"
                value={selectedSportsInterests}
                onChange={handleSportsInterestChange}
                placeholder="Select sports interests..."
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

            <div>
              <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
                Address
              </label>
              <input
                type="text"
                id="address"
                name="address"
                value={formData.address}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                About Me
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows="3"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              ></textarea>
            </div>
          </div>

          <div className="mt-6 flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 flex items-center justify-center"
            >
              {loading ? (
                <>
                  <Loader className="h-4 w-4 mr-2 animate-spin" />
                  Updating...
                </>
              ) : (
                "Save Changes"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProfileModal;