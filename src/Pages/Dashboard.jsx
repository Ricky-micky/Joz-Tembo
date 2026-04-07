import React from "react";
import { useAuth } from "../context/AuthContext";

const Dashboard = () => {
  const { currentUser, logout } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 to-green-50 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-safari-brown">
                🦁 Safari Club Dashboard
              </h1>
              <p className="text-gray-600 mt-2">
                Welcome back, {currentUser?.email}!
              </p>
            </div>
            <button
              onClick={logout}
              className="mt-4 md:mt-0 bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-lg transition-colors duration-300"
            >
              Sign Out
            </button>
          </div>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Exclusive Offers */}
          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-yellow-500">
            <h2 className="text-xl font-semibold text-safari-green mb-4">
              🎯 Exclusive Offers
            </h2>
            <ul className="space-y-3">
              <li className="flex items-center">
                <span className="w-2 h-2 bg-yellow-500 rounded-full mr-3"></span>
                <span>20% off Luxury Safari Packages</span>
              </li>
              <li className="flex items-center">
                <span className="w-2 h-2 bg-yellow-500 rounded-full mr-3"></span>
                <span>Free Airport Transfer</span>
              </li>
              <li className="flex items-center">
                <span className="w-2 h-2 bg-yellow-500 rounded-full mr-3"></span>
                <span>Complimentary Bush Dinner</span>
              </li>
            </ul>
          </div>

          {/* Upcoming Bookings */}
          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-green-500">
            <h2 className="text-xl font-semibold text-safari-green mb-4">
              📅 Your Bookings
            </h2>
            <div className="space-y-4">
              <div className="p-3 bg-yellow-50 rounded-lg">
                <p className="font-medium">Maasai Mara Safari</p>
                <p className="text-sm text-gray-600">Dec 15-20, 2024</p>
              </div>
              <div className="p-3 bg-green-50 rounded-lg">
                <p className="font-medium">Amboseli Experience</p>
                <p className="text-sm text-gray-600">Jan 10-15, 2025</p>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-brown-500">
            <h2 className="text-xl font-semibold text-safari-green mb-4">
              ⚡ Quick Actions
            </h2>
            <div className="space-y-3">
              <button className="w-full bg-yellow-500 hover:bg-yellow-600 text-white py-2 px-4 rounded-lg transition-colors duration-300">
                Book New Safari
              </button>
              <button className="w-full bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded-lg transition-colors duration-300">
                View Itineraries
              </button>
              <button className="w-full bg-brown-500 hover:bg-brown-600 text-white py-2 px-4 rounded-lg transition-colors duration-300">
                Contact Guide
              </button>
            </div>
          </div>
        </div>

        {/* Secret Platform Access */}
        <div className="mt-8 bg-gradient-to-r from-yellow-400 to-green-400 rounded-xl shadow-lg p-6">
          <h2 className="text-2xl font-bold text-white mb-4">
            🗝️ Secret Platform Access
          </h2>
          <p className="text-white mb-6">
            You've unlocked exclusive access to our secret safari planning
            platform!
          </p>
          <div className="flex flex-wrap gap-4">
            <a
              href="/secret-platform"
              className="bg-white text-yellow-600 hover:bg-gray-100 px-6 py-3 rounded-lg font-semibold transition-colors duration-300"
            >
              Enter Secret Platform
            </a>
            <a
              href="/members-only"
              className="bg-black bg-opacity-30 text-white hover:bg-opacity-40 px-6 py-3 rounded-lg font-semibold transition-colors duration-300"
            >
              Members Only Area
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
