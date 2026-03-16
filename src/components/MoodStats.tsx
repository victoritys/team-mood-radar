"use client";

import React from "react";

interface MoodStatsProps {
  stats: {
    good: number;
    neutral: number;
    bad: number;
    total: number;
  };
}

export const MoodStats: React.FC<MoodStatsProps> = ({ stats }) => {
  return (
    <div className="stats-container">
      <div className="total-responses">
        Total responses: <strong>{stats.total}</strong>
      </div>
      <div className="distribution">
        <div className="stat-card">
          <span className="emoji">😊</span>
          <span className="count">{stats.good}</span>
        </div>
        <div className="stat-card">
          <span className="emoji">😐</span>
          <span className="count">{stats.neutral}</span>
        </div>
        <div className="stat-card">
          <span className="emoji">😡</span>
          <span className="count">{stats.bad}</span>
        </div>
      </div>
      
    </div>
  );
};
