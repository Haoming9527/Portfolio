"use client";

import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Menu } from "lucide-react";
import { navigationItems } from "./Navbar";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

export function MobileMenu() {
  const location = usePathname();
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [location]);

  return (
    <Sheet open={open} onOpenChange={(state) => setOpen(state)}>
      <SheetTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className="h-9 w-9 border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors duration-200"
        >
          <Menu className="h-4 w-4" />
          <span className="sr-only">Toggle menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent
        side="right"
        className="w-[280px] bg-white/95 dark:bg-gray-950/95 backdrop-blur-md border-l border-gray-200 dark:border-gray-800"
      >
        <SheetHeader className="border-b border-gray-200 dark:border-gray-800 pb-4">
          <SheetTitle className="text-left text-xl font-bold text-gray-900 dark:text-white tracking-tight">
            Navigation
          </SheetTitle>
        </SheetHeader>

        <div className="flex flex-col space-y-2 py-6">
          {navigationItems.map((item, index) => (
            <Link
              key={index}
              href={item.href}
              className={cn(
                "group flex items-center px-4 py-3 text-base font-semibold rounded-lg transition-all duration-200 tracking-wide relative",
                mounted && location === item.href
                  ? "bg-slate-100 dark:bg-slate-900 text-gray-900 dark:text-white border border-slate-200 dark:border-slate-800"
                  : "text-gray-600 dark:text-gray-400 hover:bg-slate-100 dark:hover:bg-slate-900 hover:text-gray-900 dark:hover:text-white"
              )}
            >
              <span className="relative">
                {item.name}
                {mounted && location === item.href && (
                  <span className="absolute -bottom-1 left-0 h-0.5 w-full bg-primary rounded-full"></span>
                )}
                <span className="absolute -bottom-1 left-0 h-0.5 w-0 bg-primary/70 rounded-full transition-all duration-200 group-hover:w-full"></span>
              </span>
            </Link>
          ))}
        </div>

        <SheetFooter className="border-t border-gray-200 dark:border-gray-800 pt-4">
          <Button
            className="w-full bg-slate-950 hover:bg-primary text-white border-0 transition-colors duration-200 font-semibold text-sm tracking-wide dark:bg-white dark:text-slate-950 dark:hover:bg-primary dark:hover:text-primary-foreground"
            asChild
          >
            <a
              href="mailto:lbb54188@gmail.com"
              className="flex items-center justify-center space-x-2"
            >
              <svg
                className="h-4 w-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                />
              </svg>
              <span>Contact</span>
            </a>
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
