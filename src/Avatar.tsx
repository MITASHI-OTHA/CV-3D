import { useGLTF, OrbitControls, useAnimations } from "@react-three/drei";
import * as THREE from "three"; // Importation de THREE
import { useFrame, useLoader } from "@react-three/fiber";
import { RefObject, useEffect, useRef, useState } from "react";
import Soleil from "./composants/Soleil";
import { EffectComposer, Bloom } from "@react-three/postprocessing";

export const Avatar: React.FC<{
  cameraRef: RefObject<THREE.PerspectiveCamera | null>;
}> = ({ cameraRef }) => {
  const { scene, animations } = useGLTF(
    "http://localhost/cv-3d/files/blender/me2.glb"
  );

  const { actions } = useAnimations(animations, scene);

  const controlsRef = useRef(null);

  const ref = useRef<THREE.Object3D>(null);

  useEffect(() => {
    if (cameraRef.current) {
      // Exemple d'application de la position de la caméra en fonction de l'azimut (rotation.y)
      // Par exemple, nous déplaçons la caméra en fonction de la rotation Y de la caméra.
      // Plus la rotation Y est élevée, plus la caméra s'éloigne ou se rapproche de l'avatar.
      const newCameraPosition = new THREE.Vector3(
        Math.sin(-4) * 10, // Position X dépend de la rotation Y
        5, // Position Y fixe (hauteur)
        Math.sin(-2) * 10 // Position Z dépend de la rotation Y
      );
      // Appliquer la nouvelle position à la caméra
      cameraRef.current.position.copy(newCameraPosition);
      cameraRef.current.position.z = -5.5;
      cameraRef.current.lookAt(scene.position); // Garder la caméra dirigée vers l'avatar
    }
  }, [cameraRef]);

  useFrame(() => {
    // Vérifier la caméra chaque frame et récupérer la rotation
    const controls: any = controlsRef.current;
    if (controls) {
      // La rotation de la caméra
      const { rotation } = controls.object;
      /*console.log("Camera Rotation:", {
        x: rotation.x, // Inclinaison (pitch)
        y: rotation.y, // Azimut (yaw)
        z: rotation.z, // Roll (rotation autour de l'axe)
      });*/
    }
  });

  /* useEffect(() => {
    scene.traverse((child) => {
      if (
        child instanceof THREE.Mesh &&
        child.material instanceof THREE.Material &&
        child.isMesh &&
        child.name === "planete_shell"
      ) {
        child.material.transparent = true;
        child.material.depthWrite = false;
        child.material.opacity = 0.3;
        child.material.side = THREE.DoubleSide;
      }
    });
  }, [scene]);*/

  useEffect(() => {
    console.log("animations ", animations);
    // Joue toutes les animations disponibles
    const action = actions["F_Standing_Idle_001"]; // Si tu veux contrôler une animation en particulier
    if (action) {
      action.setLoop(THREE.LoopPingPong, Infinity); // Boucle l'animation indéfiniment
      action.timeScale = 1; // Vitesse de l'animation
      action.play(); // Démarre l'animation
    }
  }, [actions]);

  const [initialY, setInitialY] = useState(0);

  // Enregistre la position de base après le chargement
  useEffect(() => {
    if (ref.current) {
      setInitialY(ref.current.position.y);
    }
  }, [ref]);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (ref.current && initialY !== 0) {
      // Effet de flottaison
      ref.current.position.y = initialY + Math.sin(t * 2) * 0.2; // 1.5 = hauteur de base, 0.2 = amplitude
    }
  });

  useEffect(() => {
    scene.traverse((child) => {
      console.log("name ", child.name);
      if (child instanceof THREE.Mesh && child.name.includes("Base")) {
        child.material.emissive = new THREE.Color(0xffff00);
        child.material.emissiveIntensity = 150;
      }
    });
  }, [scene]);

  return (
    <>
      <primitive
        ref={ref}
        object={scene}
        position={[-17, -12, 2]}
        scale={[1, 1, 1]}
      />
      <EffectComposer>
        <Bloom
          luminanceThreshold={1}
          luminanceSmoothing={0.7}
          height={300}
          intensity={0.2}
        />
      </EffectComposer>
    </>
  );
};
