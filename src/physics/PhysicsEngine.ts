import { Attractor, PhysicsConfig, Vec2, Extent, Reinforcement } from '../types/config';
import { SeededRandom } from '../config/ConfigManager';

export interface Ball {
  x: number;
  y: number;
  vx: number;
  vy: number;
}

export class PhysicsEngine {
  private worker: Worker | null = null;
  private balls: Ball[] = [];
  private positions: Float32Array;
  private useWorker: boolean;
  private currentModifiedAttractors: Attractor[] = [];

  constructor(useWorker: boolean = true) {
    this.useWorker = useWorker;
    this.positions = new Float32Array(0);

    if (useWorker) {
      try {
        this.worker = new Worker(new URL('./PhysicsWorker.ts', import.meta.url), {
          type: 'module'
        });
        this.setupWorkerHandlers();
      } catch (e) {
        console.warn('Failed to create worker, falling back to main thread:', e);
        this.useWorker = false;
      }
    }
  }

  private setupWorkerHandlers(): void {
    if (!this.worker) return;

    this.worker.onmessage = (e) => {
      if (e.data.type === 'positions') {
        this.positions = e.data.positions;

        // Update local ball positions
        for (let i = 0; i < this.balls.length; i++) {
          this.balls[i].x = this.positions[i * 2];
          this.balls[i].y = this.positions[i * 2 + 1];
        }

        // Store modified attractors if provided
        if (e.data.modifiedAttractors) {
          this.currentModifiedAttractors = e.data.modifiedAttractors;
        }
      }
    };

    this.worker.onerror = (e) => {
      console.error('Physics worker error:', e);
    };
  }

  initBalls(
    count: number,
    spawn: 'random' | 'grid' | 'manual',
    manualPositions: Vec2[],
    extent: Extent,
    rng: SeededRandom
  ): void {
    this.balls = [];

    if (spawn === 'manual' && manualPositions.length > 0) {
      for (let i = 0; i < Math.min(count, manualPositions.length); i++) {
        this.balls.push({
          x: manualPositions[i].x,
          y: manualPositions[i].y,
          vx: 0,
          vy: 0
        });
      }
    } else if (spawn === 'grid') {
      const side = Math.ceil(Math.sqrt(count));
      const dx = (extent.xMax - extent.xMin) / (side + 1);
      const dy = (extent.yMax - extent.yMin) / (side + 1);

      for (let i = 0; i < count; i++) {
        const ix = i % side;
        const iy = Math.floor(i / side);
        this.balls.push({
          x: extent.xMin + (ix + 1) * dx,
          y: extent.yMin + (iy + 1) * dy,
          vx: 0,
          vy: 0
        });
      }
    } else {
      // random spawn
      for (let i = 0; i < count; i++) {
        this.balls.push({
          x: rng.range(extent.xMin, extent.xMax),
          y: rng.range(extent.yMin, extent.yMax),
          vx: 0,
          vy: 0
        });
      }
    }

    this.positions = new Float32Array(this.balls.length * 2);

    if (this.worker) {
      this.worker.postMessage({
        type: 'init',
        balls: this.balls,
        extent
      });
    }
  }

  step(attractors: Attractor[], config: PhysicsConfig, reinforcements: Reinforcement[] = []): void {
    if (this.worker) {
      this.worker.postMessage({
        type: 'step',
        attractors,
        config,
        reinforcements
      });
    } else {
      this.stepLocal(attractors, config, reinforcements);
    }
  }

