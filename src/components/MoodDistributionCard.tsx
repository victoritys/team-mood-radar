"use client";

import React from "react";

type MoodDistributionCardProps = {
  stats: { good: number; neutral: number; bad: number; total: number };
};

export function MoodDistributionCard({ stats }: MoodDistributionCardProps) {
  return (
    <div className="saas-card distribution-card fade-in" style={{ animationDelay: '0.3s' }}>
      <div className="header-flex">
        <div className="title-wrapper">
          <h3 className="title">Distribution</h3>
          <p className="subtitle">Today's breakdown</p>
        </div>
      </div>
      
      <div className="distribution-list">
        <div className="list-item">
          <div className="item-info">
            <span className="emoji">😊</span>
            <div className="text-cols">
              <span className="item-title">Good</span>
              <span className="item-desc">Feeling great</span>
            </div>
          </div>
          <div className="count-badge" style={{ background: 'rgba(74, 222, 128, 0.2)', color: 'var(--green)' }}>{stats.good}</div>
        </div>
        
        <div className="list-item">
          <div className="item-info">
            <span className="emoji">😐</span>
            <div className="text-cols">
              <span className="item-title">Neutral</span>
              <span className="item-desc">Doing okay</span>
            </div>
          </div>
          <div className="count-badge" style={{ background: 'rgba(251, 191, 36, 0.2)', color: 'var(--yellow)' }}>{stats.neutral}</div>
        </div>

        <div className="list-item">
          <div className="item-info">
            <span className="emoji">😡</span>
            <div className="text-cols">
              <span className="item-title">Bad</span>
              <span className="item-desc">Needs support</span>
            </div>
          </div>
          <div className="count-badge" style={{ background: 'rgba(248, 113, 113, 0.2)', color: 'var(--red)' }}>{stats.bad}</div>
        </div>
      </div>

      <style jsx>{`
        .distribution-card {
          width: 100%;
          height: auto;
          min-height: 180px;
          display: flex;
          flex-direction: column;
          gap: 0.5rem; 
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

        /* ... */

        .distribution-list {
          display: flex;
          flex-direction: column;
          gap: 1.1rem; /* Increased (+8px) from 0.6rem */
        }

        .list-item {
          display: flex;
          align-items: center; /* Better alignment for compact */
          justify-content: space-between;
        }
        
        .item-info {
          display: flex;
          align-items: flex-start;
          gap: 10px;
        }

        .emoji {
          font-size: 1.35rem; 
          line-height: 1;
          margin-top: -1px; /* Optical adjustment to align with text top */
        }

        .text-cols {
          display: flex;
          flex-direction: column;
        }

        .item-title {
          font-size: 0.95rem;
          font-weight: 600;
          color: var(--text-primary);
          line-height: 1.2;
        }
        
        .item-desc {
          font-size: 0.8rem;
          color: var(--text-muted);
        }

        .count-badge {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 600;
          font-size: 0.9rem;
          margin-top: 2px;
        }

        @media (max-width: 480px) {
          .distribution-card {
            min-height: auto;
          }
        }
      `}</style>
    </div>
  );
}
