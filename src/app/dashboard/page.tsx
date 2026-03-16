"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { MoodStats } from "@/components/MoodStats";
import { TemperatureBar } from "@/components/TemperatureBar";
import { MoodChart } from "@/components/MoodChart";
import Link from "next/link";
import { AlertCircle } from "lucide-react";

export default function Dashboard() {
  const [stats, setStats] = useState({ good: 0, neutral: 0, bad: 0, total: 0 });
  const [score, setScore] = useState(0);
  const [history, setHistory] = useState<any[]>([]);
  const [burnoutRisk, setBurnoutRisk] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        // Today's stats
        const startOfToday = new Date();
        startOfToday.setHours(0, 0, 0, 0);

        const { data: todayData, error: todayError } = await supabase
          .from("moods")
          .select("mood")
          .gte("created_at", startOfToday.toISOString());

        if (todayError) throw todayError;

        const counts = { good: 0, neutral: 0, bad: 0, total: 0 };
        let sum = 0;

        todayData?.forEach(m => {
          counts.total++;
          sum += m.mood;
          if (m.mood === 1) counts.good++;
          else if (m.mood === 0) counts.neutral++;
          else if (m.mood === -1) counts.bad++;
        });

        const todayScore = counts.total > 0 ? sum / counts.total : 0;
        setStats(counts);
        setScore(todayScore);

        // Burnout risk detection logic
        const badRatio = counts.total > 0 ? counts.bad / counts.total : 0;

        // History for last 7 days
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

        const { data: historyData, error: historyError } = await supabase
          .from("moods")
          .select("mood, created_at")
          .order("created_at", { ascending: true });

        if (historyError) throw historyError;

        // Group by day for chart
        const grouped = historyData?.reduce((acc: any, curr) => {
          const date = curr.created_at.split('T')[0];
          if (!acc[date]) acc[date] = { sum: 0, count: 0 };
          acc[date].sum += curr.mood;
          acc[date].count++;
          return acc;
        }, {});

        const historyChartData = Object.entries(grouped || {}).map(([date, val]: any) => ({
          date: date.split('-').slice(1).join('/'),
          score: val.sum / val.count
        }));

        setHistory(historyChartData);

        // More than 30% responses are bad or last 3 days average < -0.1
        const last3Days = historyChartData.slice(-3);
        const avg3Days = last3Days.length > 0
          ? last3Days.reduce((a, b: any) => a + b.score, 0) / last3Days.length
          : 0;

        if (badRatio > 0.3 || (last3Days.length >= 3 && avg3Days < -0.1)) {
          setBurnoutRisk(true);
        }

      } catch (err) {
        console.error("Error fetching dashboard data:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  if (loading) {
    return <main><div>Loading stats...</div></main>;
  }

  return (
    <main className="dashboard-main">
      <div className="container">
        <div className="header">
          <Link href="/" className="back-link">← Back</Link>
          <h1>Team Mood Stats</h1>
        </div>

        {burnoutRisk && (
          <div className="burnout-alert">
            <AlertCircle size={20} />
            <span>⚠ Burnout risk detected</span>
          </div>
        )}

        <div className="dashboard-cards">
          <section className="card">
            <h2>Today's Overview</h2>
            <MoodStats stats={stats} />
            <TemperatureBar score={score} />
          </section>

          <section className="card">
            <MoodChart data={history} />
          </section>
        </div>
      </div>

      
    </main>
  );
}
