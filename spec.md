# Spec: “Attractor Field” Web Graphic Generator

## Overview

A browser app that renders a deformable surface with gravity wells created by configurable “attractors,” then drops a chosen number of balls that move across the surface following the field. Output supports still images and GIF/WebM captures.

## Goals

* Nontechnical users can configure a scene and press Generate.
* Designers and devs can deep-link or script scenes through a JSON config or URL params.
* Smooth, real-time animation at 60 FPS on modern laptops.

## Tech Stack

* Rendering: WebGL2 via Three.js (fallback to 2D Canvas for stills).
* Physics: custom integrator in JS or Web Worker for scalability.
* UI: React + Zustand (or Redux) for state.
* Capture: CCapture.js or WebCodecs for GIF/WebM export.

## Coordinate System

* Logical plane: x,y in [-1, 1] or configurable world units.
* Height field z = V(x,y) computed from attractors.
* Optional axes and titles rendered as overlay in HTML/SVG.

## Configuration

### JSON Schema

```json
{
  "title": "string",
  "axes": {
    "x": "string",
    "y": "string",
    "z": "string"
  },
  "surface": {
    "resolution": 256,
    "extent": { "xMin": -1.5, "xMax": 1.5, "yMin": -1.5, "yMax": 1.5 },
    "easing": "none|saturate", 
    "zScale": 1.0
  },
  "attractors": [
    {
      "id": "a1",
      "pos": { "x": -0.5, "y": 0.2 },
      "strength": 5.0,      
      "sigma": 0.12,        
      "color": "#ffcc33"
    }
  ],
  "balls": {
    "count": 12,             
    "spawn": "random|grid|manual",
    "manualPositions": [],   
    "radius": 0.015,
    "color": "#66ccff",
    "trail": { "enable": true, "length": 160, "opacity": 0.45 },
    "physics": {
      "dt": 0.016,
      "damping": 0.92,
      "noise": 0.0,
      "maxSpeed": 2.5,
      "stickiness": 0.0      
    }
  },
  "labels": {
    "title": "Gravity Field",
    "x": "X",
    "y": "Y",
    "z": "Potential"
  },
  "camera": {
    "azimuth": 35,
    "elevation": 60,
    "distance": 3.2,
    "autoOrbit": false
  },
  "render": {
    "grid": { "show": true, "divisions": 40, "color": "#ffffff33" },
    "colormap": "viridis|magma|heat|custom",
    "lighting": { "ao": 0.5, "specular": 0.2 },
    "fpsCap": 60,
    "background": "#101418"
  },
  "export": {
    "type": "gif|webm|png",
    "durationSec": 6,
    "fps": 30,
    "size": { "w": 1280, "h": 720 }
  },
  "seed": 42
}
```

### Required user-visible controls

1. **Number of attractors and their strength**

   * Add/remove attractors.
   * Strength slider per attractor in range [-10, 10]. Negative values are repellers.

2. **Title**

   * Text input bound to `labels.title`.

3. **Axis titles**

   * Inputs for `labels.x`, `labels.y`, `labels.z`. Toggle visibility.

4. **Number of balls to drop**

   * Integer input bound to `balls.count`, plus Spawn mode.

### URL Param Format

`/generate?cfg=<base64url(JSON)>`
Also accept simple query overrides: `&balls=20&title=My%20Field`

## Mathematics

### Potential field

Use a smooth radial kernel per attractor to avoid singularities.
Two good options:

1. **Soft Coulomb**
   [
   V(x,y)=\sum_i k_i , \frac{1}{\sqrt{(x-x_i)^2+(y-y_i)^2+\epsilon^2}}
   ]

* `k_i = strength * sigma` scaling
* `epsilon = 0.02` world units

2. **Gaussian well**
   [
   V(x,y)=\sum_i k_i , e^{-\frac{(x-x_i)^2+(y-y_i)^2}{2\sigma_i^2}}
   ]
   Pick one globally, expose `sigma`.

### Force on a ball

