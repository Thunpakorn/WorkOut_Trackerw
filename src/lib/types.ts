export type MuscleGroup = 
  | 'chest' 
  | 'back' 
  | 'legs' 
  | 'shoulders' 
  | 'arms' 
  | 'core' 
  | 'full_body' 
  | 'cardio';

export type Equipment = 
  | 'barbell' 
  | 'dumbbell' 
  | 'machine' 
  | 'cable' 
  | 'bodyweight' 
  | 'treadmill' 
  | 'other';

export type ExerciseCategory = 'strength' | 'cardio';

export interface Exercise {
  id: string;
  name: string;
  muscleGroup: MuscleGroup;
  equipment: Equipment;
  category: ExerciseCategory;
  isCustom?: boolean;
  notes?: string;
  personalRecord?: {
    weight: number;
    reps: number;
    estimated1RM: number;
    date: string;
  };
}

export type SetType = 'warmup' | 'normal' | 'drop' | 'failure';

export interface WorkoutSet {
  id: string;
  setNumber: number;
  type: SetType;
  weight: number;
  reps: number;
  completed: boolean;
  previousWeight?: number;
  previousReps?: number;
  isPR?: boolean;
}

export interface CardioEntry {
  durationMinutes: number;
  incline: number; // percentage e.g. 3.5
  speed: number;    // mph or kph e.g. 6.0
  avgHeartRate?: number; // bpm e.g. 145
  caloriesBurned?: number;
  distanceKm?: number;
}

export interface ExerciseLog {
  id: string;
  exerciseId: string;
  exerciseName: string;
  muscleGroup: MuscleGroup;
  category: ExerciseCategory;
  sets: WorkoutSet[];
  cardio?: CardioEntry;
  notes?: string;
}

export interface WorkoutSession {
  id: string;
  title: string;
  startTime: string; // ISO string
  endTime?: string;   // ISO string
  durationSeconds: number;
  exercises: ExerciseLog[];
  isCompleted: boolean;
  totalVolumeKg: number;
  templateId?: string;
  notes?: string;
}

export interface WorkoutTemplate {
  id: string;
  title: string;
  description: string;
  targetMuscleGroups: MuscleGroup[];
  exercises: {
    exerciseId: string;
    exerciseName: string;
    category: ExerciseCategory;
    defaultSets: number;
  }[];
  isCustom?: boolean;
}

export interface BodyWeightEntry {
  id: string;
  date: string; // YYYY-MM-DD
  weight: number;
}

export interface UserProfile {
  name: string;
  email: string;
  weightUnit: 'kg' | 'lbs';
  restTimerSeconds: number;
  restTimerAutoStart: boolean;
  weeklyGoal: number; // e.g. 4 workouts per week
  soundEnabled: boolean;
}
