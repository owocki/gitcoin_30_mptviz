import React, { useRef, useEffect, useState } from 'react';
import { useStore } from '../store/useStore';
import { Renderer } from '../renderer/Renderer';
import { PhysicsEngine } from '../physics/PhysicsEngine';
import { ConfigManager } from '../config/ConfigManager';
import { Exporter } from '../export/Exporter';

export const Scene: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rendererRef = useRef<Renderer | null>(null);
  const physicsRef = useRef<PhysicsEngine | null>(null);
  const configManagerRef = useRef<ConfigManager | null>(null);
  const animationIdRef = useRef<number | null>(null);

  const { config, isPlaying, setPlaying } = useStore();
  const [exportProgress, setExportProgress] = useState<number | null>(null);

  // Initialize renderer and physics engine
  useEffect(() => {
    if (!canvasRef.current) return;

    const configManager = new ConfigManager(config);
    configManagerRef.current = configManager;

    const renderer = new Renderer(canvasRef.current, config);
    rendererRef.current = renderer;

    const physics = new PhysicsEngine(true);
    physicsRef.current = physics;

    // Initialize balls
    physics.initBalls(
      config.balls.count,
      config.balls.spawn,
      config.balls.manualPositions,
      config.surface.extent,
      configManager.getRNG()
    );

    renderer.initBalls(config.balls.count);

    // Initial render
    renderer.render();

    // Handle resize
    const handleResize = () => {
      if (canvasRef.current && rendererRef.current) {
        const { clientWidth, clientHeight } = canvasRef.current.parentElement!;
        rendererRef.current.resize(clientWidth, clientHeight);
        rendererRef.current.render();
      }
    };

    window.addEventListener('resize', handleResize);
    handleResize();

    return () => {
      window.removeEventListener('resize', handleResize);
      if (animationIdRef.current) {
        cancelAnimationFrame(animationIdRef.current);
      }
      renderer.destroy();
      physics.destroy();
    };
  }, []);

  // Update config when it changes
  useEffect(() => {
    if (!rendererRef.current || !physicsRef.current || !configManagerRef.current) return;

    configManagerRef.current.updateConfig(config);
    rendererRef.current.updateConfig(config);
    rendererRef.current.updateSurface(config.attractors);

    // Reinit balls if count changed
    if (physicsRef.current.getBalls().length !== config.balls.count) {
      physicsRef.current.reset(
        config.balls.count,
        config.balls.spawn,
        config.balls.manualPositions,
        config.surface.extent,
        configManagerRef.current.getRNG()
      );
      rendererRef.current.initBalls(config.balls.count);
    }

    rendererRef.current.render();
  }, [config]);

  // Animation loop
  useEffect(() => {
    if (!isPlaying || !rendererRef.current || !physicsRef.current) {
      if (animationIdRef.current) {
        cancelAnimationFrame(animationIdRef.current);
        animationIdRef.current = null;
      }
      return;
    }

    const animate = () => {
      if (!rendererRef.current || !physicsRef.current) return;

      // Step physics
      physicsRef.current.step(config.attractors, config.balls.physics);

      // Update renderer
      const balls = physicsRef.current.getBalls();
      rendererRef.current.updateBalls(balls);
      rendererRef.current.render();

      animationIdRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      if (animationIdRef.current) {
        cancelAnimationFrame(animationIdRef.current);
        animationIdRef.current = null;
      }
    };
  }, [isPlaying, config]);

  const handlePlayPause = () => {
    setPlaying(!isPlaying);
  };

  const handleReset = () => {
    if (physicsRef.current && rendererRef.current && configManagerRef.current) {
      configManagerRef.current.resetSeed(config.seed);
      physicsRef.current.reset(
        config.balls.count,
        config.balls.spawn,
        config.balls.manualPositions,
        config.surface.extent,
        configManagerRef.current.getRNG()
      );
      rendererRef.current.initBalls(config.balls.count);
      rendererRef.current.render();
    }
  };

  const handleExportPNG = async () => {
    if (!rendererRef.current) return;
    const canvas = rendererRef.current.getCanvas();
    await Exporter.exportPNG(canvas);
  };

  const handleExportWebM = async () => {
    if (!rendererRef.current || !physicsRef.current) return;

    setExportProgress(0);
    const wasPlaying = isPlaying;
    setPlaying(false);

    try {
      const canvas = rendererRef.current.getCanvas();
      const onFrame = () => {
        physicsRef.current!.step(config.attractors, config.balls.physics);
        const balls = physicsRef.current!.getBalls();
        rendererRef.current!.updateBalls(balls);
        rendererRef.current!.render();
      };

      await Exporter.exportWebM(canvas, onFrame, config.export, setExportProgress);
      alert('Export completed!');
    } catch (error) {
      console.error('Export failed:', error);
      alert('Export failed: ' + (error as Error).message);
    } finally {
      setExportProgress(null);
      setPlaying(wasPlaying);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.canvasWrapper}>
        <canvas ref={canvasRef} style={styles.canvas} />
        <div style={styles.overlay}>
          <h1 style={styles.title}>{config.labels.title}</h1>
        </div>
      </div>
      <div style={styles.controls}>
        <button onClick={handlePlayPause} style={styles.button}>
          {isPlaying ? 'Pause' : 'Play'}
        </button>
        <button onClick={handleReset} style={styles.button}>
          Reset
        </button>
        <button onClick={handleExportPNG} style={styles.button} disabled={exportProgress !== null}>
          Export PNG
        </button>
        <button onClick={handleExportWebM} style={styles.button} disabled={exportProgress !== null}>
          {exportProgress !== null ? `Exporting ${Math.round(exportProgress * 100)}%` : 'Export WebM'}
        </button>
      </div>
    </div>
  );
};

const styles: Record<string, React.CSSProperties> = {
  container: {
    width: '100%',
    height: '100vh',
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: '#0a0c10'
  },
  canvasWrapper: {
    flex: 1,
    position: 'relative',
    overflow: 'hidden'
  },
  canvas: {
    width: '100%',
    height: '100%',
    display: 'block'
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    padding: '20px',
    pointerEvents: 'none'
  },
  title: {
    margin: 0,
    fontSize: '28px',
    fontWeight: 700,
    color: 'white',
    textShadow: '0 2px 10px rgba(0,0,0,0.5)'
  },
  controls: {
    display: 'flex',
    gap: '10px',
    padding: '15px',
    backgroundColor: '#1a1d23',
    borderTop: '1px solid #3a3d45'
  },
  button: {
    padding: '12px 24px',
    backgroundColor: '#4a7dff',
    border: 'none',
    borderRadius: '6px',
    color: 'white',
    fontSize: '16px',
    fontWeight: 600,
    cursor: 'pointer',
    transition: 'background-color 0.2s',
    flex: 1
  }
};
