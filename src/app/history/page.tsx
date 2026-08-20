"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  History as HistoryIcon,
  Search,
  Calendar,
  Clock,
  Dumbbell,
  Trash2,
  ChevronRight,
  X,
  Eye,
  Award,
  Activity
} from "lucide-react";
import { useWorkout } from "@/lib/store";
import { formatDate, formatDuration } from "@/lib/utils";
import { WorkoutSession } from "@/lib/types";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

export default function HistoryPage() {
  const { history, deleteHistorySession, copyLastWorkout } = useWorkout();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFilter, setSelectedFilter] = useState<"all" | "strength" | "cardio">("all");
  const [selectedSession, setSelectedSession] = useState<WorkoutSession | null>(null);

  // State toggles for demonstration
  const [showEmptyState, setShowEmptyState] = useState(false);
  const [isLoadingState, setIsLoadingState] = useState(false);

  const displayHistory = showEmptyState ? [] : history;

  const filteredHistory = displayHistory.filter((session) => {
    const matchesSearch =
      session.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      session.exercises.some((e) => e.exerciseName.toLowerCase().includes(searchQuery.toLowerCase()));

    if (selectedFilter === "strength") {
      return matchesSearch && session.exercises.some((e) => e.category === "strength");
    }
    if (selectedFilter === "cardio") {
      return matchesSearch && session.exercises.some((e) => e.category === "cardio");
    }
    return matchesSearch;
  });

  return (
    <div className="space-y-6 pb-24 max-w-4xl mx-auto px-4 pt-4">
      {/* Page Title Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-lime-500/20 text-lime-400">
            <HistoryIcon className="w-5 h-5 stroke-[2.5]" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-white">Workout History</h1>
            <p className="text-xs text-zinc-400">Review past sessions & set performance</p>
          </div>
        </div>
      </div>

      {/* State Toggle Preview Bar */}
      <div className="flex items-center justify-between p-3 rounded-2xl bg-zinc-900/90 border border-zinc-800 text-xs">
        <div className="flex items-center space-x-2 text-zinc-400">
          <Eye className="w-4 h-4 text-lime-400" />
          <span className="font-bold">UI State Preview:</span>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => {
              setIsLoadingState(false);
              setShowEmptyState(!showEmptyState);
            }}
            className={`px-3 py-1 rounded-lg font-bold transition-colors ${
              showEmptyState
                ? "bg-amber-500/20 text-amber-400 border border-amber-500/30"
                : "bg-zinc-800 text-zinc-300 hover:text-white"
            }`}
          >
            {showEmptyState ? "Exit Empty State" : "Show Empty State"}
          </button>

          <button
            onClick={() => {
              setShowEmptyState(false);
              setIsLoadingState(!isLoadingState);
            }}
            className={`px-3 py-1 rounded-lg font-bold transition-colors ${
              isLoadingState
                ? "bg-cyan-500/20 text-cyan-400 border border-cyan-500/30"
                : "bg-zinc-800 text-zinc-300 hover:text-white"
            }`}
          >
            {isLoadingState ? "Exit Loading State" : "Show Loading State"}
          </button>
        </div>
      </div>

      {/* Search & Category Filter Chips */}
      <div className="space-y-3">
        <div className="relative">
          <Search className="absolute left-3.5 top-3 w-4 h-4 text-zinc-500" />
          <input
            type="text"
            placeholder="Search history by title or exercise..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-11 pl-10 pr-4 bg-zinc-900/90 border border-zinc-800 rounded-2xl text-sm font-medium text-white placeholder:text-zinc-500 focus:border-lime-500 focus:outline-none"
          />
        </div>

        <div className="flex items-center space-x-2">
          {[
            { label: "All Sessions", value: "all" },
            { label: "Strength", value: "strength" },
            { label: "Treadmill Cardio", value: "cardio" }
          ].map((tab) => (
            <button
              key={tab.value}
              onClick={() => setSelectedFilter(tab.value as any)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-colors ${
                selectedFilter === tab.value
                  ? "bg-lime-500 text-zinc-950"
                  : "bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Loading Skeleton Representation */}
      {isLoadingState ? (
        <div className="space-y-3">
          <Skeleton className="h-28 w-full" />
          <Skeleton className="h-28 w-full" />
          <Skeleton className="h-28 w-full" />
        </div>
      ) : filteredHistory.length === 0 ? (
        /* Empty State Display */
        <Card className="border-dashed border-zinc-800 bg-zinc-900/40 py-16 text-center space-y-3">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-zinc-800 text-zinc-500 mx-auto">
            <HistoryIcon className="w-7 h-7" />
          </div>
          <div className="space-y-1">
            <h3 className="text-lg font-bold text-white">No Workout History Found</h3>
            <p className="text-xs text-zinc-400 max-w-xs mx-auto">
              Completed workouts will automatically appear here grouped by date.
            </p>
          </div>
        </Card>
      ) : (
        /* Sessions List */
        <div className="space-y-3">
          {filteredHistory.map((session) => (
            <Card
              key={session.id}
              onClick={() => setSelectedSession(session)}
              className="border-zinc-800 bg-zinc-900/90 hover:border-lime-500/40 transition-all cursor-pointer group"
            >
              <CardContent className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="space-y-1.5">
                  <div className="flex items-center space-x-2 text-xs text-zinc-400">
                    <Calendar className="w-3.5 h-3.5 text-lime-400" />
                    <span>{formatDate(session.startTime, true)}</span>
                  </div>
                  <h3 className="text-base font-extrabold text-white group-hover:text-lime-400 transition-colors">
                    {session.title}
                  </h3>

                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {session.exercises.map((ex) => (
                      <Badge key={ex.id} variant="secondary" className="text-[10px]">
                        {ex.exerciseName}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="flex items-center justify-between sm:justify-end space-x-4 border-t sm:border-t-0 border-zinc-800 pt-2 sm:pt-0">
                  <div className="text-right">
                    <div className="text-[10px] uppercase font-bold text-zinc-500">Volume</div>
                    <div className="text-sm font-black text-white tabular-nums">
                      {session.totalVolumeKg} kg
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="text-[10px] uppercase font-bold text-zinc-500">Duration</div>
                    <div className="text-sm font-black text-white tabular-nums">
                      {formatDuration(session.durationSeconds)}
                    </div>
                  </div>

                  <ChevronRight className="w-5 h-5 text-zinc-600 group-hover:text-lime-400 transition-colors" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Session Detail Modal */}
      {selectedSession && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
          <div className="w-full max-w-lg bg-zinc-900 border border-zinc-800 rounded-3xl shadow-2xl overflow-hidden max-h-[85vh] flex flex-col">
            {/* Header */}
            <div className="p-4 border-b border-zinc-800 flex items-center justify-between bg-zinc-950/60">
              <div>
                <h3 className="text-base font-bold text-white">{selectedSession.title}</h3>
                <p className="text-xs text-zinc-400">{formatDate(selectedSession.startTime, true)}</p>
              </div>
              <button
                onClick={() => setSelectedSession(null)}
                className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Session Stats Summary Header */}
            <div className="grid grid-cols-2 gap-2 p-4 bg-zinc-950/40 border-b border-zinc-800 text-center">
              <div className="p-2.5 rounded-xl bg-zinc-900 border border-zinc-800">
                <div className="text-[10px] font-bold text-zinc-400 uppercase">Total Volume</div>
                <div className="text-base font-black text-lime-400 tabular-nums">
                  {selectedSession.totalVolumeKg} kg
                </div>
              </div>
              <div className="p-2.5 rounded-xl bg-zinc-900 border border-zinc-800">
                <div className="text-[10px] font-bold text-zinc-400 uppercase">Duration</div>
                <div className="text-base font-black text-lime-400 tabular-nums">
                  {formatDuration(selectedSession.durationSeconds)}
                </div>
              </div>
            </div>

            {/* Session Exercise Breakdown */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {selectedSession.exercises.map((log) => (
                <div key={log.id} className="p-3.5 rounded-2xl bg-zinc-950 border border-zinc-800 space-y-2">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-bold text-white">{log.exerciseName}</h4>
                    <Badge variant="outline" className="text-[10px] uppercase">
                      {log.muscleGroup}
                    </Badge>
                  </div>

                  {log.category === "cardio" && log.cardio ? (
                    <div className="grid grid-cols-3 gap-2 text-xs text-center pt-1">
                      <div className="p-2 rounded-lg bg-zinc-900">
                        <span className="text-zinc-500 block text-[10px]">Time</span>
                        <span className="font-bold text-white">{log.cardio.durationMinutes} min</span>
                      </div>
                      <div className="p-2 rounded-lg bg-zinc-900">
                        <span className="text-zinc-500 block text-[10px]">Speed</span>
                        <span className="font-bold text-white">{log.cardio.speed} mph</span>
                      </div>
                      <div className="p-2 rounded-lg bg-zinc-900">
                        <span className="text-zinc-500 block text-[10px]">Incline</span>
                        <span className="font-bold text-white">{log.cardio.incline}%</span>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-1 pt-1">
                      {log.sets.map((set) => (
                        <div
                          key={set.id}
                          className="flex items-center justify-between text-xs py-1 px-2 rounded-lg bg-zinc-900/60"
                        >
                          <span className="text-zinc-400 font-bold">Set {set.setNumber}</span>
                          <span className="font-mono font-bold text-white">
                            {set.weight} kg × {set.reps} reps
                          </span>
                          {set.isPR && <Badge variant="gold">PR!</Badge>}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Footer Actions */}
            <div className="p-4 border-t border-zinc-800 flex items-center justify-between bg-zinc-950/60">
              <button
                onClick={() => {
                  deleteHistorySession(selectedSession.id);
                  setSelectedSession(null);
                }}
                className="text-xs font-bold text-rose-400 hover:underline flex items-center space-x-1"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Delete Session</span>
              </button>

              <Link href="/workout/active">
                <Button
                  size="sm"
                  onClick={() => {
                    copyLastWorkout(selectedSession.id);
                    setSelectedSession(null);
                  }}
                  className="bg-lime-500 text-zinc-950 font-bold text-xs"
                >
                  Copy Session
                </Button>
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
