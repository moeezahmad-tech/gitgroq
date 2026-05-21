import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

const components = {
  h1: ({ children }) => (
    <h1 className="text-2xl font-bold text-white mt-6 mb-3">{children}</h1>
  ),
  h2: ({ children }) => (
    <h2 className="text-xl font-semibold text-white mt-5 mb-2">{children}</h2>
  ),
  h3: ({ children }) => (
    <h3 className="text-lg font-medium text-gray-100 mt-4 mb-2">{children}</h3>
  ),
  h4: ({ children }) => (
    <h4 className="text-base font-medium text-gray-200 mt-3 mb-1">{children}</h4>
  ),
  h5: ({ children }) => (
    <h5 className="text-base font-medium text-gray-200 mt-3 mb-1">{children}</h5>
  ),
  h6: ({ children }) => (
    <h6 className="text-base font-medium text-gray-200 mt-3 mb-1">{children}</h6>
  ),
  p: ({ children }) => (
    <p className="text-gray-300 leading-relaxed mb-3">{children}</p>
  ),
  pre: ({ children }) => (
    <pre className="bg-gray-950 border border-gray-800 rounded-lg p-4 overflow-x-auto text-sm font-mono text-gray-300 my-3">
      {children}
    </pre>
  ),
  code: ({ children, className, ...props }) => {
    // When inside a <pre>, className will contain the language identifier (e.g. "language-js")
    const isBlock = Boolean(className);
    if (isBlock) {
      return (
        <code className={className} {...props}>
          {children}
        </code>
      );
    }
    return (
      <code
        className="bg-gray-800 text-indigo-300 px-1.5 py-0.5 rounded text-sm font-mono"
        {...props}
      >
        {children}
      </code>
    );
  },
  ul: ({ children }) => (
    <ul className="list-disc list-inside space-y-1 text-gray-300 mb-3 ml-4">{children}</ul>
  ),
  ol: ({ children }) => (
    <ol className="list-decimal list-inside space-y-1 text-gray-300 mb-3 ml-4">{children}</ol>
  ),
  a: ({ children, href }) => (
    <a href={href} className="text-indigo-400 hover:text-indigo-300 underline" target="_blank" rel="noopener noreferrer">
      {children}
    </a>
  ),
  strong: ({ children }) => (
    <strong className="font-semibold text-white">{children}</strong>
  ),
  em: ({ children }) => (
    <em className="italic text-gray-200">{children}</em>
  ),
  blockquote: ({ children }) => (
    <blockquote className="border-l-4 border-indigo-500 pl-4 italic text-gray-400 my-3">{children}</blockquote>
  ),
  table: ({ children }) => (
    <table className="w-full border-collapse border border-gray-700 my-4">{children}</table>
  ),
  th: ({ children }) => (
    <th className="border border-gray-700 bg-gray-800 px-3 py-2 text-left text-sm font-medium text-gray-200">{children}</th>
  ),
  td: ({ children }) => (
    <td className="border border-gray-700 px-3 py-2 text-sm text-gray-300">{children}</td>
  ),
};

/**
 * Renders raw markdown text into styled HTML elements consistent with the dark theme.
 * @param {Object} props
 * @param {string} props.content - Raw markdown string to render
 * @returns {JSX.Element | null} Rendered markdown or null if content is empty
 */
export default function MarkdownRenderer({ content }) {
  if (!content) {
    return null;
  }

  return (
    <div aria-label="Review content">
      <ReactMarkdown remarkPlugins={[remarkGfm]} components={components}>
        {content}
      </ReactMarkdown>
    </div>
  );
}
