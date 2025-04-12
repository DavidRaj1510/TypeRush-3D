
import React, { useRef, useState, useEffect, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text3D, Float, Text, Stars } from '@react-three/drei';
import { Group, Mesh, Vector3 } from 'three';
import { Word } from '../types/gameTypes';

// Spaceship component
const Spaceship = ({ position, rotation, speed }: { position: [number, number, number], rotation: [number, number, number], speed: number }) => {
  const shipRef = useRef<Group>(null);

  useFrame((state, delta) => {
    if (shipRef.current) {
      shipRef.current.position.z += speed * delta;
      shipRef.current.rotation.y += delta * 0.1;
      
      // Reset position when it goes past the camera
      if (shipRef.current.position.z > 5) {
        shipRef.current.position.z = -20;
        shipRef.current.position.x = (Math.random() - 0.5) * 20;
        shipRef.current.position.y = (Math.random() - 0.5) * 10;
      }
    }
  });

  return (
    <group ref={shipRef} position={position} rotation={rotation}>
      <mesh>
        <coneGeometry args={[0.5, 1.5, 8]} />
        <meshStandardMaterial color="#35a1f2" metalness={0.8} roughness={0.2} />
      </mesh>
      <mesh position={[0, 0, 0.8]}>
        <sphereGeometry args={[0.3, 16, 16]} />
        <meshStandardMaterial color="#66ccff" emissive="#3366ff" emissiveIntensity={2} />
      </mesh>
      <mesh position={[0, 0, -0.8]} rotation={[Math.PI, 0, 0]}>
        <cylinderGeometry args={[0.2, 0.5, 0.5, 16]} />
        <meshStandardMaterial color="#ff3333" emissive="#ff0000" emissiveIntensity={3} />
      </mesh>
    </group>
  );
};

// Alien component
const Alien = ({ position, speed }: { position: [number, number, number], speed: number }) => {
  const alienRef = useRef<Group>(null);
  const hoverY = useRef(Math.random() * 0.2 + 0.1);
  const phase = useRef(Math.random() * Math.PI * 2);

  useFrame((state, delta) => {
    if (alienRef.current) {
      alienRef.current.position.z += speed * delta;
      alienRef.current.position.y += Math.sin(state.clock.elapsedTime * 2 + phase.current) * hoverY.current * delta;
      alienRef.current.rotation.y += delta * 1.5;
      
      if (alienRef.current.position.z > 5) {
        alienRef.current.position.z = -30;
        alienRef.current.position.x = (Math.random() - 0.5) * 25;
        alienRef.current.position.y = (Math.random() - 0.5) * 15;
      }
    }
  });

  const color = useMemo(() => 
    ['#5dff3d', '#ff55cc', '#5588ff', '#ffdd00'][Math.floor(Math.random() * 4)], 
  []);

  return (
    <group ref={alienRef} position={position}>
      <mesh>
        <sphereGeometry args={[0.7, 16, 16]} />
        <meshStandardMaterial color={color} />
      </mesh>
      <mesh position={[0.4, 0.5, 0]}>
        <sphereGeometry args={[0.25, 16, 16]} />
        <meshStandardMaterial color="#000000" emissive="#ffffff" emissiveIntensity={0.5} />
      </mesh>
      <mesh position={[-0.4, 0.5, 0]}>
        <sphereGeometry args={[0.25, 16, 16]} />
        <meshStandardMaterial color="#000000" emissive="#ffffff" emissiveIntensity={0.5} />
      </mesh>
      <mesh position={[0, -0.2, 0]}>
        <boxGeometry args={[0.5, 0.1, 0.1]} />
        <meshStandardMaterial color="#000000" />
      </mesh>
      <mesh position={[0, -0.5, 0]} rotation={[0, 0, Math.PI / 4]}>
        <cylinderGeometry args={[0.1, 0.4, 0.5, 3]} />
        <meshStandardMaterial color={color} metalness={0.8} />
      </mesh>
    </group>
  );
};

