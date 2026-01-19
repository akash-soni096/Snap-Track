"use client";

import * as React from "react";
import Image from "next/image";
import { motion } from "motion/react";
import Link from "next/link";
// FIX: Imported IndianRupee instead of DollarSign
import { ShieldCheck, Lock, FileSpreadsheet, ArrowRight, TrendingUp, IndianRupee } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";

// --- 1. THE MAIN HERO COMPONENT ---
export default function HeroSectionOne() {
  return (
    <div className="relative mx-auto my-10 flex max-w-7xl flex-col items-center justify-center">
      <Navbar />

      {/* Background Lines */}
      <div className="absolute inset-y-0 left-0 h-full w-px bg-neutral-200/80 dark:bg-neutral-800/80">
        <div className="absolute top-0 h-40 w-px bg-gradient-to-b from-transparent via-blue-500 to-transparent" />
      </div>
      <div className="absolute inset-y-0 right-0 h-full w-px bg-neutral-200/80 dark:bg-neutral-800/80">
        <div className="absolute h-40 w-px bg-gradient-to-b from-transparent via-blue-500 to-transparent" />
      </div>
      <div className="absolute inset-x-0 bottom-0 h-px w-full bg-neutral-200/80 dark:bg-neutral-800/80">
        <div className="absolute mx-auto h-px w-40 bg-gradient-to-r from-transparent via-blue-500 to-transparent" />
      </div>

      <div className="px-4 py-10 md:py-20 flex flex-col items-center">

        {/* Animated Title */}
        <h1 className="relative z-10 mx-auto max-w-4xl text-center text-3xl font-bold text-slate-700 md:text-5xl lg:text-7xl dark:text-slate-300">
          {"Track your expenses in a snap"
            .split(" ")
            .map((word, index) => (
              <motion.span
                key={index}
                initial={{ opacity: 0, filter: "blur(4px)", y: 10 }}
                animate={{ opacity: 1, filter: "blur(0px)", y: 0 }}
                transition={{
                  duration: 0.3,
                  delay: index * 0.1,
                  ease: "easeInOut",
                }}
                className="mr-2 inline-block"
              >
                {word}
              </motion.span>
            ))}
        </h1>

        {/* Description */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3, delay: 0.8 }}
          className="relative z-10 mx-auto max-w-xl py-4 text-center text-lg font-normal text-neutral-600 dark:text-neutral-400"
        >
          Stop hoarding paper receipts. Use AI to scan, extract, and organize your expenses in seconds.
        </motion.p>

        {/* Buttons */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3, delay: 1 }}
          className="relative z-10 mt-8 flex flex-wrap items-center justify-center gap-4"
        >
          <Link href="/dashboard">
            <button className="w-60 transform rounded-lg bg-black px-6 py-2 font-medium text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-gray-800 dark:bg-white dark:text-black dark:hover:bg-gray-200">
              Start Tracking Free
            </button>
          </Link>

          
        </motion.div>

        {/* --- TRUST BADGES --- */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.1 }}
          className="mt-12 flex flex-col items-center justify-center gap-4 z-20"
        >
          <p className="text-xs font-medium uppercase tracking-widest text-neutral-400">
            Bank-Grade Security
          </p>

          <div className="flex flex-wrap items-center justify-center gap-6 md:gap-10 opacity-80">
            <div className="flex items-center gap-2 group cursor-default">
              <ShieldCheck className="w-5 h-5 text-emerald-600" />
              <span className="font-semibold text-neutral-600 dark:text-neutral-300 text-sm group-hover:text-black transition">
                Encrypted Data
              </span>
            </div>
            <div className="flex items-center gap-2 group cursor-default">
              <Lock className="w-5 h-5 text-emerald-600" />
              <span className="font-semibold text-neutral-600 dark:text-neutral-300 text-sm group-hover:text-black transition">
                Private Storage
              </span>
            </div>
            <div className="flex items-center gap-2 group cursor-default">
              <FileSpreadsheet className="w-5 h-5 text-emerald-600" />
              <span className="font-semibold text-neutral-600 dark:text-neutral-300 text-sm group-hover:text-black transition">
                Excel Export
              </span>
            </div>
          </div>
        </motion.div>

        {/* --- APP PREVIEW --- */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 1.2 }}
          className="relative z-10 mt-16 w-full max-w-4xl"
        >
          <div className="rounded-xl border border-neutral-200 bg-white p-2 shadow-2xl dark:border-neutral-800 dark:bg-neutral-900">
            <div className="aspect-[16/9] w-full overflow-hidden rounded-lg bg-zinc-50 border border-zinc-100 relative flex items-center justify-center">

              {/* Background Grid Pattern */}
              <div
                className="absolute inset-0 opacity-[0.03]"
                style={{
                  backgroundImage: "radial-gradient(#000 1px, transparent 1px)",
                  backgroundSize: "20px 20px",
                }}
              />

              {/* VISUAL: The "Scan Flow" Mockup */}
              <div className="flex flex-col md:flex-row items-center gap-8 md:gap-12 p-8 z-10">
                {/* Step 1: Receipt */}
                <motion.div
                  animate={{ y: [0, -5, 0] }}
                  transition={{
                    repeat: Infinity,
                    duration: 4,
                    ease: "easeInOut",
                  }}
                  className="w-32 h-40 bg-white shadow-xl border border-zinc-200 rounded-lg p-3 flex flex-col gap-2 rotate-[-6deg]"
                >
                  <div className="w-8 h-8 rounded-full bg-zinc-100 flex items-center justify-center self-center mb-1">
                    <span className="text-xs font-bold">SBUX</span>
                  </div>
                  <div className="w-full h-2 bg-zinc-100 rounded" />
                  <div className="w-2/3 h-2 bg-zinc-100 rounded" />
                  <div className="mt-auto w-full flex justify-between pt-2 border-t border-dashed border-zinc-200">
                    <span className="text-xs font-mono text-zinc-400">TOTAL</span>
                    {/* FIX: Changed to ₹ and realistic amount */}
                    <span className="text-xs font-bold text-zinc-800">₹450.50</span>
                  </div>
                </motion.div>

                {/* Step 2: Arrow */}
                <ArrowRight className="w-8 h-8 text-zinc-300 md:rotate-0 rotate-90" />

                {/* Step 3: Success Card */}
                <motion.div
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 1.5 }}
                  className="w-48 bg-white shadow-[0_10px_40px_-10px_rgba(0,0,0,0.1)] border border-green-100 rounded-2xl p-4 flex flex-col items-center text-center"
                >
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-3 text-green-600">
                    {/* FIX: Using IndianRupee icon */}
                    <IndianRupee className="w-6 h-6" />
                  </div>
                  <h3 className="text-sm font-bold text-zinc-800">
                    Expense Saved
                  </h3>
                  <p className="text-xs text-zinc-500 mt-1">
                    Categorized as{" "}
                    <span className="text-green-600 font-medium">
                      Food & Drink
                    </span>
                  </p>
                </motion.div>

                {/* Step 4: Chart (Floating behind) */}
                <div className="absolute -right-10 -bottom-10 opacity-20 hidden md:block">
                  <TrendingUp className="w-48 h-48 text-zinc-900" />
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

