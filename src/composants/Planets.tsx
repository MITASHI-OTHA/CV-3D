import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

type PlanetProps = {
  position: [number, number, number];
  color: string;
  size: number;
  rotationSpeed?: number;
};

const Planet = ({
  position,
  color,
  size,
  rotationSpeed = 0.005,
}: PlanetProps) => {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.rotation.y += rotationSpeed;
    }
  });

  return (
    <mesh ref={meshRef} position={position}>
      <sphereGeometry args={[size, 32, 32]} />
      <meshPhongMaterial
        color={color}
        shininess={10}
        specular={new THREE.Color(0x333333)}
      />
    </mesh>
  );
};

const Planets = () => {
  const planets: Omit<PlanetProps, "rotationSpeed">[] = [
    { position: [-8, 3, -5], color: "#ffd700", size: 1 }, // Golden planet
    { position: [10, -2, -8], color: "#ff9f7f", size: 1.5 }, // Pink-orange planet
    { position: [-5, -4, -3], color: "#7fb8ff", size: 0.8 }, // Blue planet
    { position: [7, 5, -6], color: "#98ff98", size: 2 }, // Green planet
    { position: [-3, 6, -4], color: "#e6e6fa", size: 0.6 }, // Lavender planet
  ];

  return (
    <group>
      <ambientLight intensity={0.3} />
      <pointLight position={[10, 10, 10]} intensity={1.5} />
      {planets.map((planet, index) => (
        <Planet
          key={index}
          {...planet}
          rotationSpeed={0.002 + Math.random() * 0.003}
        />
      ))}
    </group>
  );
};

export default Planets;
