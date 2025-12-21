"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { Environment, Float, PerspectiveCamera, Sphere, Text, RoundedBox, Torus } from "@react-three/drei";
import { Suspense, useRef, useMemo, useState, useEffect } from "react";
import { useTheme } from "next-themes";
import * as THREE from "three";

function ReactScene() {
  const groupRef = useRef<THREE.Group>(null);
  const electron1 = useRef<THREE.Mesh>(null);
  const electron2 = useRef<THREE.Mesh>(null);
  const electron3 = useRef<THREE.Mesh>(null);

  // Shared Geometry & Curve Logic (Optimization: Create once, reuse 3 times)
  const { curve, tubeGeo } = useMemo(() => {
    const radius = 3; 
    const c2d = new THREE.EllipseCurve(0, 0, radius, radius, 0, 2 * Math.PI, false, 0);
    const points = c2d.getPoints(100);
    const p3d = points.map(p => new THREE.Vector3(p.x, p.y, 0));
    const c3d = new THREE.CatmullRomCurve3(p3d, true);
    const geo = new THREE.TubeGeometry(c3d, 64, 0.08, 16, true);
    return { curve: c2d, tubeGeo: geo };
  }, []);
  
  useFrame((state, delta) => {
    // 1. Scene Tumble
    if (groupRef.current) {
        groupRef.current.rotation.y += delta * 0.2;
        groupRef.current.rotation.x += delta * 0.1;
    }

    // 2. Electron Orbits
    const time = state.clock.elapsedTime * 0.4;
    
    const updateElectron = (ref: React.RefObject<THREE.Mesh | null>, offset: number) => {
        if (ref.current) {
             const t = (time + offset) % 1;
             const pt = curve.getPoint(t);
             ref.current.position.set(pt.x, pt.y, 0);
        }
    };

    updateElectron(electron1, 0);
    updateElectron(electron2, 0.33);
    updateElectron(electron3, 0.66);
  });

  const reactBlue = "#61dafb";
  const tiltAngle = 1.15; 
  
  // Reusable Materials
  const ringMaterial = useMemo(() => (
      <meshStandardMaterial 
        color={reactBlue} 
        emissive={reactBlue} 
        emissiveIntensity={0.5} 
        roughness={0.1} 
        metalness={0.8} 
      />
  ), []);

  const electronMaterial = useMemo(() => (
      <meshBasicMaterial color={reactBlue} toneMapped={false} />
  ), []);

  return (
    <Float floatIntensity={2} rotationIntensity={2} speed={2}>
      <group ref={groupRef} scale={[0.4, 0.4, 0.4]}>
        
        {/* Nucleus */}
        <Sphere args={[0.6, 32, 32]}>
             <meshStandardMaterial 
                color={reactBlue} 
                emissive={reactBlue}
                emissiveIntensity={1}
                roughness={0.1}
             />
        </Sphere>
        
        {/* Ring 1 Group */}
        <group rotation={[0, 0, 0]}>
             <group rotation={[tiltAngle, 0, 0]}>
                <mesh geometry={tubeGeo}>{ringMaterial}</mesh>
                <mesh ref={electron1}>
                    <sphereGeometry args={[0.2, 16, 16]} />
                    {electronMaterial}
                </mesh>
             </group>
        </group>
        
        {/* Ring 2 Group */}
        <group rotation={[0, 0, Math.PI / 3]}>
             <group rotation={[tiltAngle, 0, 0]}>
                <mesh geometry={tubeGeo}>{ringMaterial}</mesh>
                <mesh ref={electron2}>
                    <sphereGeometry args={[0.2, 16, 16]} />
                    {electronMaterial}
                </mesh>
             </group>
        </group>

        {/* Ring 3 Group */}
        <group rotation={[0, 0, -Math.PI / 3]}>
             <group rotation={[tiltAngle, 0, 0]}>
                <mesh geometry={tubeGeo}>{ringMaterial}</mesh>
                <mesh ref={electron3}>
                    <sphereGeometry args={[0.2, 16, 16]} />
                    {electronMaterial}
                </mesh>
             </group>
        </group>

      </group>
    </Float>
  );
}

