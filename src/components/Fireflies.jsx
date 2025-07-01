import React, { useMemo, useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';

function Fireflies({ mode, count = 40 }) {
  const groupRef = useRef();

  const fireflies = useMemo(() => {
    const data = [];
    for (let i = 0; i < count; i++) {
      const position = new THREE.Vector3(
        (Math.random() - 0.5) * 40,
        Math.random() * 8 + 2,
        (Math.random() - 0.5) * 40
      );
      const velocity = new THREE.Vector3(
        (Math.random() - 0.5) * 0.01,
        (Math.random() - 0.5) * 0.01,
        (Math.random() - 0.5) * 0.01
      );
      const color = new THREE.Color().setHSL(Math.random(), 0.7, 0.6);

      data.push({
        position,
        velocity,
        color,
        meshRef: React.createRef(),
        lightRef: React.createRef(),
      });
    }
    return data;
  }, [count]);

  // Animation frame : mouvement
  useFrame(() => {
    fireflies.forEach((fly) => {
      fly.position.add(fly.velocity);

      // Rebonds simples
      if (fly.position.y > 12 || fly.position.y < 2) {
        fly.velocity.y *= -1;
      }

      // Mettre à jour mesh et lumière
      if (fly.meshRef.current) {
        fly.meshRef.current.position.copy(fly.position);
      }
      if (fly.lightRef.current) {
        fly.lightRef.current.position.copy(fly.position);
      }
    });
  });

  return (
    <group ref={groupRef}>
      {fireflies.map((fly, i) => (
        <React.Fragment key={i}>
          {/* Sphere visible */}
          {/* <mesh ref={fly.meshRef} position={fly.position} scale={0.1}> */}
          <mesh
            ref={fly.meshRef}
            position={fly.position}
            scale={mode === 'night' ? 0.04 : 0.025}
          >

            <sphereGeometry args={[1, 16, 16]} />
            <meshStandardMaterial
              color={mode === 'night' ? 'black' : fly.color}
              emissive={mode === 'night' ? fly.color : 'black'}
              emissiveIntensity={mode === 'night' ? 2 : 0}
              transparent
              opacity={mode === 'night' ? 1 : 0.25}
              toneMapped={false}
            />
          </mesh>

          {/* Lumière uniquement la nuit */}
          {mode === 'night' && (
            <pointLight
              ref={fly.lightRef}
              position={fly.position}
              intensity={0.6}
              distance={4}
              color={fly.color}
            />
          )}
        </React.Fragment>
      ))}
    </group>
  );
}

export default Fireflies;
