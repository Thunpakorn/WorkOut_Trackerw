"use client";

import React, { useState } from "react";
import {
  User,
  Scale,
  Settings,
  Download,
  Upload,
  Plus,
  Shield,
  Volume2,
  Clock,
  Target,
  Check
} from "lucide-react";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import { useWorkout } from "@/lib/store";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

export default function ProfilePage() {
  const { user, bodyWeightLog, addBodyWeight, updateUserProfile } = useWorkout();
  const [newWeightInput, setNewWeightInput] = useState("");
  const [isExported, setIsExported] = useState(false);

  const handleLogWeight = (e: React.FormEvent) => {
    e.preventDefault();
    const weightVal = parseFloat(newWeightInput);
    if (!weightVal || weightVal <= 0) return;
    addBodyWeight(weightVal);
    setNewWeightInput("");
  };

  const handleExportData = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify({ user, bodyWeightLog }));
    const downloadAnchor = document.createElement("a");
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `workout_tracker_backup_${new Date().toISOString().split("T")[0]}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    setIsExported(true);
    setTimeout(() => setIsExported(false), 3000);
  };

  const latestWeight = bodyWeightLog[bodyWeightLog.length - 1]?.weight || 75;

  return (
    <div className="space-y-6 pb-24 max-w-4xl mx-auto px-4 pt-4">
      {/* User Header */}
      <div className="p-6 rounded-3xl bg-zinc-900 border border-zinc-800 flex items-center space-x-4">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-lime-500 text-zinc-950 font-black text-2xl shadow-xl accent-glow">
          {user.name.substring(0, 2).toUpperCase()}
        </div>
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <h1 className="text-xl font-black text-white">{user.name}</h1>
            <Badge variant="cyan">Pro Member</Badge>
          </div>
          <p className="text-xs text-zinc-400">{user.email}</p>
        </div>
      </div>

      {/* Body Weight Logger & Graph */}
      <Card className="border-zinc-800 bg-zinc-900/90">
        <CardHeader className="p-5 pb-2 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <CardTitle className="text-base font-bold flex items-center space-x-2">
              <Scale className="w-5 h-5 text-lime-400" />
              <span>Body Weight Tracker ({user.weightUnit})</span>
            </CardTitle>
            <span className="text-xs text-zinc-400">Current Weight: {latestWeight} {user.weightUnit}</span>
          </div>

          {/* Quick Weight Input Form */}
          <form onSubmit={handleLogWeight} className="flex items-center space-x-2">
            <input
              type="number"
              step="0.1"
              placeholder={`Log ${user.weightUnit}...`}
              value={newWeightInput}
              onChange={(e) => setNewWeightInput(e.target.value)}
              className="w-28 h-9 rounded-xl bg-zinc-950 border border-zinc-700 px-3 text-xs font-bold text-white focus:border-lime-500 focus:outline-none"
            />
            <Button type="submit" size="sm" className="bg-lime-500 text-zinc-950 font-extrabold text-xs h-9">
              Log
            </Button>
          </form>
        </CardHeader>
        <CardContent className="p-5 pt-3">
          <div className="h-48 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={bodyWeightLog}>
                <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
                <XAxis dataKey="date" stroke="#71717a" fontSize={11} tickLine={false} />
                <YAxis domain={['dataMin - 1', 'dataMax + 1']} stroke="#71717a" fontSize={11} tickLine={false} />
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
                  dataKey="weight"
                  stroke="#06b6d4"
                  strokeWidth={3}
                  dot={{ fill: "#06b6d4", r: 4 }}
                  name={`Weight (${user.weightUnit})`}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* App Preferences */}
      <Card className="border-zinc-800 bg-zinc-900/90">
        <CardHeader className="p-5 pb-3">
          <CardTitle className="text-base font-bold flex items-center space-x-2">
            <Settings className="w-5 h-5 text-lime-400" />
            <span>Preferences & Settings</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-5 pt-0 space-y-4 divide-y divide-zinc-800/60">
          {/* Weight Unit */}
          <div className="flex items-center justify-between pt-3">
            <div>
              <div className="text-sm font-bold text-white">Preferred Weight Unit</div>
              <div className="text-xs text-zinc-400">Used for set weight entries and calculations</div>
            </div>
            <div className="flex items-center space-x-1 bg-zinc-950 p-1 rounded-xl border border-zinc-800">
              <button
                onClick={() => updateUserProfile({ weightUnit: "kg" })}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-colors ${
                  user.weightUnit === "kg" ? "bg-lime-500 text-zinc-950" : "text-zinc-400"
                }`}
              >
                kg
              </button>
              <button
                onClick={() => updateUserProfile({ weightUnit: "lbs" })}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-colors ${
                  user.weightUnit === "lbs" ? "bg-lime-500 text-zinc-950" : "text-zinc-400"
                }`}
              >
                lbs
              </button>
            </div>
          </div>

          {/* Rest Timer Default */}
          <div className="flex items-center justify-between pt-3">
            <div>
              <div className="text-sm font-bold text-white">Default Rest Timer</div>
              <div className="text-xs text-zinc-400">Duration triggered automatically after set check</div>
            </div>
            <select
              value={user.restTimerSeconds}
              onChange={(e) => updateUserProfile({ restTimerSeconds: parseInt(e.target.value, 10) })}
              className="h-9 rounded-xl bg-zinc-950 border border-zinc-800 px-3 text-xs font-bold text-lime-400 focus:outline-none"
            >
              <option value={60}>60 Seconds</option>
              <option value={90}>90 Seconds</option>
              <option value={120}>120 Seconds</option>
              <option value={180}>180 Seconds</option>
            </select>
          </div>

        </CardContent>
      </Card>

      {/* Data Backup & Privacy */}
      <Card className="border-zinc-800 bg-zinc-900/90">
        <CardContent className="p-5 flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-white flex items-center space-x-1.5">
              <Shield className="w-4 h-4 text-lime-400" />
              <span>Data Privacy & Backup</span>
            </h3>
            <p className="text-xs text-zinc-400 mt-0.5">Export your entire workout history as JSON</p>
          </div>

          <Button
            size="sm"
            onClick={handleExportData}
            className="bg-zinc-800 hover:bg-zinc-700 text-white font-bold text-xs gap-1.5"
          >
            {isExported ? <Check className="w-4 h-4 text-lime-400" /> : <Download className="w-4 h-4" />}
            <span>{isExported ? "Downloaded!" : "Export Data"}</span>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
