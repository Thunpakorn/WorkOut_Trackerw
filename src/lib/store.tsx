"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import {
  Exercise,
  WorkoutSession,
  WorkoutTemplate,
  BodyWeightEntry,
  UserProfile,
  WorkoutSet,
  CardioEntry,
  ExerciseLog
} from "./types";
import {
  DEFAULT_USER,
  DEFAULT_EXERCISES,
  DEFAULT_TEMPLATES,
  DEFAULT_HISTORY,
  DEFAULT_BODY_WEIGHT
} from "./mock-data";
import { calculateTotalVolume, calculate1RM } from "./utils";
import { Language, translations } from "./translations";
import confetti from "canvas-confetti";

interface RestTimerState {
  active: boolean;
  secondsRemaining: number;
  totalSeconds: number;
  exerciseName?: string;
}

interface WorkoutContextType {
  user: UserProfile;
  exercises: Exercise[];
  templates: WorkoutTemplate[];
  history: WorkoutSession[];
  activeWorkout: WorkoutSession | null;
  bodyWeightLog: BodyWeightEntry[];
  restTimer: RestTimerState;
  autoSaveStatus: 'saved' | 'saving' | 'ready';
  
  // Language & i18n
  lang: Language;
  setLang: (lang: Language) => void;
  toggleLanguage: () => void;
  t: (key: keyof typeof translations.en) => string;
  
  // Active Workout Actions
  startBlankWorkout: () => void;
  startWorkoutFromTemplate: (templateId: string) => void;
  copyLastWorkout: (sessionId?: string) => void;
  addExerciseToActiveWorkout: (exerciseId: string) => void;
  removeExerciseFromActiveWorkout: (logId: string) => void;
  addSetToExercise: (logId: string) => void;
  updateSet: (logId: string, setId: string, updates: Partial<WorkoutSet>) => void;
  removeSetFromExercise: (logId: string, setId: string) => void;
  updateCardioEntry: (logId: string, updates: Partial<CardioEntry>) => void;
  updateActiveWorkoutTitle: (title: string) => void;
  finishActiveWorkout: () => void;
  cancelActiveWorkout: () => void;
  
  // Exercise & Template Actions
  addCustomExercise: (exerciseData: Omit<Exercise, 'id'>) => Exercise;
  addTemplate: (templateData: Omit<WorkoutTemplate, 'id'>) => WorkoutTemplate;
  deleteHistorySession: (sessionId: string) => void;
  addBodyWeight: (weight: number) => void;
  updateUserProfile: (updates: Partial<UserProfile>) => void;
  
  // Rest Timer Actions
  startRestTimer: (seconds?: number, exerciseName?: string) => void;
  stopRestTimer: () => void;
  adjustRestTimer: (deltaSeconds: number) => void;
}

const WorkoutContext = createContext<WorkoutContextType | undefined>(undefined);

const STORAGE_KEYS = {
  USER: "workout_tracker_user",
  EXERCISES: "workout_tracker_exercises",
  TEMPLATES: "workout_tracker_templates",
  HISTORY: "workout_tracker_history",
  ACTIVE_WORKOUT: "workout_tracker_active",
  BODY_WEIGHT: "workout_tracker_body_weight",
  LANG: "workout_tracker_lang"
};

