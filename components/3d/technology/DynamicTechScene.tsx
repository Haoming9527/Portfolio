"use client";

import dynamic from "next/dynamic";
import { Skeleton } from "@/components/ui/skeleton";

const TechScene = dynamic(() => import("./TechScene"), {
  ssr: false,
  loading: () => <Skeleton className="w-full h-full rounded-2xl bg-gray-200 dark:bg-gray-800" />,
});

export default function DynamicTechScene() {
  return <TechScene />;
}
