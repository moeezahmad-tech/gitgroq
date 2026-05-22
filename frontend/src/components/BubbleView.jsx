'use client';

import { useState, useRef, useEffect, useCallback } from 'react';

/**
 * Build graph nodes and links from flat file list.
 */
function buildGraph(flatList, expandedPaths) {
  const nodes = [];
  const links = [];
  const map = {};

  // Add root node
  const rootNode = { id: 'root', name: 'root', type: 'tree', children: [], depth: 0 };
  nodes.push(rootNode);
  map['root'] = rootNode;

  const sorted = [...flatList].sort((a, b) => a.path.localeCompare(b.path));

  sorted.forEach((item) => {
    const parts = item.path.split('/');

    // Ensure all intermediate directories exist
    let current = 'root';
    parts.slice(0, -1).forEach((part, idx) => {
      const id = parts.slice(0, idx + 1).join('/');
      if (!map[id]) {
        const node = { id, name: part, type: 'tree', children: [], depth: idx + 1 };
        map[id] = node;
        map[current].children.push(id);
      }
      current = id;
    });

    // Add the item itself
    const id = item.path;
    if (!map[id]) {
      const node = { id, name: parts[parts.length - 1], type: item.type, children: [], depth: parts.length };
      map[id] = node;
      map[current].children.push(id);
    }
  });

  // Now filter visible nodes based on expanded state
  const visibleIds = new Set();
  const queue = ['root'];
  visibleIds.add('root');

  while (queue.length > 0) {
    const currentId = queue.shift();
    const node = map[currentId];
    if (!node) continue;

    // Always show direct children of root
    // For other folders, only show children if expanded
    if (currentId === 'root' || expandedPaths.has(currentId)) {
      node.children.forEach((childId) => {
        visibleIds.add(childId);
        const child = map[childId];
        if (child && child.type === 'tree') {
          queue.push(childId);
        }
      });
    }
  }

  // Build final nodes and links
  const finalNodes = [];
  const finalLinks = [];
  const nodeIndex = {};

  visibleIds.forEach((id) => {
    const node = map[id];
    if (node) {
      nodeIndex[id] = finalNodes.length;
      finalNodes.push({
        ...node,
        x: 0,
        y: 0,
        vx: 0,
        vy: 0,
        childCount: node.children.length,
        isExpanded: expandedPaths.has(id),
      });
    }
  });

  // Create links for visible parent-child relationships
  visibleIds.forEach((id) => {
    const node = map[id];
    if (!node || id === 'root') return;

    // Find parent
    const parts = id.split('/');
    let parentId = parts.length > 1 ? parts.slice(0, -1).join('/') : 'root';
    if (!visibleIds.has(parentId)) parentId = 'root';

    if (nodeIndex[parentId] !== undefined && nodeIndex[id] !== undefined) {
      finalLinks.push({ source: nodeIndex[parentId], target: nodeIndex[id] });
    }
  });

  return { nodes: finalNodes, links: finalLinks };
}

/**
 * Force-directed graph simulation — initial setup.
 * Now handled inline during graph rebuild (spawn near parent).
 */
function forceSimulation(nodes, links, width, height) {
  // No-op: positioning is handled during graph rebuild
}

