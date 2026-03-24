"use client";

import React, { useState } from "react";

type TeamOnboardingProps = {
  onJoin: (teamId: string) => void;
  disabled?: boolean;
};

export function TeamOnboarding({ onJoin, disabled }: TeamOnboardingProps) {
  const [teamName, setTeamName] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (teamName.trim()) {
      onJoin(teamName.trim());
    }
  };

  return (
    <div className="saas-card selection-card fade-in">
      <div className="header-flex">
        <div>
          <h1 className="title">Welcome!</h1>
          <p className="subtitle">Let's get started by joining your team</p>
        </div>
      </div>

      <div className="content-wrapper">
        <h2 className="question">What is your team's name?</h2>
        
        <form onSubmit={handleSubmit} className="team-form">
          <input 
            type="text" 
            value={teamName}
            onChange={(e) => setTeamName(e.target.value)}
            placeholder="Team name"
            className="team-input"
            autoFocus
            disabled={disabled}
            maxLength={50}
          />
          <button 
            type="submit" 
            className="submit-btn"
            disabled={disabled || !teamName.trim()}
          >
            Create Team
          </button>
        </form>
      </div>

      <style jsx>{`
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

        .content-wrapper {
          text-align: center;
          padding: 1rem 0 2rem;
        }

        .question {
          font-size: 1.5rem;
          color: var(--text-primary);
          margin-bottom: 2rem;
          font-weight: 500;
        }
        
        .team-form {
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
          align-items: center;
          width: 100%;
          max-width: 320px;
          margin: 0 auto;
        }
        
        .team-input {
          width: 100%;
          padding: 1rem 1.25rem;
          border-radius: 12px;
          border: 1px solid rgba(255, 255, 255, 0.1);
          background: rgba(0, 0, 0, 0.2);
          color: white;
          font-size: 1.1rem;
          outline: none;
          transition: border-color 0.2s, box-shadow 0.2s;
        }
        
        .team-input:focus {
          border-color: #3b82f6;
          box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.25);
        }
        
        .team-input::placeholder {
          color: rgba(255, 255, 255, 0.3);
        }
        
        .submit-btn {
          width: 100%;
          padding: 1rem 1.25rem;
          border-radius: 12px;
          border: none;
          background: #3b82f6;
          color: white;
          font-size: 1.05rem;
          font-weight: 600;
          cursor: pointer;
          transition: background-color 0.2s, transform 0.1s;
        }
        
        .submit-btn:hover:not(:disabled) {
          background: #2563eb;
          transform: translateY(-2px);
        }
        
        .submit-btn:active:not(:disabled) {
          transform: translateY(0);
        }
        
        .submit-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }
      `}</style>
    </div>
  );
}