function JavascriptScene({ isDark }: { isDark: boolean }) {
  const groupRef = useRef<THREE.Group>(null);
  
  useFrame((state, delta) => {
    if (groupRef.current) {
        groupRef.current.rotation.y -= delta * 0.2;
        groupRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.5) * 0.1;
    }
  });

  const jsYellow = "#f7df1e";
  const symbolColor = isDark ? "#ffffff" : "#000000";
  
  return (
    <Float floatIntensity={2} rotationIntensity={1} speed={2}>
      <group ref={groupRef} scale={[0.5, 0.5, 0.5]}>
        
        {/* JS Cube Base */}
        <RoundedBox args={[2, 2, 2]} radius={0.1} smoothness={4}>
            <meshStandardMaterial 
                color={jsYellow} 
                roughness={0.2}
                metalness={0.1}
            />
        </RoundedBox>
        
        {/* JS Text - Front (Bottom Right) */}
        <Text
            position={[0.4, -0.4, 1.01]} 
            fontSize={1}
            color="#000000"
            anchorX="center"
            anchorY="middle"
            fontWeight="bold"
            letterSpacing={-0.05}
        >
            JS
        </Text>
        
         {/* JS Text - Back (Inverted) */}
        <Text
            position={[-0.4, -0.4, -1.01]} 
            rotation={[0, Math.PI, 0]}
            fontSize={1}
            color="#000000"
            anchorX="center"
            anchorY="middle"
            fontWeight="bold"
            letterSpacing={-0.05}
        >
            JS
        </Text>

        {/* Floating Syntax Symbols */}
        <Float speed={4} rotationIntensity={2} floatIntensity={4}>
             <Text position={[1.8, 1.5, 0]} fontSize={0.5} color={symbolColor}>{"{"}</Text>
             <Text position={[-1.8, -1.5, 0.5]} fontSize={0.5} color={symbolColor}>{"}"}</Text>
             <Text position={[1.5, -1, 1]} fontSize={0.4} color={symbolColor}>{";"}</Text>
             <Text position={[-1.5, 1, -1]} fontSize={0.4} color={symbolColor}>{"const"}</Text>
             <Text position={[0, 1.8, -1.5]} fontSize={0.35} color={symbolColor}>{"console.log()"}</Text>
        </Float>

      </group>
    </Float>
  );
}

