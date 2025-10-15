# Multi-Polar Trap Visualizer

A real-time interactive web application that visualizes gravity-like potential fields created by configurable attractors, with physics-based ball simulation and export capabilities.

## Features

- **Interactive 3D Visualization**: Real-time rendering of deformable surfaces with gravity wells using WebGL/Three.js
- **Physics Simulation**: Ball movement following potential field gradients with configurable parameters
- **Customizable Attractors**: Add, remove, and modify attractors with adjustable:
  - Position (x, y coordinates)
  - Strength (-10 to 10, negative values create repellers)
  - Sigma (field spread/radius)
  - Color
- **Visual Controls**:
  - Title and axis labels
  - Number of balls (with random/grid spawn patterns)
  - Trail visualization
  - Grid overlay
  - Colormap selection (viridis, magma, heat, custom)
- **Export Options**:
  - PNG snapshots
  - WebM video recording
- **URL Sharing**: Generate shareable links with encoded configurations

## Installation

```bash
npm install
```

## Development

```bash
npm run dev
```

Open your browser to the URL shown (typically `http://localhost:5173`)

## Building for Production

```bash
npm run build
npm run preview
```

## Usage

### Basic Controls

1. **Play/Pause**: Start or stop the physics simulation
2. **Reset**: Reset ball positions to initial state
3. **Export PNG**: Save current view as PNG image
4. **Export WebM**: Record animation as WebM video
5. **Copy Shareable Link**: Generate and copy URL with current configuration

### Attractor Controls

- **Add Attractor**: Create a new attractor at origin
- **Remove**: Delete an attractor
- **Position Sliders**: Adjust X and Y coordinates
- **Strength Slider**: Control attraction force (-10 to 10)
  - Positive values: Attractors (gravity wells)
  - Negative values: Repellers (hills)
- **Sigma Slider**: Control field spread (0.01 to 0.5)
- **Color Picker**: Choose attractor color

### Configuration

All settings can be configured via the sidebar:
- **Title**: Main title displayed on visualization
- **Axis Labels**: X, Y, Z axis labels
- **Number of Balls**: 0-200 balls in the simulation

## URL Parameters

Share specific configurations using URL parameters:

### Full Configuration
```
?cfg=<base64url-encoded-config>
```

### Simple Overrides
```
?title=My%20Field&balls=20
```

Example:
```
http://localhost:5173/?title=Binary%20Wells&balls=30
```

## Architecture

### Core Modules

- **ConfigManager** (`src/config/`): Configuration validation and defaults
- **FieldKernel** (`src/physics/FieldKernel.ts`): Mathematical field computations
  - Gaussian kernel: `V = Σ k_i * exp(-r²/(2σ²))`
  - Soft Coulomb kernel: `V = Σ k_i / sqrt(r² + ε²)`
- **PhysicsEngine** (`src/physics/PhysicsEngine.ts`): Ball simulation with Web Worker support
- **Renderer** (`src/renderer/Renderer.ts`): Three.js visualization
- **Exporter** (`src/export/Exporter.ts`): PNG/WebM export functionality

### Physics

Balls follow the negative gradient of the potential field:

```
F(x,y) = -∇V(x,y)
v_{t+1} = damping * v_t + dt * F(x_t, y_t)
p_{t+1} = p_t + dt * v_{t+1}
```

With:
- Velocity damping (default: 0.92)
- Maximum speed clamping (default: 2.5)
- Optional noise injection
- Boundary collision handling

### Performance

- Target: 60 FPS at 256×256 surface resolution
- Web Worker offloads physics to separate thread
- Efficient transferable arrays for position updates
- Support for 200+ balls with 20+ attractors

## Configuration Schema

See `spec.md` for complete JSON schema documentation.

Example minimal config:
```json
{
  "labels": { "title": "My Field", "x": "X", "y": "Y", "z": "Potential" },
  "attractors": [
    { "id": "a1", "pos": { "x": 0, "y": 0 }, "strength": 5.0, "sigma": 0.12, "color": "#ffcc33" }
  ],
  "balls": { "count": 20, "spawn": "random" }
}
```

## Browser Support

- Chrome/Edge 90+
- Firefox 88+
- Safari 15+

Requires:
- WebGL2
- Web Workers
- Canvas API
- MediaRecorder (for WebM export)

## Technologies

- **React** 18 - UI framework
- **Three.js** - 3D rendering
- **Zustand** - State management
- **TypeScript** - Type safety
- **Vite** - Build tool

## License

MIT

## Troubleshooting

### Export Not Working
- **WebM**: Requires MediaRecorder API support. Check browser compatibility.
- **PNG**: Should work in all modern browsers.

### Performance Issues
- Reduce surface resolution in config
- Decrease number of balls
- Disable trails
- Lower physics update rate

### Physics Worker Not Loading
- Fallback to main thread is automatic
- Check browser console for errors
- Ensure Vite worker configuration is correct

## Future Enhancements

- GIF export with gif.js library
- Advanced camera controls (orbit, pan, zoom)
- Multiple colormap presets
- Preset configurations gallery
- Real-time field editing with mouse
- Multiple spawn patterns (spiral, circle, etc.)
- Field visualization modes (contours, vectors)
