"use client";

import { useState, useRef, useEffect } from "react";

const TARGET_TEXT = "Shen Haoming";
const CYCLES_PER_LETTER = 2;
const SHUFFLE_TIME = 50;
const CHARS = "!@#$%^&*():{};|,.<>/?abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMOPQRSTUVWXYZ0123456789";

export function HackerName() {
  const [text, setText] = useState(TARGET_TEXT);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const scramble = () => {
    let pos = 0;

    if (intervalRef.current) {
        clearInterval(intervalRef.current);
    }

    intervalRef.current = setInterval(() => {
      const scrambled = TARGET_TEXT.split("")
        .map((char, index) => {
          if (pos / CYCLES_PER_LETTER > index) {
            return char;
          }

          const randomCharIndex = Math.floor(Math.random() * CHARS.length);
          return CHARS[randomCharIndex];
        })
        .join("");

      setText(scrambled);
      pos++;

      if (pos >= TARGET_TEXT.length * CYCLES_PER_LETTER) {
        if (intervalRef.current) clearInterval(intervalRef.current);
        setText(TARGET_TEXT);
      }
    }, SHUFFLE_TIME);
  };

  useEffect(() => {
    scramble();
  }, []);

  return (
    <h1
      className="text-4xl sm:text-5xl lg:text-5xl font-bold leading-tight bg-gradient-to-r from-indigo-600 via-blue-500 to-cyan-500 bg-clip-text text-transparent font-[family-name:var(--font-geist-mono)] cursor-default select-none relative z-20"
      style={{ lineHeight: "1.4" }}
    >
      {text}
    </h1>
  );
}
