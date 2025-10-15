import { SceneConfig } from '../types/config';

export const DEFAULT_CONFIG: SceneConfig = {
  title: 'Attractor Field',
  surface: {
    resolution: 64,
    extent: { xMin: -2.5, xMax: 2.5, yMin: -2.5, yMax: 2.5 },
    easing: 'none',
    zScale: 1.0,
    wireframeLinewidth: 2
  },
  attractors: [
    {
      id: 'a1',
      pos: { x: -0.5, y: 0.2 },
      strength: -1.9,
      sigma: 0.5,
      color: '#ffcc33',
      label: 'Attractor 1'
    },
    {
      id: 'a2',
      pos: { x: 0, y: -0.2 },
      strength: 3.0,
      sigma: 0.40,
      color: '#66ccff',
      label: 'Attractor 2'
    },
    {
      id: 'a3',
      pos: { x: 1, y: 1.2 },
      strength: -2.0,
      sigma: 0.40,
      color: '#cc66ff',
      label: 'Attractor 3'
    }
  ],
  reinforcements: [],
  balls: {
    count: 50,
    spawn: 'random',
    manualPositions: [],
    radius: 0.015,
    color: '#66ccff',
    trail: { enable: true, length: 160, opacity: 0.45 },
    physics: {
      dt: 0.008,
      damping: 0.98,
      noise: 0.0,
      maxSpeed: 1.5,
      stickiness: 0.0
    }
  },
  labels: {
    title: 'Multi Polar Trap',
    x: '(x) design space',
    y: '(y) design space',
    z: '(z) good things'
  },
  camera: {
    azimuth: 270,
    elevation: 250,
    distance: 4.5,
    autoOrbit: false
  },
  render: {
    grid: { show: true, divisions: 40, color: '#00000033' },
    showAxes: true,
    colormap: 'viridis',
    lighting: { ao: 0.5, specular: 0.2 },
    fpsCap: 60,
    background: '#ffffff'
  },
  export: {
    type: 'gif',
    durationSec: 6,
    fps: 30,
    size: { w: 1280, h: 720 }
  },
  seed: 42
};
