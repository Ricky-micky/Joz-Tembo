import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";

// ✅ UPDATED: Use your deployed backend URL
const API_BASE_URL = "https://joz-tours-backend-2026.onrender.com/api";

const About = () => {
  const [selectedPartner, setSelectedPartner] = useState(null);
  const [selectedMission, setSelectedMission] = useState(false);
  const [selectedValue, setSelectedValue] = useState(null);
  const [isMobile, setIsMobile] = useState(false);

  // Review system states
  const [reviews, setReviews] = useState([]);
  const [reviewStats, setReviewStats] = useState({
    average_rating: 0,
    total_reviews: 0,
    rating_distribution: {},
  });
  const [reviewsLoading, setReviewsLoading] = useState(true);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [editingReview, setEditingReview] = useState(null);
  const [replyingTo, setReplyingTo] = useState(null);
  const [replyContent, setReplyContent] = useState("");
  const [editingReply, setEditingReply] = useState(null);
  const [hoveredReview, setHoveredReview] = useState(null);
  const [expandedReviews, setExpandedReviews] = useState({});

  // Auth state
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem("user");
    try {
      return storedUser ? JSON.parse(storedUser) : null;
    } catch {
      return null;
    }
  });
  const [token, setToken] = useState(() =>
    localStorage.getItem("access_token"),
  );

  const [reviewForm, setReviewForm] = useState({
    reviewer_name: "",
    rating: 5,
    title: "",
    content: "",
    visit_date: "",
    package_used: "",
  });

  const [reviewPage, setReviewPage] = useState(1);
  const [reviewPagination, setReviewPagination] = useState({});

  // Mobile detection
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Sync auth state
  useEffect(() => {
    const checkAuth = () => {
      const storedToken = localStorage.getItem("access_token");
      const storedUser = localStorage.getItem("user");
      if (storedToken && storedUser) {
        setToken(storedToken);
        try {
          setUser(JSON.parse(storedUser));
        } catch {
          setUser(null);
        }
      } else {
        setToken(null);
        setUser(null);
      }
    };
    checkAuth();
    window.addEventListener("storage", checkAuth);
    window.addEventListener("authChange", checkAuth);
    return () => {
      window.removeEventListener("storage", checkAuth);
      window.removeEventListener("authChange", checkAuth);
    };
  }, []);

  // Fetch user from API when token changes
  useEffect(() => {
    if (token) fetchCurrentUser();
  }, [token]);

  // Fetch reviews
  useEffect(() => {
    fetchReviews();
  }, [reviewPage]);

  // ============ AUTH FUNCTIONS ============
  const fetchCurrentUser = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/auth/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUser(response.data.user);
      localStorage.setItem("user", JSON.stringify(response.data.user));
    } catch (error) {
      localStorage.removeItem("access_token");
      localStorage.removeItem("user");
      setToken(null);
      setUser(null);
    }
  };

  // ============ REVIEW FUNCTIONS ============
  const fetchReviews = async () => {
    try {
      setReviewsLoading(true);
      const [reviewsRes, statsRes] = await Promise.all([
        axios.get(`${API_BASE_URL}/reviews?page=${reviewPage}&per_page=5`),
        axios.get(`${API_BASE_URL}/reviews/stats`),
      ]);
      setReviews(reviewsRes.data.data);
      setReviewPagination(reviewsRes.data.pagination);
      setReviewStats(statsRes.data.stats);
    } catch (error) {
      console.error("Error fetching reviews:", error);
    } finally {
      setReviewsLoading(false);
    }
  };

  // Handle submit review (create or update)
  const handleSubmitReview = async (e) => {
    e.preventDefault();
    try {
      const headers = {};
      if (token) {
        headers.Authorization = `Bearer ${token}`;
      }

      const reviewData = {
        rating: reviewForm.rating,
        title: reviewForm.title,
        content: reviewForm.content,
        visit_date: reviewForm.visit_date || null,
        package_used: reviewForm.package_used || null,
      };

      if (!user) {
        reviewData.reviewer_name = reviewForm.reviewer_name || "Anonymous";
      }

      if (editingReview) {
        if (!token) {
          alert("Please sign in to edit reviews.");
          return;
        }
        await axios.put(
          `${API_BASE_URL}/reviews/${editingReview.id}`,
          reviewData,
          { headers },
        );
        setEditingReview(null);
      } else {
        await axios.post(`${API_BASE_URL}/reviews`, reviewData, { headers });
      }
      setShowReviewForm(false);
      setReviewForm({
        reviewer_name: "",
        rating: 5,
        title: "",
        content: "",
        visit_date: "",
        package_used: "",
      });
      fetchReviews();
      alert(
        editingReview
          ? "Review updated successfully!"
          : "Review submitted successfully!",
      );
    } catch (error) {
      alert(error.response?.data?.error || "Error submitting review");
    }
  };

  // ANY signed-in user can edit ANY review
  const handleEditReview = (review) => {
    if (!user) {
      alert("Please sign in to edit reviews.");
      return;
    }

    if (review.user?.id !== user.id && !user.is_admin) {
      if (
        !window.confirm(
          "⚠️ You are about to edit someone else's review. Are you sure you want to continue?",
        )
      ) {
        return;
      }
    }

    setReviewForm({
      reviewer_name: review.user?.name || review.reviewer_name || "",
      rating: review.rating,
      title: review.title,
      content: review.content,
      visit_date: review.visit_date || "",
      package_used: review.package_used || "",
    });
    setEditingReview(review);
    setShowReviewForm(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // ANY signed-in user can delete ANY review
  const handleDeleteReview = async (reviewId, reviewUserId, reviewTitle) => {
    if (!user) {
      alert("Please sign in to delete reviews.");
      return;
    }

    let confirmMessage = "Delete this review? This action cannot be undone.";
    if (reviewUserId !== user.id && !user.is_admin) {
      confirmMessage = `⚠️ WARNING: You are about to delete "${reviewTitle}" by another user. This action cannot be undone. Are you sure?`;
    }

    if (!window.confirm(confirmMessage)) return;

    try {
      await axios.delete(`${API_BASE_URL}/reviews/${reviewId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      await fetchReviews();
      alert("Review deleted successfully!");
    } catch (error) {
      console.error("Delete error:", error);
      alert(error.response?.data?.error || "Error deleting review");
    }
  };

  // Any authenticated user can submit a reply
  const handleSubmitReply = async (reviewId) => {
    if (!token) {
      alert("Please sign in to reply to reviews.");
      return;
    }
    if (!replyContent.trim()) {
      alert("Please enter a reply.");
      return;
    }
    try {
      await axios.post(
        `${API_BASE_URL}/reviews/${reviewId}/replies`,
        { content: replyContent },
        { headers: { Authorization: `Bearer ${token}` } },
      );
      setReplyingTo(null);
      setReplyContent("");
      fetchReviews();
      alert("Reply submitted successfully!");
    } catch (error) {
      alert(error.response?.data?.error || "Error submitting reply");
    }
  };

  // Handle edit reply
  const handleEditReply = async (replyId, newContent) => {
    if (!token) {
      alert("Please sign in to edit your reply.");
      return;
    }
    if (!newContent.trim()) {
      alert("Please enter a reply.");
      return;
    }
    try {
      await axios.put(
        `${API_BASE_URL}/replies/${replyId}`,
        { content: newContent },
        { headers: { Authorization: `Bearer ${token}` } },
      );
      setEditingReply(null);
      fetchReviews();
      alert("Reply updated successfully!");
    } catch (error) {
      alert(error.response?.data?.error || "Error editing reply");
    }
  };

  // Handle delete reply
  const handleDeleteReply = async (replyId) => {
    if (!token) {
      alert("Please sign in to delete your reply.");
      return;
    }
    if (!window.confirm("Delete this reply?")) return;
    try {
      await axios.delete(`${API_BASE_URL}/replies/${replyId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchReviews();
      alert("Reply deleted successfully!");
    } catch (error) {
      alert(error.response?.data?.error || "Error deleting reply");
    }
  };

  // ANY signed-in user can edit/delete ANY review
  const canModifyReview = (review) => {
    if (!user) return false;
    return true;
  };

  // Check if current user can modify a reply
  const canModifyReply = (reply) => {
    if (!user) return false;
    if (user.is_admin) return true;
    return reply.user?.id === user.id;
  };

  // Toggle expanded review content on mobile
  const toggleExpand = (reviewId) => {
    setExpandedReviews((prev) => ({
      ...prev,
      [reviewId]: !prev[reviewId],
    }));
  };

  const StarRating = ({
    rating,
    onRatingChange,
    interactive = true,
    size = "text-2xl",
  }) => (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type={interactive ? "button" : undefined}
          onClick={() => interactive && onRatingChange?.(star)}
          className={`${size} ${interactive ? "active:scale-95 transition-transform min-w-[32px] min-h-[32px]" : ""}`}
          disabled={!interactive}
          aria-label={`Rate ${star} stars`}
        >
          <span
            className={star <= rating ? "text-yellow-400" : "text-gray-300"}
          >
            ★
          </span>
        </button>
      ))}
    </div>
  );

  // Core values data
  const coreValues = [
    {
      name: "Professionalism",
      desc: "Expert guides and seamless service delivery",
      icon: (
        <svg
          className="w-8 h-8 text-white"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
          />
        </svg>
      ),
    },
    {
      name: "Integrity",
      desc: "Honest and transparent in all our dealings",
      icon: (
        <svg
          className="w-8 h-8 text-white"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
          />
        </svg>
      ),
    },
    {
      name: "Customer Satisfaction",
      desc: "Your happiness is our ultimate goal",
      icon: (
        <svg
          className="w-8 h-8 text-white"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      ),
    },
    {
      name: "Sustainability",
      desc: "Eco-friendly practices and community support",
      icon: (
        <svg
          className="w-8 h-8 text-white"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      ),
    },
  ];

  // Partners data
  const partners = [
    {
      id: 1,
      name: "Cimo Services",
      imageUrl: "/assets/Cimo.png",
      story:
        "Since 2010, Cimo Services has been our trusted transportation partner. They provide reliable, comfortable, and safe transfers for all our guests from the airport to their accommodations and between destinations. Their fleet of modern vehicles and professional drivers ensure a seamless travel experience.",
      established: "2010",
      location: "Nairobi, Kenya",
      specialty: "Transportation & Logistics",
    },
    {
      id: 2,
      name: "Kenya Safari Lodges",
      imageUrl: "/assets/ken-safa.png",
      story:
        "Our partnership with Kenya Safari Lodges ensures our guests experience the finest accommodations in the country's most spectacular locations. From luxury tented camps to exclusive lodges, they offer exceptional service and authentic African hospitality that perfectly complements our safari experiences.",
      established: "1985",
      location: "Multiple Locations",
      specialty: "Luxury Accommodations",
    },
    {
      id: 3,
      name: "Ashnil",
      imageUrl: "/assets/ash.png",
      story:
        "Ashnil's luxurious camps offer unparalleled wildlife viewing experiences in Kenya's premier game reserves. Located strategically near waterholes and migration routes, their properties provide front-row seats to nature's greatest spectacles while maintaining the highest standards of comfort and service.",
      established: "2005",
      location: "Maasai Mara & Tsavo",
      specialty: "Luxury Safari Camps",
    },
    {
      id: 4,
      name: "Salt Lick",
      imageUrl: "/assets/sallick.png",
      story:
        "The iconic Salt Lick Lodge provides a unique vantage point for wildlife viewing in the Taita Hills Sanctuary. Built on stilts above a natural salt lick and waterhole, it offers guests an unforgettable experience of watching elephants, buffalo, and other wildlife from their rooms or the suspended walkways.",
      established: "1990",
      location: "Taita Hills",
      specialty: "Unique Wildlife Viewing",
    },
  ];

  // Body scroll lock
  useEffect(() => {
    if (selectedPartner || selectedMission || selectedValue) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [selectedPartner, selectedMission, selectedValue]);

  // Partner Modal Component
  const PartnerModal = ({ partner, onClose }) => (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 20 }}
        className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative">
          {/* Hero Image */}
          <div className="h-48 md:h-64 bg-gradient-to-r from-amber-500 to-amber-600 relative overflow-hidden rounded-t-2xl">
            <img
              src={partner.imageUrl}
              alt={partner.name}
              className="w-full h-full object-cover opacity-70"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src =
                  "https://via.placeholder.com/800x400?text=" + partner.name;
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
            <button
              onClick={onClose}
              className="absolute top-4 right-4 w-10 h-10 bg-white/20 backdrop-blur rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-all"
            >
              ✕
            </button>
          </div>

          {/* Content */}
          <div className="p-6 md:p-8">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-gradient-to-r from-amber-500 to-amber-600 rounded-full flex items-center justify-center text-white font-bold text-xl shadow-md">
                {partner.name.charAt(0)}
              </div>
              <div>
                <h2 className="text-2xl md:text-3xl font-bold text-gray-800">
                  {partner.name}
                </h2>
                <p className="text-amber-600 text-sm mt-1">
                  {partner.specialty}
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2 flex items-center gap-2">
                  <span>📖</span> Our Partnership Story
                </h3>
                <p className="text-gray-600 leading-relaxed">{partner.story}</p>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-4">
                <div className="bg-amber-50 rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xl">📅</span>
                    <span className="text-sm text-gray-500">Established</span>
                  </div>
                  <p className="font-semibold text-gray-800">
                    {partner.established}
                  </p>
                </div>
                <div className="bg-amber-50 rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xl">📍</span>
                    <span className="text-sm text-gray-500">Location</span>
                  </div>
                  <p className="font-semibold text-gray-800">
                    {partner.location}
                  </p>
                </div>
              </div>

              <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl p-5 mt-2">
                <p className="text-amber-800 italic text-center">
                  "Proud partners in creating unforgettable safari experiences"
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="w-full mt-6 bg-gradient-to-r from-amber-500 to-amber-600 text-white py-3 rounded-xl font-semibold hover:shadow-lg transition-all active:scale-95"
            >
              Close
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );

  // Mission Modal Component
  const MissionModal = ({ onClose }) => (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 20 }}
        className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6 md:p-8">
          <div className="flex justify-between items-start mb-6">
            <div className="w-14 h-14 md:w-16 md:h-16 bg-gradient-to-br from-amber-500 to-amber-600 rounded-2xl flex items-center justify-center">
              <svg
                className="w-7 h-7 md:w-8 md:h-8 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 10V3L4 14h7v7l9-11h-7z"
                />
              </svg>
            </div>
            <button
              onClick={onClose}
              className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center active:bg-gray-200"
            >
              ✕
            </button>
          </div>
          <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-4">
            Our Mission
          </h2>
          <p className="text-gray-600 text-base md:text-lg mb-6">
            To provide unforgettable safari experiences, promote Kenyan culture,
            and offer world-class tour services that exceed expectations while
            preserving our natural heritage for future generations.
          </p>
          <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl p-5 md:p-6 border-l-4 border-amber-500">
            <p className="text-amber-800 italic text-base md:text-lg">
              "Creating memories that last a lifetime, one safari at a time"
            </p>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-stone-50 via-amber-50 to-orange-50 overflow-x-hidden">
      {/* Hero Section */}
      <header className="relative h-[70vh] min-h-[500px] overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1516426122078-c23e76319801?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80"
            alt="Safari landscape"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/70"></div>
        </div>
        <div className="relative z-10 flex items-center justify-center h-full px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            className="text-center text-white max-w-5xl"
          >
            <span className="text-amber-400 text-base md:text-lg font-semibold tracking-wider">
              EST. 1993
            </span>
            <h1 className="text-4xl md:text-7xl font-bold mb-4 md:mb-6 leading-tight">
              JozTembo
              <br />
              <span className="text-amber-300">Tours & Safari</span>
            </h1>
            <p className="text-lg md:text-2xl mb-6 md:mb-8 text-gray-200">
              Malindi, Lamu Road
            </p>
            <div className="bg-white/10 backdrop-blur-md inline-block px-6 py-3 md:px-8 md:py-4 rounded-full border border-white/20">
              <p className="text-xl md:text-2xl italic font-light">
                "Driven by passion, guided by experience"
              </p>
            </div>
            <p className="text-base md:text-lg text-amber-200 mt-4">
              In cooperation with Cimo Service
            </p>
          </motion.div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">
        {/* Experience Banner */}
        <motion.section
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-12 md:mb-20"
        >
          <div className="bg-gradient-to-r from-amber-600 via-amber-700 to-amber-800 rounded-2xl md:rounded-3xl p-8 md:p-12 text-center text-white">
            <span className="bg-white/20 px-4 py-1 md:px-6 md:py-2 rounded-full text-amber-100 text-sm md:text-base">
              ✦ 30+ Years of Excellence ✦
            </span>
            <h2 className="text-2xl md:text-5xl font-bold mt-4 md:mt-6 mb-3 md:mb-4">
              Crafting Unforgettable African Journeys
            </h2>
            <p className="text-base md:text-xl opacity-90">
              Trusted safari experiences across Kenya since 1993
            </p>
          </div>
        </motion.section>

        {/* Mission & Values */}
        <section className="mb-12 md:mb-20">
          <div className="grid md:grid-cols-2 gap-6 md:gap-8">
            <motion.div
              whileHover={{ y: -5 }}
              className="bg-white rounded-2xl md:rounded-3xl p-6 md:p-8 shadow-lg cursor-pointer transition-all"
              onClick={() => setSelectedMission(true)}
            >
              <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-4">
                Our Mission
              </h2>
              <p className="text-gray-600 text-base md:text-lg mb-6">
                To provide unforgettable safari experiences, promote Kenyan
                culture, and offer world-class tour services.
              </p>
              <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl p-5 md:p-6 border-l-4 border-amber-500">
                <p className="text-amber-800 italic">
                  "Creating memories that last a lifetime"
                </p>
              </div>
              <p className="text-amber-600 text-sm mt-4 text-center">
                Click to learn more →
              </p>
            </motion.div>

            <div className="bg-white rounded-2xl md:rounded-3xl p-6 md:p-8 shadow-lg">
              <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-6">
                Core Values
              </h2>
              {coreValues.map((v, i) => (
                <div
                  key={i}
                  className="flex items-start space-x-3 md:space-x-4 p-2 md:p-3 hover:bg-amber-50 rounded-xl transition-colors cursor-pointer"
                  onClick={() => setSelectedValue(v)}
                >
                  <div className="w-10 h-10 bg-gradient-to-r from-amber-500 to-amber-600 rounded-lg flex items-center justify-center flex-shrink-0">
                    {v.icon}
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800 text-sm md:text-base">
                      {v.name}
                    </h3>
                    <p className="text-gray-600 text-xs md:text-sm">{v.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Partners Section - Restored with Marquee */}
        <section className="mb-12 md:mb-20">
          <div className="text-center mb-8 md:mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800">
              Trusted Partners
            </h2>
            <p className="text-gray-500 mt-2">
              Proudly collaborating with industry leaders
            </p>
          </div>

          {/* Marquee Container */}
          <div className="relative overflow-hidden py-4 md:py-6">
            <div className="flex gap-4 md:gap-6 animate-marquee hover:animation-pause">
              {[...partners, ...partners].map((partner, idx) => (
                <div
                  key={idx}
                  className="flex-shrink-0 w-64 md:w-72 cursor-pointer group"
                  onClick={() => setSelectedPartner(partner)}
                >
                  <div className="bg-white rounded-xl md:rounded-2xl shadow-lg overflow-hidden transition-all duration-300 group-hover:shadow-2xl group-hover:-translate-y-1">
                    <div className="h-32 md:h-40 bg-gradient-to-r from-amber-100 to-orange-100 relative overflow-hidden">
                      <img
                        src={partner.imageUrl}
                        alt={partner.name}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src =
                            "https://via.placeholder.com/300x200?text=" +
                            partner.name;
                        }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    </div>
                    <div className="p-4 md:p-5">
                      <h3 className="text-base md:text-lg font-bold text-gray-800 group-hover:text-amber-600 transition-colors">
                        {partner.name}
                      </h3>
                      <p className="text-xs md:text-sm text-gray-500 mt-1">
                        {partner.specialty}
                      </p>
                      <span className="inline-block mt-3 text-xs md:text-sm text-amber-600 font-medium group-hover:translate-x-1 transition-transform">
                        Learn more →
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Add marquee animation CSS */}
        <style jsx>{`
          @keyframes marquee {
            0% {
              transform: translateX(0);
            }
            100% {
              transform: translateX(-50%);
            }
          }
          .animate-marquee {
            animation: marquee 30s linear infinite;
            width: max-content;
            display: flex;
          }
          .animation-pause {
            animation-play-state: paused;
          }
          @media (max-width: 768px) {
            .animate-marquee {
              animation: marquee 20s linear infinite;
            }
          }
        `}</style>

        {/* ============ REVIEWS SECTION ============ */}
        <section className="mb-12 md:mb-20">
          {/* Stats Cards */}
          <div className="grid grid-cols-2 gap-3 md:gap-6 mb-8 md:mb-12">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="bg-gradient-to-br from-amber-500 to-amber-600 rounded-xl md:rounded-2xl p-4 md:p-8 text-white shadow-lg"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-amber-100 text-xs md:text-sm uppercase tracking-wide">
                    Rating
                  </p>
                  <p className="text-3xl md:text-6xl font-bold mt-1 md:mt-2">
                    {reviewStats.average_rating}
                  </p>
                  <p className="text-amber-100 text-xs md:text-sm mt-1">
                    out of 5
                  </p>
                </div>
                <div className="text-3xl md:text-5xl">⭐</div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="bg-gradient-to-br from-amber-600 to-amber-700 rounded-xl md:rounded-2xl p-4 md:p-8 text-white shadow-lg"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-amber-100 text-xs md:text-sm uppercase tracking-wide">
                    Reviews
                  </p>
                  <p className="text-3xl md:text-6xl font-bold mt-1 md:mt-2">
                    {reviewStats.total_reviews}
                  </p>
                  <p className="text-amber-100 text-xs md:text-sm mt-1">
                    total
                  </p>
                </div>
                <div className="text-3xl md:text-5xl">📝</div>
              </div>
            </motion.div>
          </div>

          {/* Write Review Button */}
          <div className="text-center mb-6 md:mb-10">
            {!showReviewForm && (
              <motion.button
                whileTap={{ scale: 0.97 }}
                onClick={() => {
                  setShowReviewForm(true);
                  setEditingReview(null);
                  setReviewForm({
                    reviewer_name: "",
                    rating: 5,
                    title: "",
                    content: "",
                    visit_date: "",
                    package_used: "",
                  });
                }}
                className="w-full md:w-auto bg-gradient-to-r from-amber-500 to-amber-600 text-white px-6 md:px-10 py-3 md:py-4 rounded-full font-semibold active:scale-95 transition-all shadow-lg"
              >
                ✍️ Write a Review
              </motion.button>
            )}
            {user ? (
              <p className="text-xs md:text-sm text-gray-500 mt-3 md:mt-4">
                ✨ Signed in as{" "}
                <span className="font-semibold text-amber-600">
                  {user.name}
                </span>
                {user.is_admin && (
                  <span className="ml-2 text-xs bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full">
                    Admin
                  </span>
                )}
              </p>
            ) : (
              <p className="text-xs md:text-sm text-gray-500 mt-3 md:mt-4">
                🔒 Sign in to edit or delete reviews
              </p>
            )}
          </div>

          {/* Review Form */}
          <AnimatePresence>
            {showReviewForm && (
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="bg-white rounded-xl md:rounded-2xl p-5 md:p-8 shadow-xl mb-6 md:mb-10"
              >
                <form
                  onSubmit={handleSubmitReview}
                  className="space-y-4 md:space-y-6"
                >
                  <div className="flex justify-between items-center">
                    <h3 className="text-xl md:text-2xl font-bold text-gray-800">
                      {editingReview ? "✏️ Edit" : "✨ Share Your Journey"}
                    </h3>
                    <button
                      type="button"
                      onClick={() => {
                        setShowReviewForm(false);
                        setEditingReview(null);
                      }}
                      className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-gray-100 text-gray-500 active:bg-gray-200"
                    >
                      ✕
                    </button>
                  </div>

                  {!user && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Your Name{" "}
                        <span className="text-gray-400">(optional)</span>
                      </label>
                      <input
                        type="text"
                        value={reviewForm.reviewer_name}
                        onChange={(e) =>
                          setReviewForm({
                            ...reviewForm,
                            reviewer_name: e.target.value,
                          })
                        }
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl text-base focus:ring-2 focus:ring-amber-500"
                        placeholder="Enter your name"
                      />
                    </div>
                  )}

                  {user && (
                    <div className="bg-gradient-to-r from-amber-50 to-orange-50 p-3 md:p-4 rounded-xl">
                      <p className="text-xs md:text-sm text-gray-600 mb-2">
                        Posting as
                      </p>
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 md:w-10 md:h-10 bg-gradient-to-r from-amber-500 to-amber-600 rounded-full flex items-center justify-center text-white font-bold shadow">
                          {user.name?.charAt(0) || "U"}
                        </div>
                        <span className="font-semibold text-gray-800 text-sm md:text-base">
                          {user.name}
                        </span>
                      </div>
                    </div>
                  )}

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Rating
                    </label>
                    <StarRating
                      rating={reviewForm.rating}
                      onRatingChange={(r) =>
                        setReviewForm({ ...reviewForm, rating: r })
                      }
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Title
                    </label>
                    <input
                      type="text"
                      value={reviewForm.title}
                      onChange={(e) =>
                        setReviewForm({ ...reviewForm, title: e.target.value })
                      }
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl text-base focus:ring-2 focus:ring-amber-500"
                      placeholder="Summarize your experience"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Your Story
                    </label>
                    <textarea
                      value={reviewForm.content}
                      onChange={(e) =>
                        setReviewForm({
                          ...reviewForm,
                          content: e.target.value,
                        })
                      }
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl text-base focus:ring-2 focus:ring-amber-500"
                      rows={4}
                      placeholder="Tell us about your adventure..."
                      required
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Visit Date
                      </label>
                      <input
                        type="date"
                        value={reviewForm.visit_date}
                        onChange={(e) =>
                          setReviewForm({
                            ...reviewForm,
                            visit_date: e.target.value,
                          })
                        }
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl text-base focus:ring-2 focus:ring-amber-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Package
                      </label>
                      <input
                        type="text"
                        value={reviewForm.package_used}
                        onChange={(e) =>
                          setReviewForm({
                            ...reviewForm,
                            package_used: e.target.value,
                          })
                        }
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl text-base focus:ring-2 focus:ring-amber-500"
                        placeholder="e.g., 5-Day Safari"
                      />
                    </div>
                  </div>

                  <div className="flex gap-3 pt-2">
                    <button
                      type="submit"
                      className="flex-1 bg-gradient-to-r from-amber-500 to-amber-600 text-white py-3 rounded-xl font-semibold active:scale-95 transition-all"
                    >
                      {editingReview ? "Update" : "Publish"}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setShowReviewForm(false);
                        setEditingReview(null);
                      }}
                      className="flex-1 bg-gray-100 text-gray-700 py-3 rounded-xl font-semibold active:bg-gray-200 transition-all"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Reviews List */}
          {reviewsLoading ? (
            <div className="text-center py-12 md:py-16">
              <div className="inline-block animate-spin rounded-full h-10 w-10 md:h-12 md:w-12 border-4 border-amber-500 border-t-transparent"></div>
              <p className="mt-3 md:mt-4 text-gray-500 text-sm md:text-base">
                Loading stories...
              </p>
            </div>
          ) : reviews.length === 0 ? (
            <div className="text-center py-12 md:py-16 bg-white rounded-xl md:rounded-2xl shadow">
              <p className="text-3xl md:text-4xl mb-3 md:mb-4">🌟</p>
              <p className="text-base md:text-xl text-gray-600">
                Be the first to share your experience!
              </p>
            </div>
          ) : (
            <div className="space-y-4 md:space-y-6">
              {reviews.map((review) => {
                const isExpanded = expandedReviews[review.id];
                const shouldTruncate = isMobile && review.content.length > 150;
                const displayContent =
                  shouldTruncate && !isExpanded
                    ? review.content.substring(0, 150) + "..."
                    : review.content;

                return (
                  <motion.div
                    key={review.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    onMouseEnter={() => setHoveredReview(review.id)}
                    onMouseLeave={() => setHoveredReview(null)}
                    className="bg-white rounded-xl md:rounded-2xl shadow-md hover:shadow-xl transition-all duration-300"
                  >
                    <div className="p-4 md:p-6 border-b border-gray-100">
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-center gap-3 flex-1 min-w-0">
                          <div className="w-10 h-10 md:w-12 md:h-12 bg-gradient-to-r from-amber-500 to-amber-600 rounded-full flex items-center justify-center text-white font-bold text-base md:text-lg shadow flex-shrink-0">
                            {(review.user?.name || review.reviewer_name || "A")
                              .charAt(0)
                              .toUpperCase()}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="font-bold text-gray-800 text-sm md:text-base truncate">
                              {review.user?.name ||
                                review.reviewer_name ||
                                "Anonymous"}
                              {review.user?.id === user?.id && (
                                <span className="ml-2 text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">
                                  You
                                </span>
                              )}
                            </div>
                            <div className="flex flex-wrap items-center gap-1 md:gap-2 mt-1">
                              <StarRating
                                rating={review.rating}
                                interactive={false}
                                size="text-xs md:text-sm"
                              />
                              <span className="text-xs text-gray-400">•</span>
                              <span className="text-xs text-gray-500">
                                {new Date(review.created_at).toLocaleDateString(
                                  "en-US",
                                  {
                                    year: "numeric",
                                    month: "short",
                                    day: "numeric",
                                  },
                                )}
                              </span>
                              {review.is_edited && (
                                <span className="text-xs text-gray-400 italic">
                                  (edited)
                                </span>
                              )}
                            </div>
                          </div>
                        </div>

                        {canModifyReview(review) && (
                          <div
                            className={`flex gap-1 md:gap-2 flex-shrink-0 transition-opacity duration-300 ${hoveredReview === review.id ? "md:opacity-100" : "md:opacity-70"}`}
                          >
                            <button
                              onClick={() => handleEditReview(review)}
                              className="px-2 md:px-3 py-1 text-xs md:text-sm bg-blue-50 text-blue-600 rounded-lg active:bg-blue-100"
                            >
                              ✏️ Edit
                            </button>
                            <button
                              onClick={() =>
                                handleDeleteReview(
                                  review.id,
                                  review.user?.id,
                                  review.title,
                                )
                              }
                              className="px-2 md:px-3 py-1 text-xs md:text-sm bg-red-50 text-red-600 rounded-lg active:bg-red-100"
                            >
                              🗑️ Delete
                            </button>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="p-4 md:p-6">
                      <h4 className="text-base md:text-lg font-bold text-gray-800 mb-2">
                        {review.title}
                      </h4>
                      <p className="text-gray-600 text-sm md:text-base leading-relaxed">
                        {displayContent}
                      </p>

                      {shouldTruncate && (
                        <button
                          onClick={() => toggleExpand(review.id)}
                          className="text-amber-600 text-xs md:text-sm mt-2 font-medium active:text-amber-700"
                        >
                          {isExpanded ? "Show less" : "Read more"}
                        </button>
                      )}

                      <div className="flex flex-wrap gap-2 mt-3 md:mt-4">
                        {review.package_used && (
                          <span className="inline-flex items-center gap-1 text-xs bg-amber-50 text-amber-700 px-2 py-1 rounded-full">
                            📦 {review.package_used}
                          </span>
                        )}
                        {review.visit_date && (
                          <span className="inline-flex items-center gap-1 text-xs bg-gray-50 text-gray-600 px-2 py-1 rounded-full">
                            📅{" "}
                            {new Date(review.visit_date).toLocaleDateString()}
                          </span>
                        )}
                      </div>

                      {user && replyingTo !== review.id && (
                        <button
                          onClick={() => setReplyingTo(review.id)}
                          className="mt-3 md:mt-4 text-xs md:text-sm text-green-600 font-medium active:text-green-700"
                        >
                          💬 Reply
                        </button>
                      )}

                      {user && replyingTo === review.id && (
                        <div className="mt-3 md:mt-4">
                          <textarea
                            value={replyContent}
                            onChange={(e) => setReplyContent(e.target.value)}
                            className="w-full px-3 md:px-4 py-2 md:py-3 border border-gray-200 rounded-xl text-sm md:text-base focus:ring-2 focus:ring-amber-500"
                            rows={3}
                            placeholder={`Reply as ${user.name}...`}
                          />
                          <div className="flex gap-2 mt-2">
                            <button
                              onClick={() => handleSubmitReply(review.id)}
                              className="bg-gradient-to-r from-amber-500 to-amber-600 text-white px-3 md:px-4 py-1.5 md:py-2 rounded-lg text-xs md:text-sm active:scale-95"
                            >
                              Submit
                            </button>
                            <button
                              onClick={() => {
                                setReplyingTo(null);
                                setReplyContent("");
                              }}
                              className="bg-gray-100 text-gray-700 px-3 md:px-4 py-1.5 md:py-2 rounded-lg text-xs md:text-sm active:bg-gray-200"
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      )}

                      {review.replies?.length > 0 && (
                        <div className="mt-4 md:mt-6 space-y-2 md:space-y-3">
                          <div className="flex items-center gap-2">
                            <div className="h-px flex-1 bg-gray-200"></div>
                            <span className="text-xs text-gray-400 font-medium">
                              {review.replies.length}{" "}
                              {review.replies.length === 1
                                ? "REPLY"
                                : "REPLIES"}
                            </span>
                            <div className="h-px flex-1 bg-gray-200"></div>
                          </div>
                          {review.replies.map((reply) => (
                            <div
                              key={reply.id}
                              className="bg-gray-50 rounded-lg p-3 md:p-4"
                            >
                              {editingReply === reply.id ? (
                                <div>
                                  <textarea
                                    defaultValue={reply.content}
                                    className="w-full px-3 md:px-4 py-2 border rounded-lg text-sm md:text-base mb-2"
                                    rows={3}
                                    id={`edit-reply-${reply.id}`}
                                  />
                                  <div className="flex gap-2">
                                    <button
                                      onClick={() => {
                                        const newContent =
                                          document.getElementById(
                                            `edit-reply-${reply.id}`,
                                          ).value;
                                        handleEditReply(reply.id, newContent);
                                      }}
                                      className="bg-amber-600 text-white px-3 py-1 rounded-lg text-xs md:text-sm"
                                    >
                                      Save
                                    </button>
                                    <button
                                      onClick={() => setEditingReply(null)}
                                      className="bg-gray-300 text-gray-700 px-3 py-1 rounded-lg text-xs md:text-sm"
                                    >
                                      Cancel
                                    </button>
                                  </div>
                                </div>
                              ) : (
                                <>
                                  <div className="flex items-start justify-between">
                                    <div className="flex items-center gap-2 flex-1 min-w-0">
                                      <div className="w-6 h-6 md:w-8 md:h-8 bg-gradient-to-r from-green-500 to-green-600 rounded-full flex items-center justify-center text-white text-xs md:text-sm font-bold flex-shrink-0">
                                        {reply.user?.name?.charAt(0) || "U"}
                                      </div>
                                      <div className="flex-1 min-w-0">
                                        <div className="font-semibold text-xs md:text-sm text-gray-800 truncate">
                                          {reply.user?.name || "User"}
                                          {reply.user?.is_admin && (
                                            <span className="ml-1 text-xs bg-amber-100 text-amber-700 px-1.5 py-0.5 rounded-full">
                                              Admin
                                            </span>
                                          )}
                                          {reply.user?.id === user?.id && (
                                            <span className="ml-1 text-xs bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded-full">
                                              You
                                            </span>
                                          )}
                                        </div>
                                        <div className="text-xs text-gray-400">
                                          {new Date(
                                            reply.created_at,
                                          ).toLocaleDateString()}
                                          {reply.is_edited && (
                                            <span className="ml-1 italic">
                                              (edited)
                                            </span>
                                          )}
                                        </div>
                                      </div>
                                    </div>
                                    {canModifyReply(reply) && (
                                      <div className="flex gap-1 flex-shrink-0">
                                        <button
                                          onClick={() =>
                                            setEditingReply(reply.id)
                                          }
                                          className="text-xs text-blue-600 px-1.5 py-0.5 rounded active:text-blue-700"
                                        >
                                          Edit
                                        </button>
                                        <button
                                          onClick={() =>
                                            handleDeleteReply(reply.id)
                                          }
                                          className="text-xs text-red-600 px-1.5 py-0.5 rounded active:text-red-700"
                                        >
                                          Delete
                                        </button>
                                      </div>
                                    )}
                                  </div>
                                  <p className="text-gray-600 mt-2 text-xs md:text-sm pl-8">
                                    {reply.content}
                                  </p>
                                </>
                              )}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}

          {reviewPagination.pages > 1 && (
            <div className="flex justify-center items-center gap-2 md:gap-3 mt-6 md:mt-12">
              <button
                onClick={() => setReviewPage(reviewPage - 1)}
                disabled={!reviewPagination.has_prev}
                className="px-4 md:px-5 py-2 bg-white border border-gray-200 rounded-lg text-sm md:text-base disabled:opacity-50 active:bg-gray-50"
              >
                ← Prev
              </button>
              <span className="px-3 md:px-4 py-2 text-gray-600 text-sm md:text-base">
                {reviewPage} / {reviewPagination.pages}
              </span>
              <button
                onClick={() => setReviewPage(reviewPage + 1)}
                disabled={!reviewPagination.has_next}
                className="px-4 md:px-5 py-2 bg-white border border-gray-200 rounded-lg text-sm md:text-base disabled:opacity-50 active:bg-gray-50"
              >
                Next →
              </button>
            </div>
          )}
        </section>

        {/* CTA */}
        <section className="text-center">
          <div className="bg-gradient-to-br from-amber-500 via-amber-600 to-orange-600 rounded-2xl md:rounded-3xl p-8 md:p-12 text-white shadow-xl">
            <h2 className="text-2xl md:text-4xl font-bold mb-3 md:mb-4">
              Ready for Adventure?
            </h2>
            <p className="text-sm md:text-lg mb-4 md:mb-6 px-2">
              Let our expertise guide you through Kenya's wild heart
            </p>
            <div className="inline-block bg-white/20 backdrop-blur-sm px-5 py-2 md:px-8 md:py-4 rounded-full">
              <p className="text-base md:text-xl italic font-light">
                Driven by passion, guided by experience
              </p>
            </div>
          </div>
        </section>
      </main>

      {/* Modals */}
      <AnimatePresence>
        {selectedMission && (
          <MissionModal onClose={() => setSelectedMission(false)} />
        )}
        {selectedPartner && (
          <PartnerModal
            partner={selectedPartner}
            onClose={() => setSelectedPartner(null)}
          />
        )}
        {selectedValue && (
          <ValueModal
            value={selectedValue}
            onClose={() => setSelectedValue(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

// Value Modal Component
const ValueModal = ({ value, onClose }) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
    onClick={onClose}
  >
    <motion.div
      initial={{ scale: 0.9, y: 20 }}
      animate={{ scale: 1, y: 0 }}
      exit={{ scale: 0.9, y: 20 }}
      className="bg-white rounded-2xl max-w-md w-full shadow-2xl"
      onClick={(e) => e.stopPropagation()}
    >
      <div className="p-6 md:p-8">
        <div className="flex justify-between items-start mb-4">
          <div className="w-14 h-14 md:w-16 md:h-16 bg-gradient-to-br from-amber-500 to-amber-600 rounded-2xl flex items-center justify-center">
            {value.icon}
          </div>
          <button
            onClick={onClose}
            className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center active:bg-gray-200"
          >
            ✕
          </button>
        </div>
        <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-3">
          {value.name}
        </h2>
        <p className="text-gray-600 text-base md:text-lg leading-relaxed">
          {value.desc}
        </p>
        <button
          onClick={onClose}
          className="w-full mt-6 bg-gradient-to-r from-amber-500 to-amber-600 text-white py-3 rounded-xl font-semibold active:scale-95 transition-all"
        >
          Close
        </button>
      </div>
    </motion.div>
  </motion.div>
);

export default About;
