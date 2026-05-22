import { Mail, GitBranch, Globe } from 'lucide-react';

function Contact() {
  return (
    <main className="max-w-4xl mx-auto px-6 py-16">
      <h1 className="text-4xl font-bold mb-4">Get in Touch</h1>
      <p className="text-lg text-gray-400 mb-12">
        Have questions, feedback, or want to contribute? We'd love to hear from you.
      </p>

      <div className="grid md:grid-cols-3 gap-6 mb-16">
        <a
          href="mailto:gitgroq@techkreative.com"
          className="flex flex-col items-center gap-3 p-6 rounded-xl border border-gray-800 bg-gray-900/50 hover:border-emerald-500/50 transition-colors"
        >
          <Mail className="w-8 h-8 text-emerald-400" />
          <span className="font-medium">Email</span>
          <span className="text-sm text-gray-400">gitgroq@techkreative.com</span>
        </a>
        <a
          href="https://github.com/moeezahmad-tech/gitgroq"
          target="_blank"
          rel="noopener noreferrer"
          className="flex flex-col items-center gap-3 p-6 rounded-xl border border-gray-800 bg-gray-900/50 hover:border-emerald-500/50 transition-colors"
        >
          <GitBranch className="w-8 h-8 text-emerald-400" />
          <span className="font-medium">GitHub</span>
          <span className="text-sm text-gray-400">moeezahmad-tech/gitgroq</span>
        </a>
        <a
          href="https://techkreative.com"
          target="_blank"
          rel="noopener noreferrer"
          className="flex flex-col items-center gap-3 p-6 rounded-xl border border-gray-800 bg-gray-900/50 hover:border-emerald-500/50 transition-colors"
        >
          <Globe className="w-8 h-8 text-emerald-400" />
          <span className="font-medium">Website</span>
          <span className="text-sm text-gray-400">techkreative.com</span>
        </a>
      </div>

      <div className="p-8 rounded-xl border border-gray-800 bg-gray-900/50">
        <h2 className="text-xl font-semibold mb-6">Send a Message</h2>
        <form className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-1">Name</label>
            <input
              type="text"
              id="name"
              className="w-full px-4 py-2.5 bg-gray-800 border border-gray-700 rounded-lg text-gray-100 placeholder-gray-500 focus:outline-none focus:border-emerald-500 transition-colors"
              placeholder="Your name"
            />
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-1">Email</label>
            <input
              type="email"
              id="email"
              className="w-full px-4 py-2.5 bg-gray-800 border border-gray-700 rounded-lg text-gray-100 placeholder-gray-500 focus:outline-none focus:border-emerald-500 transition-colors"
              placeholder="you@example.com"
            />
          </div>
          <div>
            <label htmlFor="message" className="block text-sm font-medium text-gray-300 mb-1">Message</label>
            <textarea
              id="message"
              rows="4"
              className="w-full px-4 py-2.5 bg-gray-800 border border-gray-700 rounded-lg text-gray-100 placeholder-gray-500 focus:outline-none focus:border-emerald-500 transition-colors resize-none"
              placeholder="What's on your mind?"
            />
          </div>
          <button
            type="submit"
            className="px-6 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white font-medium rounded-lg transition-colors"
          >
            Send Message
          </button>
        </form>
      </div>
    </main>
  );
}

export default Contact;
