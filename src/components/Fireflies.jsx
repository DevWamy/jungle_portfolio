import React, { useMemo, useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';

function Fireflies({ mode, count = 20 }) {
  const groupRef = useRef();

  const fireflies = useMemo(() => {
    const data = [];
    for (let i = 0; i < count; i++) {
      const position = new THREE.Vector3(
        (Math.random() - 0.5) * 10,
        Math.random() * 1.7 + 0.8,
        (Math.random() - 0.5) * 10
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
        seed: Math.random() * Math.PI * 2, // pour clignotement unique
      });
    }
    return data;
  }, [count]);

  useFrame(() => {
  const t = performance.now() / 1000;

  fireflies.forEach((fly) => {
    // Supprimer le lerp inutile

    // Mouvement avec facteur de ralentissement
    fly.position.add(fly.velocity.clone().multiplyScalar(0.4));

    // Rebonds Y
    if (fly.position.y > 2.6) {
      fly.position.y = 2.6;
      fly.velocity.y *= -0.9;
    } else if (fly.position.y < 0.3) {
      fly.position.y = 0.3;
      fly.velocity.y *= -0.9;
    }

    // Rebonds X
    if (fly.position.x > 5) {
      fly.position.x = 5;
      fly.velocity.x *= -0.9;
    } else if (fly.position.x < -5) {
      fly.position.x = -5;
      fly.velocity.x *= -0.9;
    }

    // Rebonds Z
    if (fly.position.z > 5) {
      fly.position.z = 5;
      fly.velocity.z *= -0.9;
    } else if (fly.position.z < -5) {
      fly.position.z = -5;
      fly.velocity.z *= -0.9;
    }

    // Réveil si vitesse trop faible
    ['x', 'y', 'z'].forEach((axis) => {
      if (Math.abs(fly.velocity[axis]) < 0.00001) {
        fly.velocity[axis] = (Math.random() - 0.5) * 0.0001;
      }
    });

    // MAJ positions
    if (fly.meshRef.current) {
      fly.meshRef.current.position.copy(fly.position);
    }
    if (fly.lightRef.current) {
      fly.lightRef.current.position.copy(fly.position);

      // Clignotement doux
      const flicker = 1.5 + Math.sin(t * 2 + fly.seed) * 1; 
      fly.lightRef.current.intensity = flicker;
    }
  });
});

  return (
    <group ref={groupRef}>
      {fireflies.map((fly, i) => (
        <React.Fragment key={i}>
          {/* Luciole visible */}
          <mesh
            ref={fly.meshRef}
            position={fly.position}
            scale={mode === 'night' ? 0.02 : 0.01}
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

          {/* Lumière (que la nuit) */}
          {mode === 'night' && (
            <pointLight
              ref={fly.lightRef}
              position={fly.position}
              intensity={2.5} 
              distance={0.15} 
              decay={3} 
              color={fly.color}
              toneMapped={false}
              castShadow={false}
            />
          )}
        </React.Fragment>
      ))}
    </group>
  );
}

export default Fireflies;
