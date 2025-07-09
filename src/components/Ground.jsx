import { useTexture } from '@react-three/drei';
import { useRef } from 'react';
import { RepeatWrapping } from 'three';

const WIDTH = 20;     // Largeur du sol (chemin)
const LENGTH = 60;    // Longueur du sol (chemin)

function Ground({ mode }) {
  const ref = useRef();

  // Chargement des différentes textures utilisées pour le sol
  const [color, normal, roughness, ao, displacement] = useTexture([
    '/src/assets/textures/ground/color.png',              // texture de couleur
    '/src/assets/textures/ground/normalGL.png',           // normal map (relief)
    '/src/assets/textures/ground/roughness.png',          // rugosité
    '/src/assets/textures/ground/ambientOcclusion.png',   // ombrage ambiant
    '/src/assets/textures/ground/displacement.png',       // déplacement (hauteur)
  ]);

  // Paramétrage de chaque texture : répétition pour couvrir toute la surface
  [color, normal, roughness, ao, displacement].forEach((texture) => {
    texture.wrapS = texture.wrapT = RepeatWrapping; // Répète la texture horizontalement et verticalement
    texture.repeat.set(WIDTH / 2, LENGTH / 2);       // Adapte le nombre de répétitions à la taille du sol
  });

  return (
    <mesh
      ref={ref}
      rotation-x={-Math.PI / 2}               // Tourne le sol pour qu’il soit à plat
      position={[0, 0, -LENGTH / 2]}          // Centre le sol en Z autour de 0
      key={mode}                              // Permet de forcer un remount si le mode change
      onUpdate={(self) =>
        self.geometry.setAttribute('uv2', self.geometry.attributes.uv) // Nécessaire pour l’aoMap (UV secondaires)
      }
      receiveShadow                            // Le sol reçoit les ombres
    >
      <planeGeometry args={[WIDTH, LENGTH, 40, 120]} />  {/* Sol découpé finement pour le displacement */}
      <meshStandardMaterial
        map={color}                            // Texture couleur
        normalMap={normal}                     // Normal map
        roughnessMap={roughness}               // Rugosité
        aoMap={ao}                             // Ambient occlusion map
        displacementMap={displacement}         // Hauteur (relief)
        displacementScale={0.25}               // Intensité du relief
      />
    </mesh>
  );
}

export default Ground;
