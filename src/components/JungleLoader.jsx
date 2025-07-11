import { useProgress } from '@react-three/drei';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import React from 'react';

export default function JungleLoader() {
  const { progress } = useProgress(); // Progression de chargement des assets
  const motionProgress = useMotionValue(0); // Valeur animée brute
  const smoothProgress = useSpring(motionProgress, { stiffness: 100, damping: 20 }); // Animation avec effet ressort pour lisser
  const maxProgress = React.useRef(0); //Empêche le recul visuel

  // Met à jour la valeur animée à chaque changement de progression réelle
  React.useEffect(() => {
    // motionProgress.set(progress);
    if (progress > maxProgress.current) {
    maxProgress.current = progress;
    motionProgress.set(progress);
  } // Empêche le recul visuel
  }, [progress, motionProgress]);

  // Conversion de la progression en pourcentage animé pour la largeur de la barre
  const width = useTransform(smoothProgress, p => `${Math.min(p, 100)}%`);
  // Affichage textuel du pourcentage
  const displayedProgress = useTransform(smoothProgress, p => Math.floor(Math.min(p, 100)));

  return (
    <div className="fixed inset-0 bg-[#0c1a0d] z-50 flex flex-col items-center justify-center text-green-100 select-none">
      {/* Masque tribal stylisé avec une rotation animée infinie */}
      <motion.div
        className="mb-8 text-green-400 drop-shadow-[0_0_10px_rgba(72,187,120,0.9)]"
        animate={{ rotate: [0, 10, 0, -10, 0] }}
        transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
        aria-hidden="true"
      >
        {/* SVG d’un masque stylisé pour l’ambiance jungle */}
        <svg
          width="100"
          height="120"
          viewBox="0 0 64 80"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M32 2 L54 20 L54 60 L32 78 L10 60 L10 20 Z" />
          <circle cx="22" cy="35" r="5" />
          <circle cx="42" cy="35" r="5" />
          <path d="M32 40 L32 55" />
          <line x1="32" y1="2" x2="32" y2="78" />
          <line x1="10" y1="20" x2="22" y2="35" />
          <line x1="54" y1="20" x2="42" y2="35" />
          <line x1="10" y1="60" x2="22" y2="45" />
          <line x1="54" y1="60" x2="42" y2="45" />
        </svg>
      </motion.div>

      {/* Texte de chargement avec pourcentage animé */}
      <motion.div
        className="text-xl font-mono mb-4 text-green-200"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
      >
        🌿 Chargement de la jungle...{' '}
        <motion.span>{displayedProgress}</motion.span>%
      </motion.div>

      {/* Barre de progression visuelle */}
      <div className="w-2/3 h-2 bg-green-900 rounded-full overflow-hidden">
        <motion.div
          className="h-full bg-gradient-to-r from-green-500 to-lime-300"
          style={{ width }} // largeur animée selon la progression
          initial={{ width: '0%' }}
        />
      </div>

      {/* Message pour prévenir l’utilisateur mobile */}
      <motion.div
        className="mt-6 text-sm text-green-400 font-mono select-text"
        initial={{ opacity: 0, y: 5 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.5 }}
      >
        Version mobile en cours de développement
      </motion.div>
    </div>
  );
}
