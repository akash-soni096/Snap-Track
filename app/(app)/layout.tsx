"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { MobileNav } from "@/components/mobile-nav"; 
import { UserButton } from "@clerk/nextjs";
import { cn } from "@/lib/utils";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isActive = (path: string) => pathname === path;

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black">

      {/* ======================= */}
      {/* DESKTOP NAVBAR          */}
      {/* ======================= */}
      <nav className="hidden md:flex fixed top-0 left-0 w-full h-16 bg-white dark:bg-black border-b border-zinc-200 dark:border-zinc-800 items-center justify-between px-8 z-50">

        {/* 1. LEFT: LOGO */}
        {/* We removed the wrapper div so this is now the first individual item */}
        <Link href="/dashboard" className="flex items-center gap-2">
          <Image
            src="/logo.png"
            alt="Snap-Track Logo"
            width={32}
            height={32}
            className="w-8 h-8 rounded-full object-cover"
          />
          <span className="text-lg font-bold">Snap-Track</span>
        </Link>

        {/* 2. CENTER: LINKS */}
        {/* This is now the second item, so 'justify-between' places it in the middle */}
        {/* We use absolute positioning to ensure it is DEAD CENTER regardless of logo size */}
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex gap-6 text-sm font-medium">
            <Link
              href="/dashboard"
              className={cn(
                "transition-colors",
                isActive("/dashboard") ? "text-black dark:text-white font-bold" : "text-zinc-500 hover:text-black dark:text-zinc-400 dark:hover:text-white"
              )}
            >
              Dashboard
            </Link>
            <Link
              href="/expenses"
              className={cn(
                "transition-colors",
                isActive("/expenses") ? "text-black dark:text-white font-bold" : "text-zinc-500 hover:text-black dark:text-zinc-400 dark:hover:text-white"
              )}
            >
              Expenses
            </Link>
        </div>

        {/* 3. RIGHT: ACTIONS */}
        <div className="flex items-center gap-4">
          <Button size="sm" asChild className="bg-black hover:bg-zinc-800 text-white dark:bg-white dark:text-black dark:hover:bg-zinc-200">
            <Link href="/scan">Scan Receipt</Link>
          </Button>
          <UserButton afterSignOutUrl="/" />
        </div>
      </nav>

      {/* ... (Rest of your layout: Mobile Top Header, Main Content, MobileNav) ... */}
      
      {/* MOBILE TOP HEADER */}
      <div className="md:hidden flex items-center justify-center p-4 border-b border-zinc-200 dark:border-zinc-800 bg-white dark:bg-black sticky top-0 z-40">
        <div className="flex items-center gap-2">
          <Image 
            src="/logo.png" 
            alt="Logo" 
            width={28} 
            height={28} 
            className="rounded-full object-cover"
          />
          <span className="font-bold text-lg tracking-tight">Snap-Track</span>
        </div>
      </div>

      <main className="pb-24 pt-4 md:pt-20 max-w-5xl mx-auto px-4 md:px-6">
        {children}
      </main>

      <MobileNav />

    </div>
  );
}