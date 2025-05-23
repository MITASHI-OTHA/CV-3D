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

export type globeListType = {
  position: [number, number, number];
  color: string;
  count: number;
  shape: string;
  image?: string;
  width: number;
  scale: number;
};

const App = () => {
  const globeList: globeListType[] = [
    {
      position: [0, 0, 5],
      color: "#5786F5",
      count: 2000,
      shape: "sphere",
      image: "/React-icon.png",
      width: 80,
      scale: 1,
    },
    {
      position: [0.5, -3, 5],
      color: "#c3002f",
      count: 2000,
      shape: "sphere",
      image: "/angular-logo.png",
      width: 80,
      scale: 1.1,
    },
    {
      position: [-0.5, 1.7, -2.9],
      color: "#f0db4f",
      count: 2000,
      shape: "sphere",
      image: "/java.png",
      width: 120,
      scale: 0.7,
    },
    {
      position: [-0.5, -0.3, -3.2],
      color: "#7b43aa",
      count: 2000,
      shape: "sphere",
      image: "/php.png",
      width: 100,
      scale: 0.8,
    },
  ];
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
        position={[99, 99, 1]} // Position initiale de la caméra
        fov={32}
        ref={cameraRef} // Attacher le ref ici
      />
      {globeList.map((globe, index) => (
        <Globe key={index} globeItem={globe} />
      ))}
      <Avatar cameraRef={cameraRef} />
    </Canvas>
  );
};
export default App;