function ChromeScene({ isDark }: { isDark: boolean }) {
  const groupRef = useRef<THREE.Group>(null);
  
  useFrame((state, delta) => {
    if (groupRef.current) {
        groupRef.current.rotation.y += delta * 0.2;
        groupRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.5) * 0.1;
        groupRef.current.rotation.z = Math.sin(state.clock.elapsedTime * 0.3) * 0.05;
    }
  });

  const blue = "#4285F4";
  const red = "#EA4335";
  const green = "#34A853";
  const yellow = "#FBBC05";
  const white = "#FFFFFF";
  const symbolColor = isDark ? "#ffffff" : "#000000";

  const createSector = (innerR: number, outerR: number, startAngle: number, endAngle: number) => {
    const shape = new THREE.Shape();
    shape.absarc(0, 0, outerR, startAngle, endAngle, false); 
    shape.absarc(0, 0, innerR, endAngle, startAngle, true); 
    shape.closePath();
    return shape;
  };

  // FIX: bevelSize = 0 ensures no lateral overlap between sectors
  const extrudeSettings = { depth: 0.4, bevelEnabled: true, bevelSegments: 8, bevelSize: 0, bevelThickness: 0.05 };
  
  const gap = 0; 

  const redShape = useMemo(() => createSector(1.1, 2.2, Math.PI / 6 + gap, 5 * Math.PI / 6 - gap), []);
  const greenShape = useMemo(() => createSector(1.1, 2.2, 5 * Math.PI / 6 + gap, 3 * Math.PI / 2 - gap), []); 
  const yellowShape = useMemo(() => createSector(1.1, 2.2, -Math.PI / 2 + gap, Math.PI / 6 - gap), []); 

  const centerShape = useMemo(() => {
      const s = new THREE.Shape();
      s.absarc(0, 0, 0.9, 0, Math.PI * 2, false);
      return s;
  }, []);
  
  const ringShape = useMemo(() => {
     const s = new THREE.Shape();
     s.absarc(0, 0, 1.1, 0, Math.PI * 2, false);
     s.absarc(0, 0, 0.9, 0, Math.PI * 2, true);
     return s;
  }, []);

  return (
    <Float floatIntensity={2} rotationIntensity={1} speed={2}>
      <group ref={groupRef} scale={[0.5, 0.5, 0.5]}>
        
        {/* Core Blue */}
        <mesh position={[0, 0, -0.2]}>
            <extrudeGeometry args={[centerShape, extrudeSettings]} />
            <meshStandardMaterial color={blue} roughness={0.3} metalness={0.1} />
        </mesh>
        
        {/* White Ring */}
        <mesh position={[0, 0, -0.2]}>
             <extrudeGeometry args={[ringShape, extrudeSettings]} />
             <meshStandardMaterial color={white} roughness={0.1} />
        </mesh>

        {/* Outer Sectors - Vertically Stacked to handle shading/layering */}
        <group>
            {/* Red (Top) - Offset Z slightly higher */}
            <mesh position={[0, 0, -0.19]}>
                 <extrudeGeometry args={[redShape, extrudeSettings]} />
                 <meshStandardMaterial color={red} roughness={0.2} metalness={0.1} />
            </mesh>
            {/* Green (Middle) */}
            <mesh position={[0, 0, -0.195]}> 
                 <extrudeGeometry args={[greenShape, extrudeSettings]} />
                 <meshStandardMaterial color={green} roughness={0.2} metalness={0.1} />
            </mesh>
            {/* Yellow (Bottom) */}
             <mesh position={[0, 0, -0.20]}>
                 <extrudeGeometry args={[yellowShape, extrudeSettings]} />
                 <meshStandardMaterial color={yellow} roughness={0.2} metalness={0.1} />
            </mesh>
        </group>

        {/* Floating Web Symbols */}
        <Float speed={4} rotationIntensity={2} floatIntensity={4}>
             <Text position={[2.5, 1.5, 0.5]} fontSize={0.6} color={symbolColor}>{".com"}</Text>
             <Text position={[-2.5, -1.5, 1]} fontSize={0.6} color={symbolColor}>{"www"}</Text>
             <Text position={[1.5, -2, 0]} fontSize={0.5} color={symbolColor}>{"http"}</Text>
        </Float>

      </group>
    </Float>
  );
}

