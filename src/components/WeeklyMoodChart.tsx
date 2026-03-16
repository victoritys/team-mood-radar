"use client";

import React from "react";

type WeeklyMoodChartProps = {
  data: { date: string; score: number | null; fullDate?: string }[]; 
  activeDate?: Date;
};

export function WeeklyMoodChart({ data, activeDate }: WeeklyMoodChartProps) {
  const [hoveredPoint, setHoveredPoint] = React.useState<any | null>(null);

  if (!data || data.length === 0) {
    return (
      <div className="saas-card chart-card fade-in">
        <h3 className="chart-title">Weekly results summary</h3>
        <div className="chart-empty">No activity data yet</div>
      </div>
    );
  }

  const paddingX = 28; // Increased gap between numbers by 4px (from 40 to 44)
  const paddingYTop = 15; 
  const paddingYBottom = 15; // Restored balance
  const usableWidth = 320 - paddingX * 2;
  const usableHeight = 180 - paddingYTop - paddingYBottom; // SVG height back to 180

  const points = data.map((d, i) => {
    const x = paddingX + (i / Math.max(1, data.length - 1)) * usableWidth;
    let y = paddingYTop + (usableHeight / 2); 
    let displayScore: string | number = "No data";
    
    if (d.score !== null) {
      const normalizedScore = (d.score + 1) / 2;
      y = paddingYTop + (1 - normalizedScore) * usableHeight;
      displayScore = Math.round(normalizedScore * 100) + "%";
    }
    
    return { 
      x, y, 
      label: d.date.split('/')[1], 
      fullDate: d.fullDate, 
      score: d.score, 
      displayScore 
    };
  });

  const activeDateStr = activeDate?.toISOString().split('T')[0];
  const activePoint = points.find(p => p.fullDate === activeDateStr);

  const getPath = (points: any[]) => {
    const validPoints = points.filter(p => p.score !== null);
    if (validPoints.length === 0) return "";
    let path = `M ${validPoints[0].x} ${validPoints[0].y}`;
    for (let i = 1; i < validPoints.length; i++) {
      path += ` L ${validPoints[i].x} ${validPoints[i].y}`;
    }
    return path;
  };

  return (
    <div className="saas-card chart-card fade-in" style={{ animationDelay: '0.4s' }}>
      <div className="header-flex">
        <div className="title-wrapper">
          <h3 className="title">Weekly results summary</h3>
          <p className="subtitle">Track your team's mood over the week</p>
        </div>
      </div>
      
      <div className="svg-container">
        <svg viewBox="0 0 320 180" width="100%" height="100%" preserveAspectRatio="xMidYMid meet">
          {/* Axis Labels */}
          {points.map((p, i) => (
              <text 
                key={i} 
                x={p.x} 
                y={155} /* Brought much closer to the points (usableHeight ends at 165) */
                textAnchor="middle" 
                fontSize="11" 
                fill="var(--text-muted)"
                fontWeight="500"
              >
                {p.label}
              </text>
           ))}
           
           {/* Connected Line */}
           <path 
             d={getPath(points)} 
             fill="none" 
             stroke="#3b82f6" 
             strokeWidth="3"
             strokeLinejoin="round"
             strokeLinecap="round"
             opacity="0.4"
           />

           {/* Points */}
           {points.map((p, i) => {
             // Dynamic color based on score (mood temperature)
             let pColor = "#3b82f6"; // Default blue
             if (p.score !== null) {
               if (p.score > 0.3) pColor = "#4ade80"; // var(--green)
               else if (p.score < -0.3) pColor = "#f87171"; // var(--red)
               else pColor = "#f59e0b"; // var(--yellow/amber)
             }

             return (
               <g key={i}>
                 <circle 
                   cx={p.x} 
                   cy={p.y} 
                   r={p.score === null ? "3" : "4"} 
                   fill={p.score === null ? "rgba(255,255,255,0.1)" : pColor}
                   stroke={p.score === null ? "rgba(255,255,255,0.05)" : "rgba(255,255,255,0.2)"}
                   strokeWidth="2"
                 />
                 {/* Hit area for tooltips */}
                 <rect 
                   x={p.x - 15} 
                   y={0} 
                   width="30" 
                   height="180" 
                   fill="transparent"
                   onMouseEnter={() => setHoveredPoint(p)}
                   onMouseLeave={() => setHoveredPoint(null)}
                   style={{ cursor: 'pointer' }}
                 />
               </g>
             );
           })}洞察
           
           {/* Tooltip / Highlighting */}
           {(() => {
             const target = hoveredPoint || activePoint;
             if (!target) return null;
             
             const isNoData = target.score === null;
             const boxWidth = isNoData ? 60 : 44;
             
             let statusColor = "#3b82f6"; // Default blue
             if (!isNoData) {
               if (target.score > 0.3) statusColor = "#4ade80"; // var(--green)
               else if (target.score < -0.3) statusColor = "#f87171"; // var(--red)
               else statusColor = "#f59e0b"; // var(--yellow/amber)
             }
             
             return (
               <g className="tooltip-group" style={{ pointerEvents: 'none' }}>
                 <rect 
                   x={target.x - boxWidth/2} 
                   y={target.y - 18} /* Closer to point (from -32) */
                   width={boxWidth} 
                   height="22" 
                   rx="11" 
                   fill={isNoData ? "rgba(255,255,255,0.1)" : statusColor} 
                 />
                 <text 
                   x={target.x} 
                   y={target.y - 3} /* Closer to point (from -17) */
                   textAnchor="middle" 
                   fill="white" 
                   fontSize={isNoData ? "10" : "12"}
                   fontWeight="700"
                 >
                   {target.displayScore}
                 </text>
               </g>
             );
           })()}
        </svg>
      </div>

      <style jsx>{`
        .chart-card {
          width: 100%;
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
          padding: 1.5rem; /* Equalized top and bottom padding to 1.5rem */
          height: auto;
          min-height: 200px;
        }

        @media (max-width: 480px) {
          .chart-card {
            min-height: auto;
          }
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
          font-size: 1.15rem; /* Standardized */
          line-height: 1.2;
          color: var(--text-primary);
          margin: 0;
        }
        
        .subtitle {
          font-size: 0.8rem; /* Matched to Temperature */
          line-height: 1.2;
          color: var(--text-muted);
          margin: 0;
          margin-top: 7px; /* Increased (+6px) from 1px */
        }

        .svg-container {
          width: 100%;
          flex-grow: 1;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .chart-empty {
          flex-grow: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--text-muted);
          font-size: 0.9rem;
        }
        
        .tooltip-group {
          filter: drop-shadow(0 4px 8px rgba(0,0,0,0.3));
        }

        svg {
          overflow: visible;
        }
      `}</style>
    </div>
  );
}
