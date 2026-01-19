"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Receipt, Camera, User } from "lucide-react";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";

export function MobileNav() {
  const pathname = usePathname();

  // Helper to check if a tab is active
  const isActive = (path: string) => pathname === path;

  return (
    <div className="md:hidden fixed bottom-0 left-0 w-full z-50">
      
      {/* The White Bar Background */}
      <div className="h-16 bg-white border-t border-zinc-200 flex items-center justify-around px-2 pb-safe-area">
        
        {/* 1. HOME TAB */}
        <Link href="/dashboard" className="flex flex-col items-center justify-center w-16 group relative">
          <div className="relative p-1">
            <Home 
                className={cn(
                    "w-6 h-6 transition-colors duration-200",
                    isActive("/dashboard") ? "text-black fill-current" : "text-zinc-400 group-hover:text-zinc-600"
                )} 
            />
            {/* Active Indicator Dot */}
            {isActive("/dashboard") && (
                <motion.div 
                    layoutId="nav-dot"
                    className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-1 h-1 bg-black rounded-full"
                />
            )}
          </div>
          <span className={cn(
              "text-[10px] font-medium mt-1 transition-colors",
              isActive("/dashboard") ? "text-black" : "text-zinc-400"
          )}>
            Home
          </span>
        </Link>

        {/* 2. SCAN BUTTON (Floating Center) */}
        <div className="relative -top-5">
           <Link href="/scan">
             <motion.div 
               whileTap={{ scale: 0.9 }}
               className="w-14 h-14 bg-black rounded-full flex items-center justify-center shadow-lg shadow-black/30 border-4 border-zinc-50"
             >
               <Camera className="w-6 h-6 text-white" />
             </motion.div>
           </Link>
        </div>

        {/* 3. EXPENSES TAB */}
        <Link href="/expenses" className="flex flex-col items-center justify-center w-16 group relative">
          <div className="relative p-1">
            <Receipt 
                className={cn(
                    "w-6 h-6 transition-colors duration-200",
                    isActive("/expenses") ? "text-black fill-current" : "text-zinc-400 group-hover:text-zinc-600"
                )} 
            />
            {isActive("/expenses") && (
                <motion.div 
                    layoutId="nav-dot"
                    className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-1 h-1 bg-black rounded-full"
                />
            )}
          </div>
          <span className={cn(
              "text-[10px] font-medium mt-1 transition-colors",
              isActive("/expenses") ? "text-black" : "text-zinc-400"
          )}>
            History
          </span>
        </Link>

      </div>
    </div>
  );
}