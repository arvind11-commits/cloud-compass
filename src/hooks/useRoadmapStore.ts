import { useState, useEffect, useCallback } from 'react';
import { Phase, Day, DailyLog, Resource, Stats } from '@/types/roadmap';
import { initialPhases, generateInitialDays } from '@/data/initialRoadmap';

const STORAGE_KEYS = {
  phases: 'cloud-roadmap-phases',
  days: 'cloud-roadmap-days',
  logs: 'cloud-roadmap-logs',
  resources: 'cloud-roadmap-resources',
};

const loadFromStorage = <T>(key: string, defaultValue: T): T => {
  try {
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) : defaultValue;
  } catch {
    return defaultValue;
  }
};

const saveToStorage = <T>(key: string, value: T): void => {
  localStorage.setItem(key, JSON.stringify(value));
};

export const useRoadmapStore = () => {
  const [phases, setPhases] = useState<Phase[]>(() => 
    loadFromStorage(STORAGE_KEYS.phases, initialPhases)
  );
  const [days, setDays] = useState<Day[]>(() => 
    loadFromStorage(STORAGE_KEYS.days, generateInitialDays())
  );
  const [logs, setLogs] = useState<DailyLog[]>(() => 
    loadFromStorage(STORAGE_KEYS.logs, [])
  );
  const [resources, setResources] = useState<Resource[]>(() => 
    loadFromStorage(STORAGE_KEYS.resources, [])
  );

  // Persist to localStorage
  useEffect(() => saveToStorage(STORAGE_KEYS.phases, phases), [phases]);
  useEffect(() => saveToStorage(STORAGE_KEYS.days, days), [days]);
  useEffect(() => saveToStorage(STORAGE_KEYS.logs, logs), [logs]);
  useEffect(() => saveToStorage(STORAGE_KEYS.resources, resources), [resources]);

  // Day operations
  const toggleDayComplete = useCallback((dayId: string) => {
    setDays(prev => prev.map(day => 
      day.id === dayId 
        ? { ...day, completed: !day.completed, completedAt: !day.completed ? new Date().toISOString() : undefined }
        : day
    ));
  }, []);

  const updateDayNotes = useCallback((dayId: string, notes: string) => {
    setDays(prev => prev.map(day => 
      day.id === dayId ? { ...day, notes } : day
    ));
  }, []);

  const updateDay = useCallback((dayId: string, updates: Partial<Day>) => {
    setDays(prev => prev.map(day => 
      day.id === dayId ? { ...day, ...updates } : day
    ));
  }, []);

  // Daily log operations
  const checkInToday = useCallback(() => {
    const today = new Date().toISOString().split('T')[0];
    const existingLog = logs.find(log => log.date === today);
    
    if (!existingLog) {
      const newLog: DailyLog = {
        id: `log-${Date.now()}`,
        date: today,
        studiedToday: true,
        timestamp: new Date().toISOString(),
      };
      setLogs(prev => [...prev, newLog]);
      return true;
    }
    return false;
  }, [logs]);

  const hasCheckedInToday = useCallback(() => {
    const today = new Date().toISOString().split('T')[0];
    return logs.some(log => log.date === today);
  }, [logs]);

  // Resource operations
  const addResource = useCallback((resource: Omit<Resource, 'id' | 'createdAt'>) => {
    const newResource: Resource = {
      ...resource,
      id: `resource-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    setResources(prev => [...prev, newResource]);
  }, []);

  const deleteResource = useCallback((resourceId: string) => {
    setResources(prev => prev.filter(r => r.id !== resourceId));
  }, []);

  const updateResource = useCallback((resourceId: string, updates: Partial<Resource>) => {
    setResources(prev => prev.map(r => 
      r.id === resourceId ? { ...r, ...updates } : r
    ));
  }, []);

  // Stats calculation
  const calculateStats = useCallback((): Stats => {
    const completedDays = days.filter(d => d.completed).length;
    const totalDays = 180;
    
    // Calculate streak
    const sortedLogs = [...logs].sort((a, b) => 
      new Date(b.date).getTime() - new Date(a.date).getTime()
    );
    
    let currentStreak = 0;
    let bestStreak = 0;
    let tempStreak = 0;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    for (let i = 0; i < sortedLogs.length; i++) {
      const logDate = new Date(sortedLogs[i].date);
      logDate.setHours(0, 0, 0, 0);
      
      const expectedDate = new Date(today);
      expectedDate.setDate(expectedDate.getDate() - i);
      
      if (logDate.getTime() === expectedDate.getTime()) {
        tempStreak++;
        if (i === 0 || currentStreak > 0) {
          currentStreak = tempStreak;
        }
      } else {
        bestStreak = Math.max(bestStreak, tempStreak);
        tempStreak = 0;
        if (i === 0) currentStreak = 0;
      }
    }
    bestStreak = Math.max(bestStreak, tempStreak, currentStreak);

    // Weekly data
    const weeklyData: { week: string; days: number }[] = [];
    const now = new Date();
    for (let i = 3; i >= 0; i--) {
      const weekStart = new Date(now);
      weekStart.setDate(weekStart.getDate() - (i * 7) - weekStart.getDay());
      const weekEnd = new Date(weekStart);
      weekEnd.setDate(weekEnd.getDate() + 6);
      
      const daysInWeek = logs.filter(log => {
        const logDate = new Date(log.date);
        return logDate >= weekStart && logDate <= weekEnd;
      }).length;
      
      weeklyData.push({
        week: `Week ${4 - i}`,
        days: daysInWeek,
      });
    }

    return {
      totalDaysCompleted: completedDays,
      currentStreak,
      bestStreak,
      completionPercentage: Math.round((completedDays / totalDays) * 100),
      totalResources: resources.length,
      weeklyData,
    };
  }, [days, logs, resources]);

  // Phase operations
  const updatePhase = useCallback((phaseId: string, updates: Partial<Phase>) => {
    setPhases(prev => prev.map(p => 
      p.id === phaseId ? { ...p, ...updates } : p
    ));
  }, []);

  const getCurrentPhase = useCallback(() => {
    const completedDays = days.filter(d => d.completed).length;
    return phases.find(p => completedDays >= p.startDay - 1 && completedDays < p.endDay) || phases[0];
  }, [days, phases]);

  return {
    phases,
    days,
    logs,
    resources,
    toggleDayComplete,
    updateDayNotes,
    updateDay,
    checkInToday,
    hasCheckedInToday,
    addResource,
    deleteResource,
    updateResource,
    calculateStats,
    updatePhase,
    getCurrentPhase,
  };
};
