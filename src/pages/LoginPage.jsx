import React, { useState, useEffect } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { setAuth } from "../redux-store/authSlice";
import { useNavigate, Link, useSearchParams } from "react-router-dom";
import { ArrowRight } from "lucide-react";

const LoginPage = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showRegisterPopup, setShowRegisterPopup] = useState(true);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirectUrl = searchParams.get('redirect');

  // Get token from Redux state
  const token = useSelector((state) => state.auth.token);

  useEffect(() => {
    if (token) {
      // If there's a redirect URL, go there, otherwise go to homepage
      if (redirectUrl) {
        navigate(redirectUrl);
      } else {
        navigate("/");
      }
    }
  }, [token, navigate, redirectUrl]);
  
  // Auto-hide the register popup after 15 seconds
  useEffect(() => {
    if (showRegisterPopup) {
      const timer = setTimeout(() => {
        setShowRegisterPopup(false);
      }, 15000);
      
      return () => clearTimeout(timer);
    }
  }, [showRegisterPopup]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null); // Reset error state before login attempt
    setLoading(true);

    try {
      const response = await axios.post(
        "https://sportalon-backend.onrender.com/api/auth/login",
        formData,
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );
      
      const { user, token } = response.data;
      console.log(response.data);
      
      dispatch(setAuth({ 
        id: user.id, 
        email: user.email, 
        user_type: user.user_type, 
        token,
        isVerifiedByAdmin: user.isVerifiedByAdmin,
        registered_events: user.registeredEvents,
      }));
      // Redirect based on redirect parameter or user type
      if (redirectUrl) {
        navigate(redirectUrl);
      } else if (user.user_type === "Admin") {
        navigate("/admin");
      } else {
        navigate("/profile-page");
      }
    } catch (err) {
      setError(err.response?.data.message || "Error occurred during login");
      console.error("Login error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* New User Register Popup */}
      {showRegisterPopup && (
        <div className="fixed bottom-4 sm:bottom-6 inset-x-0 sm:right-6 sm:left-auto z-50 w-[90%] sm:w-auto max-w-xs sm:max-w-sm mx-auto sm:mx-0">
          <div className="bg-gradient-to-r from-violet-600 to-indigo-600 text-white rounded-xl shadow-xl overflow-hidden animate-fade-in">
            <div className="relative p-3 sm:p-4">
              <div className="flex items-start">
                <div className="flex-1">
                  <p className="text-sm font-medium text-white">New to Sinhgad Sports?</p>
                  <p className="mt-1 text-xs text-violet-100">
                    Create an account to participate in events and track your sports activities.
                  </p>
                  <div className="mt-3 flex space-x-2">
                    <Link 
                      to="/register" 
                      className="inline-flex items-center px-3 py-1.5 text-xs sm:text-sm font-medium rounded-lg bg-white text-violet-700 hover:bg-violet-50 transition-colors"
                    >
                      Register Now
                      <ArrowRight className="ml-1 h-3 w-3 sm:h-4 sm:w-4" />
                    </Link>
                    <button
                      onClick={() => setShowRegisterPopup(false)}
                      className="px-3 py-1.5 text-xs sm:text-sm font-medium rounded-lg bg-violet-500/30 hover:bg-violet-500/50 transition-colors"
                    >
                      Dismiss
                    </button>
                  </div>
                </div>
                <button
                  className="ml-2 text-violet-200 hover:text-white"
                  onClick={() => setShowRegisterPopup(false)}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              {/* Progress bar for auto-close */}
              <div className="absolute bottom-0 left-0 h-1 bg-white/20 w-full">
                <div 
                  className="h-full bg-white/50" 
                  style={{ 
                    width: '100%', 
                    animation: 'shrink 15s linear forwards' 
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      )}
      
      <section className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-cover bg-center bg-no-repeat" style={{ backgroundImage: 'url("/bg.png")' }}>
        <div className="max-w-md w-full space-y-8">
          {/* Logo/Brand Area */}
          <div className="text-center bg-white/70 dark:bg-gray-900/70 backdrop-blur-sm p-6 rounded-xl shadow-lg">
            <div className="mx-auto h-16 w-16 rounded-full bg-violet-600 flex items-center justify-center mb-4 shadow-lg transform hover:scale-105 transition-transform duration-300">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 11c0 3.517-1.009 6.799-2.753 9.571m-3.44-2.04l.054-.09A13.916 13.916 0 008 11a4 4 0 118 0c0 1.017-.07 2.019-.203 3m-2.118 6.844A21.88 21.88 0 0015.171 17m3.839 1.132c.645-2.266.99-4.659.99-7.132A8 8 0 008 4.07M3 15.364c.64-1.319 1-2.8 1-4.364 0-1.457.39-2.823 1.07-4" />
              </svg>
            </div>
            <h2 className="mt-4 text-3xl font-extrabold text-gray-900 dark:text-white">
              Welcome Back
            </h2>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
              Sign in to access your account
            </p>
          </div>

          {/* Card with Form */}
          <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-xl shadow-2xl overflow-hidden transform transition-all hover:shadow-xl">
            <div className="px-6 py-8 sm:p-10">
              {error && (
                <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-lg text-red-600 dark:text-red-400 text-sm flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  {error}
                </div>
              )}
              
              <form className="space-y-6" onSubmit={handleSubmit}>
                <div className="space-y-1">
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Email address
                  </label>
                  <div className="relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                      </svg>
                    </div>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      className="bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white block w-full pl-10 pr-3 py-3 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-violet-500 transition-all duration-200 ease-in-out"
                      placeholder="name@company.com"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Password
                  </label>
                  <div className="relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                    </div>
                    <input
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      autoComplete="current-password"
                      required
                      value={formData.password}
                      onChange={handleChange}
                      className="bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white block w-full pl-10 pr-10 py-3 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-violet-500 transition-all duration-200 ease-in-out"
                      placeholder="••••••••"
                    />
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                      <button
                        type="button"
                        onClick={togglePasswordVisibility}
                        className="text-gray-400 hover:text-gray-500 focus:outline-none"
                      >
                        {showPassword ? (
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                          </svg>
                        ) : (
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                        )}
                      </button>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <input
                      id="remember-me"
                      name="remember-me"
                      type="checkbox"
                      className="h-4 w-4 text-violet-600 focus:ring-violet-500 border-gray-300 rounded"
                    />
                    <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                      Remember me
                    </label>
                  </div>

                  <div className="text-sm">
                    <span className="font-medium text-gray-400 cursor-not-allowed" title="This feature is not available yet">
                      Forgot password?
                    </span>
                  </div>
                </div>

                <div>
                  <button
                    type="submit"
                    disabled={loading}
                    className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-violet-600 hover:bg-violet-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-violet-500 transition-all duration-200 ease-in-out transform hover:-translate-y-1 hover:shadow-lg disabled:opacity-70 disabled:cursor-not-allowed"
                  >
                    {loading ? (
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                    ) : (
                      <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                        <svg className="h-5 w-5 text-violet-400 group-hover:text-violet-300" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                          <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                        </svg>
                      </span>
                    )}
                    {loading ? "Signing in..." : "Sign in"}
                  </button>
                </div>
              </form>
            </div>
            
            <div className="px-6 py-4 bg-gray-50/80 dark:bg-gray-700/50 backdrop-blur-sm border-t border-gray-200 dark:border-gray-700 flex flex-col sm:flex-row items-center justify-between">
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Protected by secure encryption
              </p>
              <p className="mt-2 sm:mt-0 text-sm text-gray-600 dark:text-gray-400">
                Don't have an account yet?{" "}
                <Link to="/register" className="font-medium text-violet-600 hover:text-violet-500 dark:text-violet-400 dark:hover:text-violet-300 transition-colors duration-200">
                  Register now
                </Link>
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default LoginPage;