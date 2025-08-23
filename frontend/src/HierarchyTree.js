import React, { useRef } from "react";

function HierarchyTree({ nodes }) {
  const treeRef = useRef(null);

  // Keyboard navigation for tree
  const handleKeyDown = (e, idx, parentIdx = []) => {
    const flatNodes = [];
    const flatten = (nodes, parentIdx = []) => {
      nodes.forEach((node, i) => {
        flatNodes.push({ node, idx: [...parentIdx, i] });
        if (node.children && node.children.length > 0) flatten(node.children, [...parentIdx, i]);
      });
    };
    flatten(nodes);
    const currentIndex = flatNodes.findIndex(n => JSON.stringify(n.idx) === JSON.stringify([...parentIdx, idx]));
    let nextIndex = null;
    if (e.key === "ArrowDown") nextIndex = currentIndex + 1;
    if (e.key === "ArrowUp") nextIndex = currentIndex - 1;
    if (nextIndex !== null && flatNodes[nextIndex]) {
      const el = document.querySelector(`[data-tree-idx='${flatNodes[nextIndex].idx.join("-")}'`);
      if (el) el.focus();
      e.preventDefault();
    }
  };

  const renderTree = (nodes, parentIdx = []) => (
    <ul role="tree">
      {nodes.map((node, i) => {
        const hasChildren = node.children && node.children.length > 0;
        return (
          <li
            key={node.name}
            role="treeitem"
            tabIndex={0}
            aria-label={node.label ? `${node.name} (${node.label})` : node.name}
            aria-expanded={hasChildren ? "true" : undefined}
            data-tree-idx={[...parentIdx, i].join("-")}
            onKeyDown={e => handleKeyDown(e, i, parentIdx)}
          >
            {node.name} {node.label && `(${node.label})`}
            {hasChildren && renderTree(node.children, [...parentIdx, i])}
          </li>
        );
      })}
    </ul>
  );
  return <div ref={treeRef}>{renderTree(nodes)}</div>;
}

export default HierarchyTree;
