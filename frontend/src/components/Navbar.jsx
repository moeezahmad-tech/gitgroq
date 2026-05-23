'use client';

import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X } from 'lucide-react';

function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <nav className="border-b border-gray-800 bg-gray-950/80 backdrop-blur-sm sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 text-white font-bold text-xl hover:text-emerald-400 transition-colors">
          <img src="/GitGrok.png" alt="GitGrok Logo" className="w-8 h-8 rounded" />
          GitGrok
        </Link>

        {/* Desktop nav links */}
        <div className="hidden md:flex items-center gap-6">
          <Link to="/" className="text-gray-400 hover:text-white transition-colors text-sm">
            Home
          </Link>
          <Link to="/analyze" className="text-gray-400 hover:text-white transition-colors text-sm">
            Analyze
          </Link>
          <Link to="/about" className="text-gray-400 hover:text-white transition-colors text-sm">
            About
          </Link>
          <Link to="/contact" className="text-gray-400 hover:text-white transition-colors text-sm">
            Contact
          </Link>
        </div>

        {/* Mobile hamburger button */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="md:hidden p-2 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800 transition-colors"
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile nav menu */}
      {mobileOpen && (
        <div className="md:hidden border-t border-gray-800 bg-gray-950/95 backdrop-blur-sm px-4 py-3 space-y-1">
          <Link to="/" onClick={() => setMobileOpen(false)} className="block px-3 py-2.5 rounded-lg text-gray-300 hover:text-white hover:bg-gray-800/50 transition-colors text-sm">
            Home
          </Link>
          <Link to="/analyze" onClick={() => setMobileOpen(false)} className="block px-3 py-2.5 rounded-lg text-gray-300 hover:text-white hover:bg-gray-800/50 transition-colors text-sm">
            Analyze
          </Link>
          <Link to="/about" onClick={() => setMobileOpen(false)} className="block px-3 py-2.5 rounded-lg text-gray-300 hover:text-white hover:bg-gray-800/50 transition-colors text-sm">
            About
          </Link>
          <Link to="/contact" onClick={() => setMobileOpen(false)} className="block px-3 py-2.5 rounded-lg text-gray-300 hover:text-white hover:bg-gray-800/50 transition-colors text-sm">
            Contact
          </Link>
        </div>
      )}
    </nav>
  );
}

export default Navbar;
