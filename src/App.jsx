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
  const [mode, setMode] = useState('day');
  const [previousMode, setPreviousMode] = useState('day');
  const [setModeChangeTime] = useState(Date.now());

  const [loading, setLoading] = useState(true);
  const { progress, active } = useProgress();

  useEffect(() => {
    if (!active && progress === 100) {
      setTimeout(() => setLoading(false), 500); // petit délai pour adoucir la transition
    }
  }, [active, progress]);

  return (
    <div className={`w-screen h-screen overflow-hidden relative ${mode === 'night' ? 'dark' : ''}`}>
      {/* Bouton toggle jour/nuit */}
      <motion.button
        onClick={() => {
          const newMode = mode === 'day' ? 'night' : 'day';
          setPreviousMode(mode);
          setMode(newMode);
          setModeChangeTime(Date.now());
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
        animate={{ rotate: mode === 'day' ? 0 : 180 }}
        transition={{ duration: 0.6, ease: 'easeInOut' }}
        aria-label="Toggle mode"
        style={{ pointerEvents: 'auto' }}
      >
        {mode === 'day' ? <FaSun size={18} /> : <FaMoon size={18} />}
      </motion.button>

      <div id="click-zone" className="absolute inset-0 z-0"></div>

      {/* ✅ Loader jungle */}
      {loading && <JungleLoader progress={progress} />}

      {/* Canvas 3D */}
      <Canvas
        className="absolute top-0 left-0 w-full h-full"
        camera={{ position: [0, 5, 20], fov: 60 }}
        gl={{ antialias: true }}
      >
        <OrbitControls
          enablePan={false}
          maxPolarAngle={Math.PI / 2.4}
          minDistance={10}
          maxDistance={35}
          target={[0, 0, 0]}
        />

        <Background mode={mode} previousMode={previousMode} />
        <Lights mode={mode} previousMode={previousMode} />
        <Ground mode={mode} />
        <Fireflies mode={mode} />
        <PlantsGroup side="both" />

        <EffectComposer>
          <Bloom
            luminanceThreshold={0.1}
            luminanceSmoothing={0.9}
            intensity={0.5}
          />
        </EffectComposer>

        {/* ✅ Préchargement de tous les assets */}
        <Preload all />
      </Canvas>
    </div>
  );
}

export default App;
