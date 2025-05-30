import React, { useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import * as THREE from "three";
import { createNoise3D } from "simplex-noise";

// Crée une instance de bruit 3D
const noise3D = createNoise3D();

function GalacticClouds({ count = 20000, radius = 5, particleSize = 0.03 }) {
  const pointsRef = useRef<THREE.Points>(null);

  // Génère les positions et les couleurs des particules en utilisant useMemo pour la performance
  const [positions, colors] = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const col = new Float32Array(count * 3);

    const baseColor1 = new THREE.Color("#673ab7"); // Violet
    const baseColor2 = new THREE.Color("#2196f3"); // Bleu
    const accentColor = new THREE.Color("#ffffff"); // Blanc (pour les étoiles/noyaux)

    for (let i = 0; i < count; i++) {
      const i3 = i * 3;

      // Génère une position aléatoire dans une sphère
      const r = radius * Math.cbrt(Math.random()); // Distribution plus uniforme dans la sphère
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(Math.random() * 2 - 1);

      let x = r * Math.sin(phi) * Math.cos(theta);
      let y = r * Math.sin(phi) * Math.sin(theta);
      let z = r * Math.cos(phi);

      // Applique le bruit pour créer des amas (facteur de bruit)
      const noiseFactor = 0.5; // Ajustez pour plus ou moins de "grumeaux"
      const noiseScale = 100.5; // Ajustez l'échelle du bruit
      const noise = noise3D(x * noiseScale, y * noiseScale, z * noiseScale);

      // Déplace les particules en fonction du bruit
      x += noise * noiseFactor;
      y += noise * noiseFactor;
      z += noise * noiseFactor;

      pos[i3] = x;
      pos[i3 + 1] = y;
      pos[i3 + 2] = z;

      // Génère la couleur en fonction de la position et/ou du bruit
      const noiseColorFactor = (noise + 1) / 2; // Normalise le bruit entre 0 et 1
      const color = new THREE.Color();
      color.lerpColors(baseColor1, baseColor2, Math.random()); // Mélange les couleurs de base

      // Ajoute des accents blancs/brillants en fonction du bruit (zones denses)
      if (noise > 0.3) {
        color.lerp(accentColor, (noise - 0.3) * 2);
      }

      col[i3] = color.r;
      col[i3 + 1] = color.g;
      col[i3 + 2] = color.b;
    }

    return [pos, col];
  }, [count, radius]);

  // Fait tourner lentement les nuages
  useFrame((state, delta) => {
    if (pointsRef.current) {
      pointsRef.current.rotation.y += delta * 0.02;
      pointsRef.current.rotation.x += delta * 0.005;
    }
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-color" args={[colors, 3]} />
      </bufferGeometry>
      <pointsMaterial
        size={particleSize}
        vertexColors={true} // Utilise les couleurs de vertex
        transparent={true}
        opacity={0.7}
        blending={THREE.AdditiveBlending} // Donne un effet lumineux
        depthWrite={false} // Important pour le blending additif
        sizeAttenuation={true} // Les particules semblent plus petites au loin
      />
    </points>
  );
}

// Composant principal pour afficher la scène
export default function NuageGalactique() {
  return (
    <>
      <ambientLight intensity={0.1} />
      <GalacticClouds count={1000} radius={7} />
    </>
  );
}
