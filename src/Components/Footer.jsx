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
          {/* Introduction */}
          <div className="bg-blue-50 p-4 rounded-lg border-l-4 border-blue-600">
            <p className="text-sm text-gray-700">
              At{" "}
              <strong className="text-blue-600">
                Jozz Tembo Tours and Safari
              </strong>
              , we are committed to protecting your privacy. This Privacy Policy
              explains how we collect, use, and safeguard your information when
              you use our services.
            </p>
          </div>

          {/* Information Collection */}
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

          {/* How We Use Information */}
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

          {/* Data Sharing */}
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

          {/* Data Security */}
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

          {/* Your Rights */}
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

          {/* Contact */}
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
                  href="mailto:privacy@jozztembotours.com"
                  className="text-blue-400 hover:underline"
                >
                  privacy@jozztembotours.com
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
          {/* Agreement */}
          <div className="bg-purple-50 p-4 rounded-lg border-l-4 border-purple-600">
            <p className="text-sm text-gray-700">
              By accessing or using{" "}
              <strong className="text-purple-600">
                Jozz Tembo Tours and Safari
              </strong>{" "}
              services, you agree to be bound by these Terms of Service. Please
              read them carefully.
            </p>
          </div>

          {/* Booking Terms */}
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

          {/* Cancellation Policy */}
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

          {/* Travel Requirements */}
          <section>
            <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <FaPlane className="text-purple-600" /> 3. Travel Requirements
            </h3>
            <ul className="list-disc list-inside space-y-1 text-sm text-gray-600 ml-10">
              <li>
                Valid passport with at least 6 months validity from travel date
              </li>
              <li>
                Appropriate visas for Kenya and any other countries visited
              </li>
              <li>Required vaccinations (Yellow Fever, COVID-19, etc.)</li>
              <li>Comprehensive travel insurance (strongly recommended)</li>
              <li>Signed waiver and health declaration form</li>
            </ul>
          </section>

          {/* Liability */}
          <section>
            <h3 className="text-lg font-semibold text-gray-900 mb-3">
              4. Limitation of Liability
            </h3>
            <div className="bg-yellow-50 p-4 rounded-lg ml-6">
              <p className="text-sm text-gray-700">
                Jozz Tembo Tours and Safari acts as an intermediary. We are not
                liable for:
              </p>
              <ul className="list-disc list-inside mt-2 space-y-1 text-sm text-gray-600 ml-4">
                <li>
                  Injuries, damages, or losses caused by third-party providers
                </li>
                <li>
                  Weather conditions, natural disasters, or force majeure events
                </li>
                <li>Loss of personal belongings or valuables</li>
                <li>
                  Delays, cancellations, or changes by airlines or other
                  carriers
                </li>
                <li>Medical expenses or evacuation costs</li>
              </ul>
              <p className="text-sm text-gray-700 mt-3">
                Our total liability is limited to the amount paid for the
                specific service in question.
              </p>
            </div>
          </section>

          {/* User Conduct */}
          <section>
            <h3 className="text-lg font-semibold text-gray-900 mb-3">
              5. User Conduct
            </h3>
            <p className="text-sm text-gray-600 ml-6">You agree to:</p>
            <ul className="list-disc list-inside mt-2 space-y-1 text-sm text-gray-600 ml-10">
              <li>Provide accurate and complete information when booking</li>
              <li>
                Respect local customs, wildlife, and environment during tours
              </li>
              <li>Follow safety instructions from guides and staff</li>
              <li>Not engage in illegal activities or disruptive behavior</li>
            </ul>
          </section>

          {/* Governing Law */}
          <section>
            <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <FaGlobe className="text-purple-600" /> 6. Governing Law
            </h3>
            <p className="text-sm text-gray-600 ml-6">
              These Terms are governed by the laws of Kenya. Any disputes shall
              be resolved in the courts of Malindi, Kenya.
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
          <div className="bg-orange-50 p-4 rounded-lg border-l-4 border-orange-600">
            <p className="text-sm text-gray-700">
              This Cookie Policy explains how{" "}
              <strong className="text-orange-600">
                Jozz Tembo Tours and Safari
              </strong>{" "}
              uses cookies and similar technologies to recognize you when you
              visit our website.
            </p>
          </div>

          <section>
            <h3 className="text-lg font-semibold text-gray-900 mb-3">
              What Are Cookies?
            </h3>
            <p className="text-sm text-gray-600">
              Cookies are small text files placed on your device when you visit
              a website. They help us provide you with a better experience by
              remembering your preferences, understanding how you use our site,
              and showing you relevant content.
            </p>
          </section>

          <section>
            <h3 className="text-lg font-semibold text-gray-900 mb-3">
              Types of Cookies We Use
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-2xl">🍪</span>
                  <h4 className="font-semibold text-gray-900">
                    Essential Cookies
                  </h4>
                </div>
                <p className="text-sm text-gray-600">
                  Required for basic website functionality, such as navigation,
                  login, and secure transactions. These cannot be disabled.
                </p>
              </div>
              <div className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-2xl">📊</span>
                  <h4 className="font-semibold text-gray-900">
                    Performance Cookies
                  </h4>
                </div>
                <p className="text-sm text-gray-600">
                  Help us analyze how visitors use our website, allowing us to
                  improve performance and user experience.
                </p>
              </div>
              <div className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-2xl">🎯</span>
                  <h4 className="font-semibold text-gray-900">
                    Functional Cookies
                  </h4>
                </div>
                <p className="text-sm text-gray-600">
                  Remember your preferences (language, region, saved tours) to
                  provide a personalized experience.
                </p>
              </div>
              <div className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-2xl">📢</span>
                  <h4 className="font-semibold text-gray-900">
                    Marketing Cookies
                  </h4>
                </div>
                <p className="text-sm text-gray-600">
                  Track your browsing habits to show relevant advertisements and
                  special offers on other websites.
                </p>
              </div>
            </div>
          </section>

          <section>
            <h3 className="text-lg font-semibold text-gray-900 mb-3">
              How to Manage Cookies
            </h3>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm text-gray-600 mb-3">
                Most browsers allow you to control cookies through their
                settings. You can:
              </p>
              <ul className="list-disc list-inside space-y-1 text-sm text-gray-600 ml-4">
                <li>Delete all existing cookies</li>
                <li>Block cookies from specific websites</li>
                <li>
                  Set your browser to notify you when cookies are being sent
                </li>
                <li>Enable "Do Not Track" signals</li>
              </ul>
              <p className="text-sm text-gray-600 mt-3">
                Please note that disabling essential cookies may affect website
                functionality.
              </p>
            </div>
          </section>

          <section>
            <h3 className="text-lg font-semibold text-gray-900 mb-3">
              Third-Party Cookies
            </h3>
            <p className="text-sm text-gray-600">
              We use trusted third-party services that may set their own
              cookies:
            </p>
            <div className="flex flex-wrap gap-2 mt-3">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                Google Analytics
              </span>
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                Facebook Pixel
              </span>
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                Stripe
              </span>
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                PayPal
              </span>
            </div>
          </section>

          <section>
            <h3 className="text-lg font-semibold text-gray-900 mb-3">
              Cookie Duration
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="border border-gray-300 px-4 py-2 text-left">
                      Cookie Type
                    </th>
                    <th className="border border-gray-300 px-4 py-2 text-left">
                      Duration
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="border border-gray-300 px-4 py-2">
                      Session Cookies
                    </td>
                    <td className="border border-gray-300 px-4 py-2">
                      Until browser is closed
                    </td>
                  </tr>
                  <tr>
                    <td className="border border-gray-300 px-4 py-2">
                      Persistent Cookies
                    </td>
                    <td className="border border-gray-300 px-4 py-2">
                      Up to 2 years
                    </td>
                  </tr>
                  <tr>
                    <td className="border border-gray-300 px-4 py-2">
                      Marketing Cookies
                    </td>
                    <td className="border border-gray-300 px-4 py-2">
                      Up to 90 days
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          <div className="bg-orange-100 border border-orange-300 rounded-lg p-4">
            <p className="text-orange-800 text-sm text-center">
              By continuing to use our website, you consent to our use of
              cookies as described in this policy.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

