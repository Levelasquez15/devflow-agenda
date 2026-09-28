import React, { createContext, useContext, useState, useEffect } from 'react';
import { INITIAL_ROADMAPS, INITIAL_SCHEDULE } from '../data/initialRoadmaps';
import { generateRoadmapWithAI, askAiTutor } from '../services/aiResearcherService';
import confetti from 'canvas-confetti';

const StudyContext = createContext(null);

export function StudyProvider({ children }) {
  // Load initial states from localStorage with fallbacks
  const [roadmaps, setRoadmaps] = useState(() => {
    const saved = localStorage.getItem('devflow_roadmaps');
    return saved ? JSON.parse(saved) : INITIAL_ROADMAPS;
  });

  const [schedule, setSchedule] = useState(() => {
    const saved = localStorage.getItem('devflow_schedule');
    return saved ? JSON.parse(saved) : INITIAL_SCHEDULE;
  });

  // AI & Settings state
  const [geminiApiKey, setGeminiApiKey] = useState(() => {
    return localStorage.getItem('devflow_gemini_key') || '';
  });

  const [activeView, setActiveView] = useState('weekly'); // 'weekly', 'daily', 'monthly', 'roadmaps', 'stats'
  const [selectedRoadmapId, setSelectedRoadmapId] = useState('go-developer');

  // Active study session modal
  const [activeSession, setActiveSession] = useState(null);
  // activeSession = { topic, task, roadmap, mode: 'pomodoro' | 'continuous' }

  // Quick action modals
  const [isQuickAddOpen, setIsQuickAddOpen] = useState(false);
  const [isGeneratorOpen, setIsGeneratorOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem('devflow_roadmaps', JSON.stringify(roadmaps));
  }, [roadmaps]);

  useEffect(() => {
    localStorage.setItem('devflow_schedule', JSON.stringify(schedule));
  }, [schedule]);

  useEffect(() => {
    localStorage.setItem('devflow_gemini_key', geminiApiKey);
  }, [geminiApiKey]);

  // Streak and statistics calculation
  const calculateStreak = () => {
    const completedDates = schedule
      .filter(t => t.status === 'completed' && t.date)
      .map(t => t.date)
      .filter((date, idx, self) => self.indexOf(date) === idx)
      .sort();

    if (completedDates.length === 0) return 0;

    // Quick consecutive day counter
    let streak = 1;
    for (let i = completedDates.length - 1; i > 0; i--) {
      const curr = new Date(completedDates[i]);
      const prev = new Date(completedDates[i - 1]);
      const diffTime = Math.abs(curr - prev);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      if (diffDays === 1) {
        streak++;
      } else {
        break;
      }
    }
    return streak;
  };

  // Total seconds studied today, this week, overall
  const getStudyStats = () => {
    const todayStr = '2026-09-28';
    let todaySeconds = 0;
    let weekSeconds = 0;
    let totalSeconds = 0;
    let completedCount = 0;
    let totalTasksCount = schedule.length;

    schedule.forEach(item => {
      const secs = item.actualSecondsStudied || 0;
      totalSeconds += secs;
      if (item.date === todayStr) {
        todaySeconds += secs;
      }
      // For this week's items
      weekSeconds += secs;
      if (item.status === 'completed') {
        completedCount++;
      }
    });

    return {
      todaySeconds,
      weekSeconds,
      totalSeconds,
      completedCount,
      totalTasksCount,
      streak: calculateStreak()
    };
  };

  // Helper to trigger celebration
  const triggerCelebration = () => {
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 }
    });
  };

  // Start study session
  const startStudySession = (topic, task = null, mode = 'pomodoro') => {
    let parentRoadmap = null;
    for (const r of roadmaps) {
      for (const w of r.weeks) {
        if (w.days && w.days.some(d => d.id === topic.id)) {
          parentRoadmap = r;
          break;
        }
      }
      if (parentRoadmap) break;
    }

    setActiveSession({
      topic,
      task,
      roadmap: parentRoadmap || roadmaps[0],
      mode: mode || 'pomodoro'
    });
  };

  const closeStudySession = () => {
    setActiveSession(null);
  };

  // Update study progress and finish session
  const completeStudySession = (topicId, taskId, secondsAdded, notes) => {
    // 1. Update in roadmaps
    setRoadmaps(prev =>
      prev.map(r => ({
        ...r,
        weeks: r.weeks.map(w => ({
          ...w,
          days: w.days.map(d => {
            if (d.id === topicId) {
              return {
                ...d,
                status: 'completed',
                timeSpentSeconds: (d.timeSpentSeconds || 0) + secondsAdded,
                notes: notes !== undefined ? notes : d.notes
              };
            }
            return d;
          })
        }))
      }))
    );

    // 2. Update in schedule if task exists
    if (taskId) {
      setSchedule(prev =>
        prev.map(t => {
          if (t.id === taskId) {
            return {
              ...t,
              status: 'completed',
              actualSecondsStudied: (t.actualSecondsStudied || 0) + secondsAdded,
              notes: notes !== undefined ? notes : t.notes
            };
          }
          return t;
        })
      );
    } else {
      // Find matching schedule item by topicId
      setSchedule(prev =>
        prev.map(t => {
          if (t.topicId === topicId) {
            return {
              ...t,
              status: 'completed',
              actualSecondsStudied: (t.actualSecondsStudied || 0) + secondsAdded,
              notes: notes !== undefined ? notes : t.notes
            };
          }
          return t;
        })
      );
    }

    triggerCelebration();

    if (window.electronAPI?.sendNotification) {
      window.electronAPI.sendNotification(
        '¡Sesión Completada!',
        `Has completado tu sesión de estudio y acumulado ${(secondsAdded / 60).toFixed(0)} minutos.`
      );
    }
  };

  // Toggle exercise checkbox
  const toggleExercise = (roadmapId, topicId, exerciseId) => {
    setRoadmaps(prev =>
      prev.map(r => {
        if (r.id !== roadmapId) return r;
        return {
          ...r,
          weeks: r.weeks.map(w => ({
            ...w,
            days: w.days.map(d => {
              if (d.id !== topicId) return d;
              return {
                ...d,
                exercises: (d.exercises || []).map(ex =>
                  ex.id === exerciseId ? { ...ex, done: !ex.done } : ex
                )
              };
            })
          }))
        };
      })
    );
  };

  // Save notes for a topic
  const saveTopicNotes = (topicId, notes) => {
    setRoadmaps(prev =>
      prev.map(r => ({
        ...r,
        weeks: r.weeks.map(w => ({
          ...w,
          days: w.days.map(d => (d.id === topicId ? { ...d, notes } : d))
        }))
      }))
    );
  };

  // Add task to schedule (for tomorrow, specific day, etc.)
  const addTaskToSchedule = (newTask) => {
    const task = {
      id: `task-${Date.now()}`,
      actualSecondsStudied: 0,
      status: 'pending',
      notes: '',
      ...newTask
    };
    setSchedule(prev => [...prev, task]);
  };

  // Update existing scheduled task
  const updateScheduledTask = (taskId, updates) => {
    setSchedule(prev =>
      prev.map(t => (t.id === taskId ? { ...t, ...updates } : t))
    );
  };

  // Delete scheduled task
  const deleteScheduledTask = (taskId) => {
    setSchedule(prev => prev.filter(t => t.id !== taskId));
  };

  // Add a newly generated or custom roadmap
  const addCustomRoadmap = (newRoadmap) => {
    setRoadmaps(prev => [...prev, newRoadmap]);
    setSelectedRoadmapId(newRoadmap.id);
    setActiveView('roadmaps');
    triggerCelebration();
  };

  return (
    <StudyContext.Provider
      value={{
        roadmaps,
        schedule,
        activeView,
        setActiveView,
        selectedRoadmapId,
        setSelectedRoadmapId,
        activeSession,
        startStudySession,
        closeStudySession,
        completeStudySession,
        toggleExercise,
        saveTopicNotes,
        addTaskToSchedule,
        updateScheduledTask,
        deleteScheduledTask,
        addCustomRoadmap,
        getStudyStats,
        isQuickAddOpen,
        setIsQuickAddOpen,
        isGeneratorOpen,
        setIsGeneratorOpen,
        isSettingsOpen,
        setIsSettingsOpen,
        geminiApiKey,
        setGeminiApiKey,
        generateRoadmapWithAI,
        askAiTutor
      }}
    >
      {children}
    </StudyContext.Provider>
  );
}

export const useStudy = () => {
  const context = useContext(StudyContext);
  if (!context) throw new Error('useStudy must be used within a StudyProvider');
  return context;
};
