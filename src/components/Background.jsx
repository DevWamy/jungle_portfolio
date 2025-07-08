import { useThree, useFrame } from '@react-three/fiber';
import { useEffect, useRef } from 'react';
import { Color } from 'three';

const Background = ({ mode, previousMode }) => {
  const { scene } = useThree();
  const targetColor = useRef(new Color());

  useEffect(() => {
    if (!scene.background) {
      scene.background = new Color();
      // Au tout premier chargement, on peut initialiser au mode actuel
      if (mode === 'day') {
        scene.background.setRGB(0.5, 0.7, 1);
      } else {
        scene.background.setRGB(0.015, 0.015, 0.05);
      }
    }
  }, [scene, mode]);

  useEffect(() => {
    if (mode === 'day') {
      targetColor.current.setRGB(0.5, 0.7, 1);
    } else {
      targetColor.current.setRGB(0.015, 0.015, 0.05);
    }
  }, [mode]);

  const lerpSpeed = mode === 'day' && previousMode === 'night' 
    ? 0.008
    : mode === 'night' && previousMode === 'day'
    ? 0.18
    : 0.01;

  useFrame(() => {
    if (scene.background) {
      scene.background.lerp(targetColor.current, lerpSpeed);
    }
  });

  return null;
};

export default Background;

