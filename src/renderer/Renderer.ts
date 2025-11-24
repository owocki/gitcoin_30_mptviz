import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { SceneConfig, Attractor, Reinforcement } from '../types/config';
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
  private reinforcementArrows: THREE.Group[] = [];
  private ballMeshes: THREE.Mesh[] = [];
  private trailLines: THREE.Line[] = [];
  private trailBuffers: THREE.Vector3[][] = [];

  private config: SceneConfig;
  private animationId: number | null = null;
  private isPlaying: boolean = false;
  private darkMode: boolean = true;

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
    this.initReinforcements();
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
    // const { min, max } = this.fieldKernel.getFieldRange(field);

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

    if (!this.config.render.showAxes) return;

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
    const labelColor = this.darkMode ? '#ffffff' : '#000000';
    const labels = [
      { text: this.config.labels.x, position: new THREE.Vector3(labelOffset, 0, 0), color: labelColor },
      { text: this.config.labels.y, position: new THREE.Vector3(0, labelOffset, 0), color: labelColor },
      { text: this.config.labels.z, position: new THREE.Vector3(0, 0, zLabelOffset), color: labelColor }
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
      padding?: number;
    }
  ): THREE.Sprite {
    const fontsize = parameters.fontsize || 64;
    const backgroundColor = parameters.backgroundColor || { r: 0, g: 0, b: 0, a: 0.0 };
    const textColor = parameters.textColor || '#ffffff';
    const padding = parameters.padding !== undefined ? parameters.padding : 20;

    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d')!;

    // Set font first to measure text accurately
    context.font = `Bold ${fontsize}px Arial`;

    // Measure text to determine canvas size
    const metrics = context.measureText(message);
    const textWidth = metrics.width;
    const textHeight = fontsize * 1.2; // Approximate height

    // Set canvas size dynamically based on text width (with 30% extra space)
    canvas.width = Math.max(512, textWidth * 1.3 + padding * 2);
    canvas.height = 256;

    // Re-set font after changing canvas size (canvas resize clears context)
    context.font = `Bold ${fontsize}px Arial`;

    // Draw background rectangle around text with padding
    context.fillStyle = `rgba(${backgroundColor.r},${backgroundColor.g},${backgroundColor.b},${backgroundColor.a})`;
    const rectX = canvas.width / 2 - textWidth / 2 - padding;
    const rectY = canvas.height / 2 - textHeight / 2 - padding;
    const rectWidth = textWidth + padding * 2;
    const rectHeight = textHeight + padding * 2;
    context.fillRect(rectX, rectY, rectWidth, rectHeight);

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

        // Use white text in dark mode, otherwise use attractor color
        const textColor = this.darkMode ? '#ffffff' : attractor.color;

        const sprite = this.makeTextSprite(attractor.label, {
          fontsize: 72,
          backgroundColor: { r: 0, g: 0, b: 0, a: 1.0 },
          textColor: textColor,
          padding: 8
        });

        sprite.position.set(attractor.pos.x, -attractor.pos.y, z + 0.3);
        sprite.scale.set(0.5, 0.25, 1);
        this.scene.add(sprite);
        this.attractorLabels.push(sprite);
      }
    });
  }

  private initReinforcements(): void {
    // Remove old reinforcement arrows
    this.reinforcementArrows.forEach(arrow => this.scene.remove(arrow));
    this.reinforcementArrows = [];

    const reinforcements = this.config.reinforcements || [];

    reinforcements.forEach(reinforcement => {
      const fromAttractor = this.config.attractors.find(a => a.id === reinforcement.fromId);
      const toAttractor = this.config.attractors.find(a => a.id === reinforcement.toId);

      if (!fromAttractor || !toAttractor) return;

      // Calculate Z positions for the attractors
      const fromZ = this.fieldKernel.potential(fromAttractor.pos.x, fromAttractor.pos.y, this.config.attractors)
                    * this.config.surface.zScale + 0.2;
      const toZ = this.fieldKernel.potential(toAttractor.pos.x, toAttractor.pos.y, this.config.attractors)
                  * this.config.surface.zScale + 0.2;

      // Create arrow group
      const arrowGroup = this.createCurvedArrow(
        new THREE.Vector3(fromAttractor.pos.x, -fromAttractor.pos.y, fromZ),
        new THREE.Vector3(toAttractor.pos.x, -toAttractor.pos.y, toZ),
        fromAttractor.color,
        reinforcement.strength
      );

      this.scene.add(arrowGroup);
      this.reinforcementArrows.push(arrowGroup);
    });
  }

  private createCurvedArrow(
    from: THREE.Vector3,
    to: THREE.Vector3,
    color: string,
    strength: number
  ): THREE.Group {
    const group = new THREE.Group();

    // Calculate midpoint and control point for curve
    const mid = new THREE.Vector3().lerpVectors(from, to, 0.5);

    // Calculate perpendicular offset for curve
    const direction = new THREE.Vector3().subVectors(to, from);
    const distance = direction.length();
    const perpendicular = new THREE.Vector3(-direction.y, direction.x, 0).normalize();

    // Curve to the right (positive perpendicular direction)
    const curvature = distance * 0.3;
    const controlPoint = mid.clone().add(perpendicular.multiplyScalar(curvature));

    // Create curved path using quadratic bezier
    const curve = new THREE.QuadraticBezierCurve3(from, controlPoint, to);

    // Create tube geometry for thicker line
    const tubeRadius = 0.02 * strength;
    const tubeGeometry = new THREE.TubeGeometry(curve, 50, tubeRadius, 8, false);
    const tubeMaterial = new THREE.MeshBasicMaterial({
      color: color,
      opacity: 0.9,
      transparent: true
    });
    const tube = new THREE.Mesh(tubeGeometry, tubeMaterial);
    group.add(tube);

    // Get points for arrowhead positioning
    const points = curve.getPoints(50);

    // Create arrowhead at the end
    const arrowTip = points[points.length - 1];
    const beforeTip = points[points.length - 5];
    const arrowDirection = new THREE.Vector3().subVectors(arrowTip, beforeTip).normalize();

    const arrowSize = 0.15 * strength;
    const arrowGeometry = new THREE.ConeGeometry(arrowSize * 0.5, arrowSize, 8);
    const arrowMaterial = new THREE.MeshBasicMaterial({ color: color, opacity: 0.8, transparent: true });
    const arrowHead = new THREE.Mesh(arrowGeometry, arrowMaterial);

    // Position and orient the arrowhead
    arrowHead.position.copy(arrowTip);
    arrowHead.quaternion.setFromUnitVectors(
      new THREE.Vector3(0, 1, 0),
      arrowDirection
    );

    group.add(arrowHead);

    return group;
  }

  initBalls(count: number): void {
    // Clear existing balls
    this.ballMeshes.forEach(mesh => this.scene.remove(mesh));
    this.ballMeshes = [];

    this.trailLines.forEach(line => this.scene.remove(line));
    this.trailLines = [];
    this.trailBuffers = [];

    const { radius, color: configBallColor, trail } = this.config.balls;

    // Use white in dark mode, otherwise use config color
    const ballColor = this.darkMode ? '#ffffff' : configBallColor;

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

  updateBalls(balls: Ball[], isPlaying: boolean = false, dynamicAttractors?: Attractor[]): void {
    const { surface, balls: ballConfig } = this.config;
    const attractorsToUse = dynamicAttractors || this.config.attractors;

    for (let i = 0; i < balls.length && i < this.ballMeshes.length; i++) {
      const ball = balls[i];
      const mesh = this.ballMeshes[i];

      if (isPlaying) {
        // When playing, follow physics and move toward surface based on directionality
        const surfaceZ = this.fieldKernel.potential(ball.x, ball.y, attractorsToUse) * surface.zScale;
        const targetZ = surfaceZ + ballConfig.radius * 1.5;
        const currentZ = mesh.position.z;

        // Move toward the surface based on directionality
        let newZ: number;
        if (ballConfig.directionality === 'down') {
          // Falling down: approach surface from above
          newZ = Math.max(currentZ - 0.02, targetZ);
        } else {
          // Rising up: approach surface from below
          newZ = Math.min(currentZ + 0.02, targetZ);
        }

        mesh.position.set(ball.x, -ball.y, newZ);

        // Update trail
        if (ballConfig.trail.enable && this.trailBuffers[i]) {
          const trailBuffer = this.trailBuffers[i];
          trailBuffer.push(new THREE.Vector3(ball.x, -ball.y, newZ));

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
        mesh.position.set(ball.x, -ball.y, hoverHeight);

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
      mesh.position.set(ball.x, -ball.y, height);
    }
  }

  showBalls(visible: boolean): void {
    this.ballMeshes.forEach(mesh => {
      mesh.visible = visible;
    });
    this.trailLines.forEach(line => {
      line.visible = visible;
    });
  }

  updateSurface(attractors: Attractor[]): void {
    // Regenerate surface with new attractor colors and labels
    this.initSurface();
    this.initAttractorLabels();
    this.initReinforcements();
  }

  updateSurfaceDynamic(attractors: Attractor[]): void {
    // Fast update of surface geometry for dynamic attractor changes during play
    if (!this.surfaceMesh) return;

    const { surface } = this.config;
    const { resolution, extent, zScale } = surface;

    // Sample the field with modified attractors
    const field = this.fieldKernel.sampleField(attractors, resolution, extent);

    const geometry = this.surfaceMesh.geometry;
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

    // Update geometry
    geometry.attributes.position.needsUpdate = true;
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    geometry.computeVertexNormals();
  }

  updateConfig(config: SceneConfig): void {
    this.config = config;
    // Background color is controlled by setDarkMode, not by config
    // This prevents config changes from overriding the dark mode setting
    this.updateCameraPosition();
    this.initSurface();
    this.initGrid();
    this.initAxes();
    this.initAttractorLabels();
    this.initReinforcements();
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

  setDarkMode(darkMode: boolean): void {
    // Store dark mode state
    this.darkMode = darkMode;

    // Update background color
    const backgroundColor = darkMode ? '#061514' : '#ffffff';
    this.renderer.setClearColor(new THREE.Color(backgroundColor), 1);

    // Update ball colors
    const ballColor = darkMode ? '#ffffff' : this.config.balls.color;
    this.ballMeshes.forEach(mesh => {
      (mesh.material as THREE.MeshStandardMaterial).color.set(ballColor);
    });
    this.trailLines.forEach(line => {
      (line.material as THREE.LineBasicMaterial).color.set(ballColor);
    });

    // Update axis label colors
    const labelColor = darkMode ? '#ffffff' : '#000000';
    this.axisLabels.forEach(label => this.scene.remove(label));
    this.axisLabels = [];

    if (this.config.render.showAxes) {
      const { extent } = this.config.surface;
      const size = Math.max(
        extent.xMax - extent.xMin,
        extent.yMax - extent.yMin
      );

      // Create text labels with new color
      const labelOffset = size * 0.6;
      const zLabelOffset = size * 0.3;
      const labels = [
        { text: this.config.labels.x, position: new THREE.Vector3(labelOffset, 0, 0), color: labelColor },
        { text: this.config.labels.y, position: new THREE.Vector3(0, labelOffset, 0), color: labelColor },
        { text: this.config.labels.z, position: new THREE.Vector3(0, 0, zLabelOffset), color: labelColor }
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

    // Update attractor label colors
    this.initAttractorLabels();
  }
}
