import { useTexture } from '@react-three/drei';
import { useRef } from 'react';
import { RepeatWrapping } from 'three';

const AREA_SIZE = 10; // Taille cohérente avec la scène principale

function Ground({ mode }) {
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
    texture.repeat.set(AREA_SIZE, AREA_SIZE); // Ajusté pour la taille réduite
  });

  return (
    <mesh
      ref={ref}
      rotation-x={-Math.PI / 2}
      position={[0, 0, 0]}
      key={mode}
      onUpdate={(self) =>
        self.geometry.setAttribute('uv2', self.geometry.attributes.uv)
      }
      receiveShadow
    >
      <planeGeometry args={[AREA_SIZE, AREA_SIZE]} />
      <meshStandardMaterial
        map={color}
        normalMap={normal}
        roughnessMap={roughness}
        aoMap={ao}
        displacementMap={displacement}
        displacementScale={0.3}
      />
    </mesh>
  );
}

export default Ground;
