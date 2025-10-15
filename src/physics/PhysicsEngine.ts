import { Attractor, PhysicsConfig, Vec2, Extent } from '../types/config';
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

  step(attractors: Attractor[], config: PhysicsConfig): void {
    if (this.worker) {
      this.worker.postMessage({
        type: 'step',
        attractors,
        config
      });
    } else {
      this.stepLocal(attractors, config);
    }
  }

  private stepLocal(attractors: Attractor[], config: PhysicsConfig): void {
    const { dt, damping, maxSpeed, noise, stickiness } = config;

    for (const ball of this.balls) {
      const grad = this.gradientV(ball.x, ball.y, attractors);
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
