import { GitCommitHorizontal, Zap, Shield, History } from 'lucide-react';

function Home() {
  return (
    <main className="max-w-6xl mx-auto px-6">
      {/* Hero Section */}
      <section className="py-24 text-center">
        <div className="flex justify-center mb-6">
          <img src="/GitGrok.png" alt="GitGrok Logo" className="w-20 h-20 rounded-2xl" style={{ filter: "drop-shadow(0 4px 6px rgba(16, 185, 129, 0.2))" }} />
        </div>
        <h1 className="text-5xl font-bold mb-4 tracking-tight">
          Understand any commit in
          <span className="text-emerald-400"> plain language</span>
        </h1>
        <p className="text-xl text-gray-400 max-w-2xl mx-auto mb-8">
          Paste a commit hash or diff, and GitGrok explains what changed, why it likely changed, and what impact it has.
        </p>
        <div className="flex justify-center gap-4">
          <a href="/analyze" className="px-6 py-3 bg-emerald-500 hover:bg-emerald-600 text-white font-medium rounded-lg transition-colors">
            Try It Now
          </a>
          <a href="/about" className="px-6 py-3 border border-gray-700 hover:border-gray-500 text-gray-300 font-medium rounded-lg transition-colors">
            Learn More
          </a>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 grid md:grid-cols-3 gap-8">
        <div className="p-6 rounded-xl border border-gray-800 bg-gray-900/50">
          <Zap className="w-8 h-8 text-emerald-400 mb-4" />
          <h3 className="text-lg font-semibold mb-2">Commit Explanation</h3>
          <p className="text-gray-400 text-sm">
            Analyze a single commit and get a structured explanation — summary, file-by-file breakdown, and impact assessment.
          </p>
        </div>
        <div className="p-6 rounded-xl border border-gray-800 bg-gray-900/50">
          <GitCommitHorizontal className="w-8 h-8 text-emerald-400 mb-4" />
          <h3 className="text-lg font-semibold mb-2">Diff Analysis</h3>
          <p className="text-gray-400 text-sm">
            Accept raw diffs for repos not directly connected. Paste any diff and get instant clarity on the changes.
          </p>
        </div>
        <div className="p-6 rounded-xl border border-gray-800 bg-gray-900/50">
          <History className="w-8 h-8 text-emerald-400 mb-4" />
          <h3 className="text-lg font-semibold mb-2">History View</h3>
          <p className="text-gray-400 text-sm">
            Browse previously analyzed commits with their explanations. Build a knowledge base of your codebase changes.
          </p>
        </div>
      </section>

      {/* Target Users */}
      <section className="py-16 border-t border-gray-800">
        <h2 className="text-3xl font-bold text-center mb-12">Built for developers who value clarity</h2>
        <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          <div className="flex items-start gap-3 p-4 rounded-lg bg-gray-900/30">
            <Shield className="w-5 h-5 text-emerald-400 mt-0.5 shrink-0" />
            <p className="text-gray-300 text-sm">Developers reviewing unfamiliar code or repositories</p>
          </div>
          <div className="flex items-start gap-3 p-4 rounded-lg bg-gray-900/30">
            <Shield className="w-5 h-5 text-emerald-400 mt-0.5 shrink-0" />
            <p className="text-gray-300 text-sm">Team leads conducting code reviews</p>
          </div>
          <div className="flex items-start gap-3 p-4 rounded-lg bg-gray-900/30">
            <Shield className="w-5 h-5 text-emerald-400 mt-0.5 shrink-0" />
            <p className="text-gray-300 text-sm">New team members onboarding to a codebase</p>
          </div>
          <div className="flex items-start gap-3 p-4 rounded-lg bg-gray-900/30">
            <Shield className="w-5 h-5 text-emerald-400 mt-0.5 shrink-0" />
            <p className="text-gray-300 text-sm">Open-source contributors understanding project history</p>
          </div>
        </div>
      </section>
    </main>
  );
}

export default Home;
