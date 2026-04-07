import React from "react";
import { useAuth } from "../context/AuthContext";

const SecretPlatform = () => {
  const { currentUser } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Secret Header */}
        <div className="text-center mb-10">
          <div className="inline-block p-4 bg-yellow-500 bg-opacity-20 rounded-full mb-4">
            <span className="text-4xl">🔐</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Secret Safari Command Center
          </h1>
          <p className="text-gray-300 text-lg">
            Exclusive platform for {currentUser?.email}
          </p>
          <div className="mt-4 flex justify-center items-center space-x-2 text-yellow-300">
            <span className="w-2 h-2 bg-yellow-300 rounded-full animate-pulse"></span>
            <span className="text-sm">ACCESS GRANTED</span>
            <span className="w-2 h-2 bg-yellow-300 rounded-full animate-pulse"></span>
          </div>
        </div>

        {/* Secret Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
          {/* Feature 1 */}
          <div className="bg-gray-800 rounded-xl p-6 border border-gray-700 hover:border-yellow-500 transition-all duration-300">
            <div className="text-3xl mb-4">🦁</div>
            <h3 className="text-xl font-bold mb-3">Lion Tracking</h3>
            <p className="text-gray-400">
              Real-time tracking of lion prides across all national parks
            </p>
          </div>

          {/* Feature 2 */}
          <div className="bg-gray-800 rounded-xl p-6 border border-gray-700 hover:border-yellow-500 transition-all duration-300">
            <div className="text-3xl mb-4">🌙</div>
            <h3 className="text-xl font-bold mb-3">Night Safari Plans</h3>
            <p className="text-gray-400">
              Access exclusive night safari routes and timings
            </p>
          </div>

          {/* Feature 3 */}
          <div className="bg-gray-800 rounded-xl p-6 border border-gray-700 hover:border-yellow-500 transition-all duration-300">
            <div className="text-3xl mb-4">🗺️</div>
            <h3 className="text-xl font-bold mb-3">Hidden Routes</h3>
            <p className="text-gray-400">
              Discover secret game viewing routes not shown on public maps
            </p>
          </div>
        </div>

        {/* Secret Map */}
        <div className="bg-gray-800 rounded-xl p-6 mb-10">
          <h2 className="text-2xl font-bold mb-6 flex items-center">
            <span className="mr-3">🗺️</span>
            Secret Safari Routes
          </h2>
          <div className="bg-gray-900 rounded-lg p-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div>
                <h3 className="text-xl font-semibold mb-4 text-yellow-300">
                  Exclusive Access Points
                </h3>
                <ul className="space-y-3">
                  <li className="flex items-center">
                    <span className="w-3 h-3 bg-green-500 rounded-full mr-3"></span>
                    <span>Private Gate Entry - Tsavo West</span>
                  </li>
                  <li className="flex items-center">
                    <span className="w-3 h-3 bg-blue-500 rounded-full mr-3"></span>
                    <span>Hidden Waterhole - Maasai Mara</span>
                  </li>
                  <li className="flex items-center">
                    <span className="w-3 h-3 bg-red-500 rounded-full mr-3"></span>
                    <span>Secret Migration Viewpoint</span>
                  </li>
                </ul>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-4 text-yellow-300">
                  Member Benefits
                </h3>
                <ul className="space-y-3">
                  <li className="flex items-center">
                    <span className="text-green-400 mr-3">✓</span>
                    <span>24/7 Guide Access</span>
                  </li>
                  <li className="flex items-center">
                    <span className="text-green-400 mr-3">✓</span>
                    <span>Private Camp Setup</span>
                  </li>
                  <li className="flex items-center">
                    <span className="text-green-400 mr-3">✓</span>
                    <span>Emergency Support Network</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Secret Access Code */}
        <div className="text-center p-6 bg-gradient-to-r from-yellow-600 to-yellow-700 rounded-xl">
          <h3 className="text-2xl font-bold mb-4">Your Secret Access Code</h3>
          <div className="bg-black bg-opacity-30 p-4 rounded-lg inline-block">
            <code className="text-2xl font-mono tracking-widest">
              SAFARI-{currentUser?.uid?.substring(0, 8).toUpperCase()}
            </code>
          </div>
          <p className="mt-4 text-yellow-100">
            Show this code to your guide for premium treatment
          </p>
        </div>
      </div>
    </div>
  );
};

export default SecretPlatform;
