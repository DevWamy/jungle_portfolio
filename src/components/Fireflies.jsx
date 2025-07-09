import React, { useMemo, useRef, useState, useEffect } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';

// Dimensions du sol qui délimitent l’espace dans lequel les lucioles peuvent se déplacer
const GROUND_WIDTH = 20;
const GROUND_LENGTH = 60;

function Fireflies({ mode, count = 100 }) {
  const groupRef = useRef(); // Référence au groupe contenant toutes les lucioles
  const [fireflyFade, setFireflyFade] = useState(0); // Valeur entre 0 et 1 pour gérer le fondu (fade-in)

  // 🟡 Géométrie partagée entre toutes les lucioles (petites sphères)
  const sharedGeometry = useMemo(() => new THREE.SphereGeometry(1, 16, 16), []);

  // 🟡 Matériau partagé entre toutes les lucioles
  const sharedMaterial = useMemo(() => {
    const mat = new THREE.MeshStandardMaterial({
      color: 'black', // Couleur de base du mesh
      emissive: new THREE.Color(0xffffff), // Couleur de l'émission lumineuse (remplacée plus bas par fly.color)
      emissiveIntensity: 1, // Intensité de l’émissivité (contrôlée plus bas en temps réel)
      transparent: true,
      opacity: 0, // Commence invisible (le fade-in augmente cette valeur)
      toneMapped: false, // Ne pas appliquer le tone mapping sur cette matière
    });
    return mat;
  }, []);

  // 🔁 Initialisation des lucioles (positions, vitesses, couleurs, etc.)
  const fireflies = useMemo(() => {
    const data = [];
    for (let i = 0; i < count; i++) {
      const position = new THREE.Vector3(
        (Math.random() - 0.5) * GROUND_WIDTH, // X entre -10 et 10
        1.2 + Math.random() * 2.3,            // Y entre 1.2 et 3.5
        -GROUND_LENGTH + Math.random() * GROUND_LENGTH // Z entre -60 et 0
      );
      const velocity = new THREE.Vector3(
        (Math.random() - 0.5) * 0.03, // Vitesse lente sur X
        (Math.random() - 0.5) * 0.03, // sur Y
        (Math.random() - 0.5) * 0.03  // sur Z
      );
      const color = new THREE.Color().setHSL(Math.random(), 0.7, 0.6); // Couleur aléatoire dans une teinte vive
      data.push({
        position,
        velocity,
        color,
        ref: React.createRef(), // Ref à un group <group> contenant le mesh + light
        seed: Math.random() * Math.PI * 2, // Valeur aléatoire utilisée pour le flicker
      });
    }
    return data;
  }, [count]);

  // 🌓 À chaque changement de mode (jour/nuit), on réinitialise le fade
  useEffect(() => {
    setFireflyFade(0); // Si on passe en "night", le fade va recommencer
  }, [mode]);

  // ⏱ Mise à jour de chaque frame (animation des lucioles)
  useFrame(() => {
    const t = performance.now() / 1000; // Temps en secondes

    // 🌙 Si on est en mode nuit, on augmente progressivement le "fade" jusqu’à 1
    if (mode === 'night' && fireflyFade < 1) {
      setFireflyFade((prev) => Math.min(prev + 0.2, 1)); // Vitesse du fade-in ici
    }

    fireflies.forEach((fly) => {
      // 🌀 Déplacement : on ajoute une petite portion de la vitesse à la position
      fly.position.add(fly.velocity.clone().multiplyScalar(0.8));

      // 🔁 Collision simple avec les bords : on inverse la direction si on sort des limites
      if (fly.position.x > GROUND_WIDTH / 2 || fly.position.x < -GROUND_WIDTH / 2)
        fly.velocity.x *= -1;
      if (fly.position.y > 4 || fly.position.y < 1.1)
        fly.velocity.y *= -1;
      if (fly.position.z > 0 || fly.position.z < -GROUND_LENGTH)
        fly.velocity.z *= -1;

      // 💡 Mise à jour de la position et de la lumière/émission
      if (fly.ref.current) {
        fly.ref.current.position.copy(fly.position); // Déplacer le groupe de la luciole

        // ✨ Effet de scintillement basé sur une sinusoïde et une graine aléatoire
        const frequency = 1 + Math.sin(fly.seed) * 1.5; // une fréquence unique entre ~-0.5 et ~2.5
        const flicker = 1.5 + Math.sin(t * frequency + fly.seed); // Doux lignotement avec un décalage unique pour chaque luciole

        // 💡 Intensité et opacité dépendantes du mode et du fade-in
        const intensity = mode === 'night' ? flicker * fireflyFade : 0;
        const opacity = mode === 'night' ? fireflyFade : 0;

        // 🎨 Accès au mesh (la sphère) et à la lumière de la luciole
        const mesh = fly.ref.current.children[0];
        const light = fly.ref.current.children[1];

        // 🟡 Mise à jour de la couleur et des propriétés de lumière
        mesh.material.emissive.set(fly.color); // Couleur spécifique à chaque luciole
        mesh.material.emissiveIntensity = intensity; // Scintillement visible
        mesh.material.opacity = opacity; // Apparition progressive

        light.color = fly.color; // Même couleur que la sphère
        light.intensity = intensity; // Idem, varie avec le flicker
      }
    });
  });

  // 🧱 Rendu des lucioles : chaque luciole est un groupe contenant un mesh + une lumière
  return (
    <group ref={groupRef}>
      {fireflies.map((fly, i) => (
        <group key={i} ref={fly.ref} position={fly.position}>
          <mesh
            scale={0.025} // Taille de la sphère
            geometry={sharedGeometry} // Géométrie partagée
            material={sharedMaterial} // Matériau partagé (mais modifié en live)
          />
          <pointLight
            intensity={0} // Commence éteinte (intensité ajustée dynamiquement)
            distance={0.15}
            decay={3}
            color={fly.color} // Couleur propre à chaque luciole
            castShadow={false}
          />
        </group>
      ))}
    </group>
  );
}

export default Fireflies;
