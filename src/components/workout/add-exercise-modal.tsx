"use client";

import React, { useState } from "react";
import { Search, X, Plus, Dumbbell, Filter } from "lucide-react";
import { useWorkout } from "@/lib/store";
import { MuscleGroup } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export function AddExerciseModal({
  isOpen,
  onClose
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const { exercises, addExerciseToActiveWorkout } = useWorkout();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedMuscle, setSelectedMuscle] = useState<MuscleGroup | "all">("all");

  if (!isOpen) return null;

  const filteredExercises = exercises.filter((ex) => {
    const matchesSearch = ex.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesMuscle = selectedMuscle === "all" || ex.muscleGroup === selectedMuscle;
    return matchesSearch && matchesMuscle;
  });

  const handleSelect = (exerciseId: string) => {
    addExerciseToActiveWorkout(exerciseId);
    onClose();
  };

  const muscleFilters: { label: string; value: MuscleGroup | "all" }[] = [
    { label: "All", value: "all" },
    { label: "Chest", value: "chest" },
    { label: "Back", value: "back" },
    { label: "Legs", value: "legs" },
    { label: "Shoulders", value: "shoulders" },
    { label: "Arms", value: "arms" },
    { label: "Core", value: "core" },
    { label: "Cardio", value: "cardio" }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-lg bg-zinc-900 border border-zinc-800 rounded-t-3xl sm:rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="p-4 border-b border-zinc-800 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-lime-500/20 text-lime-400">
              <Dumbbell className="w-4 h-4 stroke-[2.5]" />
            </div>
            <h3 className="text-base font-bold text-white">Add Exercise</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search Bar */}
        <div className="p-4 border-b border-zinc-800 space-y-3 bg-zinc-950/40">
          <div className="relative">
            <Search className="absolute left-3.5 top-3 w-4 h-4 text-zinc-500" />
            <input
              type="text"
              placeholder="Search exercise by name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-11 pl-10 pr-4 bg-zinc-950 border border-zinc-800 rounded-xl text-sm font-medium text-white placeholder:text-zinc-500 focus:border-lime-500 focus:outline-none"
              autoFocus
            />
          </div>

          {/* Muscle Category Filter Chips */}
          <div className="flex items-center space-x-1.5 overflow-x-auto no-scrollbar pb-1">
            {muscleFilters.map((chip) => (
              <button
                key={chip.value}
                onClick={() => setSelectedMuscle(chip.value)}
                className={`px-3 py-1 rounded-lg text-xs font-bold whitespace-nowrap transition-colors ${
                  selectedMuscle === chip.value
                    ? "bg-lime-500 text-zinc-950"
                    : "bg-zinc-800/80 text-zinc-400 hover:text-white hover:bg-zinc-800"
                }`}
              >
                {chip.label}
              </button>
            ))}
          </div>
        </div>

        {/* Exercise List */}
        <div className="flex-1 overflow-y-auto p-3 space-y-2 divide-y divide-zinc-800/40">
          {filteredExercises.length === 0 ? (
            <div className="text-center py-10 space-y-2">
              <p className="text-sm font-semibold text-zinc-400">No exercises found</p>
              <p className="text-xs text-zinc-500">Try adjusting your search query or filter</p>
            </div>
          ) : (
            filteredExercises.map((ex) => (
              <div
                key={ex.id}
                onClick={() => handleSelect(ex.id)}
                className="flex items-center justify-between p-3 rounded-xl hover:bg-zinc-800/60 cursor-pointer transition-all group"
              >
                <div>
                  <div className="text-sm font-bold text-white group-hover:text-lime-400 transition-colors">
                    {ex.name}
                  </div>
                  <div className="flex items-center space-x-2 mt-1">
                    <Badge variant="outline" className="text-[10px] uppercase">
                      {ex.muscleGroup}
                    </Badge>
                    <span className="text-xs text-zinc-500 capitalize">{ex.equipment}</span>
                  </div>
                </div>

                <Button size="sm" variant="secondary" className="h-8 w-8 p-0 rounded-lg group-hover:bg-lime-500 group-hover:text-zinc-950">
                  <Plus className="w-4 h-4 stroke-[3]" />
                </Button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
