"use client";

import React from "react";
import { Settings, LogOut } from "lucide-react";
import { EmojiMoodButtons } from "./EmojiMoodButtons";
import { HorizontalCalendar } from "./HorizontalCalendar";

type MoodSelectionCardProps = {
  onSelect: (mood: number) => void;
  onDateSelect?: (date: Date) => void;
  disabled?: boolean;
  selectedMood?: number | null;
  activeDate?: Date;
  teamName?: string;
  onChangeTeam?: () => void;
  onLeaveTeam?: () => void;
};

export function MoodSelectionCard({ onSelect, onDateSelect, disabled, selectedMood, activeDate, teamName, onChangeTeam, onLeaveTeam }: MoodSelectionCardProps) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const launchDate = new Date('2026-03-16');
  launchDate.setHours(0, 0, 0, 0);

  const isToday = activeDate?.toDateString() === today.toDateString();
  const isLocked = activeDate && activeDate.getTime() < launchDate.getTime();
  const displayDate = activeDate?.toLocaleDateString('en-US', { day: 'numeric', month: 'long' });
  
  return (
    <div className="saas-card selection-card fade-in">
      <div className="header-flex">
        <div>
          <h1 className="title">{teamName ? `${teamName} Check-in` : isToday ? "Daily Check-in" : `Reviewing ${displayDate}`}</h1>
          <p className="subtitle">{isToday ? "Let's make this day productive" : `Mood radar for ${displayDate}`}</p>
        </div>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          {onChangeTeam && (
            <button onClick={onChangeTeam} className="icon-btn" disabled={disabled} title="Team Settings">
              <Settings size={20} />
            </button>
          )}
          {onLeaveTeam && (
            <button onClick={onLeaveTeam} className="icon-btn" disabled={disabled} title="Leave Team">
              <LogOut size={20} />
            </button>
          )}
        </div>
      </div>

      <HorizontalCalendar onDateSelect={onDateSelect} selectedDate={activeDate} />

      <div className="content-wrapper">
        <h2 className="question">{selectedMood !== null ? "Your mood for this day" : "How do you feel?"}</h2>
        <EmojiMoodButtons onSelect={onSelect} disabled={disabled || isLocked} selectedMood={selectedMood} />
        
        {isToday && selectedMood !== null && (
          <p className="already-voted-msg fade-in">
            Your mood for today has already been selected. You can update it again tomorrow
          </p>
        )}

        {isLocked && selectedMood === null && (
          <p className="already-voted-msg fade-in">
            You can no longer vote for previous dates
          </p>
        )}
      </div>

      <style jsx>{`
        .already-voted-msg {
          margin-top: 1.5rem;
          color: var(--text-muted);
          font-size: 0.9rem;
          line-height: 1.5;
          max-width: 320px;
          margin-left: auto;
          margin-right: auto;
        }
        .selection-card {
          width: 100%;
          max-width: 600px;
          margin: 0 auto;
        }

        .header-flex {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 2rem;
        }

        .title {
          font-size: 1.5rem;
          font-weight: 600;
          color: var(--text-primary);
        }
        
        .subtitle {
          font-size: 0.95rem;
          color: var(--text-muted);
          margin-top: 0.25rem;
        }

        .icon-btn {
          width: 36px;
          height: 36px;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.1);
          border: 1px solid rgba(255, 255, 255, 0.05);
          color: white;
          font-size: 1.25rem;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: transform 0.2s, background 0.2s;
        }

        .icon-btn:hover:not(:disabled) {
          transform: scale(1.05);
          background: rgba(255, 255, 255, 0.2);
        }
        
        .icon-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .content-wrapper {
          text-align: center;
          padding: 1rem 0 2rem;
        }

        .question {
          font-size: 1.5rem;
          color: var(--text-primary);
          margin-bottom: 1rem;
          font-weight: 500;
        }
      `}</style>
    </div>
  );
}
