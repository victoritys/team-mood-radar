"use client";

import React, { useState } from 'react';

type EmojiMoodButtonsProps = {
  onSelect: (mood: number) => void;
  disabled?: boolean;
  selectedMood?: number | null;
};

export function EmojiMoodButtons({ onSelect, disabled = false, selectedMood = null }: EmojiMoodButtonsProps) {
  const [animatingBtn, setAnimatingBtn] = useState<number | null>(null);

  const moods = [
    { value: 1, emoji: "😊", label: "Good" },
    { value: 0, emoji: "😐", label: "Neutral" },
    { value: -1, emoji: "😡", label: "Bad" },
  ];

  const handleClick = (value: number) => {
    if (disabled) return;
    setAnimatingBtn(value);
    onSelect(value);
  };

  return (
    <div className="emoji-container fade-in">
      {moods.map((m) => {
        const isAnimating = animatingBtn === m.value;
        const isSelected = selectedMood === m.value;
        const visuallyDisabled = (disabled || selectedMood !== null) && !isSelected;
        
        return (
          <button
            key={m.value}
            onClick={() => handleClick(m.value)}
            disabled={disabled || (selectedMood !== null && !isSelected) || animatingBtn !== null}
            className={`emoji-btn ${isAnimating ? "bouncing" : ""} ${visuallyDisabled ? "visually-disabled" : ""} ${isSelected ? "active" : ""}`}
            aria-label={m.label}
          >
            <span className="emoji">{m.emoji}</span>
            <span className="label">{m.label}</span>
          </button>
        );
      })}

      <style jsx>{`
        .emoji-container {
          display: flex;
          justify-content: center;
          gap: 1.5rem;
          margin: 1rem 0;
        }

        .emoji-btn {
          flex: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 0.75rem;
          padding: 1.5rem 1rem;
          border-radius: var(--radius-xl);
          background: rgba(255, 255, 255, 0.05); /* Dark theme */
          border: 1px solid rgba(255, 255, 255, 0.05);
          box-shadow: none;
          cursor: pointer;
          transition: transform var(--transition-smooth), box-shadow var(--transition-smooth), background var(--transition-smooth);
          outline: none;
        }

        .emoji-btn:hover:not(.visually-disabled) {
          transform: translateY(-4px) scale(1.03);
          box-shadow: 0 12px 24px rgba(0,0,0,0.15);
          background: rgba(255, 255, 255, 0.1);
          border-color: rgba(255, 255, 255, 0.1);
        }

        .emoji-btn.active {
          border-color: #3b82f6;
          background: rgba(59, 130, 246, 0.1);
          box-shadow: none;
          transform: scale(1.05);
        }

        .emoji-btn.active .label {
          color: #3b82f6;
          font-weight: 700;
        }

        .emoji-btn:active:not(.visually-disabled) {
          transform: translateY(0) scale(0.95);
          transition: transform 0.1s ease;
        }

        .bouncing .emoji {
          animation: bounceClick 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        }

        .visually-disabled {
          opacity: 0.6;
          cursor: not-allowed;
          filter: grayscale(100%);
        }

        .emoji {
          font-size: 3.5rem;
          line-height: 1;
          filter: drop-shadow(0 4px 6px rgba(0,0,0,0.05));
          display: inline-block;
          transform-origin: center bottom;
        }

        .label {
          font-size: 1rem;
          font-weight: 500;
          color: var(--text-primary);
        }
        
        @media (max-width: 480px) {
          .emoji-container {
             gap: 0.75rem;
          }
          .emoji-btn {
             padding: 1rem 0.5rem;
          }
          .emoji {
             font-size: 2.5rem;
          }
        }
      `}</style>
    </div>
  );
}
