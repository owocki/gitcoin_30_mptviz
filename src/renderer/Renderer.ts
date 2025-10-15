import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { SceneConfig, Attractor } from '../types/config';
import { FieldKernel } from '../physics/FieldKernel';
import { Ball } from '../physics/PhysicsEngine';
import { sampleColormap, ColormapType } from './colormaps';

export class Renderer {
  private scene: THREE.Scene;
  private camera: THREE.PerspectiveCamera;
  private renderer: THREE.WebGLRenderer;
  private fieldKernel: FieldKernel;
  private controls: OrbitControls;

  private surfaceMesh: THREE.Mesh | null = null;
  private gridHelper: THREE.GridHelper | null = null;
  private axesHelper: THREE.AxesHelper | null = null;
  private axisLabels: THREE.Sprite[] = [];
  private attractorLabels: THREE.Sprite[] = [];
  private ballMeshes: THREE.Mesh[] = [];
  private trailLines: THREE.Line[] = [];
  private trailBuffers: THREE.Vector3[][] = [];

  private config: SceneConfig;
  private animationId: number | null = null;
  private isPlaying: boolean = false;

  constructor(canvas: HTMLCanvasElement, config: SceneConfig) {
    this.config = config;
    this.fieldKernel = new FieldKernel('gaussian');

    // Setup renderer
    this.renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      alpha: true,
      preserveDrawingBuffer: true // For export
    });
    this.renderer.setSize(canvas.clientWidth, canvas.clientHeight);
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.setClearColor(new THREE.Color(config.render.background), 1);

    // Setup scene
    this.scene = new THREE.Scene();

    // Setup camera
    this.camera = new THREE.PerspectiveCamera(
      50,
      canvas.clientWidth / canvas.clientHeight,
      0.1,
      100
    );
    this.updateCameraPosition();

    // Setup orbit controls
    this.controls = new OrbitControls(this.camera, canvas);
    this.controls.enableDamping = true;
    this.controls.dampingFactor = 0.05;
    this.controls.screenSpacePanning = true;
    this.controls.minDistance = 1;
    this.controls.maxDistance = 20;
    this.controls.maxPolarAngle = Math.PI;
    this.controls.target.set(0, 0.5, 0);

    // Mouse button configuration
    this.controls.mouseButtons = {
      LEFT: THREE.MOUSE.ROTATE,
      MIDDLE: THREE.MOUSE.DOLLY,
      RIGHT: THREE.MOUSE.PAN
    };

    // Add Shift+drag for panning
    this.setupShiftPanControls(canvas);

    // Add lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    this.scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0xffffff, 0.8);
    dirLight.position.set(5, 10, 7);
    this.scene.add(dirLight);

    // Initialize scene
    this.initSurface();
    this.initGrid();
    this.initAxes();
    this.initAttractorLabels();
  }

  private updateCameraPosition(): void {
    const { azimuth, elevation, distance } = this.config.camera;
    const azRad = (azimuth * Math.PI) / 180;
    const elRad = (elevation * Math.PI) / 180;

    this.camera.position.set(
      distance * Math.cos(elRad) * Math.cos(azRad),
      distance * Math.sin(elRad),
      distance * Math.cos(elRad) * Math.sin(azRad)
    );
    // Look at a point further below center to push plane toward bottom of screen
    this.camera.lookAt(0, -2.5, 0);
  }

  private setupShiftPanControls(canvas: HTMLCanvasElement): void {
    let isShiftPressed = false;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Shift') {
        isShiftPressed = true;
        // When shift is pressed, switch left mouse button to pan
        this.controls.mouseButtons.LEFT = THREE.MOUSE.PAN;
      }
    };

    const onKeyUp = (e: KeyboardEvent) => {
      if (e.key === 'Shift') {
        isShiftPressed = false;
        // When shift is released, switch left mouse button back to rotate
        this.controls.mouseButtons.LEFT = THREE.MOUSE.ROTATE;
      }
    };

    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('keyup', onKeyUp);

    // Store cleanup function for later
    (canvas as any)._cleanupShiftControls = () => {
      window.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('keyup', onKeyUp);
    };
  }

  private initSurface(): void {
    const { surface, attractors, render } = this.config;
    const { resolution, extent, zScale } = surface;

    // Sample the field
    const field = this.fieldKernel.sampleField(attractors, resolution, extent);
    const { min, max } = this.fieldKernel.getFieldRange(field);

    // Create geometry
    const geometry = new THREE.PlaneGeometry(
      extent.xMax - extent.xMin,
      extent.yMax - extent.yMin,
      resolution - 1,
      resolution - 1
    );

    const positions = geometry.attributes.position.array as Float32Array;
    const colors = new Float32Array(positions.length);

    // Update heights and colors
    for (let iy = 0; iy < resolution; iy++) {
      for (let ix = 0; ix < resolution; ix++) {
        const idx = iy * resolution + ix;
        const v = field[iy][ix];

        // Set Z coordinate (height)
        positions[idx * 3 + 2] = v * zScale;

        // Calculate position in world space
        const x = extent.xMin + (ix / (resolution - 1)) * (extent.xMax - extent.xMin);
        const y = extent.yMin + (iy / (resolution - 1)) * (extent.yMax - extent.yMin);

        // Blend attractor colors based on their influence at this point
        let totalInfluence = 0;
        let blendedR = 0, blendedG = 0, blendedB = 0;

        attractors.forEach(attractor => {
          const dx = x - attractor.pos.x;
          const dy = y - attractor.pos.y;
          const r2 = dx * dx + dy * dy;
          const sigma2 = attractor.sigma * attractor.sigma;

          // Calculate influence using gaussian
          const influence = Math.abs(attractor.strength) * Math.exp(-r2 / (2 * sigma2));
          totalInfluence += influence;

          // Parse attractor color
          const attractorColor = new THREE.Color(attractor.color);
          blendedR += attractorColor.r * influence;
          blendedG += attractorColor.g * influence;
          blendedB += attractorColor.b * influence;
        });

        // Normalize by total influence
        if (totalInfluence > 0) {
          colors[idx * 3] = blendedR / totalInfluence;
          colors[idx * 3 + 1] = blendedG / totalInfluence;
          colors[idx * 3 + 2] = blendedB / totalInfluence;
        } else {
          // Fallback color if no influence
          colors[idx * 3] = 0.2;
          colors[idx * 3 + 1] = 0.2;
          colors[idx * 3 + 2] = 0.2;
        }
      }
    }

    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    geometry.computeVertexNormals();

    // Create material with wireframe
    const lineWidth = surface.wireframeLinewidth || 1;
    const material = new THREE.MeshStandardMaterial({
      vertexColors: true,
      roughness: 0.7,
      metalness: 0.2,
      side: THREE.DoubleSide,
      wireframe: true,
      wireframeLinewidth: lineWidth
    });

    // Create mesh
    if (this.surfaceMesh) {
      this.scene.remove(this.surfaceMesh);
    }
    this.surfaceMesh = new THREE.Mesh(geometry, material);
    this.scene.add(this.surfaceMesh);
  }

  private initGrid(): void {
    if (this.gridHelper) {
      this.scene.remove(this.gridHelper);
    }

    if (!this.config.render.grid.show) return;

    const { divisions, color } = this.config.render.grid;
    const size = Math.max(
      this.config.surface.extent.xMax - this.config.surface.extent.xMin,
      this.config.surface.extent.yMax - this.config.surface.extent.yMin
    );

    this.gridHelper = new THREE.GridHelper(size, divisions, color, color);
    this.gridHelper.rotation.x = Math.PI / 2;
    this.gridHelper.position.z = -0.01;
    this.scene.add(this.gridHelper);
  }

  private initAxes(): void {
    if (this.axesHelper) {
      this.scene.remove(this.axesHelper);
    }

    // Remove old labels
    this.axisLabels.forEach(label => this.scene.remove(label));
    this.axisLabels = [];

    const { extent } = this.config.surface;
    const size = Math.max(
      extent.xMax - extent.xMin,
      extent.yMax - extent.yMin
    );

    // Create axes helper with larger size
    // Red = X axis, Green = Y axis, Blue = Z axis
    this.axesHelper = new THREE.AxesHelper(size * 0.8);
    this.scene.add(this.axesHelper);

    // Create text labels closer to the mesh
    const labelOffset = size * 0.6;
    const zLabelOffset = size * 0.3; // Z axis label much closer
    const labels = [
      { text: this.config.labels.x, position: new THREE.Vector3(labelOffset, 0, 0), color: '#000000' },
      { text: this.config.labels.y, position: new THREE.Vector3(0, labelOffset, 0), color: '#000000' },
      { text: this.config.labels.z, position: new THREE.Vector3(0, 0, zLabelOffset), color: '#000000' }
    ];

    labels.forEach(({ text, position, color }) => {
      const sprite = this.makeTextSprite(text, {
        fontsize: 64,
        backgroundColor: { r: 0, g: 0, b: 0, a: 0.0 },
        textColor: color
      });
      sprite.position.copy(position);
      this.scene.add(sprite);
      this.axisLabels.push(sprite);
    });
  }

  private makeTextSprite(
    message: string,
    parameters: {
      fontsize?: number;
      backgroundColor?: { r: number; g: number; b: number; a: number };
      textColor?: string;
    }
  ): THREE.Sprite {
    const fontsize = parameters.fontsize || 64;
    const backgroundColor = parameters.backgroundColor || { r: 0, g: 0, b: 0, a: 0.0 };
    const textColor = parameters.textColor || '#ffffff';

    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d')!;
    canvas.width = 512;
    canvas.height = 256;

    // Set font
    context.font = `Bold ${fontsize}px Arial`;
    context.fillStyle = `rgba(${backgroundColor.r},${backgroundColor.g},${backgroundColor.b},${backgroundColor.a})`;
    context.fillRect(0, 0, canvas.width, canvas.height);

    // Draw text
    context.fillStyle = textColor;
    context.textAlign = 'center';
    context.textBaseline = 'middle';
    context.fillText(message, canvas.width / 2, canvas.height / 2);

    // Create texture
    const texture = new THREE.CanvasTexture(canvas);
    texture.needsUpdate = true;

    const spriteMaterial = new THREE.SpriteMaterial({ map: texture });
    const sprite = new THREE.Sprite(spriteMaterial);
    sprite.scale.set(1.5, 0.75, 1);

    return sprite;
  }

  private initAttractorLabels(): void {
    // Remove old labels
    this.attractorLabels.forEach(label => this.scene.remove(label));
    this.attractorLabels = [];

    this.config.attractors.forEach(attractor => {
      if (attractor.label && attractor.label.trim()) {
        // Calculate height at attractor position
        const z = this.fieldKernel.potential(attractor.pos.x, attractor.pos.y, this.config.attractors)
                  * this.config.surface.zScale;

        const sprite = this.makeTextSprite(attractor.label, {
          fontsize: 48,
          backgroundColor: { r: 0, g: 0, b: 0, a: 0.0 },
          textColor: attractor.color
        });

        sprite.position.set(attractor.pos.x, attractor.pos.y, z + 0.3);
        sprite.scale.set(1.0, 0.5, 1);
        this.scene.add(sprite);
        this.attractorLabels.push(sprite);
      }
    });
  }

  initBalls(count: number): void {
    // Clear existing balls
    this.ballMeshes.forEach(mesh => this.scene.remove(mesh));
    this.ballMeshes = [];

    this.trailLines.forEach(line => this.scene.remove(line));
    this.trailLines = [];
    this.trailBuffers = [];

    const { radius, color: ballColor, trail } = this.config.balls;

    // Create ball meshes
    const geometry = new THREE.SphereGeometry(radius, 16, 16);
    const material = new THREE.MeshStandardMaterial({
      color: ballColor,
      roughness: 0.4,
      metalness: 0.6
    });

    for (let i = 0; i < count; i++) {
      const mesh = new THREE.Mesh(geometry, material);
      this.scene.add(mesh);
      this.ballMeshes.push(mesh);

      if (trail.enable) {
        this.trailBuffers.push([]);
        const lineGeometry = new THREE.BufferGeometry();
        const lineMaterial = new THREE.LineBasicMaterial({
          color: ballColor,
          opacity: trail.opacity,
          transparent: true
        });
        const line = new THREE.Line(lineGeometry, lineMaterial);
        this.scene.add(line);
        this.trailLines.push(line);
      }
    }
  }

  updateBalls(balls: Ball[], isPlaying: boolean = false): void {
    const { surface, balls: ballConfig } = this.config;

    for (let i = 0; i < balls.length && i < this.ballMeshes.length; i++) {
      const ball = balls[i];
      const mesh = this.ballMeshes[i];

      if (isPlaying) {
        // When playing, follow physics and rest on surface
        const z = this.fieldKernel.potential(ball.x, ball.y, this.config.attractors) * surface.zScale;
        mesh.position.set(ball.x, ball.y, z + ballConfig.radius * 1.5);

        // Update trail
        if (ballConfig.trail.enable && this.trailBuffers[i]) {
          const trailBuffer = this.trailBuffers[i];
          trailBuffer.push(new THREE.Vector3(ball.x, ball.y, z));

          if (trailBuffer.length > ballConfig.trail.length) {
            trailBuffer.shift();
          }

          const positions = new Float32Array(trailBuffer.length * 3);
          trailBuffer.forEach((pos, idx) => {
            positions[idx * 3] = pos.x;
            positions[idx * 3 + 1] = pos.y;
            positions[idx * 3 + 2] = pos.z;
          });

          this.trailLines[i].geometry.setAttribute(
            'position',
            new THREE.BufferAttribute(positions, 3)
          );
        }
      } else {
        // When not playing, hover above the field at initial positions
        const hoverHeight = 0.8;
        mesh.position.set(ball.x, ball.y, hoverHeight);

        // Clear trails when not playing
        if (ballConfig.trail.enable && this.trailBuffers[i]) {
          this.trailBuffers[i] = [];
          this.trailLines[i].geometry.setAttribute(
            'position',
            new THREE.BufferAttribute(new Float32Array(0), 3)
          );
        }
      }
    }
  }

  positionBallsAtHeight(balls: Ball[], height: number): void {
    for (let i = 0; i < balls.length && i < this.ballMeshes.length; i++) {
      const ball = balls[i];
      const mesh = this.ballMeshes[i];
      mesh.position.set(ball.x, ball.y, height);
    }
  }

  updateSurface(attractors: Attractor[]): void {
    // Regenerate surface with new attractor colors and labels
    this.initSurface();
    this.initAttractorLabels();
  }

  updateConfig(config: SceneConfig): void {
    this.config = config;
    this.renderer.setClearColor(new THREE.Color(config.render.background), 1);
    this.updateCameraPosition();
    this.initSurface();
    this.initGrid();
    this.initAxes();
    this.initAttractorLabels();
  }

  render(): void {
    this.controls.update();
    this.renderer.render(this.scene, this.camera);
  }

  resize(width: number, height: number): void {
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(width, height);
  }

  getCanvas(): HTMLCanvasElement {
    return this.renderer.domElement;
  }

  getRenderer(): THREE.WebGLRenderer {
    return this.renderer;
  }

  destroy(): void {
    if (this.animationId !== null) {
      cancelAnimationFrame(this.animationId);
    }

    // Cleanup shift pan controls
    const canvas = this.renderer.domElement;
    if ((canvas as any)._cleanupShiftControls) {
      (canvas as any)._cleanupShiftControls();
    }

    this.controls.dispose();
    this.renderer.dispose();
  }

  getControls(): OrbitControls {
    return this.controls;
  }
}
