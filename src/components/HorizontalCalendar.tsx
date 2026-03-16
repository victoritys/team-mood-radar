"use client";

import React, { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export function HorizontalCalendar({ onDateSelect, selectedDate }: { onDateSelect?: (date: Date) => void, selectedDate?: Date }) {
  const [currentMonth, setCurrentMonth] = useState(selectedDate || new Date());
  const scrollRef = useRef<HTMLDivElement>(null);
  const today = new Date();

  const getDaysInMonth = (year: number, month: number) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const daysInMonth = getDaysInMonth(currentMonth.getFullYear(), currentMonth.getMonth());
  
  const days = Array.from({ length: daysInMonth }, (_, i) => {
    const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), i + 1);
    return {
      date,
      dayNumber: i + 1,
      // Use short day name e.g. Mon, Tue
      dayName: date.toLocaleDateString('en-US', { weekday: 'short' })
    };
  });

  const nextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
  };

  const prevMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
  };

  useEffect(() => {
    const scrollToDate = (dateToScroll: Date) => {
      if (scrollRef.current && days.length > 0) {
        const index = days.findIndex(d => 
          d.date.getDate() === dateToScroll.getDate() && 
          d.date.getMonth() === dateToScroll.getMonth() && 
          d.date.getFullYear() === dateToScroll.getFullYear()
        );
        
        if (index !== -1) {
          const containerWidth = scrollRef.current.clientWidth;
          const itemWidth = scrollRef.current.scrollWidth / days.length;
          
          // Scroll so the selected date is at the 2nd position (index 1)
          // Offset = itemWidth * (index - 1)
          scrollRef.current.scrollTo({
             left: itemWidth * Math.max(0, index - 1),
             behavior: 'smooth'
          });
        }
      }
    };

    // Scroll either to selectedDate (if in current view) or today
    const targetDate = selectedDate || today;
    if (currentMonth.getMonth() === targetDate.getMonth() && currentMonth.getFullYear() === targetDate.getFullYear()) {
      setTimeout(() => scrollToDate(targetDate), 100);
    } else if (!selectedDate) {
       // Only scroll to start if no selectedDate is driving the view
       if (scrollRef.current) scrollRef.current.scrollLeft = 0;
    }
  }, [currentMonth, selectedDate]);

  return (
    <div className="calendar-container fade-in">
      <div className="calendar-header">
        <button className="nav-btn group" onClick={prevMonth}>
          <ChevronLeft size={20} className="nav-icon" />
        </button>
        <span className="month-label">
          {currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
        </span>
        <button className="nav-btn group" onClick={nextMonth}>
          <ChevronRight size={20} className="nav-icon" />
        </button>
      </div>

      <div className="days-row" ref={scrollRef}>
        {days.map((day) => {
          const isToday = day.date.getDate() === today.getDate() && 
                          day.date.getMonth() === today.getMonth() && 
                          day.date.getFullYear() === today.getFullYear();
          
          const isSelected = selectedDate && 
                             day.date.getDate() === selectedDate.getDate() && 
                             day.date.getMonth() === selectedDate.getMonth() && 
                             day.date.getFullYear() === selectedDate.getFullYear();
          
          // Reset time part for safe comparison
          const compareDay = new Date(day.date);
          compareDay.setHours(0,0,0,0);
          const compareToday = new Date(today);
          compareToday.setHours(0,0,0,0);
          const isPastOrToday = compareDay <= compareToday;                          
                          
          return (
            <div 
              key={day.dayNumber} 
              className={`day-item ${isSelected ? 'active' : ''} ${isToday ? 'today' : ''} ${isPastOrToday ? 'clickable' : ''}`}
              onClick={() => {
                if (isPastOrToday && onDateSelect) {
                  onDateSelect(day.date);
                }
              }}
            >
              <span className="day-name">{day.dayName}</span>
              <div className="day-number">{day.dayNumber}</div>
            </div>
          );
        })}
      </div>

      <style jsx>{`
        .calendar-container {
          width: 100%;
          padding: 1rem 0;
          margin-bottom: 0.5rem;
          background: rgba(255, 255, 255, 0.05); /* Dark theme */
          border-radius: var(--radius-xl);
          display: flex;
          flex-direction: column;
        }

        .calendar-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1.5rem;
          padding: 0 1rem;
        }

        .nav-btn {
          background: rgba(255, 255, 255, 0.1);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 50%;
          width: 36px;
          height: 36px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          color: var(--text-primary);
          flex-shrink: 0;
          box-shadow: none;
        }

        :global(.nav-icon) {
          stroke-width: 2px;
          transition: stroke-width 0.2s;
        }

        .nav-btn:hover :global(.nav-icon) {
          stroke-width: 3px;
        }

        .month-label {
          font-weight: 600;
          color: var(--text-primary);
          font-size: 1.05rem;
        }

        .days-row {
          display: flex;
          overflow-x: auto;
          gap: 1px;
          padding: 0 0.75rem;
          scrollbar-width: none; /* Firefox */
          scroll-behavior: smooth;
        }
        
        .days-row::-webkit-scrollbar {
          display: none; /* Chrome/Safari */
        }

        .day-item {
          display: flex;
          flex-direction: column;
          align-items: center;
          /* 10 items in the viewport: 100% / 10 = 10% */
          flex: 0 0 10%;
          gap: 0.5rem;
        }

        .day-name {
          font-size: 0.85rem;
          color: var(--text-muted);
          font-weight: 500;
        }

        .day-number {
          width: 42px;
          height: 42px;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.1);
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 500;
          font-size: 1rem;
          color: var(--text-primary);
          box-shadow: 0 1px 3px rgba(0,0,0,0.2);
        }

        .day-item.today:not(.active) .day-number {
          border: 1.5px solid #3b82f6;
          background: transparent;
        }

        .day-item.active .day-number {
          background: #3b82f6; /* Bright blue accent */
          color: #ffffff;
          font-weight: 600;
          box-shadow: none;
        }
        
        .day-item.active .day-name {
          color: var(--text-primary);
          font-weight: 600;
        }

        .clickable .day-number {
          cursor: pointer;
          transition: background 0.2s, color 0.2s;
        }

        .clickable:hover .day-number {
          background: rgba(255,255,255,0.2);
        }

        .clickable.today:hover .day-number {
          background: #3b82f6; 
        }
      `}</style>
    </div>
  );
}
