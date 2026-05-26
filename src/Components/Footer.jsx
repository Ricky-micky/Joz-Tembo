// Footer.js - Complete Updated Version with User CRUD Operations & Auth Sync
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
  FaShieldAlt,
  FaFileContract,
  FaCookieBite,
  FaCheckCircle,
  FaTimes,
  FaGlobe,
  FaCreditCard,
  FaPlane,
  FaShieldVirus,
  FaChartLine,
  FaDatabase,
  FaUserSecret,
  FaGavel,
  FaHandshake,
  FaEdit,
  FaSave,
  FaTrash,
  FaUserShield,
} from "react-icons/fa";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

const MySwal = withReactContent(Swal);

// ============ AUTH SYNC HELPER ============
const dispatchAuthSync = () => {
  window.dispatchEvent(new Event("authChange"));
  window.dispatchEvent(
    new StorageEvent("storage", {
      key: "access_token",
      newValue: localStorage.getItem("access_token"),
    }),
  );
};

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
    dispatchAuthSync();
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

// ============ MODAL COMPONENTS ============

// Privacy Policy Modal
const PrivacyPolicyModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black bg-opacity-50"
        onClick={onClose}
      ></div>
      <div className="relative w-full max-w-4xl max-h-[90vh] bg-white rounded-lg shadow-xl overflow-hidden">
        <div className="sticky top-0 bg-[#1a2a4f] px-6 py-4 flex justify-between items-center z-10">
          <div className="flex items-center gap-3">
            <FaShieldAlt className="text-white text-xl" />
            <h2 className="text-xl font-bold text-white">Privacy Policy</h2>
          </div>
          <button
            onClick={onClose}
            className="text-white hover:text-gray-300 text-2xl"
          >
            <FaTimes />
          </button>
        </div>
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-70px)] space-y-4 text-gray-700">
          <p className="text-sm">
            At{" "}
            <strong className="text-[#1a2a4f]">
              Joztembo Tours and Safari
            </strong>
            , we are committed to protecting your privacy.
          </p>
          <div>
            <h3 className="font-semibold text-[#1a2a4f] mb-2">
              1. Information We Collect
            </h3>
            <p className="text-sm text-gray-600">
              We collect personal information including name, email, phone
              number, and payment details when you use our services.
            </p>
          </div>
          <div>
            <h3 className="font-semibold text-[#1a2a4f] mb-2">
              2. How We Use Your Information
            </h3>
            <p className="text-sm text-gray-600">
              We use your information to process bookings, provide customer
              support, and improve our services.
            </p>
          </div>
          <div>
            <h3 className="font-semibold text-[#1a2a4f] mb-2">
              3. Information Sharing
            </h3>
            <p className="text-sm text-gray-600">
              We do not sell your personal information. We share data only with
              service providers to fulfill your bookings.
            </p>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg text-center text-sm text-gray-600">
            <p>Contact: privacy@joztembotours.com | +254 722 266 955</p>
          </div>
        </div>
      </div>
    </div>
  );
};

// Terms of Service Modal
const TermsModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black bg-opacity-50"
        onClick={onClose}
      ></div>
      <div className="relative w-full max-w-4xl max-h-[90vh] bg-white rounded-lg shadow-xl overflow-hidden">
        <div className="sticky top-0 bg-[#1a2a4f] px-6 py-4 flex justify-between items-center z-10">
          <div className="flex items-center gap-3">
            <FaGavel className="text-white text-xl" />
            <h2 className="text-xl font-bold text-white">Terms of Service</h2>
          </div>
          <button
            onClick={onClose}
            className="text-white hover:text-gray-300 text-2xl"
          >
            <FaTimes />
          </button>
        </div>
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-70px)] space-y-4 text-gray-700">
          <p className="text-sm">
            By using{" "}
            <strong className="text-[#1a2a4f]">
              Joztembo Tours and Safari
            </strong>{" "}
            services, you agree to these terms.
          </p>
          <div>
            <h3 className="font-semibold text-[#1a2a4f] mb-2">
              1. Booking and Payment
            </h3>
            <p className="text-sm text-gray-600">
              A 30% deposit is required to confirm bookings. Full payment due 30
              days before departure.
            </p>
          </div>
          <div>
            <h3 className="font-semibold text-[#1a2a4f] mb-2">
              2. Cancellation Policy
            </h3>
            <p className="text-sm text-gray-600">
              Cancellations 60+ days: 90% refund. 30-59 days: 50% refund. 15-29
              days: 25% refund. Less than 15 days: no refund.
            </p>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg text-center text-sm text-gray-600">
            <p>By booking with us, you acknowledge and agree to all terms.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

