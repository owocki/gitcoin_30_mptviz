import * as THREE from 'three';

export type ColormapType = 'viridis' | 'magma' | 'heat' | 'custom';

/**
 * Colormap definitions (simplified versions)
 */
export const COLORMAPS: Record<ColormapType, THREE.Color[]> = {
  viridis: [
    new THREE.Color(0x1a0033),
    new THREE.Color(0x2d1e5f),
    new THREE.Color(0x1e5a6d),
    new THREE.Color(0x287d5c)
  ],
  magma: [
    new THREE.Color(0x000004),
    new THREE.Color(0x3b0f70),
    new THREE.Color(0x8c2981),
    new THREE.Color(0xde4968),
    new THREE.Color(0xfe9f6d),
    new THREE.Color(0xfcfdbf)
  ],
  heat: [
    new THREE.Color(0x000000),
    new THREE.Color(0xff0000),
    new THREE.Color(0xffff00),
    new THREE.Color(0xffffff)
  ],
  custom: [
    new THREE.Color(0x0c0f12),
    new THREE.Color(0x1a4d6f),
    new THREE.Color(0x66ccff),
    new THREE.Color(0xffcc33)
  ]
};

/**
 * Sample a colormap at position t ∈ [0, 1]
 */
export function sampleColormap(colormap: ColormapType, t: number): THREE.Color {
  const colors = COLORMAPS[colormap];
  const clamped = Math.max(0, Math.min(1, t));
  const scaled = clamped * (colors.length - 1);
  const idx = Math.floor(scaled);
  const frac = scaled - idx;

  if (idx >= colors.length - 1) {
    return colors[colors.length - 1].clone();
  }

  const c1 = colors[idx];
  const c2 = colors[idx + 1];
  return c1.clone().lerp(c2, frac);
}
