import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaSearch, FaTrash, FaCheck, FaUser, FaFilter, FaChevronLeft, FaChevronRight, FaFilePdf, FaDownload } from "react-icons/fa";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import jsPDF from 'jspdf';
import 'jspdf-autotable';

// Custom CSS for animations
const styles = {
  fadeIn: {
    animation: 'fadeIn 0.3s ease-in-out'
  }
};

function Users() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    user_type: "",
    department: "",
    year: "",
  });

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const queryParams = new URLSearchParams({
        page,
        limit,
        ...filters,
      }).toString();

      const response = await fetch(
        `https://sportalon-backend.onrender.com/api/admin/users/getAllUsers?${queryParams}`
      );
      console.log(response);

      if (!response.ok) {
        throw new Error("No User Found!!");
      }

      const data = await response.json();
      console.log(data);

      // Sort users: Not approved users first
      const sortedUsers = data.users.sort(
        (a, b) => a.isVerifiedByAdmin - b.isVerifiedByAdmin
      );

      setUsers(sortedUsers);
      setTotalPages(data.pagination.totalPages);
      setError(null);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [page, limit, filters]);

  // Add animation styles
  useEffect(() => {
    const fadeInKeyframes = `
      @keyframes fadeIn {
        from { opacity: 0; transform: translateY(-10px); }
        to { opacity: 1; transform: translateY(0); }
      }
    `;

    const styleSheet = document.createElement("style");
    styleSheet.type = "text/css";
    styleSheet.innerText = fadeInKeyframes;
    document.head.appendChild(styleSheet);

    return () => {
      // Clean up on unmount
      if (styleSheet && document.head.contains(styleSheet)) {
        document.head.removeChild(styleSheet);
      }
    };
  }, []);

  const filteredUsers = users.filter((user) =>
    user.fullname.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Handle delete
  const handleDelete = async (e, userId) => {
    e.stopPropagation();
    if (window.confirm("Are you sure you want to delete this user?")) {
      try {
        const response = await fetch(
          `https://sportalon-backend.onrender.com/api/admin/users/deleteUser/${userId}`,
          {
            method: "DELETE",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        if (!response.ok) {
          console.log(response);
          throw new Error("Failed to delete user");
        }
        if (response) {
          fetchUsers();
        }
      } catch (error) {
        setError(error.message);
      }
    }
  };

  const handleUserClick = (userId) => {
    navigate(`/admin/users/${userId}`);
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prevFilters) => ({
      ...prevFilters,
      [name]: value,
    }));
    setPage(1);
  };

  const handleApprove = async (e, userId) => {
    if (window.confirm("Are you sure you Approve this user?")) {
      e.stopPropagation();
      try {
        const response = await fetch(
          `https://sportalon-backend.onrender.com/api/admin/users/approveUser/${userId}`,
          {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        if (!response.ok) {
          throw new Error("Failed to approve user");
        }
        if (response) {
          fetchUsers();
          toast.success("User approved successfully!");
        }
      } catch (error) {
        setError(error.message);
        toast.error("Failed to approve user");
      }
    }
  };
  
  // Function to download all users as PDF
  const downloadUsersPDF = async () => {
    try {
      // Show loading toast
      const loadingToast = toast.loading("Generating PDF...");
      
      // Fetch all users without pagination
      const response = await fetch(
        `https://sportalon-backend.onrender.com/api/admin/users/getAllUsers?limit=1000`
      );
      
      if (!response.ok) {
        throw new Error("Failed to fetch users for PDF");
      }
      
      const data = await response.json();
      const allUsers = data.users;
      
      // Create a new PDF document (landscape orientation)
      const doc = new jsPDF({
        orientation: 'landscape',
        unit: 'mm',
        format: 'a4'
      });
      
      // Add college logo or name as header
      doc.setFontSize(22);
      doc.setTextColor(0, 51, 153); // Dark blue
      doc.text("Sinhgad College of Engineering", doc.internal.pageSize.getWidth() / 2, 20, { align: 'center' });
      
      // Add title
      doc.setFontSize(18);
      doc.setTextColor(40, 40, 40);
      doc.text("Users Report", doc.internal.pageSize.getWidth() / 2, 30, { align: 'center' });
      
      // Add generation date
      const date = new Date().toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
      doc.setFontSize(11);
      doc.setTextColor(100, 100, 100);
      doc.text(`Generated on: ${date}`, 14, 40);
      
      // Add statistics
      const verifiedUsers = allUsers.filter(user => user.isVerifiedByAdmin).length;
      const pendingUsers = allUsers.length - verifiedUsers;
      
      doc.setFontSize(11);
      doc.setTextColor(0, 0, 0);
      doc.text(`Total Users: ${allUsers.length}`, 14, 45);
      doc.text(`Verified Users: ${verifiedUsers}`, 14, 50);
      doc.text(`Pending Approval: ${pendingUsers}`, 14, 55);
      
      // Add filter information
      if (filters.department || filters.user_type || filters.year) {
        doc.setFontSize(10);
        doc.setTextColor(100, 100, 100);
        let filterText = "Applied Filters: ";
        if (filters.department) filterText += `Department: ${filters.department}, `;
        if (filters.user_type) filterText += `User Type: ${filters.user_type}, `;
        if (filters.year) filterText += `Year: ${filters.year}, `;
        filterText = filterText.endsWith(", ") ? filterText.slice(0, -2) : filterText;
        doc.text(filterText, doc.internal.pageSize.getWidth() - 14, 40, { align: 'right' });
      }
      
      // Prepare table data
      const tableColumn = ["Name", "Email", "Mobile", "PRN Number", "Department", "Year", "Sports Interest", "User Type", "Status"];
      const tableRows = [];
      
      allUsers.forEach(user => {
        const userData = [
          user.fullname,
          user.email,
          user.mobile_number,
          user.prn_number || 'N/A',
          user.department || 'N/A',
          user.year || 'N/A',
          user.sports_interest || 'N/A',
          user.user_type,
          user.isVerifiedByAdmin ? 'Verified' : 'Pending'
        ];
        tableRows.push(userData);
      });
      
      // Generate the table
      doc.autoTable({
        head: [tableColumn],
        body: tableRows,
        startY: 60,
        styles: {
          fontSize: 8,
          cellPadding: 2,
          lineColor: [200, 200, 200],
          overflow: 'linebreak'
        },
        headStyles: {
          fillColor: [0, 51, 153], // Dark blue
          textColor: [255, 255, 255],
          fontStyle: 'bold',
          halign: 'center'
        },
        alternateRowStyles: {
          fillColor: [240, 245, 255]
        },
        columnStyles: {
          0: { fontStyle: 'bold' },
          1: { cellWidth: 'auto' },
          2: { cellWidth: 'auto' },
          3: { cellWidth: 'auto' },
          4: { cellWidth: 'auto' },
          5: { cellWidth: 'auto' },
          6: { cellWidth: 'auto' },
          7: { cellWidth: 'auto' },
          8: { 
            cellWidth: 'auto',
            cellCallback: function(cell, data) {
              if (data.text === 'Verified') {
                cell.styles.textColor = [0, 128, 0]; // Green for verified
                cell.styles.fontStyle = 'bold';
              } else {
                cell.styles.textColor = [255, 128, 0]; // Orange for pending
                cell.styles.fontStyle = 'bold';
              }
            }
          }
        },
        didDrawPage: function(data) {
          // Footer with page numbers
          const pageCount = doc.internal.getNumberOfPages();
          const str = `Page ${doc.internal.getCurrentPageInfo().pageNumber} of ${pageCount}`;
          doc.setFontSize(8);
          doc.text(str, doc.internal.pageSize.getWidth() - 10, doc.internal.pageSize.getHeight() - 10, { align: 'right' });
          
          // Add a footer with college name
          doc.setFontSize(8);
          doc.setTextColor(100, 100, 100);
          doc.text('Sinhgad College of Engineering - Sports Department', doc.internal.pageSize.getWidth() / 2, doc.internal.pageSize.getHeight() - 10, { align: 'center' });
        },
        margin: { top: 10, right: 10, bottom: 15, left: 10 },
        tableWidth: 'auto',
        horizontalPageBreak: true,
        didParseCell: function(data) {
          // Customize specific columns
          if (data.section === 'head') {
            data.cell.styles.fillColor = [0, 51, 153];
          }
        }
      });
      
      // Generate a filename with date
      const today = new Date();
      const formattedDate = today.toISOString().slice(0, 10); // YYYY-MM-DD
      const filename = `users-report-${formattedDate}.pdf`;
      
      // Save the PDF
      doc.save(filename);
      
      // Update toast
      toast.update(loadingToast, { 
        render: "PDF downloaded successfully!", 
        type: "success", 
        isLoading: false,
        autoClose: 3000
      });
      
    } catch (error) {
      console.error("Error generating PDF:", error);
      toast.error("Failed to generate PDF. Please try again.");
    }
  };

  return (
    <div className="content-area bg-gray-50 dark:bg-gray-800 min-h-screen p-6">
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} newestOnTop closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover />

      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white flex items-center">
          <FaUser className="mr-3 text-blue-500" /> Users Management
        </h1>
        <div className="flex items-center gap-4">
          <button
            onClick={downloadUsersPDF}
            className="flex items-center gap-2 px-4 py-2.5 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
            title="Download a PDF report of all users"
          >
            <FaFilePdf className="text-lg" /> <span className="font-medium">Download Users PDF</span>
          </button>
          <div className="text-sm text-gray-500 dark:text-gray-400">
            Total Users: {users.length}
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-900 rounded-lg shadow-md p-6 transition-all duration-300 hover:shadow-lg">
        {/* Search and Filter Bar */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
          <div className="relative w-full md:w-1/2">
            <FaSearch className="absolute left-3 top-3 text-gray-400" />
            <input
              type="text"
              placeholder="Search users by name..."
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white transition-all duration-300"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-all duration-300"
          >
            <FaFilter /> {showFilters ? 'Hide Filters' : 'Show Filters'}
          </button>
        </div>

        {/* Expandable Filters */}
        {showFilters && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg" style={styles.fadeIn}>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">User Type</label>
              <select
                name="user_type"
                value={filters.user_type}
                onChange={handleFilterChange}
                className="w-full p-2 rounded-lg border border-gray-300 dark:border-gray-700 cursor-pointer dark:bg-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All User Types</option>
                <option value="student">Student</option>
                <option value="admin">Admin</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Department</label>
              <select
                name="department"
                value={filters.department}
                onChange={handleFilterChange}
                className="w-full p-2 rounded-lg border border-gray-300 dark:border-gray-700 cursor-pointer dark:bg-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All Departments</option>
                <option value="IT">IT</option>
                <option value="CS">CS</option>
                <option value="EnTC">EnTC</option>
                <option value="Mech">Mech</option>
                <option value="Biotech">Biotech</option>
                <option value="Civil">Civil</option>
                <option value="Electrical">Electrical</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Year</label>
              <select
                name="year"
                value={filters.year}
                onChange={handleFilterChange}
                className="w-full p-2 rounded-lg border border-gray-300 dark:border-gray-700 cursor-pointer dark:bg-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All Years</option>
                <option value="FE">FE</option>
                <option value="SE">SE</option>
                <option value="TE">TE</option>
                <option value="BE">BE</option>
              </select>
            </div>
          </div>
        )}

        {/* Loading and Error States */}
        {loading && (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        )}

        {error && (
          <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded">
            <p className="font-bold">Error</p>
            <p>{error}</p>
          </div>
        )}

        {/* Users Table */}
        {!loading && !error && (
          <>
            <div className="overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-700">
              <table className="w-full">
                <thead className="bg-gray-100 dark:bg-gray-700">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Email
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Mobile Number
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      User Type
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700 bg-white dark:bg-gray-800">
                  {filteredUsers.length === 0 ? (
                    <tr>
                      <td colSpan="6" className="px-6 py-10 text-center text-gray-500 dark:text-gray-400">
                        No users found matching your criteria
                      </td>
                    </tr>
                  ) : (
                    filteredUsers.map((user) => (
                      <tr
                        key={user._id}
                        className="hover:bg-blue-50 dark:hover:bg-gray-700 cursor-pointer transition-colors duration-150"
                        onClick={() => handleUserClick(user._id)}
                      >
                        <td className="px-6 py-4 whitespace-nowrap text-gray-800 dark:text-gray-300">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-8 w-8 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center text-blue-500">
                              {user.fullname.charAt(0).toUpperCase()}
                            </div>
                            <div className="ml-4">
                              {user.fullname}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-gray-800 dark:text-gray-300">
                          {user.email}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-gray-800 dark:text-gray-300">
                          {user.mobile_number}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full
                            ${user.user_type === 'admin' ? 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200' : 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'}`}>
                            {user.user_type}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full
                            ${user.isVerifiedByAdmin ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'}`}>
                            {user.isVerifiedByAdmin ? 'Verified' : 'Pending'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex space-x-2">
                            {!user.isVerifiedByAdmin && (
                              <button
                                onClick={(e) => handleApprove(e, user._id)}
                                className="text-green-600 hover:text-green-900 bg-green-100 hover:bg-green-200 dark:bg-green-900 dark:hover:bg-green-800 dark:text-green-200 p-2 rounded-full transition-colors duration-300"
                                title="Approve User"
                              >
                                <FaCheck />
                              </button>
                            )}
                            <button
                              onClick={(e) => handleDelete(e, user._id)}
                              className="text-red-600 hover:text-red-900 bg-red-100 hover:bg-red-200 dark:bg-red-900 dark:hover:bg-red-800 dark:text-red-200 p-2 rounded-full transition-colors duration-300"
                              title="Delete User"
                            >
                              <FaTrash />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="flex justify-between items-center mt-6 bg-white dark:bg-gray-900 p-3 rounded-lg shadow">
              <button
                onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                disabled={page === 1}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-300 ${
                  page === 1
                    ? 'bg-gray-200 text-gray-500 cursor-not-allowed dark:bg-gray-700 dark:text-gray-400'
                    : 'bg-blue-500 text-white hover:bg-blue-600'
                }`}
              >
                <FaChevronLeft size={14} /> Previous
              </button>

              <div className="flex items-center gap-2">
                <span className="text-gray-700 dark:text-gray-300">
                  Page {page} of {totalPages}
                </span>
                <select
                  value={limit}
                  onChange={(e) => {
                    setLimit(Number(e.target.value));
                    setPage(1);
                  }}
                  className="ml-4 p-1 border border-gray-300 dark:border-gray-700 rounded dark:bg-gray-800 dark:text-white"
                >
                  <option value={5}>5 per page</option>
                  <option value={10}>10 per page</option>
                  <option value={20}>20 per page</option>
                  <option value={50}>50 per page</option>
                </select>
              </div>

              <button
                onClick={() => setPage((prev) => prev + 1)}
                disabled={page === totalPages}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-300 ${
                  page === totalPages
                    ? 'bg-gray-200 text-gray-500 cursor-not-allowed dark:bg-gray-700 dark:text-gray-400'
                    : 'bg-blue-500 text-white hover:bg-blue-600'
                }`}
              >
                Next <FaChevronRight size={14} />
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default Users;
