export interface Vec2 {
  x: number;
  y: number;
}

export interface Extent {
  xMin: number;
  xMax: number;
  yMin: number;
  yMax: number;
}

export interface Attractor {
  id: string;
  pos: Vec2;
  strength: number;
  sigma: number;
  color: string;
}

export interface SurfaceConfig {
  resolution: number;
  extent: Extent;
  easing: 'none' | 'saturate';
  zScale: number;
  wireframeLinewidth?: number;
}

export interface TrailConfig {
  enable: boolean;
  length: number;
  opacity: number;
}

export interface PhysicsConfig {
  dt: number;
  damping: number;
  noise: number;
  maxSpeed: number;
  stickiness: number;
}

export interface BallsConfig {
  count: number;
  spawn: 'random' | 'grid' | 'manual';
  manualPositions: Vec2[];
  radius: number;
  color: string;
  trail: TrailConfig;
  physics: PhysicsConfig;
}

export interface LabelsConfig {
  title: string;
  x: string;
  y: string;
  z: string;
}

export interface CameraConfig {
  azimuth: number;
  elevation: number;
  distance: number;
  autoOrbit: boolean;
}

export interface GridConfig {
  show: boolean;
  divisions: number;
  color: string;
}

export interface LightingConfig {
  ao: number;
  specular: number;
}

export interface RenderConfig {
  grid: GridConfig;
  colormap: 'viridis' | 'magma' | 'heat' | 'custom';
  lighting: LightingConfig;
  fpsCap: number;
  background: string;
}

export interface ExportSize {
  w: number;
  h: number;
}

export interface ExportConfig {
  type: 'gif' | 'webm' | 'png';
  durationSec: number;
  fps: number;
  size: ExportSize;
}

export interface SceneConfig {
  title?: string;
  axes?: {
    x: string;
    y: string;
    z: string;
  };
  surface: SurfaceConfig;
  attractors: Attractor[];
  balls: BallsConfig;
  labels: LabelsConfig;
  camera: CameraConfig;
  render: RenderConfig;
  export: ExportConfig;
  seed: number;
}