export const WorkoutProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile>(DEFAULT_USER);
  const [exercises, setExercises] = useState<Exercise[]>(DEFAULT_EXERCISES);
  const [templates, setTemplates] = useState<WorkoutTemplate[]>(DEFAULT_TEMPLATES);
  const [history, setHistory] = useState<WorkoutSession[]>(DEFAULT_HISTORY);
  const [activeWorkout, setActiveWorkout] = useState<WorkoutSession | null>(null);
  const [bodyWeightLog, setBodyWeightLog] = useState<BodyWeightEntry[]>(DEFAULT_BODY_WEIGHT);
  const [autoSaveStatus, setAutoSaveStatus] = useState<'saved' | 'saving' | 'ready'>('saved');
  const [lang, setLang] = useState<Language>("th"); // Default to Thai language as requested!
  const [isLoaded, setIsLoaded] = useState(false);

  const [restTimer, setRestTimer] = useState<RestTimerState>({
    active: false,
    secondsRemaining: 90,
    totalSeconds: 90,
  });

  // Helper for translations
  const t = (key: keyof typeof translations.en): string => {
    return translations[lang][key] || translations.en[key] || key;
  };

  const toggleLanguage = () => {
    const nextLang = lang === "th" ? "en" : "th";
    setLang(nextLang);
    try {
      localStorage.setItem(STORAGE_KEYS.LANG, nextLang);
    } catch {}
  };

  // Load state from localStorage on mount
  useEffect(() => {
    try {
      const savedLang = localStorage.getItem(STORAGE_KEYS.LANG);
      if (savedLang === "en" || savedLang === "th") setLang(savedLang as Language);

      const savedUser = localStorage.getItem(STORAGE_KEYS.USER);
      if (savedUser) setUser(JSON.parse(savedUser));

      const savedExercises = localStorage.getItem(STORAGE_KEYS.EXERCISES);
      if (savedExercises) setExercises(JSON.parse(savedExercises));

      const savedTemplates = localStorage.getItem(STORAGE_KEYS.TEMPLATES);
      if (savedTemplates) setTemplates(JSON.parse(savedTemplates));

      const savedHistory = localStorage.getItem(STORAGE_KEYS.HISTORY);
      if (savedHistory) setHistory(JSON.parse(savedHistory));

      const savedActive = localStorage.getItem(STORAGE_KEYS.ACTIVE_WORKOUT);
      if (savedActive) setActiveWorkout(JSON.parse(savedActive));

      const savedWeight = localStorage.getItem(STORAGE_KEYS.BODY_WEIGHT);
      if (savedWeight) setBodyWeightLog(JSON.parse(savedWeight));
    } catch (e) {
      console.error("Failed to load local storage state", e);
    } finally {
      setIsLoaded(true);
    }
  }, []);

  // Save active workout auto-save to localStorage whenever it changes
  useEffect(() => {
    if (!isLoaded) return;
    setAutoSaveStatus('saving');
    const timer = setTimeout(() => {
      try {
        if (activeWorkout) {
          localStorage.setItem(STORAGE_KEYS.ACTIVE_WORKOUT, JSON.stringify(activeWorkout));
        } else {
          localStorage.removeItem(STORAGE_KEYS.ACTIVE_WORKOUT);
        }
        localStorage.setItem(STORAGE_KEYS.HISTORY, JSON.stringify(history));
        localStorage.setItem(STORAGE_KEYS.EXERCISES, JSON.stringify(exercises));
        localStorage.setItem(STORAGE_KEYS.TEMPLATES, JSON.stringify(templates));
        localStorage.setItem(STORAGE_KEYS.BODY_WEIGHT, JSON.stringify(bodyWeightLog));
        localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
        localStorage.setItem(STORAGE_KEYS.LANG, lang);
        setAutoSaveStatus('saved');
      } catch (e) {
        console.error("Failed to persist state", e);
      }
    }, 400);

    return () => clearTimeout(timer);
  }, [activeWorkout, history, exercises, templates, bodyWeightLog, user, lang, isLoaded]);

  // Rest Timer Interval Logic
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (restTimer.active && restTimer.secondsRemaining > 0) {
      interval = setInterval(() => {
        setRestTimer((prev) => ({
          ...prev,
          secondsRemaining: prev.secondsRemaining - 1,
        }));
      }, 1000);
    } else if (restTimer.active && restTimer.secondsRemaining <= 0) {
      setRestTimer((prev) => ({ ...prev, active: false }));
      if (typeof window !== 'undefined' && 'vibrate' in navigator) {
        navigator.vibrate([200, 100, 200]);
      }
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [restTimer.active, restTimer.secondsRemaining]);

  // Rest Timer Helpers
  const startRestTimer = (seconds?: number, exerciseName?: string) => {
    const total = seconds || user.restTimerSeconds || 90;
    setRestTimer({
      active: true,
      secondsRemaining: total,
      totalSeconds: total,
      exerciseName
    });
  };

  const stopRestTimer = () => {
    setRestTimer((prev) => ({ ...prev, active: false }));
  };

  const adjustRestTimer = (deltaSeconds: number) => {
    setRestTimer((prev) => {
      const newSec = Math.max(0, prev.secondsRemaining + deltaSeconds);
      return {
        ...prev,
        secondsRemaining: newSec,
        totalSeconds: Math.max(prev.totalSeconds, newSec),
        active: newSec > 0
      };
    });
  };

  // Workout Actions
  const startBlankWorkout = () => {
    const newSession: WorkoutSession = {
      id: `sess-${Date.now()}`,
      title: lang === "th" ? "บันทึกออกกำลังกายเร่งด่วน" : "Quick Workout Session",
      startTime: new Date().toISOString(),
      durationSeconds: 0,
      exercises: [],
      isCompleted: false,
      totalVolumeKg: 0,
    };
    setActiveWorkout(newSession);
  };

  const startWorkoutFromTemplate = (templateId: string) => {
    const template = templates.find((t) => t.id === templateId);
    if (!template) return startBlankWorkout();

    const templateExercises: ExerciseLog[] = template.exercises.map((tEx, idx) => {
      const exDef = exercises.find((e) => e.id === tEx.exerciseId);
      const isCardio = tEx.category === "cardio" || exDef?.category === "cardio";

      const lastSession = history.find((h) =>
        h.exercises.some((e) => e.exerciseId === tEx.exerciseId)
      );
      const lastExLog = lastSession?.exercises.find((e) => e.exerciseId === tEx.exerciseId);

      const sets: WorkoutSet[] = isCardio
        ? []
        : Array.from({ length: tEx.defaultSets || 3 }).map((_, sIdx) => {
            const prevSet = lastExLog?.sets[sIdx];
            return {
              id: `set-${Date.now()}-${idx}-${sIdx}`,
              setNumber: sIdx + 1,
              type: "normal",
              weight: prevSet ? prevSet.weight : 40,
              reps: prevSet ? prevSet.reps : 10,
              completed: false,
              previousWeight: prevSet?.weight,
              previousReps: prevSet?.reps
            };
          });

      return {
        id: `log-${Date.now()}-${idx}`,
        exerciseId: tEx.exerciseId,
        exerciseName: tEx.exerciseName,
        muscleGroup: exDef?.muscleGroup || "full_body",
        category: isCardio ? "cardio" : "strength",
        sets,
        cardio: isCardio
          ? { durationMinutes: 20, incline: 3.0, speed: 5.5, avgHeartRate: 140, caloriesBurned: 220, distanceKm: 2.8 }
          : undefined
      };
    });

    const newSession: WorkoutSession = {
      id: `sess-${Date.now()}`,
      title: template.title,
      startTime: new Date().toISOString(),
      durationSeconds: 0,
      exercises: templateExercises,
      isCompleted: false,
      totalVolumeKg: 0,
      templateId: template.id
    };
    setActiveWorkout(newSession);
  };

  const copyLastWorkout = (sessionId?: string) => {
    const targetSession = sessionId
      ? history.find((s) => s.id === sessionId)
      : history[0];

    if (!targetSession) return startBlankWorkout();

    const copiedExercises: ExerciseLog[] = targetSession.exercises.map((log, idx) => ({
      id: `log-copy-${Date.now()}-${idx}`,
      exerciseId: log.exerciseId,
      exerciseName: log.exerciseName,
      muscleGroup: log.muscleGroup,
      category: log.category,
      sets: log.sets.map((s, sIdx) => ({
        id: `set-copy-${Date.now()}-${idx}-${sIdx}`,
        setNumber: sIdx + 1,
        type: s.type,
        weight: s.weight,
        reps: s.reps,
        completed: false,
        previousWeight: s.weight,
        previousReps: s.reps
      })),
      cardio: log.cardio ? { ...log.cardio } : undefined
    }));

    const newSession: WorkoutSession = {
      id: `sess-${Date.now()}`,
      title: `${targetSession.title} (${lang === "th" ? "สำเนา" : "Copy"})`,
      startTime: new Date().toISOString(),
      durationSeconds: 0,
      exercises: copiedExercises,
      isCompleted: false,
      totalVolumeKg: 0
    };
    setActiveWorkout(newSession);
  };

  const addExerciseToActiveWorkout = (exerciseId: string) => {
    if (!activeWorkout) return;
    const exDef = exercises.find((e) => e.id === exerciseId);
    if (!exDef) return;

    const isCardio = exDef.category === "cardio";

    const lastSession = history.find((h) =>
      h.exercises.some((e) => e.exerciseId === exerciseId)
    );
    const lastExLog = lastSession?.exercises.find((e) => e.exerciseId === exerciseId);
    const prevWeight = lastExLog?.sets[0]?.weight || (exDef.personalRecord?.weight || 30);
    const prevReps = lastExLog?.sets[0]?.reps || 10;

    const newLog: ExerciseLog = {
      id: `log-${Date.now()}`,
      exerciseId: exDef.id,
      exerciseName: exDef.name,
      muscleGroup: exDef.muscleGroup,
      category: exDef.category,
      sets: isCardio
        ? []
        : [
            {
              id: `set-${Date.now()}-1`,
              setNumber: 1,
              type: "normal",
              weight: prevWeight,
              reps: prevReps,
              completed: false,
              previousWeight: prevWeight,
              previousReps: prevReps
            },
            {
              id: `set-${Date.now()}-2`,
              setNumber: 2,
              type: "normal",
              weight: prevWeight,
              reps: prevReps,
              completed: false,
              previousWeight: prevWeight,
              previousReps: prevReps
            },
            {
              id: `set-${Date.now()}-3`,
              setNumber: 3,
              type: "normal",
              weight: prevWeight,
              reps: prevReps,
              completed: false,
              previousWeight: prevWeight,
              previousReps: prevReps
            }
          ],
      cardio: isCardio
        ? { durationMinutes: 20, incline: 3.0, speed: 5.5, avgHeartRate: 140, caloriesBurned: 200, distanceKm: 2.8 }
        : undefined
    };

    setActiveWorkout((prev) => {
      if (!prev) return null;
      return {
        ...prev,
        exercises: [...prev.exercises, newLog]
      };
    });
  };

  const removeExerciseFromActiveWorkout = (logId: string) => {
    setActiveWorkout((prev) => {
      if (!prev) return null;
      return {
        ...prev,
        exercises: prev.exercises.filter((e) => e.id !== logId)
      };
    });
  };

  const addSetToExercise = (logId: string) => {
    setActiveWorkout((prev) => {
      if (!prev) return null;
      const exercises = prev.exercises.map((log) => {
        if (log.id !== logId) return log;
        const lastSet = log.sets[log.sets.length - 1];
        const newSetNumber = log.sets.length + 1;
        const newSet: WorkoutSet = {
          id: `set-${Date.now()}-${newSetNumber}`,
          setNumber: newSetNumber,
          type: "normal",
          weight: lastSet ? lastSet.weight : 40,
          reps: lastSet ? lastSet.reps : 10,
          completed: false,
          previousWeight: lastSet ? lastSet.weight : undefined,
          previousReps: lastSet ? lastSet.reps : undefined
        };
        return {
          ...log,
          sets: [...log.sets, newSet]
        };
      });
      return { ...prev, exercises };
    });
  };

  const updateSet = (logId: string, setId: string, updates: Partial<WorkoutSet>) => {
    setActiveWorkout((prev) => {
      if (!prev) return null;
      let targetExName = "";
      const exercises = prev.exercises.map((log) => {
        if (log.id !== logId) return log;
        targetExName = log.exerciseName;
        const sets = log.sets.map((set) => {
          if (set.id !== setId) return set;
          const updatedSet = { ...set, ...updates };

          if (updates.completed === true && !set.completed && user.restTimerAutoStart) {
            startRestTimer(user.restTimerSeconds, targetExName);
          }

          return updatedSet;
        });
        return { ...log, sets };
      });
      return { ...prev, exercises };
    });
  };

  const removeSetFromExercise = (logId: string, setId: string) => {
    setActiveWorkout((prev) => {
      if (!prev) return null;
      const exercises = prev.exercises.map((log) => {
        if (log.id !== logId) return log;
        const filteredSets = log.sets.filter((s) => s.id !== setId);
        const reindexed = filteredSets.map((s, idx) => ({ ...s, setNumber: idx + 1 }));
        return { ...log, sets: reindexed };
      });
      return { ...prev, exercises };
    });
  };

  const updateCardioEntry = (logId: string, updates: Partial<CardioEntry>) => {
    setActiveWorkout((prev) => {
      if (!prev) return null;
      const exercises = prev.exercises.map((log) => {
        if (log.id !== logId) return log;
        return {
          ...log,
          cardio: log.cardio ? { ...log.cardio, ...updates } : (updates as CardioEntry)
        };
      });
      return { ...prev, exercises };
    });
  };

  const updateActiveWorkoutTitle = (title: string) => {
    setActiveWorkout((prev) => (prev ? { ...prev, title } : null));
  };

  const finishActiveWorkout = () => {
    if (!activeWorkout) return;

    const endTime = new Date().toISOString();
    const startTimeDate = new Date(activeWorkout.startTime).getTime();
    const durationSeconds = Math.max(60, Math.floor((Date.now() - startTimeDate) / 1000));
    const totalVolumeKg = calculateTotalVolume(activeWorkout);

    const updatedExercisesList = [...exercises];
    const completedSession: WorkoutSession = {
      ...activeWorkout,
      endTime,
      durationSeconds,
      isCompleted: true,
      totalVolumeKg,
      exercises: activeWorkout.exercises.map((exLog) => {
        if (exLog.category === 'strength') {
          const exDef = updatedExercisesList.find((e) => e.id === exLog.exerciseId);
          let currentMax1RM = exDef?.personalRecord?.estimated1RM || 0;

          const updatedSets = exLog.sets.map((set) => {
            if (set.completed && set.weight > 0 && set.reps > 0) {
              const set1RM = calculate1RM(set.weight, set.reps);
              if (set1RM > currentMax1RM) {
                currentMax1RM = set1RM;
                if (exDef) {
                  exDef.personalRecord = {
                    weight: set.weight,
                    reps: set.reps,
                    estimated1RM: set1RM,
                    date: new Date().toISOString().split("T")[0]
                  };
                }
                return { ...set, isPR: true };
              }
            }
            return set;
          });
          return { ...exLog, sets: updatedSets };
        }
        return exLog;
      })
    };

    setHistory((prev) => [completedSession, ...prev]);
    setExercises(updatedExercisesList);
    setActiveWorkout(null);
    stopRestTimer();

    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ["#84cc16", "#06b6d4", "#f59e0b", "#ffffff"]
      });
    } catch {}
  };

  const cancelActiveWorkout = () => {
    setActiveWorkout(null);
    stopRestTimer();
  };

  const addCustomExercise = (exerciseData: Omit<Exercise, "id">) => {
    const newEx: Exercise = {
      ...exerciseData,
      id: `ex-custom-${Date.now()}`,
      isCustom: true
    };
    setExercises((prev) => [newEx, ...prev]);
    return newEx;
  };

  const addTemplate = (templateData: Omit<WorkoutTemplate, "id">) => {
    const newTpl: WorkoutTemplate = {
      ...templateData,
      id: `tpl-custom-${Date.now()}`,
      isCustom: true
    };
    setTemplates((prev) => [...prev, newTpl]);
    return newTpl;
  };

  const deleteHistorySession = (sessionId: string) => {
    setHistory((prev) => prev.filter((s) => s.id !== sessionId));
  };

  const addBodyWeight = (weight: number) => {
    const today = new Date().toISOString().split("T")[0];
    const newEntry: BodyWeightEntry = {
      id: `bw-${Date.now()}`,
      date: today,
      weight
    };
    setBodyWeightLog((prev) => {
      const filtered = prev.filter((e) => e.date !== today);
      return [...filtered, newEntry].sort((a, b) => a.date.localeCompare(b.date));
    });
  };

  const updateUserProfile = (updates: Partial<UserProfile>) => {
    setUser((prev) => ({ ...prev, ...updates }));
  };

  return (
    <WorkoutContext.Provider
      value={{
        user,
        exercises,
        templates,
        history,
        activeWorkout,
        bodyWeightLog,
        restTimer,
        autoSaveStatus,
        lang,
        setLang,
        toggleLanguage,
        t,
        startBlankWorkout,
        startWorkoutFromTemplate,
        copyLastWorkout,
        addExerciseToActiveWorkout,
        removeExerciseFromActiveWorkout,
        addSetToExercise,
        updateSet,
        removeSetFromExercise,
        updateCardioEntry,
        updateActiveWorkoutTitle,
        finishActiveWorkout,
        cancelActiveWorkout,
        addCustomExercise,
        addTemplate,
        deleteHistorySession,
        addBodyWeight,
        updateUserProfile,
        startRestTimer,
        stopRestTimer,
        adjustRestTimer
      }}
    >
      {children}
    </WorkoutContext.Provider>
  );
};

export function useWorkout() {
  const context = useContext(WorkoutContext);
  if (!context) {
    throw new Error("useWorkout must be used within a WorkoutProvider");
  }
  return context;
}
