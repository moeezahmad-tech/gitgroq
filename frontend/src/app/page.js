'use client';

import { useState } from 'react';

export default function HomePage() {
  const [url, setUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!url.trim()) return;
    setIsLoading(true);
    // TODO: dispatch URL to backend for analysis
    setTimeout(() => setIsLoading(false), 2000);
  };

  return (
    <div className="flex min-h-screen flex-col">
      {/* Top Control Area */}
      <header className="border-b border-gray-800 bg-gray-900/80 backdrop-blur-sm">
        <div className="mx-auto max-w-7xl px-4 py-5 sm:px-6 lg:px-8">
          <h1 className="mb-4 text-xl font-semibold tracking-tight text-white">
            DevTracks
          </h1>
          <form onSubmit={handleSubmit} className="flex gap-3">
            <input
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="Paste a raw GitHub commit URL..."
              className="flex-1 rounded-lg border border-gray-700 bg-gray-800 px-4 py-2.5 text-sm text-gray-100 placeholder-gray-500 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
            />
            <button
              type="submit"
              disabled={isLoading || !url.trim()}
              className="rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isLoading ? 'Analyzing...' : 'Analyze'}
            </button>
          </form>
        </div>
      </header>

      {/* Bottom Layout Workspace */}
      <main className="mx-auto flex w-full max-w-7xl flex-1 gap-6 px-4 py-6 sm:px-6 lg:px-8">
        {/* Main Content - Review Card */}
        <section className="flex-1">
          <div className="rounded-xl border border-gray-800 bg-gray-900 p-6">
            <h2 className="mb-4 text-lg font-medium text-white">
              Review Output
            </h2>
            <div className="min-h-[400px] rounded-lg border border-dashed border-gray-700 bg-gray-800/50 p-6">
              <p className="text-sm text-gray-500">
                Submit a GitHub URL above to generate a markdown review card.
              </p>
              {/* TODO: Render generated markdown review here */}
            </div>
          </div>
        </section>

        {/* Sidebar - History Feed */}
        <aside className="hidden w-80 shrink-0 lg:block">
          <div className="rounded-xl border border-gray-800 bg-gray-900 p-5">
            <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-gray-400">
              History
            </h2>
            <ul className="space-y-3">
              {/* Placeholder history items */}
              {[1, 2, 3].map((i) => (
                <li
                  key={i}
                  className="rounded-lg border border-gray-800 bg-gray-800/60 p-3 transition hover:border-gray-700"
                >
                  <p className="truncate text-sm font-medium text-gray-200">
                    fix: resolve auth token refresh loop
                  </p>
                  <p className="mt-1 text-xs text-gray-500">
                    analyzed 2 min ago
                  </p>
                </li>
              ))}
            </ul>
          </div>
        </aside>
      </main>
    </div>
  );
}
