export interface ColorPalette {
  hue: number; // Base hue (0-1)
  saturation: number; // Base saturation (0-1)
  lightness: number; // Base lightness (0-1)
}

export interface CloudParameters {
  particleCount: number;
  cloudSize: number;
  cloudDensity: number;
  colorPalette: ColorPalette;
}
