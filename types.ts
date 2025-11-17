
export interface MeraNode {
  id: string;
  layer: number;
  x: number;
  y: number;
  isBoundary: boolean;
}

export interface MeraBond {
  id: string;
  source: string;
  target: string;
}

export interface MeraNetwork {
  nodes: MeraNode[];
  bonds: MeraBond[];
  boundarySize: number;
  layers: number;
}

export interface MinCutResult {
  entropy: number;
  cutBonds: Set<string>;
}
