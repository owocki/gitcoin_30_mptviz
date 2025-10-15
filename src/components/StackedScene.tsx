import React, { useRef, useEffect, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { SceneConfig } from '../types/config';
import { FieldKernel } from '../physics/FieldKernel';
import { getConfigFromURLString } from '../utils/urlParams';
import { DEFAULT_CONFIG } from '../config/defaults';

// Helper function to create text sprites
function makeTextSprite(
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

export const StackedScene: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const controlsRef = useRef<OrbitControls | null>(null);
  const animationIdRef = useRef<number | null>(null);

  const [urlsText, setUrlsText] = useState('');
  const [configs, setConfigs] = useState<Partial<SceneConfig>[]>([]);
  const [zSpacing, setZSpacing] = useState(0.5);

  // Initialize Three.js scene
  useEffect(() => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;

    // Setup renderer
    const renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      alpha: true,
    });
    renderer.setSize(canvas.clientWidth, canvas.clientHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setClearColor(new THREE.Color('#ffffff'), 1);
    rendererRef.current = renderer;

    // Setup scene
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    // Setup camera
    const camera = new THREE.PerspectiveCamera(
      50,
      canvas.clientWidth / canvas.clientHeight,
      0.1,
      100
    );
    // Rotated 90 degrees around z-axis: (x,y) -> (-y,x)
    camera.position.set(0, -10, 5);
    camera.lookAt(0, 0, 0);
    cameraRef.current = camera;

    // Setup orbit controls
    const controls = new OrbitControls(camera, canvas);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.target.set(0, 0, 0);
    controlsRef.current = controls;

    // Add lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0xffffff, 0.8);
    dirLight.position.set(5, 10, 7);
    scene.add(dirLight);

    // Render loop
    const renderLoop = () => {
      controls.update();
      renderer.render(scene, camera);
      animationIdRef.current = requestAnimationFrame(renderLoop);
    };
    renderLoop();

    // Handle resize
    const handleResize = () => {
      if (!canvas.parentElement || !camera || !renderer) return;
      const { clientWidth, clientHeight } = canvas.parentElement;
      camera.aspect = clientWidth / clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(clientWidth, clientHeight);
    };

    window.addEventListener('resize', handleResize);
    handleResize();

    return () => {
      window.removeEventListener('resize', handleResize);
      if (animationIdRef.current) {
        cancelAnimationFrame(animationIdRef.current);
      }
      controls.dispose();
      renderer.dispose();
    };
  }, []);

  // Render stacked fields when configs or spacing change
  useEffect(() => {
    if (!sceneRef.current || configs.length === 0) return;

    const scene = sceneRef.current;

    // Clear previous meshes
    const meshesToRemove: THREE.Object3D[] = [];
    scene.traverse((obj) => {
      if (obj instanceof THREE.Mesh || obj instanceof THREE.Line || obj instanceof THREE.GridHelper || obj instanceof THREE.AxesHelper || obj instanceof THREE.Sprite) {
        meshesToRemove.push(obj);
      }
    });
    meshesToRemove.forEach((mesh) => scene.remove(mesh));

    const fieldKernel = new FieldKernel('gaussian');

    configs.forEach((partialConfig, index) => {
      const config = { ...DEFAULT_CONFIG, ...partialConfig };
      const { surface, attractors } = config;
      const { resolution, extent, zScale } = surface;

      // Calculate z-offset for stacking
      const zOffset = index * zSpacing;

      // Sample the field
      const field = fieldKernel.sampleField(attractors, resolution, extent);

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

          // Set Z coordinate (height) with offset
          positions[idx * 3 + 2] = v * zScale + zOffset;

          // Calculate position in world space
          const x = extent.xMin + (ix / (resolution - 1)) * (extent.xMax - extent.xMin);
          const y = extent.yMin + (iy / (resolution - 1)) * (extent.yMax - extent.yMin);

          // Blend attractor colors
          let totalInfluence = 0;
          let blendedR = 0, blendedG = 0, blendedB = 0;

          attractors.forEach(attractor => {
            const dx = x - attractor.pos.x;
            const dy = y - attractor.pos.y;
            const r2 = dx * dx + dy * dy;
            const sigma2 = attractor.sigma * attractor.sigma;

            const influence = Math.abs(attractor.strength) * Math.exp(-r2 / (2 * sigma2));
            totalInfluence += influence;

            const attractorColor = new THREE.Color(attractor.color);
            blendedR += attractorColor.r * influence;
            blendedG += attractorColor.g * influence;
            blendedB += attractorColor.b * influence;
          });

          if (totalInfluence > 0) {
            colors[idx * 3] = blendedR / totalInfluence;
            colors[idx * 3 + 1] = blendedG / totalInfluence;
            colors[idx * 3 + 2] = blendedB / totalInfluence;
          } else {
            colors[idx * 3] = 0.2;
            colors[idx * 3 + 1] = 0.2;
            colors[idx * 3 + 2] = 0.2;
          }
        }
      }

      geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
      geometry.computeVertexNormals();

      // Create wireframe material
      const lineWidth = surface.wireframeLinewidth || 1;
      const material = new THREE.MeshStandardMaterial({
        vertexColors: true,
        roughness: 0.7,
        metalness: 0.2,
        side: THREE.DoubleSide,
        wireframe: true,
        wireframeLinewidth: lineWidth,
      });

      const mesh = new THREE.Mesh(geometry, material);
      scene.add(mesh);

      // Add axes only for the bottommost incentive (index 0)
      if (index === 0) {
        const size = Math.max(
          extent.xMax - extent.xMin,
          extent.yMax - extent.yMin
        );

        // Create axes helper with larger size
        // Red = X axis, Green = Y axis, Blue = Z axis
        const axesHelper = new THREE.AxesHelper(size * 0.8);
        axesHelper.position.set(0, 0, zOffset);
        scene.add(axesHelper);

        // Create text labels
        const labelOffset = size * 0.6;
        const zLabelOffset = size * 0.3;
        const labels = [
          { text: config.labels.x, position: new THREE.Vector3(labelOffset, 0, zOffset), color: '#000000' },
          { text: config.labels.y, position: new THREE.Vector3(0, labelOffset, zOffset), color: '#000000' },
          { text: config.labels.z, position: new THREE.Vector3(0, 0, zOffset + zLabelOffset), color: '#000000' }
        ];

        labels.forEach(({ text, position, color }) => {
          const sprite = makeTextSprite(text, {
            fontsize: 64,
            backgroundColor: { r: 0, g: 0, b: 0, a: 0.0 },
            textColor: color
          });
          sprite.position.copy(position);
          scene.add(sprite);
        });
      }
    });
  }, [configs, zSpacing]);

  const handleGenerate = () => {
    // Split URLs by newlines or commas
    const urls = urlsText
      .split(/[\n,]/)
      .map(url => url.trim())
      .filter(url => url.length > 0);

    const parsedConfigs: Partial<SceneConfig>[] = [];

    urls.forEach((url) => {
      const config = getConfigFromURLString(url);
      if (config) {
        parsedConfigs.push(config);
      }
    });

    setConfigs(parsedConfigs);
  };

  return (
    <div style={styles.container}>
      <div style={styles.sidebar}>
        <button
          onClick={() => window.location.hash = ''}
          style={{ ...styles.button, backgroundColor: '#6c757d', marginBottom: '20px' }}
        >
          ← Back to Single View
        </button>
        <h2 style={styles.header}>Stack Incentive Fields</h2>
        <p style={styles.description}>
          Paste URLs (one per line) to stack multiple incentive field visualizations:
        </p>
        <textarea
          value={urlsText}
          onChange={(e) => setUrlsText(e.target.value)}
          placeholder="http://localhost:5174/?cfg=...&#10;http://localhost:5174/?cfg=...&#10;http://localhost:5174/?cfg=..."
          style={styles.textarea}
          rows={10}
        />
        <button onClick={handleGenerate} style={styles.button}>
          Generate Stacked View
        </button>
        {configs.length > 0 && (
          <>
            <p style={styles.info}>
              Showing {configs.length} stacked field{configs.length !== 1 ? 's' : ''}
            </p>
            <div style={styles.spacingControls}>
              <label style={styles.spacingLabel}>
                Layer Spacing: {zSpacing.toFixed(2)}
              </label>
              <div style={styles.buttonGroup}>
                <button
                  onClick={() => setZSpacing(Math.max(0, zSpacing - 0.1))}
                  style={styles.smallButton}
                  disabled={zSpacing <= 0}
                >
                  Compress
                </button>
                <button
                  onClick={() => setZSpacing(zSpacing + 0.1)}
                  style={styles.smallButton}
                >
                  Expand
                </button>
                <button
                  onClick={() => setZSpacing(0)}
                  style={styles.smallButton}
                >
                  Merge
                </button>
              </div>
            </div>
          </>
        )}
      </div>
      <div style={styles.canvasWrapper}>
        <canvas ref={canvasRef} style={styles.canvas} />
      </div>
    </div>
  );
};

