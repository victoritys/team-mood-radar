"use client";

import React, { useEffect, useState } from "react";

type TeamTemperatureBarProps = {
  score: number; // Range between -1 and 1
};

export function TeamTemperatureBar({ score }: TeamTemperatureBarProps) {
  const [currentProgress, setCurrentProgress] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      setCurrentProgress(((score + 1) / 2) * 100);
    }, 150);
    return () => clearTimeout(timer);
  }, [score]);

  let statusText = "Okay";
  let statusColor = "var(--yellow)";
  let bgColor = "rgba(251, 191, 36, 0.2)"; // Soft yellow bg

  if (score > 0.3) {
    statusText = "Happy";
    statusColor = "var(--green)";
    bgColor = "rgba(74, 222, 128, 0.2)"; // Soft green bg
  } else if (score < -0.3) {
    statusText = score < -0.6 ? "Burnout risk" : "Unstable";
    statusColor = "var(--red)";
    bgColor = "rgba(248, 113, 113, 0.2)"; // Soft red bg
  }

  return (
    <div className="saas-card temperature-card fade-in" style={{ animationDelay: '0.1s' }}>
      <div className="header-flex">
        <div className="title-wrapper">
          <h3 className="title">Temperature</h3>
          <p className="subtitle">Current team energy</p>
        </div>
        <div className="status-badge" style={{ backgroundColor: statusColor, color: 'white' }}>
          {statusText}
        </div>
      </div>

      <div className="track-container">
        <div className="track-bg">
          <div 
            className="track-fill" 
            style={{ 
              width: `${currentProgress}%`,
              backgroundColor: statusColor,
            }} 
          />
          <div 
             className="indicator-dot"
             style={{ 
               left: `${currentProgress}%`,
               backgroundColor: statusColor,
             }}
          />
        </div>
        <div className="labels" style={{ color: 'white' }}>
          <span>0</span>
          <span>50</span>
          <span>100</span>
        </div>
      </div>

      <style jsx>{`
        .temperature-card {
          width: 100%;
          display: flex;
          flex-direction: column;
          gap: 1rem;
          padding: 1.5rem; /* Equalized top and bottom padding to 1.5rem */
        }

        .header-flex {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          width: 100%;
        }

        .title-wrapper {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          text-align: left;
          margin: 0;
          padding: 0;
        }

        .title {
          font-size: 1.15rem;
          line-height: 1.2;
          color: var(--text-primary);
          margin: 0;
        }
        
        .subtitle {
          font-size: 0.8rem;
          line-height: 1.2;
          color: var(--text-muted);
          margin: 0;
          margin-top: 7px; /* Increased (+6px) from 1px */
        }

        .status-badge {
          padding: 0.3rem 0.7rem;
          border-radius: 999px;
          font-size: 0.8rem;
          font-weight: 700;
          transition: background-color 0.5s, color 0.5s;
        }

        .track-container {
          padding: 0.5rem 0;
        }

        .track-bg {
          height: 10px;
          background: rgba(255, 255, 255, 0.1);
          border-radius: 999px;
          position: relative;
          margin-bottom: 0.75rem;
        }
        
        .track-fill {
          height: 10px;
          border-radius: 999px;
          position: absolute;
          top: 0;
          left: 0;
          transition: width 1s cubic-bezier(0.25, 1, 0.5, 1), background-color 0.5s ease;
        }

        .indicator-dot {
          width: 16px;
          height: 16px;
          border-radius: 50%;
          position: absolute;
          top: 50%;
          transform: translate(-50%, -50%);
          border: 3px solid white;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
          transition: left 1s cubic-bezier(0.25, 1, 0.5, 1), background-color 0.5s ease;
        }

        .labels {
          display: flex;
          justify-content: space-between;
          font-size: 0.8rem;
          color: var(--text-muted);
          font-weight: 500;
        }
      `}</style>
    </div>
  );
}
