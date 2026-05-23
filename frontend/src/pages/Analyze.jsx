'use client';

import { useState } from 'react';
import { Search, GitCommitHorizontal, Loader2, FileCode, AlertTriangle, FolderTree, Clock, LayoutDashboard, Info, Circle, Code2, ChevronDown, Sparkles } from 'lucide-react';
import FileTreeComponent from '../components/FileTree';
import BubbleView from '../components/BubbleView';
import CodeViewer from '../components/CodeViewer';
import FullscreenWrapper from '../components/FullscreenWrapper';

function Analyze() {
  const [repoUrl, setRepoUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('summary');

  // Accordion state for commit diffs
  const [expandedSha, setExpandedSha] = useState(null);
  const [diffCache, setDiffCache] = useState({});
  const [diffLoading, setDiffLoading] = useState(false);
  const [diffError, setDiffError] = useState(null);

  // AI summary state for commits
  const [summaryCache, setSummaryCache] = useState({});
  const [summaryLoading, setSummaryLoading] = useState(false);

  // Extract owner/repo from the URL for commit-diff API calls
  function parseOwnerRepo(url) {
    const match = url.match(/github\.com\/([^/]+)\/([^/]+)/);
    if (!match) return { owner: '', repo: '' };
    return { owner: match[1], repo: match[2].replace(/\.git$/, '') };
  }

  // Accordion click handler
  const handleCommitClick = async (sha) => {
    // Toggle: clicking the same commit closes it
    if (expandedSha === sha) {
      setExpandedSha(null);
      return;
    }

    // If cached, just expand
    if (diffCache[sha]) {
      setExpandedSha(sha);
      return;
    }

    // Fetch diff from backend
    setExpandedSha(sha);
    setDiffLoading(true);
    setDiffError(null);

    try {
      const { owner, repo } = parseOwnerRepo(repoUrl);
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/analyze/commit-diff`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ owner, repo, sha }),
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => null);
        throw new Error(errData?.error?.message || 'Failed to fetch commit diff.');
      }

      const data = await response.json();
      setDiffCache((prev) => ({ ...prev, [sha]: data.files }));

      // Fetch AI summary for this commit (non-blocking)
      const commit = result?.commits?.find((c) => c.sha === sha);
      if (commit && !summaryCache[sha]) {
        setSummaryLoading(true);
        fetch(`${import.meta.env.VITE_API_URL}/api/analyze/summarize-commit`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            message: commit.message,
            files: data.files.map((f) => ({
              filename: f.filename,
              status: f.status,
              additions: f.additions,
              deletions: f.deletions,
            })),
          }),
        })
          .then((res) => res.json())
          .then((summaryData) => {
            if (summaryData.summary) {
              setSummaryCache((prev) => ({ ...prev, [sha]: summaryData.summary }));
            }
          })
          .catch(() => {}) // Silently fail — summary is optional
          .finally(() => setSummaryLoading(false));
      }
    } catch (err) {
      setDiffError(err.message || 'Failed to load diff.');
    } finally {
      setDiffLoading(false);
    }
  };

  // Classify patch lines for rendering
  function renderPatchLines(patch) {
    if (!patch) return [];
    return patch.split('\n').map((line) => {
      if (line.startsWith('+') && !line.startsWith('+++')) {
        return { text: line, type: 'addition' };
      }
      if (line.startsWith('-') && !line.startsWith('---')) {
        return { text: line, type: 'deletion' };
      }
      if (line.startsWith('@@')) {
        return { text: line, type: 'hunk-header' };
      }
      return { text: line, type: 'context' };
    });
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!repoUrl.trim()) return;

    setLoading(true);
    setError('');
    setResult(null);
    setActiveTab('summary');
    setExpandedSha(null);
    setDiffCache({});
    setDiffLoading(false);
    setDiffError(null);
    setSummaryCache({});
    setSummaryLoading(false);

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/analyze`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: repoUrl.trim() }),
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => null);
        throw new Error(errData?.error?.message || 'Failed to analyze. Please check the URL and try again.');
      }

      const data = await response.json();
      setResult(data);
    } catch (err) {
      setError(err.message || 'Something went wrong.');
    } finally {
      setLoading(false);
    }
  };

  const sidebarItems = [
    { id: 'summary', label: 'Summary', icon: LayoutDashboard, count: null },
    { id: 'commits', label: 'Commits', icon: Clock, count: result?.commits?.length },
    { id: 'code', label: 'Code', icon: Code2, count: null },
    { id: 'filetree', label: 'File Tree', icon: FolderTree, count: result?.fileTree?.length },
    { id: 'bubbles', label: 'Bubble View', icon: Circle, count: null },
    { id: 'files', label: 'Changed Files', icon: FileCode, count: result?.files?.length },
    { id: 'impact', label: 'Impact', icon: Info, count: null },
  ];

  return (
    <main className="w-full px-6 mb-6">
      {/* Header + Search — centered like Home page */}
      <section className="py-16 text-center max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold mb-3 tracking-tight">
          Analyze a <span className="text-emerald-400">Repository</span>
        </h1>
        <p className="text-lg text-gray-400 max-w-xl mx-auto mb-8">
          Paste a GitHub repo URL or commit link to get a full breakdown.
        </p>
        <form onSubmit={handleSubmit} className="max-w-2xl mx-auto">
          <div className="flex gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
              <input
                type="text"
                value={repoUrl}
                onChange={(e) => setRepoUrl(e.target.value)}
                placeholder="https://github.com/user/repo or commit URL..."
                className="w-full pl-12 pr-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-gray-100 placeholder-gray-500 focus:outline-none focus:border-emerald-500 transition-colors"
              />
            </div>
            <button
              type="submit"
              disabled={loading || !repoUrl.trim()}
              className="px-6 py-3 bg-emerald-500 hover:bg-emerald-600 disabled:bg-gray-700 disabled:cursor-not-allowed text-white font-medium rounded-lg transition-colors flex items-center gap-2"
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <GitCommitHorizontal className="w-5 h-5" />}
              {loading ? 'Analyzing...' : 'Analyze'}
            </button>
          </div>
        </form>
      </section>

      {/* Error State */}
      {error && (
        <div className="max-w-2xl mx-auto flex items-center gap-3 p-4 rounded-lg border border-red-500/30 bg-red-500/10 mb-8">
          <AlertTriangle className="w-5 h-5 text-red-400 shrink-0" />
          <p className="text-red-300 text-sm">{error}</p>
        </div>
      )}

      {/* Results with Sidebar */}
      {result && (
        <div className="w-full flex gap-6">
          {/* Sidebar */}
          <aside className="w-56 shrink-0">
            <nav className="sticky top-24 space-y-1 p-3 rounded-xl border border-gray-800 bg-gray-900/50">
              {sidebarItems.map((item) => {
                // Hide tabs with no data
                if (item.id === 'files' && (!result.files || result.files.length === 0)) return null;
                if (item.id === 'commits' && (!result.commits || result.commits.length === 0)) return null;
                if (item.id === 'filetree' && (!result.fileTree || result.fileTree.length === 0)) return null;
                if (item.id === 'bubbles' && (!result.fileTree || result.fileTree.length === 0)) return null;
                if (item.id === 'code' && (!result.fileTree || result.fileTree.length === 0)) return null;

                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${
                      activeTab === item.id
                        ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                        : 'text-gray-400 hover:text-gray-200 hover:bg-gray-800/50 border border-transparent'
                    }`}
                  >
                    <item.icon className="w-4 h-4 shrink-0" />
                    <span className="flex-1 text-left">{item.label}</span>
                    {item.count != null && (
                      <span className={`text-xs px-1.5 py-0.5 rounded ${
                        activeTab === item.id ? 'bg-emerald-500/20 text-emerald-300' : 'bg-gray-800 text-gray-500'
                      }`}>
                        {item.count}
                      </span>
                    )}
                  </button>
                );
              })}
            </nav>
          </aside>

          {/* Main Content */}
          <div className="flex-1 min-w-0">
            {/* Summary Tab */}
            {activeTab === 'summary' && result.summary && (
              <FullscreenWrapper title="Repository Summary">
                <div className="w-full p-6 rounded-xl border border-gray-800 bg-gray-900/50">
                  <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                    <LayoutDashboard className="w-6 h-6 text-emerald-400" />
                    Repository Summary
                  </h2>
                  <div className="grid md:grid-cols-2 gap-3">
                    {result.summary
                      .filter((item) => item.label.toLowerCase() !== 'description')
                      .map((item, index) => (
                        <div key={index} className="flex items-start gap-3 p-4 rounded-lg bg-gray-800/40 border border-gray-700/40">
                          <span className="text-emerald-400 font-semibold text-sm min-w-[130px] shrink-0">
                            {item.label}
                          </span>
                          <span className="text-gray-200 text-sm break-all">{item.value}</span>
                        </div>
                      ))}
                    {result.summary
                      .filter((item) => item.label.toLowerCase() === 'description')
                      .map((item, index) => (
                        <div key={`desc-${index}`} className="md:col-span-2 flex items-start gap-3 p-4 rounded-lg bg-gray-800/40 border border-gray-700/40">
                          <span className="text-emerald-400 font-semibold text-sm min-w-[130px] shrink-0">
                            {item.label}
                          </span>
                          <span className="text-gray-200 text-sm break-all">{item.value}</span>
                        </div>
                      ))}
                  </div>
                </div>
              </FullscreenWrapper>
            )}

            {/* Commits Tab */}
            {activeTab === 'commits' && result.commits && result.commits.length > 0 && (
              <FullscreenWrapper title="All Commits">
                <div className="w-full p-6 rounded-xl border border-gray-800 bg-gray-900/50">
                  <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                    <Clock className="w-6 h-6 text-emerald-400" />
                    All Commits
                    <span className="text-sm font-normal text-gray-500 ml-2">({result.commits.length})</span>
                  </h2>
                  <div className="space-y-2 max-h-[calc(100vh-300px)] overflow-y-auto pr-2">
                    {result.commits.map((commit, index) => (
                      <div key={index}>
                        {/* Commit Row - Clickable */}
                        <div
                          onClick={() => handleCommitClick(commit.sha)}
                          className={`flex items-start gap-4 p-3 rounded-lg bg-gray-800/30 border cursor-pointer transition-colors ${
                            expandedSha === commit.sha
                              ? 'border-emerald-500/40 bg-gray-800/50'
                              : 'border-gray-700/30 hover:border-gray-600'
                          }`}
                        >
                          <span className="font-mono text-xs text-emerald-400 bg-emerald-500/10 px-2 py-1 rounded shrink-0 mt-0.5">
                            {commit.shortSha || commit.sha?.slice(0, 7)}
                          </span>
                          <div className="flex-1 min-w-0">
                            <p className="text-gray-200 text-sm">{commit.message}</p>
                            <p className="text-gray-500 text-xs mt-1">
                              {commit.author} • {commit.date}
                            </p>
                          </div>
                          <ChevronDown
                            className={`w-4 h-4 text-gray-500 shrink-0 mt-1 transition-transform duration-200 ${
                              expandedSha === commit.sha ? 'rotate-180 text-emerald-400' : ''
                            }`}
                          />
                        </div>

                        {/* Diff Panel - Expanded */}
                        {expandedSha === commit.sha && (
                          <div className="mt-1 p-4 rounded-lg border border-gray-700/50 bg-gray-950/80">
                            {/* Loading State */}
                            {diffLoading && (
                              <div className="flex items-center gap-2 text-gray-400 text-sm py-2">
                                <Loader2 className="w-4 h-4 animate-spin" />
                                Loading diff...
                              </div>
                            )}

                            {/* Error State */}
                            {diffError && !diffLoading && (
                              <div className="flex items-center gap-2 text-red-400 text-sm py-2">
                                <AlertTriangle className="w-4 h-4" />
                                {diffError}
                              </div>
                            )}

                            {/* Diff Content */}
                            {diffCache[commit.sha] && !diffLoading && (
                              <div className="space-y-4">
                                {/* AI Summary */}
                                {summaryCache[commit.sha] && (
                                  <div className="flex items-start gap-2 p-3 rounded-lg bg-emerald-500/5 border border-emerald-500/20">
                                    <Sparkles className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                                    <p className="text-gray-300 text-sm leading-relaxed">{summaryCache[commit.sha]}</p>
                                  </div>
                                )}
                                {summaryLoading && expandedSha === commit.sha && !summaryCache[commit.sha] && (
                                  <div className="flex items-center gap-2 p-3 rounded-lg bg-emerald-500/5 border border-emerald-500/20">
                                    <Sparkles className="w-4 h-4 text-emerald-400 animate-pulse" />
                                    <span className="text-gray-400 text-sm">Generating AI summary...</span>
                                  </div>
                                )}
                                {diffCache[commit.sha].length === 0 && (
                                  <p className="text-gray-500 text-sm">No file changes found.</p>
                                )}
                                {diffCache[commit.sha].map((file, fileIdx) => (
                                  <div key={fileIdx} className="border border-gray-700/40 rounded-lg overflow-hidden">
                                    {/* File Header */}
                                    <div className="flex items-center gap-3 px-3 py-2 bg-gray-800/60 border-b border-gray-700/40">
                                      <span className={`text-xs font-medium px-2 py-0.5 rounded ${
                                        file.status === 'added' ? 'bg-green-500/20 text-green-400' :
                                        file.status === 'removed' ? 'bg-red-500/20 text-red-400' :
                                        'bg-yellow-500/20 text-yellow-400'
                                      }`}>
                                        {file.status}
                                      </span>
                                      <span className="font-mono text-xs text-gray-200 flex-1 truncate">
                                        {file.filename}
                                      </span>
                                      <span className="text-green-400 text-xs font-mono">+{file.additions}</span>
                                      <span className="text-red-400 text-xs font-mono">-{file.deletions}</span>
                                    </div>

                                    {/* Patch Content */}
                                    {file.patch && (
                                      <div className="overflow-x-auto max-h-80 overflow-y-auto">
                                        <pre className="text-xs leading-5">
                                          {renderPatchLines(file.patch).map((line, lineIdx) => (
                                            <div
                                              key={lineIdx}
                                              className={`px-3 ${
                                                line.type === 'addition'
                                                  ? 'bg-green-500/10 text-green-300'
                                                  : line.type === 'deletion'
                                                  ? 'bg-red-500/10 text-red-300'
                                                  : line.type === 'hunk-header'
                                                  ? 'bg-blue-500/10 text-blue-300'
                                                  : 'text-gray-400'
                                              }`}
                                            >
                                              {line.text}
                                            </div>
                                          ))}
                                        </pre>
                                      </div>
                                    )}

                                    {/* Binary or no patch */}
                                    {!file.patch && (
                                      <div className="px-3 py-2 text-gray-500 text-xs italic">
                                        Binary file or no diff available
                                      </div>
                                    )}
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </FullscreenWrapper>
            )}

            {/* Code Tab */}
            {activeTab === 'code' && result.fileTree && result.fileTree.length > 0 && (
              <div className="w-full">
                <CodeViewer items={result.fileTree} repoUrl={repoUrl} />
              </div>
            )}

            {/* File Tree Tab */}
            {activeTab === 'filetree' && result.fileTree && result.fileTree.length > 0 && (
              <FullscreenWrapper title="File Tree">
                <div className="w-full p-6 rounded-xl border border-gray-800 bg-gray-900/50">
                  <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                    <FolderTree className="w-6 h-6 text-emerald-400" />
                    File Tree
                    <span className="text-sm font-normal text-gray-500 ml-2">({result.fileTree.length} items)</span>
                  </h2>
                  <div className="max-h-[calc(100vh-300px)] overflow-y-auto pr-2 rounded-lg border border-gray-700/50 bg-gray-800/30 p-3">
                    <FileTreeComponent items={result.fileTree} />
                  </div>
                </div>
              </FullscreenWrapper>
            )}

            {/* Bubble View Tab */}
            {activeTab === 'bubbles' && result.fileTree && result.fileTree.length > 0 && (
              <FullscreenWrapper title="Bubble View">
                <div className="w-full p-6 rounded-xl border border-gray-800 bg-gray-900/50">
                  <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                    <Circle className="w-6 h-6 text-emerald-400" />
                    Bubble View
                    <span className="text-sm font-normal text-gray-500 ml-2">Click folders to expand</span>
                  </h2>
                  <BubbleView items={result.fileTree} />
                </div>
              </FullscreenWrapper>
            )}

            {/* Changed Files Tab */}
            {activeTab === 'files' && result.files && result.files.length > 0 && (
              <FullscreenWrapper title="Changed Files">
                <div className="w-full p-6 rounded-xl border border-gray-800 bg-gray-900/50">
                  <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                    <FileCode className="w-6 h-6 text-emerald-400" />
                    Changed Files
                    <span className="text-sm font-normal text-gray-500 ml-2">({result.files.length})</span>
                  </h2>
                  <div className="space-y-2">
                    {result.files.map((file, index) => (
                      <div key={index} className="flex items-center gap-3 p-3 rounded-lg bg-gray-800/30 border border-gray-700/30">
                        <span className={`text-xs font-medium px-2 py-0.5 rounded ${
                          file.status === 'added' ? 'bg-green-500/20 text-green-400' :
                          file.status === 'removed' ? 'bg-red-500/20 text-red-400' :
                          'bg-yellow-500/20 text-yellow-400'
                        }`}>
                          {file.status}
                        </span>
                        <span className="font-mono text-sm text-gray-200 flex-1 truncate">{file.name}</span>
                        <span className="text-green-400 text-xs font-mono">+{file.additions}</span>
                        <span className="text-red-400 text-xs font-mono">-{file.deletions}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </FullscreenWrapper>
            )}

            {/* Impact Tab */}
            {activeTab === 'impact' && result.impact && (
              <FullscreenWrapper title="Impact Assessment">
                <div className="w-full p-6 rounded-xl border border-gray-800 bg-gray-900/50">
                  <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                    <Info className="w-6 h-6 text-emerald-400" />
                    Impact Assessment
                  </h2>
                  <p className="text-gray-300 leading-relaxed text-lg">{result.impact}</p>
                </div>
              </FullscreenWrapper>
            )}
          </div>
        </div>
      )}

      {/* Empty State */}
      {!result && !loading && !error && (
        <div className="text-center py-12 text-gray-600">
          <img src="/GitGrok.png" alt="GitGrok Logo" className="w-16 h-16 mx-auto mb-4 opacity-20 rounded-xl" />
          <p className="text-base">Enter a URL above to get started</p>
        </div>
      )}
    </main>
  );
}

export default Analyze;
