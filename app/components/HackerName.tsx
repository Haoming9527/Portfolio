"use client";

import { useState, useRef, useEffect } from "react";
import { useCli } from "./cli/CliContext";

const TARGET_TEXT = "Shen Haoming";
const CYCLES_PER_LETTER = 2;
const SHUFFLE_TIME = 50;
const CHARS = "!@#$%^&*():{};|,.<>/?abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMOPQRSTUVWXYZ0123456789";

export function HackerName() {
  const [text, setText] = useState(TARGET_TEXT);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const { toggleCli } = useCli();

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
      onClick={scramble}
      onDoubleClick={toggleCli}
      className="text-4xl sm:text-5xl lg:text-5xl font-bold leading-tight text-slate-950 dark:text-white font-display cursor-pointer select-none relative z-20 decoration-slate-950 dark:decoration-white underline-offset-[0.28em] [text-decoration-skip-ink:none] hover:underline"
      style={{ lineHeight: "1.4" }}
    >
      {text}
    </h1>
  );
}