Balls move along negative gradient of V on the plane:
[
\vec{F}(x,y)= -\nabla V(x,y)
]
Integrate horizontal motion, then set z from surface sample:
[
\vec{v}_{t+1}= \mathrm{damping}\cdot \vec{v}*t + \Delta t \cdot \vec{F}(x_t,y_t)
]
[
\vec{p}*{t+1}= \vec{p}*t + \Delta t \cdot \vec{v}*{t+1}
]
Clamp speed to `maxSpeed`. Add optional small noise.

### Surface rendering

* Heightfield mesh from a texture produced in fragment shader that evaluates V at each texel, or compute on CPU then upload.
* Color by normalized V, with optional bloom around attractors.

## System Design

### Modules

* **ConfigManager**: validation, defaults, seedable RNG.
* **FieldKernel**: GLSL snippets for V and ∇V, shared by surface and physics.
* **PhysicsEngine**: Web Worker loop for balls, transferable arrays for positions.
* **Renderer**: Three.js scene, materials, grid, axes, titles.
* **UI**: React panels for Attractors, Balls, Labels, Camera, Export.
* **Exporter**: frame capture and encoding.

### Data Flow

User config → ConfigManager → FieldKernel uniforms → Renderer draws surface.
PhysicsEngine steps balls each frame using ∇V, posts positions → Renderer updates meshes and trails.

### Performance Targets

* 256×256 heightfield at 60 FPS for up to 20 attractors and 200 balls.
* Graceful degradation: lower resolution or physics rate if FPS drops.

### Accessibility

* High-contrast theme option.
* Titles and axis labels as real text for screen readers.
* Keyboard controls for camera and play/pause.

### Validation and Edge Cases

* Strength outside [-10, 10] clamp with UI hint.
* Zero attractors yields flat plane.
* Overlapping attractors allowed. Provide “jitter” button to separate.
* Repellers (negative strength) produce hills. Warn that balls may roll off.

## Minimal API

### Create a scene

```ts
import { createScene } from "@attractor/engine";
const scene = createScene(canvas, configJSON);
scene.play();
```

### Update config on the fly

```ts
scene.updateConfig({ balls: { count: 50 } });
```

### Export

```ts
await scene.export({ type: "gif", durationSec: 8, fps: 30 });
```

## Pseudocode (core loop)

```ts
// worker.js
onmessage = ({ data }) => {
  const { balls, attractors, dt, damping, maxSpeed } = data;
  for (let b of balls) {
    const g = gradientV(b.x, b.y, attractors);  // ∇V
    b.vx = damping * b.vx - dt * g.x;
    b.vy = damping * b.vy - dt * g.y;
    const s = Math.hypot(b.vx, b.vy);
    if (s > maxSpeed) { b.vx *= maxSpeed / s; b.vy *= maxSpeed / s; }
    b.x += dt * b.vx; b.y += dt * b.vy;
  }
  postMessage(balls);
};
```

## Example Config

```json
{
  "labels": { "title": "Binary Wells", "x": "X", "y": "Y", "z": "Potential" },
  "surface": { "resolution": 256, "extent": { "xMin": -1, "xMax": 1, "yMin": -1, "yMax": 1 }, "zScale": 1.2 },
  "attractors": [
    { "id": "big", "pos": { "x": -0.35, "y": 0.1 }, "strength": 8.0, "sigma": 0.14, "color": "#ffaa33" },
    { "id": "small", "pos": { "x": 0.35, "y": -0.05 }, "strength": 4.5, "sigma": 0.10, "color": "#55ccff" }
  ],
  "balls": { "count": 16, "spawn": "random", "radius": 0.014, "trail": { "enable": true, "length": 200 }, "physics": { "dt": 0.016, "damping": 0.93, "maxSpeed": 2.2 } },
  "camera": { "azimuth": 40, "elevation": 62, "distance": 3.0 },
  "render": { "grid": { "show": true, "divisions": 44 }, "colormap": "heat", "background": "#0c0f12" },
  "export": { "type": "gif", "durationSec": 6, "fps": 30 },
  "seed": 7
}
```

## Acceptance Criteria

* User can set number of attractors and each strength in [-10, 10].
* User can set title and axis titles.
* User can set number of balls to drop and see them move.
* Scene is reproducible from a saved JSON or URL.
* Export produces a looping GIF or WebM matching preview.

If you want, I can turn this into a small React + Three starter and include shaders and tests.
