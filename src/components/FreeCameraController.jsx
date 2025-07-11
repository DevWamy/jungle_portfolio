import { useThree, useFrame } from '@react-three/fiber';
import { useRef, useEffect } from 'react';
import * as THREE from 'three';

function FreeCameraController() {
  const { camera, gl, scene } = useThree();
  const keys = useRef({});
  const direction = useRef(new THREE.Vector3());

  // Yaw (horizontal) & Pitch (vertical)
  const cameraHolder = useRef(new THREE.Object3D());
  const pitchObject = useRef(new THREE.Object3D());

  useEffect(() => {
    // Setup yaw + pitch
    scene.add(cameraHolder.current);
    cameraHolder.current.add(pitchObject.current);
    pitchObject.current.add(camera);
    camera.position.set(0, 0, 0); // Attach camera inside pitch object
    cameraHolder.current.position.set(0, 1.65, 20); // Départ au sol

    // Lock souris
    gl.domElement.requestPointerLock = gl.domElement.requestPointerLock || gl.domElement.mozRequestPointerLock;
    document.body.onclick = () => gl.domElement.requestPointerLock();
  }, [camera, gl, scene]);

  // Souris → rotation
  useEffect(() => {
    const onMouseMove = (event) => {
      if (document.pointerLockElement === gl.domElement) {
        const yaw = -event.movementX * 0.002;
        const pitch = -event.movementY * 0.002;

        cameraHolder.current.rotation.y += yaw;
        pitchObject.current.rotation.x += pitch;

        // Clamp vertical
        const maxPitch = Math.PI / 2 - 0.15;
        pitchObject.current.rotation.x = Math.max(-maxPitch, Math.min(maxPitch, pitchObject.current.rotation.x));
      }
    };
    document.addEventListener('mousemove', onMouseMove);
    return () => document.removeEventListener('mousemove', onMouseMove);
  }, [gl.domElement]);

  // Clavier ZQSD
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

  // Déplacement + oscillation
  useFrame(({ clock }) => {
    direction.current.set(0, 0, 0);
    if (
      keys.current['KeyW'] ||
      keys.current['ArrowUp'] ||
      keys.current['Numpad8']
    ) direction.current.z -= 1;

    if (
      keys.current['KeyS'] ||
      keys.current['ArrowDown'] ||
      keys.current['Numpad2']
    ) direction.current.z += 1;

    if (
      keys.current['KeyA'] ||
      keys.current['ArrowLeft'] ||
      keys.current['Numpad4']
    ) direction.current.x -= 1;

    if (
      keys.current['KeyD'] ||
      keys.current['ArrowRight'] ||
      keys.current['Numpad6']
    ) direction.current.x += 1;

    direction.current.normalize();
    const speed = 0.1;
    const move = direction.current.clone().applyEuler(cameraHolder.current.rotation);
    cameraHolder.current.position.add(move.multiplyScalar(speed));

    // Oscillation si on marche (effet rebond + balancier accentué)
    const walking = direction.current.length() > 0;
    const t = clock.getElapsedTime();

    // Valeurs accentuées pour bien voir l'effet
    const bobTarget = walking ? Math.sin(t * 10) * 0.12 : 0;       // Rebond vertical (plus rapide et plus haut)
    const sideBobTarget = walking ? Math.sin(t * 5) * 0.06 : 0;    // Balancier horizontal (plus large)

    // Application fluide avec interpolation
    pitchObject.current.position.y += (bobTarget - pitchObject.current.position.y) * 0.2;
    pitchObject.current.position.x += (sideBobTarget - pitchObject.current.position.x) * 0.2;
  });

  return null;
}

export default FreeCameraController;
