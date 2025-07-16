import React from 'react';
import Ground from './Ground';
import PlantsGroup from './PlantsGroup';

const GROUND_WIDTH = 20;
const GROUND_LENGTH = 60;

function JungleBackdrop() {
  // Patchs latéraux multiples pour couvrir sans trou (plus serrés)
  const sidePositions = [
    [-GROUND_WIDTH - 0, 0, -30],
    [-GROUND_WIDTH - 0, 0, 0],
    [-GROUND_WIDTH - 0, 0, 30],
    [GROUND_WIDTH + 0, 0, -30],
    [GROUND_WIDTH + 0, 0, 0],
    [GROUND_WIDTH + 0, 0, 30],
];

  // Patchs derrière
  const backPositions = [
    [0, 0, 60],
    [-GROUND_WIDTH, 0, 60],
    [GROUND_WIDTH, 0, 60],
  ];

  // Sol devant (quand on se retourne)
  const frontGroundPosition = [0, 0, -10];

  return (
    <group>
      {/* Latéraux avec plantes */}
      {sidePositions.map((pos, i) => (
        <group key={`side-${i}`} position={pos}>
          <Ground mode={`side-ground-${i}`} />
          <PlantsGroup />
        </group>
      ))}

      {/* Derrière avec plantes */}
      {backPositions.map((pos, i) => (
        <group key={`back-${i}`} position={pos}>
          <Ground mode={`back-ground-${i}`} />
          <PlantsGroup />
        </group>
      ))}

      {/* Devant, sol uniquement */}
      <group position={frontGroundPosition}>
        <Ground mode="front-ground" />
        <PlantsGroup />
      </group>
    </group>
  );
}

export default JungleBackdrop;


