"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const ROUTES = [
  { path: "/", name: "Experience", next: "/experience" },
  { path: "/experience", name: "Projects", next: "/projects" },
  { path: "/projects", name: "Certificates", next: "/certificates" },
  { path: "/certificates", name: "Guestbook", next: "/guestbook" },
  { path: "/guestbook", name: "Home", next: "/" },
];

export function NextPageButton() {
  const [show, setShow] = useState(false);
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  const currentRoute = ROUTES.find((r) => r.path === pathname);

  useEffect(() => {
    setMounted(true);
    setShow(false);

    const handleScroll = () => {
      const isNearBottom =
        window.innerHeight + window.scrollY >=
        document.documentElement.scrollHeight - 200;

      setShow(isNearBottom);
    };

    window.addEventListener("scroll", handleScroll);
    setTimeout(handleScroll, 100);

    return () => window.removeEventListener("scroll", handleScroll);
  }, [pathname]);

  if (!mounted || !currentRoute) return null;

  return (
    <div
      className="w-full flex justify-center py-12 relative z-40 overflow-hidden"
    >
      <div
        className={`transition-all duration-700 ease-out flex justify-center ${
          show
            ? "translate-y-0 opacity-100 scale-100"
            : "translate-y-20 opacity-0 scale-95"
        }`}
      >
        <Button
          onClick={() => router.push(currentRoute.next)}
          className="rounded-full shadow-lg hover:shadow-2xl transition-shadow bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 h-16 text-lg font-semibold group flex items-center justify-center gap-3 border border-blue-400/50 dark:border-blue-900/50"
        >
          <span className="leading-none translate-y-[1px]">Go to {currentRoute.name}</span>
          <ArrowRight className="size-5 group-hover:translate-x-1 transition-transform" />
        </Button>
      </div>
    </div>
  );
}
