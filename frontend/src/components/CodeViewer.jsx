'use client';

import { useState, useEffect } from 'react';
import { ChevronRight, ChevronDown, Folder, FolderOpen, FileText, Loader2, Code2 } from 'lucide-react';
import hljs from 'highlight.js';

/**
 * Converts a flat file list into a nested tree structure.
 */
function buildTree(flatList) {
  const root = { name: '', children: {}, type: 'tree' };

  flatList.forEach((item) => {
    const parts = item.path.split('/');
    let current = root;

    parts.forEach((part, index) => {
      if (!current.children[part]) {
        current.children[part] = {
          name: part,
          children: {},
          type: index === parts.length - 1 ? item.type : 'tree',
          path: parts.slice(0, index + 1).join('/'),
        };
      }
      current = current.children[part];
    });
  });

  return root;
}

function sortNodes(nodes) {
  return nodes.sort((a, b) => {
    if (a.type === 'tree' && b.type !== 'tree') return -1;
    if (a.type !== 'tree' && b.type === 'tree') return 1;
    return a.name.localeCompare(b.name);
  });
}

function TreeNode({ node, depth = 0, selectedFile, onFileClick }) {
  const [isOpen, setIsOpen] = useState(depth < 1);
  const children = sortNodes(Object.values(node.children));
  const isDirectory = node.type === 'tree';
  const hasChildren = children.length > 0;
  const isSelected = !isDirectory && node.path === selectedFile;

  return (
    <div>
      <button
        onClick={() => {
          if (isDirectory) {
            setIsOpen(!isOpen);
          } else {
            onFileClick(node.path);
          }
        }}
        className={`w-full flex items-center gap-1.5 py-1 px-2 rounded text-sm transition-colors text-left ${
          isSelected
            ? 'bg-emerald-500/15 text-emerald-400'
            : 'hover:bg-gray-800/60 text-gray-400'
        } cursor-pointer`}
        style={{ paddingLeft: `${depth * 14 + 8}px` }}
      >
        {isDirectory ? (
          <>
            {isOpen ? (
              <ChevronDown className="w-3 h-3 text-gray-500 shrink-0" />
            ) : (
              <ChevronRight className="w-3 h-3 text-gray-500 shrink-0" />
            )}
            {isOpen ? (
              <FolderOpen className="w-3.5 h-3.5 text-yellow-400 shrink-0" />
            ) : (
              <Folder className="w-3.5 h-3.5 text-yellow-400 shrink-0" />
            )}
          </>
        ) : (
          <>
            <span className="w-3 shrink-0" />
            <FileText className="w-3.5 h-3.5 text-gray-500 shrink-0" />
          </>
        )}
        <span className={`truncate text-xs ${isDirectory ? 'text-gray-200 font-medium' : ''}`}>
          {node.name}
        </span>
      </button>

      {isDirectory && isOpen && hasChildren && (
        <div>
          {children.map((child) => (
            <TreeNode
              key={child.path}
              node={child}
              depth={depth + 1}
              selectedFile={selectedFile}
              onFileClick={onFileClick}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function CodeViewer({ items, repoUrl }) {
  const [selectedFile, setSelectedFile] = useState(null);
  const [fileContent, setFileContent] = useState('');
  const [highlightedHtml, setHighlightedHtml] = useState('');
  const [loadingFile, setLoadingFile] = useState(false);
  const [fileError, setFileError] = useState('');
  const [fileSummary, setFileSummary] = useState('');
  const [loadingSummary, setLoadingSummary] = useState(false);

  useEffect(() => {
    if (fileContent) {
      const ext = selectedFile?.split('.').pop() || '';
      const langMap = {
        js: 'javascript', jsx: 'javascript', ts: 'typescript', tsx: 'typescript',
        py: 'python', rb: 'ruby', java: 'java', go: 'go', rs: 'rust',
        css: 'css', scss: 'scss', html: 'html', xml: 'xml', json: 'json',
        md: 'markdown', yml: 'yaml', yaml: 'yaml', sh: 'bash', bash: 'bash',
        sql: 'sql', c: 'c', cpp: 'cpp', h: 'c', hpp: 'cpp',
        php: 'php', swift: 'swift', kt: 'kotlin', dart: 'dart',
        toml: 'toml', ini: 'ini', dockerfile: 'dockerfile',
      };
      const language = langMap[ext.toLowerCase()] || '';

      try {
        let result;
        if (language && hljs.getLanguage(language)) {
          result = hljs.highlight(fileContent, { language });
        } else {
          result = hljs.highlightAuto(fileContent);
        }
        setHighlightedHtml(result.value);
      } catch {
        setHighlightedHtml('');
      }
    } else {
      setHighlightedHtml('');
    }
  }, [fileContent, selectedFile]);

  if (!items || items.length === 0) return null;

  const tree = buildTree(items);
  const rootChildren = sortNodes(Object.values(tree.children));

  // Extract owner/repo from the URL
  const repoMatch = repoUrl?.match(/github\.com\/([^/]+)\/([^/]+)/);
  const owner = repoMatch ? repoMatch[1] : '';
  const repo = repoMatch ? repoMatch[2].replace(/\.git$/, '') : '';

  const handleFileClick = async (filePath) => {
    setSelectedFile(filePath);
    setFileContent('');
    setFileError('');
    setLoadingFile(true);
    setFileSummary('');
    setLoadingSummary(false);

    try {
      const apiUrl = import.meta.env.VITE_API_URL || '';
      const response = await fetch(`${apiUrl}/api/analyze/file`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ owner, repo, path: filePath }),
      });

      if (!response.ok) throw new Error('Failed to fetch file');

      const data = await response.json();

      if (data.encoding === 'base64' && data.content) {
        const decoded = atob(data.content.replace(/\n/g, ''));
        setFileContent(decoded);

        // Fetch AI summary
        setLoadingSummary(true);
        try {
          const summaryRes = await fetch(`${apiUrl}/api/analyze/summarize`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ fileName: filePath, content: decoded }),
          });
          if (summaryRes.ok) {
            const summaryData = await summaryRes.json();
            setFileSummary(summaryData.summary);
          }
        } catch {
          // Summary is optional
        } finally {
          setLoadingSummary(false);
        }
      } else {
        setFileError('Unable to decode file content.');
      }
    } catch (err) {
      setFileError(err.message || 'Could not load file.');
    } finally {
      setLoadingFile(false);
    }
  };

  return (
    <div className="flex rounded-xl border border-gray-800 bg-gray-900/50 overflow-hidden h-[calc(100vh-280px)]">
      {/* File Tree Sidebar */}
      <div className="w-64 shrink-0 border-r border-gray-800 overflow-y-auto p-2">
        <div className="font-mono">
          {rootChildren.map((node) => (
            <TreeNode
              key={node.path}
              node={node}
              depth={0}
              selectedFile={selectedFile}
              onFileClick={handleFileClick}
            />
          ))}
        </div>
      </div>

      {/* File Content Viewer */}
      <div className="flex-1 overflow-hidden flex flex-col">
        {selectedFile ? (
          <>
            <div className="px-4 py-2 border-b border-gray-800 bg-gray-900/80 flex items-center gap-2">
              <Code2 className="w-4 h-4 text-emerald-400" />
              <span className="text-sm text-gray-300 font-mono truncate">{selectedFile}</span>
            </div>
            {/* AI Summary */}
            {(loadingSummary || fileSummary) && (
              <div className="px-4 py-3 border-b border-gray-800 bg-emerald-500/5">
                {loadingSummary ? (
                  <div className="flex items-center gap-2 text-sm text-gray-400">
                    <Loader2 className="w-3.5 h-3.5 animate-spin text-emerald-400" />
                    <span>Generating summary...</span>
                  </div>
                ) : (
                  <p className="text-sm text-gray-300 leading-relaxed">
                    <span className="text-emerald-400 font-medium">AI Summary: </span>
                    {fileSummary}
                  </p>
                )}
              </div>
            )}
            <div className="flex-1 overflow-auto p-4">
              {loadingFile ? (
                <div className="flex items-center justify-center h-full">
                  <Loader2 className="w-6 h-6 text-emerald-400 animate-spin" />
                </div>
              ) : fileError ? (
                <p className="text-red-400 text-sm">{fileError}</p>
              ) : (
                <div className="text-sm font-mono leading-relaxed flex">
                  <div className="text-gray-600 select-none pr-4 text-right shrink-0 pt-0">
                    {fileContent.split('\n').map((_, i) => (
                      <div key={i} className="leading-6">{i + 1}</div>
                    ))}
                  </div>
                  <pre className="flex-1 overflow-x-auto" style={{ color: '#c9d1d9' }}>
                    {highlightedHtml ? (
                      <code
                        className="hljs leading-6 block"
                        style={{ color: 'inherit' }}
                        dangerouslySetInnerHTML={{ __html: highlightedHtml }}
                      />
                    ) : (
                      <code className="leading-6 block">{fileContent}</code>
                    )}
                  </pre>
                </div>
              )}
            </div>
          </>
        ) : (
          <div className="flex items-center justify-center h-full text-gray-600">
            <div className="text-center">
              <FileText className="w-12 h-12 mx-auto mb-3 opacity-30" />
              <p className="text-sm">Select a file to view its content</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default CodeViewer;
