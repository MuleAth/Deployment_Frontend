import { Link, useLocation } from "react-router-dom";
import {
  FaUsers,
  FaCalendarAlt,
  FaDumbbell,
  FaComments,
  FaSun,
  FaMoon,
  FaTachometerAlt,
  FaGraduationCap,

} from "react-icons/fa";

function Sidebar({ darkMode, setDarkMode }) {
  const location = useLocation();

  const menuItems = [
    { path: "/admin", icon: FaTachometerAlt, label: "Dashboard" },
    { path: "/admin/users", icon: FaUsers, label: "Users" },
    { path: "/admin/departments", icon: FaGraduationCap, label: "Departmentwise Users" },
    { path: "/admin/events", icon: FaCalendarAlt, label: "Events" },
    { path: "/admin/equipment", icon: FaDumbbell, label: "Equipment" },

    { path: "/admin/feedback", icon: FaComments, label: "Feedback" },
  ];

  return (
    <div className="fixed w-64 h-screen bg-white dark:bg-gray-800 border-r dark:border-gray-700">
      <div className="p-6">
        <a href="/admin">
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
            Sports Admin
          </h1>
        </a>
      </div>

      <nav className="mt-6">
        {menuItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`flex items-center px-6 py-3 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 ${
              location.pathname === item.path
                ? "bg-gray-100 dark:bg-gray-700"
                : ""
            }`}
          >
            <item.icon className="sidebar-icon" />
            <span className="ml-3">{item.label}</span>
          </Link>
        ))}
      </nav>

      <div className="absolute bottom-0 w-full p-6">
        <button
          onClick={() => setDarkMode(!darkMode)}
          className="flex items-center justify-center w-full px-4 py-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
        >
          {darkMode ? (
            <FaSun className="text-xl" />
          ) : (
            <FaMoon className="text-xl" />
          )}
          <span className="ml-2">{darkMode ? "Light Mode" : "Dark Mode"}</span>
        </button>
      </div>
    </div>
  );
}

export default Sidebar;
