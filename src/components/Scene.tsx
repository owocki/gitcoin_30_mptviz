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

    // Position balls hovering at initial state
    const balls = physics.getBalls();
    renderer.updateBalls(balls, false);

    // Hide balls initially - only show when Play is pressed
    renderer.showBalls(false);

    // Start a continuous render loop for controls
    const renderLoop = () => {
      renderer.render();
      animationIdRef.current = requestAnimationFrame(renderLoop);
    };
    renderLoop();

    // Handle resize
    const handleResize = () => {
      if (canvasRef.current && rendererRef.current) {
        const { clientWidth, clientHeight } = canvasRef.current.parentElement!;
        rendererRef.current.resize(clientWidth, clientHeight);
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

      // Update ball positions (hovering when not playing)
      const balls = physicsRef.current.getBalls();
      rendererRef.current.updateBalls(balls, isPlaying);

      // Only show balls if currently playing
      rendererRef.current.showBalls(isPlaying);
    }

    rendererRef.current.render();
  }, [config, isPlaying]);

  // Physics update loop (separate from render loop)
  useEffect(() => {
    if (!isPlaying || !physicsRef.current || !rendererRef.current) {
      return;
    }

    let animationId: number;
    const physicsLoop = () => {
      if (!physicsRef.current || !rendererRef.current) return;

      // Step physics
      physicsRef.current.step(config.attractors, config.balls.physics);

      // Update renderer with physics (balls follow surface)
      const balls = physicsRef.current.getBalls();
      rendererRef.current.updateBalls(balls, true);

      animationId = requestAnimationFrame(physicsLoop);
    };

    animationId = requestAnimationFrame(physicsLoop);

    return () => {
      if (animationId) {
        cancelAnimationFrame(animationId);
      }
    };
  }, [isPlaying, config.attractors, config.balls.physics]);

  const handlePlayPause = () => {
    if (!isPlaying) {
      // Starting play - randomize positions and drop from z=1
      if (physicsRef.current && rendererRef.current && configManagerRef.current) {
        physicsRef.current.reset(
          config.balls.count,
          'random',
          config.balls.manualPositions,
          config.surface.extent,
          configManagerRef.current.getRNG()
        );
        rendererRef.current.initBalls(config.balls.count);

        // Position balls at z=1 for the drop
        const balls = physicsRef.current.getBalls();
        rendererRef.current.positionBallsAtHeight(balls, 1);

        // Show balls when starting to play
        rendererRef.current.showBalls(true);
      }
      setPlaying(true);
    } else {
      // Pausing - just stop physics
      setPlaying(false);
    }
  };

  const handleReset = () => {
    // Stop physics
    setPlaying(false);

    if (physicsRef.current && rendererRef.current && configManagerRef.current) {
      // Reset with random positions
      configManagerRef.current.resetSeed(config.seed);
      physicsRef.current.reset(
        config.balls.count,
        'random',
        config.balls.manualPositions,
        config.surface.extent,
        configManagerRef.current.getRNG()
      );
      rendererRef.current.initBalls(config.balls.count);

      // Position balls hovering at z=0.8
      const balls = physicsRef.current.getBalls();
      rendererRef.current.updateBalls(balls, false);

      // Hide balls after reset
      rendererRef.current.showBalls(false);
    }
  };

  const handleExportPNG = async () => {
    if (!rendererRef.current) return;
    const canvas = rendererRef.current.getCanvas();
    await Exporter.exportPNG(canvas);
  };

  const handleExportWebM = async () => {
    if (!rendererRef.current || !physicsRef.current || !configManagerRef.current) return;

    setExportProgress(0);
    const wasPlaying = isPlaying;
    setPlaying(false);

    try {
      // Reset physics for fresh export - balls start at z=1
      physicsRef.current.reset(
        config.balls.count,
        'random',
        config.balls.manualPositions,
        config.surface.extent,
        configManagerRef.current.getRNG()
      );
      rendererRef.current.initBalls(config.balls.count);

      // Position balls at z=1 for the drop
      const balls = physicsRef.current.getBalls();
      rendererRef.current.positionBallsAtHeight(balls, 1);

      // Show balls during export
      rendererRef.current.showBalls(true);

      const canvas = rendererRef.current.getCanvas();
      const onFrame = () => {
        // Step physics with falling animation
        physicsRef.current!.step(config.attractors, config.balls.physics);
        const balls = physicsRef.current!.getBalls();
        rendererRef.current!.updateBalls(balls, true);
        rendererRef.current!.render();
      };

      await Exporter.exportWebM(canvas, onFrame, config.export, setExportProgress);
    } catch (error) {
      console.error('Export failed:', error);
      alert('Export failed: ' + (error as Error).message);
    } finally {
      setExportProgress(null);

      // Restore previous state
      if (wasPlaying) {
        setPlaying(true);
      } else {
        // Hide balls if we weren't playing
        rendererRef.current?.showBalls(false);
      }
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
        <div style={styles.controlGroup}>
          <label style={styles.controlLabel}>No. of Balls</label>
          <input
            type="number"
            value={config.balls.count}
            onChange={(e) => {
              const count = parseInt(e.target.value, 10);
              if (!isNaN(count) && count >= 0) {
                useStore.getState().setConfig({ balls: { ...config.balls, count } });
              }
            }}
            min="0"
            max="100"
            style={styles.numberInput}
          />
        </div>
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
          {exportProgress !== null ? `Exporting ${Math.round(exportProgress * 100)}%` : 'Export Movie'}
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
    color: 'black',
    textShadow: 'none'
  },
  controls: {
    display: 'flex',
    gap: '10px',
    padding: '15px',
    backgroundColor: '#1a1d23',
    borderTop: '1px solid #3a3d45',
    alignItems: 'center'
  },
  controlGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '5px',
    minWidth: '120px'
  },
  controlLabel: {
    fontSize: '12px',
    color: '#a0a3ab',
    fontWeight: 500
  },
  numberInput: {
    padding: '8px 12px',
    backgroundColor: '#2a2d35',
    border: '1px solid #3a3d45',
    borderRadius: '4px',
    color: '#e0e0e0',
    fontSize: '14px',
    width: '100%'
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
    transition: 'background-color 0.2s'
  }
};
