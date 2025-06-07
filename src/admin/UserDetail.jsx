import { useNavigate, useParams } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";
import { useState, useEffect } from "react";

function UserDetail() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true);
        const response = await fetch(`http://localhost:5000/api/admin/users/getUser/${id}`);

        if (!response.ok) {
          throw new Error("Failed to fetch user data");
        }

        const data = await response.json();
        setUser(data.user);
        setError(null);
      } catch (error) {
        console.error("Error fetching user data:", error);
        setError("Failed to load user data. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchUserData();
    }
  }, [id]);

  const handleNavigateToUsers = () => {
    navigate("/admin/users");
  };

  // Format date function
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString();
  };

  if (loading) {
    return (
      <div className="content-area flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="content-area">
        <button
          onClick={handleNavigateToUsers}
          className="flex items-center text-gray-600 dark:text-gray-300 mb-6 hover:text-gray-800 dark:hover:text-white"
        >
          <FaArrowLeft className="mr-2" />
          Back to Users
        </button>
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded">
          <p className="font-bold">Error</p>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="content-area">
        <button
          onClick={handleNavigateToUsers}
          className="flex items-center text-gray-600 dark:text-gray-300 mb-6 hover:text-gray-800 dark:hover:text-white"
        >
          <FaArrowLeft className="mr-2" />
          Back to Users
        </button>
        <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 mb-6 rounded">
          <p className="font-bold">User Not Found</p>
          <p>The requested user could not be found.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="content-area">
      <button
        onClick={handleNavigateToUsers}
        className="flex items-center text-gray-600 dark:text-gray-300 mb-6 hover:text-gray-800 dark:hover:text-white"
      >
        <FaArrowLeft className="mr-2" />
        Back to Users
      </button>

      <div className="space-y-6">
        <div className="card">
          <h1 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white">
            User Profile
          </h1>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h2 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white">
                Personal Information
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-gray-500 dark:text-gray-400">
                    Name
                  </label>
                  <p className="text-gray-800 dark:text-gray-300">
                    {user.fullname}
                  </p>
                </div>
                <div>
                  <label className="block text-sm text-gray-500 dark:text-gray-400">
                    Email
                  </label>
                  <p className="text-gray-800 dark:text-gray-300">
                    {user.email}
                  </p>
                </div>
                <div>
                  <label className="block text-sm text-gray-500 dark:text-gray-400">
                    Phone
                  </label>
                  <p className="text-gray-800 dark:text-gray-300">
                    {user.mobile_number || "Not provided"}
                  </p>
                </div>
                <div>
                  <label className="block text-sm text-gray-500 dark:text-gray-400">
                    Department
                  </label>
                  <p className="text-gray-800 dark:text-gray-300">
                    {user.department || "Not provided"}
                  </p>
                </div>
                <div>
                  <label className="block text-sm text-gray-500 dark:text-gray-400">
                    Year
                  </label>
                  <p className="text-gray-800 dark:text-gray-300">
                    {user.year || "Not provided"}
                  </p>
                </div>
                <div>
                  <label className="block text-sm text-gray-500 dark:text-gray-400">
                    Address
                  </label>
                  <p className="text-gray-800 dark:text-gray-300">
                    {user.address || "Not provided"}
                  </p>
                </div>
              </div>
            </div>

            <div>
              <h2 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white">
                Account Information
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-gray-500 dark:text-gray-400">
                    User Type
                  </label>
                  <p className="text-gray-800 dark:text-gray-300">
                    {user.user_type}
                  </p>
                </div>
                <div>
                  <label className="block text-sm text-gray-500 dark:text-gray-400">
                    Verification Status
                  </label>
                  <p className="text-gray-800 dark:text-gray-300">
                    {user.isVerifiedByAdmin ? "Verified" : "Pending Verification"}
                  </p>
                </div>
                <div>
                  <label className="block text-sm text-gray-500 dark:text-gray-400">
                    Sports Interest
                  </label>
                  <p className="text-gray-800 dark:text-gray-300">
                    {user.sports_interest || "None specified"}
                  </p>
                </div>
                <div>
                  <label className="block text-sm text-gray-500 dark:text-gray-400">
                    Profile Creation Date
                  </label>
                  <p className="text-gray-800 dark:text-gray-300">
                    {formatDate(user.createdAt)}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {user.achievements && (
          <div className="card">
            <h2 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white">
              Achievements
            </h2>
            <p className="text-gray-700 dark:text-gray-300">
              {user.achievements || "No achievements listed"}
            </p>
          </div>
        )}

        {user.registeredEvents && user.registeredEvents.length > 0 && (
          <div className="card">
            <h2 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white">
              Registered Events
            </h2>
            <ul className="space-y-2">
              {user.registeredEvents.map((event, index) => (
                <li key={index} className="text-gray-700 dark:text-gray-300">
                  • {event.title} ({event.sportsCategory})
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Additional sections can be added here as user data becomes available */}
      </div>
    </div>
  );
}

export default UserDetail;
