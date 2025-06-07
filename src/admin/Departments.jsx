import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaUsers, FaGraduationCap, FaChevronRight } from "react-icons/fa";

function Departments() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [departmentStats, setDepartmentStats] = useState({});

  // Department data with codes and full names
  const departments = [
    { code: "IT", name: "Information Technology", color: "bg-blue-500", icon: "💻" },
    { code: "CS", name: "Computer Engineering", color: "bg-indigo-500", icon: "🖥️" },
    { code: "EnTC", name: "Electronics & Telecommunication Engineering", color: "bg-purple-500", icon: "📡" },
    { code: "Mech", name: "Mechanical Engineering", color: "bg-green-500", icon: "⚙️" },
    { code: "Biotech", name: "Bio-Technology", color: "bg-teal-500", icon: "🧬" },
    { code: "Civil", name: "Civil Engineering", color: "bg-yellow-500", icon: "🏗️" },
    { code: "Electrical", name: "Production Engineering", color: "bg-red-500", icon: "⚡" },
    { code: "Chemical", name: "Chemical Engineering", color: "bg-orange-500", icon: "🧪" }
  ];

  // Fetch department statistics
  const fetchDepartmentStats = async () => {
    setLoading(true);
    try {
      const stats = {};
      
      // Fetch user counts for each department
      for (const dept of departments) {
        const queryParams = new URLSearchParams({
          department: dept.code
        }).toString();
        
        const response = await fetch(
          `http://localhost:5000/api/admin/users/getAllUsers?${queryParams}`
        );
        
        if (response.ok) {
          const data = await response.json();
          stats[dept.code] = data.pagination.totalUsers;
        }
      }
      
      setDepartmentStats(stats);
    } catch (error) {
      console.error("Error fetching department statistics:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDepartmentStats();
  }, []);

  const handleDepartmentClick = (deptCode) => {
    navigate(`/admin/departments/${deptCode}`);
  };

  return (
    <div className="content-area p-6">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white flex items-center">
          <FaGraduationCap className="mr-3 text-blue-500" /> Departmentwise Users
        </h1>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {departments.map((dept) => (
            <div
              key={dept.code}
              onClick={() => handleDepartmentClick(dept.code)}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden cursor-pointer transition-all duration-300 hover:shadow-lg transform hover:-translate-y-1 border border-gray-200 dark:border-gray-700"
            >
              <div className={`${dept.color} h-2`}></div>
              <div className="p-6">
                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <div className="text-3xl mr-4">{dept.icon}</div>
                    <div>
                      <h3 className="text-xl font-semibold text-gray-800 dark:text-white">{dept.name}</h3>
                      <p className="text-gray-500 dark:text-gray-400 text-sm">Department Code: {dept.code}</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <div className="bg-blue-100 dark:bg-blue-900 rounded-full px-3 py-1 text-blue-800 dark:text-blue-200 font-medium text-sm flex items-center">
                      <FaUsers className="mr-1" />
                      {departmentStats[dept.code] || 0}
                    </div>
                  </div>
                </div>
                <div className="mt-4 flex justify-end">
                  <button className="text-blue-500 hover:text-blue-700 flex items-center text-sm font-medium">
                    View Users <FaChevronRight className="ml-1" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Departments;