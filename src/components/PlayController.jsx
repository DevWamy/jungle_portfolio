import React, { useRef, useEffect, useState } from 'react';
import { OrbitControls } from '@react-three/drei'; // change PointerLockControls en OrbitControls
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

// Limites de déplacement
const boundary = {
  minX: -10,
  maxX: 10,
  minZ: -10,
  maxZ: 10,
};

function PlayController() {
  const controlsRef = useRef();
  const { camera, gl } = useThree();

  const keys = useRef({ forward: false, backward: false, left: false, right: false });
  const joystick = useRef({ x: 0, y: 0 });
  const targetPosition = useRef(null);
  const speed = 5;
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    setIsMobile(/Mobi|Android/i.test(navigator.userAgent));

    const onKeyDown = (e) => {
      switch (e.code) {
        case 'KeyW': keys.current.forward = true; break;
        case 'KeyS': keys.current.backward = true; break;
        case 'KeyA': keys.current.left = true; break;
        case 'KeyD': keys.current.right = true; break;
        default: break;
      }
    };

    const onKeyUp = (e) => {
      switch (e.code) {
        case 'KeyW': keys.current.forward = false; break;
        case 'KeyS': keys.current.backward = false; break;
        case 'KeyA': keys.current.left = false; break;
        case 'KeyD': keys.current.right = false; break;
        default: break;
      }
    };

    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('keyup', onKeyUp);

    const handleClick = (event) => {
      if (isMobile) return;

      const rect = gl.domElement.getBoundingClientRect();
      const x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      const y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

      const mouseVector = new THREE.Vector2(x, y);
      const raycaster = new THREE.Raycaster();
      raycaster.setFromCamera(mouseVector, camera);

      const plane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0);
      const intersectPoint = new THREE.Vector3();

      if (raycaster.ray.intersectPlane(plane, intersectPoint)) {
        intersectPoint.x = Math.min(Math.max(intersectPoint.x, boundary.minX), boundary.maxX);
        intersectPoint.z = Math.min(Math.max(intersectPoint.z, boundary.minZ), boundary.maxZ);

        targetPosition.current = intersectPoint.clone();
      }
    };

    gl.domElement.addEventListener('click', handleClick);

    return () => {
      window.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('keyup', onKeyUp);
      gl.domElement.removeEventListener('click', handleClick);
    };
  }, [gl.domElement, camera, isMobile]);

  useFrame((_, delta) => {
    const direction = new THREE.Vector3();

    if (keys.current.forward) direction.z -= 1;
    if (keys.current.backward) direction.z += 1;
    if (keys.current.left) direction.x -= 1;
    if (keys.current.right) direction.x += 1;

    direction.x += joystick.current.x;
    direction.z += joystick.current.y;

    if (direction.length() > 0) {
      direction.normalize();

      const forward = new THREE.Vector3();
      camera.getWorldDirection(forward);
      forward.y = 0;
      forward.normalize();

      const right = new THREE.Vector3();
      right.crossVectors(camera.up, forward).normalize();

      camera.position.addScaledVector(forward, direction.z * speed * delta);
      camera.position.addScaledVector(right, direction.x * speed * delta);

      targetPosition.current = null;

      camera.position.x = Math.min(Math.max(camera.position.x, boundary.minX), boundary.maxX);
      camera.position.z = Math.min(Math.max(camera.position.z, boundary.minZ), boundary.maxZ);
    } else if (targetPosition.current) {
      const camPos = camera.position.clone();
      camPos.y = 0;
      const targetPos = targetPosition.current.clone();
      targetPos.y = 0;

      const toTarget = targetPos.sub(camPos);
      const distance = toTarget.length();

      if (distance > 0.1) {
        toTarget.normalize();
        camera.position.addScaledVector(toTarget, speed * delta);

        camera.position.x = Math.min(Math.max(camera.position.x, boundary.minX), boundary.maxX);
        camera.position.z = Math.min(Math.max(camera.position.z, boundary.minZ), boundary.maxZ);
      } else {
        targetPosition.current = null;
      }
    }
  });

  return (
    <>
      <OrbitControls ref={controlsRef} enablePan={false} />
      {isMobile && <MobileJoystick onMove={(dir) => { joystick.current = dir; }} />}
    </>
  );
}

export default PlayController;