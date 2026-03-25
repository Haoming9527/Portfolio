"use client";

import { useEffect, useRef, useState } from "react";
import type { DataConnection } from "peerjs";

interface GomokuProps {
  onExit: () => void;
}

type GameMode = 'local' | 'host' | 'client';
const BOARD_SIZE = 15;

export function GomokuGame({ onExit }: GomokuProps) {
  const [mode, setMode] = useState<GameMode | null>(null);
  const [joinCodeInput, setJoinCodeInput] = useState("");
  
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [board, setBoard] = useState<number[][]>(Array(BOARD_SIZE).fill(null).map(() => Array(BOARD_SIZE).fill(0)));
  const [currentPlayer, setCurrentPlayer] = useState(1); // 1 for Black, 2 for White
  const [winner, setWinner] = useState<number | null>(null);
  const [gameSize, setGameSize] = useState({ cellSize: 30, radius: 12 });

  // Multiplayer State
  const [peerId, setPeerId] = useState<string | null>(null);
  const [conn, setConn] = useState<DataConnection | null>(null);
  const [isReady, setIsReady] = useState(false);
  const [myPlayerNumber, setMyPlayerNumber] = useState<number>(0);
  const [peerError, setPeerError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const peerRef = useRef<any>(null);
  const connRef = useRef<DataConnection | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const resetToLobby = () => {
    setBoard(Array(BOARD_SIZE).fill(null).map(() => Array(BOARD_SIZE).fill(0)));
    setCurrentPlayer(1);
    setWinner(null);
    setIsReady(false);
    setConn(null);
    connRef.current = null;
    setMode(null);
    setPeerError(null);
  };

  useEffect(() => {
    if (!mode) return;
    if (mode === 'local') {
        setIsReady(true);
        return;
    }

    let peerInstance: any = null;

    const initPeer = async () => {
        const PeerJS = (await import("peerjs")).default;
        const peer = new PeerJS();
        peerRef.current = peer;
        peerInstance = peer;

        const onConnectionClose = () => {
            resetToLobby();
            setPeerError("Opponent disconnected.");
        };

        const setupConnection = (connection: DataConnection) => {
            setConn(connection);
            connRef.current = connection;

            const onConnectionOpen = () => {
                setIsReady(true);
                if (mode === 'host') {
                    connection.send({ type: 'init', board: Array(BOARD_SIZE).fill(null).map(() => Array(BOARD_SIZE).fill(0)) });
                }
            };

            if (connection.open) {
                onConnectionOpen();
            } else {
                connection.on('open', onConnectionOpen);
            }

            connection.on('data', (data: any) => {
                if (data.type === 'move') {
                    setBoard(data.board);
                    setCurrentPlayer(data.nextPlayer);
                    if (data.winner) setWinner(data.winner);
                } else if (data.type === 'init') {
                    setBoard(data.board);
                    setIsReady(true);
                } else if (data.type === 'room-full') {
                    setPeerError("This room is already full (2 players max).");
                    setTimeout(() => resetToLobby(), 2000);
                } else if (data.type === 'reset') {
                    setBoard(Array(BOARD_SIZE).fill(null).map(() => Array(BOARD_SIZE).fill(0)));
                    setWinner(null);
                    setCurrentPlayer(1);
                }
            });

            connection.on('close', onConnectionClose);
            connection.on('error', (err) => {
                console.error("Connection error:", err);
                onConnectionClose();
            });
        };

        peer.on('open', (id) => {
            setPeerId(id);
            if (mode === 'client' && joinCodeInput) {
                const newConn = peer.connect(joinCodeInput);
                setupConnection(newConn);
            }
        });

        peer.on('connection', (newConn) => {
            if (mode === 'host') {
                if (connRef.current && connRef.current.open) {
                    newConn.on('open', () => {
                        newConn.send({ type: 'room-full' });
                        setTimeout(() => newConn.close(), 500);
                    });
                    return;
                }
                setupConnection(newConn);
            }
        });

        peer.on('error', (err: any) => {
            if (err.type === 'peer-unavailable') {
                setPeerError("This Room Code doesn't exist. Please check it and try again.");
            } else if (err.type === 'server-error' || err.type === 'network') {
                setPeerError("Connection to multiplayer server failed. Please try again.");
            } else {
                setPeerError("Multiplayer error: " + err.type);
            }
            // Give user time to see error before returning if it's a join error
            // Actually, peerError is now top-level, so we can return immediately
            setIsReady(false);
            setMode(null);
        });

        peer.on('disconnected', () => {
            if (isReady && !winner) {
                setPeerError("Lost connection to the signaling server.");
                resetToLobby();
            }
        });

        peer.on('close', () => {
            resetToLobby();
        });
    };

    initPeer();

    const handleUnload = () => {
        if (peerInstance) peerInstance.destroy();
    };
    window.addEventListener('beforeunload', handleUnload);

    return () => {
      if (peerInstance) peerInstance.destroy();
      window.removeEventListener('beforeunload', handleUnload);
    };
  }, [mode, joinCodeInput]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const setupSize = () => {
      const container = containerRef.current;
      if (container) {
        const padding = 20; 
        const verticalAdjustment = 80;
        const available = Math.min(container.clientWidth - padding, container.clientHeight - verticalAdjustment);
        const newCellSize = Math.max(15, Math.floor(available / (BOARD_SIZE + 1)));
        setGameSize({
          cellSize: newCellSize,
          radius: Math.floor(newCellSize * 0.4)
        });
      }
    };

    setupSize();
    const observer = new ResizeObserver(setupSize);
    if (containerRef.current) observer.observe(containerRef.current);
    window.addEventListener('resize', setupSize);
    return () => {
        observer.disconnect();
        window.removeEventListener('resize', setupSize);
    };
  }, [isReady, mode]);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'q' || e.key === 'Escape') {
        resetToLobby();
        onExit();
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [onExit]);

  const checkWin = (b: number[][], x: number, y: number, player: number) => {
    const dirs = [[[1,0],[-1,0]], [[0,1],[0,-1]], [[1,1],[-1,-1]], [[1,-1],[-1,1]]];
    for (let { [0]: dir1, [1]: dir2 } of dirs) {
      let count = 1;
      let cx = x + dir1[0], cy = y + dir1[1];
      while (cx >= 0 && cx < BOARD_SIZE && cy >= 0 && cy < BOARD_SIZE && b[cy][cx] === player) {
        count++; cx += dir1[0]; cy += dir1[1];
      }
      cx = x + dir2[0]; cy = y + dir2[1];
      while (cx >= 0 && cx < BOARD_SIZE && cy >= 0 && cy < BOARD_SIZE && b[cy][cx] === player) {
        count++; cx += dir2[0]; cy += dir2[1];
      }
      if (count >= 5) return true;
    }
    return false;
  };

  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (winner !== null || !isReady) return;
    if (mode !== 'local' && currentPlayer !== myPlayerNumber) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    const x = (e.clientX - rect.left) * scaleX;
    const y = (e.clientY - rect.top) * scaleY;

    const { cellSize } = gameSize;
    const col = Math.round((x - cellSize) / cellSize);
    const row = Math.round((y - cellSize) / cellSize);

    if (row >= 0 && row < BOARD_SIZE && col >= 0 && col < BOARD_SIZE && board[row][col] === 0) {
      const newBoard = board.map(r => [...r]);
      newBoard[row][col] = currentPlayer;
      setBoard(newBoard);
      
      let finalWinner = null;
      if (checkWin(newBoard, col, row, currentPlayer)) {
        finalWinner = currentPlayer;
        setWinner(currentPlayer);
      } else {
        setCurrentPlayer(currentPlayer === 1 ? 2 : 1);
      }

      if (conn) {
        conn.send({ 
            type: 'move', 
            board: newBoard, 
            nextPlayer: finalWinner ? currentPlayer : (currentPlayer === 1 ? 2 : 1),
            winner: finalWinner
        });
      }
    }
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const { cellSize, radius } = gameSize;
    canvas.width = (BOARD_SIZE + 1) * cellSize;
    canvas.height = (BOARD_SIZE + 1) * cellSize;

    ctx.fillStyle = '#DDB87C';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.strokeStyle = '#000';
    ctx.lineWidth = 1;

    for (let i = 0; i < BOARD_SIZE; i++) {
      ctx.beginPath();
      ctx.moveTo(cellSize, cellSize + i * cellSize);
      ctx.lineTo(cellSize + (BOARD_SIZE - 1) * cellSize, cellSize + i * cellSize);
      ctx.moveTo(cellSize + i * cellSize, cellSize);
      ctx.lineTo(cellSize + i * cellSize, cellSize + (BOARD_SIZE - 1) * cellSize);
      ctx.stroke();
    }

    const drawDot = (x: number, y: number) => {
        ctx.beginPath();
        ctx.arc(cellSize + x * cellSize, cellSize + y * cellSize, 3, 0, 2 * Math.PI);
        ctx.fillStyle = '#000';
        ctx.fill();
    };
    [3, 7, 11].forEach(x => [3, 7, 11].forEach(y => { if ((x === 7 && y === 7) || (x !== 7 && y !== 7)) drawDot(x, y); }));

    for (let row = 0; row < BOARD_SIZE; row++) {
      for (let col = 0; col < BOARD_SIZE; col++) {
        if (board[row][col] !== 0) {
          ctx.beginPath();
          ctx.arc(cellSize + col * cellSize, cellSize + row * cellSize, radius, 0, 2 * Math.PI);
          const gradient = ctx.createRadialGradient(cellSize + col * cellSize - 3, cellSize + row * cellSize - 3, 1, cellSize + col * cellSize, cellSize + row * cellSize, radius);
          if (board[row][col] === 1) { gradient.addColorStop(0, '#666'); gradient.addColorStop(1, '#000'); }
          else { gradient.addColorStop(0, '#fff'); gradient.addColorStop(1, '#ccc'); }
          ctx.fillStyle = gradient;
          ctx.fill();
          ctx.strokeStyle = 'rgba(0,0,0,0.5)';
          ctx.lineWidth = 1;
          ctx.stroke();
        }
      }
    }
  }, [board, gameSize, isReady]);

  return (
    <div ref={containerRef} className="absolute inset-0 z-50 bg-black flex flex-col items-center justify-center font-mono text-green-500 overflow-hidden">
      {/* GLOBAL ERROR PROMPT - Always rendered if error exists */}
      {peerError && (
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[100] bg-red-950/95 border-2 border-red-500 p-8 rounded-xl shadow-[0_0_50px_rgba(255,0,0,0.3)] text-white text-center min-w-[300px] animate-in fade-in zoom-in duration-300">
              <div className="text-4xl mb-4">⚠️</div>
              <p className="font-bold text-xl mb-6 tracking-wide uppercase">{peerError}</p>
              <button 
                onClick={() => { resetToLobby(); }} 
                className="w-full bg-red-600 hover:bg-red-500 text-white font-black py-3 px-6 rounded uppercase tracking-widest transition-colors shadow-lg"
              >
                  BACK TO LOBBY
              </button>
          </div>
      )}

      {!mode ? (
          /* LOBBY UI */
          <div className="flex flex-col items-center justify-center w-full h-full p-4 animate-in fade-in slide-in-from-bottom-5 duration-500">
              <h2 className="text-4xl font-bold text-green-500 mb-12 tracking-widest text-center">GOMOKU</h2>
              <div className="grid gap-4 w-full max-w-[280px] mb-4">
                  <button 
                    onClick={() => { setMode('local'); setMyPlayerNumber(0); }}
                    className="border-2 border-green-500/30 p-4 hover:bg-green-500/10 text-green-400 font-bold transition-all text-xl"
                  >
                      LOCAL PLAY
                  </button>
                  <div className="h-px bg-green-900/50 my-2" />
                  <button 
                    onClick={() => { setMode('host'); setMyPlayerNumber(1); }}
                    className="border-2 border-green-500/60 p-4 hover:bg-green-500/20 text-green-500 font-bold transition-all text-xl"
                  >
                      HOST MULTIPLAYER
                  </button>
                  <div className="flex flex-col gap-2">
                       <input 
                            type="text"
                            placeholder="ENTER ROOM CODE..."
                            value={joinCodeInput}
                            onChange={(e) => setJoinCodeInput(e.target.value)}
                            className="bg-black border-2 border-green-900 focus:border-green-500 p-4 outline-none text-green-400 placeholder-green-950 font-bold text-center"
                       />
                       <button 
                         onClick={() => { if (joinCodeInput) { setMode('client'); setMyPlayerNumber(2); } }}
                         className="border-2 border-green-500 p-4 bg-green-500/10 hover:bg-green-500/20 text-green-500 font-bold transition-all disabled:opacity-30"
                         disabled={!joinCodeInput}
                       >
                           JOIN MATCH
                       </button>
                  </div>
              </div>
              <button 
                onClick={onExit} 
                className="mt-4 text-red-900 hover:text-red-500 transition-colors uppercase text-sm tracking-widest border border-red-900/30 px-6 py-2 hover:border-red-500/50"
              >
                  Close Game
              </button>
          </div>
      ) : (
          /* PLAY UI */
          <div className="flex flex-col items-center justify-center w-full h-full relative">
              {mode !== 'local' && !isReady && (
                  <div className="absolute inset-0 z-[60] bg-black flex flex-col items-center justify-center space-y-8 shadow-[0_0_50px_rgba(0,255,0,0.1)]">
                      <h2 className="text-3xl font-bold animate-pulse text-green-400">
                          {mode === 'host' ? "HOSTING MATCH" : "JOINING MATCH..."}
                      </h2>
                      {mode === 'host' && peerId ? (
                          <div className="space-y-6 w-full max-w-[340px]">
                              <p className="text-gray-400 uppercase text-[10px] tracking-[0.3em] font-bold">Your Room Code</p>
                              <div className="bg-black p-6 rounded-lg border-2 border-green-500/30 flex flex-col items-center gap-6 relative shadow-[0_0_30px_rgba(0,0,0,0.8)]">
                                  <span className="text-[11px] font-bold text-white tracking-widest block w-full text-center truncate">{peerId}</span>
                                  <button 
                                    onClick={() => {
                                        navigator.clipboard.writeText(peerId!);
                                        setCopied(true);
                                        setTimeout(() => setCopied(false), 2000);
                                    }}
                                    className="text-xs text-green-600 hover:text-green-400 border border-green-900 px-3 py-1 uppercase min-w-[140px]"
                                  >
                                      {copied ? '✓ COPIED!' : 'Copy to Clipboard'}
                                  </button>
                              </div>
                              <p className="text-xs text-green-900 animate-pulse">Awaiting connection from Player 2...</p>
                          </div>
                      ) : (
                          <div className="flex flex-col items-center gap-4">
                              <div className="w-12 h-12 border-4 border-green-500/30 border-t-green-500 rounded-full animate-spin" />
                              <p className="text-gray-500 uppercase tracking-tighter">Polishing the stones...</p>
                          </div>
                      )}
                      <button onClick={() => resetToLobby()} className="text-red-900 text-xs hover:text-red-500 uppercase">Cancel</button>
                  </div>
              )}

              {winner !== null && (
                <div className="absolute z-[60] bg-black/90 rounded-xl p-10 text-center space-y-8 animate-in fade-in zoom-in border border-green-500 shadow-[0_0_40px_rgba(0,255,0,0.2)]">
                  <h2 className="text-5xl font-black text-white italic">
                    {winner === 1 ? "BLACK" : "WHITE"} WINS
                  </h2>
                  <div className="flex gap-4 justify-center">
                    <button onClick={onExit} className="border border-green-900 px-8 py-3 hover:bg-green-500/10 font-bold uppercase tracking-widest">Exit</button>
                    <button 
                      onClick={() => { setBoard(Array(BOARD_SIZE).fill(null).map(() => Array(BOARD_SIZE).fill(0))); setWinner(null); setCurrentPlayer(1); if (conn) conn.send({ type: 'reset' }); }} 
                      className="bg-green-500 text-black px-8 py-3 hover:bg-green-400 font-bold uppercase tracking-widest"
                    >
                      Rematch
                    </button>
                  </div>
                </div>
              )}
              
              <div className="absolute top-4 left-4 text-sm font-bold opacity-80 flex flex-col gap-1 border-l-2 border-green-900 pl-3">
                  <div className="uppercase tracking-widest">
                    {currentPlayer === 1 ? 'BLACK' : 'WHITE'}'S TURN
                  </div>
                  {mode !== 'local' && (
                      <div className="text-[10px] text-green-700 font-normal">
                          CONNECTED AS: <span className="text-green-400">{myPlayerNumber === 1 ? 'BLACK (HOST)' : 'WHITE (GUEST)'}</span>
                      </div>
                  )}
              </div>
              
              {mode === 'host' && isReady && <div className="absolute top-4 right-4 text-[10px] text-green-900">ROOM: {peerId}</div>}
              
              <div className="relative group">
                  {mode !== 'local' && isReady && currentPlayer !== myPlayerNumber && !winner && (
                      <div className="absolute inset-0 z-10 flex items-center justify-center pointer-events-none bg-black/10 transition-all">
                          <div className="bg-black/60 backdrop-blur-md px-8 py-4 rounded-full border border-green-500/30 animate-pulse shadow-[0_0_30px_rgba(0,0,0,0.5)]">
                              <span className="text-lg font-bold tracking-widest text-green-400 uppercase">Wait for the other player...</span>
                          </div>
                      </div>
                  )}
                  
                  <canvas 
                    ref={canvasRef} 
                    onClick={handleCanvasClick}
                    className={`shadow-[0_0_40px_rgba(221,184,124,0.1)] bg-[#DDB87C] rounded-sm max-h-[85vh] max-w-[95vw] object-contain transition-all
                        ${currentPlayer !== myPlayerNumber && mode !== 'local' ? 'opacity-60 cursor-not-allowed grayscale-[20%]' : 'cursor-pointer'}
                    `} 
                  />
              </div>
          </div>
      )}
    </div>
  );
}
