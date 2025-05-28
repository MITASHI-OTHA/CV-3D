import React, { useRef } from "react";
import { Canvas, extend, useThree, useFrame } from "@react-three/fiber";
import {
  CubeTextureLoader,
  CubeCamera,
  WebGLCubeRenderTarget,
  RGBFormat,
  LinearMipmapLinearFilter,
} from "three";
import { OrbitControls } from "@react-three/drei";

// Remove custom 'orbitControls' JSX element declaration, not needed for PascalCase OrbitControls

const CameraControls = () => {
  // Use OrbitControls from @react-three/drei directly as a JSX component.
  return <OrbitControls autoRotate={false} enableZoom={false} />;
};

// SkyBox component
function SkyBox() {
  const { scene } = useThree();
  // Load skybox textures
  const loader = new CubeTextureLoader();
  const texture = loader.load([
    "/10.jpg",
    "/1.jpg",
    "/1.jpg",
    "/1.jpg",
    "/1.jpg",
    "/1.jpg",
  ]);

  // Set the scene background property to the resulting texture.
  scene.background = texture;
  return null;
}

// Sphere component
function Sphere() {
  return (
    <mesh visible position={[0, 0, 0]} rotation={[0, 0, 0]} castShadow>
      <directionalLight intensity={0.5} />
      <meshBasicMaterial
        attach="material"
        // envMap prop removed because cubeCamera is not defined
        color="white"
      />
    </mesh>
  );
}

// Lights
function GalaxyCloud() {
  return (
    <>
      <SkyBox />
    </>
  );
}

export default GalaxyCloud;
