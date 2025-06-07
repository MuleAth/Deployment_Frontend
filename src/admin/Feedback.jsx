import { useState, useEffect } from "react";
import { FaTrash } from "react-icons/fa";

function Feedback() {
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);

  const categories = [
    "All",
    "Sports Facilities",
    "Equipment Quality",
    "Coaching Staff",
    "Events Organization",
    "Overall Experience",
    "Other",
  ];

  useEffect(() => {
    const fetchFeedbacks = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/feedback/all");
        if (!response.ok) throw new Error("Failed to fetch feedbacks");
        const data = await response.json();
        setFeedbacks(data.feedbacks);
        setError(null);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchFeedbacks();
  }, []);

  // Filter feedbacks by category
  const filteredFeedbacks = feedbacks.filter((feedback) => {
    if (selectedCategory === "All") return true;
    return feedback.reason === selectedCategory;
  });

  // Pagination calculations
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentFeedbacks = filteredFeedbacks.slice(
    indexOfFirstItem,
    indexOfLastItem
  );
  const totalPages = Math.ceil(filteredFeedbacks.length / itemsPerPage);

  // Reset to first page when category changes
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedCategory]);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this feedback?")) {
      return;
    }
  
    try {
      const response = await fetch(`http://localhost:5000/api/feedback/delete/${id}`, {
        method: "DELETE",
      });
  
      if (!response.ok) {
        throw new Error("Failed to delete feedback");
      }
  
      setFeedbacks((prevFeedbacks) => prevFeedbacks.filter((feedback) => feedback._id !== id));
    } catch (error) {
      console.error("Error deleting feedback:", error);
      alert("Error deleting feedback. Please try again.");
    }
  };

  if (loading) {
    return (
      <div className="content-area">
        <h1 className="page-title">Student Feedback</h1>
        <p>Loading feedbacks...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="content-area">
        <h1 className="page-title">Student Feedback</h1>
        <p className="text-red-500">Error: {error}</p>
      </div>
    );
  }

  return (
    <div className="content-area">
      <h1 className="page-title">Student Feedback</h1>

      {/* Filters */}
      <div className="flex justify-between items-center mb-6 p-1">
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="input-filter p-2"
        >
          {categories.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>

        <div className="flex items-center gap-4">
          <button
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="pagination-btn dark:text-white cursor-pointer"
            
          >
            Previous
          </button>
          <span className="dark:text-white">
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="pagination-btn dark:text-white cursor-pointer"
          >
            Next
          </button>
        </div>
      </div>

      {/* Feedback List */}
      <div className="grid gap-6">
        {currentFeedbacks.length === 0 ? (
          <p className="text-center text-gray-500">No feedback found</p>
        ) : (
          currentFeedbacks.map((feedback) => (
            <div key={feedback._id} className="card">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
                    {feedback.user.fullname}
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {new Date(feedback.createdAt).toLocaleDateString()}
                    <span className="ml-2 text-gray-400">
                      ({feedback.reason})
                    </span>
                  </p>
                </div>
                <div className="flex flex-col items-center">
                  <div className="flex">
                    {[...Array(5)].map((_, index) => (
                      <span
                        key={index}
                        className={`text-xl ${
                          index < feedback.rating
                            ? "text-yellow-400"
                            : "text-gray-300 dark:text-gray-600"
                        }`}
                      >
                        ★
                      </span>
                    ))}
                  </div>
                  {/* Delete Icon Below Rating */}
                  <button
                    className="mt-3 text-red-500 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300"
                    onClick={() => handleDelete(feedback._id)}
                  >
                    <FaTrash size={18} />
                  </button>
                </div>
              </div>
              <p className="text-gray-700 dark:text-gray-300">
                {feedback.description}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default Feedback;
