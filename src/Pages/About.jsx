import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";

const API_BASE_URL = "http://localhost:5000/api";

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
    reviewer_name: "", // ✅ NEW: Name field for all users
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

      // ✅ Prepare data to send to backend
      const reviewData = {
        rating: reviewForm.rating,
        title: reviewForm.title,
        content: reviewForm.content,
        visit_date: reviewForm.visit_date || null,
        package_used: reviewForm.package_used || null,
      };

      // ✅ If user is NOT signed in, include reviewer_name
      if (!user) {
        reviewData.reviewer_name = reviewForm.reviewer_name || "Anonymous";
      }
      // If user IS signed in, the backend will use the authenticated user's name

      if (editingReview) {
        // ✅ Signed-in users can edit THEIR OWN reviews
        if (!token) {
          alert("Please sign in to edit your review.");
          return;
        }
        await axios.put(
          `${API_BASE_URL}/reviews/${editingReview.id}`,
          reviewData,
          { headers },
        );
        setEditingReview(null);
      } else {
        // ✅ Anyone can post (auth optional)
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
    } catch (error) {
      alert(error.response?.data?.error || "Error submitting review");
    }
  };

  // Handle edit review
  const handleEditReview = (review) => {
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
    // Scroll to form
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Handle delete review
  const handleDeleteReview = async (reviewId) => {
    if (!token) {
      alert("Please sign in to delete your review.");
      return;
    }
    if (!window.confirm("Delete this review? This action cannot be undone."))
      return;
    try {
      await axios.delete(`${API_BASE_URL}/reviews/${reviewId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchReviews();
    } catch (error) {
      alert(error.response?.data?.error || "Error deleting review");
    }
  };

  // ✅ Admin only - submit reply
  const handleSubmitReply = async (reviewId) => {
    if (!token || !user?.is_admin) {
      alert("Admin sign-in required. Please sign in via the footer.");
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
    } catch (error) {
      alert(error.response?.data?.error || "Error submitting reply");
    }
  };

  // ✅ Admin only - delete reply
  const handleDeleteReply = async (replyId) => {
    if (!token || !user?.is_admin) {
      alert("Admin sign-in required. Please sign in via the footer.");
      return;
    }
    if (!window.confirm("Delete this reply?")) return;
    try {
      await axios.delete(`${API_BASE_URL}/replies/${replyId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchReviews();
    } catch (error) {
      alert(error.response?.data?.error || "Error deleting reply");
    }
  };

  // ✅ Check if current user can edit/delete a review
  const canModifyReview = (review) => {
    if (!user) return false;
    // Admin can modify any review
    if (user.is_admin) return true;
    // Regular user can only modify their own reviews
    return review.user?.id === user.id;
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
          className={`${size} ${interactive ? "cursor-pointer hover:scale-110 transition-transform" : ""}`}
          disabled={!interactive}
        >
          {star <= rating ? "⭐" : "☆"}
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

  // Partners data (shortened for brevity)
  const partners = [
    {
      id: 1,
      name: "Cimo Services",
      imageUrl: "/assets/Cimo.png",
      story:
        "Since 2010, Cimo Services has been our trusted transportation partner...",
      established: "2010",
      location: "Nairobi, Kenya",
      specialty: "Transportation & Logistics",
    },
    {
      id: 2,
      name: "Kenya Safari Lodges",
      imageUrl: "/assets/ken-safa.png",
      story:
        "Our partnership with Kenya Safari Lodges ensures our guests experience the finest accommodations...",
      established: "1985",
      location: "Multiple Locations",
      specialty: "Luxury Accommodations",
    },
    {
      id: 3,
      name: "Ashnil",
      imageUrl: "/assets/ash.png",
      story:
        "Ashnil's luxurious camps offer unparalleled wildlife viewing experiences...",
      established: "2005",
      location: "Maasai Mara & Tsavo",
      specialty: "Luxury Safari Camps",
    },
    {
      id: 4,
      name: "Salt Lick",
      imageUrl: "/assets/sallick.png",
      story: "The iconic Salt Lick Lodge provides a unique vantage point...",
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

  // Modal components (shortened - same as before)
  const MissionModal = ({ onClose }) => (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 20 }}
        className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-8">
          <div className="flex justify-between items-start mb-6">
            <div className="w-16 h-16 bg-gradient-to-br from-amber-500 to-amber-600 rounded-2xl flex items-center justify-center">
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
                  d="M13 10V3L4 14h7v7l9-11h-7z"
                />
              </svg>
            </div>
            <button
              onClick={onClose}
              className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-200"
            >
              ✕
            </button>
          </div>
          <h2 className="text-3xl font-bold text-gray-800 mb-4">Our Mission</h2>
          <p className="text-gray-600 text-lg mb-6">
            To provide unforgettable safari experiences, promote Kenyan culture,
            and offer world-class tour services.
          </p>
          <div className="bg-amber-50 rounded-xl p-6 border-l-4 border-amber-500">
            <p className="text-amber-800 italic text-lg">
              "Creating memories that last a lifetime"
            </p>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-stone-50 via-amber-50 to-orange-50 overflow-x-hidden">
      {/* Hero Section */}
      <header className="relative h-screen max-h-[800px] min-h-[600px] overflow-hidden">
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
            <span className="text-amber-400 text-lg font-semibold tracking-wider">
              EST. 1993
            </span>
            <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
              JozTembo
              <br />
              <span className="text-amber-300">Tours & Safari</span>
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-gray-200">
              Malindi, Lamu Road
            </p>
            <div className="bg-white/10 backdrop-blur-md inline-block px-8 py-4 rounded-full border border-white/20">
              <p className="text-2xl md:text-3xl italic font-light">
                "Driven by passion, guided by experience"
              </p>
            </div>
            <p className="text-lg text-amber-200 mt-4">
              In cooperation with Cimo Service
            </p>
          </motion.div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        {/* Experience Banner */}
        <motion.section
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-20"
        >
          <div className="bg-gradient-to-r from-amber-600 via-amber-700 to-amber-800 rounded-3xl p-12 text-center text-white">
            <span className="bg-white/20 px-6 py-2 rounded-full text-amber-100">
              ✦ 30+ Years of Excellence ✦
            </span>
            <h2 className="text-4xl md:text-5xl font-bold mt-6 mb-4">
              Crafting Unforgettable African Journeys
            </h2>
            <p className="text-xl opacity-90">
              Trusted safari experiences across Kenya since 1993
            </p>
          </div>
        </motion.section>

        {/* Mission & Values */}
        <section className="mb-20">
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white rounded-3xl p-8 shadow-xl">
              <h2 className="text-3xl font-bold text-gray-800 mb-4">
                Our Mission
              </h2>
              <p className="text-gray-600 text-lg mb-6">
                To provide unforgettable safari experiences, promote Kenyan
                culture, and offer world-class tour services.
              </p>
              <div className="bg-amber-50 rounded-xl p-6 border-l-4 border-amber-500">
                <p className="text-amber-800 italic">
                  "Creating memories that last a lifetime"
                </p>
              </div>
            </div>
            <div className="bg-white rounded-3xl p-8 shadow-xl">
              <h2 className="text-3xl font-bold text-gray-800 mb-6">
                Core Values
              </h2>
              {coreValues.map((v, i) => (
                <div
                  key={i}
                  className="flex items-start space-x-4 p-3 hover:bg-amber-50 rounded-xl"
                >
                  <div className="w-2 h-2 bg-amber-500 rounded-full mt-2.5"></div>
                  <div>
                    <h3 className="font-semibold text-gray-800">{v.name}</h3>
                    <p className="text-gray-600">{v.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Partners */}
        <section className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-800">
              Trusted Partners
            </h2>
          </div>
          <style>{`@keyframes marqueeScroll { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } } .marquee-container { position: relative; width: 100%; overflow: hidden; } .marquee-track { display: flex; gap: 1.5rem; width: max-content; animation: marqueeScroll 40s linear infinite; } .marquee-track:hover { animation-play-state: paused; } .partner-card { flex-shrink: 0; width: 16rem; cursor: pointer; }`}</style>
          <div className="marquee-container py-8">
            <div className="marquee-track py-4">
              {[...partners, ...partners].map((partner, idx) => (
                <div
                  key={idx}
                  className="partner-card hover:scale-105 transition-transform"
                  onClick={() => setSelectedPartner(partner)}
                >
                  <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-amber-100">
                    <div className="h-40 bg-amber-50">
                      <img
                        src={partner.imageUrl}
                        alt={partner.name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src =
                            "https://via.placeholder.com/300x200?text=" +
                            partner.name;
                        }}
                      />
                    </div>
                    <div className="p-5">
                      <h3 className="text-lg font-bold">{partner.name}</h3>
                      <span className="text-sm text-amber-600">
                        Click to learn more →
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ============ REVIEWS SECTION ============ */}
        <section className="mb-20">
          <div className="text-center mb-12">
            <span className="text-amber-600 font-semibold tracking-wider text-sm">
              TESTIMONIALS
            </span>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mt-2 mb-4">
              What Our Travelers Say
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-amber-400 to-amber-600 mx-auto rounded-full mb-6"></div>
            <div className="flex justify-center gap-8 mt-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-amber-600">
                  {reviewStats.average_rating}
                </div>
                <div className="text-sm text-gray-600">Average Rating</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-amber-600">
                  {reviewStats.total_reviews}
                </div>
                <div className="text-sm text-gray-600">Total Reviews</div>
              </div>
            </div>
          </div>

          {/* Write Review Button & Auth Info */}
          <div className="text-center mb-8">
            {!showReviewForm && (
              <button
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
                className="bg-amber-600 text-white px-8 py-3 rounded-full font-semibold hover:bg-amber-700 shadow-lg transition-all hover:shadow-xl"
              >
                ✍️ Write a Review
              </button>
            )}
            {user ? (
              <p className="text-sm text-gray-500 mt-2">
                Signed in as <span className="font-semibold">{user.name}</span>
                {user.is_admin && (
                  <span className="ml-2 text-xs bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full">
                    Admin
                  </span>
                )}
              </p>
            ) : (
              <p className="text-sm text-gray-400 mt-2">
                You can add your name when submitting a review ✨
              </p>
            )}
          </div>

          {/* Review Form */}
          <AnimatePresence>
            {showReviewForm && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="bg-white rounded-2xl p-6 shadow-xl mb-8 border border-amber-100"
              >
                <form onSubmit={handleSubmitReview} className="space-y-4">
                  <div className="flex justify-between items-center">
                    <h3 className="text-xl font-bold text-gray-800">
                      {editingReview
                        ? "✏️ Edit Your Review"
                        : "📝 Share Your Experience"}
                    </h3>
                  </div>

                  {/* ✅ NAME FIELD - Always visible for non-authenticated users */}
                  {!user && (
                    <div>
                      <label className="block text-sm font-medium mb-1">
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
                        className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                        placeholder="Enter your name (or leave blank for Anonymous)"
                      />
                      <p className="text-xs text-gray-400 mt-1">
                        If left blank, your review will appear as "Anonymous"
                      </p>
                    </div>
                  )}

                  {/* If user IS signed in, show their name (read-only) */}
                  {user && (
                    <div className="bg-amber-50 p-3 rounded-lg">
                      <label className="block text-sm font-medium mb-1 text-gray-600">
                        Posting as
                      </label>
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-amber-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
                          {user.name?.charAt(0) || "U"}
                        </div>
                        <span className="font-semibold text-gray-800">
                          {user.name}
                        </span>
                      </div>
                    </div>
                  )}

                  <div>
                    <label className="block text-sm font-medium mb-2">
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
                    <label className="block text-sm font-medium mb-1">
                      Title *
                    </label>
                    <input
                      type="text"
                      value={reviewForm.title}
                      onChange={(e) =>
                        setReviewForm({ ...reviewForm, title: e.target.value })
                      }
                      className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                      placeholder="Summarize your experience"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Your Review *
                    </label>
                    <textarea
                      value={reviewForm.content}
                      onChange={(e) =>
                        setReviewForm({
                          ...reviewForm,
                          content: e.target.value,
                        })
                      }
                      className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                      rows={4}
                      placeholder="Tell us about your experience..."
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">
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
                        className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">
                        Package Used
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
                        className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                        placeholder="e.g., Maasai Mara Safari"
                      />
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <button
                      type="submit"
                      className="flex-1 bg-amber-600 text-white py-3 rounded-lg hover:bg-amber-700 font-semibold transition-colors"
                    >
                      {editingReview ? "✅ Update Review" : "📤 Submit Review"}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setShowReviewForm(false);
                        setEditingReview(null);
                      }}
                      className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-lg hover:bg-gray-300 transition-colors"
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
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600 mx-auto"></div>
            </div>
          ) : reviews.length === 0 ? (
            <div className="text-center py-8 text-gray-600">
              <p className="text-xl">
                No reviews yet. Be the first to share your experience!
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {reviews.map((review) => (
                <motion.div
                  key={review.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-amber-500 rounded-full flex items-center justify-center text-white font-bold">
                        {(
                          review.user?.name ||
                          review.reviewer_name ||
                          "A"
                        ).charAt(0)}
                      </div>
                      <div>
                        <div className="font-semibold text-gray-800">
                          {review.user?.name ||
                            review.reviewer_name ||
                            "Anonymous"}
                          {review.user?.id === user?.id && (
                            <span className="ml-2 text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">
                              You
                            </span>
                          )}
                        </div>
                        <div className="text-sm text-gray-500">
                          {new Date(review.created_at).toLocaleDateString(
                            "en-US",
                            {
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                            },
                          )}
                          {review.is_edited && (
                            <span className="ml-2 italic">(edited)</span>
                          )}
                        </div>
                      </div>
                    </div>
                    <StarRating
                      rating={review.rating}
                      interactive={false}
                      size="text-lg"
                    />
                  </div>

                  <h4 className="text-lg font-bold text-gray-800 mb-2">
                    {review.title}
                  </h4>
                  <p className="text-gray-600 mb-3">{review.content}</p>

                  {review.package_used && (
                    <div className="text-sm text-amber-600 mb-2">
                      📦 Package: {review.package_used}
                    </div>
                  )}
                  {review.visit_date && (
                    <div className="text-sm text-gray-500 mb-3">
                      📅 Visited:{" "}
                      {new Date(review.visit_date).toLocaleDateString()}
                    </div>
                  )}

                  {/* Action Buttons - Visible to review owner AND admins */}
                  {canModifyReview(review) && (
                    <div className="flex gap-2 mt-4 border-t pt-3">
                      <button
                        onClick={() => handleEditReview(review)}
                        className="text-sm text-blue-600 hover:text-blue-800 hover:underline font-medium"
                      >
                        ✏️ Edit
                      </button>
                      <button
                        onClick={() => handleDeleteReview(review.id)}
                        className="text-sm text-red-600 hover:text-red-800 hover:underline font-medium"
                      >
                        🗑️ Delete
                      </button>
                      {user?.is_admin && (
                        <span className="text-xs text-gray-400 self-center ml-2">
                          Admin
                        </span>
                      )}
                    </div>
                  )}

                  {/* Admin Reply Actions */}
                  {user?.is_admin && (
                    <div className="flex gap-2 mt-2 border-t pt-3">
                      {replyingTo !== review.id ? (
                        <button
                          onClick={() => setReplyingTo(review.id)}
                          className="text-sm text-green-600 hover:text-green-800 hover:underline font-medium"
                        >
                          💬 Reply as Admin
                        </button>
                      ) : (
                        <button
                          onClick={() => {
                            setReplyingTo(null);
                            setReplyContent("");
                          }}
                          className="text-sm text-gray-600 hover:underline"
                        >
                          Cancel Reply
                        </button>
                      )}
                    </div>
                  )}

                  {/* Reply Form - Admin Only */}
                  {replyingTo === review.id && user?.is_admin && (
                    <div className="mt-4 pl-4 border-l-2 border-amber-300">
                      <textarea
                        value={replyContent}
                        onChange={(e) => setReplyContent(e.target.value)}
                        className="w-full px-3 py-2 border rounded-lg mb-2 focus:ring-2 focus:ring-amber-500"
                        rows={3}
                        placeholder="Write your reply..."
                      />
                      <button
                        onClick={() => handleSubmitReply(review.id)}
                        className="bg-amber-600 text-white px-4 py-2 rounded-lg hover:bg-amber-700 text-sm"
                      >
                        Submit Reply
                      </button>
                    </div>
                  )}

                  {/* Replies */}
                  {review.replies?.length > 0 && (
                    <div className="mt-4 space-y-3 pl-4 border-l-2 border-gray-200">
                      {review.replies.map((reply) => (
                        <div
                          key={reply.id}
                          className="bg-gray-50 rounded-lg p-4"
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex items-center gap-2">
                              <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
                                A
                              </div>
                              <div>
                                <div className="font-semibold text-sm text-gray-800">
                                  {reply.user?.name || "Admin"}
                                  <span className="ml-2 text-xs bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full">
                                    Admin
                                  </span>
                                </div>
                                <div className="text-xs text-gray-500">
                                  {new Date(
                                    reply.created_at,
                                  ).toLocaleDateString()}
                                </div>
                              </div>
                            </div>
                            {user?.is_admin && (
                              <button
                                onClick={() => handleDeleteReply(reply.id)}
                                className="text-xs text-red-600 hover:underline"
                              >
                                Delete
                              </button>
                            )}
                          </div>
                          <p className="text-gray-600 mt-2 text-sm">
                            {reply.content}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          )}

          {/* Pagination */}
          {reviewPagination.pages > 1 && (
            <div className="flex justify-center gap-2 mt-8">
              <button
                onClick={() => setReviewPage(reviewPage - 1)}
                disabled={!reviewPagination.has_prev}
                className="px-4 py-2 bg-white rounded-lg shadow disabled:opacity-50 hover:bg-gray-50"
              >
                ← Previous
              </button>
              <span className="px-4 py-2">
                Page {reviewPage} of {reviewPagination.pages}
              </span>
              <button
                onClick={() => setReviewPage(reviewPage + 1)}
                disabled={!reviewPagination.has_next}
                className="px-4 py-2 bg-white rounded-lg shadow disabled:opacity-50 hover:bg-gray-50"
              >
                Next →
              </button>
            </div>
          )}
        </section>

        {/* CTA */}
        <section className="text-center mb-20">
          <div className="bg-gradient-to-br from-amber-500 via-amber-600 to-orange-600 rounded-3xl p-12 text-white shadow-2xl">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Ready for Your African Adventure?
            </h2>
            <p className="text-lg mb-6">
              Let our three decades of expertise guide you through the wild
              heart of Kenya
            </p>
            <div className="inline-block bg-white/20 backdrop-blur-sm px-8 py-4 rounded-full">
              <p className="text-xl italic font-light">
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
        {selectedPartner && <div>Partner Modal (same as before)</div>}
      </AnimatePresence>
    </div>
  );
};

export default About;
