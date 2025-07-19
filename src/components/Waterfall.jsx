import React from 'react';
import { useTexture } from '@react-three/drei';
import { RepeatWrapping } from 'three';
import AnimatedWaterfall from './AnimatedWaterfall'; 

function Waterfall({ onClick }) {
  const texture = useTexture('/assets/textures/wall/rock_wall.jpg');
  texture.wrapS = texture.wrapT = RepeatWrapping;
  texture.repeat.set(20, 2);

  return (
    <group>
      {/* Le mur de roche */}
      <mesh position={[0, 10, -65]} onClick={onClick} receiveShadow>
        <planeGeometry args={[200, 20]} />
        <meshStandardMaterial map={texture} side={2} />
      </mesh>

      {/* La cascade */}
      <AnimatedWaterfall />
    </group>
  );
}

export default Waterfall;

