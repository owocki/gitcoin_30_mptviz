import { Attractor, PhysicsConfig, Vec2 } from '../types/config';

interface Ball {
  x: number;
  y: number;
  vx: number;
  vy: number;
}

interface WorkerMessage {
  type: 'init' | 'step' | 'reset';
  balls?: Ball[];
  attractors?: Attractor[];
  config?: PhysicsConfig;
  extent?: { xMin: number; xMax: number; yMin: number; yMax: number };
}

interface WorkerResponse {
  type: 'positions';
  positions: Float32Array;
}

let balls: Ball[] = [];
let attractors: Attractor[] = [];
let config: PhysicsConfig = {
  dt: 0.016,
  damping: 0.92,
  noise: 0.0,
  maxSpeed: 2.5,
  stickiness: 0.0
};
let extent = { xMin: -1.5, xMax: 1.5, yMin: -1.5, yMax: 1.5 };

/**
 * Compute gradient of potential field at (x, y)
 */
function gradientV(x: number, y: number): Vec2 {
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

/**
 * Step physics simulation forward
 */
function stepPhysics(): void {
  const { dt, damping, maxSpeed, noise, stickiness } = config;

  for (const ball of balls) {
    // Compute force (negative gradient)
    const grad = gradientV(ball.x, ball.y);
    const fx = -grad.x;
    const fy = -grad.y;

    // Update velocity with damping and force
    ball.vx = damping * ball.vx + dt * fx;
    ball.vy = damping * ball.vy + dt * fy;

    // Add noise if specified
    if (noise > 0) {
      ball.vx += (Math.random() - 0.5) * noise;
      ball.vy += (Math.random() - 0.5) * noise;
    }

    // Clamp speed
    const speed = Math.hypot(ball.vx, ball.vy);
    if (speed > maxSpeed) {
      const scale = maxSpeed / speed;
      ball.vx *= scale;
      ball.vy *= scale;
    }

    // Update position
    ball.x += dt * ball.vx;
    ball.y += dt * ball.vy;

    // Boundary handling with slight bounce
    const margin = 0.05;
    if (ball.x < extent.xMin + margin) {
      ball.x = extent.xMin + margin;
      ball.vx *= -(1 - stickiness);
    } else if (ball.x > extent.xMax - margin) {
      ball.x = extent.xMax - margin;
      ball.vx *= -(1 - stickiness);
    }

    if (ball.y < extent.yMin + margin) {
      ball.y = extent.yMin + margin;
      ball.vy *= -(1 - stickiness);
    } else if (ball.y > extent.yMax - margin) {
      ball.y = extent.yMax - margin;
      ball.vy *= -(1 - stickiness);
    }
  }
}

/**
 * Message handler
 */
self.onmessage = (e: MessageEvent<WorkerMessage>) => {
  const { type, balls: newBalls, attractors: newAttractors, config: newConfig, extent: newExtent } = e.data;

  switch (type) {
    case 'init':
      if (newBalls) balls = newBalls;
      if (newAttractors) attractors = newAttractors;
      if (newConfig) config = newConfig;
      if (newExtent) extent = newExtent;
      break;

    case 'step':
      if (newAttractors) attractors = newAttractors;
      if (newConfig) config = newConfig;

      stepPhysics();

      // Pack positions into Float32Array for efficient transfer
      const positions = new Float32Array(balls.length * 2);
      for (let i = 0; i < balls.length; i++) {
        positions[i * 2] = balls[i].x;
        positions[i * 2 + 1] = balls[i].y;
      }

      self.postMessage({ type: 'positions', positions }, [positions.buffer]);
      break;

    case 'reset':
      if (newBalls) balls = newBalls;
      break;
  }
};
