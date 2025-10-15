import { SceneConfig } from '../types/config';

export const DEFAULT_CONFIG: SceneConfig = {
  title: 'Attractor Field',
  surface: {
    resolution: 256,
    extent: { xMin: -1.5, xMax: 1.5, yMin: -1.5, yMax: 1.5 },
    easing: 'none',
    zScale: 1.0
  },
  attractors: [
    {
      id: 'a1',
      pos: { x: -0.5, y: 0.2 },
      strength: 5.0,
      sigma: 0.12,
      color: '#ffcc33'
    },
    {
      id: 'a2',
      pos: { x: 0.5, y: -0.2 },
      strength: 3.0,
      sigma: 0.10,
      color: '#66ccff'
    }
  ],
  balls: {
    count: 12,
    spawn: 'random',
    manualPositions: [],
    radius: 0.015,
    color: '#66ccff',
    trail: { enable: true, length: 160, opacity: 0.45 },
    physics: {
      dt: 0.016,
      damping: 0.92,
      noise: 0.0,
      maxSpeed: 2.5,
      stickiness: 0.0
    }
  },
  labels: {
    title: 'Gravity Field',
    x: 'X',
    y: 'Y',
    z: 'Potential'
  },
  camera: {
    azimuth: 270,
    elevation: 250,
    distance: 4.5,
    autoOrbit: false
  },
  render: {
    grid: { show: true, divisions: 40, color: '#ffffff33' },
    colormap: 'viridis',
    lighting: { ao: 0.5, specular: 0.2 },
    fpsCap: 60,
    background: '#101418'
  },
  export: {
    type: 'gif',
    durationSec: 6,
    fps: 30,
    size: { w: 1280, h: 720 }
  },
  seed: 42
};
