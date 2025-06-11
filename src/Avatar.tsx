import { useGLTF, OrbitControls, useAnimations } from "@react-three/drei";
import * as THREE from "three"; // Importation de THREE
import { useFrame, useLoader } from "@react-three/fiber";
import { RefObject, useEffect, useMemo, useRef, useState } from "react";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import { Model } from "./models/Scenes";

export const Avatar: React.FC<{
  cameraRef: RefObject<THREE.PerspectiveCamera | null>;
}> = ({ cameraRef }) => {
  const { scene, animations, nodes, materials } = useGLTF(
    "http://localhost/cv-3d/files/blender/me5.1.glb"
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
  const setColor = (
    color: string,
    child: THREE.Object3D,
    intensity: number
  ) => {
    // Suppose que `child` est un mesh
    if (
      child instanceof THREE.Mesh &&
      child.material instanceof THREE.MeshStandardMaterial
    ) {
      // Clone le matériau si besoin
      child.material = child.material.clone();
      child.material.color = new THREE.Color(color);

      // Ajoute une lumière ponctuelle (PointLight) au-dessus du child
      const pointLight = new THREE.PointLight(color, 10000, 10);
      pointLight.position.copy(child.getWorldPosition(new THREE.Vector3()));
      child.add(pointLight);
    }
  };

  useEffect(() => {
    //console.log("animations ", animations);
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
        //console.log("nextAnimation ", nextAnimation);
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

  const handleHover = (e: any) => {
    console.log("Survol de l'avatar !", e.object.name);
    const child = e.object;
    if (child instanceof THREE.Mesh) {
      const pos = new THREE.Vector3();
      child.getWorldPosition(pos);
      console.log("Position globale :", pos);
      // Vérifie si le child a un matériau
      if (child.material instanceof THREE.MeshStandardMaterial) {
        // Change la couleur du matériau au survol
        if (
          child.name === "Icosphere020_Sand002_0" ||
          child.name === "P1_Water003_Ground003_0"
        ) {
          console.log("Icosphere020_Sand002_0 trouvé ");
          setColor("#45ff61", child, 3);
        } else if (
          child.name === "P1_Water003_Lava001_0" ||
          child.name === "P1_Water003_Lava_0"
        ) {
          setColor("#31f6e2", child, 3);
        } else if (child.name === "P1_Water003_Rocks003_0") {
          setColor("#6de93d", child, 3);
        } else if (child.name === "P1_Water001_Clouds001_0001") {
          setColor("#31f6e2", child, 3);
        } else if (child.name === "Icosphere021_Treewood002_0") {
          setColor("#31f6e2", child, 3);
        }
      }
    }
  };

  const pointLight = useMemo(() => {
    return new THREE.PointLight(0xffffff, 500, 100, 1);
  }, []);
  //-37, -131, 92
  const blenderPosition = new THREE.Vector3(-50, -60, 190);
  const groupOffset = new THREE.Vector3(-17, -12, 2);
  const correctedLightPosition = blenderPosition.clone().sub(groupOffset);

  useEffect(() => {
    const helper = new THREE.PointLightHelper(pointLight, 5);
    scene.add(helper);
  }, []);

  return (
    <group position={[-17, -12, 2]}>
      <primitive ref={ref} object={scene} />

      {/* Lumière */}
      <primitive object={pointLight} position={blenderPosition} />
    </group>
  );
};
