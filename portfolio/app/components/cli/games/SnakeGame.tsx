"use client";

import { useEffect, useRef, useState } from "react";

interface SnakeGameProps {
  onExit: () => void;
}

export function SnakeGame({ onExit }: SnakeGameProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);


  const CELL_SIZE = 20;
  const SPEED = 100; // ms per frame


  const snake = useRef([{ x: 10, y: 10 }]);
  const food = useRef({ x: 15, y: 15 });
  const dir = useRef({ x: 1, y: 0 }); // Moving right
  const nextDir = useRef({ x: 1, y: 0 }); // Buffer for next move to prevent 180 turn
  const gameLoopRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    // Set size based on parent (approximate grid)
    const setupCanvas = () => {
        const parent = canvas.parentElement;
        if (parent) {
            canvas.width = Math.floor(parent.clientWidth / CELL_SIZE) * CELL_SIZE;
            canvas.height = Math.floor(parent.clientHeight / CELL_SIZE) * CELL_SIZE;
        }
    };
    setupCanvas();
    window.addEventListener('resize', setupCanvas);


    const handleKey = (e: KeyboardEvent) => {
        switch(e.key) {
            case 'ArrowUp':
                if (dir.current.y === 0) nextDir.current = { x: 0, y: -1 };
                break;
            case 'ArrowDown':
                if (dir.current.y === 0) nextDir.current = { x: 0, y: 1 };
                break;
            case 'ArrowLeft':
                if (dir.current.x === 0) nextDir.current = { x: -1, y: 0 };
                break;
            case 'ArrowRight':
                if (dir.current.x === 0) nextDir.current = { x: 1, y: 0 };
                break;
            case 'Escape':
            case 'q':
                onExit();
                break;
        }
    };
    window.addEventListener('keydown', handleKey);


    const spawnFood = () => {
        const cols = canvas.width / CELL_SIZE;
        const rows = canvas.height / CELL_SIZE;
        food.current = {
            x: Math.floor(Math.random() * cols),
            y: Math.floor(Math.random() * rows)
        };
    };


    const tick = () => {
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;


        dir.current = nextDir.current;


        const head = { ...snake.current[0] };
        head.x += dir.current.x;
        head.y += dir.current.y;


        const cols = canvas.width / CELL_SIZE;
        const rows = canvas.height / CELL_SIZE;
        
        // Wrap around (Retro style)
        if (head.x < 0) head.x = cols - 1;
        if (head.x >= cols) head.x = 0;
        if (head.y < 0) head.y = rows - 1;
        if (head.y >= rows) head.y = 0;


        if (snake.current.some(s => s.x === head.x && s.y === head.y)) {
            setGameOver(true);
            if (gameLoopRef.current) clearInterval(gameLoopRef.current);
            return;
        }

        snake.current.unshift(head);


        if (head.x === food.current.x && head.y === food.current.y) {
            setScore(s => s + 1);
            spawnFood();
        } else {
            snake.current.pop();
        }

        // Draw
        ctx.fillStyle = '#000'; // BG
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Draw Food
        ctx.fillStyle = '#ff0000';
        ctx.fillRect(food.current.x * CELL_SIZE, food.current.y * CELL_SIZE, CELL_SIZE - 2, CELL_SIZE - 2);

        // Draw Snake
        ctx.fillStyle = '#00ff00';
        snake.current.forEach(segment => {
            ctx.fillRect(segment.x * CELL_SIZE, segment.y * CELL_SIZE, CELL_SIZE - 2, CELL_SIZE - 2);
        });
    };

    gameLoopRef.current = setInterval(tick, SPEED);

    return () => {
        window.removeEventListener('keydown', handleKey);
        window.removeEventListener('resize', setupCanvas);
        if (gameLoopRef.current) clearInterval(gameLoopRef.current);
    };
  }, [onExit]); // Run once on mount

  return (
    <div className="absolute inset-0 z-50 bg-black flex flex-col items-center justify-center font-mono text-green-500">
        {gameOver ? (
            <div className="text-center space-y-4 animate-in fade-in zoom-in">
                <h2 className="text-4xl font-bold text-red-500">GAME OVER</h2>
                <p className="text-xl">Score: {score}</p>
                <div className="flex gap-4 justify-center">
                    <button 
                        onClick={() => {
                            // Reset
                            setGameOver(false);
                            setScore(0);
                            const canvas = canvasRef.current;
                            if (canvas) {
                                snake.current = [{ x: 10, y: 10 }];
                                dir.current = { x: 1, y: 0 };
                                nextDir.current = { x: 1, y: 0 };
                                // Re-trigger via exit for simplicity
                                onExit();
                            }
                        }}
                        className="border border-green-500 px-4 py-2 hover:bg-green-500/20"
                    >
                        Exit
                    </button>
                    <button 
                         onClick={() => window.location.reload()} // Hacky reset? No.
                         className="border border-green-500 px-4 py-2 hover:bg-green-500/20 hidden"
                    >
                        Retry
                    </button>
                </div>
                <p className="text-sm text-gray-500">Press &apos;q&apos; or &apos;Esc&apos; to exit</p>
            </div>
        ) : (
            <>
                <div className="absolute top-4 left-4 text-xl font-bold opacity-50">SCORE: {score}</div>
                <div className="absolute top-4 right-4 text-xs opacity-50">ARROWS to move | ESC/Q to quit</div>
                <canvas ref={canvasRef} className="max-w-full max-h-full" />
            </>
        )}
    </div>
  );
}
