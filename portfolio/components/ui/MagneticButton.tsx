"use client";

import { useRef, useEffect } from "react";
import gsap from "gsap";

interface MagneticButtonProps {
  children: React.ReactNode;
  className?: string;
  href?: string;
}

export function MagneticButton({
  children,
  className = "",
  href,
}: MagneticButtonProps) {
  const buttonRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const button = buttonRef.current;
    const text = textRef.current;

    if (!button || !text) return;

    const xTo = gsap.quickTo(button, "x", {
      duration: 1,
      ease: "elastic.out(1, 0.3)",
    });
    const yTo = gsap.quickTo(button, "y", {
      duration: 1,
      ease: "elastic.out(1, 0.3)",
    });
    
    const xToText = gsap.quickTo(text, "x", {
        duration: 1,
        ease: "elastic.out(1, 0.3)",
    });
    const yToText = gsap.quickTo(text, "y", {
        duration: 1,
        ease: "elastic.out(1, 0.3)",
    });


    const handleMouseMove = (e: MouseEvent) => {
      const { clientX, clientY } = e;
      const { left, top, width, height } = button.getBoundingClientRect();
      const x = clientX - (left + width / 2);
      const y = clientY - (top + height / 2);

      xTo(x * 0.3); // Scale down movement for button
      yTo(y * 0.3);
      
      xToText(x * 0.1); // Even more subtle for text
      yToText(y * 0.1);
    };

    const handleMouseLeave = () => {
      xTo(0);
      yTo(0);
      xToText(0);
      yToText(0);
    };

    button.addEventListener("mousemove", handleMouseMove);
    button.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      button.removeEventListener("mousemove", handleMouseMove);
      button.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, []);

  const content = (
    <span ref={textRef} className="relative z-10 block">
      {children}
    </span>
  );

  const buttonClasses = `relative inline-block ${className} will-change-transform`;

  if (href) {
    return (
      <a href={href} className={buttonClasses}>
        <div ref={buttonRef} className="inline-block">
            {content}
        </div>
      </a>
    );
  }

  return (
    <div className={buttonClasses}>
         <div ref={buttonRef} className="inline-block cursor-pointer">
             {content}
         </div>
    </div>
  );
}
