import React, { useState, useRef, useEffect } from "react";
import {
  FaFacebook,
  FaTwitter,
  FaInstagram,
  FaPhone,
  FaEnvelope,
  FaMapMarkerAlt,
  FaUser,
  FaSignOutAlt,
  FaGoogle,
  FaEye,
  FaEyeSlash,
  FaLock,
  FaEnvelope as FaEmail,
  FaUser as FaUserIcon,
  FaPhone as FaPhoneIcon,
} from "react-icons/fa";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

const MySwal = withReactContent(Swal);

// Custom hook to manage authentication state
const useAuth = () => {
  const getCurrentUser = () => {
    const userStr = localStorage.getItem("user");
    return userStr ? JSON.parse(userStr) : null;
  };

  const getToken = () => {
    return localStorage.getItem("access_token");
  };

  const logout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("user");
    window.location.reload();
  };

  const isAuthenticated = () => {
    return !!getToken();
  };

  return {
    currentUser: getCurrentUser(),
    token: getToken(),
    logout,
    isAuthenticated,
  };
};

const AuthModal = ({ isOpen, onClose }) => {
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Separate form data for login and signup
  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  });

  const [signupData, setSignupData] = useState({
    username: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });

  // Separate refs for each form
  const loginEmailRef = useRef(null);
  const loginPasswordRef = useRef(null);
  const signupUsernameRef = useRef(null);
  const signupEmailRef = useRef(null);
  const signupPhoneRef = useRef(null);
  const signupPasswordRef = useRef(null);
  const signupConfirmPasswordRef = useRef(null);

  // Use a default API URL that works with your Flask backend
  const API_URL = "http://localhost:5000/api";

  // Focus first field when modal opens or mode changes
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        if (isLoginMode && loginEmailRef.current) {
          loginEmailRef.current.focus();
        } else if (!isLoginMode && signupUsernameRef.current) {
          signupUsernameRef.current.focus();
        }
      }, 100);
    }
  }, [isOpen, isLoginMode]);

  const handleLoginChange = (e) => {
    const { name, value } = e.target;
    setLoginData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSignupChange = (e) => {
    const { name, value } = e.target;
    setSignupData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle Enter key press to move between fields
  const handleKeyDown = (e, nextFieldRef) => {
    if (e.key === "Enter") {
      e.preventDefault();
      if (nextFieldRef && nextFieldRef.current) {
        nextFieldRef.current.focus();
      } else {
        // Submit form if it's the last field
        const form = e.target.closest("form");
        if (form) {
          const submitButton = form.querySelector('button[type="submit"]');
          if (submitButton && !submitButton.disabled) {
            submitButton.click();
          }
        }
      }
    }
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch(`${API_URL}/users/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: loginData.email,
          password: loginData.password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Login failed");
      }

      // Save token and user data
      localStorage.setItem("access_token", data.access_token);
      localStorage.setItem("user", JSON.stringify(data.user));

      MySwal.fire({
        icon: "success",
        title: "Welcome Back! 🎉",
        text: "You have successfully logged in!",
        showConfirmButton: false,
        timer: 1500,
        background: "#1f2937",
        color: "white",
      });

      // Close modal and refresh page to update auth state
      onClose();
      setTimeout(() => window.location.reload(), 1600);
    } catch (error) {
      console.error("Login error:", error);
      MySwal.fire({
        icon: "error",
        title: "Login Failed",
        text: error.message,
        background: "#1f2937",
        color: "white",
        confirmButtonColor: "#f59e0b",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignupSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    // Client-side validation
    if (signupData.password !== signupData.confirmPassword) {
      MySwal.fire({
        icon: "error",
        title: "Oops...",
        text: "Passwords don't match!",
        background: "#1f2937",
        color: "white",
        confirmButtonColor: "#f59e0b",
      });
      setIsLoading(false);
      return;
    }

    if (!signupData.username) {
      MySwal.fire({
        icon: "error",
        title: "Oops...",
        text: "Username is required!",
        background: "#1f2937",
        color: "white",
        confirmButtonColor: "#f59e0b",
      });
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch(`${API_URL}/users/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: signupData.username,
          email: signupData.email,
          password: signupData.password,
          phone: signupData.phone || "",
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Registration failed");
      }

      // Save token and user data
      localStorage.setItem("access_token", data.access_token);
      localStorage.setItem("user", JSON.stringify(data.user));

      MySwal.fire({
        icon: "success",
        title: "Account Created! 🎉",
        text: "Your account has been created successfully!",
        showConfirmButton: false,
        timer: 1500,
        background: "#1f2937",
        color: "white",
      });

      // Close modal and refresh page to update auth state
      onClose();
      setTimeout(() => window.location.reload(), 1600);
    } catch (error) {
      console.error("Signup error:", error);
      MySwal.fire({
        icon: "error",
        title: "Registration Failed",
        text: error.message,
        background: "#1f2937",
        color: "white",
        confirmButtonColor: "#f59e0b",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Google OAuth - placeholder for future implementation
  const handleGoogleAuth = async () => {
    setIsLoading(true);
    try {
      MySwal.fire({
        icon: "info",
        title: "Coming Soon",
        text: "Google authentication will be available soon!",
        background: "#1f2937",
        color: "white",
        confirmButtonColor: "#f59e0b",
      });
    } catch (error) {
      MySwal.fire({
        icon: "error",
        title: "Google Auth Failed",
        text: "Unable to connect with Google. Please try again.",
        background: "#1f2937",
        color: "white",
        confirmButtonColor: "#f59e0b",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Reset form data when switching modes
  const handleModeSwitch = (newMode) => {
    if (newMode !== isLoginMode) {
      setIsLoginMode(newMode);
      // Reset form data when switching
      if (newMode) {
        // Switching to login
        setSignupData({
          username: "",
          email: "",
          phone: "",
          password: "",
          confirmPassword: "",
        });
        setShowPassword(false);
        setShowConfirmPassword(false);
      } else {
        // Switching to signup
        setLoginData({
          email: "",
          password: "",
        });
        setShowPassword(false);
        setShowConfirmPassword(false);
      }
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black bg-opacity-70 backdrop-blur-sm"
        onClick={onClose}
      ></div>

      <div className="relative w-full max-w-4xl bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl shadow-2xl overflow-hidden border border-gray-700">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 z-20 text-gray-400 hover:text-white text-2xl w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-700 transition-all duration-300"
        >
          ×
        </button>

        <div className="flex">
          <div className="hidden md:flex flex-col justify-center p-12 bg-gradient-to-br from-yellow-600 to-yellow-700 text-white w-2/5 relative overflow-hidden">
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-8 left-8 text-4xl">🦁</div>
              <div className="absolute bottom-8 right-8 text-4xl">🦒</div>
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-6xl">
                🌍
              </div>
            </div>

            <div className="relative z-10">
              <h2 className="text-3xl font-bold mb-4">
                {isLoginMode ? "Welcome Back!" : "Join Our Safari!"}
              </h2>
              <p className="text-yellow-100 mb-6">
                {isLoginMode
                  ? "Sign in to continue your safari journey with exclusive member benefits."
                  : "Create an account to unlock special safari packages and personalized experiences."}
              </p>

              <div className="space-y-4">
                <div className="flex items-center">
                  <div className="w-8 h-8 rounded-full bg-yellow-500 flex items-center justify-center mr-3">
                    <span className="text-sm">✓</span>
                  </div>
                  <span>Exclusive Safari Deals</span>
                </div>
                <div className="flex items-center">
                  <div className="w-8 h-8 rounded-full bg-yellow-500 flex items-center justify-center mr-3">
                    <span className="text-sm">✓</span>
                  </div>
                  <span>Personalized Itineraries</span>
                </div>
                <div className="flex items-center">
                  <div className="w-8 h-8 rounded-full bg-yellow-500 flex items-center justify-center mr-3">
                    <span className="text-sm">✓</span>
                  </div>
                  <span>24/7 Support</span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex-1 p-8 md:p-12">
            <div className="flex mb-8">
              <button
                onClick={() => handleModeSwitch(true)}
                className={`flex-1 py-3 text-center font-medium transition-all duration-300 ${
                  isLoginMode
                    ? "text-yellow-500 border-b-2 border-yellow-500"
                    : "text-gray-400 hover:text-gray-300"
                }`}
              >
                Sign In
              </button>
              <button
                onClick={() => handleModeSwitch(false)}
                className={`flex-1 py-3 text-center font-medium transition-all duration-300 ${
                  !isLoginMode
                    ? "text-yellow-500 border-b-2 border-yellow-500"
                    : "text-gray-400 hover:text-gray-300"
                }`}
              >
                Sign Up
              </button>
            </div>

            <div className="relative overflow-hidden h-[420px]">
              <div
                className="absolute top-0 left-0 w-full flex transition-transform duration-500 ease-in-out"
                style={{
                  transform: `translateX(${isLoginMode ? "0" : "-100%"})`,
                }}
              >
                {/* Login Form */}
                <div className="min-w-full pr-4">
                  <div className="text-center mb-8">
                    <div className="w-16 h-16 bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-full flex items-center justify-center mx-auto mb-4">
                      <FaLock className="text-white text-xl" />
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-2">
                      Welcome Back!
                    </h3>
                    <p className="text-gray-400">
                      Sign in to continue your adventure
                    </p>
                  </div>

                  <form onSubmit={handleLoginSubmit} className="space-y-5">
                    <div className="group">
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Email Address
                      </label>
                      <div className="relative">
                        <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                          <FaEmail />
                        </div>
                        <input
                          ref={loginEmailRef}
                          type="email"
                          name="email"
                          value={loginData.email}
                          onChange={handleLoginChange}
                          onKeyDown={(e) => handleKeyDown(e, loginPasswordRef)}
                          required
                          className="w-full pl-10 pr-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all duration-300 group-hover:border-gray-600"
                          placeholder="Enter your email"
                          autoComplete="email"
                        />
                      </div>
                    </div>

                    <div className="group">
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Password
                      </label>
                      <div className="relative">
                        <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                          <FaLock />
                        </div>
                        <input
                          ref={loginPasswordRef}
                          type={showPassword ? "text" : "password"}
                          name="password"
                          value={loginData.password}
                          onChange={handleLoginChange}
                          onKeyDown={(e) => handleKeyDown(e, null)}
                          required
                          className="w-full pl-10 pr-12 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all duration-300 group-hover:border-gray-600"
                          placeholder="Enter your password"
                          autoComplete="current-password"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-yellow-400 transition-colors duration-300 group"
                        >
                          <div className="relative">
                            {/* Eye icon that appears on hover */}
                            <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                              {showPassword ? <FaEyeSlash /> : <FaEye />}
                            </div>
                            {/* Dot icon for normal state - appears like a dot but reveals eye on hover */}
                            <div className="absolute inset-0 flex items-center justify-center opacity-100 group-hover:opacity-0 transition-opacity duration-300">
                              <div className="w-1.5 h-1.5 bg-gray-400 rounded-full"></div>
                            </div>
                          </div>
                        </button>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <label className="flex items-center cursor-pointer">
                        <div className="relative">
                          <input
                            type="checkbox"
                            className="sr-only"
                            id="remember-me-login"
                          />
                          <div className="w-5 h-5 bg-gray-800 border border-gray-700 rounded flex items-center justify-center">
                            <svg
                              className="w-3 h-3 text-yellow-500 opacity-0"
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path
                                fillRule="evenodd"
                                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                clipRule="evenodd"
                              ></path>
                            </svg>
                          </div>
                        </div>
                        <span className="ml-2 text-sm text-gray-300">
                          Remember me
                        </span>
                      </label>
                      <button
                        type="button"
                        className="text-sm text-yellow-400 hover:text-yellow-300"
                      >
                        Forgot password?
                      </button>
                    </div>

                    <button
                      type="submit"
                      disabled={isLoading}
                      className="w-full py-3 bg-gradient-to-r from-yellow-500 to-yellow-600 text-white font-semibold rounded-lg hover:from-yellow-600 hover:to-yellow-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isLoading ? (
                        <span className="flex items-center justify-center">
                          <svg
                            className="animate-spin h-5 w-5 mr-3 text-white"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                          >
                            <circle
                              className="opacity-25"
                              cx="12"
                              cy="12"
                              r="10"
                              stroke="currentColor"
                              strokeWidth="4"
                            ></circle>
                            <path
                              className="opacity-75"
                              fill="currentColor"
                              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                            ></path>
                          </svg>
                          Signing in...
                        </span>
                      ) : (
                        "Sign In"
                      )}
                    </button>
                  </form>

                  <div className="mt-8">
                    <div className="relative">
                      <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-gray-700"></div>
                      </div>
                      <div className="relative flex justify-center">
                        <span className="px-3 bg-gray-900 text-gray-400 text-sm">
                          Or continue with
                        </span>
                      </div>
                    </div>

                    <button
                      onClick={handleGoogleAuth}
                      disabled={isLoading}
                      className="w-full mt-6 py-3 bg-white text-gray-800 font-semibold rounded-lg hover:bg-gray-100 transition-all duration-300 flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <FaGoogle className="text-red-500" />
                      Continue with Google
                    </button>
                  </div>
                </div>

                {/* Register Form */}
                <div className="min-w-full pl-4">
                  <div className="text-center mb-8">
                    <div className="w-16 h-16 bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-full flex items-center justify-center mx-auto mb-4">
                      <FaUserIcon className="text-white text-xl" />
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-2">
                      Join the Adventure!
                    </h3>
                    <p className="text-gray-400">
                      Create your account to get started
                    </p>
                  </div>

                  <form onSubmit={handleSignupSubmit} className="space-y-5">
                    <div className="group">
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Username *
                      </label>
                      <div className="relative">
                        <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                          <FaUserIcon />
                        </div>
                        <input
                          ref={signupUsernameRef}
                          type="text"
                          name="username"
                          value={signupData.username}
                          onChange={handleSignupChange}
                          onKeyDown={(e) => handleKeyDown(e, signupEmailRef)}
                          required
                          className="w-full pl-10 pr-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all duration-300 group-hover:border-gray-600"
                          placeholder="Choose a username"
                          autoComplete="username"
                        />
                      </div>
                    </div>

                    <div className="group">
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Email Address *
                      </label>
                      <div className="relative">
                        <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                          <FaEmail />
                        </div>
                        <input
                          ref={signupEmailRef}
                          type="email"
                          name="email"
                          value={signupData.email}
                          onChange={handleSignupChange}
                          onKeyDown={(e) => handleKeyDown(e, signupPhoneRef)}
                          required
                          className="w-full pl-10 pr-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all duration-300 group-hover:border-gray-600"
                          placeholder="Enter your email"
                          autoComplete="email"
                        />
                      </div>
                    </div>

                    <div className="group">
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Phone Number (Optional)
                      </label>
                      <div className="relative">
                        <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                          <FaPhoneIcon />
                        </div>
                        <input
                          ref={signupPhoneRef}
                          type="tel"
                          name="phone"
                          value={signupData.phone}
                          onChange={handleSignupChange}
                          onKeyDown={(e) => handleKeyDown(e, signupPasswordRef)}
                          className="w-full pl-10 pr-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all duration-300 group-hover:border-gray-600"
                          placeholder="+254 xxx xxx xxx"
                          autoComplete="tel"
                        />
                      </div>
                    </div>

                    <div className="group">
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Password *
                      </label>
                      <div className="relative">
                        <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                          <FaLock />
                        </div>
                        <input
                          ref={signupPasswordRef}
                          type={showPassword ? "text" : "password"}
                          name="password"
                          value={signupData.password}
                          onChange={handleSignupChange}
                          onKeyDown={(e) =>
                            handleKeyDown(e, signupConfirmPasswordRef)
                          }
                          required
                          minLength={6}
                          className="w-full pl-10 pr-12 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all duration-300 group-hover:border-gray-600"
                          placeholder="Create a password (min. 6 characters)"
                          autoComplete="new-password"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-yellow-400 transition-colors duration-300 group"
                        >
                          <div className="relative">
                            {/* Eye icon that appears on hover */}
                            <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                              {showPassword ? <FaEyeSlash /> : <FaEye />}
                            </div>
                            {/* Dot icon for normal state */}
                            <div className="absolute inset-0 flex items-center justify-center opacity-100 group-hover:opacity-0 transition-opacity duration-300">
                              <div className="w-1.5 h-1.5 bg-gray-400 rounded-full"></div>
                            </div>
                          </div>
                        </button>
                      </div>
                    </div>

                    <div className="group">
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Confirm Password *
                      </label>
                      <div className="relative">
                        <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                          <FaLock />
                        </div>
                        <input
                          ref={signupConfirmPasswordRef}
                          type={showConfirmPassword ? "text" : "password"}
                          name="confirmPassword"
                          value={signupData.confirmPassword}
                          onChange={handleSignupChange}
                          onKeyDown={(e) => handleKeyDown(e, null)}
                          required
                          className="w-full pl-10 pr-12 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all duration-300 group-hover:border-gray-600"
                          placeholder="Confirm your password"
                          autoComplete="new-password"
                        />
                        <button
                          type="button"
                          onClick={() =>
                            setShowConfirmPassword(!showConfirmPassword)
                          }
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-yellow-400 transition-colors duration-300 group"
                        >
                          <div className="relative">
                            {/* Eye icon that appears on hover */}
                            <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                              {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                            </div>
                            {/* Dot icon for normal state */}
                            <div className="absolute inset-0 flex items-center justify-center opacity-100 group-hover:opacity-0 transition-opacity duration-300">
                              <div className="w-1.5 h-1.5 bg-gray-400 rounded-full"></div>
                            </div>
                          </div>
                        </button>
                      </div>
                    </div>

                    <div className="flex items-start">
                      <input
                        type="checkbox"
                        required
                        id="terms-agreement"
                        className="mt-1 mr-2 w-4 h-4 text-yellow-500 bg-gray-800 border-gray-700 rounded focus:ring-yellow-500"
                      />
                      <label
                        htmlFor="terms-agreement"
                        className="text-sm text-gray-300"
                      >
                        I agree to the{" "}
                        <button
                          type="button"
                          className="text-yellow-400 hover:text-yellow-300"
                        >
                          Terms & Conditions
                        </button>{" "}
                        and{" "}
                        <button
                          type="button"
                          className="text-yellow-400 hover:text-yellow-300"
                        >
                          Privacy Policy
                        </button>
                      </label>
                    </div>

                    <button
                      type="submit"
                      disabled={isLoading}
                      className="w-full py-3 bg-gradient-to-r from-yellow-500 to-yellow-600 text-white font-semibold rounded-lg hover:from-yellow-600 hover:to-yellow-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isLoading ? (
                        <span className="flex items-center justify-center">
                          <svg
                            className="animate-spin h-5 w-5 mr-3 text-white"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                          >
                            <circle
                              className="opacity-25"
                              cx="12"
                              cy="12"
                              r="10"
                              stroke="currentColor"
                              strokeWidth="4"
                            ></circle>
                            <path
                              className="opacity-75"
                              fill="currentColor"
                              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                            ></path>
                          </svg>
                          Creating account...
                        </span>
                      ) : (
                        "Create Account"
                      )}
                    </button>
                  </form>

                  <div className="mt-8">
                    <div className="relative">
                      <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-gray-700"></div>
                      </div>
                      <div className="relative flex justify-center">
                        <span className="px-3 bg-gray-900 text-gray-400 text-sm">
                          Or sign up with
                        </span>
                      </div>
                    </div>

                    <button
                      onClick={handleGoogleAuth}
                      disabled={isLoading}
                      className="w-full mt-6 py-3 bg-white text-gray-800 font-semibold rounded-lg hover:bg-gray-100 transition-all duration-300 flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <FaGoogle className="text-red-500" />
                      Continue with Google
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className="text-center mt-6 text-gray-400 text-sm">
              {isLoginMode ? (
                <>
                  Don't have an account?{" "}
                  <button
                    onClick={() => handleModeSwitch(false)}
                    className="text-yellow-400 hover:text-yellow-300 font-medium"
                  >
                    Sign up here
                  </button>
                </>
              ) : (
                <>
                  Already have an account?{" "}
                  <button
                    onClick={() => handleModeSwitch(true)}
                    className="text-yellow-400 hover:text-yellow-300 font-medium"
                  >
                    Sign in here
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const Footer = () => {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const { currentUser, logout } = useAuth();

  const handleAuthClick = () => {
    if (currentUser) {
      MySwal.fire({
        title: "Sign Out?",
        text: "Are you sure you want to sign out?",
        icon: "warning",
        showCancelButton: true,
        background: "#1f2937",
        color: "white",
        confirmButtonColor: "#f59e0b",
        cancelButtonColor: "#6b7280",
        confirmButtonText: "Yes, sign out",
        cancelButtonText: "Cancel",
      }).then((result) => {
        if (result.isConfirmed) {
          logout();
          MySwal.fire({
            title: "Signed Out!",
            text: "You have been successfully signed out.",
            icon: "success",
            timer: 1500,
            showConfirmButton: false,
            background: "#1f2937",
            color: "white",
          });
        }
      });
    } else {
      setIsAuthModalOpen(true);
    }
  };

  return (
    <>
      <footer className="bg-gray-900 text-white mt-auto">
        <div className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="lg:col-span-2">
              <h3 className="text-2xl font-bold text-yellow-400 mb-4">
                Jozz Tembo Tours and Safari
              </h3>
              <p className="text-gray-300 mb-4">
                Driven by passion, guided by experience. With over 30 years of
                excellence in tourism and safari industry, we provide
                unforgettable African experiences from our base in Malindi. In
                cooperation with Cimo Service.
              </p>
              <div className="flex space-x-4">
                <a
                  href="https://www.instagram.com/joztembotours/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-yellow-400 transition-colors duration-300"
                >
                  <FaInstagram size={24} />
                </a>
                <a
                  href="#"
                  className="text-gray-400 hover:text-yellow-400 transition-colors duration-300"
                >
                  <FaFacebook size={24} />
                </a>
                <a
                  href="#"
                  className="text-gray-400 hover:text-yellow-400 transition-colors duration-300"
                >
                  <FaTwitter size={24} />
                </a>
              </div>
            </div>

            <div>
              <h4 className="text-lg font-semibold text-yellow-400 mb-4">
                Our Services
              </h4>
              <ul className="space-y-2">
                <li>
                  <a
                    href="#safari"
                    className="text-gray-300 hover:text-white transition-colors duration-300 block py-1"
                  >
                    Safari Adventures
                  </a>
                </li>
                <li>
                  <a
                    href="#beach"
                    className="text-gray-300 hover:text-white transition-colors duration-300 block py-1"
                  >
                    Beach Tours
                  </a>
                </li>
                <li>
                  <a
                    href="#cultural"
                    className="text-gray-300 hover:text-white transition-colors duration-300 block py-1"
                  >
                    Cultural Experiences
                  </a>
                </li>
                <li>
                  <a
                    href="#airport"
                    className="text-gray-300 hover:text-white transition-colors duration-300 block py-1"
                  >
                    Airport Transfers
                  </a>
                </li>
                <li>
                  <a
                    href="#custom"
                    className="text-gray-300 hover:text-white transition-colors duration-300 block py-1"
                  >
                    Custom Packages
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="text-lg font-semibold text-yellow-400 mb-4">
                Contact Us
              </h4>
              <div className="space-y-3">
                <div className="flex items-start space-x-3">
                  <FaMapMarkerAlt className="text-yellow-400 mt-1 flex-shrink-0" />
                  <span className="text-gray-300">
                    Malindi, Lamu Road
                    <br />
                    Kenya
                  </span>
                </div>
                <div className="flex items-center space-x-3">
                  <FaPhone className="text-yellow-400 flex-shrink-0" />
                  <div className="flex flex-col">
                    <span className="text-gray-300">+254 722 266 955</span>
                    <span className="text-gray-300">+254 734 400 077</span>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <FaEnvelope className="text-yellow-400 flex-shrink-0" />
                  <span className="text-gray-300">info@jozztembotours.com</span>
                </div>
              </div>

              <div className="mt-4 p-3 bg-gray-800 rounded-lg">
                <p className="text-sm text-gray-300">
                  <strong className="text-yellow-400">Partnership:</strong>
                  <br />
                  In cooperation with
                  <br />
                  <span className="text-white">Cimo Service</span>
                </p>
              </div>
            </div>
          </div>
        </div>

        <div
          className="bg-gradient-to-r from-yellow-600 to-yellow-500 py-4 cursor-pointer hover:from-yellow-700 hover:to-yellow-600 transition-all duration-300"
          onClick={handleAuthClick}
        >
          <div className="container mx-auto px-4 text-center">
            <div className="flex items-center justify-center gap-3">
              <p className="text-white text-lg font-semibold">
                🦁 Over 30 Years of Safari Excellence | Trusted Since 1993 🦒
              </p>
              <div className="flex items-center gap-2 bg-black bg-opacity-20 px-4 py-2 rounded-full hover:bg-opacity-30 transition-all duration-300">
                {currentUser ? (
                  <>
                    <FaSignOutAlt className="text-white" />
                    <span className="text-white text-sm hidden sm:inline">
                      Sign Out
                    </span>
                  </>
                ) : (
                  <>
                    <FaUser className="text-white" />
                    <span className="text-white text-sm hidden sm:inline">
                      Member Access
                    </span>
                  </>
                )}
              </div>
            </div>
            <p className="text-yellow-100 text-sm mt-2">
              {currentUser
                ? `Welcome back, ${currentUser.email}!`
                : "Click for exclusive member access"}
            </p>
          </div>
        </div>

        <div className="border-t border-gray-800">
          <div className="container mx-auto px-4 py-6">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <div className="text-center md:text-left mb-4 md:mb-0">
                <p className="text-gray-400 text-sm">
                  © {new Date().getFullYear()} Jozz Tembo Tours and Safari. All
                  rights reserved.
                </p>
                <p className="text-yellow-400 text-sm mt-1 italic">
                  Driven by passion, guided by experience
                </p>
              </div>
              <div className="flex space-x-6">
                <a href="#" className="text-gray-400 hover:text-white text-sm">
                  Privacy Policy
                </a>
                <a href="#" className="text-gray-400 hover:text-white text-sm">
                  Terms of Service
                </a>
                <a href="#" className="text-gray-400 hover:text-white text-sm">
                  Cookie Policy
                </a>
              </div>
            </div>
          </div>
        </div>
      </footer>

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
      />
    </>
  );
};

export default Footer;
