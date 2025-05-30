import React, { useRef, useMemo } from "react";
import { Canvas, useFrame, extend } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import * as THREE from "three";
import {
  sunSurfaceFragmentShader,
  sunSurfaceVertexShader,
} from "../utils/sunSurfaceShader";
import {
  sunCoronaFragmentShader,
  sunCoronaVertexShader,
} from "../utils/sunCoronaShader";
import { EffectComposer, Bloom } from "@react-three/postprocessing";

// On doit étendre ShaderMaterial pour l'utiliser de manière déclarative en JSX
// extend({ SunSurfaceMaterial: THREE.ShaderMaterial });
// extend({ SunCoronaMaterial: THREE.ShaderMaterial });
// -> Plus besoin avec les versions récentes de R3F si on passe les shaders en props de shaderMaterial

function Sun({
  size = 2,
  position = [0, 0, 0],
}: {
  size?: number;
  position?: [number, number, number];
}) {
  const surfaceRef = useRef<THREE.Mesh>(null);
  const coronaRef = useRef<THREE.Mesh>(null);

  const sunSurfaceUniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uColor1: { value: new THREE.Color("#FFA500") }, // Orange
      uColor2: { value: new THREE.Color("#FF4500") }, // Rouge orangé
    }),
    []
  );

  const sunCoronaUniforms = useMemo(
    () => ({
      uGlowColor: { value: new THREE.Color("#FFD700") }, // Jaune doré
      uFresnelPower: { value: 4.0 }, // Plus la valeur est haute, plus le bord est fin et intense
    }),
    []
  );

  useFrame((state, delta) => {
    const time = state.clock.getElapsedTime();
    if (
      surfaceRef.current &&
      surfaceRef.current.material &&
      (surfaceRef.current.material as THREE.ShaderMaterial).uniforms
    ) {
      (
        surfaceRef.current.material as THREE.ShaderMaterial
      ).uniforms.uTime.value = time;
    }
    // On pourrait aussi faire tourner la couronne différemment
    if (coronaRef.current) {
      coronaRef.current.rotation.y += delta * 0.01;
      coronaRef.current.rotation.x += delta * 0.005;
    }
  });

  return (
    <group position={position}>
      {/* Lumière émise par le soleil */}
      <pointLight
        color="#FFA500"
        intensity={300} // Augmentez pour un effet plus fort sur la scène
        distance={300} // Portée de la lumière
        decay={2} // Atténuation réaliste
      />

      {/* Surface du Soleil */}
      <mesh ref={surfaceRef} scale={[size, size, size]}>
        <sphereGeometry args={[1, 64, 64]} />{" "}
        {/* Rayon 1, donc la taille est contrôlée par scale */}
        <shaderMaterial
          vertexShader={sunSurfaceVertexShader}
          fragmentShader={sunSurfaceFragmentShader}
          uniforms={sunSurfaceUniforms}
        />
      </mesh>

      {/* Couronne Solaire */}
      <mesh ref={coronaRef} scale={[size * 1.2, size * 1.2, size * 1.2]}>
        {" "}
        {/* Légèrement plus grande */}
        <sphereGeometry args={[1, 64, 64]} />
        <shaderMaterial
          vertexShader={sunCoronaVertexShader}
          fragmentShader={sunCoronaFragmentShader}
          uniforms={sunCoronaUniforms}
          transparent={true}
          blending={THREE.AdditiveBlending} // Pour un effet de lueur
          side={THREE.BackSide} // Rendre l'intérieur pour que l'effet Fresnel soit visible de l'extérieur
        />
      </mesh>
    </group>
  );
}

export default function App() {
  return (
    <>
      <Sun size={3} position={[0, 0, 0]} />
      {/* Vous pouvez ajouter d'autres objets pour voir l'effet de la pointLight */}
      {/* <mesh position={[5, 0, 0]}>
        <boxGeometry />
        <meshStandardMaterial color="gray" />
      </mesh> */}
    </>
  );
}
