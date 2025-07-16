import { useThree, useFrame } from '@react-three/fiber';
import { useRef, useEffect } from 'react';
import * as THREE from 'three';

function FreeCameraController() {
  const { camera, gl, scene } = useThree();
  const keys = useRef({});
  const direction = useRef(new THREE.Vector3());

  // Objets pour gérer la rotation de la caméra (horizontal = yaw / vertical = pitch)
  const cameraHolder = useRef(new THREE.Object3D());
  const pitchObject = useRef(new THREE.Object3D());

  useEffect(() => {
    // Ajout de la caméra dans les objets de rotation
    scene.add(cameraHolder.current);
    cameraHolder.current.add(pitchObject.current);
    pitchObject.current.add(camera);
    camera.position.set(0, 0, 0); // Caméra au centre du pitch

    // 🔧 Nouvelle position initiale de la caméra : début du sol (z = 0)
    cameraHolder.current.position.set(0, 1.65, 0); // Départ à l'entrée du chemin

    // Double-clic pour entrer ou sortir du mode "pointer lock"
    const togglePointerLock = () => {
      if (document.pointerLockElement === gl.domElement) {
        document.exitPointerLock(); // Sortie
      } else {
        gl.domElement.requestPointerLock(); // Entrée
      }
    };

    gl.domElement.addEventListener('dblclick', togglePointerLock);
    return () => {
      gl.domElement.removeEventListener('dblclick', togglePointerLock);
    };
  }, [camera, gl, scene]);

  // Déplacement souris → rotation de la caméra
  useEffect(() => {
    const onMouseMove = (event) => {
      if (document.pointerLockElement === gl.domElement) {
        const yaw = -event.movementX * 0.002;
        const pitch = -event.movementY * 0.002;

        cameraHolder.current.rotation.y += yaw;
        pitchObject.current.rotation.x += pitch;

        // Limite la rotation verticale pour ne pas faire de looping
        const maxPitch = Math.PI / 2 - 0.15;
        pitchObject.current.rotation.x = Math.max(-maxPitch, Math.min(maxPitch, pitchObject.current.rotation.x));
      }
    };
    document.addEventListener('mousemove', onMouseMove);
    return () => document.removeEventListener('mousemove', onMouseMove);
  }, [gl.domElement]);

  // ZQSD / flèches → mouvements clavier
  useEffect(() => {
    const onKeyDown = (e) => (keys.current[e.code] = true);
    const onKeyUp = (e) => (keys.current[e.code] = false);
    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('keyup', onKeyUp);
    return () => {
      window.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('keyup', onKeyUp);
    };
  }, []);

  // Animation continue (frame par frame)
  useFrame(({ clock }) => {
    direction.current.set(0, 0, 0);
    if (keys.current['KeyW'] || keys.current['ArrowUp'] || keys.current['Numpad8']) direction.current.z -= 1;
    if (keys.current['KeyS'] || keys.current['ArrowDown'] || keys.current['Numpad2']) direction.current.z += 1;
    if (keys.current['KeyA'] || keys.current['ArrowLeft'] || keys.current['Numpad4']) direction.current.x -= 1;
    if (keys.current['KeyD'] || keys.current['ArrowRight'] || keys.current['Numpad6']) direction.current.x += 1;

    direction.current.normalize(); // Pour ne pas aller plus vite en diagonale
    const speed = 0.1;
    const move = direction.current.clone().applyEuler(cameraHolder.current.rotation);
    cameraHolder.current.position.add(move.multiplyScalar(speed));

    // 🔧 Nouvelle limite adaptée au sol : X reste [-10, 10], Z passe de [0, -60]
    const limitX = 10;
    const minZ = -53;
    const maxZ = 0;
    cameraHolder.current.position.x = Math.max(-limitX, Math.min(limitX, cameraHolder.current.position.x));
    cameraHolder.current.position.z = Math.max(minZ, Math.min(maxZ, cameraHolder.current.position.z));

    // Animation de rebond (effet de marche "pieds")
    const walking = direction.current.length() > 0;
    const t = clock.getElapsedTime();

    const bobTarget = walking ? Math.sin(t * 10) * 0.12 : 0;
    const sideBobTarget = walking ? Math.sin(t * 5) * 0.06 : 0;

    pitchObject.current.position.y += (bobTarget - pitchObject.current.position.y) * 0.2;
    pitchObject.current.position.x += (sideBobTarget - pitchObject.current.position.x) * 0.2;
  });

  return null;
}

export default FreeCameraController;
