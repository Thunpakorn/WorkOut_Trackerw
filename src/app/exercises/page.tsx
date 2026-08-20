"use client";

import React, { useState } from "react";
import {
  BookOpen,
  Search,
  Plus,
  Dumbbell,
  Award,
  X,
  Sparkles,
  ChevronRight
} from "lucide-react";
import { useWorkout } from "@/lib/store";
import { Exercise, MuscleGroup, Equipment, ExerciseCategory } from "@/lib/types";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function ExerciseLibraryPage() {
  const { exercises, addCustomExercise } = useWorkout();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedMuscle, setSelectedMuscle] = useState<MuscleGroup | "all">("all");
  const [selectedExercise, setSelectedExercise] = useState<Exercise | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  // New Custom Exercise Form State
  const [newExName, setNewExName] = useState("");
  const [newExMuscle, setNewExMuscle] = useState<MuscleGroup>("chest");
  const [newExEquipment, setNewExEquipment] = useState<Equipment>("barbell");
  const [newExCategory, setNewExCategory] = useState<ExerciseCategory>("strength");

  const filteredExercises = exercises.filter((ex) => {
    const matchesSearch = ex.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesMuscle = selectedMuscle === "all" || ex.muscleGroup === selectedMuscle;
    return matchesSearch && matchesMuscle;
  });

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newExName.trim()) return;

    addCustomExercise({
      name: newExName.trim(),
      muscleGroup: newExMuscle,
      equipment: newExEquipment,
      category: newExCategory,
      isCustom: true
    });

    setNewExName("");
    setIsCreateModalOpen(false);
  };

  const muscleChips: { label: string; value: MuscleGroup | "all" }[] = [
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
    <div className="space-y-6 pb-24 max-w-4xl mx-auto px-4 pt-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-lime-500/20 text-lime-400">
            <BookOpen className="w-5 h-5 stroke-[2.5]" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-white">Exercise Library</h1>
            <p className="text-xs text-zinc-400">Browse exercises & manage personal records</p>
          </div>
        </div>

        <Button
          size="sm"
          onClick={() => setIsCreateModalOpen(true)}
          className="bg-lime-500 text-zinc-950 font-extrabold text-xs accent-glow gap-1"
        >
          <Plus className="w-4 h-4 stroke-[3]" />
          <span className="hidden sm:inline">Create Exercise</span>
          <span className="sm:hidden">New</span>
        </Button>
      </div>

      {/* Search Bar & Category Filter Chips */}
      <div className="space-y-3">
        <div className="relative">
          <Search className="absolute left-3.5 top-3 w-4 h-4 text-zinc-500" />
          <input
            type="text"
            placeholder="Search exercises by name or muscle group..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-11 pl-10 pr-4 bg-zinc-900/90 border border-zinc-800 rounded-2xl text-sm font-medium text-white placeholder:text-zinc-500 focus:border-lime-500 focus:outline-none"
          />
        </div>

        <div className="flex items-center space-x-1.5 overflow-x-auto no-scrollbar pb-1">
          {muscleChips.map((chip) => (
            <button
              key={chip.value}
              onClick={() => setSelectedMuscle(chip.value)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-colors ${
                selectedMuscle === chip.value
                  ? "bg-lime-500 text-zinc-950"
                  : "bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white"
              }`}
            >
              {chip.label}
            </button>
          ))}
        </div>
      </div>

      {/* Exercise Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {filteredExercises.map((ex) => (
          <Card
            key={ex.id}
            onClick={() => setSelectedExercise(ex)}
            className="border-zinc-800 bg-zinc-900/90 hover:border-lime-500/40 transition-all cursor-pointer group"
          >
            <CardContent className="p-4 flex items-center justify-between">
              <div className="space-y-1">
                <div className="flex items-center space-x-2">
                  <h3 className="text-base font-bold text-white group-hover:text-lime-400 transition-colors">
                    {ex.name}
                  </h3>
                  {ex.isCustom && <Badge variant="cyan">Custom</Badge>}
                </div>

                <div className="flex items-center space-x-2 text-xs text-zinc-400">
                  <Badge variant="outline" className="text-[10px] uppercase py-0">
                    {ex.muscleGroup}
                  </Badge>
                  <span className="capitalize">{ex.equipment}</span>
                </div>

                {ex.personalRecord && (
                  <div className="flex items-center space-x-1 text-[11px] font-bold text-amber-400 pt-1">
                    <Award className="w-3.5 h-3.5" />
                    <span>
                      PR: {ex.personalRecord.weight}kg × {ex.personalRecord.reps} (1RM ~{ex.personalRecord.estimated1RM}kg)
                    </span>
                  </div>
                )}
              </div>

              <ChevronRight className="w-5 h-5 text-zinc-600 group-hover:text-lime-400 transition-colors" />
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Exercise Detail Drawer / Modal */}
      {selectedExercise && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
          <div className="w-full max-w-md bg-zinc-900 border border-zinc-800 rounded-3xl shadow-2xl overflow-hidden p-6 space-y-4 text-left">
            <div className="flex items-start justify-between">
              <div>
                <Badge variant="outline" className="text-[10px] uppercase mb-1">
                  {selectedExercise.muscleGroup}
                </Badge>
                <h3 className="text-xl font-black text-white">{selectedExercise.name}</h3>
                <p className="text-xs text-zinc-400 capitalize">
                  Equipment: {selectedExercise.equipment}
                </p>
              </div>
              <button
                onClick={() => setSelectedExercise(null)}
                className="p-1 text-zinc-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Personal Record Highlight Card */}
            {selectedExercise.personalRecord ? (
              <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 space-y-2">
                <div className="flex items-center space-x-2 text-amber-400 text-xs font-bold uppercase tracking-wider">
                  <Award className="w-4 h-4" />
                  <span>Personal Best Record</span>
                </div>
                <div className="grid grid-cols-3 gap-2 text-center pt-1">
                  <div>
                    <span className="text-[10px] text-zinc-400 block uppercase">Weight</span>
                    <span className="text-lg font-black text-white">{selectedExercise.personalRecord.weight} kg</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-zinc-400 block uppercase">Reps</span>
                    <span className="text-lg font-black text-white">{selectedExercise.personalRecord.reps}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-zinc-400 block uppercase">Est. 1RM</span>
                    <span className="text-lg font-black text-lime-400">{selectedExercise.personalRecord.estimated1RM} kg</span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-4 rounded-2xl bg-zinc-950/60 border border-zinc-800 text-center text-xs text-zinc-400">
                No personal records logged for this exercise yet.
              </div>
            )}

            <Button
              size="lg"
              onClick={() => setSelectedExercise(null)}
              className="w-full bg-zinc-800 text-white font-bold"
            >
              Close
            </Button>
          </div>
        </div>
      )}

      {/* Create Custom Exercise Modal */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
          <div className="w-full max-w-md bg-zinc-900 border border-zinc-800 rounded-3xl shadow-2xl overflow-hidden p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <h3 className="text-lg font-bold text-white">Create Custom Exercise</h3>
              <button onClick={() => setIsCreateModalOpen(false)} className="text-zinc-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateSubmit} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-zinc-400">Exercise Name</label>
                <Input
                  type="text"
                  placeholder="e.g., Cable Flyes / Smith Hack Squat"
                  value={newExName}
                  onChange={(e) => setNewExName(e.target.value)}
                  required
                  autoFocus
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-zinc-400">Muscle Group</label>
                  <select
                    value={newExMuscle}
                    onChange={(e) => setNewExMuscle(e.target.value as MuscleGroup)}
                    className="w-full h-11 rounded-xl bg-zinc-950 border border-zinc-800 px-3 text-sm text-white focus:border-lime-500 focus:outline-none"
                  >
                    <option value="chest">Chest</option>
                    <option value="back">Back</option>
                    <option value="legs">Legs</option>
                    <option value="shoulders">Shoulders</option>
                    <option value="arms">Arms</option>
                    <option value="core">Core</option>
                    <option value="cardio">Cardio</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-zinc-400">Equipment</label>
                  <select
                    value={newExEquipment}
                    onChange={(e) => setNewExEquipment(e.target.value as Equipment)}
                    className="w-full h-11 rounded-xl bg-zinc-950 border border-zinc-800 px-3 text-sm text-white focus:border-lime-500 focus:outline-none"
                  >
                    <option value="barbell">Barbell</option>
                    <option value="dumbbell">Dumbbell</option>
                    <option value="cable">Cable</option>
                    <option value="machine">Machine</option>
                    <option value="bodyweight">Bodyweight</option>
                    <option value="treadmill">Treadmill</option>
                  </select>
                </div>
              </div>

              <Button type="submit" className="w-full bg-lime-500 text-zinc-950 font-black text-sm accent-glow">
                Save Custom Exercise
              </Button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