function simulateStep(nodes, links, width, height, dragIndex) {
  const centerX = width / 2;
  const centerY = height / 2;
  const padding = 40;

  // Center gravity
  nodes.forEach((node, i) => {
    if (i === dragIndex) return;
    node.vx += (centerX - node.x) * 0.0005;
    node.vy += (centerY - node.y) * 0.0005;
  });

  // Link attraction (spring force)
  links.forEach((link) => {
    const source = nodes[link.source];
    const target = nodes[link.target];
    if (!source || !target) return;

    const dx = target.x - source.x;
    const dy = target.y - source.y;
    const dist = Math.sqrt(dx * dx + dy * dy) || 1;
    const idealDist = 80;
    const force = (dist - idealDist) * 0.005;

    const fx = (dx / dist) * force;
    const fy = (dy / dist) * force;

    if (link.source !== dragIndex) {
      source.vx += fx;
      source.vy += fy;
    }
    if (link.target !== dragIndex) {
      target.vx -= fx;
      target.vy -= fy;
    }
  });

  // Node repulsion (charge force)
  for (let i = 0; i < nodes.length; i++) {
    for (let j = i + 1; j < nodes.length; j++) {
      const a = nodes[i];
      const b = nodes[j];
      const dx = b.x - a.x;
      const dy = b.y - a.y;
      const dist = Math.sqrt(dx * dx + dy * dy) || 1;
      const minDist = 70;

      if (dist < minDist * 3) {
        const force = -800 / (dist * dist);
        const fx = (dx / dist) * force;
        const fy = (dy / dist) * force;

        if (i !== dragIndex) {
          a.vx += fx;
          a.vy += fy;
        }
        if (j !== dragIndex) {
          b.vx -= fx;
          b.vy -= fy;
        }
      }
    }
  }

  // Apply velocity and damping
  nodes.forEach((node, i) => {
    if (i === dragIndex) return;

    node.vx *= 0.85;
    node.vy *= 0.85;

    node.x += node.vx;
    node.y += node.vy;

    // Keep within bounds
    node.x = Math.max(padding, Math.min(width - padding, node.x));
    node.y = Math.max(padding, Math.min(height - padding, node.y));
  });
}

