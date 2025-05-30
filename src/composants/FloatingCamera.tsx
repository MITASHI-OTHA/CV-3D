import { useThree, useFrame } from "@react-three/fiber";
import { useRef, useEffect } from "react";
import * as THREE from "three";

export function FloatingCamera({
  amplitude = 0.5, // Amplitude du mouvement
  speed = 0.1, // Vitesse du mouvement
}) {
  const { camera } = useThree();
  const initialPosition = useRef(new THREE.Vector3());

  useEffect(() => {
    // Sauvegarde la position de départ de la caméra
    initialPosition.current.copy(camera.position);
  }, [camera.position]);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    camera.position.x =
      initialPosition.current.x + Math.sin(t * speed) * amplitude;
    camera.position.y =
      initialPosition.current.y + Math.cos(t * speed * 0.5) * amplitude;
    camera.position.z = initialPosition.current.z; // Garde le Z inchangé (ou adapte si tu veux flotter en Z)
    camera.lookAt(0, 0, 0); // Toujours regarder le centre
  });

  return null;
}
