import { Html, OrbitControls } from "@react-three/drei";
import { Canvas, useFrame } from "@react-three/fiber";
import { BufferAttribute } from "three";
import { useMemo, useRef } from "react";
import * as THREE from "three";

const ReactLogoHtml = () => {
  return (
    <Html center>
      <img src="/React-icon.png" width={80} alt="React Logo" />
    </Html>
  );
};

const CustomGeometryParticles = (props: any) => {
  const { count, shape, position } = props;
  const points: any = useRef(null);
  const groupRef = useRef<THREE.Group>(null);
  const positions = new Float32Array(count * 3);

  const particlesPosition = useMemo(() => {
    const positions = new Float32Array(count * 3);

    if (shape === "box") {
      for (let i = 0; i < count; i++) {
        let x = (Math.random() - 0.5) * 2;
        let y = (Math.random() - 0.5) * 2;
        let z = (Math.random() - 0.5) * 2;
        positions.set([x, y, z], i * 3);
      }
    }

    if (shape === "sphere") {
      const distance = 1;
      for (let i = 0; i < count; i++) {
        const theta = THREE.MathUtils.randFloatSpread(360);
        const phi = THREE.MathUtils.randFloatSpread(360);
        let x = distance * Math.sin(theta) * Math.cos(phi);
        let y = distance * Math.sin(theta) * Math.sin(phi);
        let z = distance * Math.cos(theta);
        positions.set([x, y, z], i * 3);
      }
    }

    return positions;
  }, [count, shape]);

  // ✅ Ajoute la rotation ici
  useFrame(() => {
    if (groupRef.current && groupRef.current.rotation) {
      groupRef.current.rotation.y += 0.002;
    }
  });

  return (
    <group ref={groupRef} position={position}>
      <points>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[particlesPosition, 3]}
          />
        </bufferGeometry>
        <ReactLogoHtml />
        <pointsMaterial
          size={0.015}
          color="#5786F5"
          sizeAttenuation
          depthWrite={false}
        />
      </points>
    </group>
  );
};

interface GlobeProps {
  position?: [number, number, number];
}

const Globe = ({ position }: GlobeProps) => {
  return (
    <>
      <ambientLight intensity={0.5} />
      <CustomGeometryParticles
        count={2000}
        shape="sphere"
        position={position}
      />
      <OrbitControls />
    </>
  );
};

export default Globe;
