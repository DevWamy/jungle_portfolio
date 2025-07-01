import { useThree, useFrame } from '@react-three/fiber';
import { useEffect, useRef } from 'react';
import { Color } from 'three';

const Background = ({ mode }) => {
  const { scene } = useThree();
  const targetColor = useRef(new Color());

  // Initialiser une fois le fond s'il est null
  useEffect(() => {
    if (!scene.background) {
      scene.background = new Color();
    }
  }, [scene]);

  // Met à jour la couleur cible selon le mode
  useEffect(() => {
    if (mode === 'day') {
      targetColor.current.setRGB(0.5, 0.7, 1); // bleu ciel
    } else {
      targetColor.current.setRGB(0.015, 0.015, 0.05); // presque noir bleu nuit
    }
  }, [mode]);

const lerpSpeed = mode === 'day' ? 0.005 : 0.02;

useFrame(() => {
  if (scene.background) {
    scene.background.lerp(targetColor.current, lerpSpeed);
  }
});

  return null;
};

export default Background;