const styles: Record<string, React.CSSProperties> = {
  container: {
    width: '100%',
    height: '100vh',
    display: 'flex',
    backgroundColor: '#0a0c10',
  },
  sidebar: {
    width: '400px',
    padding: '20px',
    backgroundColor: '#1a1d23',
    color: '#e0e0e0',
    overflowY: 'auto',
    fontFamily: 'system-ui, -apple-system, sans-serif',
    borderRight: '1px solid #3a3d45',
  },
  header: {
    marginTop: 0,
    marginBottom: '15px',
    fontSize: '24px',
    fontWeight: 600,
  },
  description: {
    marginBottom: '15px',
    fontSize: '14px',
    color: '#a0a3ab',
    lineHeight: 1.5,
  },
  textarea: {
    width: '100%',
    padding: '12px',
    backgroundColor: '#2a2d35',
    border: '1px solid #3a3d45',
    borderRadius: '4px',
    color: '#e0e0e0',
    fontSize: '13px',
    fontFamily: 'monospace',
    resize: 'vertical',
    marginBottom: '15px',
    boxSizing: 'border-box',
  },
  button: {
    width: '100%',
    padding: '12px 24px',
    backgroundColor: '#4a7dff',
    border: 'none',
    borderRadius: '6px',
    color: 'white',
    fontSize: '16px',
    fontWeight: 600,
    cursor: 'pointer',
    transition: 'background-color 0.2s',
  },
  info: {
    marginTop: '15px',
    fontSize: '14px',
    color: '#66ccff',
    fontWeight: 500,
  },
  spacingControls: {
    marginTop: '15px',
    padding: '15px',
    backgroundColor: '#242730',
    borderRadius: '8px',
    border: '1px solid #3a3d45',
  },
  spacingLabel: {
    display: 'block',
    marginBottom: '10px',
    fontSize: '14px',
    color: '#e0e0e0',
    fontWeight: 500,
  },
  buttonGroup: {
    display: 'flex',
    gap: '8px',
  },
  smallButton: {
    flex: 1,
    padding: '8px 12px',
    backgroundColor: '#4a7dff',
    border: 'none',
    borderRadius: '4px',
    color: 'white',
    fontSize: '13px',
    fontWeight: 500,
    cursor: 'pointer',
    transition: 'background-color 0.2s',
  },
  canvasWrapper: {
    flex: 1,
    position: 'relative',
    overflow: 'hidden',
  },
  canvas: {
    width: '100%',
    height: '100%',
    display: 'block',
  },
};
