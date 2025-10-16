import React, { useRef, useEffect, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { SceneConfig } from '../types/config';
import { FieldKernel } from '../physics/FieldKernel';
import { getConfigFromURLString, decodeConfigFromURL } from '../utils/urlParams';
import { DEFAULT_CONFIG } from '../config/defaults';

// Helper function to create text sprites
function makeTextSprite(
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

export const StackedScene: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const controlsRef = useRef<OrbitControls | null>(null);
  const animationIdRef = useRef<number | null>(null);

  const [urlsText, setUrlsText] = useState('');

  // Initialize state from URL - LAZY INITIALIZATION (only runs once, survives Strict Mode)
  const [configs, setConfigs] = useState<Partial<SceneConfig>[]>(() => {
    console.log('[StackedScene] Initializing configs from URL');
    const hash = window.location.hash.slice(1); // Remove '#'
    const hashParams = hash.startsWith('stacked?') ? hash.slice(8) : ''; // Remove 'stacked?'
    const params = new URLSearchParams(hashParams);
    const urlsParam = params.get('urls');

    if (!urlsParam) {
      console.log('[StackedScene] No URLs in URL params');
      return [];
    }

    const urls = urlsParam.split('|');
    const parsedConfigs: Partial<SceneConfig>[] = [];

    urls.forEach((url, index) => {
      const config = getConfigFromURLString(url);
      if (config) {
        parsedConfigs.push(config);
        console.log(`[StackedScene] Parsed config ${index} from URL`);
      }
    });

    console.log('[StackedScene] Initialized with', parsedConfigs.length, 'configs');
    return parsedConfigs;
  });

  const [zSpacing, setZSpacing] = useState(() => {
    const hash = window.location.hash.slice(1);
    const hashParams = hash.startsWith('stacked?') ? hash.slice(8) : '';
    const params = new URLSearchParams(hashParams);
    const spacingParam = params.get('spacing');
    return spacingParam ? parseFloat(spacingParam) : 0.5;
  });

  const [showLabels, setShowLabels] = useState<boolean[]>(() => {
    const hash = window.location.hash.slice(1);
    const hashParams = hash.startsWith('stacked?') ? hash.slice(8) : '';
    const params = new URLSearchParams(hashParams);
    const labelsParam = params.get('labels');
    const urlsParam = params.get('urls');

    if (labelsParam) {
      return labelsParam.split(',').map(v => v === '1');
    } else if (urlsParam) {
      // Default all labels to visible
      const count = urlsParam.split('|').length;
      return Array(count).fill(true);
    }
    return [];
  });

  const [showMeshTitles, setShowMeshTitles] = useState(() => {
    const hash = window.location.hash.slice(1);
    const hashParams = hash.startsWith('stacked?') ? hash.slice(8) : '';
    const params = new URLSearchParams(hashParams);
    const titlesParam = params.get('meshTitles');
    return titlesParam === '1' || titlesParam === null; // Default to true if not specified
  });

  const [showAxisTitles, setShowAxisTitles] = useState(() => {
    const hash = window.location.hash.slice(1);
    const hashParams = hash.startsWith('stacked?') ? hash.slice(8) : '';
    const params = new URLSearchParams(hashParams);
    const axisParam = params.get('axisTitles');
    return axisParam === '1' || axisParam === null; // Default to true if not specified
  });

  const [stackTitle, setStackTitle] = useState(() => {
    const hash = window.location.hash.slice(1);
    const hashParams = hash.startsWith('stacked?') ? hash.slice(8) : '';
    const params = new URLSearchParams(hashParams);
    const titleParam = params.get('title');
    return titleParam || 'Stacked Incentive Fields';
  });

  const [animationRepeat, setAnimationRepeat] = useState(1);
  const [sceneReady, setSceneReady] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);
  const [darkMode, setDarkMode] = useState(true);
  const animationIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Debug effect to track configs changes
  useEffect(() => {
    console.log('[StackedScene] configs state changed:', configs.length, 'configs');
  }, [configs]);

  // Debug effect to track sceneReady changes
  useEffect(() => {
    console.log('[StackedScene] sceneReady state changed:', sceneReady);
  }, [sceneReady]);

  // Populate URL textarea after 0.5s on page load
  useEffect(() => {
    const timer = setTimeout(() => {
      const hash = window.location.hash.slice(1);
      const hashParams = hash.startsWith('stacked?') ? hash.slice(8) : '';
      const params = new URLSearchParams(hashParams);
      const urlsParam = params.get('urls');

      if (urlsParam) {
        const urls = urlsParam.split('|');
        const urlsString = urls.join('\n');
        console.log('[StackedScene] Populating textarea with URLs from URL params');
        setUrlsText(urlsString);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  // Auto-generate stacked view when URLs change
  useEffect(() => {
    if (!urlsText.trim()) {
      setConfigs([]);
      setShowLabels([]);
      return;
    }

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

    // Initialize label visibility for new configs
    setShowLabels(prev => {
      const newLabels = [...prev];
      while (newLabels.length < parsedConfigs.length) {
        newLabels.push(true); // Default to showing labels
      }
      return newLabels.slice(0, parsedConfigs.length);
    });
  }, [urlsText]);

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
    renderer.setClearColor(new THREE.Color(darkMode ? '#0a0c10' : '#ffffff'), 1);
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

    // Mark scene as ready
    console.log('[StackedScene] Marking scene as ready');
    setSceneReady(true);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (animationIdRef.current) {
        cancelAnimationFrame(animationIdRef.current);
      }
      controls.dispose();
      renderer.dispose();
    };
  }, [darkMode]);

  // Update background color when darkMode changes
  useEffect(() => {
    if (rendererRef.current) {
      rendererRef.current.setClearColor(new THREE.Color(darkMode ? '#0a0c10' : '#ffffff'), 1);
    }
  }, [darkMode]);

  // Render stacked fields when configs or spacing change
  useEffect(() => {
    console.log('[StackedScene] Render effect triggered', {
      sceneReady,
      hasScene: !!sceneRef.current,
      configsLength: configs.length,
      showLabelsLength: showLabels.length,
      showMeshTitles,
      showAxisTitles,
      zSpacing
    });

    if (!sceneReady) {
      console.log('[StackedScene] Scene not ready yet');
      return;
    }
    if (!sceneRef.current) {
      console.log('[StackedScene] Scene ref not set');
      return;
    }
    if (configs.length === 0) {
      console.log('[StackedScene] No configs to render');
      return;
    }

    console.log('[StackedScene] Starting to render', configs.length, 'configs');

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
      console.log(`[StackedScene] Added mesh ${index} to scene`);

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

        // Create text labels if enabled
        if (showAxisTitles) {
          const labelOffset = size * 0.6;
          const zLabelOffset = size * 0.3;
          const labelColor = darkMode ? '#ffffff' : '#000000';
          const labels = [
            { text: config.labels.x, position: new THREE.Vector3(labelOffset, 0, zOffset), color: labelColor },
            { text: config.labels.y, position: new THREE.Vector3(0, labelOffset, zOffset), color: labelColor },
            { text: config.labels.z, position: new THREE.Vector3(0, 0, zOffset + zLabelOffset), color: labelColor }
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
      }

      // Add attractor labels if enabled for this layer
      if (showLabels[index]) {
        attractors.forEach(attractor => {
          if (attractor.label && attractor.label.trim()) {
            // Calculate height at attractor position
            const z = fieldKernel.potential(attractor.pos.x, attractor.pos.y, attractors) * zScale;

            const sprite = makeTextSprite(attractor.label, {
              fontsize: 72,
              backgroundColor: { r: 0, g: 0, b: 0, a: 1.0 },
              textColor: attractor.color,
              padding: 8
            });

            sprite.position.set(attractor.pos.x, -attractor.pos.y, z + zOffset + 0.3);
            sprite.scale.set(0.5, 0.25, 1);
            scene.add(sprite);
          }
        });
      }

      // Add mesh title label if enabled
      if (showMeshTitles && config.labels.title) {
        const titleSprite = makeTextSprite(config.labels.title, {
          fontsize: 80,
          backgroundColor: { r: 0, g: 0, b: 0, a: 0.8 },
          textColor: '#ffffff',
          padding: 12
        });

        // Position the title to the right side of the mesh, elevated above the layer
        const xPos = extent.xMax + 0.5;
        const yPos = -2;
        const zPos = zOffset; // Elevated above the layer to avoid axis label overlap

        titleSprite.position.set(xPos, yPos, zPos);
        titleSprite.scale.set(1.2, 0.6, 1);
        scene.add(titleSprite);
      }

      // Add reinforcement arrows for this layer
      const reinforcements = config.reinforcements || [];
      reinforcements.forEach(reinforcement => {
        const fromAttractor = attractors.find(a => a.id === reinforcement.fromId);
        const toAttractor = attractors.find(a => a.id === reinforcement.toId);

        if (!fromAttractor || !toAttractor) return;

        // Calculate Z positions for the attractors
        const fromZ = fieldKernel.potential(fromAttractor.pos.x, fromAttractor.pos.y, attractors) * zScale + zOffset + 0.2;
        const toZ = fieldKernel.potential(toAttractor.pos.x, toAttractor.pos.y, attractors) * zScale + zOffset + 0.2;

        // Create curved arrow
        const from = new THREE.Vector3(fromAttractor.pos.x, -fromAttractor.pos.y, fromZ);
        const to = new THREE.Vector3(toAttractor.pos.x, -toAttractor.pos.y, toZ);

        // Calculate midpoint and control point for curve
        const mid = new THREE.Vector3().lerpVectors(from, to, 0.5);
        const direction = new THREE.Vector3().subVectors(to, from);
        const distance = direction.length();
        const perpendicular = new THREE.Vector3(-direction.y, direction.x, 0).normalize();

        // Curve to the right
        const curvature = distance * 0.3;
        const controlPoint = mid.clone().add(perpendicular.multiplyScalar(curvature));

        // Create curved path using quadratic bezier
        const curve = new THREE.QuadraticBezierCurve3(from, controlPoint, to);

        // Create tube geometry for thicker line
        const tubeRadius = 0.02 * reinforcement.strength;
        const tubeGeometry = new THREE.TubeGeometry(curve, 50, tubeRadius, 8, false);
        const tubeMaterial = new THREE.MeshBasicMaterial({
          color: fromAttractor.color,
          opacity: 0.9,
          transparent: true
        });
        const tube = new THREE.Mesh(tubeGeometry, tubeMaterial);
        scene.add(tube);

        // Create arrowhead at the end
        const points = curve.getPoints(50);
        const arrowTip = points[points.length - 1];
        const beforeTip = points[points.length - 5];
        const arrowDirection = new THREE.Vector3().subVectors(arrowTip, beforeTip).normalize();

        const arrowSize = 0.15 * reinforcement.strength;
        const arrowGeometry = new THREE.ConeGeometry(arrowSize * 0.5, arrowSize, 8);
        const arrowMaterial = new THREE.MeshBasicMaterial({
          color: fromAttractor.color,
          opacity: 0.9,
          transparent: true
        });
        const arrowHead = new THREE.Mesh(arrowGeometry, arrowMaterial);

        // Position and orient the arrowhead
        arrowHead.position.copy(arrowTip);
        arrowHead.quaternion.setFromUnitVectors(
          new THREE.Vector3(0, 1, 0),
          arrowDirection
        );

        scene.add(arrowHead);
      });
    });

    console.log('[StackedScene] Finished rendering all configs');
  }, [configs, zSpacing, showLabels, showMeshTitles, showAxisTitles, sceneReady, darkMode]);

  const handleUrlsChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = e.target.value;

    // Check if a URL was just pasted/typed and doesn't end with newline
    if (newValue.length > urlsText.length) {
      const addedText = newValue.slice(urlsText.length);

      // If user pasted/typed text containing http and it doesn't end with newline, add one
      if (addedText.includes('http') && !newValue.endsWith('\n') && !newValue.endsWith(',')) {
        // Check if the last line looks like a complete URL
        const lines = newValue.split('\n');
        const lastLine = lines[lines.length - 1].trim();

        // Simple heuristic: if it contains http and has a reasonable length, add newline
        if (lastLine.startsWith('http') && lastLine.length > 20) {
          setUrlsText(newValue + '\n');
          return;
        }
      }
    }

    setUrlsText(newValue);
  };

  // Share link generation - Use full URLs instead of cfg strings
  const handleShareLink = () => {
    console.log('[StackedScene] Generating share link...');

    // Get all URLs from textarea
    const urls = urlsText.split(/[\n,]/).map(u => u.trim()).filter(u => u.length > 0);
    console.log('[StackedScene] URLs from textarea:', urls);

    if (urls.length === 0) {
      console.error('[StackedScene] No URLs found');
      alert('No URLs found to share');
      return;
    }

    // Build the URL using URLSearchParams for proper encoding
    const params = new URLSearchParams();
    params.set('urls', urls.join('|')); // URLSearchParams handles encoding
    params.set('spacing', zSpacing.toString());
    params.set('labels', showLabels.map(v => v ? '1' : '0').join(','));
    params.set('title', stackTitle);
    params.set('meshTitles', showMeshTitles ? '1' : '0');
    params.set('axisTitles', showAxisTitles ? '1' : '0');

    const queryString = params.toString();
    console.log('[StackedScene] Generated query string:', queryString);

    const shareUrl = `${window.location.origin}/#stacked?${queryString}`;
    console.log('[StackedScene] Final share URL:', shareUrl);

    // Copy to clipboard
    navigator.clipboard.writeText(shareUrl)
      .then(() => {
        console.log('[StackedScene] Copied to clipboard successfully');
        setCopySuccess(true);
        setTimeout(() => setCopySuccess(false), 2000);
      })
      .catch((err) => {
        console.error('[StackedScene] Failed to copy to clipboard:', err);
        alert('Share link: ' + shareUrl);
      });
  };

  const toggleLabelVisibility = (index: number) => {
    setShowLabels(prev => {
      const newLabels = [...prev];
      newLabels[index] = !newLabels[index];
      return newLabels;
    });
  };

  const handleAnimatedSpacing = (delta: number) => {
    if (animationIntervalRef.current) {
      clearInterval(animationIntervalRef.current);
      animationIntervalRef.current = null;
    }

    let count = 0;
    animationIntervalRef.current = setInterval(() => {
      if (count >= animationRepeat) {
        if (animationIntervalRef.current) {
          clearInterval(animationIntervalRef.current);
          animationIntervalRef.current = null;
        }
        return;
      }

      setZSpacing(prev => Math.max(0, prev + delta));
      count++;
    }, 100);
  };

  // Cleanup animation interval on unmount
  useEffect(() => {
    return () => {
      if (animationIntervalRef.current) {
        clearInterval(animationIntervalRef.current);
      }
    };
  }, []);

  const currentStyles = darkMode ? styles : lightStackedStyles;

  return (
    <div style={currentStyles.outerContainer}>
      <div style={currentStyles.contentContainer}>
        <div style={currentStyles.sidebar}>
          <button
            onClick={() => window.location.hash = '#create'}
            style={{ ...currentStyles.button, backgroundColor: '#6c757d', marginBottom: '10px' }}
          >
            ← Back to Single View
          </button>
          <h2 style={currentStyles.header}>Stack Incentive Fields</h2>

        {/* Title input */}
        <div style={{ marginBottom: '15px' }}>
          <label style={currentStyles.inputLabel}>Stack Title:</label>
          <input
            type="text"
            value={stackTitle}
            onChange={(e) => setStackTitle(e.target.value)}
            placeholder="Enter a title for this stacked view"
            style={currentStyles.textInput}
          />
        </div>

        <p style={currentStyles.description}>
          Paste URLs (one per line) to stack multiple incentive field visualizations. The view updates automatically.
        </p>
        <textarea
          value={urlsText}
          onChange={handleUrlsChange}
          placeholder="http://localhost:5174/?cfg=...&#10;http://localhost:5174/?cfg=...&#10;http://localhost:5174/?cfg=..."
          style={currentStyles.textarea}
          rows={10}
        />
        {configs.length > 0 && (
          <>
            <p style={currentStyles.info}>
              Showing {configs.length} stacked field{configs.length !== 1 ? 's' : ''}
            </p>

            {/* Mesh title visibility toggle */}
            <div style={currentStyles.labelControls}>
              <label style={currentStyles.spacingLabel}>Mesh Titles:</label>
              <div style={currentStyles.checkboxRow}>
                <input
                  type="checkbox"
                  checked={showMeshTitles}
                  onChange={(e) => setShowMeshTitles(e.target.checked)}
                  style={currentStyles.checkbox}
                  id="mesh-titles"
                />
                <label htmlFor="mesh-titles" style={currentStyles.checkboxLabel}>
                  Show mesh titles next to each layer
                </label>
              </div>
            </div>

            {/* Axis title visibility toggle */}
            <div style={currentStyles.labelControls}>
              <label style={currentStyles.spacingLabel}>Axis Titles:</label>
              <div style={currentStyles.checkboxRow}>
                <input
                  type="checkbox"
                  checked={showAxisTitles}
                  onChange={(e) => setShowAxisTitles(e.target.checked)}
                  style={currentStyles.checkbox}
                  id="axis-titles"
                />
                <label htmlFor="axis-titles" style={currentStyles.checkboxLabel}>
                  Show axis labels (x, y, z)
                </label>
              </div>
            </div>

            {/* Label visibility toggles */}
            <div style={currentStyles.labelControls}>
              <label style={currentStyles.spacingLabel}>Attractor Labels:</label>
              {configs.map((config, index) => {
                const fullConfig = { ...DEFAULT_CONFIG, ...config };
                return (
                  <div key={index} style={currentStyles.checkboxRow}>
                    <input
                      type="checkbox"
                      checked={showLabels[index] || false}
                      onChange={() => toggleLabelVisibility(index)}
                      style={currentStyles.checkbox}
                      id={`label-${index}`}
                    />
                    <label htmlFor={`label-${index}`} style={currentStyles.checkboxLabel}>
                      Layer {index + 1}: {fullConfig.labels.title || 'Untitled'}
                    </label>
                  </div>
                );
              })}
            </div>

            {/* Spacing controls */}
            <div style={currentStyles.spacingControls}>
              <label style={currentStyles.spacingLabel}>
                Layer Spacing: {zSpacing.toFixed(2)}
              </label>
              <div style={currentStyles.buttonGroup}>
                <button
                  onClick={() => setZSpacing(Math.max(0, zSpacing - 0.1))}
                  style={currentStyles.smallButton}
                  disabled={zSpacing <= 0}
                >
                  Compress
                </button>
                <button
                  onClick={() => setZSpacing(zSpacing + 0.1)}
                  style={currentStyles.smallButton}
                >
                  Expand
                </button>
                <button
                  onClick={() => setZSpacing(0)}
                  style={currentStyles.smallButton}
                >
                  Merge
                </button>
              </div>

              {/* Animation controls */}
              <div style={{ marginTop: '10px' }}>
                <label style={currentStyles.checkboxLabel}>
                  Repeat:
                  <input
                    type="number"
                    value={animationRepeat}
                    onChange={(e) => setAnimationRepeat(Math.max(1, parseInt(e.target.value) || 1))}
                    min="1"
                    max="100"
                    style={currentStyles.numberInput}
                  />
                </label>
              </div>
              <div style={{ ...currentStyles.buttonGroup, marginTop: '8px' }}>
                <button
                  onClick={() => handleAnimatedSpacing(-0.1)}
                  style={currentStyles.smallButton}
                  disabled={zSpacing <= 0}
                >
                  Animate ↓
                </button>
                <button
                  onClick={() => handleAnimatedSpacing(0.1)}
                  style={currentStyles.smallButton}
                >
                  Animate ↑
                </button>
              </div>
            </div>

            {/* Share button */}
            <button onClick={handleShareLink} style={{ ...currentStyles.button, marginTop: '15px' }}>
              {copySuccess ? '✓ Copied!' : '📋 Copy Share Link'}
            </button>
          </>
        )}
        </div>
        <div style={currentStyles.canvasWrapper}>
          <canvas ref={canvasRef} style={currentStyles.canvas} />
          {stackTitle && (
            <div style={currentStyles.titleOverlay}>
              <h1 style={currentStyles.titleText}>{stackTitle}</h1>
            </div>
          )}
        </div>
      </div>
      <div style={currentStyles.controls}>
        <button
          onClick={() => setDarkMode(!darkMode)}
          style={{ ...currentStyles.controlButton, backgroundColor: darkMode ? '#ffa500' : '#333' }}
        >
          {darkMode ? '☀️' : '🌙'}
        </button>
      </div>
    </div>
  );
};

