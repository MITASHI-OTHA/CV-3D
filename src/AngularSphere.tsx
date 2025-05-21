import { useMemo, useRef, useState } from "react";
import { Canvas, useFrame, useLoader } from "@react-three/fiber";
import { Points, PointMaterial, Sphere, Text } from "@react-three/drei";
import { SVGLoader } from "three/examples/jsm/loaders/SVGLoader";
import * as THREE from "three";

// Composant pour les particules
function ParticleSystem() {
  const particles: any = useRef(null);
  const count = 1000;

  // Création des positions aléatoires pour les particules
  const positions = new Float32Array(count * 3);
  for (let i = 0; i < count * 3; i++) {
    positions[i] = (Math.random() - 0.5) * 10;
  }

  useFrame((state, delta) => {
    if (particles.current && particles.current.rotation) {
      particles.current.rotation.x += delta * 0.1;
      particles.current.rotation.y += delta * 0.1;
    }
  });

  return (
    <Points
      ref={particles}
      positions={positions}
      stride={3}
      frustumCulled={false}
    >
      <PointMaterial
        transparent
        color="#ff0000"
        size={0.02}
        sizeAttenuation={true}
        alphaTest={0.01}
        opacity={0.8}
      />
    </Points>
  );
}

// Composant pour la sphère avec halo
function TransparentSphere() {
  const sphereRef: any = useRef(null);

  useFrame(({ clock }) => {
    sphereRef.current.rotation.y = clock.getElapsedTime() * 0.2;
  });

  return (
    <group>
      {/* Sphère transparente */}
      <mesh ref={sphereRef}>
        <sphereGeometry args={[10, 320, 320]} />
        <meshStandardMaterial
          color="#ffffff"
          transparent
          opacity={0.2}
          roughness={0.1}
          metalness={0.1}
        />
      </mesh>

      {/* Halo rouge */}
      <mesh>
        <sphereGeometry args={[1.1, 32, 32]} />
        <meshStandardMaterial
          color="#ff0000"
          transparent
          opacity={0.3}
          emissive="#ff0000"
          emissiveIntensity={0.5}
          side={THREE.BackSide}
        />
      </mesh>
    </group>
  );
}

// Composant pour le logo Angular
function AngularLogo() {
  const texture = useLoader(
    THREE.TextureLoader,
    "/Angular_full_color_logo.svg"
  );
  const [colors] = useState(["#DD0031", "#C3002F", "#A0122E"]); // Couleurs Angular

  // Création du sprite une seule fois
  const sprite = useMemo(() => {
    const material = new THREE.SpriteMaterial({
      map: texture,
      transparent: true,
    });
    const sprite = new THREE.Sprite(material);
    sprite.scale.set(10.5, 10.5, 10.5); // Taille du logo
    return sprite;
  }, [texture]);

  // L'ajouter à une scène via une primitive
  return <primitive object={sprite} />;
}

export default function AngularSphereScene() {
  return (
    <>
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} intensity={1} />

      <TransparentSphere />
      <AngularLogo />
      <ParticleSystem />
    </>
  );
}
