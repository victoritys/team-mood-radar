"use client";

import React from "react";

interface TemperatureBarProps {
  score: number;
}

export const TemperatureBar: React.FC<TemperatureBarProps> = ({ score }) => {
  // Map score (-1 to 1) to progress (0% to 100%)
  const percentage = ((score + 1) / 2) * 100;

  const getStatusColor = () => {
    if (score > 0.4) return "#10b981"; // Happy - Green
    if (score >= 0.1) return "#3b82f6"; // Okay - Blue
    if (score >= -0.1) return "#f59e0b"; // Unstable - Amber
    return "#ef4444"; // Burnout risk - Red
  };

  const getStatusLabel = () => {
    if (score > 0.4) return "Team is happy";
    if (score >= 0.1) return "Team is okay";
    if (score >= -0.1) return "Team unstable";
    return "Burnout risk";
  };

  return (
    <div className="temp-container">
      <div className="temp-header">
        <span className="temp-label">Team Temperature</span>
        <span className="temp-status" style={{ color: getStatusColor() }}>
          {getStatusLabel()}
        </span>
      </div>
      <div className="progress-bg">
        <div
          className="progress-fill"
          style={{
            width: `${percentage}%`,
            backgroundColor: getStatusColor()
          }}
        />
      </div>
      <div className="temp-markers">
        <span>😡</span>
        <span>😐</span>
        <span>😊</span>
      </div>
      
    </div>
  );
};
