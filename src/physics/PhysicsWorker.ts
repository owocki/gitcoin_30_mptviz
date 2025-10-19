import { Attractor, PhysicsConfig, Vec2, Reinforcement } from '../types/config';

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
  reinforcements?: Reinforcement[];
  extent?: { xMin: number; xMax: number; yMin: number; yMax: number };
  directionality?: 'up' | 'down';
}

interface WorkerResponse {
  type: 'positions';
  positions: Float32Array;
  modifiedAttractors?: Attractor[];
}

let balls: Ball[] = [];
let attractors: Attractor[] = [];
let reinforcements: Reinforcement[] = [];
let config: PhysicsConfig = {
  dt: 0.016,
  damping: 0.92,
  noise: 0.0,
  maxSpeed: 2.5,
  stickiness: 0.0
};
let extent = { xMin: -1.5, xMax: 1.5, yMin: -1.5, yMax: 1.5 };
let directionality: 'up' | 'down' = 'down';

/**
 * Apply dynamic strength modifications based on reinforcements
 */
function applyReinforcementDynamics(attractorsList: Attractor[]): Attractor[] {
  console.log(`[Worker] applyReinforcementDynamics: ${reinforcements.length} reinforcements`);

  if (reinforcements.length === 0) {
    return attractorsList;
  }

  // Create a map to track strength modifications for each attractor
  const strengthModifications = new Map<string, number>();

  // For each attractor with reinforcements, check if it has balls in it
  for (const reinforcement of reinforcements) {
    const sourceAttractor = attractorsList.find(a => a.id === reinforcement.fromId);
    if (!sourceAttractor) {
      console.log(`[Worker] Source attractor ${reinforcement.fromId} not found`);
      continue;
    }

    // Count balls within this attractor (distance < sigma * 2 for wider capture)
    let ballsInAttractor = 0;
    const captureRadius = sourceAttractor.sigma * 2.0; // Wider detection zone

    for (const ball of balls) {
      const dx = ball.x - sourceAttractor.pos.x;
      const dy = ball.y - sourceAttractor.pos.y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      // Ball is "in" the attractor if within capture radius
      if (distance < captureRadius) {
        ballsInAttractor++;
      }
    }

    console.log(`[Worker] Attractor ${reinforcement.fromId}: ${ballsInAttractor} balls (radius: ${captureRadius})`);

    // If there are balls in the source attractor, increase target attractor strength
    if (ballsInAttractor > 0) {
      const currentMod = strengthModifications.get(reinforcement.toId) || 0;
      // Strength increase: reinforcement strength * number of balls * 0.02 for very subtle effect
      const strengthIncrease = ballsInAttractor * reinforcement.strength * 0.02;
      strengthModifications.set(reinforcement.toId, currentMod + strengthIncrease);
      console.log(`[Worker] ${ballsInAttractor} balls in ${reinforcement.fromId} -> adding ${strengthIncrease} to ${reinforcement.toId}`);
    }
  }

  // Apply modifications and return new array
  return attractorsList.map(attractor => {
    const modification = strengthModifications.get(attractor.id);
    if (modification !== undefined && modification !== 0) {
      // Increase the magnitude of strength (preserve sign)
      const sign = Math.sign(attractor.strength) || 1;
      const newStrength = attractor.strength + (sign * Math.abs(modification));
      console.log(`[Worker] ${attractor.id}: strength ${attractor.strength} -> ${newStrength}`);
      return { ...attractor, strength: newStrength };
    }
    return attractor;
  });
}

/**
 * Compute gradient of potential field at (x, y)
 */
function gradientV(x: number, y: number, attractorsList: Attractor[]): Vec2 {
  let gx = 0;
  let gy = 0;

  for (const attractor of attractorsList) {
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
function stepPhysics(): { positions: Float32Array; modifiedAttractors: Attractor[] } {
  const { dt, damping, maxSpeed, noise, stickiness } = config;

  console.log(`[Worker] Step with ${reinforcements.length} reinforcements, ${balls.length} balls`);

  // Apply dynamic strength modifications based on reinforcements
  const modifiedAttractors = applyReinforcementDynamics(attractors);

  // Gravity multiplier: -1 for down (normal), +1 for up (reversed)
  const gravityDirection = directionality === 'down' ? -1 : 1;

  for (const ball of balls) {
    // Compute force (gradient with direction modifier)
    const grad = gradientV(ball.x, ball.y, modifiedAttractors);
    const fx = gravityDirection * grad.x;
    const fy = gravityDirection * grad.y;

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

  // Pack positions into Float32Array for efficient transfer
  const positions = new Float32Array(balls.length * 2);
  for (let i = 0; i < balls.length; i++) {
    positions[i * 2] = balls[i].x;
    positions[i * 2 + 1] = balls[i].y;
  }

  return { positions, modifiedAttractors };
}

/**
 * Message handler
 */
self.onmessage = (e: MessageEvent<WorkerMessage>) => {
  const { type, balls: newBalls, attractors: newAttractors, config: newConfig, reinforcements: newReinforcements, extent: newExtent, directionality: newDirectionality } = e.data;

  switch (type) {
    case 'init':
      if (newBalls) balls = newBalls;
      if (newAttractors) attractors = newAttractors;
      if (newConfig) config = newConfig;
      if (newReinforcements !== undefined) reinforcements = newReinforcements;
      if (newExtent) extent = newExtent;
      if (newDirectionality) directionality = newDirectionality;
      break;

    case 'step':
      if (newAttractors) attractors = newAttractors;
      if (newConfig) config = newConfig;
      if (newReinforcements !== undefined) reinforcements = newReinforcements;
      if (newDirectionality) directionality = newDirectionality;

      const result = stepPhysics();

      self.postMessage(
        {
          type: 'positions',
          positions: result.positions,
          modifiedAttractors: result.modifiedAttractors
        },
        [result.positions.buffer]
      );
      break;

    case 'reset':
      if (newBalls) balls = newBalls;
      break;
  }
};
