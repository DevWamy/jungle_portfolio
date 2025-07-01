import { useEffect, useRef } from 'react';
import { useThree, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

function Lights({ mode }) {
  const { scene } = useThree();
  const ambientRef = useRef();
  const dirRef = useRef();

  useEffect(() => {
    scene.environment = null;
  }, [mode, scene]);

  useFrame(() => {
    const targetAmbient = mode === 'day' ? 0.5 : 0.35;
    const targetDir = mode === 'day' ? 1.2 : 0.6;
    const targetColor = new THREE.Color(mode === 'day' ? 'white' : '#7788aa');

    ambientRef.current.intensity = THREE.MathUtils.lerp(
      ambientRef.current.intensity,
      targetAmbient,
      0.01
    );
    dirRef.current.intensity = THREE.MathUtils.lerp(
      dirRef.current.intensity,
      targetDir,
      0.01
    );
    dirRef.current.color.lerp(targetColor, 0.01);
  });

  return (
    <>
      <ambientLight ref={ambientRef} intensity={0.5} />
      <directionalLight
        ref={dirRef}
        intensity={1.2}
        color={'white'}
        position={[10, 10, 5]}
        castShadow
      />
      
      {/* 🌙 Ajout de la lumière "lune" uniquement la nuit */}
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
