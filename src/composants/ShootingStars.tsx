import React, { useRef, useMemo, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import { Line } from "@react-three/drei";
import * as THREE from "three";
import { Line2 } from "three-stdlib";

const MAX_TRAIL_LENGTH = 30; // Nombre de points dans la traînée
const STAR_SPEED = 0.15; // Vitesse de l'étoile filante
const SPAWN_BOX_SIZE = 20; // Zone de spawn et de disparition
const STAR_BRIGHTNESS = 3; // Multiplicateur pour la couleur de la tête

// Fonction pour initialiser ou réinitialiser une étoile
function initializeStar(
  starData: React.RefObject<{
    position: THREE.Vector3;
    velocity: THREE.Vector3;
    trailPoints: THREE.Vector3[];
    colors: Float32Array;
    isVisible: boolean;
    life: number;
    initialDelay: number;
  }>
) {
  // Position de départ aléatoire sur le dessus ou les côtés de la "boîte de spawn"
  const edge = Math.floor(Math.random() * 3);
  let x, y, z;

  switch (edge) {
    case 0: // Haut
      x = (Math.random() - 0.5) * SPAWN_BOX_SIZE;
      y = SPAWN_BOX_SIZE / 2;
      z = (Math.random() - 0.5) * SPAWN_BOX_SIZE;
      break;
    case 1: // Côté X
      x = ((Math.random() > 0.5 ? 1 : -1) * SPAWN_BOX_SIZE) / 2;
      y = (Math.random() - 0.5) * SPAWN_BOX_SIZE;
      z = (Math.random() - 0.5) * SPAWN_BOX_SIZE;
      break;
    default: // Côté Z
      x = (Math.random() - 0.5) * SPAWN_BOX_SIZE;
      y = (Math.random() - 0.5) * SPAWN_BOX_SIZE;
      z = ((Math.random() > 0.5 ? 1 : -1) * SPAWN_BOX_SIZE) / 2;
      break;

      starData.current.position = new THREE.Vector3(x, y, z);

      // Vitesse aléatoire, généralement pointant vers le centre et vers le bas
      starData.current.velocity = new THREE.Vector3(
        (Math.random() - 0.5) * 0.3,
        -0.8 - Math.random() * 0.4, // Principalement vers le bas
        (Math.random() - 0.5) * 0.3
      )
        .normalize()
        .multiplyScalar(STAR_SPEED);

      starData.current.trailPoints = Array(MAX_TRAIL_LENGTH)
        .fill(null)
        .map(() => starData.current.position.clone());
      starData.current.colors = new Float32Array(MAX_TRAIL_LENGTH * 3);
      starData.current.isVisible = true;
      starData.current.life = 1.0; // Utilisé pour le fondu initial (optionnel)
      starData.current.initialDelay = Math.random() * 5; // Délai avant la première apparition
  }
}

// Composant pour une seule étoile filante (extrait la logique existante)
function ShootingStar() {
  const lineRef = useRef<Line2 | null>(null);

  // Utilisation de useRef pour stocker les données mutables de l'étoile
  // afin d'éviter des recréations inutiles par useMemo/useState qui déclencheraient des effets.
  const starData = useRef<{
    position: THREE.Vector3;
    velocity: THREE.Vector3;
    trailPoints: THREE.Vector3[];
    colors: Float32Array;
    isVisible: boolean;
    life: number;
    initialDelay: number;
  }>({
    position: new THREE.Vector3(),
    velocity: new THREE.Vector3(),
    trailPoints: [],
    colors: new Float32Array(MAX_TRAIL_LENGTH * 3),
    isVisible: false,
    life: 0,
    initialDelay: 0, // Délai avant que l'étoile n'apparaisse
  });

  // Initialisation au montage
  useEffect(() => {
    initializeStar(starData);
  }, []);

  useFrame((state, delta) => {
    if (starData.current.initialDelay > 0) {
      starData.current.initialDelay -= delta;
      return;
    }
    if (!starData.current.isVisible) return;

    // Mise à jour de la position
    starData.current.position.add(
      starData.current.velocity.clone().multiplyScalar(delta * 60)
    ); // *60 pour normaliser la vitesse par rapport à 60FPS

    // Mise à jour de la traînée
    starData.current.trailPoints.pop(); // Retire le dernier point
    starData.current.trailPoints.unshift(starData.current.position.clone()); // Ajoute le nouveau point en tête

    // Vérifier si l'étoile est hors des limites pour la réinitialiser
    if (
      Math.abs(starData.current.position.x) > SPAWN_BOX_SIZE ||
      Math.abs(starData.current.position.y) > SPAWN_BOX_SIZE ||
      Math.abs(starData.current.position.z) > SPAWN_BOX_SIZE
    ) {
      initializeStar(starData); // Réinitialise avec un nouveau délai
      return;
    }

    // Mise à jour des couleurs pour la traînée (dégradé)
    const baseColor = new THREE.Color(0xffffdd); // Jaune pâle pour la tête
    for (let i = 0; i < MAX_TRAIL_LENGTH; i++) {
      const fraction = 1 - i / MAX_TRAIL_LENGTH; // 1 à la tête, 0 à la queue
      const intensity = Math.pow(fraction, 1.5) * starData.current.life; // Fondu basé sur la vie et la position

      // La tête est beaucoup plus brillante
      const R = baseColor.r * intensity * (i === 0 ? STAR_BRIGHTNESS : 1);
      const G = baseColor.g * intensity * (i === 0 ? STAR_BRIGHTNESS : 1);
      const B = baseColor.b * intensity * (i === 0 ? STAR_BRIGHTNESS : 1);

      starData.current.colors[i * 3] = R;
      starData.current.colors[i * 3 + 1] = G;
      starData.current.colors[i * 3 + 2] = B;
    }

    if (lineRef.current) {
      // @ts-ignore Il faut parfois forcer la mise à jour des attributs de géométrie
      lineRef.current.geometry.setPositions(
        starData.current.trailPoints.flatMap((p) => [p.x, p.y, p.z])
      );
      lineRef.current.geometry.attributes.color.needsUpdate = true;
    }

    // Gérer la "vie" pour un fondu à l'apparition (optionnel)
    if (starData.current.life < 1.0) {
      starData.current.life += delta * 2; // Vitesse du fondu à l'apparition
      if (starData.current.life > 1.0) starData.current.life = 1.0;
    }
  });

  // Ne rend rien si l'étoile n'est pas visible ou en délai
  if (!starData.current.isVisible || starData.current.initialDelay > 0)
    return null;

  return (
    <Line
      ref={lineRef}
      points={starData.current.trailPoints} // Initial points
      color="white" // Couleur de base, mais sera surchargée par vertexColors
      lineWidth={3}
      vertexColors={Array.from({ length: MAX_TRAIL_LENGTH }, (_, i) => [
        starData.current.colors[i * 3],
        starData.current.colors[i * 3 + 1],
        starData.current.colors[i * 3 + 2],
      ])} // Les couleurs calculées
      transparent // Nécessaire pour que l'opacité (via la couleur) fonctionne
      opacity={0.8} // Opacité globale, mais la traînée se gère par la couleur noire
      depthWrite={false} // Souvent bien pour les effets transparents
      blending={THREE.AdditiveBlending} // Pour un effet plus lumineux
    />
  );
}

// Composant pour gérer plusieurs étoiles filantes
export default function ShootingStars({ count = 10 }) {
  return (
    <>
      {Array(count)
        .fill(0)
        .map((_, i) => (
          <ShootingStar key={i} />
        ))}
    </>
  );
}

// Exemple d'utilisation dans votre scène principale
// function App() {
//   return (
//     <Canvas camera={{ position: [0, 0, 25], fov: 50 }} style={{ background: '#000015' }}>
//       <ambientLight intensity={0.1} />
//       <ShootingStars count={15} />
//       <OrbitControls />
//     </Canvas>
//   );
// }