function JavaScene({ isDark }: { isDark: boolean }) {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state, delta) => {
    if (groupRef.current) {
        groupRef.current.rotation.y -= delta * 0.2;
        groupRef.current.rotation.z = Math.sin(state.clock.elapsedTime) * 0.05;
    }
  });

  const javaBlue = "#5382a1";
  const javaRed = "#f89820"; 
  const white = "#FFFFFF";
  const symbolColor = isDark ? "#ffffff" : "#000000";
  
  // Steam Curves
  const bigFlameCurve = useMemo(() => new THREE.CatmullRomCurve3([
        new THREE.Vector3(0, -0.5, 0),
        new THREE.Vector3(0.3, 0.2, 0),
        new THREE.Vector3(-0.1, 0.8, 0),
        new THREE.Vector3(0.1, 1.4, 0)
  ]), []);

  const smallFlameCurve = useMemo(() => new THREE.CatmullRomCurve3([
        new THREE.Vector3(0, -0.4, 0),
        new THREE.Vector3(0.15, 0.1, 0),
        new THREE.Vector3(-0.1, 0.5, 0),
  ]), []);

  return (
    <Float floatIntensity={2} rotationIntensity={1} speed={2}>
      <group ref={groupRef} scale={[0.5, 0.5, 0.5]}>
        
        <mesh position={[0.2, 0.8, 0]}>
             <tubeGeometry args={[bigFlameCurve, 64, 0.12, 8, false]} />
             <meshStandardMaterial color={javaRed} roughness={0.2} emissive={javaRed} emissiveIntensity={0.2} />
        </mesh>

        <mesh position={[-0.2, 0.6, 0.1]}>
             <tubeGeometry args={[smallFlameCurve, 64, 0.1, 8, false]} />
             <meshStandardMaterial color={javaRed} roughness={0.2} emissive={javaRed} emissiveIntensity={0.2} />
        </mesh>

        <group position={[0, -0.5, 0]}>
            <mesh position={[0, 0.6, 0]} rotation={[Math.PI / 2, 0, 0]}>
                 <torusGeometry args={[0.7, 0.03, 16, 64]} />
                 <meshStandardMaterial color={javaBlue} roughness={0.3} />
            </mesh>

            <mesh position={[0, 0.48, 0]}>
                 <cylinderGeometry args={[0.7, 0.66, 0.24, 32]} />
                 <meshStandardMaterial color={white} roughness={0.3} />
            </mesh>
            <mesh position={[0, 0.24, 0]}>
                 <cylinderGeometry args={[0.66, 0.62, 0.24, 32]} />
                 <meshStandardMaterial color={javaBlue} roughness={0.3} />
            </mesh>
            <mesh position={[0, 0, 0]}>
                 <cylinderGeometry args={[0.62, 0.58, 0.24, 32]} />
                 <meshStandardMaterial color={white} roughness={0.3} />
            </mesh>
            <mesh position={[0, -0.24, 0]}>
                 <cylinderGeometry args={[0.58, 0.54, 0.24, 32]} />
                 <meshStandardMaterial color={javaBlue} roughness={0.3} />
            </mesh>
            <mesh position={[0, -0.48, 0]}>
                 <cylinderGeometry args={[0.54, 0.5, 0.24, 32]} />
                 <meshStandardMaterial color={white} roughness={0.3} />
            </mesh>
        </group>
        
        <group position={[0.5, -0.5, 0]} rotation={[0, 0, -1.4]} scale={[1, 1, 0.6]}>
             <Torus args={[0.35, 0.08, 16, 32, 4]}>
                <meshStandardMaterial color={javaBlue} roughness={0.3} />
             </Torus>
        </group>
          
        <group position={[0, -1.15, 0]}>
             <mesh>
                 <cylinderGeometry args={[1, 0.8, 0.1, 32]} />
                 <meshStandardMaterial color={white} roughness={0.3} />
             </mesh>
             <mesh position={[0, 0, 0]} rotation={[Math.PI / 2, 0, 0]}>
                 <torusGeometry args={[1.0, 0.03, 16, 64]} />
                 <meshStandardMaterial color={javaBlue} roughness={0.3} />
             </mesh>
        </group>

        {/* Floating Code */}
        <Float speed={4} rotationIntensity={2} floatIntensity={4}>
             <Text position={[2, 1, 0]} fontSize={0.35} color={symbolColor}>{"System.out.println"}</Text>
             <Text position={[-2, -1, 0.5]} fontSize={0.35} color={symbolColor}>{"public class"}</Text>
             <Text position={[1.5, -1.5, 1]} fontSize={0.4} color={symbolColor}>{";"}</Text>
             <Text position={[0, 2, -1]} fontSize={0.4} color={symbolColor}>{"{ }"}</Text>
        </Float>

      </group>
    </Float>
  );
}

function SqlScene({ isDark }: { isDark: boolean }) {
  const groupRef = useRef<THREE.Group>(null);
  
  useFrame((state, delta) => {
    if (groupRef.current) {
        groupRef.current.rotation.y -= delta * 0.2;
        groupRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.5) * 0.05;
    }
  });

  const dbColor = "#44c0ff"; 
  const symbolColor = isDark ? "#ffffff" : "#000000";
  
  return (
    <Float floatIntensity={2} rotationIntensity={1} speed={2}>
      <group ref={groupRef} scale={[0.5, 0.5, 0.5]}>
        
        {/* Top Disk */}
        <mesh position={[0, 0.8, 0]}>
            <cylinderGeometry args={[1.2, 1.2, 0.5, 32]} />
            <meshStandardMaterial color={dbColor} roughness={0.2} metalness={0.6} />
        </mesh>
         
        {/* Middle Disk */}
        <mesh position={[0, 0, 0]}>
            <cylinderGeometry args={[1.2, 1.2, 0.5, 32]} />
            <meshStandardMaterial color={dbColor} roughness={0.2} metalness={0.6} />
        </mesh>

        {/* Bottom Disk */}
        <mesh position={[0, -0.8, 0]}>
            <cylinderGeometry args={[1.2, 1.2, 0.5, 32]} />
            <meshStandardMaterial color={dbColor} roughness={0.2} metalness={0.6} />
        </mesh>

        {/* Floating SQL */}
        <Float speed={4} rotationIntensity={2} floatIntensity={4}>
             <Text position={[2, 1.2, 0]} fontSize={0.4} color={symbolColor}>{"SELECT *"}</Text>
             <Text position={[-2.2, 0.2, 0.5]} fontSize={0.4} color={symbolColor}>{"FROM"}</Text>
             <Text position={[1.8, -0.8, 1]} fontSize={0.4} color={symbolColor}>{"WHERE"}</Text>
             <Text position={[0, -2, -1]} fontSize={0.4} color={symbolColor}>{"JOIN"}</Text>
        </Float>

      </group>
    </Float>
  );
}

