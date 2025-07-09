import { useThree, useFrame } from '@react-three/fiber';
import { useEffect, useRef } from 'react';
import { Color } from 'three';

const Background = ({ mode, previousMode }) => {
  const { scene } = useThree(); // Récupère la scène actuelle via le hook de R3F
  const targetColor = useRef(new Color()); // Couleur de fond cible pour interpolation

  // Initialisation du fond de la scène à la première création
  useEffect(() => {
    if (!scene.background) {
      scene.background = new Color(); // Initialise un fond si aucun n'existe
      if (mode === 'day') {
        scene.background.setRGB(0.5, 0.7, 1); // Bleu ciel pour le jour
      } else {
        scene.background.setRGB(0.015, 0.015, 0.05); // Bleu nuit très sombre
      }
    }
  }, [scene, mode]);

  // Met à jour la couleur cible lorsque le mode change
  useEffect(() => {
    if (mode === 'day') {
      targetColor.current.setRGB(0.5, 0.7, 1); // Couleur jour
    } else {
      targetColor.current.setRGB(0.015, 0.015, 0.05); // Couleur nuit
    }
  }, [mode]);

  // Vitesse d’interpolation en fonction du changement de mode
  const lerpSpeed = mode === 'day' && previousMode === 'night'
    ? 0.0075   // Transition douce nuit -> jour
    : mode === 'night' && previousMode === 'day'
    ? 0.14     // Transition plus rapide jour -> nuit
    : 0.003;   // Par défaut, interpolation très lente (stabilisation)

  // Interpolation frame par frame de la couleur de fond vers la couleur cible
  useFrame(() => {
    if (scene.background) {
      scene.background.lerp(targetColor.current, lerpSpeed);
    }
  });

  return null; // Aucun élément visuel à rendre, tout se passe dans la scène
};

export default Background;
