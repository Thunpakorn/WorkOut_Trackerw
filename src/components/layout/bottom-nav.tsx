"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  History,
  BookOpen,
  TrendingUp,
  User,
  Play
} from "lucide-react";
import { useWorkout } from "@/lib/store";
import { cn } from "@/lib/utils";

export function BottomNav() {
  const pathname = usePathname();
  const { activeWorkout, t } = useWorkout();

  if (pathname === "/workout/active") {
    return null;
  }

  const navItems = [
    { href: "/", label: t("navDashboard"), icon: Home },
    { href: "/history", label: t("navHistory"), icon: History },
    { href: "/exercises", label: t("navLibrary"), icon: BookOpen },
    { href: "/stats", label: t("navProgress"), icon: TrendingUp },
    { href: "/profile", label: t("navProfile"), icon: User },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 block md:hidden">
      {/* Active Workout Banner above bottom nav */}
      {activeWorkout && (
        <div className="bg-lime-500 text-zinc-950 px-4 py-2 flex items-center justify-between font-bold text-xs shadow-lg animate-pulse">
          <div className="flex items-center space-x-2">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-zinc-950 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-zinc-950"></span>
            </span>
            <span className="truncate max-w-[200px]">{t("activeWorkout")}: {activeWorkout.title}</span>
          </div>
          <Link
            href="/workout/active"
            className="flex items-center space-x-1 bg-zinc-950 text-lime-400 px-3 py-1 rounded-lg text-xs font-extrabold hover:bg-zinc-900"
          >
            <span>{t("resume")}</span>
            <Play className="w-3 h-3 fill-current" />
          </Link>
        </div>
      )}

      {/* Main Glass Bottom Nav */}
      <nav className="glass-nav px-3 py-2 flex items-center justify-around">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-col items-center justify-center py-1 px-3 rounded-xl transition-all touch-manipulation",
                isActive
                  ? "text-lime-400 font-bold scale-105"
                  : "text-zinc-400 hover:text-zinc-200"
              )}
            >
              <Icon className={cn("w-5 h-5 mb-0.5", isActive && "stroke-[2.5px]")} />
              <span className="text-[10px] tracking-wide">{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
