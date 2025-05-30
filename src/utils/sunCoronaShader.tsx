// src/sunCoronaShader.js

export const sunCoronaVertexShader = `
  varying vec3 vNormal;
  varying vec3 vViewPosition; // Position du vertex dans l'espace caméra

  void main() {
    vNormal = normalize(normalMatrix * normal);
    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
    vViewPosition = -mvPosition.xyz; // Vecteur du vertex vers la caméra
    gl_Position = projectionMatrix * mvPosition;
  }
`;

export const sunCoronaFragmentShader = `
  uniform vec3 uGlowColor;
  uniform float uFresnelPower; // Contrôle l'épaisseur et l'intensité du Fresnel

  varying vec3 vNormal;
  varying vec3 vViewPosition;

  void main() {
    float fresnel = dot(normalize(vViewPosition), vNormal);
    fresnel = pow(1.0 - fresnel, uFresnelPower); // Effet Fresnel

    gl_FragColor = vec4(uGlowColor, fresnel * 0.8); // L'alpha est basé sur le Fresnel
  }
`;
