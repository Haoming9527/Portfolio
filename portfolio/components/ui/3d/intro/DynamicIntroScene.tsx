"use client";

import dynamic from "next/dynamic";

const IntroScene = dynamic(() => import("./IntroScene"), {
  ssr: false,
});

export default function DynamicIntroScene() {
  return <IntroScene />;
}
