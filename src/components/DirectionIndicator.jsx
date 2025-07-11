import { useEffect, useState } from 'react';
import { useProgress } from '@react-three/drei';
import { ArrowUp, ArrowDown, ArrowLeft, ArrowRight } from 'lucide-react';

/**
 * Affiche des flèches directionnelles à l'écran pour indiquer la direction pressée par l'utilisateur.
 * S'affiche uniquement une fois que tous les assets sont complètement chargés.
 */
function DirectionIndicator() {
  const { progress } = useProgress(); // Suivi de la progression des assets 3D
  const [pressed, setPressed] = useState({}); // État des touches pressées
  const [isLoaded, setIsLoaded] = useState(false); // État indiquant si le chargement est terminé

  // Active l'indicateur uniquement lorsque le chargement atteint 100% (et reste actif)
  useEffect(() => {
    if (progress >= 100) {
      setIsLoaded(true);
    }
  }, [progress]);

  // Écoute les événements clavier pour détecter les touches pressées
  useEffect(() => {
    const handleKeyDown = (e) => {
      setPressed((prev) => ({ ...prev, [e.code]: true }));
    };
    const handleKeyUp = (e) => {
      setPressed((prev) => ({ ...prev, [e.code]: false }));
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  // Vérifie si l'une des touches spécifiées est actuellement pressée
  const isPressed = (codes) => codes.some((code) => pressed[code]);

  // Ne rien afficher tant que le chargement n’est pas terminé
  if (!isLoaded) return null;

  return (
    <div className="fixed bottom-4 right-4 flex flex-col items-center justify-center gap-1 select-none pointer-events-none z-50">
      {/* Flèche Haut */}
      <ArrowUp
        className={`w-8 h-8 transition ${
          isPressed(['ArrowUp', 'KeyW', 'Numpad8']) ? 'text-lime-300' : 'text-white/50'
        }`}
      />

      {/* Flèches Gauche & Droite */}
      <div className="flex gap-6">
        <ArrowLeft
          className={`w-8 h-8 transition ${
            isPressed(['ArrowLeft', 'KeyA', 'Numpad4']) ? 'text-lime-300' : 'text-white/50'
          }`}
        />
        <ArrowRight
          className={`w-8 h-8 transition ${
            isPressed(['ArrowRight', 'KeyD', 'Numpad6']) ? 'text-lime-300' : 'text-white/50'
          }`}
        />
      </div>

      {/* Flèche Bas */}
      <ArrowDown
        className={`w-8 h-8 transition ${
          isPressed(['ArrowDown', 'KeyS', 'Numpad2']) ? 'text-lime-300' : 'text-white/50'
        }`}
      />
    </div>
  );
}

export default DirectionIndicator;
