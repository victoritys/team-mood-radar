"use client";

import React from "react";

type TeamWeatherIndicatorProps = {
  score: number; // Range between -1 and 1
};

export function TeamWeatherIndicator({ score }: TeamWeatherIndicatorProps) {
  let weather = { icon: "⛅", label: "Cloudy", desc: "Things are somewhat gloomy" };

  if (score > 0.5) weather = { icon: "☀️", label: "Sunny", desc: "The team is shining and highly positive" };
  else if (score > 0) weather = { icon: "🌤️", label: "Partly Sunny", desc: "Feeling mostly good today" };
  else if (score < -0.5) weather = { icon: "⛈️", label: "Stormy", desc: "High stress or negative sentiment detected" };
  else if (score < 0) weather = { icon: "🌧️", label: "Rainy", desc: "A bit under the weather" };

  return (
    <div className="saas-card weather-card fade-in" style={{ animationDelay: '0.2s' }}>
      <div className="header-flex">
        <div className="title-wrapper">
          <h3 className="title">Atmosphere</h3>
          <p className="subtitle">Overall emotional weather</p>
        </div>
        <div className="icon-pill">
          {weather.icon}
        </div>
      </div>
      
      <div className="weather-display">
        <h4 className="label">{weather.label}</h4>
        <p className="desc">{weather.desc}</p>
      </div>

      <style jsx>{`
        .weather-card {
          width: 100%;
          display: flex;
          flex-direction: column;
          gap: 0.5rem; /* Reduced to compensate for top padding increase */
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

        .icon-pill {
          width: 36px;
          height: 36px;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.1);
          font-size: 1.25rem;
          display: flex;
          align-items: center;
          justify-content: center;
          animation: float 6s ease-in-out infinite;
        }

        .weather-display {
          display: flex;
          flex-direction: column;
          gap: 0;
          margin-top: calc(0.5rem + 10px); /* Lowered additional 6px (total 10px) */
        }

        .label {
          font-size: 1rem;
          font-weight: 600;
          line-height: 1;
          color: var(--text-primary);
          margin: 0;
        }

        .desc {
          color: var(--text-muted);
          font-size: 0.8rem;
          line-height: 1.2;
          margin: 0;
          margin-top: 6px; /* Offset to align perfectly with Temperature labels */
        }

        @keyframes float {
          0% { transform: translateY(0px); }
          50% { transform: translateY(-3px); }
          100% { transform: translateY(0px); }
        }
      `}</style>
    </div>
  );
}
