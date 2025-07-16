import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import Rocks from './Rocks';

const vertexShader = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0);
  }
`;

const fragmentShader = `
  precision mediump float;
varying vec2 vUv;
uniform float uTime;

float random(vec2 p) {
  return fract(sin(dot(p, vec2(12.9898,78.233))) * 43758.5453123);
}

float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  float a = random(i);
  float b = random(i + vec2(1.0, 0.0));
  float c = random(i + vec2(0.0, 1.0));
  float d = random(i + vec2(1.0, 1.0));
  vec2 u = f*f*(3.0-2.0*f);
  return mix(mix(a, b, u.x), mix(c, d, u.x), u.y);
}

void main() {
  vec2 uv = vUv;

  // Flow vertical uniquement (cascade)
  uv.y += uTime * 0.5;

  // Bruits à différentes échelles
  float n1 = noise(uv * 10.0);
  float n2 = noise(uv * 20.0 + vec2(5.0, 0.0));
  float n3 = noise(uv * 30.0 + vec2(-5.0, 10.0));

  float combined = (n1 + n2 + n3) / 3.0;

  // Couleur d’eau légèrement ondulante
  vec3 waterColor = vec3(0.2, 0.5, 0.95) * (0.8 + 0.4 * combined);

  // Opacité avec bords plus transparents
  float baseAlpha = 0.65 + 0.3 * combined;
  float edgeFade = smoothstep(0.0, 0.4, 0.5 - abs(vUv.x - 0.5));
  float alpha = baseAlpha * edgeFade;

  gl_FragColor = vec4(waterColor, alpha);
}

`;

function AnimatedWaterfall() {

  const matRef = useRef();

  // ✅ Bonnes pratiques pour les uniforms
  const uniforms = useMemo(() => ({
    uTime: { value: 0 }
  }), []);

  useFrame(({ clock }) => {
    if (matRef.current) {
      matRef.current.uniforms.uTime.value = clock.getElapsedTime();
    }
  });

  return (
    <group position={[0, 10, -65]}>
      {/* Fond du mur */}
      <mesh position={[0, 0, -0.02]}>
        <planeGeometry args={[11, 20]} />
        <meshBasicMaterial color="#2a82f0" />
      </mesh>

      {/* Cascade animée */}
      <mesh position={[0, 0, 0.01]} renderOrder={10}>
        <planeGeometry args={[11, 20]} />
        <shaderMaterial
          ref={matRef}
          vertexShader={vertexShader}
          fragmentShader={fragmentShader}
          transparent
          side={THREE.DoubleSide}
          depthWrite={false}
          depthTest={true}
          blending={THREE.NormalBlending}
          uniforms={uniforms} // ✅ passé depuis useMemo
        />
      </mesh>

       {/* Rochers en bas de la cascade */}
      <Rocks position={[0, -12.8, 0.1]} scale={0.015} />

    </group>
  );
}

export default AnimatedWaterfall;