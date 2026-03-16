"use client";

import React from "react";

interface HistoryData {
  date: string;
  score: number;
}

interface MoodChartProps {
  data: HistoryData[];
}

export const MoodChart: React.FC<MoodChartProps> = ({ data }) => {
  if (data.length === 0) return <div>No history data available</div>;

  const width = 400;
  const height = 150;
  const padding = 20;

  // Calculate points
  const points = data.map((d, i) => {
    const x = (i / (data.length - 1 || 1)) * (width - 2 * padding) + padding;
    // score is -1 to 1, map to height
    const y = ((1 - d.score) / 2) * (height - 2 * padding) + padding;
    return `${x},${y}`;
  }).join(" ");

  return (
    <div className="chart-container">
      <h3>Last 7 Days Mood History</h3>
      <svg width="100%" height={height} viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="none">
        {/* Baseline */}
        <line x1={padding} y1={height / 2} x2={width - padding} y2={height / 2} stroke="#e5e7eb" strokeWidth="1" />

        {/* Polyline for history */}
        <polyline
          fill="none"
          stroke="#3b82f6"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
          points={points}
        />

        {/* Data points */}
        {data.map((d, i) => {
          const x = (i / (data.length - 1 || 1)) * (width - 2 * padding) + padding;
          const y = ((1 - d.score) / 2) * (height - 2 * padding) + padding;
          return (
            <circle key={i} cx={x} cy={y} r="4" fill="#3b82f6" />
          );
        })}
      </svg>
      <div className="labels">
        <span>{data[0]?.date}</span>
        <span>{data[data.length - 1]?.date}</span>
      </div>
      
    </div>
  );
};
