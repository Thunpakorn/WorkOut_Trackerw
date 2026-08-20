"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  LayoutGrid,
  Plus,
  Play,
  Dumbbell,
  Sparkles,
  X,
  Check,
  Zap
} from "lucide-react";
import { useWorkout } from "@/lib/store";
import { MuscleGroup, ExerciseCategory } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";

export default function TemplatesPage() {
  const { templates, exercises, startWorkoutFromTemplate, addTemplate } = useWorkout();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  // New Template Form State
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [selectedExIds, setSelectedExIds] = useState<string[]>([]);

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || selectedExIds.length === 0) return;

    const chosenExercises = selectedExIds.map((exId) => {
      const ex = exercises.find((e) => e.id === exId);
      return {
        exerciseId: exId,
        exerciseName: ex?.name || "Exercise",
        category: (ex?.category || "strength") as ExerciseCategory,
        defaultSets: 3
      };
    });

    addTemplate({
      title: title.trim(),
      description: description.trim() || "Custom user template routine.",
      targetMuscleGroups: Array.from(
        new Set(
          chosenExercises.map(
            (ce) => exercises.find((e) => e.id === ce.exerciseId)?.muscleGroup || "full_body"
          )
        )
      ),
      exercises: chosenExercises,
      isCustom: true
    });

    setTitle("");
    setDescription("");
    setSelectedExIds([]);
    setIsCreateModalOpen(false);
  };

  const toggleExerciseSelect = (id: string) => {
    if (selectedExIds.includes(id)) {
      setSelectedExIds(selectedExIds.filter((item) => item !== id));
    } else {
      setSelectedExIds([...selectedExIds, id]);
    }
  };

  return (
    <div className="space-y-6 pb-24 max-w-4xl mx-auto px-4 pt-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-lime-500/20 text-lime-400">
            <LayoutGrid className="w-5 h-5 stroke-[2.5]" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-white">Workout Templates</h1>
            <p className="text-xs text-zinc-400">Reuse your favorite routines with 1 tap</p>
          </div>
        </div>

        <Button
          size="sm"
          onClick={() => setIsCreateModalOpen(false)}
          className="bg-lime-500 text-zinc-950 font-extrabold text-xs accent-glow gap-1"
          onClickCapture={() => setIsCreateModalOpen(true)}
        >
          <Plus className="w-4 h-4 stroke-[3]" />
          <span className="hidden sm:inline">New Template</span>
          <span className="sm:hidden">Create</span>
        </Button>
      </div>

      {/* Templates Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {templates.map((tpl) => (
          <Card
            key={tpl.id}
            className="border-zinc-800 bg-zinc-900/90 hover:border-lime-500/40 transition-all flex flex-col justify-between"
          >
            <CardContent className="p-5 space-y-4">
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <div className="flex flex-wrap gap-1">
                    {tpl.targetMuscleGroups.map((mg) => (
                      <Badge key={mg} variant="outline" className="text-[10px] uppercase">
                        {mg}
                      </Badge>
                    ))}
                  </div>
                  {tpl.isCustom && <Badge variant="cyan">Custom</Badge>}
                </div>

                <h3 className="text-lg font-black text-white">{tpl.title}</h3>
                <p className="text-xs text-zinc-400">{tpl.description}</p>
              </div>

              {/* Exercises in Template */}
              <div className="space-y-1 bg-zinc-950/60 p-3 rounded-2xl border border-zinc-800/80">
                <div className="text-[10px] uppercase font-extrabold text-zinc-400 mb-1">
                  Routine Exercises ({tpl.exercises.length})
                </div>
                {tpl.exercises.map((ex, idx) => (
                  <div key={idx} className="flex items-center justify-between text-xs text-zinc-300">
                    <span className="font-semibold">{ex.exerciseName}</span>
                    <span className="text-[11px] text-zinc-400">{ex.defaultSets} sets</span>
                  </div>
                ))}
              </div>

              {/* Start Routine CTA */}
              <Link href="/workout/active">
                <Button
                  size="lg"
                  onClick={() => startWorkoutFromTemplate(tpl.id)}
                  className="w-full bg-lime-500 text-zinc-950 font-black text-sm accent-glow"
                >
                  <Play className="w-4 h-4 fill-current mr-2" />
                  <span>Start Workout Session</span>
                </Button>
              </Link>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Create New Template Modal */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
          <div className="w-full max-w-lg bg-zinc-900 border border-zinc-800 rounded-3xl shadow-2xl overflow-hidden max-h-[85vh] flex flex-col p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <h3 className="text-lg font-bold text-white">Build Custom Workout Template</h3>
              <button onClick={() => setIsCreateModalOpen(false)} className="text-zinc-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateSubmit} className="space-y-4 flex-1 overflow-y-auto">
              <div className="space-y-1">
                <label className="text-xs font-bold text-zinc-400">Template Title</label>
                <Input
                  type="text"
                  placeholder="e.g., Upper Body Power / Leg & Core Burn"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-zinc-400">Short Description</label>
                <Input
                  type="text"
                  placeholder="e.g., Heavy bench press and lat pulldowns"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>

              {/* Select Exercises Checklist */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-zinc-400">
                  Select Exercises ({selectedExIds.length} selected)
                </label>
                <div className="max-h-48 overflow-y-auto space-y-1.5 p-2 bg-zinc-950 border border-zinc-800 rounded-xl">
                  {exercises.map((ex) => {
                    const isSelected = selectedExIds.includes(ex.id);
                    return (
                      <div
                        key={ex.id}
                        onClick={() => toggleExerciseSelect(ex.id)}
                        className={`flex items-center justify-between p-2 rounded-lg cursor-pointer text-xs transition-all ${
                          isSelected
                            ? "bg-lime-500/10 border border-lime-500/30 text-lime-400 font-bold"
                            : "hover:bg-zinc-900 text-zinc-300"
                        }`}
                      >
                        <span>{ex.name}</span>
                        <div
                          className={`w-5 h-5 rounded-md flex items-center justify-center border ${
                            isSelected
                              ? "bg-lime-500 text-zinc-950 border-lime-500"
                              : "border-zinc-700"
                          }`}
                        >
                          {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <Button type="submit" className="w-full bg-lime-500 text-zinc-950 font-black text-sm accent-glow">
                Save Workout Template
              </Button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
