import React, { useState, useEffect } from "react";
import axios from "axios";
import { useDispatch } from "react-redux";
import { setAuth } from "../redux-store/authSlice";
import { useNavigate } from "react-router-dom";
import { API_BASE_URL, API_ENDPOINTS, createApiUrl } from "../config/api";

const SignupPage = () => {
  const [formData, setFormData] = useState({
    fullname: "",
    email: "",
    password: "",
    mobile_number: "",
    prn_number: "", // Add PRN field
    user_type: "student", // Default value
  });
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  const [resendDisabled, setResendDisabled] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  // Countdown timer for OTP resend
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else if (countdown === 0 && resendDisabled) {
      setResendDisabled(false);
    }
  }, [countdown, resendDisabled]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Check password strength
    if (name === "password") {
      const strength = calculatePasswordStrength(value);
      setPasswordStrength(strength);
    }
  };

  const calculatePasswordStrength = (password) => {
    let score = 0;
    if (password.length > 6) score += 1;
    if (password.length > 10) score += 1;
    if (/[A-Z]/.test(password)) score += 1;
    if (/[0-9]/.test(password)) score += 1;
    if (/[^A-Za-z0-9]/.test(password)) score += 1;
    return score;
  };

  const nextStep = () => {
    if (currentStep === 1) {
      if (!formData.fullname || !formData.email || !formData.password) {
        setError("Please fill all required fields");
        return;
      }
      
      // Move to OTP verification step after basic details
      handleSendOtp();
      return;
    }
    
    if (currentStep === 2 && !otpVerified) {
      setError("Please verify your email with OTP first");
      return;
    }
    
    setError(null);
    setCurrentStep(currentStep + 1);
  };

  const prevStep = () => {
    setCurrentStep(currentStep - 1);
    setError(null);
  };

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };
  
  // Send OTP to user's email
  const handleSendOtp = async () => {
    // Validate email format before sending request
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError("Please enter a valid email address");
      return;
    }
    
    setIsLoading(true);
    setError(null);
    setSuccessMessage("");
    
    try {
      // Show immediate feedback to user
      setSuccessMessage("Sending OTP to your email...");
      
      // Use API URL from config
      const apiUrl = createApiUrl(API_ENDPOINTS.GENERATE_OTP);
      
      console.log("Sending OTP request to:", apiUrl);
      
      const response = await axios.post(
        apiUrl,
        { email: formData.email },
        { 
          headers: { "Content-Type": "application/json" },
          // Add timeout to prevent hanging requests
          timeout: 15000 
        }
      );
      
      if (response.data.success) {
        setOtpSent(true);
        setSuccessMessage("OTP sent to your email. Please check your inbox (and spam folder).");
        setCurrentStep(2);
        
        // Set countdown for resend button
        setResendDisabled(true);
        setCountdown(60);
      } else {
        // Handle unexpected success response without success flag
        setError("Something went wrong. Please try again.");
      }
    } catch (err) {
      console.error("OTP Error:", err);
      
      // Handle different types of errors with specific messages
      if (err.code === "ECONNABORTED") {
        setError("Request timed out. Please check your internet connection and try again.");
      } else if (err.response) {
        // Server responded with an error status
        setError(err.response.data?.message || `Error (${err.response.status}): Failed to send OTP, please try again.`);
      } else if (err.request) {
        // Request was made but no response received
        setError("No response from server. Please check your internet connection and try again.");
      } else {
        // Something else went wrong
        setError("An unexpected error occurred. Please try again later.");
      }
    } finally {
      setIsLoading(false);
    }
  };
  
  // Verify OTP
  const handleVerifyOtp = async () => {
    if (!otp) {
      setError("Please enter the OTP");
      return;
    }
    
    // Validate OTP format (should be 6 digits)
    if (!/^\d{6}$/.test(otp)) {
      setError("OTP should be 6 digits");
      return;
    }
    
    setIsLoading(true);
    setError(null);
    setSuccessMessage("Verifying OTP...");
    
    try {
      // Use API URL from config
      const apiUrl = createApiUrl(API_ENDPOINTS.VERIFY_OTP);
      
      console.log("Sending OTP verification request to:", apiUrl);
      
      const response = await axios.post(
        apiUrl,
        { email: formData.email, otp },
        { 
          headers: { "Content-Type": "application/json" },
          // Add timeout to prevent hanging requests
          timeout: 15000 
        }
      );
      
      if (response.data.success) {
        setOtpVerified(true);
        setSuccessMessage("Email verified successfully");
        setCurrentStep(3);
      } else {
        // Handle unexpected success response without success flag
        setError("Verification failed. Please try again.");
      }
    } catch (err) {
      console.error("OTP Verification Error:", err);
      
      // Handle different types of errors with specific messages
      if (err.code === "ECONNABORTED") {
        setError("Request timed out. Please check your internet connection and try again.");
      } else if (err.response) {
        // Server responded with an error status
        setError(err.response.data?.message || `Error (${err.response.status}): Failed to verify OTP, please try again.`);
      } else if (err.request) {
        // Request was made but no response received
        setError("No response from server. Please check your internet connection and try again.");
      } else {
        // Something else went wrong
        setError("An unexpected error occurred. Please try again later.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // If we're on the OTP verification step
    if (currentStep === 2) {
      handleVerifyOtp();
      return;
    }
    
    setIsLoading(true);
    setError(null);

    try {
      const apiUrl = createApiUrl(API_ENDPOINTS.REGISTER);
      console.log("Sending registration request to:", apiUrl);
      
      const response = await axios.post(
        apiUrl,
        formData,
        { 
          headers: { "Content-Type": "application/json" },
          timeout: 15000
        }
      );

      if (response.data.success) {
        setSuccessMessage("Registration successful!");
        const { id, email, user_type } = response.data.user;
        const { token } = response.data;
        dispatch(setAuth({ id, email, token, user_type }));

        // Redirect to the profile creation page
        setTimeout(() => {
          navigate("/create-profile");
        }, 1000);
      } else {
        setError("Registration failed, please try again.");
      }
    } catch (err) {
      console.error(err.response?.data || "Error occurred during registration");
      setError(err.response?.data?.message || "Registration failed, please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:bg-gray-900 min-h-screen">
      <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
        <div className="w-full bg-white rounded-lg shadow-lg dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700 transition-all duration-300 hover:shadow-xl">
          <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
            <div className="flex justify-between items-center">
              <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
                {currentStep === 1 ? "Create Account" : currentStep === 2 ? "Verify Email" : "Complete Profile"}
              </h1>
              <div className="flex space-x-2">
                <div className={`h-2 w-8 rounded-full ${currentStep === 1 ? "bg-blue-500" : "bg-gray-300"}`}></div>
                <div className={`h-2 w-8 rounded-full ${currentStep === 2 ? "bg-blue-500" : "bg-gray-300"}`}></div>
                <div className={`h-2 w-8 rounded-full ${currentStep === 3 ? "bg-blue-500" : "bg-gray-300"}`}></div>
              </div>
            </div>

            {error && (
              <div className="text-red-500 text-sm text-center p-2 bg-red-50 rounded-lg dark:bg-red-900/30">
                {error}
              </div>
            )}

            {successMessage && (
              <div className="text-green-500 text-sm text-center p-2 bg-green-50 rounded-lg dark:bg-green-900/30">
                {successMessage}
              </div>
            )}

            <form className="space-y-4 md:space-y-6" onSubmit={handleSubmit}>
              {currentStep === 1 ? (
                <>
                  <div className="transition-all duration-300 transform hover:scale-[1.01]">
                    <label
                      htmlFor="fullname"
                      className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                    >
                      Full Name
                    </label>
                    <input
                      type="text"
                      name="fullname"
                      id="fullname"
                      className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                      placeholder="John Doe"
                      required
                      value={formData.fullname}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="transition-all duration-300 transform hover:scale-[1.01]">
                    <label
                      htmlFor="email"
                      className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                    >
                      Email Address
                    </label>
                    <input
                      type="email"
                      name="email"
                      id="email"
                      className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                      placeholder="name@example.com"
                      required
                      value={formData.email}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="transition-all duration-300 transform hover:scale-[1.01]">
                    <label
                      htmlFor="password"
                      className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                    >
                      Password
                    </label>
                    <div className="relative">
                      <input
                        type={passwordVisible ? "text" : "password"}
                        name="password"
                        id="password"
                        placeholder="••••••••"
                        className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                        required
                        value={formData.password}
                        onChange={handleChange}
                      />
                      <button
                        type="button"
                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-gray-700 dark:text-gray-300 dark:hover:text-gray-100"
                        onClick={togglePasswordVisibility}
                      >
                        {passwordVisible ? (
                          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                          </svg>
                        ) : (
                          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                        )}
                      </button>
                    </div>

                    {/* Password strength indicator */}
                    <div className="mt-2">
                      <div className="flex space-x-1 h-1">
                        <div className={`flex-1 rounded-full ${passwordStrength >= 1 ? 'bg-red-500' : 'bg-gray-200'}`}></div>
                        <div className={`flex-1 rounded-full ${passwordStrength >= 2 ? 'bg-orange-500' : 'bg-gray-200'}`}></div>
                        <div className={`flex-1 rounded-full ${passwordStrength >= 3 ? 'bg-yellow-500' : 'bg-gray-200'}`}></div>
                        <div className={`flex-1 rounded-full ${passwordStrength >= 4 ? 'bg-green-500' : 'bg-gray-200'}`}></div>
                        <div className={`flex-1 rounded-full ${passwordStrength >= 5 ? 'bg-green-600' : 'bg-gray-200'}`}></div>
                      </div>
                      <p className="text-xs mt-1 text-gray-500 dark:text-gray-400">
                        {passwordStrength < 3 ? "Use uppercase, numbers & special characters" : "Strong password"}
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={nextStep}
                    className="w-full text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 transition-all duration-300"
                  >
                    Continue
                  </button>
                </>
              ) : currentStep === 2 ? (
                <>
                  <div className="text-center mb-4">
                    <div className="inline-block p-3 rounded-full bg-blue-100 text-blue-600 mb-3">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <h3 className="text-lg font-semibold">Verify Your Email</h3>
                    <p className="text-gray-600 text-sm mt-1 dark:text-gray-400">
                      We've sent a verification code to<br/>
                      <span className="font-medium text-blue-600 dark:text-blue-400">{formData.email}</span>
                    </p>
                  </div>

                  <div className="transition-all duration-300 transform hover:scale-[1.01]">
                    <label
                      htmlFor="otp"
                      className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                    >
                      Enter OTP
                    </label>
                    <input
                      type="text"
                      name="otp"
                      id="otp"
                      className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 text-center text-lg tracking-widest"
                      placeholder="••••••"
                      required
                      maxLength={6}
                      value={otp}
                      onChange={(e) => setOtp(e.target.value.replace(/[^0-9]/g, ''))}
                    />
                  </div>
                  
                  <div className="text-center">
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                      Didn't receive the code?{" "}
                      <button
                        type="button"
                        onClick={handleSendOtp}
                        disabled={resendDisabled}
                        className={`font-medium text-blue-600 hover:underline dark:text-blue-500 ${
                          resendDisabled ? 'opacity-50 cursor-not-allowed' : ''
                        }`}
                      >
                        {resendDisabled ? `Resend in ${countdown}s` : "Resend OTP"}
                      </button>
                    </p>
                  </div>

                  <div className="flex space-x-3">
                    <button
                      type="button"
                      onClick={prevStep}
                      className="w-1/3 text-gray-700 bg-gray-200 hover:bg-gray-300 focus:ring-4 focus:outline-none focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-gray-600 dark:hover:bg-gray-700 dark:focus:ring-gray-800 transition-all duration-300"
                    >
                      Back
                    </button>
                    <button
                      type="submit"
                      disabled={isLoading}
                      className={`w-2/3 text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 transition-all duration-300 ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
                    >
                      {isLoading ? (
                        <span className="flex items-center justify-center">
                          <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Verifying...
                        </span>
                      ) : "Verify OTP"}
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <div className="transition-all duration-300 transform hover:scale-[1.01]">
                    <label
                      htmlFor="mobile_number"
                      className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                    >
                      Mobile Number
                    </label>
                    <input
                      type="tel"
                      name="mobile_number"
                      id="mobile_number"
                      className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                      placeholder="+91-XXXXXXXXXX"
                      required
                      inputMode="numeric"
                      pattern="[0-9]{10}"
                      title="Please enter a valid 10-digit mobile number"
                      value={formData.mobile_number}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="transition-all duration-300 transform hover:scale-[1.01]">
                    <label
                      htmlFor="prn_number"
                      className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                    >
                      PRN Number
                    </label>
                    <input
                      type="text"
                      name="prn_number"
                      id="prn_number"
                      className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                      placeholder="Enter your PRN number"
                      required
                      value={formData.prn_number}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="flex space-x-3">
                    <button
                      type="button"
                      onClick={prevStep}
                      className="w-1/3 text-gray-700 bg-gray-200 hover:bg-gray-300 focus:ring-4 focus:outline-none focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-gray-600 dark:hover:bg-gray-700 dark:focus:ring-gray-800 transition-all duration-300"
                    >
                      Back
                    </button>
                    <button
                      type="submit"
                      disabled={isLoading}
                      className={`w-2/3 text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 transition-all duration-300 ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
                    >
                      {isLoading ? (
                        <span className="flex items-center justify-center">
                          <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Processing...
                        </span>
                      ) : "Sign up"}
                    </button>
                  </div>
                </>
              )}

              <p className="text-sm font-light text-gray-500 dark:text-gray-400 text-center">
                Already have an account?{" "}
                <a
                  href="/login"
                  className="font-medium text-blue-600 hover:underline dark:text-blue-500"
                >
                  Login
                </a>
              </p>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SignupPage;
