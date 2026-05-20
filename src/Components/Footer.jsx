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
    dispatchAuthSync(); // ✅ Sync with About page instead of reloading
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

// Professional Privacy Policy Modal
const PrivacyPolicyModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black bg-opacity-80 backdrop-blur-sm"
        onClick={onClose}
      ></div>
      <div className="relative w-full max-w-4xl max-h-[90vh] bg-white rounded-2xl shadow-2xl overflow-hidden">
        <div className="sticky top-0 bg-gray-900 px-6 py-4 border-b border-gray-200 flex justify-between items-center z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
              <FaShieldAlt className="text-blue-600 text-xl" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Privacy Policy</h2>
              <p className="text-gray-400 text-xs">
                Last updated:{" "}
                {new Date().toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-2xl w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-all duration-300"
          >
            <FaTimes />
          </button>
        </div>
        <div className="p-8 overflow-y-auto max-h-[calc(90vh-70px)] space-y-6 text-gray-700">
          <div className="bg-blue-50 p-4 rounded-lg border-l-4 border-blue-600">
            <p className="text-sm text-gray-700">
              At{" "}
              <strong className="text-blue-600">
                Joztembo Tours and Safari
              </strong>
              , we are committed to protecting your privacy. This Privacy Policy
              explains how we collect, use, and safeguard your information when
              you use our services.
            </p>
          </div>
          <section>
            <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <FaDatabase className="text-blue-600" /> 1. Information We Collect
            </h3>
            <div className="space-y-3 ml-6">
              <div className="flex items-start gap-3">
                <FaCheckCircle className="text-green-600 mt-1 flex-shrink-0 text-sm" />
                <div>
                  <strong className="text-gray-900">
                    Personal Identification Information:
                  </strong>
                  <p className="text-sm text-gray-600">
                    Full name, email address, phone number, passport details,
                    date of birth, and nationality.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <FaCheckCircle className="text-green-600 mt-1 flex-shrink-0 text-sm" />
                <div>
                  <strong className="text-gray-900">
                    Payment Information:
                  </strong>
                  <p className="text-sm text-gray-600">
                    Credit/debit card details, billing address, and transaction
                    history (processed securely via PCI-compliant gateways).
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <FaCheckCircle className="text-green-600 mt-1 flex-shrink-0 text-sm" />
                <div>
                  <strong className="text-gray-900">Travel Preferences:</strong>
                  <p className="text-sm text-gray-600">
                    Dietary restrictions, accommodation preferences, special
                    requests, and activity interests.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <FaCheckCircle className="text-green-600 mt-1 flex-shrink-0 text-sm" />
                <div>
                  <strong className="text-gray-900">Technical Data:</strong>
                  <p className="text-sm text-gray-600">
                    IP address, browser type, device information, pages visited,
                    and cookies.
                  </p>
                </div>
              </div>
            </div>
          </section>
          <section>
            <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <FaChartLine className="text-blue-600" /> 2. How We Use Your
              Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 ml-6">
              <div className="bg-gray-50 p-3 rounded-lg">
                <h4 className="font-semibold text-gray-900 text-sm">
                  Service Delivery
                </h4>
                <p className="text-xs text-gray-600">
                  Process bookings, manage reservations, and provide customer
                  support.
                </p>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg">
                <h4 className="font-semibold text-gray-900 text-sm">
                  Communication
                </h4>
                <p className="text-xs text-gray-600">
                  Send confirmations, updates, and respond to inquiries.
                </p>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg">
                <h4 className="font-semibold text-gray-900 text-sm">
                  Marketing (with consent)
                </h4>
                <p className="text-xs text-gray-600">
                  Send newsletters, special offers, and personalized
                  recommendations.
                </p>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg">
                <h4 className="font-semibold text-gray-900 text-sm">
                  Legal Compliance
                </h4>
                <p className="text-xs text-gray-600">
                  Comply with applicable laws and regulations.
                </p>
              </div>
            </div>
          </section>
          <section>
            <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <FaHandshake className="text-blue-600" /> 3. Information Sharing
            </h3>
            <p className="text-sm text-gray-600 ml-6">
              We do not sell your personal information. We may share your data
              with:
            </p>
            <ul className="list-disc list-inside mt-2 space-y-1 text-sm text-gray-600 ml-10">
              <li>
                Service providers (hotels, lodges, transport companies, guides)
                to fulfill your bookings
              </li>
              <li>Payment processors to complete transactions securely</li>
              <li>
                Legal authorities when required by law or to protect our rights
              </li>
              <li>Business partners with your explicit consent</li>
            </ul>
          </section>
          <section>
            <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <FaShieldVirus className="text-blue-600" /> 4. Data Security
            </h3>
            <div className="bg-gray-50 p-4 rounded-lg ml-6">
              <p className="text-sm text-gray-600 mb-2">
                We implement industry-standard security measures:
              </p>
              <div className="flex flex-wrap gap-3">
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  ✓ SSL Encryption
                </span>
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  ✓ PCI DSS Compliant
                </span>
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  ✓ Regular Security Audits
                </span>
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  ✓ Secure Data Centers
                </span>
              </div>
            </div>
          </section>
          <section>
            <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <FaUserSecret className="text-blue-600" /> 5. Your Privacy Rights
            </h3>
            <div className="bg-blue-50 p-4 rounded-lg ml-6">
              <p className="text-sm text-gray-700 mb-2">
                Depending on your location, you have the right to:
              </p>
              <ul className="grid grid-cols-2 gap-2 text-sm text-gray-700">
                <li>• Access your personal data</li>
                <li>• Correct inaccurate data</li>
                <li>• Request deletion of your data</li>
                <li>• Object to processing</li>
                <li>• Data portability</li>
                <li>• Withdraw consent</li>
              </ul>
            </div>
          </section>
          <div className="bg-gray-900 text-white p-4 rounded-lg">
            <h3 className="font-semibold mb-2 flex items-center gap-2">
              📞 Contact Us
            </h3>
            <p className="text-sm text-gray-300">
              If you have questions about this Privacy Policy:
            </p>
            <div className="mt-2 text-sm space-y-1">
              <p>
                Email:{" "}
                <a
                  href="mailto:privacy@joztembotours.com"
                  className="text-blue-400 hover:underline"
                >
                  privacy@joztembotours.com
                </a>
              </p>
              <p>Phone: +254 722 266 955</p>
              <p>Address: Malindi, Lamu Road, Kenya</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Professional Terms of Service Modal
const TermsModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black bg-opacity-80 backdrop-blur-sm"
        onClick={onClose}
      ></div>
      <div className="relative w-full max-w-4xl max-h-[90vh] bg-white rounded-2xl shadow-2xl overflow-hidden">
        <div className="sticky top-0 bg-gray-900 px-6 py-4 border-b border-gray-200 flex justify-between items-center z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
              <FaGavel className="text-purple-600 text-xl" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Terms of Service</h2>
              <p className="text-gray-400 text-xs">
                Effective Date:{" "}
                {new Date().toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-2xl w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-all duration-300"
          >
            <FaTimes />
          </button>
        </div>
        <div className="p-8 overflow-y-auto max-h-[calc(90vh-70px)] space-y-6 text-gray-700">
          <div className="bg-purple-50 p-4 rounded-lg border-l-4 border-purple-600">
            <p className="text-sm text-gray-700">
              By accessing or using{" "}
              <strong className="text-purple-600">
                Joztembo Tours and Safari
              </strong>{" "}
              services, you agree to be bound by these Terms of Service. Please
              read them carefully.
            </p>
          </div>
          <section>
            <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <FaCreditCard className="text-purple-600" /> 1. Booking and
              Payment Terms
            </h3>
            <div className="space-y-3 ml-6">
              <div className="flex items-start gap-3">
                <FaCheckCircle className="text-green-600 mt-1 flex-shrink-0 text-sm" />
                <div>
                  <strong className="text-gray-900">
                    Deposit Requirement:
                  </strong>
                  <p className="text-sm text-gray-600">
                    A non-refundable deposit of 30% is required to confirm all
                    bookings. Full payment must be completed 30 days before
                    departure.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <FaCheckCircle className="text-green-600 mt-1 flex-shrink-0 text-sm" />
                <div>
                  <strong className="text-gray-900">Payment Methods:</strong>
                  <p className="text-sm text-gray-600">
                    We accept Visa, Mastercard, American Express, bank
                    transfers, and M-Pesa. All payments are processed in USD or
                    KES.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <FaCheckCircle className="text-green-600 mt-1 flex-shrink-0 text-sm" />
                <div>
                  <strong className="text-gray-900">Price Confirmation:</strong>
                  <p className="text-sm text-gray-600">
                    Prices are subject to change until full payment is received.
                    Once paid, your price is guaranteed.
                  </p>
                </div>
              </div>
            </div>
          </section>
          <section>
            <h3 className="text-lg font-semibold text-gray-900 mb-3">
              2. Cancellation and Refund Policy
            </h3>
            <div className="overflow-x-auto ml-6">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="border border-gray-300 px-4 py-2 text-left">
                      Cancellation Notice
                    </th>
                    <th className="border border-gray-300 px-4 py-2 text-left">
                      Refund Amount
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="border border-gray-300 px-4 py-2">
                      60+ days before departure
                    </td>
                    <td className="border border-gray-300 px-4 py-2">
                      90% (excluding deposit)
                    </td>
                  </tr>
                  <tr>
                    <td className="border border-gray-300 px-4 py-2">
                      30-59 days before departure
                    </td>
                    <td className="border border-gray-300 px-4 py-2">50%</td>
                  </tr>
                  <tr>
                    <td className="border border-gray-300 px-4 py-2">
                      15-29 days before departure
                    </td>
                    <td className="border border-gray-300 px-4 py-2">25%</td>
                  </tr>
                  <tr>
                    <td className="border border-gray-300 px-4 py-2">
                      Less than 15 days
                    </td>
                    <td className="border border-gray-300 px-4 py-2">
                      No refund
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p className="text-xs text-gray-500 mt-2 ml-6">
              * All cancellations must be in writing via email. Refunds
              processed within 14 business days.
            </p>
          </section>
          <div className="bg-purple-100 border border-purple-300 rounded-lg p-4">
            <p className="text-purple-800 text-sm font-medium text-center">
              By booking with Jozz Tembo Tours and Safari, you acknowledge that
              you have read, understood, and agree to all terms and conditions
              outlined above.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

// Professional Cookie Policy Modal
const CookiePolicyModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black bg-opacity-80 backdrop-blur-sm"
        onClick={onClose}
      ></div>
      <div className="relative w-full max-w-4xl max-h-[90vh] bg-white rounded-2xl shadow-2xl overflow-hidden">
        <div className="sticky top-0 bg-gray-900 px-6 py-4 border-b border-gray-200 flex justify-between items-center z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
              <FaCookieBite className="text-orange-600 text-xl" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Cookie Policy</h2>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-2xl w-8 h-8 flex items-center justify-center rounded-full"
          >
            <FaTimes />
          </button>
        </div>
        <div className="p-8 overflow-y-auto max-h-[calc(90vh-70px)]">
          <p className="text-gray-700">
            Cookie Policy content - we use cookies to improve your experience.
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
        background: "#1f2937",
        color: "white",
      });
    } catch (error) {
      MySwal.fire({
        icon: "error",
        title: "Update Failed",
        text: error.message,
        background: "#1f2937",
        color: "white",
        confirmButtonColor: "#f59e0b",
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
        background: "#1f2937",
        color: "white",
      });
      return;
    }
    if (passwordData.newPassword.length < 6) {
      MySwal.fire({
        icon: "error",
        title: "Error",
        text: "New password must be at least 6 characters!",
        background: "#1f2937",
        color: "white",
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
        background: "#1f2937",
        color: "white",
      });
    } catch (error) {
      MySwal.fire({
        icon: "error",
        title: "Failed",
        text: error.message,
        background: "#1f2937",
        color: "white",
        confirmButtonColor: "#f59e0b",
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
      confirmButtonText: "Yes, delete my account",
      background: "#1f2937",
      color: "white",
    });
    if (!result.isConfirmed) return;
    const { value: password } = await MySwal.fire({
      title: "Enter Password to Confirm",
      input: "password",
      inputLabel: "Your password",
      showCancelButton: true,
      confirmButtonColor: "#dc2626",
      background: "#1f2937",
      color: "white",
      inputValidator: (value) => {
        if (!value) return "You need to enter your password!";
      },
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
      logout(); // ✅ Now dispatches authChange event
      MySwal.fire({
        icon: "success",
        title: "Account Deleted",
        timer: 2000,
        showConfirmButton: false,
        background: "#1f2937",
        color: "white",
      });
    } catch (error) {
      MySwal.fire({
        icon: "error",
        title: "Failed",
        text: error.message,
        background: "#1f2937",
        color: "white",
        confirmButtonColor: "#f59e0b",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black bg-opacity-70 backdrop-blur-sm"
        onClick={onClose}
      ></div>
      <div className="relative w-full max-w-lg bg-gray-800 rounded-2xl shadow-2xl overflow-hidden border border-gray-700">
        <div className="bg-gradient-to-r from-yellow-600 to-yellow-500 px-6 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-14 h-14 bg-white rounded-full flex items-center justify-center">
                <FaUser className="text-yellow-600 text-xl" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">
                  {user?.name || "User Profile"}
                </h2>
                <p className="text-yellow-100 text-sm">{user?.email || ""}</p>
                {user?.is_admin && (
                  <span className="inline-flex items-center px-2 py-0.5 mt-1 rounded-full text-xs font-medium bg-white text-yellow-700">
                    <FaUserShield className="mr-1" /> Admin
                  </span>
                )}
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-white hover:text-gray-200 text-2xl w-8 h-8 flex items-center justify-center rounded-full"
            >
              <FaTimes />
            </button>
          </div>
        </div>
        <div className="p-6 max-h-[70vh] overflow-y-auto">
          {isEditing ? (
            <form onSubmit={handleUpdateProfile} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Phone
                </label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) =>
                    setFormData({ ...formData, phone: e.target.value })
                  }
                  className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white"
                />
              </div>
              <div className="flex space-x-3 pt-2">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="flex-1 py-3 bg-yellow-600 text-white font-semibold rounded-lg hover:bg-yellow-700 disabled:opacity-50"
                >
                  <FaSave className="mr-2 inline" />
                  {isLoading ? "Saving..." : "Save Changes"}
                </button>
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
                >
                  Cancel
                </button>
              </div>
            </form>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center space-x-3 p-3 bg-gray-700 rounded-lg">
                <FaEnvelope className="text-yellow-500" />
                <div>
                  <p className="text-xs text-gray-400">Email</p>
                  <p className="text-white">{user?.email || "Not provided"}</p>
                </div>
              </div>
              <div className="flex items-center space-x-3 p-3 bg-gray-700 rounded-lg">
                <FaPhoneIcon className="text-yellow-500" />
                <div>
                  <p className="text-xs text-gray-400">Phone</p>
                  <p className="text-white">{user?.phone || "Not provided"}</p>
                </div>
              </div>
              <button
                onClick={() => setIsEditing(true)}
                className="w-full py-3 bg-yellow-600 text-white font-semibold rounded-lg hover:bg-yellow-700"
              >
                <FaEdit className="mr-2 inline" />
                Edit Profile
              </button>
            </div>
          )}
          <div className="mt-6 pt-6 border-t border-gray-700">
            {isChangingPassword ? (
              <form onSubmit={handleChangePassword} className="space-y-4">
                <h3 className="text-lg font-semibold text-white mb-2">
                  Change Password
                </h3>
                <div>
                  <input
                    type="password"
                    value={passwordData.currentPassword}
                    onChange={(e) =>
                      setPasswordData({
                        ...passwordData,
                        currentPassword: e.target.value,
                      })
                    }
                    required
                    className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white"
                    placeholder="Current password"
                  />
                </div>
                <div>
                  <input
                    type="password"
                    value={passwordData.newPassword}
                    onChange={(e) =>
                      setPasswordData({
                        ...passwordData,
                        newPassword: e.target.value,
                      })
                    }
                    required
                    minLength={6}
                    className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white"
                    placeholder="New password (min. 6 characters)"
                  />
                </div>
                <div>
                  <input
                    type="password"
                    value={passwordData.confirmNewPassword}
                    onChange={(e) =>
                      setPasswordData({
                        ...passwordData,
                        confirmNewPassword: e.target.value,
                      })
                    }
                    required
                    className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white"
                    placeholder="Confirm new password"
                  />
                </div>
                <div className="flex space-x-3">
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="flex-1 py-3 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 disabled:opacity-50"
                  >
                    {isLoading ? "Updating..." : "Update Password"}
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsChangingPassword(false)}
                    className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            ) : (
              <button
                onClick={() => setIsChangingPassword(true)}
                className="w-full py-3 bg-gray-700 text-white rounded-lg hover:bg-gray-600"
              >
                <FaLock className="mr-2 inline" />
                Change Password
              </button>
            )}
          </div>
          <div className="mt-6 pt-6 border-t border-gray-700">
            <h3 className="text-lg font-semibold text-red-400 mb-3">
              Danger Zone
            </h3>
            <button
              onClick={handleDeleteAccount}
              disabled={isLoading}
              className="w-full py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50"
            >
              <FaTrash className="mr-2 inline" />
              Delete Account
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// ============ AUTH MODAL (Sign In / Sign Up) ============
const AuthModal = ({ isOpen, onClose }) => {
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showPrivacyModal, setShowPrivacyModal] = useState(false);
  const [showTermsModal, setShowTermsModal] = useState(false);
  const [showCookieModal, setShowCookieModal] = useState(false);
  const [errors, setErrors] = useState({});

  const [loginData, setLoginData] = useState({ email: "", password: "" });
  const [signupData, setSignupData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });

  const loginEmailRef = useRef(null);
  const loginPasswordRef = useRef(null);
  const signupNameRef = useRef(null);
  const signupEmailRef = useRef(null);
  const signupPhoneRef = useRef(null);
  const signupPasswordRef = useRef(null);
  const signupConfirmPasswordRef = useRef(null);

  const API_URL = "http://localhost:5000/api";

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        if (isLoginMode && loginEmailRef.current) loginEmailRef.current.focus();
        else if (!isLoginMode && signupNameRef.current)
          signupNameRef.current.focus();
      }, 100);
    }
  }, [isOpen, isLoginMode]);

  useEffect(() => {
    setErrors({});
  }, [isLoginMode]);

  const handleLoginChange = (e) => {
    setLoginData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    if (errors[e.target.name])
      setErrors((prev) => ({ ...prev, [e.target.name]: null }));
  };
  const handleSignupChange = (e) => {
    setSignupData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    if (errors[e.target.name])
      setErrors((prev) => ({ ...prev, [e.target.name]: null }));
  };

  const validateLoginForm = () => {
    const newErrors = {};
    if (!loginData.email.trim()) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(loginData.email))
      newErrors.email = "Invalid email format";
    if (!loginData.password) newErrors.password = "Password is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateSignupForm = () => {
    const newErrors = {};
    if (!signupData.name.trim()) newErrors.name = "Full name is required";
    if (!signupData.email.trim()) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(signupData.email))
      newErrors.email = "Invalid email format";
    if (!signupData.password) newErrors.password = "Password is required";
    else if (signupData.password.length < 6)
      newErrors.password = "Password must be at least 6 characters";
    if (signupData.password !== signupData.confirmPassword)
      newErrors.confirmPassword = "Passwords don't match";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleKeyDown = (e, nextFieldRef) => {
    if (e.key === "Enter") {
      e.preventDefault();
      if (nextFieldRef?.current) nextFieldRef.current.focus();
      else
        e.target
          .closest("form")
          ?.querySelector('button[type="submit"]')
          ?.click();
    }
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    if (!validateLoginForm()) return;
    setIsLoading(true);
    try {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: loginData.email,
          password: loginData.password,
        }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Login failed");
      localStorage.setItem("access_token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      MySwal.fire({
        icon: "success",
        title: "Welcome Back! 🎉",
        text: `Welcome back, ${data.user.name}!`,
        showConfirmButton: false,
        timer: 1500,
        background: "#1f2937",
        color: "white",
      });
      onClose();
      dispatchAuthSync(); // ✅ Sync with About page
    } catch (error) {
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
    if (!validateSignupForm()) return;
    setIsLoading(true);
    try {
      const response = await fetch(`${API_URL}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: signupData.name,
          email: signupData.email,
          password: signupData.password,
          phone: signupData.phone || "",
        }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Registration failed");
      localStorage.setItem("access_token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      MySwal.fire({
        icon: "success",
        title: "Account Created! 🎉",
        text: `Welcome to Joztembo Tours, ${data.user.name}!`,
        showConfirmButton: false,
        timer: 1500,
        background: "#1f2937",
        color: "white",
      });
      onClose();
      dispatchAuthSync(); // ✅ Sync with About page
    } catch (error) {
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

  const handleGoogleAuth = async () => {
    MySwal.fire({
      icon: "info",
      title: "Coming Soon",
      text: "Google authentication will be available soon!",
      background: "#1f2937",
      color: "white",
      confirmButtonColor: "#f59e0b",
    });
  };

  const handleModeSwitch = (newMode) => {
    if (newMode !== isLoginMode) {
      setIsLoginMode(newMode);
      setErrors({});
      if (newMode)
        setSignupData({
          name: "",
          email: "",
          phone: "",
          password: "",
          confirmPassword: "",
        });
      else setLoginData({ email: "", password: "" });
      setShowPassword(false);
      setShowConfirmPassword(false);
    }
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div
          className="absolute inset-0 bg-black bg-opacity-70 backdrop-blur-sm"
          onClick={onClose}
        ></div>
        <div className="relative w-full max-w-4xl bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl shadow-2xl overflow-hidden border border-gray-700">
          <button
            onClick={onClose}
            className="absolute right-4 top-4 z-20 text-gray-400 hover:text-white text-2xl w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-700"
          >
            ×
          </button>
          <div className="flex">
            <div className="hidden md:flex flex-col justify-center p-12 bg-gradient-to-br from-yellow-600 to-yellow-700 text-white w-2/5 relative overflow-hidden">
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
                  {[
                    "Exclusive Safari Deals",
                    "Personalized Itineraries",
                    "24/7 Support",
                  ].map((item, i) => (
                    <div key={i} className="flex items-center">
                      <div className="w-8 h-8 rounded-full bg-yellow-500 flex items-center justify-center mr-3">
                        <span className="text-sm">✓</span>
                      </div>
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="flex-1 p-8 md:p-12">
              <div className="flex mb-8">
                <button
                  onClick={() => handleModeSwitch(true)}
                  className={`flex-1 py-3 text-center font-medium transition-all duration-300 ${isLoginMode ? "text-yellow-500 border-b-2 border-yellow-500" : "text-gray-400 hover:text-gray-300"}`}
                >
                  Sign In
                </button>
                <button
                  onClick={() => handleModeSwitch(false)}
                  className={`flex-1 py-3 text-center font-medium transition-all duration-300 ${!isLoginMode ? "text-yellow-500 border-b-2 border-yellow-500" : "text-gray-400 hover:text-gray-300"}`}
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
                    <form onSubmit={handleLoginSubmit} className="space-y-5">
                      <div>
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
                            onKeyDown={(e) =>
                              handleKeyDown(e, loginPasswordRef)
                            }
                            required
                            className={`w-full pl-10 pr-4 py-3 bg-gray-800 border ${errors.email ? "border-red-500" : "border-gray-700"} rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-yellow-500`}
                            placeholder="Enter your email"
                          />
                          {errors.email && (
                            <p className="text-red-400 text-xs mt-1">
                              {errors.email}
                            </p>
                          )}
                        </div>
                      </div>
                      <div>
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
                            required
                            className={`w-full pl-10 pr-12 py-3 bg-gray-800 border ${errors.password ? "border-red-500" : "border-gray-700"} rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-yellow-500`}
                            placeholder="Enter your password"
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-yellow-400"
                          >
                            {showPassword ? <FaEyeSlash /> : <FaEye />}
                          </button>
                          {errors.password && (
                            <p className="text-red-400 text-xs mt-1">
                              {errors.password}
                            </p>
                          )}
                        </div>
                      </div>
                      <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full py-3 bg-gradient-to-r from-yellow-500 to-yellow-600 text-white font-semibold rounded-lg hover:from-yellow-600 hover:to-yellow-700 disabled:opacity-50"
                      >
                        {isLoading ? "Signing in..." : "Sign In"}
                      </button>
                    </form>
                  </div>
                  {/* Signup Form */}
                  <div className="min-w-full pl-4">
                    <form onSubmit={handleSignupSubmit} className="space-y-5">
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          Full Name *
                        </label>
                        <div className="relative">
                          <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                            <FaUserIcon />
                          </div>
                          <input
                            ref={signupNameRef}
                            type="text"
                            name="name"
                            value={signupData.name}
                            onChange={handleSignupChange}
                            onKeyDown={(e) => handleKeyDown(e, signupEmailRef)}
                            required
                            className={`w-full pl-10 pr-4 py-3 bg-gray-800 border ${errors.name ? "border-red-500" : "border-gray-700"} rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-yellow-500`}
                            placeholder="Enter your full name"
                          />
                          {errors.name && (
                            <p className="text-red-400 text-xs mt-1">
                              {errors.name}
                            </p>
                          )}
                        </div>
                      </div>
                      <div>
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
                            className={`w-full pl-10 pr-4 py-3 bg-gray-800 border ${errors.email ? "border-red-500" : "border-gray-700"} rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-yellow-500`}
                            placeholder="Enter your email"
                          />
                          {errors.email && (
                            <p className="text-red-400 text-xs mt-1">
                              {errors.email}
                            </p>
                          )}
                        </div>
                      </div>
                      <div>
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
                            onKeyDown={(e) =>
                              handleKeyDown(e, signupPasswordRef)
                            }
                            className="w-full pl-10 pr-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-yellow-500"
                            placeholder="+254 xxx xxx xxx"
                          />
                        </div>
                      </div>
                      <div>
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
                            className={`w-full pl-10 pr-12 py-3 bg-gray-800 border ${errors.password ? "border-red-500" : "border-gray-700"} rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-yellow-500`}
                            placeholder="Create a password (min. 6 characters)"
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-yellow-400"
                          >
                            {showPassword ? <FaEyeSlash /> : <FaEye />}
                          </button>
                          {errors.password && (
                            <p className="text-red-400 text-xs mt-1">
                              {errors.password}
                            </p>
                          )}
                        </div>
                      </div>
                      <div>
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
                            required
                            className={`w-full pl-10 pr-12 py-3 bg-gray-800 border ${errors.confirmPassword ? "border-red-500" : "border-gray-700"} rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-yellow-500`}
                            placeholder="Confirm your password"
                          />
                          <button
                            type="button"
                            onClick={() =>
                              setShowConfirmPassword(!showConfirmPassword)
                            }
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-yellow-400"
                          >
                            {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                          </button>
                          {errors.confirmPassword && (
                            <p className="text-red-400 text-xs mt-1">
                              {errors.confirmPassword}
                            </p>
                          )}
                        </div>
                      </div>
                      <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full py-3 bg-gradient-to-r from-yellow-500 to-yellow-600 text-white font-semibold rounded-lg hover:from-yellow-600 hover:to-yellow-700 disabled:opacity-50"
                      >
                        {isLoading ? "Creating account..." : "Create Account"}
                      </button>
                    </form>
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
        title: "Account Options",
        text: "What would you like to do?",
        icon: "question",
        showDenyButton: true,
        showCancelButton: true,
        confirmButtonText: "View Profile",
        denyButtonText: "Sign Out",
        cancelButtonText: "Cancel",
        background: "#1f2937",
        color: "white",
        confirmButtonColor: "#f59e0b",
        denyButtonColor: "#6b7280",
        cancelButtonColor: "#4b5563",
      }).then((result) => {
        if (result.isConfirmed) {
          setIsProfileModalOpen(true);
        } else if (result.isDenied) {
          MySwal.fire({
            title: "Sign Out?",
            text: "Are you sure you want to sign out?",
            icon: "warning",
            showCancelButton: true,
            background: "#1f2937",
            color: "white",
            confirmButtonColor: "#f59e0b",
            cancelButtonColor: "#6b7280",
          }).then((result) => {
            if (result.isConfirmed) {
              logout(); // ✅ Now dispatches authChange event
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
                  className="text-gray-400 hover:text-yellow-400"
                >
                  <FaInstagram size={24} />
                </a>
                <a href="#" className="text-gray-400 hover:text-yellow-400">
                  <FaFacebook size={24} />
                </a>
                <a href="#" className="text-gray-400 hover:text-yellow-400">
                  <FaTwitter size={24} />
                </a>
              </div>
            </div>
            <div>
              <h4 className="text-lg font-semibold text-yellow-400 mb-4">
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
                      className="text-gray-300 hover:text-white block py-1"
                    >
                      {s}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold text-yellow-400 mb-4">
                Contact Us
              </h4>
              <div className="space-y-3">
                <div className="flex items-start space-x-3">
                  <FaMapMarkerAlt className="text-yellow-400 mt-1" />
                  <span className="text-gray-300">
                    Malindi, Lamu Road
                    <br />
                    Kenya
                  </span>
                </div>
                <div className="flex items-center space-x-3">
                  <FaPhone className="text-yellow-400" />
                  <span className="text-gray-300">+254 722 266 955</span>
                </div>
                <div className="flex items-center space-x-3">
                  <FaEnvelope className="text-yellow-400" />
                  <span className="text-gray-300">info@jozztembotours.com</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="bg-gradient-to-r from-yellow-600 to-yellow-500 py-4">
          <div className="container mx-auto px-4 text-center">
            <p className="text-white text-lg font-semibold">
              🦁 Over 30 Years of Safari Excellence | Trusted Since 1993 🦒
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
              <div className="flex items-center space-x-6">
                <button
                  onClick={() => setShowPrivacyModal(true)}
                  className="text-gray-400 hover:text-white text-sm"
                >
                  Privacy Policy
                </button>
                <button
                  onClick={() => setShowTermsModal(true)}
                  className="text-gray-400 hover:text-white text-sm"
                >
                  Terms of Service
                </button>
                <button
                  onClick={() => setShowCookieModal(true)}
                  className="text-gray-400 hover:text-white text-sm"
                >
                  Cookie Policy
                </button>
                <button
                  onClick={handleAuthClick}
                  className="text-gray-400 hover:text-yellow-400 transition-all flex items-center gap-2"
                  title={currentUser ? "Account Options" : "Sign In"}
                >
                  {currentUser ? (
                    <>
                      <span className="inline-block w-2 h-2 bg-green-500 rounded-full"></span>
                      <FaUser className="text-sm" />
                    </>
                  ) : (
                    <span className="opacity-50 hover:opacity-100">●</span>
                  )}
                </button>
              </div>
            </div>
            {currentUser && (
              <div className="text-center mt-2">
                <span className="text-gray-600 text-xs flex items-center justify-center gap-1">
                  <span className="inline-block w-1.5 h-1.5 bg-green-500 rounded-full"></span>
                  <span className="opacity-50">{currentUser.email}</span>
                </span>
              </div>
            )}
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
