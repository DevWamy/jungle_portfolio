import { useTexture } from '@react-three/drei';
import { useRef } from 'react';
import { RepeatWrapping } from 'three';

function Ground ({ mode }) {
  const ref = useRef();

  const [color, normal, roughness, ao, displacement] = useTexture([
    '/src/assets/textures/ground/color.png',
    '/src/assets/textures/ground/normalGL.png',
    '/src/assets/textures/ground/roughness.png',
    '/src/assets/textures/ground/ambientOcclusion.png',
    '/src/assets/textures/ground/displacement.png',
  ]);

  [color, normal, roughness, ao, displacement].forEach((texture) => {
    texture.wrapS = texture.wrapT = RepeatWrapping;
    texture.repeat.set(20, 20);
  });

  return (
    <mesh
      ref={ref}
      rotation-x={-Math.PI / 2}
      position={[0, 0, 0]}
      key={mode} 
      onUpdate={self => self.geometry.setAttribute('uv2', self.geometry.attributes.uv)}
      receiveShadow
    >
      <planeGeometry args={[50, 50, 128, 128]} />
      <meshStandardMaterial
        map={color}
        normalMap={normal}
        roughnessMap={roughness}
        aoMap={ao}
        displacementMap={displacement}
        displacementScale={0.3}  // Un peu plus de relief mais pas trop
      />
    </mesh>
  );
}

export default Ground;
