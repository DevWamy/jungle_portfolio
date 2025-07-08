import React, { useMemo } from 'react';
import { useGLTF } from '@react-three/drei';

const GROUND_WIDTH = 20;     // Largeur du sol (x)
const GROUND_LENGTH = 60;    // Longueur du sol (z)
const PATH_WIDTH = 6;        // Largeur du chemin vide au centre
const PADDING = 1;           // Marge pour éviter les bords
const MIN_DISTANCE = 0.8;    // Distance minimale entre plantes
const MAX_ATTEMPTS = 1000;   // Nombre max d'essais pour placer

function isValidPosition(pos, others) {
  return others.every(other => {
    const dx = pos[0] - other[0];
    const dz = pos[2] - other[2];
    return Math.sqrt(dx * dx + dz * dz) >= MIN_DISTANCE;
  });
}

function generatePositions(count) {
  const positions = [];
  let attempts = 0;

  const halfWidth = GROUND_WIDTH / 2;

  const leftMinX = -halfWidth + PADDING;
  const leftMaxX = -PATH_WIDTH / 2 - PADDING;

  const rightMinX = PATH_WIDTH / 2 + PADDING;
  const rightMaxX = halfWidth - PADDING;

  const minZ = -GROUND_LENGTH; // car le sol est placé à z = -30
  const maxZ = 0;

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

  const allPlants = [
    ...palms.map(model => ({ model: model.scene, scale: 1 })),
    ...monsteras.map(model => ({ model: model.scene, scale: 0.8 })),
    ...ferns.map(model => ({ model: model.scene, scale: 0.6 })),
    ...bananas.map(model => ({ model: model.scene, scale: 0.9 })),
  ];

  const totalCount = 500;
  const positions = useMemo(() => generatePositions(totalCount), [totalCount]);

  return (
    <group>
      {positions.map((pos, i) => {
        const plant = allPlants[i % allPlants.length];
        return (
          <primitive
            key={i}
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


