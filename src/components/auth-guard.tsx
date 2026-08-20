"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "@/lib/supabase/auth-context";

const PUBLIC_PATHS = ["/login"];

export function AuthGuard({ children }: { children: React.ReactNode }) {
    const { user, isLoading } = useAuth();
    const router = useRouter();
    const pathname = usePathname();

    const isPublicPath = PUBLIC_PATHS.includes(pathname);

    useEffect(() => {
        if (isLoading) return;

        if (!user && !isPublicPath) {
            router.push("/login");
        }

        if (user && isPublicPath) {
            router.push("/");
        }
    }, [user, isLoading, isPublicPath, router]);

    // Public pages (like /login) always render immediately, no gate needed
    if (isPublicPath) {
        return <>{children}</>;
    }

    if (isLoading) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-zinc-950">
                <div className="text-zinc-400 text-sm">Loading...</div>
            </div>
        );
    }

    if (!user) {
        return null;
    }

    return <>{children}</>;
}