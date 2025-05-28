import React from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Stars } from "@react-three/drei";
import Planets from "./Planets";

const GalacticScene: React.FC = () => {
  return (
    <div className="relative w-full h-full">
      <>
        <OrbitControls
          enableZoom={true}
          enablePan={true}
          enableRotate={true}
          zoomSpeed={0.6}
          rotateSpeed={0.5}
        />
        <Stars
          radius={300}
          depth={50}
          count={8000}
          factor={6}
          saturation={0.6}
          fade
          speed={1}
        />
        <Planets />
      </>
    </div>
  );
};

export default GalacticScene;
