// import React from 'react';
// import Ground from './Ground';
// import PlantsGroup from './PlantsGroup';

// const PATCH_WIDTH = 30;  // plus large que 20 pour chevaucher un peu
// const PATCH_LENGTH = 30;

// function JungleBackdrop() {
//   // Positions latérales, plus rapprochées, pour couvrir sans trou
//   const sidePositions = [
//     [-PATCH_WIDTH - 5, 0, -15],
//     [-PATCH_WIDTH - 5, 0, 15],
//     [PATCH_WIDTH + 5, 0, -15],
//     [PATCH_WIDTH + 5, 0, 15],
//   ];

//   // Positions derrière
//   const backPositions = [
//     [0, 0, 45],
//     [-PATCH_WIDTH, 0, 45],
//     [PATCH_WIDTH, 0, 45],
//   ];

//   // Sol devant (quand on se retourne)
//   const frontGroundPosition = [0, 0, -5];

//   return (
//     <group>
//       {/* Latéraux avec plantes */}
//       {sidePositions.map((pos, i) => (
//         <group key={`side-${i}`} position={pos}>
//           <Ground mode={`side-ground-${i}`} width={PATCH_WIDTH} length={PATCH_LENGTH} />
//           <PlantsGroup />
//         </group>
//       ))}

//       {/* Derrière avec plantes */}
//       {backPositions.map((pos, i) => (
//         <group key={`back-${i}`} position={pos}>
//           <Ground mode={`back-ground-${i}`} width={PATCH_WIDTH} length={PATCH_LENGTH} />
//           <PlantsGroup />
//         </group>
//       ))}

//       {/* Devant, sol uniquement */}
//       <group position={frontGroundPosition}>
//         <Ground mode="front-ground" width={PATCH_WIDTH * 2} length={PATCH_LENGTH} />
//       </group>
//     </group>
//   );
// }

// export default JungleBackdrop;

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

