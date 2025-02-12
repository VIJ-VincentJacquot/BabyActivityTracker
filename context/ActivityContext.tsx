import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export type ActivityType = 'feed' | 'sleep' | 'diaper';

export interface Activity {
  id: string;
  type: ActivityType;
  startTime: string;
  endTime?: string;
  notes?: string;
  sides?: Array<{ side: 'left' | 'right'; startTime: string; endTime?: string }>;
  diaperType?: 'wet' | 'dirty' | 'both';
  isPaused?: boolean;
  pauseTime?: string;
}

interface ActivityContextType {
  activities: Activity[];
  activeTimer: Activity | null;
  addActivity: (activity: Omit<Activity, 'id'>) => void;
  updateActivity: (id: string, updates: Partial<Activity>) => void;
  deleteActivity: (id: string) => void;
  startTimer: (type: ActivityType) => void;
  stopTimer: () => void;
  pauseTimer: () => void;
  resumeTimer: () => void;
  updateActiveSide: (side: 'left' | 'right') => void;
  getLastFeeding: () => Activity | null;
}

const ActivityContext = createContext<ActivityContextType | undefined>(undefined);

export function ActivityProvider({ children }: { children: React.ReactNode }) {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [activeTimer, setActiveTimer] = useState<Activity | null>(null);

  useEffect(() => {
    loadActivities();
  }, []);

  const loadActivities = async () => {
    try {
      const stored = await AsyncStorage.getItem('activities');
      if (stored) {
        setActivities(JSON.parse(stored));
      }
    } catch (error) {
      console.error('Error loading activities:', error);
    }
  };

  const saveActivities = async (newActivities: Activity[]) => {
    try {
      await AsyncStorage.setItem('activities', JSON.stringify(newActivities));
    } catch (error) {
      console.error('Error saving activities:', error);
    }
  };

  const addActivity = (activity: Omit<Activity, 'id'>) => {
    const newActivity = {
      ...activity,
      id: Date.now().toString(),
    };
    const newActivities = [...activities, newActivity];
    setActivities(newActivities);
    saveActivities(newActivities);
  };

  const updateActivity = (id: string, updates: Partial<Activity>) => {
    const newActivities = activities.map(activity =>
      activity.id === id ? { ...activity, ...updates } : activity
    );
    setActivities(newActivities);
    saveActivities(newActivities);
  };

  const deleteActivity = (id: string) => {
    const newActivities = activities.filter(activity => activity.id !== id);
    setActivities(newActivities);
    saveActivities(newActivities);
  };

  const startTimer = (type: ActivityType) => {
    if (activeTimer) return;
    const newTimer: Activity = {
      id: Date.now().toString(),
      type,
      startTime: new Date().toISOString(),
      sides: type === 'feed' ? [{ side: 'left', startTime: new Date().toISOString() }] : undefined,
      isPaused: false,
    };
    setActiveTimer(newTimer);
  };

  const pauseTimer = () => {
    if (!activeTimer || activeTimer.isPaused) return;
    setActiveTimer(current => {
      if (!current) return null;
      return {
        ...current,
        isPaused: true,
        pauseTime: new Date().toISOString(),
      };
    });
  };

  const resumeTimer = () => {
    if (!activeTimer || !activeTimer.isPaused) return;
    setActiveTimer(current => {
      if (!current) return null;
      return {
        ...current,
        isPaused: false,
        pauseTime: undefined,
      };
    });
  };

  const updateActiveSide = (newSide: 'left' | 'right') => {
    if (!activeTimer || activeTimer.type !== 'feed') return;

    setActiveTimer(current => {
      if (!current) return null;

      const sides = current.sides || [];
      const lastSide = sides[sides.length - 1];

      if (lastSide && !lastSide.endTime && lastSide.side !== newSide) {
        return {
          ...current,
          sides: [
            ...sides.slice(0, -1),
            { ...lastSide, endTime: new Date().toISOString() },
            { side: newSide, startTime: new Date().toISOString() },
          ],
        };
      }

      return current;
    });
  };

  const stopTimer = () => {
    if (!activeTimer) return;
    const completedActivity = {
      ...activeTimer,
      endTime: new Date().toISOString(),
      sides: activeTimer.sides?.map(side => 
        side.endTime ? side : { ...side, endTime: new Date().toISOString() }
      ),
      isPaused: false,
      pauseTime: undefined,
    };
    addActivity(completedActivity);
    setActiveTimer(null);
  };

  const getLastFeeding = () => {
    return activities
      .filter(activity => activity.type === 'feed')
      .sort((a, b) => new Date(b.startTime).getTime() - new Date(a.startTime).getTime())[0] || null;
  };

  return (
    <ActivityContext.Provider
      value={{
        activities,
        activeTimer,
        addActivity,
        updateActivity,
        deleteActivity,
        startTimer,
        stopTimer,
        pauseTimer,
        resumeTimer,
        updateActiveSide,
        getLastFeeding,
      }}>
      {children}
    </ActivityContext.Provider>
  );
}

export function useActivities() {
  const context = useContext(ActivityContext);
  if (context === undefined) {
    throw new Error('useActivities must be used within an ActivityProvider');
  }
  return context;
}