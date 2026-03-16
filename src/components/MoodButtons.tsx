"use client";

import React from "react";

interface MoodButtonsProps {
  onSelect: (mood: number) => void;
  disabled?: boolean;
}

export const MoodButtons: React.FC<MoodButtonsProps> = ({ onSelect, disabled }) => {
  const moods = [
    { value: 1, label: "Good", emoji: "😊" },
    { value: 0, label: "Neutral", emoji: "😐" },
    { value: -1, label: "Bad", emoji: "😡" },
  ];

  return (
    <div className="mood-buttons">
      {moods.map((m) => (
        <button
          key={m.value}
          onClick={() => onSelect(m.value)}
          disabled={disabled}
          className="mood-button"
          aria-label={m.label}
        >
          <span className="emoji">{m.emoji}</span>
          <span className="label">{m.label}</span>
        </button>
      ))}
      
    </div>
  );
};
