import { useTexture } from '@react-three/drei';
import { useRef } from 'react';
import { RepeatWrapping } from 'three';

// import colorMap from '/assets/textures/ground/color.png';
// import normalMap from '/assets/textures/ground/normalGL.png';
// import roughnessMap from '/assets/textures/ground/roughness.png';
// import aoMap from '/assets/textures/ground/ambientOcclusion.png';
// import displacementMap from '/assets/textures/ground/displacement.png';

const WIDTH = 20;
const LENGTH = 60;

function Ground({ mode }) {
  const ref = useRef();

  const [color, normal, roughness, ao, displacement] = useTexture([
    // colorMap,
    // normalMap,
    // roughnessMap,
    // aoMap,
    // displacementMap,
  '/assets/textures/ground/color.png',
  '/assets/textures/ground/normalGL.png',
  '/assets/textures/ground/roughness.png',
  '/assets/textures/ground/ambientOcclusion.png',
  '/assets/textures/ground/displacement.png',
  ]);

  [color, normal, roughness, ao, displacement].forEach((texture) => {
    texture.wrapS = texture.wrapT = RepeatWrapping;
    texture.repeat.set(WIDTH / 2, LENGTH / 2);
  });

  return (
    <mesh
      ref={ref}
      rotation-x={-Math.PI / 2}
      position={[0, 0, -LENGTH / 2]}
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
