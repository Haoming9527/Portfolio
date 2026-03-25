"use client";

import { useEffect, useRef, useState } from "react";

interface TetrisProps {
  onExit: () => void;
}

const COLS = 10;
const ROWS = 20;
const BLOCK_SIZE = 20;
const COLORS = [
  null,
  "#FF0D72", // I
  "#0DC2FF", // J
  "#0DFF72", // L
  "#F538FF", // O
  "#FF8E0D", // S
  "#FFE138", // T
  "#3877FF"  // Z
];

const SHAPES = [
  [],
  [[0, 0, 0, 0], [1, 1, 1, 1], [0, 0, 0, 0], [0, 0, 0, 0]], // I
  [[2, 0, 0], [2, 2, 2], [0, 0, 0]], // J
  [[0, 0, 3], [3, 3, 3], [0, 0, 0]], // L
  [[4, 4], [4, 4]], // O
  [[0, 5, 5], [5, 5, 0], [0, 0, 0]], // S
  [[0, 6, 0], [6, 6, 6], [0, 0, 0]], // T
  [[7, 7, 0], [0, 7, 7], [0, 0, 0]]  // Z
];

export function TetrisGame({ onExit }: TetrisProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const requestRef = useRef<number>(0);
  const lastTimeRef = useRef<number>(0);
  const dropCounterRef = useRef(0);
  const dropIntervalRef = useRef(1000);

  const arenaRef = useRef<number[][]>(Array.from({ length: ROWS }, () => Array(COLS).fill(0)));
  const playerRef = useRef({
    pos: { x: 0, y: 0 },
    matrix: [] as number[][],
  });

  const createPiece = (type: number) => {
    return SHAPES[type];
  };

  const playerReset = () => {
    const pieces = [1, 2, 3, 4, 5, 6, 7];
    playerRef.current.matrix = createPiece(pieces[Math.floor(Math.random() * pieces.length)]);
    playerRef.current.pos.y = 0;
    playerRef.current.pos.x = Math.floor(COLS / 2) - Math.floor(playerRef.current.matrix[0].length / 2);
    
    if (collide(arenaRef.current, playerRef.current)) {
      setGameOver(true);
    }
  };

  const collide = (arena: number[][], player: { pos: { x: number, y: number }, matrix: number[][] }) => {
    const m = player.matrix;
    const o = player.pos;
    for (let y = 0; y < m.length; ++y) {
      for (let x = 0; x < m[y].length; ++x) {
        if (m[y][x] !== 0 && (arena[y + o.y] && arena[y + o.y][x + o.x]) !== 0) {
          return true;
        }
      }
    }
    return false;
  };

  const merge = (arena: number[][], player: { pos: { x: number, y: number }, matrix: number[][] }) => {
    player.matrix.forEach((row, y) => {
      row.forEach((value, x) => {
        if (value !== 0) {
          arena[y + player.pos.y][x + player.pos.x] = value;
        }
      });
    });
  };

  const playerDrop = () => {
    playerRef.current.pos.y++;
    if (collide(arenaRef.current, playerRef.current)) {
      playerRef.current.pos.y--;
      merge(arenaRef.current, playerRef.current);
      playerReset();
      arenaSweep();
    }
    dropCounterRef.current = 0;
  };

  const playerMove = (offset: number) => {
    playerRef.current.pos.x += offset;
    if (collide(arenaRef.current, playerRef.current)) {
      playerRef.current.pos.x -= offset;
    }
  };

  const playerRotate = (dir: number) => {
    const pos = playerRef.current.pos.x;
    let offset = 1;
    rotate(playerRef.current.matrix, dir);
    while (collide(arenaRef.current, playerRef.current)) {
      playerRef.current.pos.x += offset;
      offset = -(offset + (offset > 0 ? 1 : -1));
      if (offset > playerRef.current.matrix[0].length) {
        rotate(playerRef.current.matrix, -dir);
        playerRef.current.pos.x = pos;
        return;
      }
    }
  };

  const rotate = (matrix: number[][], dir: number) => {
    for (let y = 0; y < matrix.length; ++y) {
      for (let x = 0; x < y; ++x) {
        [matrix[x][y], matrix[y][x]] = [matrix[y][x], matrix[x][y]];
      }
    }
    if (dir > 0) {
      matrix.forEach(row => row.reverse());
    } else {
      matrix.reverse();
    }
  };

  const arenaSweep = () => {
    let rowCount = 1;
    let newScore = 0;
    outer: for (let y = arenaRef.current.length - 1; y >= 0; --y) {
      for (let x = 0; x < arenaRef.current[y].length; ++x) {
        if (arenaRef.current[y][x] === 0) {
          continue outer;
        }
      }
      const row = arenaRef.current.splice(y, 1)[0].fill(0);
      arenaRef.current.unshift(row);
      ++y;
      newScore += rowCount * 10;
      rowCount *= 2;
    }
    if (newScore > 0) {
      setScore(s => s + newScore);
      dropIntervalRef.current = Math.max(100, dropIntervalRef.current - 10);
    }
  };

  useEffect(() => {
    if (gameOver) return;

    playerReset();

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const drawMatrix = (matrix: number[][], offset: {x: number, y: number}) => {
      matrix.forEach((row, y) => {
        row.forEach((value, x) => {
          if (value !== 0) {
            ctx.fillStyle = COLORS[value] as string;
            ctx.fillRect(x + offset.x, y + offset.y, 1, 1);
            // borders
            ctx.lineWidth = 0.05;
            ctx.strokeStyle = "rgba(0,0,0,0.5)";
            ctx.strokeRect(x + offset.x, y + offset.y, 1, 1);
          }
        });
      });
    };

    const draw = () => {
      // Background
      ctx.fillStyle = '#000';
      ctx.fillRect(0, 0, COLS, ROWS);
      
      // Draw grid lines
      ctx.lineWidth = 0.02;
      ctx.strokeStyle = '#222';
      for (let i = 0; i <= COLS; i++) {
          ctx.beginPath();
          ctx.moveTo(i, 0);
          ctx.lineTo(i, ROWS);
          ctx.stroke();
      }
      for (let j = 0; j <= ROWS; j++) {
          ctx.beginPath();
          ctx.moveTo(0, j);
          ctx.lineTo(COLS, j);
          ctx.stroke();
      }

      drawMatrix(arenaRef.current, {x: 0, y: 0});
      drawMatrix(playerRef.current.matrix, playerRef.current.pos);
    };

    // Scale canvas to match the container
    const setupCanvas = () => {
      const parent = canvas.parentElement;
      if (parent) {
        const parentH = parent.clientHeight - 80;
        const expectedW = (parentH / ROWS) * COLS;
        canvas.height = parentH;
        canvas.width = expectedW;
        ctx.setTransform(1, 0, 0, 1, 0, 0); // Reset transform before scaling
        ctx.scale(canvas.width / COLS, canvas.height / ROWS);
        draw(); // Redraw immediately on resize
      }
    };
    setupCanvas();
    const observer = new ResizeObserver(setupCanvas);
    if (canvas.parentElement) observer.observe(canvas.parentElement);

    const update = (time = 0) => {
      const deltaTime = time - lastTimeRef.current;
      lastTimeRef.current = time;
      dropCounterRef.current += deltaTime;
      if (dropCounterRef.current > dropIntervalRef.current) {
        playerDrop();
      }
      draw();
      requestRef.current = requestAnimationFrame(update);
    };

    const handleKey = (e: KeyboardEvent) => {
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', ' '].includes(e.key)) {
        e.preventDefault();
      }
      if (e.key === 'ArrowLeft') {
        playerMove(-1);
      } else if (e.key === 'ArrowRight') {
        playerMove(1);
      } else if (e.key === 'ArrowDown') {
        playerDrop();
      } else if (e.key === 'ArrowUp') {
        playerRotate(1);
      } else if (e.key === ' ') {
        while (!collide(arenaRef.current, playerRef.current)) {
            playerRef.current.pos.y++;
        }
        playerRef.current.pos.y--;
        merge(arenaRef.current, playerRef.current);
        playerReset();
        arenaSweep();
        dropCounterRef.current = 0;
      } else if (e.key === 'q' || e.key === 'Escape') {
        onExit();
      }
    };
    
    const handlePointerMove = (e: PointerEvent) => {
      if (!canvas || gameOver) return;
      const rect = canvas.getBoundingClientRect();
      const colWidth = rect.width / COLS;
      const targetCol = Math.floor((e.clientX - rect.left) / colWidth) - Math.floor(playerRef.current.matrix[0].length / 2);
      
      if (targetCol > playerRef.current.pos.x) playerMove(1);
      else if (targetCol < playerRef.current.pos.x) playerMove(-1);
    };

    const handlePointerDown = (e: PointerEvent) => {
      // Rotate if clicking on the canvas
      if (!gameOver && e.target === canvas) {
        playerRotate(1);
      }
    };

    window.addEventListener("keydown", handleKey);
    window.addEventListener("pointerdown", handlePointerDown);
    canvas.addEventListener("pointermove", handlePointerMove);
    requestRef.current = requestAnimationFrame(update);

    return () => {
      window.removeEventListener("keydown", handleKey);
      window.removeEventListener("pointerdown", handlePointerDown);
      canvas.removeEventListener("pointermove", handlePointerMove);
      cancelAnimationFrame(requestRef.current);
      observer.disconnect();
    };
  }, [gameOver, onExit]);

  return (
    <div className="absolute inset-0 z-50 bg-black flex flex-col items-center justify-center font-mono text-green-500">
      {gameOver ? (
        <div className="text-center space-y-4 animate-in fade-in zoom-in">
          <h2 className="text-4xl font-bold text-red-500">GAME OVER</h2>
          <p className="text-xl">Score: {score}</p>
          <div className="flex gap-4 justify-center">
            <button 
              onClick={onExit}
              className="border border-green-500 px-4 py-2 hover:bg-green-500/20"
            >
              Exit
            </button>
            <button 
              onClick={() => {
                arenaRef.current = Array.from({ length: ROWS }, () => Array(COLS).fill(0));
                setScore(0);
                dropIntervalRef.current = 1000;
                setGameOver(false);
              }} 
              className="border border-green-500 px-4 py-2 hover:bg-green-500/20"
            >
              Retry
            </button>
          </div>
        </div>
      ) : (
        <>
                <div className="absolute top-4 left-4 text-xl font-bold opacity-50">SCORE: {score}</div>
                <div className="absolute top-4 right-4 text-xs opacity-50 text-right">
                    MOUSE / ARROWS: Move<br/>
                    CLICK / UP: Rotate Piece<br/>
                    SPACE: Drop | ESC: Quit
                </div>
          <div className="relative w-full h-full flex justify-center py-10">
            <canvas ref={canvasRef} className="border border-green-900 bg-black shadow-[0_0_20px_#00ff0033]" />
          </div>
        </>
      )}
    </div>
  );
}
