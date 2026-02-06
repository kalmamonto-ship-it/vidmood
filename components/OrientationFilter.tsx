'use client';

import { useState } from 'react';

interface OrientationFilterProps {
  onOrientationChange: (orientation: 'all' | 'portrait' | 'landscape') => void;
}

export default function OrientationFilter({ onOrientationChange }: OrientationFilterProps) {
  const [selectedOrientation, setSelectedOrientation] = useState<'all' | 'portrait' | 'landscape'>('all');

  const handleChange = (orientation: 'all' | 'portrait' | 'landscape') => {
    setSelectedOrientation(orientation);
    onOrientationChange(orientation);
  };

  return (
    <div className="flex space-x-2 mb-4">
      <button
        onClick={() => handleChange('all')}
        className={`px-4 py-2 rounded-lg ${
          selectedOrientation === 'all'
            ? 'bg-purple-600 text-white'
            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
        }`}
      >
        All
      </button>
      <button
        onClick={() => handleChange('portrait')}
        className={`px-4 py-2 rounded-lg ${
          selectedOrientation === 'portrait'
            ? 'bg-purple-600 text-white'
            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
        }`}
      >
        Portrait
      </button>
      <button
        onClick={() => handleChange('landscape')}
        className={`px-4 py-2 rounded-lg ${
          selectedOrientation === 'landscape'
            ? 'bg-purple-600 text-white'
            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
        }`}
      >
        Landscape
      </button>
    </div>
  );
}