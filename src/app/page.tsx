"use client";

import { useState, useEffect } from "react";
import { Settings, LogOut } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { TeamOnboarding } from "@/components/TeamOnboarding";
import { TeamSettingsModal } from "@/components/TeamSettingsModal";
import { MoodSelectionCard } from "@/components/MoodSelectionCard";
import { TeamTemperatureBar } from "@/components/TeamTemperatureBar";
import { TeamWeatherIndicator } from "@/components/TeamWeatherIndicator";
import { MoodDistributionCard } from "@/components/MoodDistributionCard";
import { WeeklyMoodChart } from "@/components/WeeklyMoodChart";

export default function Home() {
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [teamId, setTeamId] = useState<string | null>(null);
  const [isCreator, setIsCreator] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  
  // Dashboard state
  const [stats, setStats] = useState({ good: 0, neutral: 0, bad: 0, total: 0 });
  const [score, setScore] = useState(0);
  const [history, setHistory] = useState<any[]>([]);
  const [viewDate, setViewDate] = useState(new Date());
  const [userMood, setUserMood] = useState<number | null>(null);

  useEffect(() => {
    const initialize = async () => {
      let sessionId = typeof window !== "undefined" ? localStorage.getItem("mood_session_id") : null;
      if (!sessionId) {
        sessionId = Math.random().toString(36).substring(2, 15);
        localStorage.setItem("mood_session_id", sessionId);
      }

      let resolvedTeamId = null;

      if (typeof window !== "undefined") {
        try {
          const searchParams = new URLSearchParams(window.location.search);
          const inviteFromUrl = searchParams.get('invite');
          
          if (inviteFromUrl) {
            const { data, error } = await supabase.from('teams').select('name, admin_secret').eq('invite_code', inviteFromUrl).maybeSingle();
            if (data && data.name) {
              const mySecret = localStorage.getItem("mood_admin_secret");
              const isActuallyCreator = !!(mySecret && mySecret === data.admin_secret);

              localStorage.setItem("mood_team_id", data.name);
              localStorage.setItem("mood_is_creator", isActuallyCreator ? "true" : "false");
              setTeamId(data.name);
              setIsCreator(isActuallyCreator);
              resolvedTeamId = data.name;
            } else {
              alert("This invite link is invalid or has expired.");
            }
            window.history.replaceState({}, document.title, window.location.pathname);
          } else {
            const storedTeamId = localStorage.getItem("mood_team_id");
            const storedIsCreator = localStorage.getItem("mood_is_creator");
            if (storedTeamId) {
              setTeamId(storedTeamId);
              setIsCreator(storedIsCreator === "true");
              resolvedTeamId = storedTeamId;
            }
          }
        } catch (e) {
          console.error("URL parse error", e);
        }
      }

      if (resolvedTeamId) {
        await fetchDashboardData(viewDate, resolvedTeamId);
      } else {
        setLoading(false);
      }
    };

    initialize();
  }, []);

  const fetchDashboardData = async (date?: Date, explicitTeamId?: string | null) => {
    const targetDate = date || viewDate;
    setLoading(true);
    try {
      const startOfDay = new Date(targetDate);
      startOfDay.setHours(0, 0, 0, 0);
      const endOfDay = new Date(targetDate);
      endOfDay.setHours(23, 59, 59, 999);

      const currentTeamId = explicitTeamId || (typeof window !== 'undefined' ? localStorage.getItem("mood_team_id") : null);
      if (!currentTeamId) {
        setLoading(false);
        return;
      }

      // Fetch data for the specific day
      const { data: dayData, error: dayError } = await supabase
        .from("moods")
        .select("mood")
        .eq("team_id", currentTeamId)
        .gte("created_at", startOfDay.toISOString())
        .lte("created_at", endOfDay.toISOString());

      // Fetch user's specific mood for this day
      const sessionId = typeof window !== 'undefined' ? localStorage.getItem("mood_session_id") : null;
      let userData = null;
      let userError = null;

      if (sessionId) {
        const { data, error } = await supabase
          .from("moods")
          .select("mood")
          .eq("session_id", sessionId)
          .eq("team_id", currentTeamId)
          .gte("created_at", startOfDay.toISOString())
          .lte("created_at", endOfDay.toISOString())
          .order("created_at", { ascending: false })
          .limit(1);
        
        userData = data?.[0];
        userError = error;
      }

      if (userError) console.warn("Note: Error fetching specific user mood:", userError);
      
      const foundMood = userData?.mood ?? null;
      setUserMood(foundMood);

      // Only set hasSubmitted based on today's DB record for THIS specific team
      const todayStr = new Date().toISOString().split('T')[0];
      const targetDateStr = targetDate.toISOString().split('T')[0];
      if (targetDateStr === todayStr) {
        setHasSubmitted(foundMood !== null);
      }

      if (dayError) throw dayError;

      const counts = { good: 0, neutral: 0, bad: 0, total: 0 };
      let sum = 0;

      dayData?.forEach(m => {
        counts.total++;
        sum += m.mood;
        if (m.mood === 1) counts.good++;
        else if (m.mood === 0) counts.neutral++;
        else if (m.mood === -1) counts.bad++;
      });

      setStats(counts);
      setScore(counts.total > 0 ? sum / counts.total : 0);

      // Fetch history (7 days ending at viewDate)
      const weekEnd = new Date(viewDate);
      const weekStart = new Date(viewDate);
      weekStart.setDate(weekStart.getDate() - 6);
      weekStart.setHours(0, 0, 0, 0);

      const { data: historyData, error: historyError } = await supabase
        .from("moods")
        .select("mood, created_at")
        .eq("team_id", currentTeamId)
        .gte("created_at", weekStart.toISOString())
        .lte("created_at", weekEnd.toISOString())
        .order("created_at", { ascending: true });

      if (historyError) throw historyError;

      // Process history (7 days aggregated)
      const weeklyHistoryData = Array.from({ length: 7 }, (_, i) => {
        const d = new Date(weekStart);
        d.setDate(d.getDate() + i);
        const dayStart = new Date(d);
        dayStart.setHours(0, 0, 0, 0);
        const dayEnd = new Date(d);
        dayEnd.setHours(23, 59, 59, 999);
        
        const dayEntries = historyData?.filter(m => {
          const mDate = new Date(m.created_at);
          return mDate >= dayStart && mDate <= dayEnd;
        });

        const dayTotal = dayEntries?.length || 0;
        const daySum = dayEntries?.reduce((acc, m) => acc + m.mood, 0) || 0;
        const dayScore = dayTotal > 0 ? daySum / dayTotal : null;

        return {
          date: (d.getMonth() + 1).toString().padStart(2, '0') + '/' + d.getDate().toString().padStart(2, '0'),
          fullDate: d.toISOString().split('T')[0],
          score: dayScore
        };
      });

      setHistory(weeklyHistoryData);
    } catch (err) {
      console.error("Error fetching dashboard data:", (err as any)?.message || JSON.stringify(err));
    } finally {
      // Small delay for smooth UI transition
      setTimeout(() => setLoading(false), 300);
    }
  };

  const handleMoodSelect = async (mood: number) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const launchDate = new Date('2026-03-16');
    launchDate.setHours(0, 0, 0, 0);
    
    const isLocked = viewDate.getTime() < launchDate.getTime();
    const isToday = viewDate.toDateString() === today.toDateString();
    
    if (userMood !== null) {
      if (!isLocked) setHasSubmitted(true);
      return;
    }

    if (!isToday) return;

    setLoading(true);
    try {
      const currentTeamId = localStorage.getItem("mood_team_id");
      const sessionId = localStorage.getItem("mood_session_id");

      if (!currentTeamId) return;

      const { error: dbError } = await supabase.from("moods").insert({
        session_id: sessionId,
        mood: mood,
        team_id: currentTeamId
      });

      if (dbError) {
        console.error("DB Error details:", dbError);
        alert(`Failed to save check-in to database: ${dbError.message}`);
        throw dbError;
      }

      const todayStr = new Date().toISOString().split('T')[0];
      localStorage.setItem("last_mood_submission", todayStr);
      
      setHasSubmitted(true);
      await fetchDashboardData(viewDate, currentTeamId);
    } catch (err: any) {
      console.error("Failed to submit mood", err);
      alert("Failed to submit check-in! Check console.");
      setLoading(false);
    }
  };

  const handleDateSelect = async (date: Date) => {
    setLoading(true);
    setViewDate(date);
    
    // Lock dashboard access for dates before March 16
    const launchDate = new Date('2026-03-16');
    launchDate.setHours(0, 0, 0, 0);
    const isLocked = date.getTime() < launchDate.getTime();
    
    await fetchDashboardData(date);
    setHasSubmitted(!isLocked);
  };

  const handleReset = async () => {
    setLoading(true);
    const today = new Date();
    setViewDate(today);
    await fetchDashboardData(today);
    setHasSubmitted(false);
    setLoading(false);
  };

  const handleSaveTeam = async (newTeam: string) => {
    const adminSecret = localStorage.getItem("mood_admin_secret");
    if (adminSecret && newTeam !== teamId) {
      setLoading(true);
      const { error } = await supabase.from('teams').update({ name: newTeam }).eq('admin_secret', adminSecret);
      if (error) {
        alert("This team name might already be taken by someone else.");
        setLoading(false);
        return;
      }
    }

    localStorage.setItem("mood_team_id", newTeam);
    setTeamId(newTeam);
    // Reload to guarantee all state/history drops its current team context
    window.location.reload();
  };

  const handleLeaveTeam = () => {
    localStorage.removeItem("mood_team_id");
    localStorage.removeItem("mood_is_creator");
    localStorage.removeItem("mood_invite_code");
    localStorage.removeItem("mood_admin_secret");
    setTeamId(null);
    setIsCreator(false);
  };

  const handleCreateTeam = async (name: string) => {
    setLoading(true);
    try {
      // Check if team already exists
      const { data: existingTeam } = await supabase.from('teams').select('id, admin_secret, invite_code').eq('name', name).maybeSingle();
      
      if (existingTeam) {
        // Check if we are the creator who previously logged out
        const savedSecrets = JSON.parse(localStorage.getItem("mood_admin_secrets") || "{}");
        if (savedSecrets[name] === existingTeam.admin_secret) {
          // Restore admin session
          localStorage.setItem("mood_team_id", name);
          localStorage.setItem("mood_is_creator", "true");
          localStorage.setItem("mood_admin_secret", existingTeam.admin_secret);
          localStorage.setItem("mood_invite_code", existingTeam.invite_code);
          
          setTeamId(name);
          setIsCreator(true);
          if (hasSubmitted) fetchDashboardData();
          setLoading(false);
          return;
        }
        
        alert("This team name is already taken! Please ask the creator for an invite link, or choose a different name.");
        setLoading(false);
        return;
      }

      // Create new team securely
      const inviteCode = Math.random().toString(36).substring(2, 10);
      const { data: newTeam, error } = await supabase
        .from('teams')
        .insert([{ name, invite_code: inviteCode }])
        .select('admin_secret, invite_code')
        .single();
        
      if (error) throw error;

      // Remember that we own this team in case we log out
      const savedSecrets = JSON.parse(localStorage.getItem("mood_admin_secrets") || "{}");
      savedSecrets[name] = newTeam.admin_secret;
      localStorage.setItem("mood_admin_secrets", JSON.stringify(savedSecrets));

      localStorage.setItem("mood_team_id", name);
      localStorage.setItem("mood_is_creator", "true");
      localStorage.setItem("mood_invite_code", newTeam.invite_code);
      localStorage.setItem("mood_admin_secret", newTeam.admin_secret);
      
      setTeamId(name);
      setIsCreator(true);
      if (hasSubmitted) fetchDashboardData();
    } catch (err) {
      console.error(err);
      alert("Failed to create team. Please try again.");
    }
    setLoading(false);
  };

  if (loading && !hasSubmitted) {
    return (
      <main>
        <div className="loading-state fade-in animate-pulse" style={{ animationDelay: '0.2s' }}>
          <div className="spinner-dot"></div>
          <div className="spinner-dot"></div>
          <div className="spinner-dot"></div>
        </div>
        
      </main>
    );
  }

  const todayDate = viewDate.toLocaleDateString('en-US', { day: 'numeric', month: 'long' });

  return (
    <main>
      <div className="container">
        
        {!teamId ? (
          <TeamOnboarding 
            onJoin={handleCreateTeam} 
            disabled={loading && !hasSubmitted} 
          />
        ) : !hasSubmitted ? (
          <MoodSelectionCard 
            onSelect={handleMoodSelect} 
            onDateSelect={handleDateSelect}
            disabled={loading} 
            selectedMood={userMood}
            activeDate={viewDate}
            teamName={teamId || undefined}
            onChangeTeam={isCreator ? () => setIsSettingsOpen(true) : undefined}
            onLeaveTeam={handleLeaveTeam}
          />
        ) : (
          <div className="dashboard-layout fade-in">
             <header className="dashboard-header">
              <div className="title-area">
                <h1>{teamId} Dashboard</h1>
                <p>Let's make this day productive</p>
              </div>
              <div className="header-actions">
                <div className="date-label">{todayDate}</div>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <button 
                    onClick={handleReset} 
                    className="reset-btn"
                    disabled={loading}
                    title="Go back"
                    style={{ padding: '0.5rem 1rem' }}
                  >
                    {loading ? "..." : (
                      <>
                        <span className="btn-text">Check-in</span>
                        <span className="btn-icon">
                          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M19 12H5M12 19l-7-7 7-7"/>
                          </svg>
                        </span>
                      </>
                    )}
                  </button>
                  {isCreator && (
                    <button 
                      onClick={() => setIsSettingsOpen(true)} 
                      className="reset-btn"
                      disabled={loading}
                      title="Team Settings"
                      style={{ width: '36px', height: '36px', padding: 0, display: 'flex', justifyContent: 'center' }}
                    >
                      <Settings size={18} />
                    </button>
                  )}
                  <button 
                    onClick={handleLeaveTeam} 
                    className="reset-btn"
                    disabled={loading}
                    title="Leave Team"
                    style={{ width: '36px', height: '36px', padding: 0, display: 'flex', justifyContent: 'center' }}
                  >
                    <LogOut size={18} />
                  </button>
                </div>
              </div>
            </header>

            {loading ? (
               <div className="loading-overlay fade-in animate-pulse">
                 Updating dashboard...
               </div>
            ) : (
              <div className="grid-layout">
                <TeamTemperatureBar score={score} />
                <TeamWeatherIndicator score={score} />
                <MoodDistributionCard stats={stats} />
                <WeeklyMoodChart data={history} activeDate={viewDate} />
              </div>
            )}
          </div>
        )}
      </div>

      <TeamSettingsModal 
        isOpen={isSettingsOpen} 
        onClose={() => setIsSettingsOpen(false)} 
        currentTeam={teamId}
        inviteCode={typeof window !== "undefined" ? localStorage.getItem("mood_invite_code") : null}
        onSave={handleSaveTeam}
      />
    </main>
  );
}
