import { Lightbulb, Zap, Layers, ShieldCheck } from 'lucide-react';

function About() {
  const principles = [
    {
      icon: Lightbulb,
      title: 'Clarity over cleverness',
      description: 'Explanations should be accessible to developers of all levels.',
    },
    {
      icon: Zap,
      title: 'Speed matters',
      description: 'Results should appear quickly. We prefer streaming responses where possible.',
    },
    {
      icon: Layers,
      title: 'Context is king',
      description: 'The more context (repo, file history, PR description) the better the explanation.',
    },
    {
      icon: ShieldCheck,
      title: 'Privacy-aware',
      description: 'Code is sensitive. We are transparent about what is sent to AI providers and offer self-hosted options.',
    },
  ];

  return (
    <main className="max-w-4xl mx-auto px-6 py-16">
      <h1 className="text-4xl font-bold mb-4">About GitGroq</h1>
      <p className="text-lg text-gray-400 mb-12">
        GitGroq helps developers understand code changes by providing AI-powered explanations of git commits.
        It bridges the gap between cryptic diffs and human-readable summaries, making code review, onboarding,
        and knowledge sharing faster.
      </p>

      <h2 className="text-2xl font-semibold mb-6">Our Principles</h2>
      <div className="grid gap-6 mb-16">
        {principles.map((principle) => (
          <div key={principle.title} className="flex items-start gap-4 p-5 rounded-xl border border-gray-800 bg-gray-900/50">
            <principle.icon className="w-6 h-6 text-emerald-400 mt-0.5 shrink-0" />
            <div>
              <h3 className="font-semibold mb-1">{principle.title}</h3>
              <p className="text-gray-400 text-sm">{principle.description}</p>
            </div>
          </div>
        ))}
      </div>

      <h2 className="text-2xl font-semibold mb-6">Terminology</h2>
      <div className="overflow-hidden rounded-xl border border-gray-800">
        <table className="w-full text-sm">
          <thead className="bg-gray-900">
            <tr>
              <th className="text-left px-5 py-3 font-medium text-gray-300">Term</th>
              <th className="text-left px-5 py-3 font-medium text-gray-300">Meaning</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-800">
            <tr><td className="px-5 py-3 font-mono text-emerald-400">Explanation</td><td className="px-5 py-3 text-gray-400">The AI-generated breakdown of a commit or diff</td></tr>
            <tr><td className="px-5 py-3 font-mono text-emerald-400">Grok</td><td className="px-5 py-3 text-gray-400">To understand intuitively (from Heinlein, adopted by dev culture)</td></tr>
            <tr><td className="px-5 py-3 font-mono text-emerald-400">Commit</td><td className="px-5 py-3 text-gray-400">A git commit — the primary input unit</td></tr>
            <tr><td className="px-5 py-3 font-mono text-emerald-400">Diff</td><td className="px-5 py-3 text-gray-400">The textual representation of changes between two states</td></tr>
            <tr><td className="px-5 py-3 font-mono text-emerald-400">Impact</td><td className="px-5 py-3 text-gray-400">The assessed effect of a change on the broader codebase</td></tr>
          </tbody>
        </table>
      </div>
    </main>
  );
}

export default About;
