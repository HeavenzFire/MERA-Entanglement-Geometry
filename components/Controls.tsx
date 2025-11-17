
import React from 'react';

interface EntropyDisplayProps {
  entropy: number;
}

export const EntropyDisplay: React.FC<EntropyDisplayProps> = ({ entropy }) => {
  return (
    <div className="bg-gray-800 p-6 rounded-lg text-center border border-gray-700 shadow-lg">
      <h3 className="text-lg font-semibold text-indigo-400 mb-2 tracking-wider">
        Holographic Entropy (S)
      </h3>
      <p className="text-5xl font-bold text-cyan-400 transition-all duration-300">
        {entropy}
      </p>
      <p className="text-sm text-gray-400 mt-2">
        (Number of cut bonds)
      </p>
    </div>
  );
};

interface RegionSelectorProps {
  boundarySize: number;
  region: [number, number];
  setRegion: (newRegion: [number, number]) => void;
}

export const RegionSelector: React.FC<RegionSelectorProps> = ({ boundarySize, region, setRegion }) => {
  const [start, end] = region;

  const handleStartChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newStart = parseInt(e.target.value, 10);
    if (newStart <= end) {
      setRegion([newStart, end]);
    }
  };

  const handleEndChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newEnd = parseInt(e.target.value, 10);
    if (newEnd >= start) {
      setRegion([start, newEnd]);
    }
  };

  return (
    <div className="bg-gray-800 p-6 rounded-lg border border-gray-700 shadow-lg w-full">
      <h3 className="text-lg font-semibold text-indigo-400 mb-4 tracking-wider">
        Select Boundary Region (A)
      </h3>
      <div className="space-y-4">
        <div>
          <label htmlFor="start-slider" className="block text-sm font-medium text-gray-300 mb-1">
            Start Index: {start}
          </label>
          <input
            id="start-slider"
            type="range"
            min="0"
            max={boundarySize - 1}
            value={start}
            onChange={handleStartChange}
            className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-cyan-500"
          />
        </div>
        <div>
          <label htmlFor="end-slider" className="block text-sm font-medium text-gray-300 mb-1">
            End Index: {end + 1}
          </label>
          <input
            id="end-slider"
            type="range"
            min="0"
            max={boundarySize - 1}
            value={end}
            onChange={handleEndChange}
            className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-cyan-500"
          />
        </div>
      </div>
      <div className="mt-4 text-center text-gray-400">
        Selected spins: {end - start + 1}
      </div>
    </div>
  );
};