  private stepLocal(attractors: Attractor[], config: PhysicsConfig, reinforcements: Reinforcement[] = []): void {
    const { dt, damping, maxSpeed, noise, stickiness } = config;

    console.log(`[PhysicsEngine] Step called with ${reinforcements.length} reinforcements, ${this.balls.length} balls`);

    // Apply dynamic strength modifications based on reinforcements
    const modifiedAttractors = this.applyReinforcementDynamics(attractors, reinforcements);

    // Store modified attractors for rendering
    this.currentModifiedAttractors = modifiedAttractors;

    for (const ball of this.balls) {
      const grad = this.gradientV(ball.x, ball.y, modifiedAttractors);
      const fx = -grad.x;
      const fy = -grad.y;

      ball.vx = damping * ball.vx + dt * fx;
      ball.vy = damping * ball.vy + dt * fy;

      if (noise > 0) {
        ball.vx += (Math.random() - 0.5) * noise;
        ball.vy += (Math.random() - 0.5) * noise;
      }

      const speed = Math.hypot(ball.vx, ball.vy);
      if (speed > maxSpeed) {
        const scale = maxSpeed / speed;
        ball.vx *= scale;
        ball.vy *= scale;
      }

      ball.x += dt * ball.vx;
      ball.y += dt * ball.vy;
    }

    // Update positions array
    for (let i = 0; i < this.balls.length; i++) {
      this.positions[i * 2] = this.balls[i].x;
      this.positions[i * 2 + 1] = this.balls[i].y;
    }
  }

  private applyReinforcementDynamics(attractors: Attractor[], reinforcements: Reinforcement[]): Attractor[] {
    if (reinforcements.length === 0) {
      return attractors;
    }

    // Create a map to track strength modifications for each attractor
    const strengthModifications = new Map<string, number>();

    // For each attractor with reinforcements, check if it has balls in it
    for (const reinforcement of reinforcements) {
      const sourceAttractor = attractors.find(a => a.id === reinforcement.fromId);
      if (!sourceAttractor) continue;

      // Count balls within this attractor (distance < sigma * 2 for wider capture)
      let ballsInAttractor = 0;
      const captureRadius = sourceAttractor.sigma * 2.0; // Wider detection zone

      for (const ball of this.balls) {
        const dx = ball.x - sourceAttractor.pos.x;
        const dy = ball.y - sourceAttractor.pos.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        // Ball is "in" the attractor if within capture radius
        if (distance < captureRadius) {
          ballsInAttractor++;
        }
      }

      // If there are balls in the source attractor, increase target attractor strength
      if (ballsInAttractor > 0) {
        const currentMod = strengthModifications.get(reinforcement.toId) || 0;
        // Strength increase: reinforcement strength * number of balls * 0.02 for very subtle effect
        const strengthIncrease = ballsInAttractor * reinforcement.strength * 0.02;
        strengthModifications.set(reinforcement.toId, currentMod + strengthIncrease);
        console.log(`Reinforcement: ${ballsInAttractor} balls in ${reinforcement.fromId} -> ${reinforcement.toId}, adding ${strengthIncrease} strength`);
      }
    }

    // Apply modifications and return new array
    return attractors.map(attractor => {
      const modification = strengthModifications.get(attractor.id);
      if (modification !== undefined && modification !== 0) {
        // Increase the magnitude of strength (preserve sign)
        const sign = Math.sign(attractor.strength) || 1;
        const newStrength = attractor.strength + (sign * Math.abs(modification));
        console.log(`Applied to ${attractor.id}: ${attractor.strength} -> ${newStrength}`);
        return { ...attractor, strength: newStrength };
      }
      return attractor;
    });
  }

  private gradientV(x: number, y: number, attractors: Attractor[]): Vec2 {
    let gx = 0;
    let gy = 0;

    for (const attractor of attractors) {
      const dx = x - attractor.pos.x;
      const dy = y - attractor.pos.y;
      const r2 = dx * dx + dy * dy;

      const k = attractor.strength * attractor.sigma;
      const sigma2 = attractor.sigma * attractor.sigma;
      const expTerm = Math.exp(-r2 / (2 * sigma2));
      const factor = -k * expTerm / sigma2;

      gx += factor * dx;
      gy += factor * dy;
    }

    return { x: gx, y: gy };
  }

  getBalls(): Ball[] {
    return this.balls;
  }

  getPositions(): Float32Array {
    return this.positions;
  }

  getModifiedAttractors(): Attractor[] {
    return this.currentModifiedAttractors;
  }

  reset(
    count: number,
    spawn: 'random' | 'grid' | 'manual',
    manualPositions: Vec2[],
    extent: Extent,
    rng: SeededRandom
  ): void {
    this.initBalls(count, spawn, manualPositions, extent, rng);
  }

  destroy(): void {
    if (this.worker) {
      this.worker.terminate();
      this.worker = null;
    }
  }
}
