"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Clock,
  CheckCircle2,
  Plus,
  ArrowLeft,
  X,
  Play,
  Check,
  Dumbbell,
  Timer,
  Edit2
} from "lucide-react";
import { useWorkout } from "@/lib/store";
import { formatDuration, calculateTotalVolume } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ExerciseCard } from "@/components/workout/exercise-card";
import { CardioCard } from "@/components/workout/cardio-card";
import { AddExerciseModal } from "@/components/workout/add-exercise-modal";
import { WorkoutSummaryModal } from "@/components/workout/workout-summary-modal";
import { RestTimerWidget } from "@/components/workout/rest-timer";

export default function ActiveWorkoutPage() {
  const router = useRouter();
  const {
    activeWorkout,
    autoSaveStatus,
    updateActiveWorkoutTitle,
    cancelActiveWorkout,
    startBlankWorkout,
    t,
    lang
  } = useWorkout();

  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [titleInput, setTitleInput] = useState("");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isSummaryModalOpen, setIsSummaryModalOpen] = useState(false);

  useEffect(() => {
    if (!activeWorkout) return;
    setTitleInput(activeWorkout.title);

    const startTime = new Date(activeWorkout.startTime).getTime();
    const updateTimer = () => {
      const now = Date.now();
      setElapsedSeconds(Math.max(0, Math.floor((now - startTime) / 1000)));
    };
    updateTimer();

    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, [activeWorkout]);

  if (!activeWorkout) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center p-4 text-center max-w-md mx-auto space-y-4">
        <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-zinc-900 border border-zinc-800 text-lime-400">
          <Dumbbell className="w-8 h-8" />
        </div>
        <div className="space-y-1">
          <h2 className="text-2xl font-black text-white">{t("noActiveSession")}</h2>
          <p className="text-xs text-zinc-400">
            {t("noActiveSub")}
          </p>
        </div>
        <Button
          size="lg"
          onClick={() => startBlankWorkout()}
          className="w-full bg-lime-500 text-zinc-950 font-black text-base accent-glow"
        >
          <Plus className="w-5 h-5 stroke-[3] mr-2" />
          <span>{t("startBlankWorkout")}</span>
        </Button>
        <Link href="/" className="text-xs text-zinc-400 hover:text-white font-bold">
          {t("backToDashboard")}
        </Link>
      </div>
    );
  }

  const handleTitleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (titleInput.trim()) {
      updateActiveWorkoutTitle(titleInput.trim());
    }
    setIsEditingTitle(false);
  };

  const currentVolume = calculateTotalVolume(activeWorkout);

  return (
    <div className="min-h-screen bg-zinc-950 pb-28">
      <RestTimerWidget />

      {/* Sticky Header */}
      <header className="sticky top-0 z-30 w-full border-b border-zinc-800 bg-zinc-950/90 backdrop-blur-md px-4 py-3">
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Link
              href="/"
              className="p-2 rounded-xl text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </Link>

            {isEditingTitle ? (
              <form onSubmit={handleTitleSubmit} className="flex items-center space-x-1">
                <input
                  type="text"
                  value={titleInput}
                  onChange={(e) => setTitleInput(e.target.value)}
                  className="bg-zinc-900 border border-lime-500 rounded-lg px-2 py-1 text-sm font-bold text-white focus:outline-none"
                  autoFocus
                />
                <button type="submit" className="p-1 text-lime-400 hover:text-lime-300">
                  <Check className="w-4 h-4" />
                </button>
              </form>
            ) : (
              <div
                onClick={() => setIsEditingTitle(true)}
                className="flex items-center space-x-1.5 cursor-pointer group"
              >
                <h1 className="text-base font-extrabold text-white group-hover:text-lime-400 transition-colors truncate max-w-[180px] sm:max-w-xs">
                  {activeWorkout.title}
                </h1>
                <Edit2 className="w-3.5 h-3.5 text-zinc-500 group-hover:text-lime-400" />
              </div>
            )}
          </div>

          <div className="flex items-center space-x-2">
            <div className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-zinc-900 border border-zinc-800 text-xs font-mono font-black text-lime-400">
              <Clock className="w-3.5 h-3.5 animate-pulse" />
              <span>{formatDuration(elapsedSeconds)}</span>
            </div>

            <Button
              size="sm"
              onClick={() => setIsSummaryModalOpen(true)}
              className="bg-lime-500 text-zinc-950 font-black text-xs px-3 accent-glow"
            >
              {t("finish")}
            </Button>
          </div>
        </div>
      </header>

      {/* Main Active Workout Session Content */}
      <main className="max-w-3xl mx-auto px-4 pt-4 space-y-4">
        {/* Workout Stats Quick Pill Bar */}
        <div className="flex items-center justify-between p-3 rounded-2xl bg-zinc-900/60 border border-zinc-800/80 text-xs">
          <div className="flex items-center space-x-4">
            <div>
              <span className="text-zinc-400">{t("totalVolume")}: </span>
              <span className="font-extrabold text-white tabular-nums">{currentVolume} kg</span>
            </div>
            <div>
              <span className="text-zinc-400">{t("exercisesCount")}: </span>
              <span className="font-extrabold text-white tabular-nums">
                {activeWorkout.exercises.length}
              </span>
            </div>
          </div>

          <div className="flex items-center space-x-1 text-zinc-400 text-[11px]">
            <CheckCircle2 className="w-3.5 h-3.5 text-lime-400" />
            <span className="hidden sm:inline">{t("autoSaved")}</span>
          </div>
        </div>

        {/* Exercises List */}
        {activeWorkout.exercises.length === 0 ? (
          <div className="text-center py-16 space-y-3 bg-zinc-900/40 rounded-3xl border border-dashed border-zinc-800 p-6">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-zinc-800 text-zinc-500 mx-auto">
              <Dumbbell className="w-7 h-7" />
            </div>
            <div className="space-y-1">
              <h3 className="text-lg font-bold text-white">{t("emptyWorkoutTitle")}</h3>
              <p className="text-xs text-zinc-400 max-w-xs mx-auto">
                {t("emptyWorkoutSub")}
              </p>
            </div>
            <Button
              size="lg"
              onClick={() => setIsAddModalOpen(true)}
              className="bg-lime-500 text-zinc-950 font-extrabold text-sm"
            >
              <Plus className="w-5 h-5 stroke-[3] mr-2" />
              <span>{t("addExercise")}</span>
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {activeWorkout.exercises.map((log) => {
              if (log.category === "cardio") {
                return <CardioCard key={log.id} log={log} />;
              }
              return <ExerciseCard key={log.id} log={log} />;
            })}

            <div className="pt-2">
              <Button
                size="lg"
                onClick={() => setIsAddModalOpen(true)}
                className="w-full bg-zinc-900 border border-zinc-800 hover:bg-zinc-800 text-lime-400 font-extrabold text-sm h-13 rounded-2xl"
              >
                <Plus className="w-5 h-5 stroke-[3] mr-2" />
                <span>{t("addExercise")}</span>
              </Button>
            </div>
          </div>
        )}

        <div className="pt-8 text-center">
          <button
            onClick={() => {
              if (confirm(t("confirmDiscard"))) {
                cancelActiveWorkout();
                router.push("/");
              }
            }}
            className="text-xs text-rose-400 hover:underline font-bold"
          >
            {t("discardWorkout")}
          </button>
        </div>
      </main>

      <AddExerciseModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
      />

      <WorkoutSummaryModal
        isOpen={isSummaryModalOpen}
        onClose={() => {
          setIsSummaryModalOpen(false);
          router.push("/history");
        }}
      />
    </div>
  );
}