// Rocket component
const Rocket = ({ position, speed }: { position: [number, number, number], speed: number }) => {
  const rocketRef = useRef<Group>(null);
  const initialRotation = useMemo<[number, number, number]>(() => 
    [0, 0, Math.random() * Math.PI * 2], 
  []);

  useFrame((state, delta) => {
    if (rocketRef.current) {
      rocketRef.current.position.z += speed * delta * 2;
      
      if (rocketRef.current.position.z > 5) {
        rocketRef.current.position.z = -40;
        rocketRef.current.position.x = (Math.random() - 0.5) * 30;
        rocketRef.current.position.y = (Math.random() - 0.5) * 20;
      }
    }
  });

  return (
    <group ref={rocketRef} position={position} rotation={initialRotation}>
      <mesh>
        <cylinderGeometry args={[0.1, 0.2, 1.2, 16]} />
        <meshStandardMaterial color="#dddddd" metalness={0.8} roughness={0.2} />
      </mesh>
      <mesh position={[0, 0, 0.7]}>
        <coneGeometry args={[0.2, 0.5, 16]} />
        <meshStandardMaterial color="#ff3333" metalness={0.5} roughness={0.5} />
      </mesh>
      <mesh position={[0, 0, -0.8]}>
        <sphereGeometry args={[0.15, 16, 16]} />
        <meshStandardMaterial color="#ff8800" emissive="#ff3300" emissiveIntensity={5} />
      </mesh>
      <mesh position={[0, 0, -0.6]}>
        <ringGeometry args={[0.15, 0.25, 16]} />
        <meshStandardMaterial color="#ffaa00" emissive="#ff6600" emissiveIntensity={2} transparent opacity={0.7} />
      </mesh>
    </group>
  );
};

// Boss component
const Boss = ({ position, health, maxHealth }: { position: [number, number, number], health: number, maxHealth: number }) => {
  const bossRef = useRef<Group>(null);
  const attackTimeRef = useRef(0);
  
  useFrame((state, delta) => {
    if (bossRef.current) {
      // Hovering animation
      bossRef.current.position.y += Math.sin(state.clock.elapsedTime) * 0.01;
      
      // Slow rotation
      bossRef.current.rotation.y += delta * 0.2;
      
      // Attack animation
      attackTimeRef.current += delta;
      if (attackTimeRef.current > 3) {
        attackTimeRef.current = 0;
      }
    }
  });

  // Calculate health percentage
  const healthPercent = health / maxHealth;
  const healthBarColor = healthPercent > 0.6 ? "#22cc66" : healthPercent > 0.3 ? "#ffcc00" : "#ff3333";

  return (
    <group ref={bossRef} position={position}>
      {/* Main body */}
      <mesh>
        <dodecahedronGeometry args={[2, 1]} />
        <meshStandardMaterial color="#334455" metalness={0.7} roughness={0.2} />
      </mesh>
      
      {/* Eyes */}
      <mesh position={[0.8, 0.5, 1.2]} rotation={[0, 0.4, 0]}>
        <sphereGeometry args={[0.3, 16, 16]} />
        <meshStandardMaterial color="#ff0000" emissive="#aa0000" emissiveIntensity={2} />
      </mesh>
      <mesh position={[-0.8, 0.5, 1.2]} rotation={[0, -0.4, 0]}>
        <sphereGeometry args={[0.3, 16, 16]} />
        <meshStandardMaterial color="#ff0000" emissive="#aa0000" emissiveIntensity={2} />
      </mesh>
      
      {/* Spikes */}
      {[0, 1, 2, 3, 4, 5].map((i) => (
        <mesh 
          key={i} 
          position={[
            Math.sin(i * Math.PI / 3) * 1.8,
            Math.cos(i * Math.PI / 3) * 1.8,
            0
          ]}
          rotation={[0, 0, i * Math.PI / 3]}
        >
          <coneGeometry args={[0.4, 1.2, 4]} />
          <meshStandardMaterial color="#556677" metalness={0.9} roughness={0.1} />
        </mesh>
      ))}
      
      {/* Health bar */}
      <group position={[0, 2.5, 0]}>
        {/* Health bar background */}
        <mesh position={[0, 0, 0]}>
          <boxGeometry args={[4, 0.3, 0.1]} />
          <meshStandardMaterial color="#333333" />
        </mesh>
        
        {/* Health bar fill */}
        <mesh position={[2 * (healthPercent - 1), 0, 0.05]}>
          <boxGeometry args={[4 * healthPercent, 0.3, 0.1]} />
          <meshStandardMaterial color={healthBarColor} emissive={healthBarColor} emissiveIntensity={0.5} />
        </mesh>
      </group>
    </group>
  );
};

