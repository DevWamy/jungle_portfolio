import { useTexture } from '@react-three/drei';
import { useRef } from 'react';
import { RepeatWrapping } from 'three';

const WIDTH = 20;     // Largeur du chemin
const LENGTH = 60;   // Longueur du chemin

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
    texture.repeat.set(WIDTH /2, LENGTH /2); // Répétition selon les nouvelles dimensions
  });

  return (
    <mesh
      ref={ref}
      rotation-x={-Math.PI / 2}
      position={[0, 0, -LENGTH / 2]} // pour centrer la plane autour de z=0
      key={mode}
      onUpdate={(self) =>
        self.geometry.setAttribute('uv2', self.geometry.attributes.uv)
      }
      receiveShadow
    >
      <planeGeometry args={[WIDTH, LENGTH, 40, 120]} />
      <meshStandardMaterial
        map={color}
        normalMap={normal}
        roughnessMap={roughness}
        aoMap={ao}
        displacementMap={displacement}
        displacementScale={0.25}
      />
    </mesh>
  );
}

export default Ground;
