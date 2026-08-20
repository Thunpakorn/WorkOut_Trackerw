"use client";

import React, { useState } from "react";
import {
  Check,
  Plus,
  Minus,
  Trash2,
  Copy,
  Flame,
  Award,
  ChevronDown,
  ChevronUp
} from "lucide-react";
import { ExerciseLog, WorkoutSet } from "@/lib/types";
import { useWorkout } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export function ExerciseCard({ log }: { log: ExerciseLog }) {
  const {
    updateSet,
    addSetToExercise,
    removeSetFromExercise,
    removeExerciseFromActiveWorkout
  } = useWorkout();

  const [activeStepper, setActiveStepper] = useState<{
    setId: string;
    field: "weight" | "reps";
  } | null>(null);

  const handleStep = (setId: string, currentVal: number, delta: number, field: "weight" | "reps") => {
    const newVal = Math.max(0, currentVal + delta);
    updateSet(log.id, setId, { [field]: newVal });
  };

  return (
    <div className="rounded-2xl border border-zinc-800 bg-zinc-900/90 overflow-hidden shadow-lg transition-all">
      {/* Exercise Header */}
      <div className="flex items-center justify-between p-4 bg-zinc-900/95 border-b border-zinc-800/80">
        <div className="flex items-center space-x-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-lime-500/10 text-lime-400 font-extrabold text-sm border border-lime-500/20">
            {log.exerciseName.substring(0, 2).toUpperCase()}
          </div>
          <div>
            <h4 className="text-base font-bold text-white leading-snug">
              {log.exerciseName}
            </h4>
            <div className="flex items-center space-x-2 mt-0.5">
              <Badge variant="outline" className="text-[10px] uppercase tracking-wider py-0 px-2">
                {log.muscleGroup}
              </Badge>
              <span className="text-[11px] text-zinc-400">
                {log.sets.length} {log.sets.length === 1 ? "set" : "sets"}
              </span>
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

      {/* Sets Table Header */}
      <div className="grid grid-cols-12 gap-1 px-4 py-2 bg-zinc-950/40 text-[11px] font-extrabold uppercase tracking-wider text-zinc-400 border-b border-zinc-800/50 text-center">
        <div className="col-span-2 text-left">Set</div>
        <div className="col-span-3">Previous</div>
        <div className="col-span-3">Weight (kg)</div>
        <div className="col-span-2">Reps</div>
        <div className="col-span-2 text-right">Done</div>
      </div>

      {/* Set Rows */}
      <div className="divide-y divide-zinc-800/40 px-2 py-1">
        {log.sets.map((set) => (
          <div
            key={set.id}
            className={cn(
              "grid grid-cols-12 gap-1.5 items-center p-2 rounded-xl transition-all my-1",
              set.completed
                ? "bg-lime-500/5 border border-lime-500/20"
                : "hover:bg-zinc-800/30"
            )}
          >
            {/* Set Badge */}
            <div className="col-span-2 flex items-center space-x-1">
              <button
                type="button"
                onClick={() => {
                  const types: WorkoutSet["type"][] = ["normal", "warmup", "drop", "failure"];
                  const nextType = types[(types.indexOf(set.type) + 1) % types.length];
                  updateSet(log.id, set.id, { type: nextType });
                }}
                className={cn(
                  "w-7 h-7 rounded-lg text-xs font-black flex items-center justify-center border transition-all",
                  set.type === "warmup" && "bg-amber-500/20 border-amber-500/40 text-amber-400",
                  set.type === "drop" && "bg-cyan-500/20 border-cyan-500/40 text-cyan-400",
                  set.type === "failure" && "bg-rose-500/20 border-rose-500/40 text-rose-400",
                  set.type === "normal" && "bg-zinc-800 border-zinc-700 text-zinc-300"
                )}
                title="Tap to toggle set type (Normal, Warmup, Drop, Failure)"
              >
                {set.type === "warmup" ? "W" : set.type === "drop" ? "D" : set.type === "failure" ? "F" : set.setNumber}
              </button>
              {set.isPR && (
                <span title="Personal Record!">
                  <Award className="w-3.5 h-3.5 text-amber-400 animate-bounce" />
                </span>
              )}
            </div>

            {/* Previous performance column */}
            <div className="col-span-3 text-center text-xs text-zinc-400 font-mono">
              {set.previousWeight ? (
                <span>
                  {set.previousWeight}kg × {set.previousReps}
                </span>
              ) : (
                <span className="text-zinc-600">—</span>
              )}
            </div>

            {/* Weight Input + Stepper */}
            <div className="col-span-3 flex items-center space-x-1 justify-center">
              <button
                onClick={() => handleStep(set.id, set.weight, -2.5, "weight")}
                className="w-7 h-8 rounded-lg bg-zinc-800 text-zinc-300 font-bold hover:bg-zinc-700 flex items-center justify-center text-xs"
              >
                -
              </button>
              <input
                type="number"
                value={set.weight}
                onChange={(e) =>
                  updateSet(log.id, set.id, { weight: parseFloat(e.target.value) || 0 })
                }
                className="w-14 h-8 rounded-lg bg-zinc-950 border border-zinc-700 text-center font-bold text-sm text-white focus:border-lime-500 focus:outline-none tabular-nums"
              />
              <button
                onClick={() => handleStep(set.id, set.weight, 2.5, "weight")}
                className="w-7 h-8 rounded-lg bg-zinc-800 text-zinc-300 font-bold hover:bg-zinc-700 flex items-center justify-center text-xs"
              >
                +
              </button>
            </div>

            {/* Reps Input + Stepper */}
            <div className="col-span-2 flex items-center space-x-1 justify-center">
              <input
                type="number"
                value={set.reps}
                onChange={(e) =>
                  updateSet(log.id, set.id, { reps: parseInt(e.target.value, 10) || 0 })
                }
                className="w-11 h-8 rounded-lg bg-zinc-950 border border-zinc-700 text-center font-bold text-sm text-white focus:border-lime-500 focus:outline-none tabular-nums"
              />
            </div>

            {/* Checkbox Complete */}
            <div className="col-span-2 flex items-center justify-end space-x-1">
              <button
                type="button"
                onClick={() => updateSet(log.id, set.id, { completed: !set.completed })}
                className={cn(
                  "w-9 h-9 rounded-xl flex items-center justify-center transition-all touch-manipulation shadow-md",
                  set.completed
                    ? "bg-lime-500 text-zinc-950 scale-105 accent-glow"
                    : "bg-zinc-800 text-zinc-400 hover:text-white hover:bg-zinc-700 border border-zinc-700/80"
                )}
              >
                <Check className={cn("w-5 h-5 stroke-[3]", set.completed && "text-zinc-950")} />
              </button>

              <button
                type="button"
                onClick={() => removeSetFromExercise(log.id, set.id)}
                className="p-1 text-zinc-600 hover:text-rose-400 transition-colors"
                title="Delete Set"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Card Footer Action: Add Set */}
      <div className="p-3 bg-zinc-950/30 border-t border-zinc-800/60 flex items-center justify-between">
        <Button
          type="button"
          variant="secondary"
          size="sm"
          onClick={() => addSetToExercise(log.id)}
          className="w-full text-xs font-bold gap-1 bg-zinc-800/80 hover:bg-zinc-800 text-lime-400"
        >
          <Plus className="w-4 h-4 stroke-[3]" />
          <span>Add Set</span>
        </Button>
      </div>
    </div>
  );
}
