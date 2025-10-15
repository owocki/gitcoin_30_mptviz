import { Attractor, Vec2 } from '../types/config';

export type KernelType = 'gaussian' | 'softCoulomb';

/**
 * FieldKernel - Computes potential field V(x,y) and its gradient from attractors
 */
export class FieldKernel {
  private kernelType: KernelType;
  private epsilon: number;

  constructor(kernelType: KernelType = 'gaussian', epsilon: number = 0.02) {
    this.kernelType = kernelType;
    this.epsilon = epsilon;
  }

  /**
   * Compute potential V(x,y) at a given point
   * Gaussian: V = Σ k_i * exp(-(r²)/(2σ²))
   * Soft Coulomb: V = Σ k_i / sqrt(r² + ε²)
   */
  potential(x: number, y: number, attractors: Attractor[]): number {
    let v = 0;

    for (const attractor of attractors) {
      const dx = x - attractor.pos.x;
      const dy = y - attractor.pos.y;
      const r2 = dx * dx + dy * dy;

      const k = attractor.strength * attractor.sigma;

      if (this.kernelType === 'gaussian') {
        const sigma2 = attractor.sigma * attractor.sigma;
        v += k * Math.exp(-r2 / (2 * sigma2));
      } else {
        // soft Coulomb
        v += k / Math.sqrt(r2 + this.epsilon * this.epsilon);
      }
    }

    return v;
  }

  /**
   * Compute gradient ∇V at a point
   * Returns the negative gradient (force direction)
   * F = -∇V
   */
  gradient(x: number, y: number, attractors: Attractor[]): Vec2 {
    let gx = 0;
    let gy = 0;

    for (const attractor of attractors) {
      const dx = x - attractor.pos.x;
      const dy = y - attractor.pos.y;
      const r2 = dx * dx + dy * dy;

      const k = attractor.strength * attractor.sigma;

      if (this.kernelType === 'gaussian') {
        const sigma2 = attractor.sigma * attractor.sigma;
        const expTerm = Math.exp(-r2 / (2 * sigma2));
        const factor = -k * expTerm / sigma2;
        gx += factor * dx;
        gy += factor * dy;
      } else {
        // soft Coulomb
        const r_eps = Math.sqrt(r2 + this.epsilon * this.epsilon);
        const factor = -k / (r_eps * r_eps * r_eps);
        gx += factor * dx;
        gy += factor * dy;
      }
    }

    return { x: gx, y: gy };
  }

  /**
   * Compute force on a ball (negative gradient)
   * F = -∇V
   */
  force(x: number, y: number, attractors: Attractor[]): Vec2 {
    const grad = this.gradient(x, y, attractors);
    return { x: -grad.x, y: -grad.y };
  }

  /**
   * Sample the potential field on a grid
   * Returns a 2D array [y][x] of potential values
   */
  sampleField(
    attractors: Attractor[],
    resolution: number,
    extent: { xMin: number; xMax: number; yMin: number; yMax: number }
  ): number[][] {
    const field: number[][] = [];
    const dx = (extent.xMax - extent.xMin) / (resolution - 1);
    const dy = (extent.yMax - extent.yMin) / (resolution - 1);

    for (let iy = 0; iy < resolution; iy++) {
      const row: number[] = [];
      const y = extent.yMin + iy * dy;

      for (let ix = 0; ix < resolution; ix++) {
        const x = extent.xMin + ix * dx;
        row.push(this.potential(x, y, attractors));
      }

      field.push(row);
    }

    return field;
  }

  /**
   * Get min and max potential values for normalization
   */
  getFieldRange(field: number[][]): { min: number; max: number } {
    let min = Infinity;
    let max = -Infinity;

    for (const row of field) {
      for (const val of row) {
        if (val < min) min = val;
        if (val > max) max = val;
      }
    }

    return { min, max };
  }

  /**
   * Generate GLSL code for computing potential in shaders
   */
  getGLSLPotential(): string {
    if (this.kernelType === 'gaussian') {
      return `
float potential(vec2 pos, vec3 attractor) {
  // attractor = (x, y, strength*sigma)
  vec2 d = pos - attractor.xy;
  float r2 = dot(d, d);
  float sigma = 0.12; // fixed for now
  return attractor.z * exp(-r2 / (2.0 * sigma * sigma));
}
`;
    } else {
      return `
float potential(vec2 pos, vec3 attractor) {
  vec2 d = pos - attractor.xy;
  float r2 = dot(d, d);
  float eps = ${this.epsilon.toFixed(4)};
  return attractor.z / sqrt(r2 + eps * eps);
}
`;
    }
  }

  /**
   * Generate GLSL code for computing gradient in shaders
   */
  getGLSLGradient(): string {
    if (this.kernelType === 'gaussian') {
      return `
vec2 gradient(vec2 pos, vec3 attractor) {
  vec2 d = pos - attractor.xy;
  float r2 = dot(d, d);
  float sigma = 0.12;
  float sigma2 = sigma * sigma;
  float expTerm = exp(-r2 / (2.0 * sigma2));
  float factor = -attractor.z * expTerm / sigma2;
  return factor * d;
}
`;
    } else {
      return `
vec2 gradient(vec2 pos, vec3 attractor) {
  vec2 d = pos - attractor.xy;
  float r2 = dot(d, d);
  float eps = ${this.epsilon.toFixed(4)};
  float r_eps = sqrt(r2 + eps * eps);
  float factor = -attractor.z / (r_eps * r_eps * r_eps);
  return factor * d;
}
`;
    }
  }
}
