import React, { useMemo } from 'react';
import { useGLTF } from '@react-three/drei';

const GROUND_WIDTH = 20;
const GROUND_LENGTH = 60;
const PATH_WIDTH = 7;
const PADDING = 1;
const MIN_DISTANCE = 0.6;
const MAX_ATTEMPTS = 10000;

// Vérifie si une nouvelle position ne chevauche pas les autres
function isValidPosition(pos, others) {
  return others.every(other => {
    const dx = pos[0] - other[0];
    const dz = pos[2] - other[2];
    return Math.sqrt(dx * dx + dz * dz) >= MIN_DISTANCE;
  });
}

// Génère des positions aléatoires sur les côtés du chemin, sans superposition
function generatePositions(count) {
  const positions = [];
  let attempts = 0;

  const halfWidth = GROUND_WIDTH / 2;

  // Zones gauche et droite du chemin (avec PADDING pour pas coller au chemin)
  const leftMinX = -halfWidth + PADDING;
  const leftMaxX = -PATH_WIDTH / 2 - PADDING;

  const rightMinX = PATH_WIDTH / 2 + PADDING;
  const rightMaxX = halfWidth - PADDING;

  const minZ = -GROUND_LENGTH;
  const maxZ = 0;

  // On essaie de placer des plantes jusqu'à atteindre le nombre voulu
  while (positions.length < count && attempts < MAX_ATTEMPTS) {
    const side = Math.random() < 0.5 ? 'left' : 'right';

    // Génère X dans la bonne zone selon le côté choisi
    const x = side === 'left'
      ? Math.random() * (leftMaxX - leftMinX) + leftMinX
      : Math.random() * (rightMaxX - rightMinX) + rightMinX;

    // Z aléatoire dans la zone définie
    const z = Math.random() * (maxZ - minZ) + minZ;

    const pos = [x, 0, z];

    // Ajoute si pas trop proche d'autres plantes
    if (isValidPosition(pos, positions)) {
      positions.push(pos);
    }

    attempts++;
  }

  return positions;
}

function PlantsGroup() {
  // Chargement des modèles GLTF pour chaque catégorie de plante
  const palms = [
    useGLTF('assets/models/plants/palms/palm.glb'),
    useGLTF('assets/models/plants/palms/palm_2.glb'),
    useGLTF('assets/models/plants/palms/palm_3.glb'),
  ];
  const monsteras = [
    useGLTF('assets/models/plants/monsteras/monstera.glb'),
    useGLTF('assets/models/plants/monsteras/monstera_2.glb'),
    useGLTF('assets/models/plants/monsteras/monstera_3.glb'),
    useGLTF('assets/models/plants/monsteras/monstera_4.glb'),
  ];
  const ferns = [
    useGLTF('assets/models/plants/ferns/fern.glb'),
    useGLTF('assets/models/plants/ferns/fern_2.glb'),
    useGLTF('assets/models/plants/ferns/fern_3.glb'),
    useGLTF('assets/models/plants/ferns/fern_4.glb'),
    useGLTF('assets/models/plants/ferns/fern_5.glb'),
    useGLTF('assets/models/plants/ferns/fern_6.glb'),
  ];
  const bananas = [
    useGLTF('assets/models/plants/bananas/banana.glb'),
    useGLTF('assets/models/plants/bananas/banana_2.glb'),
  ];

  // Réunit tous les modèles avec leur échelle respective
  const allPlants = [
    ...palms.map(model => ({ model: model.scene, scale: 1 })),
    ...monsteras.map(model => ({ model: model.scene, scale: 0.8 })),
    ...ferns.map(model => ({ model: model.scene, scale: 0.6 })),
    ...bananas.map(model => ({ model: model.scene, scale: 0.9 })),
  ];

  const totalCount = 2000;

  // Génère une fois les positions (stables)
  const positions = useMemo(() => generatePositions(totalCount), [totalCount]);

  // Génère une fois la variation de taille (stables)
  const sizes = useMemo(() => {
    const arr = [];
    for (let i = 0; i < totalCount; i++) {
      // Taille entre 70% et 130% de la taille de base
      arr.push(0.7 + Math.random() * 0.6);
    }
    return arr;
  }, [totalCount]);

  return (
    <group>
      {positions.map((pos, i) => {
        const plant = allPlants[i % allPlants.length];
        const sizeVariation = sizes[i];
        const scale = plant.scale * sizeVariation; // taille variable mais stable

        return (
          <primitive
            key={i}
            object={plant.model.clone()}
            position={pos}
            scale={[scale, scale, scale]}  // applique la taille variable stable
            rotation={[0, 0, 0]}
            castShadow
            receiveShadow
          />
        );
      })}
    </group>
  );
}

export default PlantsGroup;

