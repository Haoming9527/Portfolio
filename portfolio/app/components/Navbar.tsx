"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { MobileMenu } from "./MobileMenu";
import { ThemeToggle } from "./ThemeToggle";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";

export const navigationItems = [
  {
    name: "Home",
    href: "/",
  },
  {
    name: "Experience",
    href: "/experience",
  },
  {
    name: "Projects",
    href: "/projects",
  },
  {
    name: "Certificates",
    href: "/certificates",
  },
  {
    name: "Guestbook",
    href: "/guestbook",
  },
];

export function Navbar() {
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <nav className="sticky top-0 z-50 w-full bg-gradient-to-r from-white/90 via-gray-50/90 to-white/90 backdrop-blur-md border-b border-gray-100 dark:from-gray-950/90 dark:via-gray-900/90 dark:to-gray-950/90 dark:border-gray-800">
      <div className="container mx-auto px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo/Brand */}
          <div className="flex items-center">
            <Link 
              href="/" 
              className="group flex items-center space-x-3 transition-all duration-200 hover:no-underline"
            >
              <div className="relative">
                <div className="h-10 w-10 rounded-lg bg-white dark:bg-black border-2 border-gray-300 dark:border-gray-700 flex items-center justify-center group-hover:scale-110 transition-transform duration-200 shadow-sm group-hover:shadow-md overflow-hidden">
                  <img 
                    src="/appicon_light.png" 
                    alt="HM Logo" 
                    className="h-6 w-6 object-contain dark:hidden"
                  />
                  <img 
                    src="/appicon_dark.png" 
                    alt="HM Logo" 
                    className="h-6 w-6 object-contain hidden dark:block"
                  />
                </div>
                <div className="absolute -inset-1 bg-gray-400/20 dark:bg-gray-600/20 rounded-lg blur opacity-0 group-hover:opacity-100 transition-opacity duration-200"></div>
              </div>
              <div className="hidden sm:block">
                <h1 className="text-xl font-semibold tracking-tight text-gray-900 dark:text-white">
                  Shen <span className="font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Haoming</span>
                </h1>
               
              </div>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navigationItems.map((item, index) => (
              <Link 
                key={index}
                href={item.href}
                className={cn(
                  "relative text-sm font-semibold transition-all duration-200 hover:text-gray-900 dark:hover:text-white group tracking-wide hover:no-underline",
                  mounted && pathname === item.href
                    ? "text-gray-900 dark:text-white"
                    : "text-gray-600 dark:text-gray-400"
                )}
              >
                {item.name}
                {mounted && pathname === item.href && (
                  <span className="absolute -bottom-1 left-0 h-0.5 w-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"></span>
                )}
                <span className="absolute -bottom-1 left-0 h-0.5 w-0 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full transition-all duration-200 group-hover:w-full"></span>
              </Link>
            ))}
          </div>

          {/* Right side - Theme toggle, Contact button and mobile menu */}
          <div className="flex items-center space-x-4">
            {/* Theme Toggle */}
            <ThemeToggle />
            
            <Button 
              className="hidden sm:flex bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white border-0 shadow-sm hover:shadow-md transition-all duration-200 font-semibold text-sm tracking-wide" 
              asChild
            >
              <a href="mailto:lbb54188@gmail.com" className="flex items-center space-x-2 hover:no-underline">
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <span>Contact</span>
              </a>
            </Button>
            
            {/* Mobile menu */}
            <div className="md:hidden">
              <MobileMenu />
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}