// --- 2. THE NAVBAR COMPONENT ---
const Navbar = () => {
  return (
    <nav className="flex w-full items-center justify-between border-t border-b border-neutral-200 px-4 py-4 dark:border-neutral-800">

      {/* 1. LOGO (Left) */}
      <div className="flex items-center gap-2">
        <Link href="/" className="flex items-center gap-2">
          <Image
            src="/logo.png"
            alt="Snap-Track Logo"
            width={32}
            height={32}
            className="w-8 h-8 rounded-full object-cover"
          />
          <span className="text-xl font-bold tracking-tight">
            Snap-Track
          </span>
        </Link>
      </div>

      {/* 2. MIDDLE SECTION REMOVED (Features/Pricing deleted) */}

      {/* 3. LOGIN BUTTON (Right) */}
      <Link href="/dashboard">
        <button className="w-24 transform rounded-lg bg-black px-6 py-2 font-medium text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-gray-800 md:w-32 dark:bg-white dark:text-black dark:hover:bg-gray-200">
          Login
        </button>
      </Link>
    </nav>
  );
};

// --- 3. HELPER COMPONENT (List Item) ---
const ListItem = React.forwardRef<
  React.ElementRef<"a">,
  React.ComponentPropsWithoutRef<"a">
>(({ className, title, children, href, ...props }, ref) => {
  return (
    <li>
      <NavigationMenuLink asChild>
        <Link
          href={href || "#"}
          // FIX: Cast to the specific HTML element type instead of 'any'
          ref={ref as React.Ref<HTMLAnchorElement>}
          className={cn(
            "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
            className
          )}
          {...props}
        >
          <div className="text-sm font-medium leading-none">{title}</div>
          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
            {children}
          </p>
        </Link>
      </NavigationMenuLink>
    </li>
  );
});
ListItem.displayName = "ListItem";