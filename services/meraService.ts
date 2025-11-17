
import { MeraNetwork, MeraNode, MeraBond, MinCutResult } from '../types';

export const buildMeraNetwork = (boundarySize: number = 8): MeraNetwork => {
  const nodes: MeraNode[] = [];
  const bonds: MeraBond[] = [];
  const layers = Math.log2(boundarySize) + 1;
  const width = 800;
  const height = 500;

  let nodeCounter = 0;

  // Layer 0: Boundary spins
  for (let i = 0; i < boundarySize; i++) {
    nodes.push({
      id: `l0-n${i}`,
      layer: 0,
      x: (width / (boundarySize + 1)) * (i + 1),
      y: height - 50,
      isBoundary: true,
    });
  }

  // Build upper layers
  let nodesInPreviousLayer = boundarySize;
  for (let l = 1; l < layers; l++) {
    const nodesInCurrentLayer = nodesInPreviousLayer / 2;
    const y = height - 50 - l * 120;
    const prevLayerNodes = nodes.filter(n => n.layer === l - 1);

    for (let i = 0; i < nodesInCurrentLayer; i++) {
      const newNodeId = `l${l}-n${i}`;
      const child1 = prevLayerNodes[i * 2];
      const child2 = prevLayerNodes[i * 2 + 1];
      
      nodes.push({
        id: newNodeId,
        layer: l,
        x: (child1.x + child2.x) / 2,
        y,
        isBoundary: false,
      });

      // Add bonds to children
      bonds.push({ id: `${child1.id}-${newNodeId}`, source: child1.id, target: newNodeId });
      bonds.push({ id: `${child2.id}-${newNodeId}`, source: child2.id, target: newNodeId });

      // Add horizontal disentangler bonds for MERA structure (except for top layer)
      if (l > 0 && l < layers-1) {
         const prevLayerChild1 = prevLayerNodes[i*2]
         const prevLayerChild2 = prevLayerNodes[i*2+1]
         if (prevLayerChild1 && prevLayerChild2) {
             bonds.push({ id: `${prevLayerChild1.id}-${prevLayerChild2.id}`, source: prevLayerChild1.id, target: prevLayerChild2.id });
         }
      }
    }
    nodesInPreviousLayer = nodesInCurrentLayer;
  }

  return { nodes, bonds, boundarySize, layers };
};

export const calculateMinCut = (network: MeraNetwork, regionIndices: number[]): MinCutResult => {
  if (regionIndices.length === 0 || regionIndices.length === network.boundarySize) {
    return { entropy: 0, cutBonds: new Set() };
  }

  const nodeMap = new Map(network.nodes.map(n => [n.id, n]));
  const adj = new Map<string, string[]>();
  network.nodes.forEach(n => adj.set(n.id, []));
  network.bonds.forEach(b => {
      adj.get(b.source)?.push(b.target);
      adj.get(b.target)?.push(b.source);
  });

  const boundaryNodes = network.nodes.filter(n => n.isBoundary);
  const regionNodeIds = new Set(regionIndices.map(i => boundaryNodes[i].id));

  // Find all nodes in the "causal cone" of the region
  const bulkRegionNodes = new Set<string>();
  const q: string[] = [...regionNodeIds];
  
  while(q.length > 0) {
      const currId = q.shift()!;
      if (bulkRegionNodes.has(currId)) continue;
      
      bulkRegionNodes.add(currId);
      const node = nodeMap.get(currId);
      if (!node) continue;
      
      adj.get(currId)?.forEach(neighborId => {
          const neighbor = nodeMap.get(neighborId);
          if (neighbor && neighbor.layer >= node.layer && !bulkRegionNodes.has(neighborId)) {
              q.push(neighborId);
          }
      });
  }
  
  const cutBonds = new Set<string>();
  network.bonds.forEach(bond => {
    const inRegion = bulkRegionNodes.has(bond.source);
    const outOfRegion = !bulkRegionNodes.has(bond.target);
    const isCut = (inRegion && outOfRegion) || (!inRegion && bulkRegionNodes.has(bond.target));
    if (isCut) {
      cutBonds.add(bond.id);
    }
  });

  return { entropy: cutBonds.size, cutBonds };
};
