import { useThree } from "@react-three/fiber";
import { useEffect, useRef } from "react";
import * as THREE from "three";

export default function BackgroundMusic({
  musicUrl,
  volume,
  loop,
  playOnMount,
}: {
  musicUrl: string;
  volume: number;
  loop: boolean;
  playOnMount: boolean;
}) {
  const { camera } = useThree();
  const soundRef = useRef<THREE.Audio | null>(null);

  useEffect(() => {
    const listener = new THREE.AudioListener();
    camera.add(listener);

    const sound = new THREE.Audio(listener);
    soundRef.current = sound;

    const audioLoader = new THREE.AudioLoader();
    audioLoader.load(musicUrl, (buffer) => {
      sound.setBuffer(buffer);
      sound.setLoop(loop);
      sound.setVolume(volume);
      if (playOnMount) {
        sound.play();
      }
    });

    return () => {
      camera.remove(listener);
      sound.stop();
    };
  }, [camera]);

  return null;
}

// Removed unused customUseRef function
