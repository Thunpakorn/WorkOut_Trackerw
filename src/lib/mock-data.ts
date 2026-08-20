import { Exercise, WorkoutSession, WorkoutTemplate, BodyWeightEntry, UserProfile } from "./types";

export const DEFAULT_USER: UserProfile = {
  name: "Alex Morgan",
  email: "alex@gymgroup.app",
  weightUnit: "kg",
  restTimerSeconds: 90,
  restTimerAutoStart: true,
  weeklyGoal: 4,
  soundEnabled: true,
};

export const DEFAULT_EXERCISES: Exercise[] = [
  {
    id: "ex-1",
    name: "Barbell Bench Press",
    muscleGroup: "chest",
    equipment: "barbell",
    category: "strength",
    personalRecord: { weight: 90, reps: 5, estimated1RM: 105, date: "2026-08-15" }
  },
  {
    id: "ex-2",
    name: "Incline Dumbbell Press",
    muscleGroup: "chest",
    equipment: "dumbbell",
    category: "strength",
    personalRecord: { weight: 32, reps: 8, estimated1RM: 40, date: "2026-08-10" }
  },
  {
    id: "ex-3",
    name: "Barbell Squat",
    muscleGroup: "legs",
    equipment: "barbell",
    category: "strength",
    personalRecord: { weight: 120, reps: 5, estimated1RM: 140, date: "2026-08-12" }
  },
  {
    id: "ex-4",
    name: "Romanian Deadlift",
    muscleGroup: "legs",
    equipment: "barbell",
    category: "strength",
    personalRecord: { weight: 100, reps: 8, estimated1RM: 126, date: "2026-08-12" }
  },
  {
    id: "ex-5",
    name: "Lat Pulldown",
    muscleGroup: "back",
    equipment: "cable",
    category: "strength",
    personalRecord: { weight: 75, reps: 10, estimated1RM: 100, date: "2026-08-14" }
  },
  {
    id: "ex-6",
    name: "Seated Cable Row",
    muscleGroup: "back",
    equipment: "cable",
    category: "strength",
    personalRecord: { weight: 70, reps: 10, estimated1RM: 93, date: "2026-08-14" }
  },
  {
    id: "ex-7",
    name: "Overhead Dumbbell Press",
    muscleGroup: "shoulders",
    equipment: "dumbbell",
    category: "strength",
    personalRecord: { weight: 24, reps: 8, estimated1RM: 30, date: "2026-08-15" }
  },
  {
    id: "ex-8",
    name: "Lateral Raises",
    muscleGroup: "shoulders",
    equipment: "dumbbell",
    category: "strength",
    personalRecord: { weight: 12, reps: 12, estimated1RM: 17, date: "2026-08-15" }
  },
  {
    id: "ex-9",
    name: "Tricep Rope Pushdown",
    muscleGroup: "arms",
    equipment: "cable",
    category: "strength",
    personalRecord: { weight: 35, reps: 12, estimated1RM: 49, date: "2026-08-15" }
  },
  {
    id: "ex-10",
    name: "Dumbbell Bicep Curl",
    muscleGroup: "arms",
    equipment: "dumbbell",
    category: "strength",
    personalRecord: { weight: 16, reps: 10, estimated1RM: 21, date: "2026-08-14" }
  },
  {
    id: "ex-11",
    name: "Hanging Leg Raise",
    muscleGroup: "core",
    equipment: "bodyweight",
    category: "strength",
  },
  {
    id: "ex-12",
    name: "Treadmill Intervals / Incline Walk",
    muscleGroup: "cardio",
    equipment: "treadmill",
    category: "cardio",
  }
];

export const DEFAULT_TEMPLATES: WorkoutTemplate[] = [
  {
    id: "tpl-1",
    title: "Push Focus (Chest & Shoulders)",
    description: "Heavy bench press, incline dumbbells, overhead press & triceps finishing.",
    targetMuscleGroups: ["chest", "shoulders", "arms"],
    exercises: [
      { exerciseId: "ex-1", exerciseName: "Barbell Bench Press", category: "strength", defaultSets: 4 },
      { exerciseId: "ex-2", exerciseName: "Incline Dumbbell Press", category: "strength", defaultSets: 3 },
      { exerciseId: "ex-7", exerciseName: "Overhead Dumbbell Press", category: "strength", defaultSets: 3 },
      { exerciseId: "ex-8", exerciseName: "Lateral Raises", category: "strength", defaultSets: 4 },
      { exerciseId: "ex-9", exerciseName: "Tricep Rope Pushdown", category: "strength", defaultSets: 3 }
    ]
  },
  {
    id: "tpl-2",
    title: "Pull Focus (Back & Biceps)",
    description: "Lat pulldowns, seated cable rows, and heavy curls for max back volume.",
    targetMuscleGroups: ["back", "arms"],
    exercises: [
      { exerciseId: "ex-5", exerciseName: "Lat Pulldown", category: "strength", defaultSets: 4 },
      { exerciseId: "ex-6", exerciseName: "Seated Cable Row", category: "strength", defaultSets: 4 },
      { exerciseId: "ex-10", exerciseName: "Dumbbell Bicep Curl", category: "strength", defaultSets: 3 }
    ]
  },
  {
    id: "tpl-3",
    title: "Legs & Core",
    description: "Quads, hamstrings, glutes, and hanging leg raises.",
    targetMuscleGroups: ["legs", "core"],
    exercises: [
      { exerciseId: "ex-3", exerciseName: "Barbell Squat", category: "strength", defaultSets: 4 },
      { exerciseId: "ex-4", exerciseName: "Romanian Deadlift", category: "strength", defaultSets: 3 },
      { exerciseId: "ex-11", exerciseName: "Hanging Leg Raise", category: "strength", defaultSets: 3 }
    ]
  },
  {
    id: "tpl-4",
    title: "Treadmill Cardio & Core Burn",
    description: "30-minute incline treadmill power walk + core abdominal work.",
    targetMuscleGroups: ["cardio", "core"],
    exercises: [
      { exerciseId: "ex-12", exerciseName: "Treadmill Intervals / Incline Walk", category: "cardio", defaultSets: 1 },
      { exerciseId: "ex-11", exerciseName: "Hanging Leg Raise", category: "strength", defaultSets: 3 }
    ]
  }
];

