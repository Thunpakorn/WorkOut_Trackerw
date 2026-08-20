"use client";

import React, { useState } from "react";
import {
  TrendingUp,
  Award,
  Calendar,
  Activity,
  Dumbbell,
  Flame,
  ChevronDown
} from "lucide-react";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid
} from "recharts";
import { useWorkout } from "@/lib/store";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function StatsPage() {
  const { history, exercises } = useWorkout();
  const [selectedExId, setSelectedExId] = useState<string>("ex-1"); // Barbell Bench Press default

  // Weekly Volume Data Preparation
  const volumeChartData = history
    .slice(0, 7)
    .reverse()
    .map((sess) => ({
      date: new Date(sess.startTime).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
      volume: sess.totalVolumeKg,
      title: sess.title
    }));

  // Selected Exercise 1RM Progression Data
  const selectedExDef = exercises.find((e) => e.id === selectedExId);
  const exerciseHistoryData: { date: string; maxWeight: number; estimated1RM: number }[] = [];

  history.forEach((sess) => {
    const exLog = sess.exercises.find((e) => e.exerciseId === selectedExId);
    if (exLog && exLog.sets) {
      let maxSetWeight = 0;
      let max1RM = 0;
      exLog.sets.forEach((set) => {
        if (set.completed && set.weight > 0) {
          if (set.weight > maxSetWeight) maxSetWeight = set.weight;
          const est = Math.round(set.weight * (1 + set.reps / 30));
          if (est > max1RM) max1RM = est;
        }
      });
      if (max1RM > 0) {
        exerciseHistoryData.push({
          date: new Date(sess.startTime).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
          maxWeight: maxSetWeight,
          estimated1RM: max1RM
        });
      }
    }
  });
  exerciseHistoryData.reverse();

  // If no history data yet for chart, fallback sample points
  const display1RMData =
    exerciseHistoryData.length > 0
      ? exerciseHistoryData
      : [
          { date: "Aug 1", maxWeight: 75, estimated1RM: 85 },
          { date: "Aug 8", maxWeight: 80, estimated1RM: 92 },
          { date: "Aug 15", maxWeight: 85, estimated1RM: 98 },
          { date: "Aug 19", maxWeight: 90, estimated1RM: 105 }
        ];

  return (
    <div className="space-y-6 pb-24 max-w-4xl mx-auto px-4 pt-4">
      {/* Header */}
      <div className="flex items-center space-x-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-lime-500/20 text-lime-400">
          <TrendingUp className="w-5 h-5 stroke-[2.5]" />
        </div>
        <div>
          <h1 className="text-2xl font-black text-white">Progress Analytics</h1>
          <p className="text-xs text-zinc-400">Track volume, 1RM progression, & personal records</p>
        </div>
      </div>

      {/* PR Hall of Fame Grid */}
      <div className="space-y-3">
        <h2 className="text-base font-extrabold text-white flex items-center space-x-2">
          <Award className="w-4 h-4 text-amber-400" />
          <span>Personal Record (PR) Hall of Fame</span>
        </h2>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {exercises
            .filter((ex) => ex.personalRecord)
            .map((ex) => (
              <Card key={ex.id} className="border-amber-500/30 bg-amber-500/5">
                <CardContent className="p-3.5 space-y-1">
                  <span className="text-[10px] uppercase font-bold text-amber-400">
                    {ex.muscleGroup}
                  </span>
                  <h3 className="text-xs font-bold text-white truncate">{ex.name}</h3>
                  <div className="text-xl font-black text-white tabular-nums pt-1">
                    {ex.personalRecord?.weight} <span className="text-xs text-zinc-400 font-bold">kg</span>
                  </div>
                  <div className="text-[10px] text-zinc-400 font-semibold">
                    {ex.personalRecord?.reps} reps • 1RM ~{ex.personalRecord?.estimated1RM}kg
                  </div>
                </CardContent>
              </Card>
            ))}
        </div>
      </div>

      {/* Training Volume Chart */}
      <Card className="border-zinc-800 bg-zinc-900/90">
        <CardHeader className="p-5 pb-2 flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-base font-bold">Training Volume per Workout (kg)</CardTitle>
            <span className="text-xs text-zinc-400">Total weight tonnage lifted</span>
          </div>
          <Dumbbell className="w-5 h-5 text-lime-400" />
        </CardHeader>
        <CardContent className="p-5 pt-3">
          <div className="h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={volumeChartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
                <XAxis dataKey="date" stroke="#71717a" fontSize={11} tickLine={false} />
                <YAxis stroke="#71717a" fontSize={11} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#18181b",
                    borderColor: "#3f3f46",
                    borderRadius: "12px",
                    color: "#fff"
                  }}
                />
                <Bar dataKey="volume" fill="#84cc16" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* 1RM Strength Progression Chart */}
      <Card className="border-zinc-800 bg-zinc-900/90">
        <CardHeader className="p-5 pb-2 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <CardTitle className="text-base font-bold">1-Rep Max (1RM) Progression</CardTitle>
            <span className="text-xs text-zinc-400">Track estimated max strength over time</span>
          </div>

          {/* Exercise Selector */}
          <select
            value={selectedExId}
            onChange={(e) => setSelectedExId(e.target.value)}
            className="h-9 rounded-xl bg-zinc-950 border border-zinc-700 px-3 text-xs font-bold text-lime-400 focus:outline-none"
          >
            {exercises.map((ex) => (
              <option key={ex.id} value={ex.id}>
                {ex.name}
              </option>
            ))}
          </select>
        </CardHeader>
        <CardContent className="p-5 pt-3">
          <div className="h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={display1RMData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
                <XAxis dataKey="date" stroke="#71717a" fontSize={11} tickLine={false} />
                <YAxis stroke="#71717a" fontSize={11} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#18181b",
                    borderColor: "#3f3f46",
                    borderRadius: "12px",
                    color: "#fff"
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="estimated1RM"
                  stroke="#84cc16"
                  strokeWidth={3}
                  dot={{ fill: "#84cc16", r: 4 }}
                  name="Est. 1RM (kg)"
                />
                <Line
                  type="monotone"
                  dataKey="maxWeight"
                  stroke="#06b6d4"
                  strokeWidth={2}
                  strokeDasharray="4 4"
                  dot={{ fill: "#06b6d4", r: 3 }}
                  name="Max Weight (kg)"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
