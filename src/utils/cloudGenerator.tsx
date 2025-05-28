import * as THREE from "three";
import { ColorPalette } from "../types/cloud";

const gaussianRandom = (center: number = 0, spread: number = 1): number => {
  const u1 = Math.random();
  const u2 = Math.random();
  const z0 = Math.sqrt(-2.0 * Math.log(u1)) * Math.cos(2.0 * Math.PI * u2);
  return center + z0 * spread;
};

const createSmokeEffect = (
  center: { x: number; y: number; z: number },
  radius: number,
  count: number
): Float32Array => {
  const positions = new Float32Array(count * 3);

  for (let i = 0; i < count; i++) {
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(2 * Math.random() - 1);
    const r = radius * Math.pow(Math.random(), 0.3); // Concentrated towards edges

    positions[i * 3] = center.x + r * Math.sin(phi) * Math.cos(theta);
    positions[i * 3 + 1] = center.y + r * Math.sin(phi) * Math.sin(theta);
    positions[i * 3 + 2] = center.z + r * Math.cos(phi);
  }

  return positions;
};

export const generateRandomCloud = (
  count: number,
  size: number,
  density: number,
  palette: ColorPalette
): [Float32Array, Float32Array, Float32Array] => {
  const positions = new Float32Array(count * 3);
  const colors = new Float32Array(count * 3);
  const sizes = new Float32Array(count);

  const cloudCenters = [];
  const cloudCount = Math.floor(3 + Math.random() * 4);

  for (let i = 0; i < cloudCount; i++) {
    cloudCenters.push({
      x: (Math.random() - 0.5) * size,
      y: (Math.random() - 0.5) * size,
      z: (Math.random() - 0.5) * size,
      radius: 0.5 + Math.random() * 1.5,
      color: new THREE.Color().setHSL(
        Math.random() * 0.1 + palette.hue,
        0.5 + Math.random() * 0.3,
        0.3 + Math.random() * 0.2
      ),
    });
  }

  // Add smoke effects around cloud centers
  for (let i = 0; i < count; i++) {
    const cloudIndex = Math.floor(Math.random() * cloudCount);
    const cloud = cloudCenters[cloudIndex];

    let x, y, z;

    if (Math.random() < 0.7) {
      // 70% dense cloud formation
      const spread = cloud.radius * density;
      x = gaussianRandom(cloud.x, spread);
      y = gaussianRandom(cloud.y, spread);
      z = gaussianRandom(cloud.z, spread);
    } else {
      // 30% smoke effect
      const smokePositions = createSmokeEffect(
        { x: cloud.x, y: cloud.y, z: cloud.z },
        cloud.radius * 2,
        1
      );
      x = smokePositions[0];
      y = smokePositions[1];
      z = smokePositions[2];
    }

    positions[i * 3] = x;
    positions[i * 3 + 1] = y;
    positions[i * 3 + 2] = z;

    const dx = x - cloud.x;
    const dy = y - cloud.y;
    const dz = z - cloud.z;
    const distSq = dx * dx + dy * dy + dz * dz;
    const dist = Math.sqrt(distSq);

    const color = cloud.color.clone();
    const edgeFade = Math.max(0, 1 - dist / (cloud.radius * 1.5)); // Increased fade radius
    color.multiplyScalar(edgeFade * 0.8 + 0.2);

    const hsl = { h: 0, s: 0, l: 0 };
    color.getHSL(hsl);

    const hue = (hsl.h + (Math.random() - 0.5) * 0.08) % 1; // Increased color variation
    const saturation = Math.min(
      1,
      Math.max(0.5, hsl.s + (Math.random() - 0.5) * 0.15)
    );
    const lightness = Math.min(
      0.6,
      Math.max(0.2, hsl.l + (Math.random() - 0.5) * 0.15)
    );

    color.setHSL(hue, saturation, lightness);

    colors[i * 3] = color.r;
    colors[i * 3 + 1] = color.g;
    colors[i * 3 + 2] = color.b;

    const sizeVariation = (1 - dist / (cloud.radius * 1.2)) * 0.8 + 0.2;
    sizes[i] =
      (0.5 + Math.random() * 0.5) *
      sizeVariation *
      (Math.random() < 0.3 ? 3 : 2); // Larger particles for smoke
  }

  return [positions, colors, sizes];
};
