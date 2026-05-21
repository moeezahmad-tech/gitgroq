import { Link } from 'react-router-dom';

function Navbar() {
  return (
    <nav className="border-b border-gray-800 bg-gray-950/80 backdrop-blur-sm sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 text-white font-bold text-xl hover:text-emerald-400 transition-colors">
          <img src="/GitGrok.png" alt="GitGrok Logo" className="w-8 h-8 rounded" />
          GitGrok
        </Link>
        <div className="flex items-center gap-6">
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
      </div>
    </nav>
  );
}

export default Navbar;