function NodeScene({ isDark }: { isDark: boolean }) {
  const groupRef = useRef<THREE.Group>(null);
  
  useFrame((state, delta) => {
    if (groupRef.current) {
        groupRef.current.rotation.y -= delta * 0.2;
        groupRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.5) * 0.05;
    }
  });

  const nodeGreen = "#339933"; 
  const symbolColor = isDark ? "#ffffff" : "#000000";
  
  return (
    <Float floatIntensity={2} rotationIntensity={1} speed={2}>
      <group ref={groupRef} scale={[0.5, 0.5, 0.5]}>
        
        {/* Node Hexagon - Point Up */}
        {/* Rotate Z by PI/2 (90deg) to make point up if default is point right? 
            Visual check: Cylinder 6 segments starts with vertex at (1,0). 
            So Point Right. To Point Up, Rotate Z 90 deg. 
            Plus X-rotation 90 deg to face camera.
        */}
        <mesh rotation={[Math.PI / 2, 0, Math.PI / 2]}>
            <cylinderGeometry args={[1.5, 1.5, 0.5, 6]} />
            <meshStandardMaterial color={nodeGreen} roughness={0.2} metalness={0.1} />
        </mesh>

        {/* Floating Node Keywords */}
        <Float speed={4} rotationIntensity={2} floatIntensity={4}>
             <Text position={[2.5, 1.5, 0]} fontSize={0.4} color={symbolColor}>{"npm install"}</Text>
             <Text position={[-2.5, -1, 0.5]} fontSize={0.4} color={symbolColor}>{"require()"}</Text>
             <Text position={[1, -2, 1]} fontSize={0.35} color={symbolColor}>{"module.exports"}</Text>
             <Text position={[0, 1.8, -1]} fontSize={0.35} color={symbolColor}>{"package.json"}</Text>
        </Float>

      </group>
    </Float>
  );
}

export default function TechScene() {
  const [sceneIndex, setSceneIndex] = useState(0);
  const { theme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    
    const interval = setInterval(() => {
      setSceneIndex((prev) => {
         const randomOffset = 1 + Math.floor(Math.random() * 5);
         return (prev + randomOffset) % 6;
      });
    }, 4500); 
    return () => clearInterval(interval);
  }, []);

  const isDark = mounted && (theme === "dark" || resolvedTheme === "dark");

  return (
    <div className="absolute inset-0 z-0 overflow-hidden w-full h-full rounded-2xl bg-black/5 dark:bg-black/20">
      <Canvas eventSource={document.body} gl={{ antialias: true, alpha: true }}>
        <PerspectiveCamera makeDefault position={[0, 0, 5]} fov={50} />
        <Suspense fallback={null}>
          <Environment preset="city" />
          <ambientLight intensity={0.2} />
          
          <pointLight position={[5, 5, 5]} intensity={3} color="#00f0ff" distance={10} />
          <pointLight position={[-5, -5, -5]} intensity={3} color="#ff0080" distance={10} />
          
          {/* React Scene renders instantly (default 0) without waiting for mount */}
          {sceneIndex === 0 && <ReactScene />}
          {mounted && sceneIndex === 1 && <JavascriptScene isDark={isDark} />}
          {mounted && sceneIndex === 2 && <ChromeScene isDark={isDark} />}
          {mounted && sceneIndex === 3 && <JavaScene isDark={isDark} />}
          {mounted && sceneIndex === 4 && <SqlScene isDark={isDark} />}
          {mounted && sceneIndex === 5 && <NodeScene isDark={isDark} />}
        </Suspense>
      </Canvas>
    </div>
  );
}