// AuthModal Component
const AuthModal = ({ isOpen, onClose }) => {
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showPrivacyModal, setShowPrivacyModal] = useState(false);
  const [showTermsModal, setShowTermsModal] = useState(false);
  const [showCookieModal, setShowCookieModal] = useState(false);

  const [loginData, setLoginData] = useState({ email: "", password: "" });
  const [signupData, setSignupData] = useState({
    username: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });

  const loginEmailRef = useRef(null);
  const loginPasswordRef = useRef(null);
  const signupUsernameRef = useRef(null);
  const signupEmailRef = useRef(null);
  const signupPhoneRef = useRef(null);
  const signupPasswordRef = useRef(null);
  const signupConfirmPasswordRef = useRef(null);

  const API_URL = "http://localhost:5000/api";

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        if (isLoginMode && loginEmailRef.current) loginEmailRef.current.focus();
        else if (!isLoginMode && signupUsernameRef.current)
          signupUsernameRef.current.focus();
      }, 100);
    }
  }, [isOpen, isLoginMode]);

  const handleLoginChange = (e) =>
    setLoginData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  const handleSignupChange = (e) =>
    setSignupData((prev) => ({ ...prev, [e.target.name]: e.target.value }));

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
    setIsLoading(true);
    try {
      const response = await fetch(`${API_URL}/users/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: loginData.email,
          password: loginData.password,
        }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Login failed");
      localStorage.setItem("access_token", data.access_token);
      localStorage.setItem("user", JSON.stringify(data.user));
      MySwal.fire({
        icon: "success",
        title: "Welcome Back! 🎉",
        text: "Successfully logged in!",
        showConfirmButton: false,
        timer: 1500,
        background: "#1f2937",
        color: "white",
      });
      onClose();
      setTimeout(() => window.location.reload(), 1600);
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
    if (signupData.password !== signupData.confirmPassword) {
      MySwal.fire({
        icon: "error",
        title: "Oops...",
        text: "Passwords don't match!",
        background: "#1f2937",
        color: "white",
        confirmButtonColor: "#f59e0b",
      });
      return;
    }
    setIsLoading(true);
    try {
      const response = await fetch(`${API_URL}/users/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: signupData.username,
          email: signupData.email,
          password: signupData.password,
          phone: signupData.phone || "",
        }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Registration failed");
      localStorage.setItem("access_token", data.access_token);
      localStorage.setItem("user", JSON.stringify(data.user));
      MySwal.fire({
        icon: "success",
        title: "Account Created! 🎉",
        text: "Account created successfully!",
        showConfirmButton: false,
        timer: 1500,
        background: "#1f2937",
        color: "white",
      });
      onClose();
      setTimeout(() => window.location.reload(), 1600);
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
      if (newMode)
        setSignupData({
          username: "",
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
                            onKeyDown={(e) =>
                              handleKeyDown(e, loginPasswordRef)
                            }
                            required
                            className="w-full pl-10 pr-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
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
                            className="w-full pl-10 pr-12 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                            placeholder="Enter your password"
                            autoComplete="current-password"
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-yellow-400"
                          >
                            <div className="relative">
                              <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                {showPassword ? <FaEyeSlash /> : <FaEye />}
                              </div>
                              <div className="absolute inset-0 flex items-center justify-center opacity-100 group-hover:opacity-0">
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
                        className="w-full py-3 bg-gradient-to-r from-yellow-500 to-yellow-600 text-white font-semibold rounded-lg hover:from-yellow-600 hover:to-yellow-700 transition-all duration-300 disabled:opacity-50"
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
                        className="w-full mt-6 py-3 bg-white text-gray-800 font-semibold rounded-lg hover:bg-gray-100 transition-all duration-300 flex items-center justify-center gap-3"
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
                            className="w-full pl-10 pr-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-yellow-500"
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
                            className="w-full pl-10 pr-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-yellow-500"
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
                            onKeyDown={(e) =>
                              handleKeyDown(e, signupPasswordRef)
                            }
                            className="w-full pl-10 pr-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-yellow-500"
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
                            className="w-full pl-10 pr-12 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-yellow-500"
                            placeholder="Create a password (min. 6 characters)"
                            autoComplete="new-password"
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-yellow-400"
                          >
                            <div className="relative">
                              <div className="opacity-0 group-hover:opacity-100">
                                {showPassword ? <FaEyeSlash /> : <FaEye />}
                              </div>
                              <div className="absolute inset-0 flex items-center justify-center opacity-100 group-hover:opacity-0">
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
                            className="w-full pl-10 pr-12 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-yellow-500"
                            placeholder="Confirm your password"
                            autoComplete="new-password"
                          />
                          <button
                            type="button"
                            onClick={() =>
                              setShowConfirmPassword(!showConfirmPassword)
                            }
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-yellow-400"
                          >
                            <div className="relative">
                              <div className="opacity-0 group-hover:opacity-100">
                                {showConfirmPassword ? (
                                  <FaEyeSlash />
                                ) : (
                                  <FaEye />
                                )}
                              </div>
                              <div className="absolute inset-0 flex items-center justify-center opacity-100 group-hover:opacity-0">
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
                            onClick={() => setShowTermsModal(true)}
                            className="text-yellow-400 hover:text-yellow-300 underline"
                          >
                            Terms & Conditions
                          </button>{" "}
                          and{" "}
                          <button
                            type="button"
                            onClick={() => setShowPrivacyModal(true)}
                            className="text-yellow-400 hover:text-yellow-300 underline"
                          >
                            Privacy Policy
                          </button>
                        </label>
                      </div>
                      <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full py-3 bg-gradient-to-r from-yellow-500 to-yellow-600 text-white font-semibold rounded-lg hover:from-yellow-600 hover:to-yellow-700 transition-all duration-300 disabled:opacity-50"
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
                        className="w-full mt-6 py-3 bg-white text-gray-800 font-semibold rounded-lg hover:bg-gray-100 transition-all duration-300 flex items-center justify-center gap-3"
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

// Footer Component - REDESIGNED with hidden secret button
const Footer = () => {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [showPrivacyModal, setShowPrivacyModal] = useState(false);
  const [showTermsModal, setShowTermsModal] = useState(false);
  const [showCookieModal, setShowCookieModal] = useState(false);
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
        {/* Main Footer Content */}
        <div className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Company Info */}
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
                  className="text-gray-400 hover:text-yellow-400 transition-colors"
                >
                  <FaInstagram size={24} />
                </a>
                <a
                  href="#"
                  className="text-gray-400 hover:text-yellow-400 transition-colors"
                >
                  <FaFacebook size={24} />
                </a>
                <a
                  href="#"
                  className="text-gray-400 hover:text-yellow-400 transition-colors"
                >
                  <FaTwitter size={24} />
                </a>
              </div>
            </div>

            {/* Our Services */}
            <div>
              <h4 className="text-lg font-semibold text-yellow-400 mb-4">
                Our Services
              </h4>
              <ul className="space-y-2">
                <li>
                  <a
                    href="#safari"
                    className="text-gray-300 hover:text-white transition-colors block py-1"
                  >
                    Safari Adventures
                  </a>
                </li>
                <li>
                  <a
                    href="#beach"
                    className="text-gray-300 hover:text-white transition-colors block py-1"
                  >
                    Beach Tours
                  </a>
                </li>
                <li>
                  <a
                    href="#cultural"
                    className="text-gray-300 hover:text-white transition-colors block py-1"
                  >
                    Cultural Experiences
                  </a>
                </li>
                <li>
                  <a
                    href="#airport"
                    className="text-gray-300 hover:text-white transition-colors block py-1"
                  >
                    Airport Transfers
                  </a>
                </li>
                <li>
                  <a
                    href="#custom"
                    className="text-gray-300 hover:text-white transition-colors block py-1"
                  >
                    Custom Packages
                  </a>
                </li>
              </ul>
            </div>

            {/* Contact Info */}
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
                    <span className="text-gray-300">+254 722609492</span>
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

        {/* Excellence Banner - NO LONGER clickable for auth */}
        <div className="bg-gradient-to-r from-yellow-600 to-yellow-500 py-4">
          <div className="container mx-auto px-4 text-center">
            <p className="text-white text-lg font-semibold">
              🦁 Over 30 Years of Safari Excellence | Trusted Since 1993 🦒
            </p>
          </div>
        </div>

        {/* Bottom Bar with Hidden Secret Button */}
        <div className="border-t border-gray-800">
          <div className="container mx-auto px-4 py-6">
            <div className="flex flex-col md:flex-row justify-between items-center">
              {/* Copyright */}
              <div className="text-center md:text-left mb-4 md:mb-0">
                <p className="text-gray-400 text-sm">
                  © {new Date().getFullYear()} Jozz Tembo Tours and Safari. All
                  rights reserved.
                </p>
                <p className="text-yellow-400 text-sm mt-1 italic">
                  Driven by passion, guided by experience
                </p>
              </div>

              {/* Policy Links + Hidden Secret Button */}
              <div className="flex items-center space-x-6">
                <button
                  onClick={() => setShowPrivacyModal(true)}
                  className="text-gray-400 hover:text-white text-sm transition-colors"
                >
                  Privacy Policy
                </button>
                <button
                  onClick={() => setShowTermsModal(true)}
                  className="text-gray-400 hover:text-white text-sm transition-colors"
                >
                  Terms of Service
                </button>
                <button
                  onClick={() => setShowCookieModal(true)}
                  className="text-gray-400 hover:text-white text-sm transition-colors"
                >
                  Cookie Policy
                </button>

                {/* SECRET BUTTON - Subtle dot/symbol that triggers auth */}
                <button
                  onClick={handleAuthClick}
                  className="text-gray-600 hover:text-gray-400 text-lg transition-all duration-300 w-6 h-6 flex items-center justify-center rounded-full hover:bg-gray-800"
                  title={currentUser ? "Sign Out" : "Member Access"}
                  aria-label="Member access"
                >
                  <span className="opacity-30 hover:opacity-60 transition-opacity">
                    ●
                  </span>
                </button>
              </div>
            </div>

            {/* Subtle logged-in indicator */}
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

      {/* Auth Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
      />

      {/* Policy Modals */}
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
