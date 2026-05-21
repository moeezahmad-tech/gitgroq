'use client';

import { useState } from 'react';
import { ChevronRight, ChevronDown, Folder, FolderOpen, FileText } from 'lucide-react';

/**
 * Converts a flat file list into a nested tree structure.
 * Input: [{ path: "src/components/App.jsx", type: "blob" }, ...]
 * Output: nested object with children
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

/**
 * Sorts tree nodes: directories first, then files, alphabetically.
 */
function sortNodes(nodes) {
  return nodes.sort((a, b) => {
    if (a.type === 'tree' && b.type !== 'tree') return -1;
    if (a.type !== 'tree' && b.type === 'tree') return 1;
    return a.name.localeCompare(b.name);
  });
}

function TreeNode({ node, depth = 0 }) {
  const [isOpen, setIsOpen] = useState(depth < 1);
  const children = sortNodes(Object.values(node.children));
  const isDirectory = node.type === 'tree';
  const hasChildren = children.length > 0;

  return (
    <div>
      <button
        onClick={() => isDirectory && setIsOpen(!isOpen)}
        className={`w-full flex items-center gap-1.5 py-1 px-2 rounded text-sm hover:bg-gray-800/60 transition-colors text-left ${
          isDirectory ? 'cursor-pointer' : 'cursor-default'
        }`}
        style={{ paddingLeft: `${depth * 16 + 8}px` }}
      >
        {isDirectory ? (
          <>
            {isOpen ? (
              <ChevronDown className="w-3.5 h-3.5 text-gray-500 shrink-0" />
            ) : (
              <ChevronRight className="w-3.5 h-3.5 text-gray-500 shrink-0" />
            )}
            {isOpen ? (
              <FolderOpen className="w-4 h-4 text-yellow-400 shrink-0" />
            ) : (
              <Folder className="w-4 h-4 text-yellow-400 shrink-0" />
            )}
          </>
        ) : (
          <>
            <span className="w-3.5 shrink-0" />
            <FileText className="w-4 h-4 text-gray-500 shrink-0" />
          </>
        )}
        <span className={`truncate ${isDirectory ? 'text-gray-200 font-medium' : 'text-gray-400'}`}>
          {node.name}
        </span>
        {isDirectory && hasChildren && (
          <span className="text-gray-600 text-xs ml-auto">{children.length}</span>
        )}
      </button>

      {isDirectory && isOpen && hasChildren && (
        <div>
          {children.map((child) => (
            <TreeNode key={child.path} node={child} depth={depth + 1} />
          ))}
        </div>
      )}
    </div>
  );
}

function FileTree({ items }) {
  if (!items || items.length === 0) return null;

  const tree = buildTree(items);
  const rootChildren = sortNodes(Object.values(tree.children));

  return (
    <div className="font-mono text-sm">
      {rootChildren.map((node) => (
        <TreeNode key={node.path} node={node} depth={0} />
      ))}
    </div>
  );
}

export default FileTree;
