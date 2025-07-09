import { useEffect, useRef, useState } from 'react';
import { useThree, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

function Lights({ mode, previousMode }) {
  const { scene } = useThree(); // Récupération de la scène three.js via le hook
  const ambientRef = useRef();   // Référence à la lumière ambiante
  const dirRef = useRef();       // Référence à la lumière directionnelle

  // Couleurs utilisées pour la brume de nuit et de jour
  const fogNightColor = useRef(new THREE.Color('#0e1e2e'));
  const fogDayColor = useRef(new THREE.Color(0.5, 0.7, 1));

  const fogProgress = useRef(0);  // Progression interpolation brume entre nuit et jour (0 à 1)
  const timer = useRef(0);        // Timer utilisé pour certains délais
  const [bgDayProgress, setBgDayProgress] = useState(0); // Progression background jour (état local)

  // Effet qui se déclenche à chaque changement de mode (jour/nuit)
  useEffect(() => {
    scene.environment = null; // Réinitialisation de l'environnement (HDR ou autre)

    // Initialisation de la brume selon le mode
    if (mode === 'day') {
      // Au début du jour, la brume est noire (invisible)
      fogProgress.current = 0;
      scene.fog = new THREE.Fog(fogNightColor.current.clone(), 15, 70);
      scene.fog.color.set(fogNightColor.current); // Couleur de la brume
      timer.current = 0;
      setBgDayProgress(0); // Réinitialisation progression background jour
    } else {
      // Mode nuit, brume plus dense
      fogProgress.current = 1;
      scene.fog = new THREE.Fog(fogNightColor.current.clone(), 10, 50);
      scene.fog.color.set(fogNightColor.current);
      timer.current = 0;
      setBgDayProgress(1); // Background nuit complètement appliqué
    }

    // Nettoyage : supprimer la brume si composant détruit
    return () => {
      scene.fog = null;
    };
  }, [mode, scene]); // Se déclenche à chaque changement de mode ou scène

  // Fonction exécutée à chaque frame (~60fps)
  useFrame((state, delta) => {
    timer.current += delta; // Incrémente le timer du delta (temps écoulé depuis dernière frame)

    if (mode === 'day') {
      // Pendant la transition nuit->jour, interpolation progressive de la brume
      if (previousMode === 'night') {
        if (fogProgress.current < 1) {
          fogProgress.current = Math.min(fogProgress.current + delta * 0.3, 1);
        }
        // Interpolation des couleurs de la brume de nuit vers jour
        if (scene.fog) {
          scene.fog.color.lerpColors(fogNightColor.current, fogDayColor.current, fogProgress.current);
        }
      } else {
        // Journée classique : couleur de brume jour stable (sans interpolation)
        if (scene.fog) {
          scene.fog.color.copy(fogDayColor.current);
        }
      }

      // Progression lente de l'état de background jour
      if (bgDayProgress < 1) {
        setBgDayProgress((prev) => Math.min(prev + delta * 0.1, 1));
      }
    } else {
      // Mode nuit, apparition progressive de la brume après délai (1.5s)
      if (timer.current > 1.5 && fogProgress.current < 1) {
        fogProgress.current = Math.min(fogProgress.current + delta * 0.3, 1);
      }
      // Interpolation de la couleur de la brume du noir vers couleur nuit
      if (scene.fog) {
        scene.fog.color.lerpColors(new THREE.Color(0x000000), fogNightColor.current, fogProgress.current);
      }
    }

    // Mise à jour des intensités et couleurs des lumières pour un effet de transition en douceur
    const targetAmbient = mode === 'day' ? 0.5 : 0.35;      // Intensité cible lumière ambiante
    const targetDir = mode === 'day' ? 1.0 : 0.6;          // Intensité cible lumière directionnelle
    const targetColor = new THREE.Color(mode === 'day' ? 'white' : '#7788aa'); // Couleur cible lumière directionnelle

    const lerpSpeed = 0.1; // Vitesse d'interpolation des valeurs

    // Interpolation linéaire vers les valeurs cibles (pour éviter changement brusque)
    ambientRef.current.intensity = THREE.MathUtils.lerp(
      ambientRef.current.intensity,
      targetAmbient,
      lerpSpeed
    );
    dirRef.current.intensity = THREE.MathUtils.lerp(
      dirRef.current.intensity,
      targetDir,
      lerpSpeed
    );
    dirRef.current.color.lerp(targetColor, lerpSpeed);
  });

  // JSX retourné : déclaration des lumières utilisées dans la scène
  return (
    <>
      {/* Lumière ambiante globale */}
      <ambientLight ref={ambientRef} intensity={0.5} />
      {/* Lumière directionnelle principale, simulant soleil ou lune */}
      <directionalLight
        ref={dirRef}
        intensity={1.0}
        color={'white'}
        position={[10, 10, 5]}
        castShadow
      />
      {/* Lumière ponctuelle bleutée visible uniquement la nuit */}
      {mode === 'night' && (
        <pointLight
          color="#88aaff"
          intensity={0.3}
          position={[5, 10, 5]}
          distance={30}
        />
      )}
    </>
  );
}

export default Lights;
