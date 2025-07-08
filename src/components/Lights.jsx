// import { useEffect, useRef, useState } from 'react';
// import { useThree, useFrame } from '@react-three/fiber';
// import * as THREE from 'three';

// function Lights({ mode }) {
//   const { scene } = useThree();
//   const ambientRef = useRef();
//   const dirRef = useRef();
//   const fogColor = useRef(new THREE.Color());
//   const fogProgress = useRef(0);
//   const timer = useRef(0);
//   const [bgDayProgress, setBgDayProgress] = useState(0); // pour background

//   useEffect(() => {
//     scene.environment = null;

//     if (mode === 'day') {
//       fogColor.current.setRGB(0.5, 0.7, 1);
//       scene.fog = new THREE.Fog(fogColor.current, 15, 70);
//       fogProgress.current = 0;
//       scene.fog.color.setRGB(0, 0, 0);
//       timer.current = 0;
//       setBgDayProgress(0);
//     } else {
//       fogColor.current.set('#0e1e2e');
//       scene.fog = new THREE.Fog(fogColor.current, 10, 50);
//       fogProgress.current = 1;
//       scene.fog.color.copy(fogColor.current);
//       timer.current = 0;
//       setBgDayProgress(1);
//     }

//     return () => {
//       scene.fog = null;
//     };
//   }, [mode, scene]);

//   useFrame((state, delta) => {
//     if (mode === 'day') {
//       timer.current += delta;

//       // On commence la montée de brume après un délai court
//       if (timer.current > 0.3 && fogProgress.current < 1) {
//         // Progression plus douce, vitesse réduite pour éviter coup brutal
//         fogProgress.current = Math.min(fogProgress.current + delta * 0.3, 1);
//       }
//       scene.fog.color.lerpColors(new THREE.Color(0x000000), fogColor.current, fogProgress.current);

//       // Accélérer background jour (exemple simple, à utiliser pour changer la couleur/ambiance du bg)
//       if (bgDayProgress < 1) {
//         setBgDayProgress((prev) => Math.min(prev + delta * 0.8, 1));
//       }
//     }

//     // Lumière ambiante et directionnelle
//     const targetAmbient = mode === 'day' ? 0.5 : 0.35;
//     const targetDir = mode === 'day' ? 1.0 : 0.6;
//     const targetColor = new THREE.Color(mode === 'day' ? 'white' : '#7788aa');

//     const lerpSpeed = 0.1;

//     ambientRef.current.intensity = THREE.MathUtils.lerp(
//       ambientRef.current.intensity,
//       targetAmbient,
//       lerpSpeed
//     );
//     dirRef.current.intensity = THREE.MathUtils.lerp(
//       dirRef.current.intensity,
//       targetDir,
//       lerpSpeed
//     );
//     dirRef.current.color.lerp(targetColor, lerpSpeed);
//   });

//   // Tu peux utiliser bgDayProgress dans ton Background pour modifier les couleurs selon cette progression

//   return (
//     <>
//       <ambientLight ref={ambientRef} intensity={0.5} />
//       <directionalLight
//         ref={dirRef}
//         intensity={1.0}
//         color={'white'}
//         position={[10, 10, 5]}
//         castShadow
//       />
//       {mode === 'night' && (
//         <pointLight
//           color="#88aaff"
//           intensity={0.3}
//           position={[5, 10, 5]}
//           distance={30}
//         />
//       )}
//     </>
//   );
// }

// export default Lights;

import { useEffect, useRef, useState } from 'react';
import { useThree, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

function Lights({ mode, previousMode }) {
  const { scene } = useThree();
  const ambientRef = useRef();
  const dirRef = useRef();
  const fogNightColor = useRef(new THREE.Color('#0e1e2e'));
  const fogDayColor = useRef(new THREE.Color(0.5, 0.7, 1));
  const fogProgress = useRef(0);
  const timer = useRef(0);
  const [bgDayProgress, setBgDayProgress] = useState(0);

  useEffect(() => {
    scene.environment = null;

    // Initial fog color and fog setup
    if (mode === 'day') {
      // au début du jour, fog color noire (brume invisible)
      fogProgress.current = 0;
      scene.fog = new THREE.Fog(fogNightColor.current.clone(), 15, 70);
      scene.fog.color.set(fogNightColor.current);
      timer.current = 0;
      setBgDayProgress(0);
    } else {
      fogProgress.current = 1;
      scene.fog = new THREE.Fog(fogNightColor.current.clone(), 10, 50);
      scene.fog.color.set(fogNightColor.current);
      timer.current = 0;
      setBgDayProgress(1);
    }

    return () => {
      scene.fog = null;
    };
  }, [mode, scene]);

  useFrame((state, delta) => {
    timer.current += delta;

    if (mode === 'day') {
      // Pendant le passage nuit->jour on fait une interpolation entre fogNightColor et fogDayColor
      if (previousMode === 'night') {
        if (fogProgress.current < 1) {
          fogProgress.current = Math.min(fogProgress.current + delta * 0.3, 1);
        }
        // fog color passe de nuit à jour progressivement
        scene.fog.color.lerpColors(fogNightColor.current, fogDayColor.current, fogProgress.current);
      } else {
        // journée classique, brume jour stable
        scene.fog.color.copy(fogDayColor.current);
      }

      if (bgDayProgress < 1) {
        setBgDayProgress((prev) => Math.min(prev + delta * 0.8, 1));
      }
    } else {
      // mode nuit, brume nuit apparait après délai
      if (timer.current > 2 && fogProgress.current < 1) {
        fogProgress.current = Math.min(fogProgress.current + delta * 0.5, 1);
      }
      scene.fog.color.lerpColors(new THREE.Color(0x000000), fogNightColor.current, fogProgress.current);
    }

    // Lumières
    const targetAmbient = mode === 'day' ? 0.5 : 0.35;
    const targetDir = mode === 'day' ? 1.0 : 0.6;
    const targetColor = new THREE.Color(mode === 'day' ? 'white' : '#7788aa');

    const lerpSpeed = 0.1;

    ambientRef.current.intensity = THREE.MathUtils.lerp(
      ambientRef.current.intensity,
      targetAmbient,
      lerpSpeed
    );
    dirRef.current.intensity = THREE.MathUtils.lerp(
      dirRef.current.intensity,
      targetDir,
      lerpSpeed
    );
    dirRef.current.color.lerp(targetColor, lerpSpeed);
  });

  return (
    <>
      <ambientLight ref={ambientRef} intensity={0.5} />
      <directionalLight
        ref={dirRef}
        intensity={1.0}
        color={'white'}
        position={[10, 10, 5]}
        castShadow
      />
      {mode === 'night' && (
        <pointLight
          color="#88aaff"
          intensity={0.3}
          position={[5, 10, 5]}
          distance={30}
        />
      )}
    </>
  );
}

export default Lights;

