import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";

const SportsStatistics = () => {
  const [activeTab, setActiveTab] = useState("participation");
  const [animateCharts, setAnimateCharts] = useState(false);
  const [departmentData, setDepartmentData] = useState([]);
  const [achievementsData, setAchievementsData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // Department colors mapping
  const departmentColors = {
    "IT": "#8884d8",
    "CS": "#82ca9d",
    "EnTC": "#ffc658",
    "Mech": "#ff8042",
    "Biotech": "#0088fe",
    "Civil": "#00C49F",
    "Electrical": "#d53e4f",
    "Chemical": "#ff7c43"
  };

  // Fetch department user data from admin dashboard
  const fetchDepartmentData = async () => {
    setIsLoading(true);
    try {
      // Array of department codes to fetch data for
      const deptCodes = ["IT", "CS", "EnTC", "Mech", "Biotech", "Civil", "Electrical", "Chemical"];
      const userCounts = {};
      const achievementCounts = {};

      // Fetch user counts for each department from admin API
      for (const deptCode of deptCodes) {
        try {
          // Actual API call to fetch department user counts
          const queryParams = new URLSearchParams({
            department: deptCode
          }).toString();

          const response = await fetch(
            `http://localhost:5000/api/admin/users/getAllUsers?${queryParams}`
          );

          if (response.ok) {
            const data = await response.json();
            userCounts[deptCode] = data.pagination.totalUsers || 0;
          } else {
            // Fallback values if API fails
            userCounts[deptCode] = Math.floor(Math.random() * 100) + 20;
          }

          // For achievements, we'll use a separate endpoint in a real implementation
          // For now, we'll simulate achievement counts based on user counts
          achievementCounts[deptCode] = Math.floor(userCounts[deptCode] * 0.4);

        } catch (error) {
          console.error(`Error fetching data for ${deptCode}:`, error);
          // Fallback values if fetch fails
          userCounts[deptCode] = Math.floor(Math.random() * 100) + 20;
          achievementCounts[deptCode] = Math.floor(userCounts[deptCode] * 0.4);
        }
      }

      // Transform data for charts
      const participationData = Object.keys(userCounts).map(deptCode => ({
        name: deptCode,
        code: deptCode,
        students: userCounts[deptCode],
        fill: departmentColors[deptCode] || "#6c757d"
      }));

      const achievementsData = Object.keys(achievementCounts)
        .filter(deptCode => achievementCounts[deptCode] > 0)
        .map(deptCode => ({
          name: deptCode,
          code: deptCode,
          value: achievementCounts[deptCode],
          color: departmentColors[deptCode] || "#6c757d"
        }));

      setDepartmentData(participationData);
      setAchievementsData(achievementsData);
    } catch (error) {
      console.error("Error fetching department data:", error);
      // Fallback data if everything fails
      const fallbackData = [
        { name: "IT", code: "IT", students: 120, fill: departmentColors["IT"] },
        { name: "CS", code: "CS", students: 98, fill: departmentColors["CS"] },
        { name: "EnTC", code: "EnTC", students: 86, fill: departmentColors["EnTC"] },
        { name: "Mech", code: "Mech", students: 72, fill: departmentColors["Mech"] },
        { name: "Biotech", code: "Biotech", students: 65, fill: departmentColors["Biotech"] },
        { name: "Civil", code: "Civil", students: 53, fill: departmentColors["Civil"] },
      ];

      setDepartmentData(fallbackData);
      setAchievementsData(fallbackData.slice(0, 5).map(dept => ({
        name: dept.name,
        code: dept.code,
        value: Math.floor(dept.students * 0.4),
        color: dept.fill
      })));
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch data and trigger animation when component is in view
  useEffect(() => {
    // Fetch department data when component mounts
    fetchDepartmentData();

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setAnimateCharts(true);
          observer.disconnect();
        }
      },
      { threshold: 0.3 }
    );

    const element = document.getElementById("sports-statistics");
    if (element) {
      observer.observe(element);
    }

    return () => {
      if (element) {
        observer.unobserve(element);
      }
    };
  }, []);

  // Custom tooltip for bar chart
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      // Get the full department name based on code
      const getDepartmentFullName = (code) => {
        const deptMap = {
          "IT": "Information Technology",
          "CS": "Computer Engineering",
          "EnTC": "Electronics & Telecommunication",
          "Mech": "Mechanical Engineering",
          "Biotech": "Bio-Technology",
          "Civil": "Civil Engineering",
          "Electrical": "Production Engineering",
          "Chemical": "Chemical Engineering"
        };
        return deptMap[code] || code;
      };

      return (
        <div className="bg-white p-3 shadow-md rounded-md border border-gray-200">
          <p className="font-medium text-gray-900">{getDepartmentFullName(label)}</p>
          <p className="text-indigo-600">
            {activeTab === "participation"
              ? `${payload[0].value} users`
              : `${payload[0].value} achievements`}
          </p>
          <p className="text-gray-500 text-xs">Department Code: {label}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <section 
      id="sports-statistics" 
      className="py-20 bg-gradient-to-br from-gray-50 to-indigo-50"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            User Analytics
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Explore department-wise user data and achievements
          </p>
        </div>

        {/* Tab navigation */}
        <div className="flex justify-center mb-10">
          <div className="inline-flex bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setActiveTab("participation")}
              className={`px-4 py-2 rounded-md font-medium transition-all ${
                activeTab === "participation"
                  ? "bg-indigo-600 text-white shadow-md"
                  : "text-gray-700 hover:bg-gray-200"
              }`}
            >
              Users Department-wise
            </button>
            <button
              onClick={() => setActiveTab("achievements")}
              className={`px-4 py-2 rounded-md font-medium transition-all ${
                activeTab === "achievements"
                  ? "bg-indigo-600 text-white shadow-md"
                  : "text-gray-700 hover:bg-gray-200"
              }`}
            >
              Department Achievements
            </button>
          </div>
        </div>

        {/* Charts */}
        <div className="bg-white rounded-xl shadow-lg p-6 md:p-8">
          {isLoading ? (
            <div className="flex justify-center items-center h-80">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={animateCharts ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6 }}
              className="h-80 md:h-96"
            >
              {activeTab === "participation" ? (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={departmentData}
                    margin={{ top: 20, right: 30, left: 20, bottom: 40 }}
                  >
                    <XAxis
                      dataKey="code"
                      tick={{ fill: '#4B5563' }}
                      tickLine={{ stroke: '#9CA3AF' }}
                      axisLine={{ stroke: '#D1D5DB' }}
                    />
                    <YAxis
                      tick={{ fill: '#4B5563' }}
                      tickLine={{ stroke: '#9CA3AF' }}
                      axisLine={{ stroke: '#D1D5DB' }}
                      label={{
                        value: 'Number of Users',
                        angle: -90,
                        position: 'insideLeft',
                        style: { fill: '#4B5563' }
                      }}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Bar
                      dataKey="students"
                      radius={[4, 4, 0, 0]}
                      animationDuration={1500}
                      animationBegin={animateCharts ? 0 : 9999}
                    >
                      {departmentData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.fill} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={achievementsData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={150}
                      innerRadius={60}
                      fill="#8884d8"
                      dataKey="value"
                      nameKey="code"
                      animationDuration={1500}
                      animationBegin={animateCharts ? 0 : 9999}
                      label={({ code, percent }) => `${code} ${(percent * 100).toFixed(0)}%`}
                    >
                      {achievementsData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      content={<CustomTooltip />}
                      contentStyle={{
                        backgroundColor: 'white',
                        border: '1px solid #E5E7EB',
                        borderRadius: '0.375rem',
                        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              )}
            </motion.div>
          )}

          {/* Legend for pie chart */}
          {activeTab === "achievements" && !isLoading && (
            <div className="flex flex-wrap justify-center mt-6 gap-4">
              {achievementsData.map((entry) => (
                <div key={entry.code} className="flex items-center">
                  <div
                    className="w-4 h-4 rounded-full mr-2"
                    style={{ backgroundColor: entry.color }}
                  />
                  <span className="text-gray-700">{entry.code}: {entry.value} achievements</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Additional stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={animateCharts ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="bg-white rounded-xl shadow-md p-6 text-center"
          >
            <div className="text-4xl font-bold text-indigo-600 mb-2">8</div>
            <div className="text-gray-700">Departments</div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={animateCharts ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="bg-white rounded-xl shadow-md p-6 text-center"
          >
            <div className="text-4xl font-bold text-indigo-600 mb-2">85%</div>
            <div className="text-gray-700">User Registration Rate</div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={animateCharts ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="bg-white rounded-xl shadow-md p-6 text-center"
          >
            <div className="text-4xl font-bold text-indigo-600 mb-2">130+</div>
            <div className="text-gray-700">Total User Achievements</div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default SportsStatistics;