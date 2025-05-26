import { Canvas } from "@react-three/fiber";
import { Sphere } from "@react-three/drei";
import { EffectComposer, Bloom } from "@react-three/postprocessing";

function Soleil() {
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

export default Soleil;
