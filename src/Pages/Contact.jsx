import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  FaPhone,
  FaEnvelope,
  FaMapMarkerAlt,
  FaClock,
  FaInstagram,
  FaFacebook,
  FaTwitter,
  FaPaperPlane,
  FaWhatsapp,
  FaDirections,
  FaCheckCircle,
  FaExclamationTriangle,
  FaInfoCircle,
} from "react-icons/fa";

const Contact = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });

  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState({
    show: false,
    type: "",
    message: "",
    contactId: "",
  });

  const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

  const showNotification = (type, message, contactId = "") => {
    setNotification({ show: true, type, message, contactId });
    setTimeout(() => {
      setNotification({ show: false, type: "", message: "", contactId: "" });
    }, 8000);
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !formData.fullName ||
      !formData.email ||
      !formData.subject ||
      !formData.message
    ) {
      showNotification("error", "Please fill in all required fields.");
      return;
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(formData.email)) {
      showNotification("error", "Please enter a valid email address.");
      return;
    }

    if (formData.message.length > 1000) {
      showNotification(
        "error",
        "Message is too long. Please keep it under 1000 characters.",
      );
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`${API_BASE_URL}/api/send-contact`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          fullName: formData.fullName,
          email: formData.email,
          phone: formData.phone || "Not provided",
          subject: formData.subject,
          message: formData.message,
          type: "contact_form",
          submittedAt: new Date().toISOString(),
        }),
      });

      const data = await response.json();

      if (data.success) {
        showNotification(
          "success",
          data.message ||
            "Thank you for your message! We'll get back to you within 24 hours.",
          data.contactId || "",
        );

        setFormData({
          fullName: "",
          email: "",
          phone: "",
          subject: "",
          message: "",
        });
      } else {
        showNotification(
          "error",
          data.error ||
            "Failed to send message. Please try again or contact us directly at +254 722 266 955.",
        );
      }
    } catch (error) {
      console.error("Error sending message:", error);
      showNotification(
        "error",
        "Network error. Please check your connection. If the problem persists, call us at +254 722 266 955 or email tembo4401@gmail.com.",
      );
    } finally {
      setLoading(false);
    }
  };

  const openWhatsAppDirect = () => {
    const phoneNumber = "254722266955";
    const defaultMessage =
      "Hello Jozz Tembo Tours! I'm interested in your safari packages and would like more information.";
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(
      defaultMessage,
    )}`;
    window.open(whatsappUrl, "_blank");
  };

  const openGoogleMaps = () => {
    const mapsUrl =
      "https://www.google.com/maps/place/Joss+%26+Tembo+Tours+%26+Safaris/@-3.2288873,40.0715636,13z/data=!4m14!1m7!3m6!1s0x18158fb3cbf5d3cb:0x149738b4de67d28f!2sJoss+%26+Tembo+Tours+%26+Safaris!8m2!3d-3.2114991!4d40.1174632!16s%2Fg%2F1q5bllrc8!3m5!1s0x18158fb3cbf5d3cb:0x149738b4de67d28f!8m2!3d-3.2114991!4d40.1174632!16s%2Fg%2F1q5bllrc8?entry=ttu&g_ep=EgoyMDI1MTEwOS4wIKXMDSoASAFQAw%3D%3D";
    window.open(mapsUrl, "_blank");
  };

  const fadeInUp = {
    initial: { opacity: 0, y: 60 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 },
  };

  const staggerContainer = {
    animate: {
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-amber-50 to-emerald-50 pt-16 sm:pt-20">
      {/* Enhanced Notification Toast - Mobile Optimized */}
      {notification.show && (
        <motion.div
          initial={{ opacity: 0, y: -100, x: "-50%" }}
          animate={{ opacity: 1, y: 0, x: "-50%" }}
          exit={{ opacity: 0, y: -100, x: "-50%" }}
          className="fixed top-4 sm:top-20 left-1/2 z-50 flex items-start gap-3 sm:gap-4 px-4 sm:px-6 py-3 sm:py-5 rounded-2xl shadow-2xl backdrop-blur-sm bg-white/95 border w-[calc(100%-2rem)] sm:max-w-lg mx-auto"
        >
          <div
            className={`flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center ${
              notification.type === "success"
                ? "bg-emerald-100 text-emerald-600"
                : "bg-rose-100 text-rose-600"
            }`}
          >
            {notification.type === "success" ? (
              <FaCheckCircle className="text-lg sm:text-xl" />
            ) : (
              <FaExclamationTriangle className="text-lg sm:text-xl" />
            )}
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-bold text-gray-800 text-base sm:text-lg">
              {notification.type === "success" ? "Message Sent!" : "Oops!"}
            </p>
            <p className="text-gray-600 mt-1 text-sm sm:text-base line-clamp-3">
              {notification.message}
            </p>
            {notification.type === "success" && notification.contactId && (
              <p className="text-xs text-gray-400 mt-2 font-mono bg-gray-50 px-2 py-1 rounded truncate">
                Ref: {notification.contactId}
              </p>
            )}
          </div>
          <button
            onClick={() =>
              setNotification({
                show: false,
                type: "",
                message: "",
                contactId: "",
              })
            }
            className="text-gray-400 hover:text-gray-600 transition-colors flex-shrink-0"
            aria-label="Close notification"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </motion.div>
      )}

      {/* Hero Section - Mobile Optimized */}
      <section className="relative py-16 sm:py-24 md:py-32 overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-b from-amber-900/90 via-stone-900/70 to-emerald-900/90 z-10" />
          <img
            src="https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80"
            alt="African landscape"
            className="w-full h-full object-cover scale-105 animate-subtle-zoom"
            loading="eager"
          />
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTIwIDMwbDEwLTUgLTEwLTUgLTEwIDUgMTAgNXoiLz48L2c+PC9nPjwvc3ZnPg==')] opacity-50 z-20" />
        </div>
        <div className="relative z-30 max-w-7xl mx-auto px-4 sm:px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md rounded-full px-4 sm:px-6 py-1.5 sm:py-2 mb-6 sm:mb-8 border border-white/20"
          >
            <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
            <span className="text-white/90 text-xs sm:text-sm font-medium">
              We're Available 24/7
            </span>
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-3xl sm:text-5xl md:text-7xl font-black text-white mb-4 sm:mb-6 tracking-tight"
          >
            Let's Plan Your
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-emerald-400">
              African Adventure
            </span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="text-base sm:text-lg md:text-xl text-white/80 max-w-2xl mx-auto leading-relaxed px-2"
          >
            Your journey to the heart of Africa begins with a conversation.
            Reach out to JozTembo Tours & Safari today.
          </motion.p>
        </div>
      </section>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-12 -mt-12 sm:-mt-16 relative z-40">
        <motion.div
          variants={staggerContainer}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
          className="grid lg:grid-cols-5 gap-6 sm:gap-8"
        >
          {/* Contact Information - 2 columns */}
          <motion.div
            variants={fadeInUp}
            className="lg:col-span-2 space-y-4 sm:space-y-6"
          >
            <div className="bg-white/80 backdrop-blur-md rounded-2xl sm:rounded-3xl p-5 sm:p-8 shadow-xl shadow-amber-900/5 border border-white/50">
              <div className="flex items-center gap-3 mb-4 sm:mb-6">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-amber-500 to-amber-600 rounded-xl sm:rounded-2xl flex items-center justify-center shadow-lg shadow-amber-500/20">
                  <FaMapMarkerAlt className="text-white text-lg sm:text-xl" />
                </div>
                <div>
                  <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
                    Visit Us
                  </h2>
                  <p className="text-gray-500 text-xs sm:text-sm">
                    Our Office Location
                  </p>
                </div>
              </div>
              <div className="bg-amber-50 rounded-xl sm:rounded-2xl p-4 sm:p-5 border border-amber-100">
                <p className="font-semibold text-amber-900 text-base sm:text-lg">
                  JozTembo Tours & Safari
                </p>
                <p className="text-gray-600 mt-1 text-sm sm:text-base">
                  Malindi, Lamu Road
                </p>
                <p className="text-gray-600 text-sm sm:text-base">
                  Kenya, East Africa
                </p>
                <button
                  onClick={openGoogleMaps}
                  className="mt-3 sm:mt-4 inline-flex items-center gap-2 bg-amber-600 text-white px-4 sm:px-5 py-2 sm:py-2.5 rounded-xl font-medium hover:bg-amber-700 transition-all duration-300 text-xs sm:text-sm shadow-lg shadow-amber-600/20 w-full sm:w-auto justify-center sm:justify-start"
                >
                  <FaDirections className="flex-shrink-0" />
                  <span>Get Directions</span>
                </button>
              </div>
            </div>

            {/* Quick Contact Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-3 sm:gap-4">
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="bg-white/80 backdrop-blur-md rounded-2xl p-4 sm:p-5 shadow-lg shadow-amber-900/5 border border-white/50 flex items-center gap-3 sm:gap-4 cursor-pointer active:bg-amber-50 transition-colors"
                onClick={() => window.open("tel:+254722266955")}
              >
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20 flex-shrink-0">
                  <FaPhone className="text-white text-base sm:text-lg" />
                </div>
                <div className="min-w-0">
                  <p className="font-semibold text-gray-900 text-sm sm:text-base">
                    Call Us Directly
                  </p>
                  <p className="text-gray-600 text-xs sm:text-sm truncate">
                    +254 722 266 955
                  </p>
                </div>
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="bg-white/80 backdrop-blur-md rounded-2xl p-4 sm:p-5 shadow-lg shadow-amber-900/5 border border-white/50 flex items-center gap-3 sm:gap-4 cursor-pointer active:bg-emerald-50 transition-colors"
                onClick={openWhatsAppDirect}
              >
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-500/20 flex-shrink-0">
                  <FaWhatsapp className="text-white text-base sm:text-lg" />
                </div>
                <div className="min-w-0">
                  <p className="font-semibold text-gray-900 text-sm sm:text-base">
                    Chat on WhatsApp
                  </p>
                  <p className="text-emerald-600 text-xs sm:text-sm font-medium">
                    Quick Responses
                  </p>
                </div>
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.02 }}
                className="bg-white/80 backdrop-blur-md rounded-2xl p-4 sm:p-5 shadow-lg shadow-amber-900/5 border border-white/50 flex items-center gap-3 sm:gap-4"
              >
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg shadow-purple-500/20 flex-shrink-0">
                  <FaEnvelope className="text-white text-base sm:text-lg" />
                </div>
                <div className="min-w-0">
                  <p className="font-semibold text-gray-900 text-sm sm:text-base">
                    Email Us
                  </p>
                  <p className="text-gray-600 text-xs sm:text-sm truncate">
                    tembo4401@gmail.com
                  </p>
                </div>
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.02 }}
                className="bg-white/80 backdrop-blur-md rounded-2xl p-4 sm:p-5 shadow-lg shadow-amber-900/5 border border-white/50 flex items-center gap-3 sm:gap-4"
              >
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-amber-500 to-orange-500 rounded-xl flex items-center justify-center shadow-lg shadow-amber-500/20 flex-shrink-0">
                  <FaClock className="text-white text-base sm:text-lg" />
                </div>
                <div className="min-w-0">
                  <p className="font-semibold text-gray-900 text-sm sm:text-base">
                    Business Hours
                  </p>
                  <p className="text-gray-600 text-xs sm:text-sm">
                    Mon - Sun: 6:00 AM - 10:00 PM
                  </p>
                  <p className="text-amber-600 text-xs font-medium">
                    24/7 Emergency Support
                  </p>
                </div>
              </motion.div>
            </div>

            {/* Social Media Card */}
            <div className="bg-gradient-to-br from-amber-700 to-amber-900 rounded-2xl sm:rounded-3xl p-5 sm:p-6 text-white shadow-xl shadow-amber-900/20">
              <h3 className="text-lg sm:text-xl font-bold mb-1 sm:mb-2">
                Follow Our Journey
              </h3>
              <p className="text-amber-200 text-xs sm:text-sm mb-4 sm:mb-5">
                Stay updated with our latest adventures
              </p>
              <div className="flex gap-2 sm:gap-3 flex-wrap">
                {[
                  {
                    icon: FaInstagram,
                    color: "hover:bg-pink-500",
                    link: "https://www.instagram.com/joztembotours/",
                  },
                  { icon: FaFacebook, color: "hover:bg-blue-600", link: "#" },
                  { icon: FaTwitter, color: "hover:bg-sky-500", link: "#" },
                  {
                    icon: FaWhatsapp,
                    color: "hover:bg-emerald-500",
                    action: openWhatsAppDirect,
                  },
                ].map((social, index) => (
                  <motion.a
                    key={index}
                    href={social.link || "#"}
                    target={social.link ? "_blank" : undefined}
                    rel={social.link ? "noopener noreferrer" : undefined}
                    onClick={social.action}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    className={`w-10 h-10 sm:w-11 sm:h-11 bg-white/10 backdrop-blur-sm rounded-xl flex items-center justify-center transition-all duration-300 ${social.color} cursor-pointer`}
                  >
                    <social.icon className="text-base sm:text-lg" />
                  </motion.a>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Contact Form - 3 columns */}
          <motion.div variants={fadeInUp} className="lg:col-span-3">
            <div className="bg-white/90 backdrop-blur-md rounded-2xl sm:rounded-3xl p-5 sm:p-8 md:p-10 shadow-2xl shadow-amber-900/10 border border-white/50">
              <div className="flex items-center gap-3 sm:gap-4 mb-6 sm:mb-8">
                <div className="w-10 h-10 sm:w-14 sm:h-14 bg-gradient-to-br from-amber-500 to-amber-600 rounded-xl sm:rounded-2xl flex items-center justify-center shadow-lg shadow-amber-500/20">
                  <FaPaperPlane className="text-white text-lg sm:text-xl" />
                </div>
                <div>
                  <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">
                    Send a Message
                  </h2>
                  <p className="text-gray-500 text-xs sm:text-sm">
                    We'll respond within 24 hours
                  </p>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
                <div className="grid sm:grid-cols-2 gap-4 sm:gap-5">
                  <div className="space-y-1.5 sm:space-y-2">
                    <label
                      htmlFor="fullName"
                      className="block text-sm font-semibold text-gray-700"
                    >
                      Full Name <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      id="fullName"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleChange}
                      required
                      disabled={loading}
                      className="w-full px-4 py-3 sm:py-3.5 bg-gray-50 border-2 border-gray-100 rounded-xl sm:rounded-2xl focus:border-amber-500 focus:bg-white focus:ring-4 focus:ring-amber-500/10 transition-all duration-300 disabled:opacity-50 outline-none text-gray-900 placeholder-gray-400 text-sm sm:text-base"
                      placeholder="John Doe"
                    />
                  </div>
                  <div className="space-y-1.5 sm:space-y-2">
                    <label
                      htmlFor="email"
                      className="block text-sm font-semibold text-gray-700"
                    >
                      Email Address <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      disabled={loading}
                      className="w-full px-4 py-3 sm:py-3.5 bg-gray-50 border-2 border-gray-100 rounded-xl sm:rounded-2xl focus:border-amber-500 focus:bg-white focus:ring-4 focus:ring-amber-500/10 transition-all duration-300 disabled:opacity-50 outline-none text-gray-900 placeholder-gray-400 text-sm sm:text-base"
                      placeholder="john@example.com"
                    />
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-4 sm:gap-5">
                  <div className="space-y-1.5 sm:space-y-2">
                    <label
                      htmlFor="phone"
                      className="block text-sm font-semibold text-gray-700"
                    >
                      Phone Number{" "}
                      <span className="text-gray-400 text-xs font-normal">
                        (Optional)
                      </span>
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      disabled={loading}
                      className="w-full px-4 py-3 sm:py-3.5 bg-gray-50 border-2 border-gray-100 rounded-xl sm:rounded-2xl focus:border-amber-500 focus:bg-white focus:ring-4 focus:ring-amber-500/10 transition-all duration-300 disabled:opacity-50 outline-none text-gray-900 placeholder-gray-400 text-sm sm:text-base"
                      placeholder="+254 700 000 000"
                    />
                  </div>
                  <div className="space-y-1.5 sm:space-y-2">
                    <label
                      htmlFor="subject"
                      className="block text-sm font-semibold text-gray-700"
                    >
                      Subject <span className="text-rose-500">*</span>
                    </label>
                    <select
                      id="subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      required
                      disabled={loading}
                      className="w-full px-4 py-3 sm:py-3.5 bg-gray-50 border-2 border-gray-100 rounded-xl sm:rounded-2xl focus:border-amber-500 focus:bg-white focus:ring-4 focus:ring-amber-500/10 transition-all duration-300 disabled:opacity-50 outline-none text-gray-900 text-sm sm:text-base appearance-none bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%23131313%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E')] bg-[length:0.65rem] bg-[right_1rem_center] bg-no-repeat"
                    >
                      <option value="">Select a subject</option>
                      <option value="Safari Booking">🏕️ Safari Booking</option>
                      <option value="Beach Tour">🏖️ Beach Tour</option>
                      <option value="Custom Package">🎯 Custom Package</option>
                      <option value="Airport Transfer">
                        🚗 Airport Transfer
                      </option>
                      <option value="General Inquiry">
                        💬 General Inquiry
                      </option>
                      <option value="Partnership">🤝 Partnership</option>
                      <option value="Feedback">📝 Feedback</option>
                      <option value="Other">📌 Other</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-1.5 sm:space-y-2">
                  <label
                    htmlFor="message"
                    className="block text-sm font-semibold text-gray-700"
                  >
                    Your Message <span className="text-rose-500">*</span>
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows="4"
                    maxLength="1000"
                    disabled={loading}
                    className="w-full px-4 py-3 sm:py-3.5 bg-gray-50 border-2 border-gray-100 rounded-xl sm:rounded-2xl focus:border-amber-500 focus:bg-white focus:ring-4 focus:ring-amber-500/10 transition-all duration-300 disabled:opacity-50 outline-none text-gray-900 placeholder-gray-400 resize-none text-sm sm:text-base"
                    placeholder="Tell us about your dream African adventure..."
                  />
                  <div className="flex justify-between items-center">
                    <span
                      className={`text-xs ${formData.message.length > 900 ? "text-amber-600" : "text-gray-400"}`}
                    >
                      {formData.message.length}/1000 characters
                    </span>
                    {formData.message.length > 900 && (
                      <span className="text-xs text-amber-600 font-medium">
                        Approaching limit
                      </span>
                    )}
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3.5 sm:py-4 bg-gradient-to-r from-amber-600 to-amber-700 text-white rounded-xl sm:rounded-2xl font-bold text-base sm:text-lg hover:from-amber-700 hover:to-amber-800 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-xl shadow-amber-600/20 hover:shadow-2xl hover:shadow-amber-600/30 flex items-center justify-center gap-2 sm:gap-3 group"
                >
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent" />
                      <span>Sending Message...</span>
                    </>
                  ) : (
                    <>
                      <span>Send Message</span>
                      <FaPaperPlane className="text-base sm:text-lg group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </button>

                {/* Process Info Card */}
                <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl sm:rounded-2xl p-4 sm:p-5 border border-blue-100">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 sm:w-10 sm:h-10 bg-blue-100 rounded-xl flex items-center justify-center flex-shrink-0">
                      <FaInfoCircle className="text-blue-600 text-sm sm:text-base" />
                    </div>
                    <div className="min-w-0">
                      <p className="font-semibold text-blue-900 text-sm sm:text-base">
                        What happens next?
                      </p>
                      <ul className="text-blue-700 text-xs sm:text-sm mt-2 space-y-1.5">
                        <li className="flex items-center gap-2">
                          <span className="w-1.5 h-1.5 bg-blue-400 rounded-full flex-shrink-0"></span>
                          <span>Your message goes directly to our team</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <span className="w-1.5 h-1.5 bg-blue-400 rounded-full flex-shrink-0"></span>
                          <span>You'll receive a confirmation email</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <span className="w-1.5 h-1.5 bg-blue-400 rounded-full flex-shrink-0"></span>
                          <span>We typically respond within 24 hours</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <span className="w-1.5 h-1.5 bg-blue-400 rounded-full flex-shrink-0"></span>
                          <span>
                            For urgent inquiries, call +254 722 266 955
                          </span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>

                <p className="text-center text-gray-400 text-xs">
                  <span className="text-rose-500">*</span> Required fields • We
                  respect your privacy and never share your information
                </p>
              </form>
            </div>
          </motion.div>
        </motion.div>

        {/* Map Section */}
        <motion.section
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mt-12 sm:mt-16"
        >
          <div className="bg-white/90 backdrop-blur-md rounded-2xl sm:rounded-3xl p-5 sm:p-8 shadow-2xl shadow-amber-900/10 border border-white/50">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sm:gap-6 mb-6 sm:mb-8">
              <div>
                <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">
                  Find Us in Malindi
                </h2>
                <p className="text-gray-500 mt-1 text-sm sm:text-base">
                  Visit our office along Lamu Road
                </p>
              </div>
              <button
                onClick={openGoogleMaps}
                className="inline-flex items-center gap-2 bg-amber-600 text-white px-5 sm:px-6 py-2.5 sm:py-3 rounded-xl font-semibold hover:bg-amber-700 transition-all duration-300 shadow-lg shadow-amber-600/20 text-sm sm:text-base w-full sm:w-auto justify-center"
              >
                <FaDirections />
                <span>Get Directions</span>
              </button>
            </div>

            <div className="rounded-xl sm:rounded-2xl overflow-hidden shadow-lg h-[300px] sm:h-[400px] border-4 border-white">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3977.228885599999!2d40.1148882745991!3d-3.211499096661246!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x18158fb3cbf5d3cb%3A0x149738b4de67d28f!2sJoss%20%26%20Tembo%20Tours%20%26%20Safaris!5e0!3m2!1sen!2ske!4v1700000000000!5m2!1sen!2ske"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Jozz Tembo Tours and Safari Location"
              />
            </div>
          </div>
        </motion.section>

        {/* CTA Section */}
        <motion.section
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="mt-12 sm:mt-16 text-center relative overflow-hidden rounded-2xl sm:rounded-3xl"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-amber-600 via-amber-700 to-emerald-800" />
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4xIj48Y2lyY2xlIGN4PSIzMCIgY3k9IjMwIiByPSIyIi8+PC9nPjwvZz48L3N2Zz4=')] opacity-50" />
          <div className="relative z-10 px-6 sm:px-8 py-12 sm:py-16 md:py-20">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              className="text-3xl sm:text-4xl md:text-5xl font-black text-white mb-3 sm:mb-4"
            >
              Ready to Start Your Adventure?
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-lg sm:text-xl text-white/80 mb-8 sm:mb-10 max-w-2xl mx-auto"
            >
              Let's create memories that will last a lifetime in the heart of
              Africa
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center"
            >
              <a
                href="tel:+254722266955"
                className="inline-flex items-center gap-2 bg-white text-amber-700 px-6 sm:px-8 py-3.5 sm:py-4 rounded-2xl font-bold text-base sm:text-lg hover:bg-amber-50 transition-all duration-300 shadow-xl hover:shadow-2xl w-full sm:w-auto justify-center"
              >
                <FaPhone />
                Call Now
              </a>
              <button
                onClick={openWhatsAppDirect}
                className="inline-flex items-center gap-2 bg-emerald-500 text-white px-6 sm:px-8 py-3.5 sm:py-4 rounded-2xl font-bold text-base sm:text-lg hover:bg-emerald-600 transition-all duration-300 shadow-xl hover:shadow-2xl shadow-emerald-500/20 w-full sm:w-auto justify-center"
              >
                <FaWhatsapp />
                Chat on WhatsApp
              </button>
              <button
                onClick={openGoogleMaps}
                className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm text-white px-6 sm:px-8 py-3.5 sm:py-4 rounded-2xl font-bold text-base sm:text-lg hover:bg-white/30 transition-all duration-300 border-2 border-white/30 w-full sm:w-auto justify-center"
              >
                <FaDirections />
                Get Directions
              </button>
            </motion.div>
          </div>
        </motion.section>
      </div>

      {/* Floating WhatsApp Button - Mobile Optimized */}
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 1, duration: 0.5, type: "spring" }}
        className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50"
      >
        <motion.button
          onClick={openWhatsAppDirect}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="bg-gradient-to-r from-emerald-500 to-emerald-600 text-white p-3.5 sm:p-4 rounded-2xl shadow-2xl hover:shadow-emerald-500/30 transition-all duration-300 relative group"
          aria-label="Chat on WhatsApp"
        >
          <FaWhatsapp className="text-xl sm:text-2xl" />
          <span className="absolute -top-8 right-0 bg-white text-gray-900 text-xs font-bold px-3 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity shadow-lg whitespace-nowrap pointer-events-none">
            Quick Chat
          </span>
        </motion.button>
      </motion.div>

      <style jsx>{`
        @keyframes subtle-zoom {
          0%,
          100% {
            transform: scale(1.05);
          }
          50% {
            transform: scale(1.1);
          }
        }
        .animate-subtle-zoom {
          animation: subtle-zoom 20s ease-in-out infinite;
        }

        /* Custom line clamp for older browsers */
        .line-clamp-3 {
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </div>
  );
};

export default Contact;
