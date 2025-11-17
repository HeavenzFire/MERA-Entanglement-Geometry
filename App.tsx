
import React, { useState, useMemo, useEffect } from 'react';
import MeraVisualization from './components/MeraVisualization';
import { RegionSelector, EntropyDisplay } from './components/Controls';
import { buildMeraNetwork, calculateMinCut } from './services/meraService';
import type { MeraNetwork, MinCutResult } from './types';

const App: React.FC = () => {
  const [network, setNetwork] = useState<MeraNetwork | null>(null);
  const [region, setRegion] = useState<[number, number]>([2, 5]);

  useEffect(() => {
    setNetwork(buildMeraNetwork(8));
  }, []);

  const { minCutResult, selectedBoundaryIds } = useMemo(() => {
    if (!network) {
      return {
        minCutResult: { entropy: 0, cutBonds: new Set<string>() },
        selectedBoundaryIds: new Set<string>(),
      };
    }

    const regionIndices = Array.from({ length: region[1] - region[0] + 1 }, (_, i) => region[0] + i);
    const result = calculateMinCut(network, regionIndices);
    
    const boundaryNodes = network.nodes.filter(n => n.isBoundary);
    const selectedIds = new Set(regionIndices.map(i => boundaryNodes[i]?.id).filter(Boolean));

    return { minCutResult: result, selectedBoundaryIds: selectedIds };
  }, [network, region]);

  if (!network) {
    return <div className="flex items-center justify-center h-screen text-xl">Loading Network...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 flex flex-col items-center p-4 sm:p-8 font-sans">
      <header className="text-center mb-8">
        <h1 className="text-4xl sm:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400">
          Entanglement as Geometry
        </h1>
        <p className="mt-2 text-lg text-gray-400 max-w-3xl mx-auto">
          An interactive MERA network demonstrating the Ryu-Takayanagi formula. The entropy of a boundary region is proportional to the area of a minimal surface in the bulk.
        </p>
      </header>

      <main className="w-full max-w-7xl flex flex-col items-center">
        <MeraVisualization
          network={network}
          selectedBoundaryIds={selectedBoundaryIds}
          cutBonds={minCutResult.cutBonds}
        />

        <div className="w-full max-w-4xl mt-8 grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
          <div className="md:col-span-2">
            <RegionSelector
              boundarySize={network.boundarySize}
              region={region}
              setRegion={setRegion}
            />
          </div>
          <EntropyDisplay entropy={minCutResult.entropy} />
        </div>
      </main>
      
      <footer className="mt-12 text-center text-gray-500 text-sm">
          <p>Built by a world-class senior frontend React engineer with deep expertise in Gemini API and UI/UX design.</p>
          <p>Vector: entanglement-as-geometry, constrained by holography, with a path to code.</p>
      </footer>
    </div>
  );
};

export default App;