function BubbleView({ items }) {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const graphRef = useRef({ nodes: [], links: [] });
  const animRef = useRef(null);
  const dragRef = useRef({ active: false, index: -1 });
  const [expandedPaths, setExpandedPaths] = useState(new Set(['root']));
  const [hoveredIndex, setHoveredIndex] = useState(-1);
  const [dimensions, setDimensions] = useState({ width: 900, height: 650 });
  const [, forceRender] = useState(0);

  // Measure container
  useEffect(() => {
    if (!containerRef.current) return;

    const measure = () => {
      const rect = containerRef.current?.getBoundingClientRect();
      if (rect) {
        setDimensions({ width: rect.width || 900, height: rect.height || 650 });
      }
    };

    measure();

    const observer = new ResizeObserver(measure);
    observer.observe(containerRef.current);

    return () => observer.disconnect();
  }, []);

  // Rebuild graph when items or expanded state changes
  useEffect(() => {
    if (!items || items.length === 0) return;

    const { nodes, links } = buildGraph(items, expandedPaths);
    const { width, height } = dimensions;

    // Preserve positions of existing nodes
    const oldPositions = new Map(graphRef.current.nodes.map((n) => [n.id, { x: n.x, y: n.y }]));

    // First pass: restore known positions
    nodes.forEach((node) => {
      const old = oldPositions.get(node.id);
      if (old) {
        node.x = old.x;
        node.y = old.y;
      }
    });

    // Second pass: spawn new nodes near their parent
    const nodeById = new Map(nodes.map((n) => [n.id, n]));
    nodes.forEach((node) => {
      if (node.x !== 0 || node.y !== 0) return; // already positioned

      // Find parent via links
      const parentLink = links.find((l) => nodes[l.target]?.id === node.id);
      const parent = parentLink ? nodes[parentLink.source] : null;

      if (parent && (parent.x !== 0 || parent.y !== 0)) {
        // Spawn near parent with small random offset
        const angle = Math.random() * Math.PI * 2;
        const dist = 40 + Math.random() * 30;
        node.x = parent.x + Math.cos(angle) * dist;
        node.y = parent.y + Math.sin(angle) * dist;
      } else {
        // Fallback: near center
        node.x = width / 2 + (Math.random() - 0.5) * 80;
        node.y = height / 2 + (Math.random() - 0.5) * 80;
      }
    });

    // Root always at center if it has no position
    if (nodes.length > 0 && nodes[0].id === 'root' && !oldPositions.has('root')) {
      nodes[0].x = width / 2;
      nodes[0].y = height / 2;
    }

    graphRef.current = { nodes, links };
  }, [items, expandedPaths, dimensions]);

  // Animation loop using canvas
  useEffect(() => {
    let running = true;

    function draw() {
      if (!running) return;

      const canvas = canvasRef.current;
      if (!canvas) { animRef.current = requestAnimationFrame(draw); return; }

      const ctx = canvas.getContext('2d');
      const { width, height } = dimensions;
      const { nodes, links } = graphRef.current;
      const dpr = window.devicePixelRatio || 1;

      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.scale(dpr, dpr);

      // Simulate
      simulateStep(nodes, links, width, height, dragRef.current.active ? dragRef.current.index : -1);

      // Clear
      ctx.clearRect(0, 0, width, height);

      // Draw links
      links.forEach((link) => {
        const source = nodes[link.source];
        const target = nodes[link.target];
        if (!source || !target) return;

        const depthColors = ['#10b981', '#60a5fa', '#a78bfa', '#fb923c', '#4ade80', '#f472b6', '#22d3ee', '#fbbf24'];
        const colorIndex = ((target.depth || 1) - 1) % depthColors.length;

        ctx.strokeStyle = depthColors[colorIndex] + '40';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(source.x, source.y);
        ctx.lineTo(target.x, target.y);
        ctx.stroke();
      });

      // Draw nodes
      nodes.forEach((node, i) => {
        const isFolder = node.type === 'tree';
        const isRoot = node.id === 'root';
        const isHovered = i === hoveredIndex;
        const isExpanded = node.isExpanded;
        const radius = isRoot ? 28 : isFolder ? 22 : 14;

        // Depth-based color palette for nested levels
        const depthColors = [
          { fill: '#064e3b', stroke: '#10b981' },  // depth 0 - emerald
          { fill: '#1e3a5f', stroke: '#60a5fa' },  // depth 1 - blue
          { fill: '#3b1f5e', stroke: '#a78bfa' },  // depth 2 - purple
          { fill: '#5c2d1e', stroke: '#fb923c' },  // depth 3 - orange
          { fill: '#1a3a2a', stroke: '#4ade80' },  // depth 4 - green
          { fill: '#4a1942', stroke: '#f472b6' },  // depth 5 - pink
          { fill: '#1e3a4a', stroke: '#22d3ee' },  // depth 6 - cyan
          { fill: '#4a3b1e', stroke: '#fbbf24' },  // depth 7 - amber
        ];
        const depthIndex = (node.depth || 0) % depthColors.length;
        const depthColor = depthColors[depthIndex];

        // Glow effect
        if (isHovered || isRoot) {
          ctx.beginPath();
          ctx.arc(node.x, node.y, radius + 6, 0, Math.PI * 2);
          const gradient = ctx.createRadialGradient(node.x, node.y, radius, node.x, node.y, radius + 8);
          gradient.addColorStop(0, isRoot ? 'rgba(16, 185, 129, 0.3)' : `${depthColor.stroke}33`);
          gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
          ctx.fillStyle = gradient;
          ctx.fill();
        }

        // Node circle
        ctx.beginPath();
        ctx.arc(node.x, node.y, radius, 0, Math.PI * 2);

        if (isRoot) {
          ctx.fillStyle = '#064e3b';
          ctx.strokeStyle = '#10b981';
        } else if (isFolder) {
          ctx.fillStyle = depthColor.fill;
          ctx.strokeStyle = depthColor.stroke;
        } else {
          ctx.fillStyle = depthColor.fill;
          ctx.strokeStyle = depthColor.stroke + '99';
        }

        ctx.lineWidth = isHovered ? 2.5 : 2;
        ctx.fill();
        ctx.stroke();

        // Icon/text
        ctx.fillStyle = '#e2e8f0';
        ctx.font = `${isRoot ? 14 : isFolder ? 12 : 10}px sans-serif`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';

        if (isRoot) {
          ctx.fillText('🌐', node.x, node.y);
        } else if (isFolder) {
          ctx.fillText(isExpanded ? '📂' : '📁', node.x, node.y);
        } else {
          ctx.fillText('📄', node.x, node.y);
        }

        // Label below node
        ctx.fillStyle = isHovered ? '#f1f5f9' : '#94a3b8';
        ctx.font = `${isHovered ? 11 : 10}px -apple-system, sans-serif`;
        ctx.textAlign = 'center';

        const label = node.name.length > 12 ? node.name.slice(0, 11) + '…' : node.name;
        ctx.fillText(label, node.x, node.y + radius + 14);

        // Child count badge for folders
        if (isFolder && node.childCount > 0 && !isExpanded) {
          const badgeX = node.x + radius * 0.7;
          const badgeY = node.y - radius * 0.7;
          ctx.beginPath();
          ctx.arc(badgeX, badgeY, 8, 0, Math.PI * 2);
          ctx.fillStyle = '#854d0e';
          ctx.fill();
          ctx.fillStyle = '#fde047';
          ctx.font = '8px sans-serif';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText(node.childCount > 9 ? '9+' : `${node.childCount}`, badgeX, badgeY);
        }
      });

      animRef.current = requestAnimationFrame(draw);
    }

    animRef.current = requestAnimationFrame(draw);

    return () => {
      running = false;
      if (animRef.current) cancelAnimationFrame(animRef.current);
    };
  }, [dimensions, hoveredIndex, expandedPaths]);

  // Find node at position
  const getNodeAt = useCallback((x, y) => {
    const nodes = graphRef.current.nodes;
    for (let i = nodes.length - 1; i >= 0; i--) {
      const node = nodes[i];
      const radius = node.id === 'root' ? 28 : node.type === 'tree' ? 22 : 14;
      const dx = x - node.x;
      const dy = y - node.y;
      if (dx * dx + dy * dy <= (radius + 5) * (radius + 5)) {
        return i;
      }
    }
    return -1;
  }, []);

  const getMousePos = useCallback((e) => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return { x: 0, y: 0 };
    return { x: e.clientX - rect.left, y: e.clientY - rect.top };
  }, []);

  // Mouse handlers
  const handleMouseDown = useCallback((e) => {
    const pos = getMousePos(e);
    const index = getNodeAt(pos.x, pos.y);
    if (index >= 0) {
      dragRef.current = { active: true, index };
      const node = graphRef.current.nodes[index];
      node.vx = 0;
      node.vy = 0;
    }
  }, [getNodeAt, getMousePos]);

  const handleMouseMove = useCallback((e) => {
    const pos = getMousePos(e);

    if (dragRef.current.active) {
      const node = graphRef.current.nodes[dragRef.current.index];
      if (node) {
        node.x = pos.x;
        node.y = pos.y;
        node.vx = 0;
        node.vy = 0;
      }
    } else {
      const index = getNodeAt(pos.x, pos.y);
      setHoveredIndex(index);
    }
  }, [getNodeAt, getMousePos]);

  const handleMouseUp = useCallback(() => {
    dragRef.current = { active: false, index: -1 };
  }, []);

  const handleDoubleClick = useCallback((e) => {
    const pos = getMousePos(e);
    const index = getNodeAt(pos.x, pos.y);
    if (index >= 0) {
      const node = graphRef.current.nodes[index];
      if (node.type === 'tree') {
        setExpandedPaths((prev) => {
          const next = new Set(prev);
          if (next.has(node.id)) {
            next.delete(node.id);
          } else {
            next.add(node.id);
          }
          return next;
        });
      }
    }
  }, [getNodeAt, getMousePos]);

  return (
    <div ref={containerRef} className="relative w-full h-full min-h-[650px] rounded-xl border border-gray-700/50 overflow-hidden">
      <canvas
        ref={canvasRef}
        className="w-full h-full bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950"
        style={{ minHeight: '650px', cursor: dragRef.current.active ? 'grabbing' : hoveredIndex >= 0 ? 'grab' : 'default' }}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onDoubleClick={handleDoubleClick}
      />

      {/* Legend */}
      <div className="absolute bottom-4 left-4 flex items-center gap-3 text-xs text-gray-400 z-30 bg-gray-900/90 px-4 py-2.5 rounded-lg border border-gray-700/50 backdrop-blur-sm">
        <span className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-full bg-emerald-900 border border-emerald-500 inline-block" />
          Root
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-full bg-yellow-900/50 border border-yellow-500 inline-block" />
          Folder
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-full bg-slate-800 border border-slate-500 inline-block" />
          File
        </span>
        <span className="text-gray-600">|</span>
        <span>Drag to move • Double-click folder to expand</span>
      </div>

      {/* Node count */}
      <div className="absolute top-4 right-4 text-xs text-gray-500 z-30 bg-gray-900/90 px-3 py-2 rounded-lg border border-gray-700/50 backdrop-blur-sm">
        {graphRef.current.nodes.length} nodes • {graphRef.current.links.length} connections
      </div>
    </div>
  );
}

export default BubbleView;
