"use client";

import dynamic from "next/dynamic";

const IntroScene = dynamic(() => import("./IntroScene"), {
  ssr: false,
});

import { RefObject } from "react";

export default function DynamicIntroScene({ eventSource }: { eventSource?: RefObject<HTMLElement> }) {
  return <IntroScene eventSource={eventSource} />;
}
