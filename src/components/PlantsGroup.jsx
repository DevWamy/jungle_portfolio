import React, { useMemo } from 'react';
import { useGLTF } from '@react-three/drei';

const AREA_SIZE = 5;
const MIN_DISTANCE = 0.5;
const MAX_ATTEMPTS = 300;

function randomPosition() {
  const half = AREA_SIZE / 2;
  return [
    Math.random() * AREA_SIZE - half,
    0,
    Math.random() * AREA_SIZE - half,
  ];
}

function isValidPosition(pos, others) {
  return others.every(other => {
    const dx = pos[0] - other[0];
    const dz = pos[2] - other[2];
    return Math.sqrt(dx * dx + dz * dz) >= MIN_DISTANCE;
  });
}

function generatePositions(count, existing = []) {
  const positions = [];
  let attempts = 0;
  while (positions.length < count && attempts < MAX_ATTEMPTS) {
    const pos = randomPosition();
    if (isValidPosition(pos, [...positions, ...existing])) {
      positions.push(pos);
    }
    attempts++;
  }
  return positions;
}

export default function PlantsGroup() {
  // Chargement 1 par 1
  const palm1 = useGLTF('assets/models/plants/palms/palm.glb');
  const palm2 = useGLTF('assets/models/plants/palms/palm_2.glb');
  const palm3 = useGLTF('assets/models/plants/palms/palm_3.glb');

  const monstera1 = useGLTF('assets/models/plants/monsteras/monstera.glb');
  const monstera2 = useGLTF('assets/models/plants/monsteras/monstera_2.glb');
  const monstera3 = useGLTF('assets/models/plants/monsteras/monstera_3.glb');
  const monstera4 = useGLTF('assets/models/plants/monsteras/monstera_4.glb');

  const fern1 = useGLTF('assets/models/plants/ferns/fern.glb');
  const fern2 = useGLTF('assets/models/plants/ferns/fern_2.glb');
  const fern3 = useGLTF('assets/models/plants/ferns/fern_3.glb');
  const fern4 = useGLTF('assets/models/plants/ferns/fern_4.glb');
  const fern5 = useGLTF('assets/models/plants/ferns/fern_5.glb');
  const fern6 = useGLTF('assets/models/plants/ferns/fern_6.glb');

  const banana1 = useGLTF('assets/models/plants/bananas/banana.glb');
  const banana2 = useGLTF('assets/models/plants/bananas/banana_2.glb');

  const plantsInstances = useMemo(() => {
    const config = [
      { scene: palm1.scene, count: 6, scale: 0.5 },
      { scene: palm2.scene, count: 6, scale: 0.5 },
      { scene: palm3.scene, count: 6, scale: 0.5 },

      { scene: monstera1.scene, count: 8, scale: 0.4 },
      { scene: monstera2.scene, count: 8, scale: 0.4 },
      { scene: monstera3.scene, count: 8, scale: 0.4 },
      { scene: monstera4.scene, count: 8, scale: 0.4 },

      { scene: fern1.scene, count: 10, scale: 0.3 },
      { scene: fern2.scene, count: 10, scale: 0.3 },
      { scene: fern3.scene, count: 10, scale: 0.3 },
      { scene: fern4.scene, count: 10, scale: 0.3 },
      { scene: fern5.scene, count: 10, scale: 0.3 },
      { scene: fern6.scene, count: 10, scale: 0.3 },

      { scene: banana1.scene, count: 5, scale: 0.45 },
      { scene: banana2.scene, count: 5, scale: 0.45 },
    ];

    const instances = [];
    let allPositions = [];

    config.forEach(({ scene, count, scale }, i) => {
      const positions = generatePositions(count, allPositions);
      allPositions = [...allPositions, ...positions];
      positions.forEach((pos, j) => {
        instances.push({
          key: `plant-${i}-${j}`,
          model: scene.clone(),
          position: pos,
          scale,
          rotationY: Math.random() * Math.PI * 2,
        });
      });
    });

    return instances;
  }, [
    palm1, palm2, palm3,
    monstera1, monstera2, monstera3, monstera4,
    fern1, fern2, fern3, fern4, fern5, fern6,
    banana1, banana2,
  ]);

  return (
    <group>
      {plantsInstances.map(({ key, model, position, scale, rotationY }) => (
        <primitive
          key={key}
          object={model}
          position={position}
          scale={[scale, scale, scale]}
          rotation={[0, rotationY, 0]}
          castShadow
          receiveShadow
        />
      ))}
    </group>
  );
}