// Cookie Policy Modal
const CookiePolicyModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black bg-opacity-50"
        onClick={onClose}
      ></div>
      <div className="relative w-full max-w-2xl bg-white rounded-lg shadow-xl overflow-hidden">
        <div className="sticky top-0 bg-[#1a2a4f] px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <FaCookieBite className="text-white text-xl" />
            <h2 className="text-xl font-bold text-white">Cookie Policy</h2>
          </div>
          <button
            onClick={onClose}
            className="text-white hover:text-gray-300 text-2xl"
          >
            <FaTimes />
          </button>
        </div>
        <div className="p-6">
          <p className="text-gray-700">
            We use cookies to improve your experience on our website.
          </p>
        </div>
      </div>
    </div>
  );
};

// ============ USER PROFILE MODAL ============
const UserProfileModal = ({ isOpen, onClose }) => {
  const [user, setUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const { currentUser, logout } = useAuth();

  const [formData, setFormData] = useState({ name: "", email: "", phone: "" });
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmNewPassword: "",
  });

  const API_URL = "http://localhost:5000/api";

  useEffect(() => {
    if (isOpen && currentUser) loadUserProfile();
  }, [isOpen]);

  const loadUserProfile = async () => {
    const token = localStorage.getItem("access_token");
    if (!token) return;
    try {
      const response = await fetch(`${API_URL}/auth/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.ok) {
        const data = await response.json();
        setUser(data.user);
        setFormData({
          name: data.user.name || "",
          email: data.user.email || "",
          phone: data.user.phone || "",
        });
      }
    } catch (error) {
      console.error("Error loading profile:", error);
    }
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    const token = localStorage.getItem("access_token");
    try {
      const response = await fetch(`${API_URL}/users/profile`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Update failed");
      localStorage.setItem("user", JSON.stringify(data.user));
      setUser(data.user);
      setIsEditing(false);
      MySwal.fire({
        icon: "success",
        title: "Profile Updated!",
        timer: 2000,
        showConfirmButton: false,
      });
    } catch (error) {
      MySwal.fire({
        icon: "error",
        title: "Update Failed",
        text: error.message,
        confirmButtonColor: "#1a2a4f",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmNewPassword) {
      MySwal.fire({
        icon: "error",
        title: "Error",
        text: "New passwords don't match!",
      });
      return;
    }
    if (passwordData.newPassword.length < 6) {
      MySwal.fire({
        icon: "error",
        title: "Error",
        text: "Password must be at least 6 characters!",
      });
      return;
    }
    setIsLoading(true);
    const token = localStorage.getItem("access_token");
    try {
      const response = await fetch(`${API_URL}/users/change-password`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          current_password: passwordData.currentPassword,
          new_password: passwordData.newPassword,
        }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Password change failed");
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmNewPassword: "",
      });
      setIsChangingPassword(false);
      MySwal.fire({
        icon: "success",
        title: "Password Changed!",
        timer: 2000,
        showConfirmButton: false,
      });
    } catch (error) {
      MySwal.fire({
        icon: "error",
        title: "Failed",
        text: error.message,
        confirmButtonColor: "#1a2a4f",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    const result = await MySwal.fire({
      title: "Delete Account?",
      text: "This action cannot be undone.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#dc2626",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Yes, delete",
    });
    if (!result.isConfirmed) return;
    const { value: password } = await MySwal.fire({
      title: "Confirm Password",
      input: "password",
      inputLabel: "Enter your password to confirm",
      showCancelButton: true,
      confirmButtonColor: "#dc2626",
      inputValidator: (value) => !value && "Password required!",
    });
    if (!password) return;
    setIsLoading(true);
    const token = localStorage.getItem("access_token");
    try {
      const response = await fetch(`${API_URL}/users/account`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ password }),
      });
      const data = await response.json();
      if (!response.ok)
        throw new Error(data.error || "Account deletion failed");
      onClose();
      logout();
      MySwal.fire({
        icon: "success",
        title: "Account Deleted",
        timer: 2000,
        showConfirmButton: false,
      });
    } catch (error) {
      MySwal.fire({
        icon: "error",
        title: "Failed",
        text: error.message,
        confirmButtonColor: "#1a2a4f",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black bg-opacity-50"
        onClick={onClose}
      ></div>
      <div className="relative w-full max-w-md bg-white rounded-lg shadow-xl overflow-hidden">
        <div className="bg-[#1a2a4f] px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <FaUser className="text-white" />
            <h2 className="text-xl font-bold text-white">
              {user?.name || "Profile"}
            </h2>
          </div>
          <button onClick={onClose} className="text-white hover:text-gray-300">
            <FaTimes />
          </button>
        </div>
        <div className="p-6 max-h-[70vh] overflow-y-auto">
          {isEditing ? (
            <form onSubmit={handleUpdateProfile} className="space-y-4">
              <input
                type="text"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-[#1a2a4f] focus:border-[#1a2a4f]"
                placeholder="Full Name"
              />
              <input
                type="email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-[#1a2a4f] focus:border-[#1a2a4f]"
                placeholder="Email"
              />
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) =>
                  setFormData({ ...formData, phone: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-[#1a2a4f] focus:border-[#1a2a4f]"
                placeholder="Phone"
              />
              <div className="flex gap-3">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="flex-1 bg-[#1a2a4f] text-white py-2 rounded-md hover:bg-[#0f1a33]"
                >
                  Save
                </button>
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="px-4 bg-gray-200 text-gray-700 py-2 rounded-md hover:bg-gray-300"
                >
                  Cancel
                </button>
              </div>
            </form>
          ) : (
            <div className="space-y-3">
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-md">
                <FaEnvelope className="text-[#1a2a4f]" />
                <div>
                  <p className="text-xs text-gray-500">Email</p>
                  <p className="text-gray-800">
                    {user?.email || "Not provided"}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-md">
                <FaPhoneIcon className="text-[#1a2a4f]" />
                <div>
                  <p className="text-xs text-gray-500">Phone</p>
                  <p className="text-gray-800">
                    {user?.phone || "Not provided"}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsEditing(true)}
                className="w-full bg-[#1a2a4f] text-white py-2 rounded-md hover:bg-[#0f1a33]"
              >
                Edit Profile
              </button>
            </div>
          )}
          <div className="mt-6 pt-6 border-t">
            {isChangingPassword ? (
              <form onSubmit={handleChangePassword} className="space-y-3">
                <h3 className="font-semibold text-gray-800">Change Password</h3>
                <input
                  type="password"
                  value={passwordData.currentPassword}
                  onChange={(e) =>
                    setPasswordData({
                      ...passwordData,
                      currentPassword: e.target.value,
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  placeholder="Current password"
                  required
                />
                <input
                  type="password"
                  value={passwordData.newPassword}
                  onChange={(e) =>
                    setPasswordData({
                      ...passwordData,
                      newPassword: e.target.value,
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  placeholder="New password (min 6 chars)"
                  required
                />
                <input
                  type="password"
                  value={passwordData.confirmNewPassword}
                  onChange={(e) =>
                    setPasswordData({
                      ...passwordData,
                      confirmNewPassword: e.target.value,
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  placeholder="Confirm new password"
                  required
                />
                <div className="flex gap-3">
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="flex-1 bg-[#1a2a4f] text-white py-2 rounded-md hover:bg-[#0f1a33]"
                  >
                    Update
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsChangingPassword(false)}
                    className="px-4 bg-gray-200 text-gray-700 py-2 rounded-md"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            ) : (
              <button
                onClick={() => setIsChangingPassword(true)}
                className="w-full bg-gray-100 text-gray-700 py-2 rounded-md hover:bg-gray-200"
              >
                Change Password
              </button>
            )}
          </div>
          <div className="mt-6 pt-6 border-t">
            <h3 className="text-red-600 font-semibold mb-2">Danger Zone</h3>
            <button
              onClick={handleDeleteAccount}
              disabled={isLoading}
              className="w-full bg-red-600 text-white py-2 rounded-md hover:bg-red-700"
            >
              Delete Account
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// ============ AUTH MODAL ============
const AuthModal = ({ isOpen, onClose }) => {
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [loginData, setLoginData] = useState({ email: "", password: "" });
  const [signupData, setSignupData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });

  const API_URL = "http://localhost:5000/api";

  const validateLogin = () => {
    const newErrors = {};
    if (!loginData.email) newErrors.email = "Email required";
    else if (!/\S+@\S+\.\S+/.test(loginData.email))
      newErrors.email = "Invalid email";
    if (!loginData.password) newErrors.password = "Password required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateSignup = () => {
    const newErrors = {};
    if (!signupData.name) newErrors.name = "Name required";
    if (!signupData.email) newErrors.email = "Email required";
    else if (!/\S+@\S+\.\S+/.test(signupData.email))
      newErrors.email = "Invalid email";
    if (!signupData.password) newErrors.password = "Password required";
    else if (signupData.password.length < 6)
      newErrors.password = "Min 6 characters";
    if (signupData.password !== signupData.confirmPassword)
      newErrors.confirmPassword = "Passwords don't match";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!validateLogin()) return;
    setIsLoading(true);
    try {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(loginData),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Login failed");
      localStorage.setItem("access_token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      MySwal.fire({
        icon: "success",
        title: "Welcome!",
        timer: 1500,
        showConfirmButton: false,
      });
      onClose();
      dispatchAuthSync();
    } catch (error) {
      MySwal.fire({
        icon: "error",
        title: "Login Failed",
        text: error.message,
        confirmButtonColor: "#1a2a4f",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    if (!validateSignup()) return;
    setIsLoading(true);
    try {
      const response = await fetch(`${API_URL}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: signupData.name,
          email: signupData.email,
          password: signupData.password,
          phone: signupData.phone,
        }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Registration failed");
      localStorage.setItem("access_token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      MySwal.fire({
        icon: "success",
        title: "Account Created!",
        timer: 1500,
        showConfirmButton: false,
      });
      onClose();
      dispatchAuthSync();
    } catch (error) {
      MySwal.fire({
        icon: "error",
        title: "Registration Failed",
        text: error.message,
        confirmButtonColor: "#1a2a4f",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black bg-opacity-50"
        onClick={onClose}
      ></div>
      <div className="relative w-full max-w-md bg-white rounded-lg shadow-xl">
        <div className="bg-[#1a2a4f] px-6 py-4 flex justify-between items-center rounded-t-lg">
          <h2 className="text-xl font-bold text-white">
            {isLoginMode ? "Sign In" : "Sign Up"}
          </h2>
          <button onClick={onClose} className="text-white hover:text-gray-300">
            <FaTimes />
          </button>
        </div>
        <div className="p-6">
          <div className="flex gap-4 mb-6">
            <button
              onClick={() => setIsLoginMode(true)}
              className={`flex-1 py-2 text-center font-medium ${isLoginMode ? "text-[#1a2a4f] border-b-2 border-[#1a2a4f]" : "text-gray-400"}`}
            >
              Sign In
            </button>
            <button
              onClick={() => setIsLoginMode(false)}
              className={`flex-1 py-2 text-center font-medium ${!isLoginMode ? "text-[#1a2a4f] border-b-2 border-[#1a2a4f]" : "text-gray-400"}`}
            >
              Sign Up
            </button>
          </div>
          {isLoginMode ? (
            <form onSubmit={handleLogin} className="space-y-4">
              <input
                type="email"
                value={loginData.email}
                onChange={(e) =>
                  setLoginData({ ...loginData, email: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-[#1a2a4f] focus:border-[#1a2a4f]"
                placeholder="Email"
                required
              />
              {errors.email && (
                <p className="text-red-500 text-xs">{errors.email}</p>
              )}
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={loginData.password}
                  onChange={(e) =>
                    setLoginData({ ...loginData, password: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  placeholder="Password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-2.5 text-gray-400"
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
              {errors.password && (
                <p className="text-red-500 text-xs">{errors.password}</p>
              )}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-[#1a2a4f] text-white py-2 rounded-md hover:bg-[#0f1a33]"
              >
                {isLoading ? "Please wait..." : "Sign In"}
              </button>
            </form>
          ) : (
            <form onSubmit={handleSignup} className="space-y-3">
              <input
                type="text"
                value={signupData.name}
                onChange={(e) =>
                  setSignupData({ ...signupData, name: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                placeholder="Full Name"
                required
              />
              {errors.name && (
                <p className="text-red-500 text-xs">{errors.name}</p>
              )}
              <input
                type="email"
                value={signupData.email}
                onChange={(e) =>
                  setSignupData({ ...signupData, email: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                placeholder="Email"
                required
              />
              {errors.email && (
                <p className="text-red-500 text-xs">{errors.email}</p>
              )}
              <input
                type="tel"
                value={signupData.phone}
                onChange={(e) =>
                  setSignupData({ ...signupData, phone: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                placeholder="Phone (Optional)"
              />
              <input
                type="password"
                value={signupData.password}
                onChange={(e) =>
                  setSignupData({ ...signupData, password: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                placeholder="Password (min 6 chars)"
                required
              />
              {errors.password && (
                <p className="text-red-500 text-xs">{errors.password}</p>
              )}
              <input
                type="password"
                value={signupData.confirmPassword}
                onChange={(e) =>
                  setSignupData({
                    ...signupData,
                    confirmPassword: e.target.value,
                  })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                placeholder="Confirm Password"
                required
              />
              {errors.confirmPassword && (
                <p className="text-red-500 text-xs">{errors.confirmPassword}</p>
              )}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-[#1a2a4f] text-white py-2 rounded-md hover:bg-[#0f1a33]"
              >
                {isLoading ? "Creating..." : "Create Account"}
              </button>
            </form>
          )}
          <p className="text-center text-gray-500 text-sm mt-4">
            {isLoginMode
              ? "Don't have an account? "
              : "Already have an account? "}
            <button
              onClick={() => setIsLoginMode(!isLoginMode)}
              className="text-[#1a2a4f] hover:underline"
            >
              {isLoginMode ? "Sign Up" : "Sign In"}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

// ============ FOOTER COMPONENT ============
const Footer = () => {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [showPrivacyModal, setShowPrivacyModal] = useState(false);
  const [showTermsModal, setShowTermsModal] = useState(false);
  const [showCookieModal, setShowCookieModal] = useState(false);
  const { currentUser, logout } = useAuth();

  const handleAuthClick = () => {
    if (currentUser) {
      MySwal.fire({
        title: "Account",
        text: "What would you like to do?",
        icon: "question",
        showDenyButton: true,
        showCancelButton: true,
        confirmButtonText: "View Profile",
        denyButtonText: "Sign Out",
        confirmButtonColor: "#1a2a4f",
        denyButtonColor: "#6b7280",
      }).then((result) => {
        if (result.isConfirmed) setIsProfileModalOpen(true);
        else if (result.isDenied) {
          MySwal.fire({
            title: "Sign Out?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#1a2a4f",
          }).then((r) => {
            if (r.isConfirmed) {
              logout();
              MySwal.fire({
                title: "Signed Out!",
                timer: 1500,
                showConfirmButton: false,
              });
            }
          });
        }
      });
    } else {
      setIsAuthModalOpen(true);
    }
  };

  return (
    <>
      <footer className="bg-[#1a2a4f] text-white">
        <div className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="lg:col-span-2">
              <h3 className="text-2xl font-bold text-white mb-4">
                Jozz Tembo Tours and Safari
              </h3>
              <p className="text-white/80 mb-4 leading-relaxed">
                Driven by passion, guided by experience. With over 30 years of
                excellence in tourism and safari industry, we provide
                unforgettable African experiences from our base in Malindi.
              </p>
              <div className="flex space-x-4">
                <a
                  href="https://www.instagram.com/joztembotours/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white/70 hover:text-white transition-colors"
                >
                  <FaInstagram size={22} />
                </a>
                <a
                  href="#"
                  className="text-white/70 hover:text-white transition-colors"
                >
                  <FaFacebook size={22} />
                </a>
                <a
                  href="#"
                  className="text-white/70 hover:text-white transition-colors"
                >
                  <FaTwitter size={22} />
                </a>
              </div>
            </div>
            <div>
              <h4 className="text-lg font-semibold text-white mb-4">
                Our Services
              </h4>
              <ul className="space-y-2">
                {[
                  "Safari Adventures",
                  "Beach Tours",
                  "Cultural Experiences",
                  "Airport Transfers",
                  "Custom Packages",
                ].map((s, i) => (
                  <li key={i}>
                    <a
                      href="#"
                      className="text-white/70 hover:text-white transition-colors block py-1"
                    >
                      {s}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold text-white mb-4">
                Contact Us
              </h4>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <FaMapMarkerAlt className="text-white/70 mt-1" />
                  <span className="text-white/70">
                    Malindi, Lamu Road, Kenya
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <FaPhone className="text-white/70" />
                  <span className="text-white/70">+254 722 266 955</span>
                </div>
                <div className="flex items-center gap-3">
                  <FaEnvelope className="text-white/70" />
                  <span className="text-white/70">info@jozztembotours.com</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom bar with copyright and links */}
        <div className="border-t border-white/20 py-6">
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <p className="text-white/70 text-sm text-center md:text-left mb-4 md:mb-0">
                © {new Date().getFullYear()} Jozz Tembo Tours and Safari. All
                rights reserved.
              </p>
              <div className="flex flex-wrap justify-center items-center gap-6">
                <button
                  onClick={() => setShowPrivacyModal(true)}
                  className="text-white/70 hover:text-white transition-colors text-sm"
                >
                  Privacy Policy
                </button>
                <button
                  onClick={() => setShowTermsModal(true)}
                  className="text-white/70 hover:text-white transition-colors text-sm"
                >
                  Terms of Service
                </button>
                <button
                  onClick={() => setShowCookieModal(true)}
                  className="text-white/70 hover:text-white transition-colors text-sm"
                >
                  Cookie Policy
                </button>

                {/* Discreet dot button for Sign In/Profile */}
                <button
                  onClick={handleAuthClick}
                  className="group relative flex items-center justify-center w-6 h-6 rounded-full hover:bg-white/20 transition-all duration-300"
                  title={currentUser ? "Account Options" : "Sign In"}
                >
                  {currentUser ? (
                    <>
                      <span className="w-2 h-2 bg-green-400 rounded-full group-hover:scale-110 transition-transform"></span>
                      <span className="absolute opacity-0 group-hover:opacity-100 text-xs whitespace-nowrap bg-white/20 rounded-full px-2 py-0.5 -top-6 left-1/2 -translate-x-1/2 transition-opacity duration-300">
                        {currentUser.name?.split(" ")[0] || "Account"}
                      </span>
                    </>
                  ) : (
                    <>
                      <span className="w-2 h-2 bg-white/50 rounded-full group-hover:bg-white group-hover:scale-110 transition-all"></span>
                      <span className="absolute opacity-0 group-hover:opacity-100 text-xs whitespace-nowrap bg-white/20 rounded-full px-2 py-0.5 -top-6 left-1/2 -translate-x-1/2 transition-opacity duration-300">
                        Sign In
                      </span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </footer>

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
      />
      <UserProfileModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
      />
      <PrivacyPolicyModal
        isOpen={showPrivacyModal}
        onClose={() => setShowPrivacyModal(false)}
      />
      <TermsModal
        isOpen={showTermsModal}
        onClose={() => setShowTermsModal(false)}
      />
      <CookiePolicyModal
        isOpen={showCookieModal}
        onClose={() => setShowCookieModal(false)}
      />
    </>
  );
};

export default Footer;
