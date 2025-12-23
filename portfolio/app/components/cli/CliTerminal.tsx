"use client";

import { useRef, useState, useEffect } from "react";
import { useCli } from "./CliContext";
import { useCliLogic } from "./useCliLogic";
import { X, Minus, Maximize2, Terminal, Loader2 } from "lucide-react";
import { MatrixRain } from "./MatrixRain";
import { GAMES_REGISTRY } from "./games/registry";

export function CliTerminal() {
  const { isOpen, closeCli } = useCli();
  const { input, setInput, history, currentPath, handleKeyDown, isLoading, promptLabel, isMatrix, activeGame, setActiveGame } = useCliLogic();
  
  const [isMaximized, setIsMaximized] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  
  // Window State
  const [pos, setPos] = useState({ x: 0, y: 0 }); 
  const [size, setSize] = useState({ w: 700, h: 500 });
  
  // Interaction Refs (Optimization: Store static start values)
  const startState = useRef({ x: 0, y: 0, w: 0, h: 0, mx: 0, my: 0 });
  
  // Action State
  const [isDragging, setIsDragging] = useState(false);
  const [resizeDir, setResizeDir] = useState<string | null>(null);
  
  const inputRef = useRef<HTMLInputElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Center on Init
  useEffect(() => {
    if (isOpen && typeof window !== 'undefined') {
        const screenW = window.innerWidth;
        const screenH = window.innerHeight;
        
        let targetW = 700;
        let targetH = 500;

        // Mobile responsive sizing
        if (screenW < 768) {
             targetW = Math.min(screenW - 32, 700);
             targetH = Math.min(screenH * 0.55, 500); 
        }

        setSize({ w: targetW, h: targetH });
        setPos({
            x: Math.max(0, screenW / 2 - targetW / 2),
            y: Math.max(0, screenH / 2 - targetH / 2)
        });
        setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  // Auto Scroll
  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [history, isOpen]);

  // Global Mouse Move/Up Handler (Optimized with RAF & Refs)
  useEffect(() => {
    if (!isDragging && !resizeDir) return;

    let rafId: number;

    const handleMouseMove = (e: MouseEvent) => {
        // Prevent stacking updates
        cancelAnimationFrame(rafId);
        
        rafId = requestAnimationFrame(() => {
            const { x: sx, y: sy, w: sw, h: sh, mx: smx, my: smy } = startState.current;
            const dx = e.clientX - smx;
            const dy = e.clientY - smy;

            if (isDragging) {
                setPos({ x: sx + dx, y: sy + dy });
                return;
            }

            if (resizeDir) {
                const minW = window.innerWidth < 640 ? 250 : 400; 
                const minH = 200;
                
                let newX = sx;
                let newY = sy;
                let newW = sw;
                let newH = sh;

                // Horizontal
                if (resizeDir.includes('e')) newW = Math.max(minW, sw + dx);
                if (resizeDir.includes('w')) {
                    newW = Math.max(minW, sw - dx);
                    newX = sx + (sw - newW); 
                }

                // Vertical
                if (resizeDir.includes('s')) newH = Math.max(minH, sh + dy);
                if (resizeDir.includes('n')) {
                    newH = Math.max(minH, sh - dy);
                    newY = sy + (sh - newH);
                }

                setPos({ x: newX, y: newY });
                setSize({ w: newW, h: newH });
            }
        });
    };

    const handleMouseUp = () => {
        cancelAnimationFrame(rafId);
        setIsDragging(false);
        setResizeDir(null);
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
    return () => {
        cancelAnimationFrame(rafId);
        window.removeEventListener("mousemove", handleMouseMove);
        window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isDragging, resizeDir]); // No deps on pos/size!

  const startDrag = (e: React.MouseEvent) => {
      if (isMaximized) return;
      if ((e.target as HTMLElement).closest('.traffic-light')) return;
      
      setIsDragging(true);
      startState.current = {
          x: pos.x, y: pos.y, w: size.w, h: size.h,
          mx: e.clientX, my: e.clientY
      };
  };

  const startResize = (dir: string) => (e: React.MouseEvent) => {
      e.stopPropagation();
      e.preventDefault();
      setResizeDir(dir);
      startState.current = {
          x: pos.x, y: pos.y, w: size.w, h: size.h,
          mx: e.clientX, my: e.clientY
      };
  };

  // Reset minimized state when closed
  useEffect(() => {
    if (!isOpen) setIsMinimized(false);
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <>

        <div 
            className={`fixed inset-0 z-[100] overflow-hidden transition-all duration-500 ease-in-out origin-bottom-left
                ${isMaximized ? "bg-black" : "bg-transparent"}
                ${isMinimized ? "opacity-0 scale-0 pointer-events-none translate-y-[100vh]" : "opacity-100 scale-100 translate-y-0"}
            `}
        >
           {!isMaximized && !isMinimized && <div className="fixed inset-0 bg-black/40 backdrop-blur-[1px] -z-10" />}
    
   <div 
            style={isMaximized 
                ? { transform: "none", width: "100%", height: "100%" } 
                : { transform: `translate3d(${pos.x}px, ${pos.y}px, 0)`, width: size.w, height: size.h }
            }
            className={`bg-black/95 shadow-2xl border border-green-500/30 flex flex-col font-mono animate-in fade-in zoom-in-95 pointer-events-auto absolute top-0 left-0
              ${isMaximized ? "rounded-none" : "rounded-tl-lg rounded-tr-lg rounded-bl-lg"}
              ${isDragging || resizeDir ? "transition-none !duration-0 select-none will-change-transform" : "duration-200"}
            `}
            onClick={() => inputRef.current?.focus()}
          >

            {!isMaximized && (
                <>
                    <div className="absolute top-0 left-0 w-full h-1 cursor-n-resize z-50" onMouseDown={startResize('n')} />
                    <div className="absolute bottom-0 left-0 w-full h-1 cursor-s-resize z-50" onMouseDown={startResize('s')} />
                    <div className="absolute top-0 left-0 w-1 h-full cursor-w-resize z-50" onMouseDown={startResize('w')} />
                    <div className="absolute top-0 right-0 w-1 h-full cursor-e-resize z-50" onMouseDown={startResize('e')} />
                    <div className="absolute top-0 left-0 w-4 h-4 cursor-nw-resize z-50" onMouseDown={startResize('nw')} />
                    <div className="absolute top-0 right-0 w-4 h-4 cursor-ne-resize z-50" onMouseDown={startResize('ne')} />
                    <div className="absolute bottom-0 left-0 w-4 h-4 cursor-sw-resize z-50" onMouseDown={startResize('sw')} />
                    <div className="absolute bottom-0 right-0 w-4 h-4 cursor-se-resize z-50" onMouseDown={startResize('se')} />
                </>
            )}
    

            <div 
                className={`bg-gray-900/80 border-b border-gray-800 px-4 py-2 flex items-center justify-between select-none ${!isMaximized ? "cursor-default rounded-t-lg" : ""}`}
                onMouseDown={startDrag}
                onDoubleClick={() => setIsMaximized(!isMaximized)}
            >
                 <div className="flex items-center gap-2 traffic-light">
                     {/* Red: Close */}
                     <div 
                        className="w-3 h-3 rounded-full bg-[#FF5F57] hover:bg-[#FF5F57] cursor-pointer transition-all group flex items-center justify-center border border-black/10" 
                        onClick={closeCli}
                        title="Close"
                     >
                        <X className="w-2 h-2 text-[#4d0000] opacity-0 group-hover:opacity-100" strokeWidth={3} />
                     </div>
                     
                     {/* Yellow: Minimize */}
                     <div 
                        className="w-3 h-3 rounded-full bg-[#FEBC2E] hover:bg-[#FEBC2E] cursor-pointer transition-all group flex items-center justify-center border border-black/10" 
                        onClick={(e) => { e.stopPropagation(); setIsMinimized(true); }}
                        title="Minimize"
                     >
                        <Minus className="w-2 h-2 text-[#995700] opacity-0 group-hover:opacity-100" strokeWidth={3} />
                     </div>
                     
                     {/* Green: Maximize */}
                     <div 
                        className="w-3 h-3 rounded-full bg-[#28C840] hover:bg-[#28C840] cursor-pointer transition-all group flex items-center justify-center border border-black/10" 
                        onClick={() => setIsMaximized(!isMaximized)}
                        title="Maximize"
                     >
                        <Maximize2 className="w-1.5 h-1.5 text-[#006500] opacity-0 group-hover:opacity-100" strokeWidth={3} />
                     </div>
                 </div>
                 <div className="text-gray-400 text-xs font-semibold">user@portfolio:{currentPath}</div>
                 <div className="w-16" />
            </div>
    

            {isMatrix && (
                <div className="absolute inset-0 top-[32px] z-10 rounded-bl-lg overflow-hidden pointer-events-none">
                    <MatrixRain />
                </div>
            )}


            {activeGame && GAMES_REGISTRY[activeGame] && (
                 <div className="absolute inset-0 top-[32px] z-10 rounded-bl-lg overflow-hidden">
                    {(() => {
                        const GameComponent = GAMES_REGISTRY[activeGame].component;
                        return <GameComponent onExit={() => setActiveGame(null)} />;
                    })()}
                </div>
            )}


            <div className="flex-1 p-4 overflow-y-auto scrollbar-thin scrollbar-thumb-green-900 scrollbar-track-transparent space-y-1" ref={scrollRef}>
                 {history.map((line, i) => (
                     <div key={i} className="text-sm md:text-base text-green-400 whitespace-pre-wrap leading-tight">{line}</div>
                 ))}
                 
                 {isLoading ? (
                     <div className="flex items-center mt-2 text-green-500">
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        <span className="animate-pulse">Loading data...</span>
                     </div>
                 ) : (
                     <div className="flex items-center mt-2 group">
                         <span className="mr-2 text-green-500 font-bold select-none whitespace-nowrap">{promptLabel}</span>
                         <input 
                            ref={inputRef}
                            type="text" 
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={handleKeyDown}
                            className="flex-1 bg-transparent border-none outline-none text-green-400 placeholder-green-800 font-inherit caret-green-500"
                            autoComplete="off"
                            spellCheck="false"
                            autoFocus
                         />
                     </div>
                 )}
            </div>
          </div>
        </div>


        <div 
            className={`fixed bottom-4 left-8 z-[120] transition-all duration-500 ease-[cubic-bezier(0.19,1,0.22,1)] transform
                ${isMinimized ? "scale-100 opacity-100 translate-y-0" : "scale-0 opacity-0 translate-y-20"}
            `}
            onClick={() => setIsMinimized(false)}
        >
            <div className="w-12 h-12 sm:w-14 sm:h-14 bg-black/90 border border-green-500/50 rounded-full shadow-2xl flex items-center justify-center cursor-pointer hover:bg-green-900/20 group relative overflow-hidden">
                <div className="absolute inset-0 bg-green-500/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                <Terminal className="w-6 h-6 sm:w-7 sm:h-7 text-green-500" />
                

            </div>
            

        </div>
    </>
  );
}