interface GameSceneProps {
  words: Word[];
  gameMode: 'single' | 'multiplayer';
  difficulty: 'easy' | 'medium' | 'hard';
  isBossBattle: boolean;
  bossHealth: number;
  maxBossHealth: number;
  onWordHit: (word: Word) => void;
}

// Generate random positions
const generateRandomPosition = (index: number): [number, number, number] => {
  return [
    (Math.random() - 0.5) * 20,  // x between -10 and 10
    (Math.random() - 0.5) * 10,  // y between -5 and 5
    -25 - index * 5,             // z starting from -25 and going further back
  ] as [number, number, number];
};

const GameScene: React.FC<GameSceneProps> = ({ 
  words, 
  gameMode, 
  difficulty, 
  isBossBattle, 
  bossHealth, 
  maxBossHealth,
  onWordHit 
}) => {
  // Fix the type issue - we need to use any here because Text3D doesn't match Group perfectly
  const wordRefs = useRef<any[]>([]);

  // For proper 3D font loading
  const fontUrl = useMemo(() => {
    // Handle both development and production/GitHub Pages paths
    const basePath = import.meta.env.BASE_URL || '';
    return `${basePath}fonts/helvetiker_regular.typeface.json`;
  }, []);

  // Generate spaceship, alien, and rocket positions
  const spaceshipPositions = useMemo(() => 
    Array.from({ length: 5 }, (_, i) => generateRandomPosition(i)), 
  []);
  
  const alienPositions = useMemo(() => 
    Array.from({ length: 4 }, (_, i) => generateRandomPosition(i + 5)),
  []);
  
  const rocketPositions = useMemo(() =>
    Array.from({ length: 6 }, (_, i) => generateRandomPosition(i + 9)),
  []);

  // Handle difficulty-based speed
  const getSpeed = () => {
    switch(difficulty) {
      case 'easy': return 2;
      case 'medium': return 3;
      case 'hard': return 4.5; // Increased speed for hard difficulty
      default: return 3;
    }
  };

  return (
    <>
      {/* Add stars for space background */}
      <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
      
      {/* Add ambient and directional lights */}
      <ambientLight intensity={0.5} />
      <directionalLight position={[0, 5, 5]} intensity={1} />
      <pointLight position={[0, 3, 2]} intensity={10} color="#88ccff" />

      {/* Add spaceships */}
      {spaceshipPositions.map((position, idx) => (
        <Spaceship 
          key={`ship-${idx}`}
          position={position}
          rotation={[0, Math.random() * Math.PI * 2, 0]}
          speed={getSpeed() * 0.8}
        />
      ))}
      
      {/* Add aliens */}
      {alienPositions.map((position, idx) => (
        <Alien 
          key={`alien-${idx}`} 
          position={position}
          speed={getSpeed() * 0.6}
        />
      ))}
      
      {/* Add rockets */}
      {rocketPositions.map((position, idx) => (
        <Rocket 
          key={`rocket-${idx}`} 
          position={position}
          speed={getSpeed() * 1.2}
        />
      ))}
      
      {/* Display boss if it's a boss battle */}
      {isBossBattle && (
        <Boss 
          position={[0, 0, -15]} 
          health={bossHealth}
          maxHealth={maxBossHealth}
        />
      )}

      {/* Display flying words */}
      {words.map((word, idx) => (
        <Float 
          key={word.id}
          position={word.position}
          speed={1} 
          rotationIntensity={0.5} 
          floatIntensity={0.5}
        >
          <Text3D
            ref={el => {wordRefs.current[idx] = el}}
            font={fontUrl}
            size={0.7}
            height={0.15}
            curveSegments={12}
            bevelEnabled
            bevelThickness={0.02}
            bevelSize={0.02}
            bevelOffset={0}
            bevelSegments={5}
            onClick={() => onWordHit(word)}
          >
            {word.text}
            <meshStandardMaterial 
              color={word.color || "#ffffff"} 
              emissive={word.color || "#ffffff"} 
              emissiveIntensity={0.5}
              metalness={0.8}
              roughness={0.2}
            />
          </Text3D>
        </Float>
      ))}
    </>
  );
};

export default GameScene;
