
import React from 'react';
import type { MeraNetwork, MeraNode } from '../types';

interface MeraVisualizationProps {
  network: MeraNetwork;
  selectedBoundaryIds: Set<string>;
  cutBonds: Set<string>;
}

const MeraVisualization: React.FC<MeraVisualizationProps> = ({ network, selectedBoundaryIds, cutBonds }) => {
  const { nodes, bonds } = network;

  const getNodeClasses = (node: MeraNode) => {
    const base = "transition-all duration-300";
    if (node.isBoundary) {
      return selectedBoundaryIds.has(node.id)
        ? `${base} fill-cyan-400 stroke-cyan-200`
        : `${base} fill-gray-700 stroke-gray-500`;
    }
    return `${base} fill-indigo-800 stroke-indigo-500`;
  };

  const getBondClasses = (bondId: string) => {
    return cutBonds.has(bondId)
      ? "stroke-red-500 stroke-[3px] transition-all duration-300"
      : "stroke-gray-600 stroke-[1.5px] transition-all duration-300";
  };
  
  const getBondDash = (bondId: string) => {
      return cutBonds.has(bondId) ? "6 3" : "none";
  }

  return (
    <div className="w-full aspect-[16/9] max-w-4xl mx-auto bg-gray-900 rounded-lg p-4 border border-gray-700 shadow-2xl shadow-indigo-500/10">
      <svg viewBox="0 0 800 500" width="100%" height="100%">
        <defs>
          <marker id="arrow" viewBox="0 0 10 10" refX="5" refY="5"
              markerWidth="6" markerHeight="6"
              orient="auto-start-reverse">
            <path d="M 0 0 L 10 5 L 0 10 z" fill="#4a5568" />
          </marker>
        </defs>

        {bonds.map(bond => {
          const sourceNode = nodes.find(n => n.id === bond.source);
          const targetNode = nodes.find(n => n.id === bond.target);
          if (!sourceNode || !targetNode) return null;
          return (
            <line
              key={bond.id}
              x1={sourceNode.x}
              y1={sourceNode.y}
              x2={targetNode.x}
              y2={targetNode.y}
              className={getBondClasses(bond.id)}
              strokeDasharray={getBondDash(bond.id)}
            />
          );
        })}

        {nodes.map(node => (
          <circle
            key={node.id}
            cx={node.x}
            cy={node.y}
            r={node.isBoundary ? 12 : 10}
            className={getNodeClasses(node)}
            strokeWidth="2"
          />
        ))}
      </svg>
    </div>
  );
};

export default MeraVisualization;
