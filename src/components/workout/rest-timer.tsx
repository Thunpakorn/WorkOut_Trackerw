"use client";

import React from "react";
import { Timer, Plus, Minus, X, Volume2 } from "lucide-react";
import { useWorkout } from "@/lib/store";
import { formatDuration } from "@/lib/utils";
import { Button } from "@/components/ui/button";

export function RestTimerWidget() {
  const { restTimer, stopRestTimer, adjustRestTimer } = useWorkout();

  if (!restTimer.active) return null;

  const progressPercent = Math.min(
    100,
    Math.max(0, (restTimer.secondsRemaining / restTimer.totalSeconds) * 100)
  );

  return (
    <div className="fixed top-16 left-0 right-0 z-50 px-3 py-2 flex justify-center animate-in slide-in-from-top-4 duration-300 pointer-events-none">
      <div className="w-full max-w-md bg-zinc-900/95 border border-lime-500/50 rounded-2xl p-3.5 shadow-2xl backdrop-blur-lg accent-border-glow pointer-events-auto flex flex-col space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-lime-500/20 text-lime-400">
              <Timer className="w-4 h-4 animate-spin-slow" />
            </div>
            <div>
              <div className="text-[10px] uppercase tracking-wider font-extrabold text-lime-400">
                Rest Timer
              </div>
              <div className="text-xs font-semibold text-zinc-300 truncate max-w-[180px]">
                {restTimer.exerciseName || "Between Sets"}
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <div className="text-2xl font-black tabular-nums tracking-tight text-white">
              {formatDuration(restTimer.secondsRemaining)}
            </div>

            <button
              onClick={() => stopRestTimer()}
              className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Visual Timer Progress Bar */}
        <div className="h-1.5 w-full bg-zinc-800 rounded-full overflow-hidden">
          <div
            className="h-full bg-lime-500 transition-all duration-1000 ease-linear"
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        {/* Quick Time Adjustment Controls */}
        <div className="flex items-center justify-between pt-1">
          <div className="flex items-center space-x-1.5">
            <button
              onClick={() => adjustRestTimer(-15)}
              className="px-2.5 py-1 rounded-lg bg-zinc-800 text-zinc-300 text-xs font-bold hover:bg-zinc-700 active:scale-95"
            >
              -15s
            </button>
            <button
              onClick={() => adjustRestTimer(30)}
              className="px-2.5 py-1 rounded-lg bg-zinc-800 text-zinc-300 text-xs font-bold hover:bg-zinc-700 active:scale-95 flex items-center space-x-1"
            >
              <Plus className="w-3 h-3 text-lime-400" />
              <span>30s</span>
            </button>
          </div>

          <Button
            size="sm"
            onClick={() => stopRestTimer()}
            className="h-7 px-3 text-xs bg-lime-500 text-zinc-950 font-extrabold"
          >
            Skip Rest
          </Button>
        </div>
      </div>
    </div>
  );
}
