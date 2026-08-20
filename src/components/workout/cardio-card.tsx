"use client";

import React from "react";
import { Activity, Flame, Heart, Navigation, Trash2, Clock, Gauge } from "lucide-react";
import { ExerciseLog } from "@/lib/types";
import { useWorkout } from "@/lib/store";
import { calculateCardioDistance, calculateCardioCalories } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

export function CardioCard({ log }: { log: ExerciseLog }) {
  const { updateCardioEntry, removeExerciseFromActiveWorkout } = useWorkout();

  const cardio = log.cardio || {
    durationMinutes: 20,
    incline: 3.0,
    speed: 5.5,
    avgHeartRate: 145,
    caloriesBurned: 220,
    distanceKm: 2.8
  };

  const handleChange = (field: keyof typeof cardio, val: number) => {
    const updated = { ...cardio, [field]: val };

    // Auto calculate distance & calories when speed/duration/incline changes
    const newDistance = calculateCardioDistance(updated.durationMinutes, updated.speed);
    const newCalories = calculateCardioCalories(updated.durationMinutes, updated.speed, updated.incline);

    updateCardioEntry(log.id, {
      ...updated,
      distanceKm: newDistance,
      caloriesBurned: newCalories
    });
  };

  return (
    <div className="rounded-2xl border border-cyan-500/30 bg-zinc-900/90 overflow-hidden shadow-xl transition-all">
      {/* Cardio Card Header */}
      <div className="flex items-center justify-between p-4 bg-cyan-950/20 border-b border-cyan-500/20">
        <div className="flex items-center space-x-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-cyan-500/20 text-cyan-400 font-extrabold text-sm border border-cyan-500/30">
            <Activity className="w-5 h-5 stroke-[2.5]" />
          </div>
          <div>
            <h4 className="text-base font-bold text-white leading-snug">
              {log.exerciseName}
            </h4>
            <div className="flex items-center space-x-2 mt-0.5">
              <Badge variant="cyan" className="text-[10px] uppercase tracking-wider py-0 px-2">
                Treadmill Cardio
              </Badge>
            </div>
          </div>
        </div>

        <button
          onClick={() => removeExerciseFromActiveWorkout(log.id)}
          className="p-2 rounded-xl text-zinc-500 hover:text-rose-400 hover:bg-zinc-800/60 transition-colors"
          title="Remove Exercise"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>

      <div className="p-4 space-y-4">
        {/* Quick Calculated Highlights Grid */}
        <div className="grid grid-cols-2 gap-3">
          <div className="p-3 rounded-xl bg-zinc-950/70 border border-zinc-800 flex items-center space-x-3">
            <div className="p-2 rounded-lg bg-cyan-500/10 text-cyan-400">
              <Navigation className="w-4 h-4" />
            </div>
            <div>
              <div className="text-[10px] uppercase font-bold text-zinc-400">Est. Distance</div>
              <div className="text-lg font-black text-white tabular-nums">
                {cardio.distanceKm || calculateCardioDistance(cardio.durationMinutes, cardio.speed)} <span className="text-xs font-semibold text-zinc-400">km</span>
              </div>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-zinc-950/70 border border-zinc-800 flex items-center space-x-3">
            <div className="p-2 rounded-lg bg-amber-500/10 text-amber-400">
              <Flame className="w-4 h-4" />
            </div>
            <div>
              <div className="text-[10px] uppercase font-bold text-zinc-400">Est. Burn</div>
              <div className="text-lg font-black text-white tabular-nums">
                {cardio.caloriesBurned || calculateCardioCalories(cardio.durationMinutes, cardio.speed, cardio.incline)} <span className="text-xs font-semibold text-zinc-400">kcal</span>
              </div>
            </div>
          </div>
        </div>

        {/* Form Inputs Grid */}
        <div className="grid grid-cols-2 gap-3">
          {/* Duration Minutes */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-zinc-400 flex items-center space-x-1">
              <Clock className="w-3.5 h-3.5 text-cyan-400" />
              <span>Duration (min)</span>
            </label>
            <div className="flex items-center space-x-1">
              <button
                type="button"
                onClick={() => handleChange("durationMinutes", Math.max(1, cardio.durationMinutes - 5))}
                className="w-8 h-10 rounded-lg bg-zinc-800 font-bold text-white hover:bg-zinc-700"
              >
                -5
              </button>
              <input
                type="number"
                value={cardio.durationMinutes}
                onChange={(e) => handleChange("durationMinutes", parseFloat(e.target.value) || 0)}
                className="flex-1 h-10 rounded-lg bg-zinc-950 border border-zinc-800 text-center font-bold text-base text-white tabular-nums focus:border-cyan-500 focus:outline-none"
              />
              <button
                type="button"
                onClick={() => handleChange("durationMinutes", cardio.durationMinutes + 5)}
                className="w-8 h-10 rounded-lg bg-zinc-800 font-bold text-white hover:bg-zinc-700"
              >
                +5
              </button>
            </div>
          </div>

          {/* Speed (mph / kph) */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-zinc-400 flex items-center space-x-1">
              <Gauge className="w-3.5 h-3.5 text-cyan-400" />
              <span>Speed (mph)</span>
            </label>
            <div className="flex items-center space-x-1">
              <button
                type="button"
                onClick={() => handleChange("speed", Math.max(0.5, Math.round((cardio.speed - 0.5) * 10) / 10))}
                className="w-8 h-10 rounded-lg bg-zinc-800 font-bold text-white hover:bg-zinc-700"
              >
                -0.5
              </button>
              <input
                type="number"
                step="0.1"
                value={cardio.speed}
                onChange={(e) => handleChange("speed", parseFloat(e.target.value) || 0)}
                className="flex-1 h-10 rounded-lg bg-zinc-950 border border-zinc-800 text-center font-bold text-base text-white tabular-nums focus:border-cyan-500 focus:outline-none"
              />
              <button
                type="button"
                onClick={() => handleChange("speed", Math.round((cardio.speed + 0.5) * 10) / 10)}
                className="w-8 h-10 rounded-lg bg-zinc-800 font-bold text-white hover:bg-zinc-700"
              >
                +0.5
              </button>
            </div>
          </div>

          {/* Incline Percent */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-zinc-400 flex items-center space-x-1">
              <Activity className="w-3.5 h-3.5 text-cyan-400" />
              <span>Incline (%)</span>
            </label>
            <div className="flex items-center space-x-1">
              <button
                type="button"
                onClick={() => handleChange("incline", Math.max(0, Math.round((cardio.incline - 1) * 10) / 10))}
                className="w-8 h-10 rounded-lg bg-zinc-800 font-bold text-white hover:bg-zinc-700"
              >
                -1
              </button>
              <input
                type="number"
                step="0.5"
                value={cardio.incline}
                onChange={(e) => handleChange("incline", parseFloat(e.target.value) || 0)}
                className="flex-1 h-10 rounded-lg bg-zinc-950 border border-zinc-800 text-center font-bold text-base text-white tabular-nums focus:border-cyan-500 focus:outline-none"
              />
              <button
                type="button"
                onClick={() => handleChange("incline", Math.round((cardio.incline + 1) * 10) / 10)}
                className="w-8 h-10 rounded-lg bg-zinc-800 font-bold text-white hover:bg-zinc-700"
              >
                +1
              </button>
            </div>
          </div>

          {/* Heart Rate */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-zinc-400 flex items-center space-x-1">
              <Heart className="w-3.5 h-3.5 text-rose-400" />
              <span>Avg Heart Rate</span>
            </label>
            <input
              type="number"
              value={cardio.avgHeartRate || ""}
              placeholder="e.g. 145"
              onChange={(e) => handleChange("avgHeartRate", parseInt(e.target.value, 10) || 0)}
              className="w-full h-10 rounded-lg bg-zinc-950 border border-zinc-800 text-center font-bold text-base text-white tabular-nums focus:border-rose-500 focus:outline-none"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
