// src/sunSurfaceShader.js

import * as THREE from "three";

export const sunSurfaceVertexShader = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

export const sunSurfaceFragmentShader = `
  uniform float uTime;
  uniform vec3 uColor1;
  uniform vec3 uColor2;
  varying vec2 vUv;

  // Fonction de bruit simple (pseudo-aléatoire)
  float random(vec2 st) {
    return fract(sin(dot(st.xy, vec2(12.9898, 78.233))) * 43758.5453123);
  }

  // Bruit de type Fractional Brownian Motion (FBM) simplifié
  float noise(vec2 st) {
    float value = 0.0;
    float amplitude = 0.5;
    float frequency = 0.0;
    for (int i = 0; i < 4; i++) { // Nombre d'octaves
      value += amplitude * random(st);
      st *= 2.0;
      amplitude *= 0.5;
    }
    return value;
  }

  void main() {
    vec2 uvT = vUv;
    float t = uTime * 0.1;

    // Déformation des UVs avec le temps pour l'animation
    uvT.x += noise(vec2(vUv.x * 2.0 + t, vUv.y * 2.0));
    uvT.y += noise(vec2(vUv.x * 2.0, vUv.y * 2.0 + t));

    float n = noise(uvT * 3.0); // Augmenter le multiplicateur pour plus de détails

    // Mélange des couleurs basé sur le bruit
    vec3 color = mix(uColor1, uColor2, n);

    // Zones plus claires pour simuler l'intensité
    float intensityFactor = pow(n, 2.0); // Rend les zones "bruyantes" plus lumineuses
    color = mix(color, vec3(1.0, 1.0, 0.8), intensityFactor * 0.5);


    gl_FragColor = vec4(color, 1.0);
  }
`;
