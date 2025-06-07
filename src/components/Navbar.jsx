import React from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Menu,
  X,
  Trophy,
  Calendar,
  UserCircle,
  Dumbbell,
  Medal,
  ChevronDown,
  Star,
} from "lucide-react";
import { useSelector, useDispatch } from "react-redux";


const Navbar = () => {
  const [isOpen, setIsOpen] = React.useState(false);
  const location = useLocation();

  const userType = useSelector((state) => state.auth.user_type);

  const isActive = (path) => {
    return location.pathname === path;
  };

  const [dropdownOpen, setDropdownOpen] = React.useState(false);
  
  return (
    <nav className="bg-indigo-950 text-white fixed w-full z-50 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <Link to="/" className="flex items-center">
            <div className="relative">
              <Trophy className="h-12 w-12 text-indigo-300" />
            </div>
            <div className="flex flex-col ml-2">
              <span className="text-2xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-indigo-300 to-white">Sportalon</span>
              <span className="text-xs font-medium text-indigo-300 tracking-wide">Connect, Compete, Conquer</span>
            </div>
          </Link>

          <div className="hidden md:block">
            <div className="ml-10 flex items-center space-x-6">
              <Link
                to="/"
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 flex items-center ${
                  isActive("/")
                    ? "bg-indigo-700 text-white shadow-md transform scale-105"
                    : "hover:bg-indigo-800 hover:shadow-md hover:scale-105"
                }`}
              >
                <span className="mr-1">Home</span>
                {isActive("/") && <Star className="h-3 w-3 ml-1" />}
              </Link>
              <Link
                to="/events"
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 flex items-center ${
                  isActive("/events")
                    ? "bg-indigo-700 text-white shadow-md transform scale-105"
                    : "hover:bg-indigo-800 hover:shadow-md hover:scale-105"
                }`}
              >
                <Calendar className="h-4 w-4 mr-1" />
                <span>Events</span>
                {isActive("/events") && <Star className="h-3 w-3 ml-1" />}
              </Link>
              <Link
                to="/equipment-list"
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 flex items-center ${
                  isActive("/equipment")
                    ? "bg-indigo-700 text-white shadow-md transform scale-105"
                    : "hover:bg-indigo-800 hover:shadow-md hover:scale-105"
                }`}
              >
                <Dumbbell className="h-4 w-4 mr-1" />
                <span>Equipment</span>
                {isActive("/equipment") && <Star className="h-3 w-3 ml-1" />}
              </Link>
              <Link
                to="/user/feedback"
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 flex items-center ${
                  isActive("/achievements")
                    ? "bg-indigo-700 text-white shadow-md transform scale-105"
                    : "hover:bg-indigo-800 hover:shadow-md hover:scale-105"
                }`}
              >
                <Medal className="h-4 w-4 mr-1" />
                <span>Achievements</span>
                {isActive("/achievements") && <Star className="h-3 w-3 ml-1" />}
              </Link>
              <Link
                to="/about-us"
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 flex items-center ${
                  isActive("/about-us")
                    ? "bg-indigo-700 text-white shadow-md transform scale-105"
                    : "hover:bg-indigo-800 hover:shadow-md hover:scale-105"
                }`}
              >
                <span>About Us</span>
                {isActive("/about-us") && <Star className="h-3 w-3 ml-1" />}
              </Link>
              {userType !== null && (
                <Link
                  to={userType === "admin" ? "/admin" : "/profile-page"}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 flex items-center ${
                    isActive(userType === "admin" ? "/admin" : "/profile-page")
                      ? "bg-indigo-700 text-white shadow-md transform scale-105"
                      : "hover:bg-indigo-800 hover:shadow-md hover:scale-105"
                  }`}
                >
                  <UserCircle className="h-4 w-4 mr-1" />
                  <span>{userType === "admin" ? "Admin-Dashboard" : "Profile"}</span>
                  {isActive(userType === "admin" ? "/admin" : "/profile-page") && <Star className="h-3 w-3 ml-1" />}
                </Link>
              )}
              

            </div>
          </div>

          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-full hover:bg-indigo-800 transition-all duration-300 hover:shadow-md"
            >
              {isOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {isOpen && (
        <div className="md:hidden">
          <div className="px-4 pt-3 pb-4 space-y-2 sm:px-4 bg-indigo-900 bg-opacity-95 rounded-b-lg shadow-lg">
            <Link
              to="/"
              className={`flex items-center px-4 py-3 rounded-lg text-base font-medium transition-all duration-300 ${
                isActive("/")
                  ? "bg-indigo-700 text-white shadow-inner"
                  : "hover:bg-indigo-800 hover:shadow-md"
              }`}
              onClick={() => setIsOpen(false)}
            >
              <span className="mr-2">Home</span>
              {isActive("/") && <Star className="h-3 w-3" />}
            </Link>
            <Link
              to="/events"
              className={`flex items-center px-4 py-3 rounded-lg text-base font-medium transition-all duration-300 ${
                isActive("/events")
                  ? "bg-indigo-700 text-white shadow-inner"
                  : "hover:bg-indigo-800 hover:shadow-md"
              }`}
              onClick={() => setIsOpen(false)}
            >
              <Calendar className="h-5 w-5 mr-2" />
              <span>Events</span>
              {isActive("/events") && <Star className="h-3 w-3 ml-2" />}
            </Link>
            <Link
              to="/equipment-list"
              className={`flex items-center px-4 py-3 rounded-lg text-base font-medium transition-all duration-300 ${
                isActive("/equipment")
                  ? "bg-indigo-700 text-white shadow-inner"
                  : "hover:bg-indigo-800 hover:shadow-md"
              }`}
              onClick={() => setIsOpen(false)}
            >
              <Dumbbell className="h-5 w-5 mr-2" />
              <span>Equipment</span>
              {isActive("/equipment") && <Star className="h-3 w-3 ml-2" />}
            </Link>
            <Link
              to="/user/feedback"
              className={`flex items-center px-4 py-3 rounded-lg text-base font-medium transition-all duration-300 ${
                isActive("/achievements")
                  ? "bg-indigo-700 text-white shadow-inner"
                  : "hover:bg-indigo-800 hover:shadow-md"
              }`}
              onClick={() => setIsOpen(false)}
            >
              <Medal className="h-5 w-5 mr-2" />
              <span>Achievements</span>
              {isActive("/achievements") && <Star className="h-3 w-3 ml-2" />}
            </Link>
            <Link
              to="/about-us"
              className={`flex items-center px-4 py-3 rounded-lg text-base font-medium transition-all duration-300 ${
                isActive("/about-us")
                  ? "bg-indigo-700 text-white shadow-inner"
                  : "hover:bg-indigo-800 hover:shadow-md"
              }`}
              onClick={() => setIsOpen(false)}
            >
              <span>About Us</span>
              {isActive("/about-us") && <Star className="h-3 w-3 ml-2" />}
            </Link>
            <Link
              to="/profile-page"
              className={`flex items-center px-4 py-3 rounded-lg text-base font-medium transition-all duration-300 ${
                isActive("/profile")
                  ? "bg-indigo-700 text-white shadow-inner"
                  : "hover:bg-indigo-800 hover:shadow-md"
              }`}
              onClick={() => setIsOpen(false)}
            >
              <UserCircle className="h-5 w-5 mr-2" />
              <span>Profile</span>
              {isActive("/profile") && <Star className="h-3 w-3 ml-2" />}
            </Link>
            

          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
