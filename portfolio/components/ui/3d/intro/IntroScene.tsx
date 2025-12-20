"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { Environment } from "@react-three/drei";
import { Suspense, useRef, useMemo } from "react";
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

      const dx = x - ox;
      const dy = y - oy;
      const dist = Math.sqrt(dx * dx + dy * dy);
      
      // Magnetic configuration
      const forceDistance = 4; 
      const forceStrength = 1.5; 
      
      if (dist < forceDistance) {
        // Calculate force
        const t = (1 - dist / forceDistance);
        const force = t * forceStrength;
        
        const angle = Math.atan2(dy, dx);
        const moveX = Math.cos(angle) * force;
        const moveY = Math.sin(angle) * force;
        
        positions[i3] = ox + moveX;
        positions[i3 + 1] = oy + moveY;
        
        positions[i3 + 2] = THREE.MathUtils.lerp(positions[i3 + 2], oz + force, 0.1);
      } else {
        // Reset
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

export default function IntroScene() {
  return (
    <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
      <Canvas resize={{ scroll: false }} camera={{ position: [0, 0, 5], fov: 75 }} eventSource={document.body}>
        <Suspense fallback={null}>
            <Environment preset="city" />
            <ParticleSystem />
        </Suspense>
      </Canvas>
    </div>
  );
}
