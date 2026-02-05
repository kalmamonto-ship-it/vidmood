'use client';

import React, { useState, ReactElement } from 'react';
import { Smile, Frown, Zap, Heart, Coffee, Moon } from 'lucide-react';

interface Mood {
  id: string;
  name: string;
  icon: ReactElement;
  color: string;
  bgColor: string;
}

const moods: Mood[] = [
  { id: 'happy', name: 'Happy', icon: <Smile />, color: 'text-yellow-400', bgColor: 'bg-yellow-400/20' },
  { id: 'sad', name: 'Sad', icon: <Frown />, color: 'text-blue-400', bgColor: 'bg-blue-400/20' },
  { id: 'energetic', name: 'Energetic', icon: <Zap />, color: 'text-red-400', bgColor: 'bg-red-400/20' },
  { id: 'calm', name: 'Calm', icon: <Heart />, color: 'text-green-400', bgColor: 'bg-green-400/20' },
  { id: 'focused', name: 'Focused', icon: <Coffee />, color: 'text-purple-400', bgColor: 'bg-purple-400/20' },
  { id: 'tired', name: 'Tired', icon: <Moon />, color: 'text-gray-400', bgColor: 'bg-gray-400/20' },
];

interface MoodSelectorProps {
  onMoodSelect: (moodId: string) => void;
  currentMood: string | null;
}

export default function MoodSelector({ onMoodSelect, currentMood }: MoodSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);

  const handleMoodSelect = (moodId: string) => {
    onMoodSelect(moodId);
    setIsOpen(false);
  };

  const selectedMood = moods.find(mood => mood.id === currentMood);

  return (
    <div className="fixed top-6 left-6 z-50">
      <div className="relative">
        {/* Mood Selector Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={`flex items-center space-x-3 px-5 py-3 rounded-2xl backdrop-blur-xl transition-all duration-300 shadow-xl hover:scale-105 ${
            selectedMood 
              ? `${selectedMood.bgColor} border-2 ${selectedMood.color.replace('text-', 'border-')} shadow-lg` 
              : 'bg-black/40 border border-white/30 hover:bg-black/60 hover:border-white/50'
          }`}
        >
          <div className={selectedMood ? selectedMood.color : 'text-white'}>
            {selectedMood ? selectedMood.icon : <Smile />}
          </div>
          <span className={`font-semibold text-base ${selectedMood ? selectedMood.color : 'text-white'}`}>
            {selectedMood ? selectedMood.name : 'Your Mood?'}
          </span>
        </button>

        {/* Mood Options Dropdown */}
        {isOpen && (
          <div className="absolute top-14 left-0 bg-black/80 backdrop-blur-lg rounded-2xl p-3 border border-white/20 min-w-[200px]">
            <h3 className="text-white text-sm font-medium mb-3 px-2">How are you feeling?</h3>
            <div className="grid grid-cols-2 gap-2">
              {moods.map((mood) => (
                <button
                  key={mood.id}
                  onClick={() => handleMoodSelect(mood.id)}
                  className={`flex flex-col items-center p-3 rounded-xl transition-all duration-200 ${
                    currentMood === mood.id
                      ? `${mood.bgColor} ring-2 ${mood.color.replace('text-', 'ring-')}`
                      : 'bg-white/10 hover:bg-white/20'
                  }`}
                >
                  <div className={`mb-1 ${mood.color}`}>
                    {mood.icon}
                  </div>
                  <span className={`text-xs font-medium ${mood.color}`}>
                    {mood.name}
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}