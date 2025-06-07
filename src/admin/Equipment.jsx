import { useState, useEffect } from "react";
import { FaCheck, FaTimes, FaSearch, FaFilter, FaSyncAlt } from "react-icons/fa";
import { MdSportsHandball } from "react-icons/md";
import InventorySection from "./admin-components/InventorySection";

function Equipment() {
  const [requests, setRequests] = useState([]);
  const [loadingRequests, setLoadingRequests] = useState(false);
  const [requestError, setRequestError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        setLoadingRequests(true);
        const response = await fetch(
          "http://localhost:5000/api/admin/equipment/getAllRequest"
        );
        if (!response.ok) {
          throw new Error("Failed to fetch requests");
        }
        const result = await response.json();

        if (!result.success || !Array.isArray(result.requests)) {
          throw new Error("Unexpected response format");
        }

        const mappedRequests = result.requests.map((req) => {
          const status =
            req.isAcceptedByAdmin === undefined
              ? ""
              : req.isAcceptedByAdmin
              ? "Accepted"
              : "Rejected";

          // Convert request date to DD-MM format
          const formattedDate = req.createdAt
            ? new Date(req.createdAt).toLocaleDateString("en-GB", {
                day: "2-digit",
                month: "2-digit",
              })
            : "N/A";

          return {
            id: req._id,
            student: req.user.fullname,
            mobile_no: req.user.mobile_number,
            item: req.equipment.equipmentname,
            status,
            action: req.isAcceptedByAdmin === undefined ? "Action Pending" : "",
            requestDate: formattedDate, // Add formatted date
          };
        });

        setRequests(mappedRequests);
        setRequestError(null);
      } catch (error) {
        setRequestError(error.message);
      } finally {
        setLoadingRequests(false);
      }
    };
    fetchRequests();
  }, []);

  const handleAccept = async (id) => {
    // Ask for confirmation before accepting
    const confirmAccept = window.confirm(
      "Are you sure you want to accept this request?"
    );
    if (!confirmAccept) return;

    try {
      const response = await fetch(
        `http://localhost:5000/api/admin/equipment/accept-request/${id}`,
        {
          method: "PUT",
        }
      );

      const result = await response.json();
      if (response.ok) {
        // Update request status locally after acceptance
        setRequests(
          requests.map((req) =>
            req.id === id ? { ...req, status: "Accepted", action: "" } : req
          )
        );
      } else {
        alert(result.message || "Error accepting request");
      }
    } catch (error) {
      alert("Error accepting request");
    }
  };

  const handleReject = async (id) => {
    // Ask for confirmation before rejecting
    const confirmReject = window.confirm(
      "Are you sure you want to reject this request?"
    );
    if (!confirmReject) return;

    try {
      const response = await fetch(
        `http://localhost:5000/api/admin/equipment/reject-request/${id}`,
        {
          method: "PUT",
        }
      );

      const result = await response.json();
      if (response.ok) {
        // Update request status locally after rejection
        setRequests(
          requests.map((req) =>
            req.id === id ? { ...req, status: "Rejected", action: "" } : req
          )
        );
      } else {
        alert(result.message || "Error rejecting request");
      }
    } catch (error) {
      alert("Error rejecting request");
    }
  };

  // Filter requests based on search term and status filter
  const filteredRequests = requests.filter(request => {
    const matchesSearch =
      request.student.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.item.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.mobile_no.includes(searchTerm);

    const matchesFilter =
      filterStatus === "all" ||
      (filterStatus === "pending" && request.status === "") ||
      request.status.toLowerCase() === filterStatus.toLowerCase();

    return matchesSearch && matchesFilter;
  });

  // Function to refresh requests
  const refreshRequests = async () => {
    try {
      setLoadingRequests(true);
      const response = await fetch(
        "http://localhost:5000/api/admin/equipment/getAllRequest"
      );
      if (!response.ok) {
        throw new Error("Failed to fetch requests");
      }
      const result = await response.json();

      if (!result.success || !Array.isArray(result.requests)) {
        throw new Error("Unexpected response format");
      }

      const mappedRequests = result.requests.map((req) => {
        const status =
          req.isAcceptedByAdmin === undefined
            ? ""
            : req.isAcceptedByAdmin
            ? "Accepted"
            : "Rejected";

        const formattedDate = req.createdAt
          ? new Date(req.createdAt).toLocaleDateString("en-GB", {
              day: "2-digit",
              month: "2-digit",
            })
          : "N/A";

        return {
          id: req._id,
          student: req.user.fullname,
          mobile_no: req.user.mobile_number,
          item: req.equipment.equipmentname,
          status,
          action: req.isAcceptedByAdmin === undefined ? "Action Pending" : "",
          requestDate: formattedDate,
        };
      });

      setRequests(mappedRequests);
      setRequestError(null);
    } catch (error) {
      setRequestError(error.message);
    } finally {
      setLoadingRequests(false);
    }
  };

  return (
    <div className="content-area relative">
      <h1 className="page-title flex items-center">
        <MdSportsHandball className="mr-2 text-blue-500" size={28} />
        Equipment Management
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-[62%_33%] gap-6 items-start">
        <div className="card bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden">
          <div className="p-5 border-b border-gray-200 dark:border-gray-700">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <h2 className="text-xl font-bold text-gray-800 dark:text-white">
                Equipment Requests
              </h2>

              <div className="flex items-center gap-2">
                <button
                  onClick={refreshRequests}
                  className="p-2 bg-blue-50 text-blue-600 rounded-full hover:bg-blue-100 transition-colors dark:bg-blue-900/30 dark:text-blue-400"
                  title="Refresh requests"
                >
                  <FaSyncAlt className={loadingRequests ? "animate-spin" : ""} />
                </button>

                <div className="relative">
                  <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search requests..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-9 pr-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-full sm:w-auto"
                  />
                </div>

                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="p-2 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="all">All Status</option>
                  <option value="pending">Pending</option>
                  <option value="accepted">Accepted</option>
                  <option value="rejected">Rejected</option>
                </select>
              </div>
            </div>
          </div>

          {loadingRequests ? (
            <div className="p-8 flex justify-center">
              <div className="animate-pulse flex flex-col items-center">
                <div className="h-12 w-12 rounded-full bg-blue-200 dark:bg-blue-700 mb-4"></div>
                <div className="h-4 w-36 bg-gray-200 dark:bg-gray-700 rounded"></div>
              </div>
            </div>
          ) : requestError ? (
            <div className="p-6 bg-red-50 dark:bg-red-900/20 text-center rounded-lg m-4">
              <p className="text-red-500 dark:text-red-400 font-medium">{requestError}</p>
              <button
                onClick={refreshRequests}
                className="mt-2 px-4 py-2 bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300 rounded-lg hover:bg-red-200 dark:hover:bg-red-800 transition-colors"
              >
                Try Again
              </button>
            </div>
          ) : filteredRequests.length === 0 ? (
            <div className="p-8 text-center text-gray-500 dark:text-gray-400">
              <p>No equipment requests found matching your criteria.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 dark:bg-gray-700">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Student
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Mobile No.
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Item
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y dark:divide-gray-700">
                  {filteredRequests.map((request) => (
                    <tr
                      key={request.id}
                      className="hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors"
                    >
                      <td className="px-4 py-3 text-sm font-medium text-gray-800 dark:text-gray-300">
                        {request.student}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-800 dark:text-gray-300">
                        {request.mobile_no}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-800 dark:text-gray-300">
                        <span className="flex items-center">
                          <MdSportsHandball className="mr-2 text-blue-500" />
                          {request.item}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-800 dark:text-gray-300">
                        {request.requestDate}
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`px-3 py-1 inline-flex items-center justify-center rounded-full text-xs font-medium ${
                            request.status === "Accepted"
                              ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                              : request.status === "Rejected"
                              ? "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                              : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
                          }`}
                        >
                          {request.status || "Pending"}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        {request.action ? (
                          <div className="flex space-x-2">
                            <button
                              onClick={() => handleAccept(request.id)}
                              className="p-2 rounded-full bg-green-50 text-green-600 hover:bg-green-100 hover:text-green-700 dark:bg-green-900/30 dark:text-green-400 dark:hover:bg-green-800 transition-colors"
                              title="Accept Request"
                            >
                              <FaCheck />
                            </button>
                            <button
                              onClick={() => handleReject(request.id)}
                              className="p-2 rounded-full bg-red-50 text-red-600 hover:bg-red-100 hover:text-red-700 dark:bg-red-900/30 dark:text-red-400 dark:hover:bg-red-800 transition-colors"
                              title="Reject Request"
                            >
                              <FaTimes />
                            </button>
                          </div>
                        ) : (
                          <span className="text-sm text-gray-500 dark:text-gray-400">
                            {request.status ? "Processed" : ""}
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Request count summary */}
          {!loadingRequests && !requestError && filteredRequests.length > 0 && (
            <div className="p-4 border-t border-gray-200 dark:border-gray-700 text-sm text-gray-500 dark:text-gray-400 flex justify-between items-center">
              <div>
                Showing {filteredRequests.length} of {requests.length} requests
              </div>
              <div className="flex space-x-3">
                <span className="flex items-center">
                  <span className="w-2 h-2 rounded-full bg-yellow-400 mr-1"></span>
                  Pending: {requests.filter(r => !r.status).length}
                </span>
                <span className="flex items-center">
                  <span className="w-2 h-2 rounded-full bg-green-400 mr-1"></span>
                  Accepted: {requests.filter(r => r.status === "Accepted").length}
                </span>
                <span className="flex items-center">
                  <span className="w-2 h-2 rounded-full bg-red-400 mr-1"></span>
                  Rejected: {requests.filter(r => r.status === "Rejected").length}
                </span>
              </div>
            </div>
          )}
        </div>
        <InventorySection />
      </div>
    </div>
  );
}

export default Equipment;
