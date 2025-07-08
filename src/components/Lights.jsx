import { useEffect, useRef } from 'react';
import { useThree, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

function Lights({ mode, previousMode }) {
  const { scene } = useThree();
  const ambientRef = useRef();
  const dirRef = useRef();
  const fogColor = useRef(new THREE.Color());
  const fogIntensity = useRef(0);  // Contrôle interpolation de la brume (0 = invisible, 1 = pleine)

  useEffect(() => {
    scene.environment = null;
    // // Initialisation de la brume à transparente
    if (mode === 'day') {
    // Brume de jour plus fine et plus étalée
    fogColor.current.setRGB(0.5, 0.7, 1); // même couleur que le background en jour
  // couleur plus claire, plus douce
    scene.fog = new THREE.Fog(fogColor.current, 15, 70); // near=15, far=70 pour brume plus subtile
    fogIntensity.current = 0;
  } else {
    fogColor.current.set('#0e1e2e');
    scene.fog = new THREE.Fog(fogColor.current, 10, 50);
    fogIntensity.current = 1;
    scene.fog.color.copy(fogColor.current);
  }

    return () => {
      scene.fog = null;
    };
  }, [mode, scene]);

  useFrame((state, delta) => {
    // Délai avant démarrage de la transition (par exemple 1.5s)
    const delay = mode === 'day' ? 1.5 : 0;
    if (mode === 'day' && state.clock.elapsedTime < delay) {
      // Avant délai, brume invisible
      scene.fog.color.setRGB(0, 0, 0);
      return;
    }

    // Après délai, on fait monter l'intensité progressivement (exemple vitesse 0.3 par frame)
    if (fogIntensity.current < 1) {
      fogIntensity.current = Math.min(fogIntensity.current + delta * 0.3, 1);
    }

    // On interpole la couleur de la brume entre noir (transparent) et la couleur finale
    scene.fog.color.lerpColors(new THREE.Color(0x000000), fogColor.current, fogIntensity.current);

    // Ensuite ton code de lights reste pareil
    const targetAmbient = mode === 'day' ? 0.5 : 0.35;
    const targetDir = mode === 'day' ? 1.2 : 0.6;
    const targetColor = new THREE.Color(mode === 'day' ? 'white' : '#7788aa');

    const isToNight = mode === 'night' && previousMode === 'day';
    const isToDay = mode === 'day' && previousMode === 'night';

    const lerpLight = isToNight ? 0.12 : isToDay ? 0.03 : 0.06;
    const lerpColor = isToNight ? 0.15 : isToDay ? 0.04 : 0.08;

    ambientRef.current.intensity = THREE.MathUtils.lerp(
      ambientRef.current.intensity,
      targetAmbient,
      lerpLight
    );
    dirRef.current.intensity = THREE.MathUtils.lerp(
      dirRef.current.intensity,
      targetDir,
      lerpLight
    );
    dirRef.current.color.lerp(targetColor, lerpColor);
  });

  return (
    <>
      <ambientLight ref={ambientRef} intensity={0.5} />
      <directionalLight
        ref={dirRef}
        intensity={1.2}
        color={'white'}
        position={[10, 10, 5]}
        castShadow
      />

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
