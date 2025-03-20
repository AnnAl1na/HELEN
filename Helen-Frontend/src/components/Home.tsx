import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="text-center">
        {/* Main Title */}
        <h1 className="text-6xl font-bold text-gray-800 mb-4">Helen</h1>

        {/* Subtext */}
        <p className="text-lg text-gray-600 mb-6">Your journey to knowledge starts here</p>

        {/* Button */}
        <button className="px-6 py-2 bg-blue-500 text-white rounded-full text-sm hover:bg-blue-600 transition duration-300">
        <Link to="/learn">start learning</Link>
        </button>
      </div>
    </div>
  );
};

export default Home;
