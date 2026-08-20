"use client";

import React from "react";
import { TrendingUp, Award } from "lucide-react";
import { useWorkout } from "@/lib/store";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function StatsPage() {
  const { exercises, t } = useWorkout();

  const prExercises = exercises.filter((ex) => ex.personalRecord);

  return (
    <div className="space-y-6 pb-24 max-w-4xl mx-auto px-4 pt-4">
      {/* Header */}
      <div className="flex items-center space-x-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-lime-500/20 text-lime-400">
          <TrendingUp className="w-5 h-5 stroke-[2.5]" />
        </div>
        <div>
          <h1 className="text-2xl font-black text-white">{t("progressAnalytics")}</h1>
          <p className="text-xs text-zinc-400">{t("progressSub")}</p>
        </div>
      </div>

      {/* PR Hall of Fame Grid */}
      <div className="space-y-3">
        <h2 className="text-base font-extrabold text-white flex items-center space-x-2">
          <Award className="w-4 h-4 text-amber-400" />
          <span>{t("prHallOfFame")}</span>
        </h2>

        {prExercises.length === 0 ? (
          <Card className="border-dashed border-zinc-800 bg-zinc-900/40 py-12 text-center space-y-2">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-zinc-800 text-amber-400 mx-auto">
              <Award className="w-6 h-6" />
            </div>
            <h3 className="text-sm font-bold text-white">ยังไม่มีสถิติส่วนตัว (PR)</h3>
            <p className="text-xs text-zinc-400 max-w-xs mx-auto">
              เมื่อคุณบันทึกการออกกำลังกาย สถิติสูงสุดจะถูกนำมาแสดงในส่วนนี้โดยอัตโนมัติ
            </p>
          </Card>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {prExercises.map((ex) => (
              <Card key={ex.id} className="border-amber-500/30 bg-amber-500/5 hover:border-amber-500/60 transition-all">
                <CardContent className="p-4 space-y-1">
                  <Badge variant="gold" className="text-[9px] uppercase px-1.5 py-0">
                    {ex.muscleGroup}
                  </Badge>
                  <h3 className="text-sm font-bold text-white truncate pt-1">{ex.name}</h3>
                  <div className="text-2xl font-black text-white tabular-nums pt-1">
                    {ex.personalRecord?.weight} <span className="text-xs text-zinc-400 font-bold">kg</span>
                  </div>
                  <div className="text-[11px] text-zinc-400 font-semibold">
                    {ex.personalRecord?.reps} reps • 1RM ~{ex.personalRecord?.estimated1RM}kg
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
