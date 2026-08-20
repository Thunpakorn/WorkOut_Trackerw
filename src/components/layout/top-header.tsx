"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Dumbbell,
  CheckCircle2,
  Loader2,
  Plus,
  Play,
  Globe
} from "lucide-react";
import { useWorkout } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function TopHeader() {
  const pathname = usePathname();
  const { activeWorkout, autoSaveStatus, startBlankWorkout, lang, toggleLanguage, t } = useWorkout();

  const navLinks = [
    { href: "/", label: t("navDashboard") },
    { href: "/history", label: t("navHistory") },
    { href: "/exercises", label: t("navExercises") },
    { href: "/stats", label: t("navProgress") },
    { href: "/profile", label: t("navProfile") },
  ];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-zinc-800/80 bg-zinc-950/90 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-4 sm:px-6">
        {/* Brand & Logo */}
        <Link href="/" className="flex items-center space-x-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-lime-500 text-zinc-950 shadow-md accent-glow">
            <Dumbbell className="h-5 w-5 stroke-[2.5]" />
          </div>
          <div className="flex flex-col">
            <div className="flex items-center space-x-1">
              <span className="text-base font-extrabold tracking-wider text-white">WORKOUT</span>
              <span className="text-base font-extrabold tracking-wider text-lime-400">Track</span>
            </div>
            <span className="text-[9px] font-medium text-zinc-400 -mt-1 tracking-widest uppercase">
              {t("brandSub")}
            </span>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center space-x-1">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "px-3 py-1.5 rounded-lg text-xs font-bold transition-colors",
                  isActive
                    ? "bg-zinc-800 text-lime-400"
                    : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900"
                )}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* Right Action Bar */}
        <div className="flex items-center space-x-2.5">
          {/* Language Switcher Toggle Button (🇹🇭 TH / 🇬🇧 EN) */}
          <button
            type="button"
            onClick={toggleLanguage}
            className="flex items-center space-x-1 px-2.5 py-1 rounded-xl bg-zinc-900 border border-zinc-800 text-xs font-extrabold text-lime-400 hover:bg-zinc-800 transition-all active:scale-95 shadow-sm"
            title="Switch Language / สลับภาษา"
          >
            <Globe className="w-3.5 h-3.5" />
            <span>{lang === "th" ? "🇹🇭 TH" : "🇬🇧 EN"}</span>
          </button>

          {/* Subtle Auto-Save Indicator Pill */}
          <div className="hidden sm:flex items-center space-x-1.5 px-2.5 py-1 rounded-full bg-zinc-900 border border-zinc-800 text-[11px] font-semibold text-zinc-400">
            {autoSaveStatus === "saving" ? (
              <>
                <Loader2 className="w-3 h-3 text-lime-400 animate-spin" />
                <span className="text-lime-400">{t("saving")}</span>
              </>
            ) : (
              <>
                <CheckCircle2 className="w-3 h-3 text-lime-400" />
                <span>{t("autoSaved")}</span>
              </>
            )}
          </div>

          {/* Quick Active / Start Workout Button */}
          {activeWorkout ? (
            <Link href="/workout/active">
              <Button size="sm" className="bg-lime-500 text-zinc-950 font-bold text-xs gap-1.5 shadow-md">
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>{t("activeWorkout")}</span>
              </Button>
            </Link>
          ) : (
            <Link href="/workout/active">
              <Button
                size="sm"
                onClick={() => startBlankWorkout()}
                className="bg-lime-500 text-zinc-950 font-bold text-xs gap-1.5 shadow-md"
              >
                <Plus className="w-3.5 h-3.5 stroke-[3]" />
                <span className="hidden sm:inline">{t("startWorkout")}</span>
                <span className="sm:hidden">{t("start")}</span>
              </Button>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
