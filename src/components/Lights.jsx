import { useEffect, useRef, useState } from 'react';
import { useThree, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

function Lights({ mode, previousMode }) {
  const { scene } = useThree();
  const ambientRef = useRef();
  const dirRef = useRef();

  // Couleurs de la brume nuit et jour
  const fogNightColor = useRef(new THREE.Color('#0e1e2e'));
  const fogDayColor = useRef(new THREE.Color(0.5, 0.7, 1));

  const fogProgress = useRef(0);
  const timer = useRef(0);
  const [bgDayProgress, setBgDayProgress] = useState(0);

  useEffect(() => {
    scene.environment = null;

    if (mode === 'day') {
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
  }, [mode, scene, fogDayColor, fogNightColor]);

  useFrame((state, delta) => {
    timer.current += delta;

    if (mode === 'day') {
      if (previousMode === 'night') {
        if (fogProgress.current < 1) {
          fogProgress.current = Math.min(fogProgress.current + delta * 0.1, 1); 
        }
        if (scene.fog) {
          scene.fog.color.lerpColors(fogNightColor.current, fogDayColor.current, fogProgress.current);
        }
      } else {
        if (scene.fog) {
          scene.fog.color.copy(fogDayColor.current);
        }
      }
      if (bgDayProgress < 1) {
        setBgDayProgress((prev) => Math.min(prev + delta * 0.1, 1));
      }
    } else {
      if (timer.current > 1.5 && fogProgress.current < 1) {
        fogProgress.current = Math.min(fogProgress.current + delta * 0.1, 1); 
      }
      if (scene.fog) {
        scene.fog.color.lerpColors(new THREE.Color(0x000000), fogNightColor.current, fogProgress.current);
      }
    }

    // Mise à jour des lumières (intensité et couleur)
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

