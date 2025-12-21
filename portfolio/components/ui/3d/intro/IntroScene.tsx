"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { Environment } from "@react-three/drei";
import { Suspense, useRef, useMemo, RefObject } from "react";
import * as THREE from "three";

function ParticleSystem() {
  const pointsRef = useRef<THREE.Points>(null);
  const particleCount = 200; 

  // Initial positions
  const initialPositions = useMemo(() => {
    const arr = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount; i++) {
      arr[i * 3] = (Math.random() - 0.5) * 15; 
      arr[i * 3 + 1] = (Math.random() - 0.5) * 15; 
      arr[i * 3 + 2] = (Math.random() - 0.5) * 5;  
    }
    return arr;
  }, []);

  const positions = useMemo(() => new Float32Array(initialPositions), [initialPositions]);

  useFrame((state) => {
    if (!pointsRef.current) return;

    // Cursor position in world space
    const x = (state.pointer.x * state.viewport.width) / 2;
    const y = (state.pointer.y * state.viewport.height) / 2;
    
    for (let i = 0; i < particleCount; i++) {
      const i3 = i * 3;
      
      const ox = initialPositions[i3];
      const oy = initialPositions[i3 + 1];
      const oz = initialPositions[i3 + 2];

      // Vector from CURSOR to PARTICLE (home)
      const relX = ox - x;
      const relY = oy - y;
      const dist = Math.sqrt(relX * relX + relY * relY);
      
      // Magnetic configuration
      const forceDistance = 4.5;
      
      if (dist < forceDistance) {
        // Simple normalized influence (0 to 1)
        const t = (1 - dist / forceDistance);
        
        // Attraction: Linearly interpolate particle position from Home -> Cursor based on influence
        // t * 0.8 means max 80% pull towards cursor at center
        const targetX = THREE.MathUtils.lerp(ox, x, t * 0.8);
        const targetY = THREE.MathUtils.lerp(oy, y, t * 0.8);
        const targetZ = THREE.MathUtils.lerp(oz, 0, t * 0.8); // Pull Z to 0 for alignment

        // Smoothly transition current position to target
        positions[i3] = THREE.MathUtils.lerp(positions[i3], targetX, 0.15);
        positions[i3 + 1] = THREE.MathUtils.lerp(positions[i3 + 1], targetY, 0.15);
        positions[i3 + 2] = THREE.MathUtils.lerp(positions[i3 + 2], targetZ, 0.15);
      } else {
        // Return to home
        positions[i3] = THREE.MathUtils.lerp(positions[i3], ox, 0.1);
        positions[i3 + 1] = THREE.MathUtils.lerp(positions[i3 + 1], oy, 0.1);
        positions[i3 + 2] = THREE.MathUtils.lerp(positions[i3 + 2], oz, 0.1);
      }
    }

    // Update geometry
    pointsRef.current.geometry.attributes.position.needsUpdate = true;
    
    // Global rotation
    pointsRef.current.rotation.y += 0.001;
    pointsRef.current.rotation.x += 0.001;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={particleCount}
          array={positions}
          itemSize={3}
          args={[positions, 3]} 
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.08}
        color="#3b82f6"
        sizeAttenuation={true}
        transparent
        opacity={0.8}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

export default function IntroScene({ eventSource }: { eventSource?: RefObject<HTMLElement> }) {
  return (
    <div className="absolute inset-0 z-0 overflow-hidden">
      <Canvas 
        resize={{ scroll: false }} 
        camera={{ position: [0, 0, 5], fov: 75 }}
        eventSource={eventSource?.current ?? undefined}
        style={{ pointerEvents: 'none' }} // Canvas itself doesn't need to block, events come from source
      >
        <Suspense fallback={null}>
            <Environment preset="city" />
            <ParticleSystem />
        </Suspense>
      </Canvas>
    </div>
  );
}
