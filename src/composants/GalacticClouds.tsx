import { useRef, useMemo, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import { PerspectiveCamera } from "@react-three/drei";
import * as THREE from "three";
import { CloudParameters } from "../types/cloud";
import { generateRandomCloud } from "../utils/cloudGenerator";

interface GalacticCloudsProps {
  cloudParams: CloudParameters;
}

const GalacticClouds = ({ cloudParams }: GalacticCloudsProps) => {
  const particlesRef = useRef<THREE.Points>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera>(null);

  const [positions, colors, sizes] = useMemo(() => {
    return generateRandomCloud(
      cloudParams.particleCount,
      cloudParams.cloudSize,
      cloudParams.cloudDensity,
      cloudParams.colorPalette
    );
  }, [cloudParams]);

  const geometry = useMemo(() => {
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute(
      "position",
      new THREE.Float32BufferAttribute(positions, 3)
    );
    geometry.setAttribute("color", new THREE.Float32BufferAttribute(colors, 3));
    geometry.setAttribute("size", new THREE.Float32BufferAttribute(sizes, 1));
    return geometry;
  }, [positions, colors, sizes]);

  const material = useMemo(() => {
    const texture = new THREE.TextureLoader().load("/particle.png");
    return new THREE.PointsMaterial({
      size: 0.15, // Increased base size for better smoke effect
      sizeAttenuation: true,
      map: texture,
      transparent: true,
      vertexColors: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      opacity: 0.8, // Slightly reduced opacity for atmospheric effect
    });
  }, []);

  useFrame(({ clock }) => {
    if (particlesRef.current) {
      particlesRef.current.rotation.y = clock.getElapsedTime() * 0.03; // Slower rotation

      const positions = particlesRef.current.geometry.attributes.position
        .array as Float32Array;
      for (let i = 0; i < positions.length; i += 3) {
        const t = clock.getElapsedTime() + i;
        // More pronounced swirling motion
        positions[i] += Math.sin(t * 0.0015) * 0.003;
        positions[i + 1] += Math.cos(t * 0.0012) * 0.003;
        positions[i + 2] += Math.sin(t * 0.001) * 0.003;
      }
      particlesRef.current.geometry.attributes.position.needsUpdate = true;
    }

    if (cameraRef.current) {
      const t = clock.getElapsedTime();
      cameraRef.current.position.x = Math.sin(t * 0.1) * 1.5;
      cameraRef.current.position.y = Math.cos(t * 0.1) * 1.5;
      cameraRef.current.lookAt(0, 0, 0);
    }
  });

  return (
    <>
      <PerspectiveCamera
        makeDefault
        position={[0, 0, 5]}
        ref={cameraRef}
        fov={75}
        near={0.1}
        far={1000}
      />
      <ambientLight intensity={0.5} />
      <directionalLight position={[10, 10, 5]} intensity={1} />
      <points ref={particlesRef} geometry={geometry} material={material} />
    </>
  );
};

export default GalacticClouds;
