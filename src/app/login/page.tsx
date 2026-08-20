"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Dumbbell, ArrowRight, Lock, Mail, ShieldCheck, AlertCircle } from "lucide-react";
import { useAuth } from "@/lib/supabase/auth-context";
import { useWorkout } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

export default function LoginPage() {
  const router = useRouter();
  const { signInWithEmail, signUpWithEmail, signInWithGoogle } = useAuth();
  const { t, lang } = useWorkout();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage("");
    setSuccessMessage("");

    const { error } = await signInWithEmail(email, password);
    setIsLoading(false);

    if (error) {
      setErrorMessage(error.message || "Failed to sign in. Please check your credentials.");
    } else {
      router.push("/");
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage("");
    setSuccessMessage("");

    const { error } = await signUpWithEmail(email, password, name);
    setIsLoading(false);

    if (error) {
      setErrorMessage(error.message || "Failed to register account.");
    } else {
      setSuccessMessage("Account created successfully! Check your email to confirm registration.");
      setTimeout(() => router.push("/"), 1500);
    }
  };

  const handleGoogleAuth = async () => {
    setIsLoading(true);
    setErrorMessage("");

    const { error } = await signInWithGoogle();
    setIsLoading(false);

    if (error) {
      setErrorMessage(error.message || "Failed to connect with Google.");
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Background Decorative Glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-lime-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Main Glass Login Card */}
      <div className="w-full max-w-md relative z-10 space-y-6">
        {/* Brand Logo Header */}
        <div className="flex flex-col items-center text-center space-y-2">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-lime-500 text-zinc-950 shadow-2xl accent-glow">
            <Dumbbell className="h-8 w-8 stroke-[2.5]" />
          </div>
          <h1 className="text-2xl font-black tracking-tight text-white flex items-center space-x-1">
            <span>WORKOUT</span>
            <span className="text-lime-400">Track</span>
          </h1>
          <p className="text-xs text-zinc-400 max-w-xs">
            {t("brandSub")}
          </p>
        </div>

        <Card className="border-zinc-800 bg-zinc-900/90 shadow-2xl backdrop-blur-xl">
          <CardHeader className="text-center pb-2">
            <CardTitle className="text-xl font-bold">{t("welcomeBackLogin")}</CardTitle>
            <CardDescription>{t("logInToAccess")}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Error / Success Alert Messages */}
            {errorMessage && (
              <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs flex items-center space-x-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            {successMessage && (
              <div className="p-3 rounded-xl bg-lime-500/10 border border-lime-500/30 text-lime-400 text-xs">
                {successMessage}
              </div>
            )}

            {/* Google OAuth Button */}
            <Button
              type="button"
              variant="outline"
              onClick={handleGoogleAuth}
              disabled={isLoading}
              className="w-full h-12 bg-zinc-950 border-zinc-800 text-white font-bold flex items-center justify-center space-x-2 hover:bg-zinc-800"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path
                  fill="#EA4335"
                  d="M12 5c1.6 0 3 .6 4.1 1.6l3.1-3.1C17.3 1.8 14.8 1 12 1 7.5 1 3.7 3.6 1.9 7.3l3.7 2.9C6.5 7.3 9 5 12 5z"
                />
                <path
                  fill="#4285F4"
                  d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.5h6.5c-.3 1.5-1.1 2.8-2.4 3.7l3.7 2.9c2.2-2 3.7-5 3.7-8.8z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.6 14.8c-.2-.7-.4-1.5-.4-2.3s.2-1.6.4-2.3L1.9 7.3C.7 9.7 0 10.8 0 12.5s.7 2.8 1.9 5.2l3.7-2.9z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c3.2 0 6-1.1 8-3l-3.7-2.9c-1.1.7-2.5 1.2-4.3 1.2-3 0-5.5-2.3-6.4-5.2L1.9 16C3.7 19.7 7.5 23 12 23z"
                />
              </svg>
              <span>{t("continueWithGoogle")}</span>
            </Button>

            <div className="relative flex items-center justify-center my-2">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-zinc-800" />
              </div>
              <span className="relative px-3 bg-zinc-900 text-[11px] uppercase font-bold text-zinc-500">
                {t("orWithEmail")}
              </span>
            </div>

            <Tabs defaultValue="login" className="w-full">
              <TabsList className="grid grid-cols-2 mb-4">
                <TabsTrigger value="login">{t("signIn")}</TabsTrigger>
                <TabsTrigger value="signup">{t("register")}</TabsTrigger>
              </TabsList>

              <TabsContent value="login">
                <form onSubmit={handleSignIn} className="space-y-3">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-zinc-400 flex items-center space-x-1">
                      <Mail className="w-3.5 h-3.5 text-lime-400" />
                      <span>{t("emailAddress")}</span>
                    </label>
                    <Input
                      type="email"
                      placeholder="alex@gym.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-zinc-400 flex items-center space-x-1">
                      <Lock className="w-3.5 h-3.5 text-lime-400" />
                      <span>{t("password")}</span>
                    </label>
                    <Input
                      type="password"
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                  </div>

                  <Button
                    type="submit"
                    disabled={isLoading}
                    className="w-full h-12 bg-lime-500 text-zinc-950 font-black text-sm accent-glow mt-2"
                  >
                    {isLoading ? "..." : t("signIn")}
                    {!isLoading && <ArrowRight className="w-4 h-4 ml-2 stroke-[3]" />}
                  </Button>
                </form>
              </TabsContent>

              <TabsContent value="signup">
                <form onSubmit={handleSignUp} className="space-y-3">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-zinc-400">{t("yourName")}</label>
                    <Input
                      type="text"
                      placeholder="Alex Morgan"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-zinc-400">{t("emailAddress")}</label>
                    <Input
                      type="email"
                      placeholder="alex@gym.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-zinc-400">{t("password")}</label>
                    <Input
                      type="password"
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                  </div>

                  <Button
                    type="submit"
                    disabled={isLoading}
                    className="w-full h-12 bg-lime-500 text-zinc-950 font-black text-sm accent-glow mt-2"
                  >
                    {isLoading ? "..." : t("createAccount")}
                    {!isLoading && <ArrowRight className="w-4 h-4 ml-2 stroke-[3]" />}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {/* Bottom Security Note */}
        <div className="flex items-center justify-center space-x-1.5 text-xs text-zinc-500">
          <ShieldCheck className="w-4 h-4 text-lime-400" />
          <span>{t("privateEncrypted")}</span>
        </div>
      </div>
    </div>
  );
}
