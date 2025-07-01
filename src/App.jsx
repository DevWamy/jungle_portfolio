import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { useState } from 'react';
import { EffectComposer, Bloom } from '@react-three/postprocessing';
import Ground from './components/Ground';
import Lights from './components/Lights';
import Background from './components/Background';
import Fireflies from './components/Fireflies';
import { motion } from 'framer-motion';
import { FaSun, FaMoon } from 'react-icons/fa';
import './index.css';

function App() {
  const [mode, setMode] = useState('day');

  return (
    <div className={`w-screen h-screen overflow-hidden relative ${mode === 'night' ? 'dark' : ''}`}>
      {/* Bouton toggle */}
      <motion.button
        onClick={() => setMode(mode === 'day' ? 'night' : 'day')}
        className={`
          absolute top-4 left-4 z-10 
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
      >
        {mode === 'day' ? <FaSun size={18} /> : <FaMoon size={18} />}
      </motion.button>

      {/* Titre */}
      <h1 className="text-4xl font-bold text-purple-600 absolute top-4 right-4 z-10">
        Hello Tailwind 🎉
      </h1>

      {/* Canvas plein écran */}
      <Canvas
        className="absolute top-0 left-0 w-full h-full"
        camera={{ position: [0, 12, 20], fov: 60, near: 0.1, far: 100 }}
      >
        <OrbitControls
          target={[0, 1, 0]}
          maxPolarAngle={Math.PI / 2}
          minPolarAngle={0.1}
          minDistance={10}
          maxDistance={30}
        />
        <Background mode={mode} />
        <Lights mode={mode} />
        <Ground mode={mode} />
        <EffectComposer>
          <Bloom
            luminanceThreshold={0.1}
            luminanceSmoothing={0.9}
            intensity={0.5}
          />
        </EffectComposer>
        <Fireflies mode={mode} />
      </Canvas>
    </div>
  );
}

export default App;