const styles: Record<string, React.CSSProperties> = {
  outerContainer: {
    width: '100%',
    height: '100vh',
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: '#0a0c10',
  },
  contentContainer: {
    flex: 1,
    display: 'flex',
    overflow: 'hidden',
  },
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
  inputLabel: {
    display: 'block',
    marginBottom: '6px',
    fontSize: '13px',
    color: '#a0a3ab',
    fontWeight: 500,
  },
  textInput: {
    width: '100%',
    padding: '10px 12px',
    backgroundColor: '#2a2d35',
    border: '1px solid #3a3d45',
    borderRadius: '4px',
    color: '#e0e0e0',
    fontSize: '14px',
    boxSizing: 'border-box',
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
  labelControls: {
    marginTop: '15px',
    padding: '15px',
    backgroundColor: '#242730',
    borderRadius: '8px',
    border: '1px solid #3a3d45',
  },
  checkboxRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    marginTop: '8px',
  },
  checkbox: {
    width: '16px',
    height: '16px',
    cursor: 'pointer',
  },
  checkboxLabel: {
    fontSize: '13px',
    color: '#e0e0e0',
    cursor: 'pointer',
    userSelect: 'none',
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
  },
  numberInput: {
    width: '60px',
    padding: '4px 8px',
    backgroundColor: '#2a2d35',
    border: '1px solid #3a3d45',
    borderRadius: '4px',
    color: '#e0e0e0',
    fontSize: '13px',
    marginLeft: '6px',
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
  titleOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    padding: '20px',
    pointerEvents: 'none',
  },
  titleText: {
    margin: 0,
    fontSize: '28px',
    fontWeight: 700,
    color: 'black',
    textShadow: 'none',
  },
  controls: {
    display: 'flex',
    gap: '10px',
    padding: '15px',
    backgroundColor: '#1a1d23',
    borderTop: '1px solid #3a3d45',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  controlButton: {
    padding: '12px 24px',
    border: 'none',
    borderRadius: '6px',
    color: 'white',
    fontSize: '16px',
    fontWeight: 600,
    cursor: 'pointer',
    transition: 'background-color 0.2s',
  },
};

const lightStackedStyles: Record<string, React.CSSProperties> = {
  ...styles,
  outerContainer: {
    ...styles.outerContainer,
    backgroundColor: '#ffffff',
  },
  contentContainer: {
    ...styles.contentContainer,
  },
  container: {
    ...styles.container,
    backgroundColor: '#ffffff',
  },
  sidebar: {
    ...styles.sidebar,
    backgroundColor: '#f5f5f5',
    color: '#333',
    borderRight: '1px solid #ddd',
  },
  header: {
    ...styles.header,
    color: '#333',
  },
  description: {
    ...styles.description,
    color: '#666',
  },
  inputLabel: {
    ...styles.inputLabel,
    color: '#666',
  },
  textInput: {
    ...styles.textInput,
    backgroundColor: '#ffffff',
    border: '1px solid #ddd',
    color: '#333',
  },
  textarea: {
    ...styles.textarea,
    backgroundColor: '#ffffff',
    border: '1px solid #ddd',
    color: '#333',
  },
  button: {
    ...styles.button,
  },
  info: {
    ...styles.info,
    color: '#0066cc',
  },
  spacingControls: {
    ...styles.spacingControls,
    backgroundColor: '#f0f0f0',
    border: '1px solid #ddd',
  },
  spacingLabel: {
    ...styles.spacingLabel,
    color: '#333',
  },
  labelControls: {
    ...styles.labelControls,
    backgroundColor: '#f0f0f0',
    border: '1px solid #ddd',
  },
  checkboxLabel: {
    ...styles.checkboxLabel,
    color: '#333',
  },
  numberInput: {
    ...styles.numberInput,
    backgroundColor: '#ffffff',
    border: '1px solid #ddd',
    color: '#333',
  },
  controls: {
    ...styles.controls,
    backgroundColor: '#f5f5f5',
    borderTop: '1px solid #ddd',
  },
  controlButton: {
    ...styles.controlButton,
  },
};
