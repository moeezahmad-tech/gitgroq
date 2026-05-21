import { Link } from 'react-router-dom';

function NotFound() {
  return (
    <main className="max-w-4xl mx-auto px-6 py-24 text-center">
      <img src="/GitGrok.png" alt="GitGrok Logo" className="w-20 h-20 mx-auto mb-6 opacity-50 rounded-xl" />
      <h1 className="text-6xl font-bold mb-4">404</h1>
      <p className="text-xl text-gray-400 mb-8">
        This page doesn't exist. Maybe the commit was reverted?
      </p>
      <Link
        to="/"
        className="inline-block px-6 py-3 bg-emerald-500 hover:bg-emerald-600 text-white font-medium rounded-lg transition-colors"
      >
        Back to Home
      </Link>
    </main>
  );
}

export default NotFound;
