import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./Components/Navbar";
import Home from "./Pages/Home";
import Footer from "./Components/Footer";
import Safaris from "./Pages/Safaris";
import Amboseli from "./Parks/Amboseli";
import Maasaimara from "./Parks/Maasaimara";
import Nakuru from "./Parks/Nakuru";
import Tsavowest from "./Parks/Tsavowest";
import TsavoEast from "./Parks/Tsavoeast";
import About from "./Pages/About";
import Contact from "./Pages/Contact";
import Taitahills from "./Parks/Taitahills";
import Accommodation from "./Pages/Accommodation";
import Saltlick from "./Parks/Salt-lick";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./Components/ProtectedRoute";
import Dashboard from "./Pages/Dashboard";
import SecretPlatform from "./Components/SecretPlatform";


export default function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen flex flex-col">
          <Navbar />
          <main className="flex-grow">
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Home />} />
              <Route path="/safaris" element={<Safaris />} />
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

              {/* Protected Routes - Only for signed-in users */}
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
                    <div className="min-h-screen bg-gradient-to-br from-yellow-50 to-green-50 p-8">
                      <div className="max-w-6xl mx-auto">
                        <h1 className="text-4xl font-bold text-safari-brown mb-6">
                          🦁 Exclusive Members Area 🦒
                        </h1>
                        <div className="grid md:grid-cols-2 gap-8">
                          <div className="bg-white p-6 rounded-lg shadow-lg">
                            <h2 className="text-2xl font-semibold text-safari-green mb-4">
                              Welcome to the Safari Club!
                            </h2>
                            <p className="text-gray-700">
                              This area is exclusively for registered members
                              who have discovered our secret access through the
                              animal banner.
                            </p>
                          </div>
                          <div className="bg-white p-6 rounded-lg shadow-lg">
                            <h2 className="text-2xl font-semibold text-safari-green mb-4">
                              Premium Features
                            </h2>
                            <ul className="list-disc pl-5 text-gray-700 space-y-2">
                              <li>Exclusive safari deals</li>
                              <li>Early booking access</li>
                              <li>Member-only discounts</li>
                              <li>Personalized itineraries</li>
                            </ul>
                          </div>
                        </div>
                      </div>
                    </div>
                  </ProtectedRoute>
                }
              />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </AuthProvider>
  );
}
