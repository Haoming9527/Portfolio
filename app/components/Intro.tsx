"use client";

import { useRef, useEffect } from "react";
import gsap from "gsap";
import Image from "next/image";
import profile from "../../public/profile.jpg";
import { Card, CardContent } from "@/components/ui/card";
import { HackerName } from "./HackerName";

export function Intro() {
  const containerRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }

    const ctx = gsap.context(() => {
      gsap.from(".intro-fade-in", {
        y: 24,
        opacity: 0,
        duration: 0.75,
        stagger: 0.12,
        ease: "power4.out",
        delay: 0.2,
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={containerRef} className="grid grid-cols-1 lg:grid-cols-8 gap-4 p-6 lg:p-8">
      <Image
        src={profile}
        alt="Shen Haoming"
        className="intro-fade-in col-span-1 lg:col-span-3 h-[300px] lg:h-[500px] object-cover object-top rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 order-1 lg:order-2"
        priority
        placeholder="blur"
        sizes="(max-width: 1024px) 100vw, 40vw"
      />
      <div ref={cardRef} className="intro-fade-in col-span-1 lg:col-span-5 h-full order-2 lg:order-1 relative">
        <Card className="w-full h-full min-h-[400px] lg:min-h-[300px] border-slate-200 bg-slate-50 shadow-none dark:border-slate-800 dark:bg-slate-950 relative overflow-hidden">
          <CardContent className="p-6 h-full flex flex-col justify-center relative z-10">
            <div className="max-w-lg">
              <div className="intro-fade-in">
                  <HackerName />
              </div>
              <h2 className="intro-fade-in text-2xl lg:text-2xl font-semibold mt-6 text-gray-800 dark:text-gray-200">
                Software Developer
              </h2>
              <p className="intro-fade-in text-lg lg:text-lg font-normal mt-6 text-gray-600 dark:text-gray-400 leading-relaxed">
              Passionate about building innovative software, AI engineering, and developing intelligent systems.
              </p>

            <div className="intro-fade-in">
                <a
                  href="mailto:lbb54188@gmail.com"
                  className="group mt-6 inline-flex min-h-11 items-center rounded-md bg-slate-950 px-5 py-3 font-medium text-white transition-colors duration-200 hover:bg-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 dark:bg-white dark:text-slate-950 dark:hover:bg-primary dark:hover:text-primary-foreground"
                >
                  Get in touch
                </a>
            </div>
            
            <div className="intro-fade-in flex gap-4 mt-4">
              <a
                href="https://www.linkedin.com/in/shen-haoming/"
                target="_blank"
                rel="noopener noreferrer"
                className="min-h-11 px-5 py-3 bg-white dark:bg-gray-900 hover:bg-slate-100 dark:hover:bg-slate-800 text-gray-800 dark:text-white font-medium rounded-md transition-colors duration-200 flex items-center gap-2 border border-gray-200 dark:border-gray-700 group"
              >
                <Image
                  src="/linkedin.png"
                  alt="LinkedIn"
                  width={30}
                  height={30}
                  className="w-6 h-6 group-hover:scale-110 transition-transform duration-200"
                />
                LinkedIn
              </a>
              
              <a
                href="https://github.com/Haoming9527"
                target="_blank"
                rel="noopener noreferrer"
                className="min-h-11 px-5 py-3 bg-white dark:bg-gray-900 text-gray-800 dark:text-white font-medium rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors duration-200 flex items-center gap-2 border border-gray-200 dark:border-gray-700 group"
              >
                <Image
                  src="/github_light.png"
                  alt="GitHub"
                  width={20}
                  height={20}
                  className="w-5 h-5 dark:hidden group-hover:scale-110 transition-transform duration-200"
                />
                <Image
                  src="/github_dark.png"
                  alt="GitHub"
                  width={20}
                  height={20}
                  className="w-5 h-5 hidden dark:block group-hover:scale-110 transition-transform duration-200"
                />
                GitHub
              </a>
            </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
