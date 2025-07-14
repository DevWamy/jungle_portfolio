// import React from 'react';
// import { useGLTF } from '@react-three/drei';

// // Précharge le modèle pour optimiser le chargement
// useGLTF.preload('/assets/models/waterfall_wall.glb');

// function Waterfall() {
//   // Charge le modèle GLTF
//   const { scene } = useGLTF('/assets/models/waterfall_wall.glb');

//   // Position fixe, rotation et scale adaptés pour la cascade au bout du chemin
//  return (
//     <primitive
//       object={scene}
//       position={[0, -0.5, -60]}             // Au bout du chemin
//       rotation={[-Math.PI / 2, Math.PI, 0]}     // Met la cascade bien droite
//       scale={[3, 3, 3]}                  // Taille adaptée
//       castShadow
//       receiveShadow
//     />
//   );
// }

// export default Waterfall;

// import React from "react";
// import { useGLTF } from "@react-three/drei";

// function Waterfall(props) {
//   const { scene } = useGLTF("/assets/models/waikiki_fall.glb");
//   console.log('Cascade chargée:', scene);

//   return (
//     <primitive
//       object={scene}
//       position={[0, 1.5, -58]} // aligné au sol et au fond du chemin
//       rotation={[0, 0, 0]} // tourne le modèle pour montrer l'avant
//       scale={[1, 2, 1]}
//       {...props}
//     />
//   );
// }

// export default Waterfall;

// useGLTF.preload("/assets/models/waikiki_fall.glb");


// import { useEffect, useRef } from "react";
// import { useGLTF } from "@react-three/drei";
// import { BoxHelper } from "three";

// function Waterfall(props) {
//   const { scene } = useGLTF("/assets/models/waikiki_fall.glb");
//   const ref = useRef();

//   useEffect(() => {
//     if (ref.current) {
//       const box = new BoxHelper(ref.current, 0xff0000);
//       ref.current.add(box);
//     }
//   }, []);

//   return (
//     <primitive
//       ref={ref}
//       object={scene}
//       position={[0, 0, -58]}
//       rotation={[0, Math.PI, 0]}
//       scale={[1, 1.5, 1]}
//       {...props}
//       castShadow
//       receiveShadow
//     />
//   );
// }

// export default Waterfall;

// import React, { useRef, useEffect } from "react";
// import { useGLTF } from "@react-three/drei";
// import * as THREE from "three";

// function Waterfall(props) {
//   const { scene } = useGLTF("/assets/models/loop.glb");
//   const ref = useRef();

//   useEffect(() => {
//     if (ref.current) {
//       const boxHelper = new THREE.BoxHelper(ref.current, 0xff0000); // rouge
//       ref.current.add(boxHelper);
//     }
//   }, []);

//   return (
//     <primitive
//       ref={ref}
//       object={scene}
//       position={[0, 20, -58]}
//       rotation={[0, Math.PI, 0]}
//       scale={[0.3, 0.3, 0.3]}
//       {...props}
//       castShadow
//       receiveShadow
//     />
//   );
// }

// export default Waterfall;

// useGLTF.preload("/assets/models/loop.glb");

import React, { useRef, useEffect } from 'react';
import { useGLTF } from '@react-three/drei';
import { BoxHelper } from 'three';
import { useThree } from '@react-three/fiber';

function Waterfall() {
  const waterfallRef = useRef();
  const helperRef = useRef();
  const { scene: mainScene } = useThree();

  // Charge le modèle GLB
  const { scene } = useGLTF('/assets/models/waterLoop.glb')

  // Log pour vérifier que la cascade est bien chargée
  useEffect(() => {
   console.log('scene.children:', scene.children);
}, [scene]);

  // Ajout du BoxHelper pour visualiser la cascade
  useEffect(() => {
    const waterfall = waterfallRef.current;

    if (waterfall && !helperRef.current) {
      const helper = new BoxHelper(waterfall, 0x00ff00);
      mainScene.add(helper);
      helperRef.current = helper;

      return () => {
        if (helperRef.current) {
          mainScene.remove(helperRef.current);
          helperRef.current = null;
        }
      };
    }
  }, [mainScene]);

  return (
    <primitive
      ref={waterfallRef}
      object={scene}
      position={[0, 0, -30]} // ajuste ici pour le placer au bon endroit
      rotation={[0, 0, 0]}   // ajuste ici si le modèle est de travers
      scale={[1, 1, 1]}      // ajuste ici pour la taille
    />
  );
}

export default Waterfall;




