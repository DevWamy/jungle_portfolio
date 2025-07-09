import React, { useState, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Preload, useProgress } from '@react-three/drei';
import { EffectComposer, Bloom } from '@react-three/postprocessing';
import JungleLoader from './components/JungleLoader';
import PlayController from './components/PlayController';
import Ground from './components/Ground';
import Lights from './components/Lights';
import Background from './components/Background';
import Fireflies from './components/Fireflies';
import PlantsGroup from './components/PlantsGroup';
import { motion } from 'framer-motion';
import { FaSun, FaMoon } from 'react-icons/fa';
import './index.css';

function App() {
  // État pour gérer le mode actuel (jour ou nuit)
  const [mode, setMode] = useState('day');
  // État pour conserver le mode précédent (utile pour certaines transitions)
  const [previousMode, setPreviousMode] = useState('day');
  // Timestamp du dernier changement de mode (pour futures animations/sons par exemple)
  const [modeChangeTime, setModeChangeTime] = useState(Date.now());

  // État pour savoir si la scène est en cours de chargement
  const [loading, setLoading] = useState(true);
  // Hook fourni par drei pour avoir la progression du chargement et son état actif
  const { progress, active } = useProgress();

  // État pour afficher ou non les lucioles (apparition progressive en fonction du mode)
  const [showFireflies, setShowFireflies] = useState(mode === 'night');

  // Quand le chargement est fini (progress = 100 et actif = false), on enlève le loader avec un petit délai
  useEffect(() => {
    if (!active && progress === 100) {
      setTimeout(() => setLoading(false), 500);
    }
  }, [active, progress]);

  // Gère l'affichage progressif des lucioles quand on passe en mode nuit
  useEffect(() => {
    if (mode === 'night') {
      // Apparition retardée des lucioles pour effet plus naturel
      const delay = setTimeout(() => {
        setShowFireflies(true);
      }, 500);
      // Nettoyage du timeout si le composant est démonté ou mode change avant la fin du délai
      return () => clearTimeout(delay);
    } else {
      // En mode jour, on cache les lucioles immédiatement
      setShowFireflies(false);
    }
  }, [mode]);

  return (
    // Conteneur principal avec classe qui applique le mode sombre selon la valeur de `mode`
    <div className={`w-screen h-screen overflow-hidden relative ${mode === 'night' ? 'dark' : ''}`}>
      
      {/* Bouton pour basculer entre jour et nuit */}
      <motion.button
        onClick={() => {
          const newMode = mode === 'day' ? 'night' : 'day'; // Calcul du nouveau mode
          setPreviousMode(mode);                            // Mise à jour du mode précédent
          setMode(newMode);                                // Mise à jour du mode actuel
          setModeChangeTime(Date.now());                   // Enregistre le moment du changement
        }}
        className={`
          absolute top-4 left-4 z-20 
          w-10 h-10 
          rounded-full 
          flex items-center justify-center 
          backdrop-blur-sm 
          bg-white/30 
          text-gray-900 
          transition-all duration-300
          ${mode === 'day' ? 'text-yellow-600 shadow-md' : 'text-blue-200 shadow-[0_0_10px_3px_rgba(147,197,253,0.6)] animate-pulseGlow'}
        `}
        animate={{ rotate: mode === 'day' ? 0 : 180 }}         // Animation de rotation du bouton
        transition={{ duration: 0.6, ease: 'easeInOut' }}       // Paramètres de transition
        aria-label="Toggle mode"
        style={{ pointerEvents: 'auto' }}
      >
        {/* Icône soleil ou lune selon le mode */}
        {mode === 'day' ? <FaSun size={18} /> : <FaMoon size={18} />}
      </motion.button>

      {/* Zone cliquable invisible sous le canvas (utile pour futures interactions) */}
      <div id="click-zone" className="absolute inset-0 z-0"></div>

      {/* Affiche le loader tant que la scène charge */}
      {loading && <JungleLoader progress={progress} />}

      {/* Canvas principal pour le rendu 3D */}
      <Canvas
        className="absolute top-0 left-0 w-full h-full"
        camera={{ position: [0, 5, 20], fov: 60 }}  // Position et champ de vue caméra
        gl={{ antialias: true }}                      // Anticrénelage activé
      >
        {/* Contrôles orbitaux pour naviguer dans la scène 3D */}
        <OrbitControls
          enablePan={false}                           // Pas de déplacement latéral
          maxPolarAngle={Math.PI / 2.4}               // Limite la rotation verticale
          minDistance={10}                            // Distance minimale caméra
          maxDistance={35}                            // Distance maximale caméra
          target={[0, 0, 0]}                          // Point visé
        />

        {/* Composants 3D qui dépendent du mode */}
        <Background mode={mode} previousMode={previousMode} />
        <Lights mode={mode} previousMode={previousMode} />
        <Ground mode={mode} />
        {/* Affiche les lucioles seulement si showFireflies est vrai */}
        {showFireflies && <Fireflies mode={mode} />}
        <PlantsGroup side="both" />

        {/* Effets postprocessing (ex: bloom pour lueur douce) */}
        <EffectComposer>
          <Bloom
            luminanceThreshold={0.1}
            luminanceSmoothing={0.9}
            intensity={0.5}
          />
        </EffectComposer>

        {/* Préchargement de tous les assets pour éviter les à-coups */}
        <Preload all />
      </Canvas>
    </div>
  );
}

export default App;
