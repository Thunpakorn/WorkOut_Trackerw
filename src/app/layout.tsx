import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/lib/supabase/auth-context";
import { WorkoutProvider } from "@/lib/store";
import { TopHeader } from "@/components/layout/top-header";
import { BottomNav } from "@/components/layout/bottom-nav";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "WORKOUT Track — Mobile Workout Tracker",
  description: "Mobile-first weight training and treadmill cardio tracker with Supabase backend and auto-save",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark scroll-smooth">
      <body className={`${inter.className} min-h-screen bg-zinc-950 text-zinc-100 antialiased selection:bg-lime-500 selection:text-zinc-950`}>
        <AuthProvider>
          <WorkoutProvider>
            <div className="relative flex min-h-screen flex-col">
              <TopHeader />
              <main className="flex-1">{children}</main>
              <BottomNav />
            </div>
          </WorkoutProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
