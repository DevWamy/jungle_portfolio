import React, { useMemo, useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';

const GROUND_WIDTH = 20;
const GROUND_LENGTH = 60;

function Fireflies({ mode, count = 60 }) {
  const groupRef = useRef();

  const fireflies = useMemo(() => {
    const data = [];
    for (let i = 0; i < count; i++) {
      const position = new THREE.Vector3(
        (Math.random() - 0.5) * GROUND_WIDTH,
        1.2 + Math.random() * 2.3,
        -GROUND_LENGTH + Math.random() * GROUND_LENGTH
      );
      const velocity = new THREE.Vector3(
        (Math.random() - 0.5) * 0.03,
        (Math.random() - 0.5) * 0.03,
        (Math.random() - 0.5) * 0.03
      );
      const color = new THREE.Color().setHSL(Math.random(), 0.7, 0.6);
      data.push({ position, velocity, color, ref: React.createRef(), seed: Math.random() * Math.PI * 2 });
    }
    return data;
  }, [count]);

  useFrame(() => {
    const t = performance.now() / 1000;

    fireflies.forEach((fly) => {
      fly.position.add(fly.velocity.clone().multiplyScalar(0.8));

      if (fly.position.x > GROUND_WIDTH / 2 || fly.position.x < -GROUND_WIDTH / 2)
        fly.velocity.x *= -1;
      if (fly.position.y > 4 || fly.position.y < 1.1)
        fly.velocity.y *= -1;
      if (fly.position.z > 0 || fly.position.z < -GROUND_LENGTH)
        fly.velocity.z *= -1;

      if (fly.ref.current) {
        fly.ref.current.position.copy(fly.position);

        const flicker = 1.5 + Math.sin(t * 2 + fly.seed);
        const intensity = mode === 'night' ? flicker : 0;
        const opacity = mode === 'night' ? 1 : 0;

        fly.ref.current.children[0].material.emissiveIntensity = intensity;
        fly.ref.current.children[0].material.opacity = opacity;
        fly.ref.current.children[1].intensity = intensity;
      }
    });
  });

  return (
    <group ref={groupRef}>
      {fireflies.map((fly, i) => (
        <group key={i} ref={fly.ref} position={fly.position}>
          <mesh scale={0.025}>
            <sphereGeometry args={[1, 16, 16]} />
            <meshStandardMaterial
              color="black"
              emissive={fly.color}
              emissiveIntensity={1}
              transparent
              opacity={0}
              toneMapped={false}
            />
          </mesh>
          <pointLight
            intensity={0}
            distance={0.15}
            decay={3}
            color={fly.color}
            castShadow={false}
          />
        </group>
      ))}
    </group>
  );
}

export default Fireflies;
