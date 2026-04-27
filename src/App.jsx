import React, { lazy, Suspense, useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./Components/Navbar";
import Footer from "./Components/Footer";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./Components/ProtectedRoute";

// Loading Screen Component with minimum display time
const InitialLoader = () => (
  <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-gradient-to-br from-green-700 to-amber-800">
    <div className="relative">
      <div className="animate-spin rounded-full h-24 w-24 border-t-4 border-b-4 border-yellow-400"></div>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-4xl animate-pulse">🦁</span>
      </div>
    </div>
    <div className="mt-8 text-center">
      <h2 className="text-2xl font-bold text-white mb-2">
        Welcome to Safari Explorer
      </h2>
      <p className="text-yellow-200">Loading your adventure...</p>
    </div>
  </div>
);

// Lazy load all page components for better performance
const Home = lazy(() => import("./Pages/Home"));
const About = lazy(() => import("./Pages/About"));
const Contact = lazy(() => import("./Pages/Contact"));
const Accommodation = lazy(() => import("./Pages/Accommodation"));
const Dashboard = lazy(() => import("./Pages/Dashboard"));
const SecretPlatform = lazy(() => import("./Components/SecretPlatform"));

// Lazy load park components
const Amboseli = lazy(() => import("./Parks/Amboseli"));
const Maasaimara = lazy(() => import("./Parks/Maasaimara"));
const Nakuru = lazy(() => import("./Parks/Nakuru"));
const Tsavowest = lazy(() => import("./Parks/Tsavowest"));
const TsavoEast = lazy(() => import("./Parks/Tsavoeast"));
const Taitahills = lazy(() => import("./Parks/Taitahills"));
const Saltlick = lazy(() => import("./Parks/Salt-lick"));

export default function App() {
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [contentReady, setContentReady] = useState(false);

  useEffect(() => {
    let startTime = performance.now();
    let isContentLoaded = false;
    let minTimerDone = false;

    // Function to check if both conditions are met
    const checkAndHideLoader = () => {
      if (isContentLoaded && minTimerDone) {
        setIsInitialLoading(false);
      }
    };

    // Minimum 400ms timer for spinner
    const minTimer = setTimeout(() => {
      minTimerDone = true;
      checkAndHideLoader();
    }, 400);

    // Fast 350ms attempt to load content
    const fastLoadTimer = setTimeout(() => {
      // Content should be ready by now
      const elapsed = performance.now() - startTime;
      if (elapsed >= 350) {
        isContentLoaded = true;
        checkAndHideLoader();
      }
    }, 350);

    // Mark content as ready when React finishes rendering
    const readyTimer = setTimeout(() => {
      isContentLoaded = true;
      checkAndHideLoader();
    }, 100); // Small buffer for React to render

    return () => {
      clearTimeout(minTimer);
      clearTimeout(fastLoadTimer);
      clearTimeout(readyTimer);
    };
  }, []);

  // Show initial loader while loading
  if (isInitialLoading) {
    return <InitialLoader />;
  }

  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen flex flex-col">
          <Navbar />
          <main className="flex-grow">
            {/* fallback={null} prevents additional spinners */}
            <Suspense fallback={null}>
              <Routes>
                {/* Public Routes */}
                <Route path="/" element={<Home />} />
                <Route path="/amboseli" element={<Amboseli />} />
                <Route path="/tsavoeast" element={<TsavoEast />} />
                <Route path="/tsavowest" element={<Tsavowest />} />
                <Route path="/masaimara" element={<Maasaimara />} />
                <Route path="/lakenakuru" element={<Nakuru />} />
                <Route path="/about" element={<About />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/accommodation" element={<Accommodation />} />
                <Route path="/nakurupark" element={<Nakuru />} />
                <Route path="/taita-hills" element={<Taitahills />} />
                <Route path="/salt-lick" element={<Saltlick />} />

                {/* Protected Routes */}
                <Route
                  path="/dashboard"
                  element={
                    <ProtectedRoute>
                      <Dashboard />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/secret-platform"
                  element={
                    <ProtectedRoute>
                      <SecretPlatform />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/members-only"
                  element={
                    <ProtectedRoute>
                      <MembersOnlyArea />
                    </ProtectedRoute>
                  }
                />
              </Routes>
            </Suspense>
          </main>
          <Footer />
        </div>
      </Router>
    </AuthProvider>
  );
}

// Members Only Component with responsive cards
const MembersOnlyArea = () => {
  const memberCards = [
    {
      id: 1,
      title: "Welcome to the Safari Club!",
      description:
        "This area is exclusively for registered members who have discovered our secret access through the animal banner.",
      icon: "🦁",
      bgColor: "bg-white",
      textColor: "text-safari-green",
    },
    {
      id: 2,
      title: "Premium Features",
      features: [
        "Exclusive safari deals",
        "Early booking access",
        "Member-only discounts",
        "Personalized itineraries",
      ],
      icon: "⭐",
      bgColor: "bg-white",
      textColor: "text-safari-green",
    },
    {
      id: 3,
      title: "Special Offers",
      description:
        "Get 20% off on all safari packages when you book through the members portal. Limited time offer for new members!",
      icon: "🎁",
      bgColor: "bg-gradient-to-r from-amber-50 to-orange-50",
      textColor: "text-orange-700",
    },
    {
      id: 4,
      title: "Upcoming Events",
      description:
        "Join our virtual safari tours every Saturday. Meet expert guides and learn about wildlife conservation.",
      icon: "📅",
      bgColor: "bg-gradient-to-r from-blue-50 to-cyan-50",
      textColor: "text-blue-700",
    },
    {
      id: 5,
      title: "Member Rewards",
      description:
        "Earn points on every booking. Redeem for free upgrades, safari extensions, and exclusive merchandise.",
      icon: "🏆",
      bgColor: "bg-gradient-to-r from-purple-50 to-pink-50",
      textColor: "text-purple-700",
    },
    {
      id: 6,
      title: "24/7 Support",
      description:
        "Dedicated concierge service for members. Call or chat anytime for instant assistance with your bookings.",
      icon: "🎧",
      bgColor: "bg-gradient-to-r from-green-50 to-emerald-50",
      textColor: "text-green-700",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 to-green-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8 md:mb-12">
          <h1 className="text-3xl md:text-5xl font-bold text-safari-brown mb-4">
            🦁 Exclusive Members Area 🦒
          </h1>
          <p className="text-gray-600 text-sm md:text-base max-w-2xl mx-auto">
            Welcome to your premium safari experience. Access exclusive benefits
            and personalized services.
          </p>
        </div>

        {/* Responsive Grid - 2 columns on mobile, 3 on desktop */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {memberCards.map((card) => (
            <div
              key={card.id}
              className={`${card.bgColor} p-6 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1`}
            >
              <div className="text-4xl mb-4">{card.icon}</div>
              <h2
                className={`text-xl md:text-2xl font-semibold ${card.textColor} mb-4`}
              >
                {card.title}
              </h2>
              {card.description && (
                <p className="text-gray-700 text-sm md:text-base leading-relaxed">
                  {card.description}
                </p>
              )}
              {card.features && (
                <ul className="list-disc pl-5 text-gray-700 space-y-2 text-sm md:text-base">
                  {card.features.map((feature, idx) => (
                    <li key={idx}>{feature}</li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
