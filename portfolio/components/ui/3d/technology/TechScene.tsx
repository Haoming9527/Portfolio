"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { Environment, Float, PerspectiveCamera, Tetrahedron, Octahedron, Box } from "@react-three/drei";
import { Suspense, useRef } from "react";
import * as THREE from "three";

function CyberpunkArtifact() {
  const outerRef = useRef<THREE.Group>(null);
  const innerRef = useRef<THREE.Mesh>(null);

  useFrame((state, delta) => {
    if (outerRef.current) {
        outerRef.current.rotation.y += delta * 0.2;
        outerRef.current.rotation.z += delta * 0.1;
    }
    if (innerRef.current) {
        innerRef.current.rotation.x -= delta * 1.5;
        innerRef.current.rotation.y += delta * 0.5;
    }
  });

  return (
    <Float floatIntensity={1.5} rotationIntensity={1} speed={3}>
      <group ref={outerRef}>
        <Tetrahedron args={[1.2, 0]}>
          <meshStandardMaterial 
            color="#111" 
            roughness={0.2} 
            metalness={0.8}
          />
        </Tetrahedron>
        
        <Tetrahedron args={[1.25, 0]}>
           <meshStandardMaterial 
            color="#00f0ff"
            wireframe
            emissive="#00f0ff"
            emissiveIntensity={0.8}
            toneMapped={false}
          />
        </Tetrahedron>
      </group>

      <Octahedron ref={innerRef} args={[0.4, 0]}>
        <meshBasicMaterial 
            color="#ff0080" 
            wireframe 
            toneMapped={false}
        />
      </Octahedron>

      <Float speed={5} rotationIntensity={2} floatIntensity={4}>
         <Box args={[0.1, 0.1, 0.1]} position={[1.5, 0.5, 0]}>
             <meshBasicMaterial color="#00f0ff" toneMapped={false} />
         </Box>
      </Float>
       <Float speed={4} rotationIntensity={3} floatIntensity={3}>
         <Box args={[0.15, 0.15, 0.15]} position={[-1.2, -1, 0.5]}>
             <meshBasicMaterial color="#ff0080" toneMapped={false} />
         </Box>
      </Float>
      <Float speed={6} rotationIntensity={1} floatIntensity={5}>
         <Box args={[0.08, 0.08, 0.08]} position={[0, 1.5, -0.5]}>
             <meshBasicMaterial color="#00f0ff" toneMapped={false} />
         </Box>
      </Float>

    </Float>
  );
}

export default function TechScene() {
  return (
    <div className="absolute inset-0 z-0 overflow-hidden w-full h-full rounded-2xl bg-black/5 dark:bg-black/20">
      <Canvas eventSource={document.body} gl={{ antialias: true, alpha: true }}>
        <PerspectiveCamera makeDefault position={[0, 0, 5]} fov={50} />
        <Suspense fallback={null}>
          <Environment preset="city" />
          <ambientLight intensity={0.2} />
          
          <pointLight position={[5, 5, 5]} intensity={3} color="#00f0ff" distance={10} />
          <pointLight position={[-5, -5, -5]} intensity={3} color="#ff0080" distance={10} />
          
          <CyberpunkArtifact />
        </Suspense>
      </Canvas>
    </div>
  );
}
