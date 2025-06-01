import { useGLTF, OrbitControls, useAnimations } from "@react-three/drei";
import * as THREE from "three"; // Importation de THREE
import { useFrame, useLoader } from "@react-three/fiber";
import { RefObject, useEffect, useRef, useState } from "react";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import { Model } from "./models/Scenes";

export const Avatar: React.FC<{
  cameraRef: RefObject<THREE.PerspectiveCamera | null>;
}> = ({ cameraRef }) => {
  const { scene, animations, nodes, materials } = useGLTF(
    "http://localhost/cv-3d/files/blender/me5.glb"
  );

  const { actions } = useAnimations(animations, scene);

  const controlsRef = useRef(null);

  const ref = useRef<THREE.Object3D>(null);

  const avatarRef = useRef<THREE.Object3D | null>(null);

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
  const setColor = (color: string, child: THREE.Object3D) => {
    if (
      child instanceof THREE.Mesh &&
      child.material instanceof THREE.MeshStandardMaterial
    ) {
      child.material = child.material.clone(); // Évitez de modifier un matériau partagé
      child.material.color.set(color);
    }
  };

  useEffect(() => {
    scene.traverse((child) => {
      console.log("Child name: ", child.name);
      if (
        child instanceof THREE.Mesh &&
        child.material instanceof THREE.Material &&
        child.isMesh
      ) {
        // Appliquer une couleur spécifique à l'InnerRing
        if (child.name === "Icosphere020_Sand002_0") {
          setColor("#03A9F4", child);
          /*  light.position.copy(childCopy.getWorldPosition(new THREE.Vector3())); */
        } else if (child.name === "Renderer_Hair002") {
          setColor("#3b3838", child);
        }
      }
    });
  }, [scene]);

  useEffect(() => {
    console.log("animations ", animations);
    const animationsShouldPlay = [
      "F_Standing_Idle_001.001",
      "F_Standing_Idle_Variations_001.001",
      "F_Standing_Idle_Variations_009.001",
      /*       "F_Talking_Variations_001.001",
      "F_Talking_Variations_001.004",
      "F_Talking_Variations_004.001", */
    ];

    let currentAction: THREE.AnimationAction | null = null;
    let mixer: THREE.AnimationMixer | null | undefined = null;

    if (animations.length > 0) {
      mixer = actions[animations[0].name]?.getMixer();

      const playNextAnimation = () => {
        if (currentAction) {
          currentAction.stop();
        }

        const nextAnimation =
          animationsShouldPlay[
            Math.floor(Math.random() * animationsShouldPlay.length)
          ];
        console.log("nextAnimation ", nextAnimation);
        currentAction = actions[nextAnimation];
        currentAction?.reset().play();
        currentAction?.setLoop(THREE.LoopOnce, 0);
      };

      // Jouer la première animation
      playNextAnimation();

      // Attacher une seule fois le listener
      const onFinished = (e: { action: THREE.AnimationAction | null }) => {
        if (e.action === currentAction) {
          playNextAnimation();
        }
      };

      mixer?.addEventListener("finished", onFinished);

      // Cleanup
      return () => {
        if (mixer) {
          mixer.removeEventListener("finished", onFinished);
        }
        currentAction?.stop();
      };
    }
  }, [actions, animations]);

  const [initialY, setInitialY] = useState(0);

  // Enregistre la position de base après le chargement
  useEffect(() => {
    if (ref.current) {
      ref.current.renderOrder = 1;
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
      //  console.log("name ", child.name);
      if (child instanceof THREE.Mesh && child.name.includes("Base")) {
        child.material.emissive = new THREE.Color(0xffff00);
        child.material.emissiveIntensity = 150;
      }
    });
  }, [scene]);

  const MyPolygone = () => {
    console.log("materialsXXX ", materials);
    return (
      <mesh
        geometry={(nodes.Icosphere002 as THREE.Mesh).geometry}
        scale={[1, 1, 1]}
      >
        <meshStandardMaterial
          {...materials["Material.007"]}
          flatShading // Force un rendu non lissé
        />
      </mesh>
    );
  };

  return (
    <>
      <primitive
        ref={ref}
        object={scene}
        position={[-17, -12, 2]}
        scale={[1, 1, 1]}
      />
    </>
  );
};
