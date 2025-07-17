import React, { useRef } from 'react';
import { useGLTF } from '@react-three/drei';

function Rocks({ position = [1.5, -10.5, 0], scale = 0.02 }) {
  const { scene } = useGLTF('/assets/models/rocks.glb');
  const groupRef = useRef();

  return (
    <group ref={groupRef} position={position} scale={scale} rotation={[0, Math.PI, 0]}>
      <primitive object={scene} />
    </group>
  );
}

export default Rocks;
