import { useState, useEffect } from "react";
import { FaBell, FaTrash, FaUsers, FaUserGraduate, FaUserTie } from "react-icons/fa";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function Notifications() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    message: "",
    type: "info",
    targetUserTypes: ["all"] // Always targeting all users
  });

  // Fetch all notifications
  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        "https://sportalon-backend.onrender.com/api/notifications/admin",
        {
          credentials: "include",
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch notifications");
      }

      const data = await response.json();
      setNotifications(data.notifications);
      setError(null);
    } catch (error) {
      setError(error.message);
      toast.error("Failed to load notifications");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // We no longer need the handleTargetChange function since we've simplified the UI
  // and are always sending to all users

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.title.trim() || !formData.message.trim()) {
      toast.error("Title and message are required");
      return;
    }
    
    // Always set targetUserTypes to ["all"] regardless of what's in the form
    const notificationData = {
      ...formData,
      targetUserTypes: ["all"]
    };
    
    try {
      // Show loading toast
      const loadingToastId = toast.loading("Sending notification...");
      
      const response = await fetch("https://sportalon-backend.onrender.com/api/notifications", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(notificationData),
      });

      // Dismiss loading toast
      toast.dismiss(loadingToastId);

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to send notification");
      }

      const data = await response.json();
      toast.success("Notification sent successfully!");
      
      // Reset form
      setFormData({
        title: "",
        message: "",
        type: "info",
        targetUserTypes: ["all"]
      });
      
      // Refresh notifications list
      fetchNotifications();
    } catch (error) {
      console.error("Error sending notification:", error);
      toast.error(error.message || "Failed to send notification. Please try again.");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this notification?")) {
      try {
        const response = await fetch(
          `https://sportalon-backend.onrender.com/api/notifications/${id}`,
          {
            method: "DELETE",
            credentials: "include",
          }
        );

        if (!response.ok) {
          throw new Error("Failed to delete notification");
        }

        toast.success("Notification deleted successfully");
        fetchNotifications();
      } catch (error) {
        toast.error(error.message);
      }
    }
  };

  const formatDate = (dateString) => {
    const options = { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  const getTypeColor = (type) => {
    switch (type) {
      case "info":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200";
      case "warning":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200";
      case "success":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
      case "error":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200";
    }
  };

  const getTargetUserLabel = (targetUserTypes) => {
    // Since we're only using "all" now, we can simplify this function
    return "All Users";
  };

  return (
    <div className="content-area bg-gray-50 dark:bg-gray-800 min-h-screen p-6">
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} newestOnTop closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover />
      
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white flex items-center">
          <FaBell className="mr-3 text-blue-500" /> Notifications Management
        </h1>
      </div>
      
      {/* Alert Banner */}
      <div className="bg-blue-50 border-l-4 border-blue-500 text-blue-700 p-4 mb-6 rounded-lg shadow-sm">
        <div className="flex">
          <div className="flex-shrink-0">
            <FaBell className="h-5 w-5 text-blue-500" />
          </div>
          <div className="ml-3">
            <p className="text-sm font-medium">
              Use this form to send important notifications to all users of the platform. Notifications will appear in the bell icon in the navigation bar.
            </p>
          </div>
        </div>
      </div>

      {/* Send Notification Form - Full width on mobile, takes priority */}
      <div className="bg-white dark:bg-gray-900 rounded-lg shadow-md p-6 mb-6 transition-all duration-300 hover:shadow-lg border-2 border-blue-200 dark:border-blue-900">
        <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white flex items-center">
          <FaBell className="mr-2 text-blue-500" /> Send New Notification
        </h2>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Title
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white"
                placeholder="E.g., Important Announcement, Upcoming Event, System Maintenance"
                required
              />
              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                Keep titles short and descriptive (30-60 characters)
              </p>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Message
              </label>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleInputChange}
                rows="4"
                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white"
                placeholder="E.g., The sports facility will be closed for maintenance on Saturday, June 10th from 9 AM to 12 PM. Please plan accordingly."
                required
              ></textarea>
              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                Be clear and concise. Include any important dates, times, or actions required.
              </p>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Type
              </label>
              <select
                name="type"
                value={formData.type}
                onChange={handleInputChange}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white"
              >
                <option value="info">Information</option>
                <option value="warning">Warning</option>
                <option value="success">Success</option>
                <option value="error">Error</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Target Users
              </label>
              
              <div className="bg-blue-50 dark:bg-blue-900/30 p-3 rounded-lg border border-blue-200 dark:border-blue-800">
                <div className="flex items-center">
                  <FaUsers className="text-blue-600 mr-2" />
                  <span className="font-medium text-blue-700 dark:text-blue-300">
                    All Users
                  </span>
                </div>
                <p className="mt-2 text-sm text-blue-600 dark:text-blue-400">
                  This notification will be sent to all users on the platform.
                </p>
              </div>
              
              <input type="hidden" name="targetUserTypes" value="all" />
            </div>
            
            <div className="pt-4">
              <button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg transition-all duration-300 flex items-center justify-center shadow-md hover:shadow-lg transform hover:-translate-y-0.5 text-lg"
              >
                <FaBell className="mr-2 text-xl" /> Send Notification to Users
              </button>
              <p className="mt-2 text-center text-xs text-gray-500 dark:text-gray-400">
                This notification will be immediately visible to users in their notification bell.
              </p>
            </div>
          </form>
      </div>
      
      {/* Notifications List */}
      <div className="bg-white dark:bg-gray-900 rounded-lg shadow-md p-6 transition-all duration-300 hover:shadow-lg">
        <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white flex justify-between items-center">
          <span>Recent Notifications</span>
          <span className="text-sm font-normal text-gray-500 dark:text-gray-400">
            Total: {notifications.length}
          </span>
        </h2>
        
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : error ? (
          <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded">
            <p className="font-bold">Error</p>
            <p>{error}</p>
          </div>
        ) : notifications.length === 0 ? (
          <div className="text-center py-10 text-gray-500 dark:text-gray-400">
            <FaBell className="mx-auto text-4xl mb-3 opacity-30" />
            <p>No notifications have been sent yet.</p>
          </div>
        ) : (
          <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2">
            {notifications.map((notification) => (
              <div 
                key={notification._id} 
                className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:shadow-md transition-shadow duration-200"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-semibold text-gray-800 dark:text-white">
                      {notification.title}
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                      Sent by: {notification.createdBy?.fullname || 'Admin'} • {formatDate(notification.createdAt)}
                    </p>
                  </div>
                  <button
                    onClick={() => handleDelete(notification._id)}
                    className="text-red-500 hover:text-red-700 transition-colors"
                    title="Delete notification"
                  >
                    <FaTrash />
                  </button>
                </div>
                
                <p className="mt-2 text-gray-700 dark:text-gray-300">
                  {notification.message}
                </p>
                
                <div className="mt-3 flex flex-wrap gap-2">
                  <span className={`px-2 py-1 text-xs rounded-full ${getTypeColor(notification.type)}`}>
                    {notification.type.charAt(0).toUpperCase() + notification.type.slice(1)}
                  </span>
                  <span className="px-2 py-1 text-xs rounded-full bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200">
                    {getTargetUserLabel(notification.targetUserTypes)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Notifications;