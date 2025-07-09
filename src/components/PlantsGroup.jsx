import React, { useMemo } from 'react';
import { useGLTF } from '@react-three/drei';

const GROUND_WIDTH = 20;
const GROUND_LENGTH = 60;
const PATH_WIDTH = 6;
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

  // Zones gauche et droite du chemin
  const leftMinX = -halfWidth + PADDING;
  const leftMaxX = -PATH_WIDTH / 2 - PADDING;

  const rightMinX = PATH_WIDTH / 2 + PADDING;
  const rightMaxX = halfWidth - PADDING;

  const minZ = -GROUND_LENGTH;
  const maxZ = 0;

  // On essaie de placer des plantes jusqu'à atteindre le nombre voulu
  while (positions.length < count && attempts < MAX_ATTEMPTS) {
    const side = Math.random() < 0.5 ? 'left' : 'right';
    const x = side === 'left'
      ? Math.random() * (leftMaxX - leftMinX) + leftMinX
      : Math.random() * (rightMaxX - rightMinX) + rightMinX;

    const z = Math.random() * (maxZ - minZ) + minZ;

    const pos = [x, 0, z];
    if (isValidPosition(pos, positions)) {
      positions.push(pos);
    }

    attempts++;
  }

  return positions;
}

function PlantsGroup() {
  // Chargement de tous les modèles GLTF pour chaque catégorie de plante
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

  // Génère toutes les positions pour les plantes une seule fois
  const totalCount = 2000;
  const positions = useMemo(() => generatePositions(totalCount), [totalCount]);

  return (
    <group>
      {positions.map((pos, i) => {
        // Sélectionne cycliquement un modèle à partir de la liste
        const plant = allPlants[i % allPlants.length];
        return (
          <primitive
            key={i}
            // Clone du modèle pour ne pas affecter l'original (ex: transformations)
            object={plant.model.clone()}
            position={pos}
            scale={[plant.scale, plant.scale, plant.scale]}
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
