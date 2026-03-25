"use client";

import { useEffect, useRef, useState } from "react";

interface AsteroidsProps {
  onExit: () => void;
}

type WeaponType = 'normal' | 'split' | 'laser' | 'rapid';

export function AsteroidsGame({ onExit }: AsteroidsProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const requestRef = useRef<number>(0);

  const keys = useRef<{ [key: string]: boolean }>({});
  
  const ship = useRef({
    x: 400,
    y: 500, // Will be updated dynamically
    width: 30,
    height: 40,
    speed: 400,
    health: 100,
    cooldown: 0,
    weapon: 'normal' as WeaponType,
    weaponTimer: 0, // Seconds remaining for powerup
    autoFire: false
  });

  const bullets = useRef<Array<{x: number, y: number, vx: number, vy: number, width: number, height: number, type: WeaponType, damage: number}>>([]);
  const enemyBullets = useRef<Array<{x: number, y: number, vy: number, radius: number, damage: number}>>([]);
  const aliens = useRef<Array<{x: number, y: number, vx: number, width: number, height: number, hp: number, maxHp: number, cooldown: number}>>([]);
  const asteroids = useRef<Array<{x: number, y: number, vx: number, vy: number, radius: number, hp: number, maxHp: number, edges: number, angles: number[]}>>([]);
  const powerups = useRef<Array<{x: number, y: number, vy: number, radius: number, type: WeaponType, color: string}>>([]);
  const particles = useRef<Array<{x: number, y: number, vx: number, vy: number, life: number, color: string}>>([]);

  const spawnTimer = useRef(0);
  const alienSpawnTimer = useRef(5); // First alien spawns around 5 seconds
  const difficulty = useRef(1); // Increases over time
  const isDragging = useRef(false);

  const createAsteroid = (x: number, y: number, sizeMultiplier: number) => {
    const edges = Math.floor(Math.random() * 5) + 7;
    const angles = Array.from({length: edges}, () => Math.random() * 0.4 + 0.8);
    const radius = 20 + Math.random() * 30 * sizeMultiplier;
    const speedY = 50 + Math.random() * 100 * difficulty.current;
    const speedX = (Math.random() - 0.5) * 50;
    
    return {
      x, y,
      vx: speedX,
      vy: speedY,
      radius,
      hp: radius, // larger = more HP
      maxHp: radius,
      edges,
      angles
    };
  };

  const createExplosion = (x: number, y: number, color: string, count: number) => {
    for (let i = 0; i < count; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = Math.random() * 100 + 50;
        particles.current.push({
            x, y,
            vx: Math.cos(angle) * speed,
            vy: Math.sin(angle) * speed,
            life: Math.random() * 0.5 + 0.2, // 0.2 to 0.7s
            color
        });
    }
  };

  useEffect(() => {
    if (gameOver) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const setSize = () => {
      if (canvas.parentElement) {
        canvas.width = Math.min(600, canvas.parentElement.clientWidth);
        canvas.height = canvas.parentElement.clientHeight - 80;
        ship.current.y = canvas.height - 50;
        // Keep ship in bounds if width shrinks
        if (ship.current.x > canvas.width - ship.current.width/2) {
          ship.current.x = canvas.width - ship.current.width/2;
        }
      }
    };
    setSize();
    
    const observer = new ResizeObserver(setSize);
    if (canvas.parentElement) observer.observe(canvas.parentElement);
    
    const handleKeyDown = (e: KeyboardEvent) => {
      if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", " "].includes(e.key)) e.preventDefault();
      
      if (e.key === " " && !keys.current[" "]) {
          ship.current.autoFire = !ship.current.autoFire;
      }

      keys.current[e.key] = true;
      if (e.key === 'q' || e.key === 'Escape') onExit();
    };
    const handleKeyUp = (e: KeyboardEvent) => {
      keys.current[e.key] = false;
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    const handlePointerMove = (e: PointerEvent) => {
      if (!canvas || gameOver || !isDragging.current) return;
      
      const rect = canvas.getBoundingClientRect();
      const scaleX = canvas.width / rect.width;
      const x = (e.clientX - rect.left) * scaleX;
      
      // Update ship X
      ship.current.x = x;
      ship.current.autoFire = true;
    };

    const handlePointerDown = (e: PointerEvent) => {
      if (!canvas || gameOver) return;
      const rect = canvas.getBoundingClientRect();
      const scaleX = canvas.width / rect.width;
      const scaleY = canvas.height / rect.height;
      const x = (e.clientX - rect.left) * scaleX;
      const y = (e.clientY - rect.top) * scaleY;
      
      // Check if click was near the ship (approx radius 50px for ease of touch)
      const dx = x - ship.current.x;
      const dy = y - ship.current.y;
      if (Math.abs(dx) < 50 && Math.abs(dy) < 50) {
          isDragging.current = true;
          ship.current.autoFire = true;
      }
    };

    const handlePointerUp = () => {
        isDragging.current = false;
        // Keep auto-fire state or reset? Resetting is safer for 'drag only' intent or keeping manual fire
        // Let's not reset autoFire here as most use standard auto sync. Let it be.
    };

    canvas.addEventListener("pointermove", handlePointerMove);
    canvas.addEventListener("pointerdown", handlePointerDown);
    window.addEventListener("pointerup", handlePointerUp);

    let lastTime = performance.now();

    const update = (time: number) => {
      const dt = (time - lastTime) / 1000;
      lastTime = time;

      const s = ship.current;

      // Update Difficulty
      difficulty.current += dt * 0.01; // Gets harder over time

      // Move Ship (Left/Right only)
      if (keys.current["ArrowLeft"]) s.x -= s.speed * dt;
      if (keys.current["ArrowRight"]) s.x += s.speed * dt;
      
      // Clamp Ship
      if (s.x < s.width/2) s.x = s.width/2;
      if (s.x > canvas.width - s.width/2) s.x = canvas.width - s.width/2;

      // Weapon Timer
      if (s.weaponTimer > 0) {
          s.weaponTimer -= dt;
          if (s.weaponTimer <= 0) s.weapon = 'normal';
      }

      // Shoot
      if (s.cooldown > 0) s.cooldown -= dt;
      if ((s.autoFire || keys.current[" "]) && s.cooldown <= 0) {
         let fireRate = 0.25;
         
         if (s.weapon === 'normal') {
             bullets.current.push({ x: s.x, y: s.y - s.height/2, vx: 0, vy: -600, width: 4, height: 15, type: 'normal', damage: 20 });
         } else if (s.weapon === 'rapid') {
             fireRate = 0.08;
             bullets.current.push({ x: s.x, y: s.y - s.height/2, vx: 0, vy: -700, width: 4, height: 15, type: 'rapid', damage: 15 });
         } else if (s.weapon === 'split') {
             fireRate = 0.25;
             bullets.current.push(
               { x: s.x, y: s.y - s.height/2, vx: 0, vy: -600, width: 4, height: 15, type: 'split', damage: 15 },
               { x: s.x - 10, y: s.y - s.height/2, vx: -150, vy: -550, width: 4, height: 15, type: 'split', damage: 15 },
               { x: s.x + 10, y: s.y - s.height/2, vx: 150, vy: -550, width: 4, height: 15, type: 'split', damage: 15 }
             );
         } else if (s.weapon === 'laser') {
             fireRate = 0.4;
             // Piercing tall laser
             bullets.current.push({ x: s.x, y: s.y - s.height/2, vx: 0, vy: -1000, width: 10, height: 60, type: 'laser', damage: 50 });
         }
         s.cooldown = fireRate;
      }

      // Spawn Asteroids
      spawnTimer.current -= dt;
      if (spawnTimer.current <= 0) {
          const spawnCount = Math.floor(Math.random() * difficulty.current) + 1;
          for(let i=0; i<spawnCount; i++) {
              asteroids.current.push(createAsteroid(
                  Math.random() * canvas.width,
                  -50,
                  Math.min(2, difficulty.current * 0.5)
              ));
          }
          spawnTimer.current = Math.max(0.5, 2 - difficulty.current * 0.2); // Faster spawn over time
      }

      // Spawn Aliens
      alienSpawnTimer.current -= dt;
      if (alienSpawnTimer.current <= 0) {
          const fromLeft = Math.random() > 0.5;
          const y = 30 + Math.random() * 80; // Always at the top
          aliens.current.push({
              x: fromLeft ? -50 : canvas.width + 50,
              y,
              vx: (fromLeft ? 1 : -1) * (100 + Math.random() * 50 * difficulty.current),
              width: 40,
              height: 20,
              hp: 50 * Math.max(1, difficulty.current * 0.8),
              maxHp: 50 * Math.max(1, difficulty.current * 0.8),
              cooldown: 0.5 + Math.random() // shoot relatively fast
          });
          alienSpawnTimer.current = Math.max(3, 10 - difficulty.current * 1.5); // Spawn more frequently
      }

      // Update Bullets
      bullets.current = bullets.current.filter(b => {
        b.x += b.vx * dt;
        b.y += b.vy * dt;
        return b.y > -100 && b.x > -50 && b.x < canvas.width + 50; // Off-screen removal
      });

      // Update Enemy Bullets
      enemyBullets.current = enemyBullets.current.filter(b => {
        b.x += 0; // Straight down
        b.y += b.vy * dt;
        
        // Player Collision
        if (Math.abs(b.x - s.x) < b.radius + s.width/2 && Math.abs(b.y - s.y) < b.radius + s.height/2) {
           s.health -= b.damage;
           createExplosion(s.x, s.y, '#f00', 10);
           if (s.health <= 0) setGameOver(true);
           return false; // remove
        }
        return b.y < canvas.height + 50;
      });

      // Update Powerups
      powerups.current = powerups.current.filter(p => {
          p.y += p.vy * dt;
          
          // Check pickup
          if (Math.abs(p.x - s.x) < p.radius + s.width/2 && Math.abs(p.y - s.y) < p.radius + s.height/2) {
              if (p.color === '#0f0') {
                  s.health = Math.min(100, s.health + 30);
                  createExplosion(s.x, s.y, '#0f0', 10);
              } else {
                  s.weapon = p.type;
                  s.weaponTimer = 10; // 10 seconds of powerup
                  createExplosion(s.x, s.y, p.color, 15);
              }
              setScore(sc => sc + 50);
              return false; // remove
          }
          return p.y < canvas.height + 50;
      });

      // Update Particles
      particles.current = particles.current.filter(p => {
          p.x += p.vx * dt;
          p.y += p.vy * dt;
          p.life -= dt;
          return p.life > 0;
      });

      // Update Aliens & Collisions
      const newAliens: typeof aliens.current = [];
      aliens.current.forEach(al => {
         al.x += al.vx * dt;
         al.cooldown -= dt;
         
         // Shoot
         if (al.cooldown <= 0 && al.x > 0 && al.x < canvas.width) {
             enemyBullets.current.push({ x: al.x, y: al.y + al.height/2, vy: 300 + difficulty.current * 20, radius: 4, damage: 15 });
             al.cooldown = 1.0 + Math.random() * 0.5;
         }

         // Check bullet collision
         let hit = false;
         for (let i = bullets.current.length - 1; i >= 0; i--) {
            const b = bullets.current[i];
            if (Math.abs(b.x - al.x) < al.width/2 + b.width/2 && Math.abs(b.y - al.y) < al.height/2 + b.height/2) {
               al.hp -= b.damage;
               createExplosion(b.x, b.y - b.height/2, '#fa0', 3);
               if (b.type !== 'laser') bullets.current.splice(i, 1);
            }
         }

         if (al.hp <= 0) {
            setScore(sc => sc + 300); // 300 points for alien!
            createExplosion(al.x, al.y, '#0ff', 15);
            // Higher powerup drop rate
            if (Math.random() < 0.3) {
                const rand = Math.random();
                let type: WeaponType = 'split';
                let color = '#0ff';
                if (rand < 0.25) { type = 'normal'; color = '#0f0'; }
                else if (rand < 0.5) { type = 'laser'; color = '#f0f'; }
                else if (rand < 0.75) { type = 'rapid'; color = '#ff0'; }
                
                powerups.current.push({ x: al.x, y: al.y, vy: 100, radius: 10, type, color });
            }
            newAliens.push(al);
         }
      });
      aliens.current = newAliens;


      // Update Asteroids & Collisions
      const newAsteroids: typeof asteroids.current = [];
      asteroids.current.forEach(a => {
         a.x += a.vx * dt;
         a.y += a.vy * dt;
         
         // Screen bounds bounce for x
         if (a.x < a.radius) { a.x = a.radius; a.vx *= -1; }
         if (a.x > canvas.width - a.radius) { a.x = canvas.width - a.radius; a.vx *= -1; }
         
         // If past bottom, simply despawn (no penalty)
         if (a.y > canvas.height + a.radius) {
             return; // exclude from newAsteroids
         }

         // Check bullet collision
         for (let i = bullets.current.length - 1; i >= 0; i--) {
            const b = bullets.current[i];
            // Simple rect-circle collision approx
            if (Math.abs(b.x - a.x) < a.radius + b.width/2 && Math.abs(b.y - a.y) < a.radius + b.height/2) {
               a.hp -= b.damage;
               createExplosion(b.x, b.y - b.height/2, '#fa0', 3);
               if (b.type !== 'laser') {
                   bullets.current.splice(i, 1); // Delete bullet unless laser
               }
            }
         }

         if (a.hp <= 0) {
            setScore(sc => sc + Math.floor(a.maxHp));
            createExplosion(a.x, a.y, '#888', 8);
            
            // Item drop chance (10%)
            if (Math.random() < 0.1) {
                const rand = Math.random();
                let type: WeaponType = 'split';
                let color = '#0ff';
                if (rand < 0.25) { type = 'normal'; color = '#0f0'; }
                else if (rand < 0.5) { type = 'laser'; color = '#f0f'; }
                else if (rand < 0.75) { type = 'rapid'; color = '#ff0'; }
                
                powerups.current.push({
                    x: a.x, y: a.y, vy: 100, radius: 10, type, color
                });
            }
         } else {
            // Check ship collision
            if (Math.abs(s.x - a.x) < a.radius + s.width/2 && Math.abs(s.y - a.y) < a.radius + s.height/2) {
               s.health -= a.hp; // Take damage based on asteroid size
               createExplosion(s.x, s.y, '#f00', 20);
               if (s.health <= 0) setGameOver(true);
               // Destroy asteroid
               return; // exclude
            }
            newAsteroids.push(a);
         }
      });
      asteroids.current = newAsteroids;

      // Draw
      ctx.fillStyle = '#000';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Starfield background (simple parallax effect based on difficulty/time)
      ctx.fillStyle = '#fff';
      for(let i=0; i<20; i++) {
          const px = (Math.sin(i*123) * 10000) % canvas.width;
          const py = (time / 10 + i * 100) % canvas.height;
          ctx.globalAlpha = Math.abs(px) / canvas.width;
          ctx.fillRect(Math.abs(px), py, 1, 1);
      }
      ctx.globalAlpha = 1;

      // Draw Powerups
      powerups.current.forEach(p => {
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
          ctx.fillStyle = p.color;
          ctx.fill();
          ctx.strokeStyle = '#fff';
          ctx.lineWidth = 2;
          ctx.stroke();
          ctx.fillStyle = '#000';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.font = '10px monospace';
          // Label
          let label = 'S';
          if (p.color === '#0f0') label = '+';
          if (p.color === '#f0f') label = 'L';
          if (p.color === '#ff0') label = 'R';
          ctx.fillText(label, p.x, p.y);
      });

      // Draw Ship
      ctx.save();
      ctx.translate(s.x, s.y);
      
      // Thruster (Draw behind the ship)
      if (keys.current["ArrowUp"] || true) { 
          ctx.beginPath();
          ctx.moveTo(-s.width/4, s.height/3);
          ctx.lineTo(0, s.height/2 + Math.random() * 20 + 5);
          ctx.lineTo(s.width/4, s.height/3);
          ctx.fillStyle = '#fa0';
          ctx.fill();
      }

      // Ship Body
      ctx.fillStyle = '#111';
      ctx.strokeStyle = '#0f0';
      ctx.lineWidth = 2;
      
      ctx.beginPath();
      // Rocket shape
      ctx.moveTo(0, -s.height/2);
      ctx.lineTo(s.width/2, s.height/2);
      ctx.lineTo(0, Math.floor(s.height/4)); // Adjusted inner V to give fire more room
      ctx.lineTo(-s.width/2, s.height/2);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
      ctx.restore();

      // Draw Bullets
      bullets.current.forEach(b => {
         ctx.fillStyle = b.type === 'laser' ? '#f0f' : b.type === 'rapid' ? '#ff0' : '#0f0';
         ctx.fillRect(b.x - b.width/2, b.y - b.height/2, b.width, b.height);
      });

      // Draw Enemy Bullets
      enemyBullets.current.forEach(b => {
         ctx.fillStyle = '#f00';
         ctx.beginPath();
         ctx.arc(b.x, b.y, b.radius, 0, Math.PI * 2);
         ctx.fill();
      });

      // Draw Aliens
      aliens.current.forEach(al => {
         ctx.save();
         ctx.translate(al.x, al.y);
         
         // Dome
         ctx.beginPath();
         ctx.arc(0, -al.height/4, al.width/3, Math.PI, 0);
         ctx.fillStyle = '#0ff';
         ctx.globalAlpha = 0.5;
         ctx.fill();
         ctx.globalAlpha = 1;

         // Base (Saucer)
         ctx.beginPath();
         ctx.ellipse(0, 0, al.width/2, al.height/2, 0, 0, Math.PI * 2);
         ctx.fillStyle = '#444';
         ctx.fill();
         const hpPercent = al.hp / al.maxHp;
         ctx.strokeStyle = `rgb(${255 * (1-hpPercent)}, ${255 * hpPercent}, 255)`;
         ctx.lineWidth = 2;
         ctx.stroke();

         ctx.restore();
      });

      // Draw Asteroids
      asteroids.current.forEach(a => {
         ctx.save();
         ctx.translate(a.x, a.y);
         ctx.beginPath();
         for (let j = 0; j < a.edges; j++) {
            const ag = (j * Math.PI * 2) / a.edges;
            const rad = a.radius * a.angles[j];
            if (j === 0) ctx.moveTo(rad * Math.cos(ag), rad * Math.sin(ag));
            else ctx.lineTo(rad * Math.cos(ag), rad * Math.sin(ag));
         }
         ctx.closePath();
         ctx.fillStyle = '#222';
         ctx.fill();
         
         // Color changes as HP goes down
         const hpPercent = a.hp / a.maxHp;
         ctx.strokeStyle = `rgb(${255 * (1-hpPercent)}, ${255 * hpPercent}, 0)`;
         ctx.lineWidth = 2;
         ctx.stroke();
         ctx.restore();
      });

      // Draw Particles
      particles.current.forEach(p => {
          ctx.fillStyle = p.color;
          ctx.globalAlpha = p.life * 2;
          ctx.beginPath();
          ctx.arc(p.x, p.y, 2, 0, Math.PI * 2);
          ctx.fill();
      });
      ctx.globalAlpha = 1;

      // UI: Health Bar
      ctx.fillStyle = '#333';
      ctx.fillRect(10, 50, 200, 15);
      ctx.fillStyle = s.health > 50 ? '#0f0' : s.health > 25 ? '#fa0' : '#f00';
      ctx.fillRect(10, 50, Math.max(0, s.health) * 2, 15);
      ctx.fillStyle = '#fff';
      ctx.font = '12px Courier';
      ctx.textAlign = 'left';
      ctx.textBaseline = 'bottom';
      ctx.fillText(`HEALTH: ${Math.floor(Math.max(0, s.health))}%`, 10, 48);

      // UI: Weapon & AutoFire
      if (s.autoFire || s.weaponTimer > 0) {
          ctx.fillStyle = '#0ff';
          let texts = [];
          if (s.weaponTimer > 0) texts.push(`WEAPON: ${s.weapon.toUpperCase()} (${s.weaponTimer.toFixed(1)}s)`);
          if (s.autoFire) texts.push(`AUTO-FIRE: ON`);
          texts.forEach((txt, i) => ctx.fillText(txt, 10, 85 + i * 15));
      }

      requestRef.current = requestAnimationFrame(update);
    };

    requestRef.current = requestAnimationFrame(update);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
      if (canvas) {
        canvas.removeEventListener("pointermove", handlePointerMove);
        canvas.removeEventListener("pointerdown", handlePointerDown);
      }
      window.removeEventListener("pointerup", handlePointerUp);
      cancelAnimationFrame(requestRef.current);
      observer.disconnect();
    };
  }, [gameOver, onExit]);

  return (
    <div className="absolute inset-0 z-50 bg-black flex flex-col items-center justify-center font-mono text-green-500 overflow-hidden">
      {gameOver ? (
        <div className="text-center space-y-4 animate-in fade-in zoom-in absolute z-50 bg-black/80 p-8 rounded border border-red-500">
          <h2 className="text-4xl font-bold text-red-500">MISSION TERMINATED</h2>
          <p className="text-xl">Final Score: {score}</p>
          <div className="flex gap-4 justify-center mt-6">
            <button 
              onClick={onExit}
              className="border border-green-500 px-4 py-2 hover:bg-green-500/20"
            >
              Abort
            </button>
            <button 
              onClick={() => {
                setScore(0);
                asteroids.current = [];
                aliens.current = [];
                powerups.current = [];
                bullets.current = [];
                enemyBullets.current = [];
                particles.current = [];
                spawnTimer.current = 0;
                alienSpawnTimer.current = 5;
                difficulty.current = 1;
                ship.current = {
                  ...ship.current,
                  health: 100,
                  weapon: 'normal',
                  weaponTimer: 0,
                  autoFire: false
                };
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
          <div className="absolute top-4 left-4 text-xl font-bold opacity-80 z-10">SCORE: {score}</div>
          <div className="absolute top-4 right-4 text-xs opacity-50 text-right z-10">
            DRAG / KEYS: Move<br/>
            SPACE: Fire (Auto toggle)<br/>
            ESC/Q: Abort
          </div>
          <canvas ref={canvasRef} className="bg-black shadow-[0_0_20px_#00ff0033] border-x border-green-900 w-full max-w-[600px] mx-auto h-full block" />
        </>
      )}
    </div>
  );
}
