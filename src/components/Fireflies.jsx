import React, { useMemo, useRef, useEffect } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';

const GROUND_WIDTH = 20;
const GROUND_LENGTH = 60;

function Fireflies({ mode, count = 80 }) {
  const groupRef = useRef();
  const fadeRef = useRef(0);

  // Création des lucioles avec propriétés individuelles
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
      const frequency = 1 + Math.random() * 3;
      const phase = Math.random() * Math.PI * 2;
      const spawnDelay = Math.random() * 2; // Apparition différée (0 à 2 sec)

      data.push({
        position,
        velocity,
        color,
        frequency,
        phase,
        spawnDelay,
        ref: React.createRef(),
      });
    }
    return data;
  }, [count]);

  // Mémorise l’état jour/nuit
  useEffect(() => {
    fadeRef.current = mode === 'night' ? 0 : 1;
  }, [mode]);

  useFrame(() => {
    const t = performance.now() / 1000;
    const fadeTarget = mode === 'night' ? 1 : 0;
    fadeRef.current += (fadeTarget - fadeRef.current) * 0.05;
    const fade = fadeRef.current;

    fireflies.forEach((fly) => {
      // Mouvement avec rebonds dans la zone définie
      fly.position.add(fly.velocity.clone().multiplyScalar(0.2));
      if (fly.position.x > GROUND_WIDTH / 2 || fly.position.x < -GROUND_WIDTH / 2) fly.velocity.x *= -1;
      if (fly.position.y > 4 || fly.position.y < 1.1) fly.velocity.y *= -1;
      if (fly.position.z > 0 || fly.position.z < -GROUND_LENGTH) fly.velocity.z *= -1;

      // Contrôle visuel
      if (fly.ref.current) {
        fly.ref.current.position.copy(fly.position);

        const visibleTime = Math.max(0, t - fly.spawnDelay); // Décale le début de scintillement
        const rawFlicker = 0.5 + 0.5 * Math.sin(visibleTime * fly.frequency + fly.phase); // [0,1]
        const minIntensity = 0.3;
        const maxIntensity = 1.0;
        const intensity = mode === 'night'
          ? (minIntensity + (maxIntensity - minIntensity) * rawFlicker) * fade
          : 0;

        const opacity = mode === 'night' ? fade : 0;

        const mesh = fly.ref.current.children[0];
        mesh.material.emissive.set(fly.color);
        mesh.material.emissiveIntensity = intensity;
        mesh.material.opacity = opacity;
        mesh.material.color.set(fly.color);
      }
    });
  });

  return (
    <group ref={groupRef}>
      {fireflies.map((fly, i) => (
        <group key={i} ref={fly.ref} position={fly.position}>
          <mesh
            scale={0.025}
            geometry={new THREE.SphereGeometry(1, 12, 12)}
            material={
              new THREE.MeshStandardMaterial({
                color: fly.color,
                emissive: fly.color,
                emissiveIntensity: 1,
                transparent: true,
                opacity: 0,
                toneMapped: false,
              })
            }
          />
        </group>
      ))}
    </group>
  );
}

export default Fireflies;
