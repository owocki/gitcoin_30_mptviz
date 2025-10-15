import { SceneConfig, Attractor } from '../types/config';
import { DEFAULT_CONFIG } from './defaults';

export class SeededRandom {
  private seed: number;

  constructor(seed: number) {
    this.seed = seed;
  }

  next(): number {
    this.seed = (this.seed * 9301 + 49297) % 233280;
    return this.seed / 233280;
  }

  range(min: number, max: number): number {
    return min + this.next() * (max - min);
  }
}

export class ConfigManager {
  private config: SceneConfig;
  private rng: SeededRandom;

  constructor(config?: Partial<SceneConfig>) {
    this.config = this.mergeConfig(config);
    this.rng = new SeededRandom(this.config.seed);
  }

  private mergeConfig(partial?: Partial<SceneConfig>): SceneConfig {
    if (!partial) return { ...DEFAULT_CONFIG };

    return {
      ...DEFAULT_CONFIG,
      ...partial,
      surface: { ...DEFAULT_CONFIG.surface, ...partial.surface },
      balls: {
        ...DEFAULT_CONFIG.balls,
        ...partial.balls,
        trail: { ...DEFAULT_CONFIG.balls.trail, ...partial.balls?.trail },
        physics: { ...DEFAULT_CONFIG.balls.physics, ...partial.balls?.physics }
      },
      labels: { ...DEFAULT_CONFIG.labels, ...partial.labels },
      camera: { ...DEFAULT_CONFIG.camera, ...partial.camera },
      render: {
        ...DEFAULT_CONFIG.render,
        ...partial.render,
        grid: { ...DEFAULT_CONFIG.render.grid, ...partial.render?.grid },
        lighting: { ...DEFAULT_CONFIG.render.lighting, ...partial.render?.lighting }
      },
      export: {
        ...DEFAULT_CONFIG.export,
        ...partial.export,
        size: { ...DEFAULT_CONFIG.export.size, ...partial.export?.size }
      },
      attractors: partial.attractors || DEFAULT_CONFIG.attractors
    };
  }

  validate(): { valid: boolean; errors: string[] } {
    const errors: string[] = [];

    // Validate attractors
    this.config.attractors.forEach((attractor, i) => {
      if (attractor.strength < -10 || attractor.strength > 10) {
        errors.push(`Attractor ${i}: strength must be in [-10, 10], clamping to range`);
        attractor.strength = Math.max(-10, Math.min(10, attractor.strength));
      }
      if (attractor.sigma <= 0) {
        errors.push(`Attractor ${i}: sigma must be positive`);
      }
    });

    // Validate balls
    if (this.config.balls.count < 0) {
      errors.push('Ball count must be non-negative');
    }
    if (this.config.balls.count > 1000) {
      errors.push('Ball count exceeds 1000, may affect performance');
    }

    // Check for repellers
    const hasRepellers = this.config.attractors.some(a => a.strength < 0);
    if (hasRepellers) {
      errors.push('Warning: Negative strength attractors (repellers) may cause balls to roll off');
    }

    return { valid: errors.length === 0, errors };
  }

  getConfig(): SceneConfig {
    return this.config;
  }

  updateConfig(partial: Partial<SceneConfig>): void {
    this.config = this.mergeConfig({ ...this.config, ...partial });
    if (partial.seed !== undefined) {
      this.rng = new SeededRandom(partial.seed);
    }
  }

  getRNG(): SeededRandom {
    return this.rng;
  }

  resetSeed(seed: number): void {
    this.config.seed = seed;
    this.rng = new SeededRandom(seed);
  }

  addAttractor(attractor: Attractor): void {
    this.config.attractors.push(attractor);
  }

  removeAttractor(id: string): void {
    this.config.attractors = this.config.attractors.filter(a => a.id !== id);
  }

  updateAttractor(id: string, updates: Partial<Attractor>): void {
    const index = this.config.attractors.findIndex(a => a.id === id);
    if (index >= 0) {
      this.config.attractors[index] = { ...this.config.attractors[index], ...updates };
    }
  }

  jitterAttractors(amount: number = 0.1): void {
    this.config.attractors.forEach(attractor => {
      attractor.pos.x += this.rng.range(-amount, amount);
      attractor.pos.y += this.rng.range(-amount, amount);
    });
  }

  toJSON(): string {
    return JSON.stringify(this.config);
  }

  static fromJSON(json: string): ConfigManager {
    try {
      const config = JSON.parse(json) as Partial<SceneConfig>;
      return new ConfigManager(config);
    } catch (e) {
      console.error('Failed to parse config JSON:', e);
      return new ConfigManager();
    }
  }
}
