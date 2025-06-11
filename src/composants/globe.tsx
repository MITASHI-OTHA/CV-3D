import { Html, OrbitControls, Trail } from "@react-three/drei";
import { Canvas, ThreeEvent, useFrame } from "@react-three/fiber";
import { BufferAttribute } from "three";
import { useCallback, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import { globeListType } from "../App";

const ReactLogoHtml: React.FC<{ image: string; width: number }> = ({
  image,
  width,
}) => {
  return (
    <Html center>
      <img src={image} width={width} alt="React Logo" />
    </Html>
  );
};

const CustomGeometryParticles = ({
  globeItem,
}: {
  globeItem: globeListType;
}) => {
  const { count, shape, position, color, image, width, scale, hover } =
    globeItem;
  const points = useRef<THREE.Points>(null);
  const groupRef = useRef<THREE.Group>(null);
  const [hovered, setHovered] = useState(hover);
  const restoring = useRef(false);
  const originalPositions = useRef<Float32Array>(new Float32Array(count * 3));
  const currentPositions = useRef<Float32Array>(new Float32Array(count * 3));
  const [scaleGlobe, setScaleGlobe] = useState(scale);
  const ref = useRef<THREE.Mesh>(null);
  const ref2 = useRef<THREE.Mesh>(null);
  const trailPosition = useRef(new THREE.Vector3());
  const trailRadius = useRef(0.6); // Paramétrable pour ajuster l'espace
  const trailSpeed = 1; // Define trail speed with an appropriate value

  // Initialisation des positions
  useMemo(() => {
    if (shape === "sphere") {
      const distance = 1;
      for (let i = 0; i < count; i++) {
        const theta = THREE.MathUtils.randFloatSpread(360);
        const phi = THREE.MathUtils.randFloatSpread(360);
        const x = distance * Math.sin(theta) * Math.cos(phi);
        const y = distance * Math.sin(theta) * Math.sin(phi);
        const z = distance * Math.cos(theta);

        originalPositions.current.set([x, y, z], i * 3);
        currentPositions.current.set([x, y, z], i * 3);
      }
    }
  }, [count, shape]);

  // Crée un tableau "fixe" au démarrage
  const positionsArray = useMemo(() => new Float32Array(count * 3), [count]);

  // Animation frame
  useFrame((state) => {
    // Rotation du groupe
    if (groupRef.current) {
      groupRef.current.rotation.y += 0.002;
    }

    if (!points.current?.geometry || !groupRef.current) return;

    const positions = points.current.geometry.attributes.position;
    const delta = state.clock.getDelta();

    if (hovered && groupRef.current) {
      setScaleGlobe(scale * 1.2);
      groupRef.current.rotation.y += 0.1;
    } else {
      setScaleGlobe(scale);
      groupRef.current.rotation.y += 0.002;
    }
    positionsArray.set(currentPositions.current);
    positions.array.set(positionsArray);
    positions.needsUpdate = true;
    points.current.geometry.attributes.position.needsUpdate = true;

    // Update trail position to stay closer to the perimeter of points
    if (ref.current && ref2.current) {
      const t = state.clock.getElapsedTime() * trailSpeed; // Use the adjustable trail speed
      const radius = trailRadius.current; // Use the adjustable trail radius

      // Trail ref movement
      trailPosition.current.set(
        Math.sin(t) * radius,
        Math.atan(t) * Math.cos(t / 2) * radius,
        Math.cos(t) * radius
      );
      ref.current.position.copy(trailPosition.current);

      // Trail ref2 movement (symmetrical)
      const symmetricalTrailPosition = new THREE.Vector3(
        -trailPosition.current.x,
        -trailPosition.current.y,
        -trailPosition.current.z
      );
      ref2.current.position.copy(symmetricalTrailPosition);
    }
  });

  // Gestion des événements
  interface PointerOverEvent extends ThreeEvent<PointerEvent> {}

  const handlePointerOver = useCallback((e: PointerOverEvent) => {
    e.stopPropagation();
    setHovered(true);
  }, []);

  const handlePointerOut = useCallback((e: PointerOverEvent) => {
    e.stopPropagation();
    setHovered(false);
  }, []);

  return (
    <group
      ref={groupRef}
      position={position}
      scale={scaleGlobe}
      onPointerOver={handlePointerOver}
      onPointerOut={handlePointerOut}
    >
      <points ref={points}>
        <Trail
          width={2}
          length={1}
          color={new THREE.Color(7, 3, 5)}
          attenuation={(t) => t * 1}
        >
          <mesh ref={ref}>
            <sphereGeometry args={[0.07]} />
            <meshBasicMaterial color={[7, 3, 5]} toneMapped={false} />
          </mesh>
        </Trail>
        <Trail
          width={2}
          length={1}
          color={new THREE.Color(7, 3, 5)}
          attenuation={(t) => t * 1}
        >
          <mesh ref={ref2}>
            <sphereGeometry args={[0.07]} />
            <meshBasicMaterial color={[7, 3, 5]} toneMapped={false} />
          </mesh>
        </Trail>
        <bufferGeometry attach="geometry">
          <bufferAttribute
            attach="attributes-position"
            array={positionsArray}
            args={[positionsArray, 3]}
          />
        </bufferGeometry>
        <ReactLogoHtml image={image ?? ""} width={width} />
        <pointsMaterial
          size={0.015}
          color={color}
          sizeAttenuation
          depthWrite={false}
        />
      </points>
    </group>
  );
};

const Globe = ({ globeItem }: { globeItem: globeListType }) => {
  return (
    <>
      {/* <ambientLight intensity={0.5} /> */}
      <CustomGeometryParticles globeItem={globeItem} />
    </>
  );
};

export default Globe;
