import React, { useRef, useEffect, useState } from "react";
import { useStore } from "../store/useStore";
import { Renderer } from "../renderer/Renderer";
import { PhysicsEngine } from "../physics/PhysicsEngine";
import { ConfigManager } from "../config/ConfigManager";
import { Exporter } from "../export/Exporter";
import { Button } from "./button";

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

    window.addEventListener("resize", handleResize);
    handleResize();

    return () => {
      window.removeEventListener("resize", handleResize);
      if (animationIdRef.current) {
        cancelAnimationFrame(animationIdRef.current);
      }
      renderer.destroy();
      physics.destroy();
    };
  }, []);

  // Update config when it changes
  useEffect(() => {
    if (
      !rendererRef.current ||
      !physicsRef.current ||
      !configManagerRef.current
    )
      return;

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

      // Ensure dark mode is applied to newly initialized balls
      rendererRef.current.setDarkMode(true);

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

      // Step physics with reinforcements and directionality
      physicsRef.current.step(
        config.attractors,
        config.balls.physics,
        config.reinforcements || [],
        config.balls.directionality
      );

      // Get modified attractors from physics (with dynamic strength from reinforcements)
      const modifiedAttractors = physicsRef.current.getModifiedAttractors();

      // Update surface with dynamic attractors if they exist
      if (modifiedAttractors.length > 0) {
        rendererRef.current.updateSurfaceDynamic(modifiedAttractors);
      }

      // Update renderer with physics (balls follow surface)
      const balls = physicsRef.current.getBalls();
      rendererRef.current.updateBalls(
        balls,
        true,
        modifiedAttractors.length > 0 ? modifiedAttractors : undefined
      );

      animationId = requestAnimationFrame(physicsLoop);
    };

    animationId = requestAnimationFrame(physicsLoop);

    return () => {
      if (animationId) {
        cancelAnimationFrame(animationId);
      }
    };
  }, [
    isPlaying,
    config.attractors,
    config.balls.physics,
    config.reinforcements,
  ]);

  const handlePlayPause = () => {
    if (!isPlaying) {
      // Starting play - randomize positions and position based on directionality
      if (
        physicsRef.current &&
        rendererRef.current &&
        configManagerRef.current
      ) {
        physicsRef.current.reset(
          config.balls.count,
          "random",
          config.balls.manualPositions,
          config.surface.extent,
          configManagerRef.current.getRNG()
        );
        rendererRef.current.initBalls(config.balls.count);

        // Ensure dark mode is applied to newly initialized balls
        rendererRef.current.setDarkMode(true);

        // Position balls based on directionality
        const balls = physicsRef.current.getBalls();
        const startHeight = config.balls.directionality === "down" ? 1 : -1;
        rendererRef.current.positionBallsAtHeight(balls, startHeight);

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
        "random",
        config.balls.manualPositions,
        config.surface.extent,
        configManagerRef.current.getRNG()
      );
      rendererRef.current.initBalls(config.balls.count);

      // Ensure dark mode is applied to newly initialized balls
      rendererRef.current.setDarkMode(true);

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
    if (
      !rendererRef.current ||
      !physicsRef.current ||
      !configManagerRef.current
    )
      return;

    setExportProgress(0);
    const wasPlaying = isPlaying;
    setPlaying(false);

    try {
      // Reset physics for fresh export - balls start based on directionality
      physicsRef.current.reset(
        config.balls.count,
        "random",
        config.balls.manualPositions,
        config.surface.extent,
        configManagerRef.current.getRNG()
      );
      rendererRef.current.initBalls(config.balls.count);

      // Ensure dark mode is applied to newly initialized balls
      rendererRef.current.setDarkMode(true);

      // Position balls based on directionality
      const balls = physicsRef.current.getBalls();
      const startHeight = config.balls.directionality === "down" ? 1 : -1;
      rendererRef.current.positionBallsAtHeight(balls, startHeight);

      // Show balls during export
      rendererRef.current.showBalls(true);

      const canvas = rendererRef.current.getCanvas();
      const onFrame = () => {
        // Step physics with falling animation, reinforcements, and directionality
        physicsRef.current!.step(
          config.attractors,
          config.balls.physics,
          config.reinforcements || [],
          config.balls.directionality
        );
        const balls = physicsRef.current!.getBalls();
        rendererRef.current!.updateBalls(balls, true);
        rendererRef.current!.render();
      };

      await Exporter.exportWebM(
        canvas,
        onFrame,
        config.export,
        setExportProgress
      );
    } catch (error) {
      console.error("Export failed:", error);
      alert("Export failed: " + (error as Error).message);
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
    <div className="w-full h-screen flex flex-col bg-moss-950">
      <div className="flex-1 relative overflow-hidden">
        <canvas ref={canvasRef} className="w-full h-full block" />
        <div className="absolute top-0 left-0 right-0 p-5 pointer-events-none">
          <h1 className="m-0 text-[28px] font-bold text-moss-100">
            {config.labels.title}
          </h1>
        </div>
      </div>
      <div className="flex gap-2.5 p-[15px] items-center border-t bg-moss-900 border-moss-900/20 justify-between">
        <div className="flex gap-2.5 p-[15px] items-center  bg-moss-900">
          <div className="flex flex-col gap-1.5 min-w-[120px]">
            <label className="text-xs font-medium text-moss-100">
              No. of Balls
            </label>
            <input
              type="number"
              value={config.balls.count}
              onChange={(e) => {
                const count = parseInt(e.target.value, 10);
                if (!isNaN(count) && count >= 0) {
                  useStore
                    .getState()
                    .setConfig({ balls: { ...config.balls, count } });
                }
              }}
              min="0"
              max="100"
              className="px-3 py-2 rounded border text-sm w-full bg-moss-500 text-moss-100"
            />
          </div>
          <div className="flex flex-col gap-1.5 min-w-[120px]">
            <label className="text-xs font-medium text-moss-100">
              Direction
            </label>
            <select
              value={config.balls.directionality}
              onChange={(e) => {
                useStore.getState().setConfig({
                  balls: {
                    ...config.balls,
                    directionality: e.target.value as "up" | "down",
                  },
                });
              }}
              className="px-3 py-2 rounded border text-sm w-full cursor-pointer bg-moss-500 text-moss-100"
            >
              <option value="down">Down</option>
              <option value="up">Up</option>
            </select>
          </div>
        </div>
        <div className="flex gap-2.5 p-[15px] items-center  bg-moss-900  mt-4">
          <Button onClick={handlePlayPause}>
            {isPlaying ? "Pause" : "Play"}
          </Button>
          <Button onClick={handleReset}>Reset</Button>
          <Button onClick={handleExportPNG} disabled={exportProgress !== null}>
            Export PNG
          </Button>
          <Button onClick={handleExportWebM} disabled={exportProgress !== null}>
            {exportProgress !== null
              ? `Exporting ${Math.round(exportProgress * 100)}%`
              : "Export Movie"}
          </Button>
        </div>
      </div>
    </div>
  );
};
