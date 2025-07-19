import React, { useMemo } from 'react';
import { useGLTF } from '@react-three/drei';
import * as THREE from 'three';

const GROUND_WIDTH = 20;
const GROUND_LENGTH = 55;
const PATH_WIDTH = 7;
const PADDING = 1;
const MIN_DISTANCE = 0.6;
const MAX_ATTEMPTS = 10000;

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
  const minZ = -GROUND_LENGTH;
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

// 🎨 Couleurs jungle douces
const emissiveColors = {
   monstera: '#88CCFF', // bleu ciel doux
  palm: '#FFE577',     // jaune pastel lumineux
  fern: '#FF6BB5',     // rose fuschia
  banana: '#A5FF99',   // vert menthe clair
};

const links = {
  monstera: 'https://boat-particles.vercel.app/',
  palm: 'https://sliced-gear.vercel.app/',
  fern: 'https://wobbly-sphere-lilac.vercel.app/',
  banana: 'https://animated-galaxy-roan.vercel.app/',
};

function PlantsGroup() {
  const palms = [
    useGLTF('/assets/models/plants/palms/palm.glb'),
    useGLTF('/assets/models/plants/palms/palm_2.glb'),
    useGLTF('/assets/models/plants/palms/palm_3.glb'),
  ];
  const monsteras = [
    useGLTF('/assets/models/plants/monsteras/monstera.glb'),
    useGLTF('/assets/models/plants/monsteras/monstera_2.glb'),
    useGLTF('/assets/models/plants/monsteras/monstera_3.glb'),
    useGLTF('/assets/models/plants/monsteras/monstera_4.glb'),
  ];
  const ferns = [
    useGLTF('/assets/models/plants/ferns/fern.glb'),
    useGLTF('/assets/models/plants/ferns/fern_2.glb'),
    useGLTF('/assets/models/plants/ferns/fern_3.glb'),
    useGLTF('/assets/models/plants/ferns/fern_4.glb'),
    useGLTF('/assets/models/plants/ferns/fern_5.glb'),
    useGLTF('/assets/models/plants/ferns/fern_6.glb'),
  ];
  const bananas = [
    useGLTF('/assets/models/plants/bananas/banana.glb'),
    useGLTF('/assets/models/plants/bananas/banana_2.glb'),
  ];

  const allPlants = [
    ...palms.map(model => ({ model: model.scene.clone(), scale: 1, type: 'palm' })),
    ...monsteras.map(model => ({ model: model.scene.clone(), scale: 0.8, type: 'monstera' })),
    ...ferns.map(model => ({ model: model.scene.clone(), scale: 0.6, type: 'fern' })),
    ...bananas.map(model => ({ model: model.scene.clone(), scale: 0.9, type: 'banana' })),
  ];

  const totalCount = 800;
  const positions = useMemo(() => generatePositions(totalCount), []);
  const sizes = useMemo(() => Array.from({ length: totalCount }, () => 0.7 + Math.random() * 0.6), []);

  return (
    <group>
      {positions.map((pos, i) => {
        const { model, scale, type } = allPlants[i % allPlants.length];
        const finalScale = scale * sizes[i];
        const clone = model.clone(true);

        return (
          <group
            key={i}
            position={pos}
            scale={[finalScale, finalScale, finalScale]}
            onPointerOver={(e) => {
              e.stopPropagation();
              e.object.material?.emissive?.set(emissiveColors[type]);
              document.body.style.cursor = 'pointer';
            }}
            onPointerOut={(e) => {
              e.stopPropagation();
              e.object.material?.emissive?.set('#000000');
              document.body.style.cursor = 'default';
            }}
            onClick={(e) => {
              e.stopPropagation();
              const link = links[type];
              if (link) window.open(link, '_blank');
            }}
          >
            <primitive object={clone} castShadow receiveShadow />
          </group>
        );
      })}
    </group>
  );
}

export default PlantsGroup;
