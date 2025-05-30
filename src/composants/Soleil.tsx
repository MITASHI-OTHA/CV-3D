import { Canvas } from "@react-three/fiber";
import { Sphere } from "@react-three/drei";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

export function Soleil() {
  return (
    <>
      <ambientLight />
      <Sphere>
        <meshStandardMaterial emissive={"#FFFF00"} emissiveIntensity={10} />
      </Sphere>

      <EffectComposer>
        <Bloom
          luminanceThreshold={0}
          luminanceSmoothing={0.9}
          height={300}
          intensity={1.5}
        />
      </EffectComposer>
    </>
  );
}

export function Sun() {
  const sunRef = useRef<THREE.Mesh>(null);
  const glowRef = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    const time = clock.getElapsedTime();
    if (sunRef.current) {
      sunRef.current.rotation.y = time * 0.1;
    }
    if (
      glowRef.current &&
      (glowRef.current.material as any).uniforms &&
      (glowRef.current.material as any).uniforms.uTime
    ) {
      (glowRef.current.material as any).uniforms.uTime.value = time;
    }
  });

  return (
    <group>
      {/* Soleil principal */}
      <mesh ref={sunRef}>
        <sphereGeometry args={[1, 64, 64]} />
        <meshStandardMaterial
          emissive={"#ffcc00"}
          emissiveIntensity={2}
          color={"#ffaa00"}
          roughness={0.5}
          metalness={0.3}
        />
      </mesh>

      {/* Halo de glow */}
      <mesh ref={glowRef}>
        <sphereGeometry args={[1.2, 64, 64]} />
        <shaderMaterial
          transparent
          blending={THREE.AdditiveBlending}
          depthWrite={false}
          uniforms={{
            uTime: { value: 0 },
          }}
          vertexShader={`
            varying vec3 vNormal;
            void main() {
              vNormal = normalize(normalMatrix * normal);
              gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
            }
          `}
          fragmentShader={`
            uniform float uTime;
            varying vec3 vNormal;
            void main() {
              float intensity = pow(0.5 - dot(vNormal, vec3(0.0, 0.0, 1.0)), 4.0);
              gl_FragColor = vec4(1.0, 0.6 + 0.4 * sin(uTime), 0.0, intensity);
            }
          `}
        />
      </mesh>
    </group>
  );
}
