import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { WorkoutSession } from "./types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Calculates estimated 1-Rep Max using the Epley Formula:
 * 1RM = Weight * (1 + Reps / 30)
 */
export function calculate1RM(weight: number, reps: number): number {
  if (reps <= 0 || weight <= 0) return 0;
  if (reps === 1) return weight;
  return Math.round(weight * (1 + reps / 30));
}

/**
 * Calculates total weight volume lifted in a workout session (kg/lbs)
 */
export function calculateTotalVolume(session: Partial<WorkoutSession>): number {
  if (!session.exercises) return 0;
  let total = 0;
  for (const ex of session.exercises) {
    if (ex.category === 'strength' && ex.sets) {
      for (const set of ex.sets) {
        if (set.completed) {
          total += set.weight * set.reps;
        }
      }
    }
  }
  return total;
}

/**
 * Formats seconds into MM:SS or H:MM:SS display string
 */
export function formatDuration(seconds: number): string {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  const pad = (n: number) => n.toString().padStart(2, '0');

  if (h > 0) {
    return `${h}:${pad(m)}:${pad(s)}`;
  }
  return `${pad(m)}:${pad(s)}`;
}

/**
 * Formats ISO date string into readable text (e.g. "Thu, Aug 20" or "Aug 20, 2026")
 */
export function formatDate(dateString: string, includeTime = false): string {
  try {
    const date = new Date(dateString);
    const options: Intl.DateTimeFormatOptions = {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      ...(includeTime ? { hour: '2-digit', minute: '2-digit' } : {})
    };
    return new Intl.DateTimeFormat('en-US', options).format(date);
  } catch {
    return dateString;
  }
}

/**
 * Calculates treadmill distance in km/miles based on speed and duration
 */
export function calculateCardioDistance(durationMinutes: number, speedMph: number): number {
  if (durationMinutes <= 0 || speedMph <= 0) return 0;
  const distance = (speedMph * (durationMinutes / 60));
  return Math.round(distance * 100) / 100;
}

/**
 * Estimates treadmill calories burned based on speed, incline, duration, and body weight
 */
export function calculateCardioCalories(
  durationMinutes: number,
  speedMph: number,
  inclinePercent: number,
  bodyWeightKg = 75
): number {
  if (durationMinutes <= 0 || speedMph <= 0) return 0;
  // Approximate MET formula for treadmill with incline
  const speedMetersPerMin = speedMph * 26.8;
  const vo2 = (0.1 * speedMetersPerMin) + (1.8 * speedMetersPerMin * (inclinePercent / 100)) + 3.5;
  const met = vo2 / 3.5;
  const caloriesPerMinute = (met * 3.5 * bodyWeightKg) / 200;
  return Math.round(caloriesPerMinute * durationMinutes);
}
