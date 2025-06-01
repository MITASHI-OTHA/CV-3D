import * as THREE from "three";
import { useRef, useState, useEffect } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { Trail } from "@react-three/drei";

export function ShootingStar() {
  const ref = useRef<THREE.Mesh>(null);
  const { camera, size } = useThree();
  const [active, setActive] = useState(false);
  const [startTime, setStartTime] = useState(0);
  const [startPos, setStartPos] = useState(new THREE.Vector3());
  const [direction, setDirection] = useState(new THREE.Vector3());

  const generateStar = () => {
    // Calculer la taille du viewport (frustum) à la profondeur de la caméra
    let width = 0,
      height = 0;
    if ((camera as THREE.PerspectiveCamera).isPerspectiveCamera) {
      const perspectiveCamera = camera as THREE.PerspectiveCamera;
      const distance = perspectiveCamera.position.z;
      const fov = (perspectiveCamera.fov * Math.PI) / 180; // en radians
      height = 2 * Math.tan(fov / 2) * distance;
      width = height * perspectiveCamera.aspect;
    } else if ((camera as THREE.OrthographicCamera).isOrthographicCamera) {
      const orthoCamera = camera as THREE.OrthographicCamera;
      width = orthoCamera.right - orthoCamera.left;
      height = orthoCamera.top - orthoCamera.bottom;
    }

    // Point de départ : coin supérieur droit
    const x = width / 2;
    const y = height / 2;
    const z = 0; // au centre en profondeur

    setStartPos(new THREE.Vector3(x, y, z));
    setDirection(new THREE.Vector3(100, -1, 0).normalize());
    setStartTime(performance.now() / 1000);
    setActive(true);
  };

  useEffect(() => {
    const timer = setInterval(() => {
      generateStar();
    }, Math.random() * 5000 + 3000);
    console.log("ShootingStar effect started ", Math.random() * 5000 + 3000);
    return () => clearInterval(timer);
  }, [camera]);

  useFrame(({ clock }) => {
    if (!active || !ref.current) return;
    ref.current.renderOrder = 0;
    const elapsed = clock.getElapsedTime() - startTime;
    if (elapsed > 10) {
      setActive(false);
      return;
    }
    const pos = startPos
      .clone()
      .add(direction.clone().multiplyScalar(elapsed * 10));
    ref.current.position.copy(pos);
  });

  /*useFrame((state) => {
    const t = state.clock.getElapsedTime() * 2;
    if (ref.current) {
      ref.current.position.set(
        Math.sin(t) * 4,
        Math.atan(t) * Math.cos(t / 2) * 2,
        Math.cos(t) * 4
      );
    }
  });*/

  return active ? (
    <Trail
      width={5}
      length={1}
      color={new THREE.Color(2, 1, 10)}
      attenuation={(t) => t * 1}
    >
      <mesh ref={ref}>
        <sphereGeometry args={[0.25]} />
        <meshBasicMaterial color={[10, 1, 10]} toneMapped={false} />
      </mesh>
    </Trail>
  ) : null;
}
