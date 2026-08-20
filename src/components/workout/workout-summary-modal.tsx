"use client";

import React from "react";
import { Award, CheckCircle, Clock, Dumbbell, Flame, Trophy, ArrowRight } from "lucide-react";
import { useWorkout } from "@/lib/store";
import { formatDuration, calculateTotalVolume } from "@/lib/utils";
import { Button } from "@/components/ui/button";

export function WorkoutSummaryModal({
  isOpen,
  onClose
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const { activeWorkout, finishActiveWorkout } = useWorkout();

  if (!isOpen || !activeWorkout) return null;

  const totalVolume = calculateTotalVolume(activeWorkout);
  const startTime = new Date(activeWorkout.startTime).getTime();
  const elapsedSeconds = Math.max(60, Math.floor((Date.now() - startTime) / 1000));
  const exerciseCount = activeWorkout.exercises.length;

  const handleConfirmSave = () => {
    finishActiveWorkout();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="w-full max-w-md bg-zinc-900 border border-lime-500/40 rounded-3xl shadow-2xl overflow-hidden text-center accent-border-glow">
        {/* Celebration Header */}
        <div className="p-6 bg-gradient-to-b from-lime-500/20 to-transparent flex flex-col items-center">
          <div className="h-16 w-16 rounded-full bg-lime-500 text-zinc-950 flex items-center justify-center shadow-xl mb-3 accent-glow animate-bounce">
            <Trophy className="w-8 h-8 fill-current" />
          </div>
          <h2 className="text-2xl font-black text-white">Workout Complete!</h2>
          <p className="text-xs text-lime-400 font-bold uppercase tracking-wider mt-1">
            Great Hustle Today!
          </p>
        </div>

        {/* Workout Session Details */}
        <div className="p-6 pt-0 space-y-4">
          <div className="p-4 rounded-2xl bg-zinc-950/80 border border-zinc-800 space-y-1">
            <div className="text-xs text-zinc-400 font-semibold">Workout Session</div>
            <div className="text-lg font-bold text-white">{activeWorkout.title}</div>
          </div>

          {/* Key Metrics Grid */}
          <div className="grid grid-cols-2 gap-3">
            <div className="p-3.5 rounded-2xl bg-zinc-950/80 border border-zinc-800 flex flex-col items-center">
              <Clock className="w-5 h-5 text-lime-400 mb-1" />
              <span className="text-[10px] uppercase font-bold text-zinc-400">Duration</span>
              <span className="text-xl font-black text-white tabular-nums">
                {formatDuration(elapsedSeconds)}
              </span>
            </div>

            <div className="p-3.5 rounded-2xl bg-zinc-950/80 border border-zinc-800 flex flex-col items-center">
              <Dumbbell className="w-5 h-5 text-lime-400 mb-1" />
              <span className="text-[10px] uppercase font-bold text-zinc-400">Total Volume</span>
              <span className="text-xl font-black text-white tabular-nums">
                {totalVolume} <span className="text-xs text-zinc-400 font-semibold">kg</span>
              </span>
            </div>
          </div>

          {/* Action CTAs */}
          <div className="pt-2 space-y-2">
            <Button
              size="lg"
              onClick={handleConfirmSave}
              className="w-full bg-lime-500 text-zinc-950 font-black text-base shadow-xl accent-glow"
            >
              <span>Save Session to History</span>
              <ArrowRight className="w-5 h-5 stroke-[3] ml-2" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
