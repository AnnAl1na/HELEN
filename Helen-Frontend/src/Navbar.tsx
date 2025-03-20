import React, { useState } from 'react';
import { Link } from 'react-router-dom'; // Import Link from react-router-dom

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="bg-gray-200 p-4 shadow-lg ">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Logo */}
        <div className="text-gray-800 text-xl font-bold">
          <Link to="/">Helen</Link>
        </div>

      
        <div className="hidden md:flex space-x-6">
          <Link to="/notes" className="text-white-800 hover:bg-gray-200 px-3 py-2 rounded-md transition duration-300">Notes</Link>
          <Link to="/learn" className="text-white-800 hover:bg-gray-200 px-3 py-2 rounded-md transition duration-300">Learn</Link>
          <Link to="/test" className="text-white-800 hover:bg-gray-200 px-3 py-2 rounded-md transition duration-300">Test Yourself</Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
