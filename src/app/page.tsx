"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Play,
  Plus,
  Copy,
  Trophy,
  Calendar,
  Clock,
  Dumbbell,
  TrendingUp,
  Activity,
  Zap,
  ArrowRight,
  Eye
} from "lucide-react";
import { useWorkout } from "@/lib/store";
import { formatDate, formatDuration } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";

export default function DashboardPage() {
  const {
    user,
    history,
    templates,
    activeWorkout,
    startBlankWorkout,
    startWorkoutFromTemplate,
    copyLastWorkout,
    t,
    lang
  } = useWorkout();

  const [showEmptyState, setShowEmptyState] = useState(false);
  const [isLoadingState, setIsLoadingState] = useState(false);

  const displayHistory = showEmptyState ? [] : history;
  const recentSessions = displayHistory.slice(0, 3);
  const workoutsThisWeek = showEmptyState ? 0 : Math.min(user.weeklyGoal, displayHistory.length);
  const weeklyProgress = Math.round((workoutsThisWeek / user.weeklyGoal) * 100);

  const lastSession = displayHistory[0];

  return (
    <div className="space-y-6 pb-24 max-w-4xl mx-auto px-4 pt-4">
      {/* State Toggle Preview Bar */}
      <div className="flex items-center justify-between p-3 rounded-2xl bg-zinc-900/90 border border-zinc-800 text-xs">
        <div className="flex items-center space-x-2 text-zinc-400">
          <Eye className="w-4 h-4 text-lime-400" />
          <span className="font-bold">{lang === "th" ? "ทดลองมุมมอง UI:" : "UI Preview:"}</span>
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
            {showEmptyState ? (lang === "th" ? "ปิดมุมมองว่าง" : "Exit Empty") : (lang === "th" ? "มุมมองยังไม่มีประวัติ" : "Empty State")}
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
            {isLoadingState ? (lang === "th" ? "ปิดมุมมองโหลด" : "Exit Skeleton") : (lang === "th" ? "มุมมองกำลังโหลด" : "Loading State")}
          </button>
        </div>
      </div>

      {isLoadingState ? (
        <div className="space-y-6">
          <Skeleton className="h-32 w-full" />
          <div className="grid grid-cols-2 gap-4">
            <Skeleton className="h-28" />
            <Skeleton className="h-28" />
          </div>
          <Skeleton className="h-44 w-full" />
        </div>
      ) : (
        <>
          {/* Main Giant Hero CTA Card — Ultra Simple & Direct */}
          <div className="p-6 rounded-3xl bg-gradient-to-br from-zinc-900 via-zinc-900 to-zinc-950 border border-zinc-800 shadow-xl space-y-4 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-lime-500/10 rounded-full blur-3xl pointer-events-none" />

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 relative z-10">
              <div>
                <span className="text-xs font-black uppercase tracking-widest text-lime-400">
                  {t("welcomeBack")}
                </span>
                <h1 className="text-2xl sm:text-3xl font-black text-white mt-0.5">
                  {t("crushItPrompt")}, {user.name.split(" ")[0]}!
                </h1>
                <p className="text-xs text-zinc-400 mt-1">
                  {t("dashboardSub")}
                </p>
              </div>

              <span className="text-xs text-zinc-500 font-medium">
                {formatDate(new Date().toISOString())}
              </span>
            </div>

            {/* Giant Primary Action Buttons */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 relative z-10 pt-2">
              {activeWorkout ? (
                <Link href="/workout/active">
                  <Button size="lg" className="w-full h-14 bg-lime-500 text-zinc-950 font-black text-base shadow-xl accent-glow">
                    <Play className="w-6 h-6 fill-current mr-2" />
                    <span>{t("resume")} ({activeWorkout.title})</span>
                  </Button>
                </Link>
              ) : (
                <Link href="/workout/active">
                  <Button
                    size="lg"
                    onClick={() => startBlankWorkout()}
                    className="w-full h-14 bg-lime-500 text-zinc-950 font-black text-base shadow-xl accent-glow"
                  >
                    <Plus className="w-6 h-6 stroke-[3] mr-2" />
                    <span>{t("startBlankWorkout")}</span>
                  </Button>
                </Link>
              )}

              {/* One-Tap Copy Last Workout */}
              {lastSession ? (
                <Link href="/workout/active">
                  <Button
                    size="lg"
                    onClick={() => copyLastWorkout(lastSession.id)}
                    className="w-full h-14 bg-zinc-800 border border-zinc-700 text-white hover:bg-zinc-700 font-bold text-sm"
                  >
                    <Copy className="w-5 h-5 text-lime-400 mr-2" />
                    <span className="truncate">{t("copyLastWorkout")}</span>
                  </Button>
                </Link>
              ) : (
                <Button size="lg" variant="secondary" disabled className="w-full h-14 opacity-50">
                  <Copy className="w-5 h-5 mr-2" />
                  <span>{t("copyLastWorkout")}</span>
                </Button>
              )}
            </div>
          </div>



          {/* Recent Activity List */}
          <div className="space-y-3 pt-2">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-extrabold text-white flex items-center space-x-2">
                <Activity className="w-4.5 h-4.5 text-lime-400" />
                <span>{t("recentActivity")}</span>
              </h2>
              <Link href="/history" className="text-xs font-bold text-lime-400 hover:underline">
                {t("fullHistory")}
              </Link>
            </div>

            {displayHistory.length === 0 ? (
              <Card className="border-dashed border-zinc-800 bg-zinc-900/40 py-10 text-center space-y-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-zinc-800 text-zinc-500 mx-auto">
                  <Dumbbell className="w-6 h-6" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-sm font-bold text-white">{t("noWorkoutsLogged")}</h3>
                  <p className="text-xs text-zinc-400 max-w-xs mx-auto">
                    {t("emptyDashSub")}
                  </p>
                </div>
                <Link href="/workout/active">
                  <Button
                    size="sm"
                    onClick={() => startBlankWorkout()}
                    className="bg-lime-500 text-zinc-950 font-bold text-xs"
                  >
                    {t("startFirstWorkout")}
                  </Button>
                </Link>
              </Card>
            ) : (
              <div className="space-y-2">
                {recentSessions.map((session) => (
                  <Card
                    key={session.id}
                    className="border-zinc-800 bg-zinc-900/80 hover:border-zinc-700 transition-all"
                  >
                    <CardContent className="p-4 flex items-center justify-between">
                      <div className="space-y-1">
                        <div className="flex items-center space-x-2 text-xs text-zinc-400">
                          <Calendar className="w-3.5 h-3.5 text-lime-400" />
                          <span>{formatDate(session.startTime, true)}</span>
                        </div>
                        <h3 className="text-sm font-extrabold text-white">{session.title}</h3>
                        <div className="flex flex-wrap gap-1">
                          {session.exercises.map((ex) => (
                            <Badge key={ex.id} variant="secondary" className="text-[9px]">
                              {ex.exerciseName}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      <div className="flex items-center space-x-3 text-right">
                        <div>
                          <div className="text-[10px] uppercase text-zinc-500">{t("volume")}</div>
                          <div className="text-xs font-black text-white tabular-nums">
                            {session.totalVolumeKg} kg
                          </div>
                        </div>

                        <div>
                          <div className="text-[10px] uppercase text-zinc-500">{t("time")}</div>
                          <div className="text-xs font-black text-white tabular-nums">
                            {formatDuration(session.durationSeconds)}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
