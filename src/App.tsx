import { OrbitControls, PerspectiveCamera, Stars } from "@react-three/drei";
import { Canvas, useFrame } from "@react-three/fiber";
import {
  AvatarCreator,
  AvatarCreatorConfig,
  AvatarExportedEvent,
} from "@readyplayerme/react-avatar-creator";
import { useRef, useState } from "react";
import { Avatar } from "./Avatar";
import * as THREE from "three"; // Importation de THREE
import { StarsField } from "./StarFieldShader";
import AngularScene from "./AngularSphere";
import AngularSphereScene from "./AngularSphere";
import Globe from "./composants/globe";

const style = { width: "100%", height: "100vh", border: "none" };

const App = () => {
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  return (
    <Canvas style={style}>
      <ambientLight />
      <Stars count={5000} />
      <ambientLight intensity={0.5} /> {/* Lumière ambiante */}
      <spotLight
        position={[5, 5, 5]}
        angle={Math.PI / 4}
        penumbra={1}
        intensity={1}
      />
      <PerspectiveCamera
        makeDefault
        position={[100, 100, 0]} // Position initiale de la caméra
        fov={27}
        ref={cameraRef} // Attacher le ref ici
      />
      <Globe position={[0, 0, 5]} />
      <Avatar cameraRef={cameraRef} />
    </Canvas>
  );
};
export default App;
