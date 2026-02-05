'use client';

import { useState } from 'react';
import { moodCategories } from '@/data/moods';

interface MoodSelectorProps {
  onMoodSelect: (moodId: string) => void;
  currentMood: string | null;
}

export default function MoodSelector({ onMoodSelect, currentMood }: MoodSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);

  const toggleSelector = () => {
    setIsOpen(!isOpen);
  };

  const handleMoodSelect = (moodId: string) => {
    onMoodSelect(moodId);
    setIsOpen(false);
  };

  const currentMoodData = currentMood 
    ? moodCategories.find(mood => mood.id === currentMood)
    : null;

  return (
    <div className="relative z-50">
      {/* Mood Selector Button */}
      <button
        onClick={toggleSelector}
        className="flex items-center space-x-2 bg-black/40 backdrop-blur-xl border border-white/20 rounded-full px-4 py-2 hover:bg-black/60 transition-all duration-300 hover:scale-105 shadow-lg"
      >
        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-r from-purple-500 to-pink-500">
          {currentMoodData ? (
            <span className="text-white text-lg">{currentMoodData.icon}</span>
          ) : (
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          )}
        </div>
        <span className="text-white font-medium text-sm md:text-base">
          {currentMoodData ? currentMoodData.name : 'Select Mood'}
        </span>
        <svg 
          className={`w-4 h-4 text-white transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Mood Options Dropdown - Mobile optimized */}
      {isOpen && (
        <div className="absolute left-1/2 transform -translate-x-1/2 mt-2 bg-black/80 backdrop-blur-xl border border-white/20 rounded-2xl shadow-2xl shadow-purple-500/20 p-3 min-w-[280px] md:min-w-[320px]">
          <div className="grid grid-cols-3 gap-2 md:gap-3">
            {moodCategories.map((mood) => (
              <button
                key={mood.id}
                onClick={() => handleMoodSelect(mood.id)}
                className={`flex flex-col items-center p-3 rounded-xl transition-all duration-300 hover:scale-105 ${
                  currentMood === mood.id
                    ? 'bg-gradient-to-r from-purple-500/30 to-pink-500/30 border border-purple-400/50'
                    : 'bg-white/10 hover:bg-white/20 border border-white/10'
                }`}
              >
                <span className="text-2xl mb-1">{mood.icon}</span>
                <span className="text-white text-xs font-medium text-center">{mood.name}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}