export const DEFAULT_HISTORY: WorkoutSession[] = [
  {
    id: "sess-101",
    title: "Push Focus (Chest & Shoulders)",
    startTime: "2026-08-19T17:30:00.000Z",
    endTime: "2026-08-19T18:35:00.000Z",
    durationSeconds: 3900,
    isCompleted: true,
    totalVolumeKg: 4250,
    templateId: "tpl-1",
    exercises: [
      {
        id: "log-1",
        exerciseId: "ex-1",
        exerciseName: "Barbell Bench Press",
        muscleGroup: "chest",
        category: "strength",
        sets: [
          { id: "s-1", setNumber: 1, type: "warmup", weight: 60, reps: 10, completed: true },
          { id: "s-2", setNumber: 2, type: "normal", weight: 80, reps: 8, completed: true },
          { id: "s-3", setNumber: 3, type: "normal", weight: 85, reps: 6, completed: true },
          { id: "s-4", setNumber: 4, type: "normal", weight: 90, reps: 5, completed: true, isPR: true }
        ]
      },
      {
        id: "log-2",
        exerciseId: "ex-2",
        exerciseName: "Incline Dumbbell Press",
        muscleGroup: "chest",
        category: "strength",
        sets: [
          { id: "s-5", setNumber: 1, type: "normal", weight: 28, reps: 10, completed: true },
          { id: "s-6", setNumber: 2, type: "normal", weight: 30, reps: 8, completed: true },
          { id: "s-7", setNumber: 3, type: "normal", weight: 32, reps: 8, completed: true }
        ]
      },
      {
        id: "log-3",
        exerciseId: "ex-8",
        exerciseName: "Lateral Raises",
        muscleGroup: "shoulders",
        category: "strength",
        sets: [
          { id: "s-8", setNumber: 1, type: "normal", weight: 10, reps: 15, completed: true },
          { id: "s-9", setNumber: 2, type: "normal", weight: 12, reps: 12, completed: true },
          { id: "s-10", setNumber: 3, type: "normal", weight: 12, reps: 12, completed: true }
        ]
      }
    ]
  },
  {
    id: "sess-102",
    title: "Pull Focus (Back & Biceps)",
    startTime: "2026-08-17T18:00:00.000Z",
    endTime: "2026-08-17T19:00:00.000Z",
    durationSeconds: 3600,
    isCompleted: true,
    totalVolumeKg: 3880,
    templateId: "tpl-2",
    exercises: [
      {
        id: "log-4",
        exerciseId: "ex-5",
        exerciseName: "Lat Pulldown",
        muscleGroup: "back",
        category: "strength",
        sets: [
          { id: "s-11", setNumber: 1, type: "normal", weight: 65, reps: 12, completed: true },
          { id: "s-12", setNumber: 2, type: "normal", weight: 70, reps: 10, completed: true },
          { id: "s-13", setNumber: 3, type: "normal", weight: 75, reps: 10, completed: true }
        ]
      },
      {
        id: "log-5",
        exerciseId: "ex-6",
        exerciseName: "Seated Cable Row",
        muscleGroup: "back",
        category: "strength",
        sets: [
          { id: "s-14", setNumber: 1, type: "normal", weight: 60, reps: 12, completed: true },
          { id: "s-15", setNumber: 2, type: "normal", weight: 70, reps: 10, completed: true },
          { id: "s-16", setNumber: 3, type: "normal", weight: 70, reps: 10, completed: true }
        ]
      }
    ]
  },
  {
    id: "sess-103",
    title: "Treadmill Cardio & Leg Burn",
    startTime: "2026-08-15T09:15:00.000Z",
    endTime: "2026-08-15T10:05:00.000Z",
    durationSeconds: 3000,
    isCompleted: true,
    totalVolumeKg: 2400,
    exercises: [
      {
        id: "log-6",
        exerciseId: "ex-12",
        exerciseName: "Treadmill Intervals / Incline Walk",
        muscleGroup: "cardio",
        category: "cardio",
        sets: [],
        cardio: {
          durationMinutes: 30,
          incline: 4.5,
          speed: 5.5,
          avgHeartRate: 148,
          caloriesBurned: 310,
          distanceKm: 4.4
        }
      },
      {
        id: "log-7",
        exerciseId: "ex-3",
        exerciseName: "Barbell Squat",
        muscleGroup: "legs",
        category: "strength",
        sets: [
          { id: "s-17", setNumber: 1, type: "normal", weight: 100, reps: 8, completed: true },
          { id: "s-18", setNumber: 2, type: "normal", weight: 110, reps: 8, completed: true },
          { id: "s-19", setNumber: 3, type: "normal", weight: 120, reps: 5, completed: true }
        ]
      }
    ]
  }
];

export const DEFAULT_BODY_WEIGHT: BodyWeightEntry[] = [
  { id: "bw-1", date: "2026-08-01", weight: 78.5 },
  { id: "bw-2", date: "2026-08-05", weight: 78.2 },
  { id: "bw-3", date: "2026-08-10", weight: 77.9 },
  { id: "bw-4", date: "2026-08-15", weight: 77.6 },
  { id: "bw-5", date: "2026-08-19", weight: 77.4 }
];
