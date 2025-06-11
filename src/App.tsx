import { Avatar } from "./Avatar";
import { StarsField } from "./StarFieldShader";
import AngularScene from "./AngularSphere";
import AngularSphereScene from "./AngularSphere";
import Globe from "./composants/globe";
import GalaxyCloud from "./galaxyCloudShader";
import Smoke from "./composants/Smoke";
import Planets from "./composants/Planets";
import NuageGalactique from "./composants/nuageGalactic";
import Galaxys from "./composants/Galaxy";
import Sun from "./composants/sun";
import { ShootingStar } from "./composants/EtoileFilante";
// import { EffectComposer } from "postprocessing";
import { FloatingCamera } from "./composants/FloatingCamera";
import Galaxy from "./composants/Galaxy";
import BackgroundMusic from "./composants/BackGroundMusic";
import { useRef } from "react";
import * as THREE from "three";
import { Canvas, useThree } from "@react-three/fiber";
import {
  OrbitControls,
  PerspectiveCamera,
  SpotLight,
  Stars,
} from "@react-three/drei";
import { Bloom, EffectComposer } from "@react-three/postprocessing";

const style = { width: "100%", height: "100vh", border: "none" };

export type globeListType = {
  position: [number, number, number];
  color: string;
  count: number;
  shape: string;
  image?: string;
  width: number;
  scale: number;
  hover?: boolean;
};

const Controls = () => {
  const { camera, gl } = useThree();
  return (
    <OrbitControls
      camera={camera}
      domElement={gl.domElement}
      enableRotate={false}
      enableZoom={false}
      enablePan={false}
    />
  );
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
    <Canvas style={style} shadows>
      <Stars
        radius={300}
        depth={150}
        count={8000}
        factor={8}
        saturation={3}
        fade
        speed={1}
      />
      <NuageGalactique />
      {/*       <group position={[0, 0, -6]} scale={0.2}>
          <Galaxy />
        </group>
        <Leva hidden /> */}
      <PerspectiveCamera
        makeDefault
        position={[99, 99, 1]} // Position initiale de la caméra
        fov={39}
        ref={cameraRef} // Attacher le ref ici
      />
      <directionalLight intensity={0.5} position={[5, 5, 5]} />
      {globeList.map((globe, index) => (
        <Globe key={index} globeItem={globe} />
      ))}
      <primitive
        object={new THREE.PointLight(0xffffff, 7000, 100, 2)}
        position={[10, 10, 10]}
      />
      <Avatar cameraRef={cameraRef} />
      <ShootingStar />
      <EffectComposer>
        <Bloom mipmapBlur luminanceThreshold={2} />
      </EffectComposer>
      {/* <FloatingCamera amplitude={0.7} speed={0.5} /> */}
      {/*  <Controls /> */}
      <BackgroundMusic
        musicUrl="son.mp3"
        volume={0.5}
        loop={true}
        playOnMount={false}
      />
      <OrbitControls enableZoom enableRotate enablePan />
    </Canvas>
  );
};
export default App;
