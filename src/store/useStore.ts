import { create } from 'zustand';
import { SceneConfig, Attractor, Reinforcement } from '../types/config';
import { DEFAULT_CONFIG } from '../config/defaults';

interface AppState {
  config: SceneConfig;
  isPlaying: boolean;
  isExporting: boolean;

  // Actions
  setConfig: (config: Partial<SceneConfig>) => void;
  updateAttractor: (id: string, updates: Partial<Attractor>) => void;
  addAttractor: (attractor: Attractor) => void;
  removeAttractor: (id: string) => void;
  addReinforcement: (reinforcement: Reinforcement) => void;
  removeReinforcement: (id: string) => void;
  updateReinforcement: (id: string, updates: Partial<Reinforcement>) => void;
  setPlaying: (playing: boolean) => void;
  setExporting: (exporting: boolean) => void;
  reset: () => void;
}

export const useStore = create<AppState>((set) => ({
  config: DEFAULT_CONFIG,
  isPlaying: false,
  isExporting: false,

  setConfig: (partial) =>
    set((state) => ({
      config: {
        ...state.config,
        ...partial,
        surface: { ...state.config.surface, ...partial.surface },
        balls: { ...state.config.balls, ...partial.balls },
        labels: { ...state.config.labels, ...partial.labels },
        camera: { ...state.config.camera, ...partial.camera },
        render: { ...state.config.render, ...partial.render },
        export: { ...state.config.export, ...partial.export }
      }
    })),

  updateAttractor: (id, updates) =>
    set((state) => ({
      config: {
        ...state.config,
        attractors: state.config.attractors.map((a) =>
          a.id === id ? { ...a, ...updates } : a
        )
      }
    })),

  addAttractor: (attractor) =>
    set((state) => ({
      config: {
        ...state.config,
        attractors: [...state.config.attractors, attractor]
      }
    })),

  removeAttractor: (id) =>
    set((state) => ({
      config: {
        ...state.config,
        attractors: state.config.attractors.filter((a) => a.id !== id),
        // Also remove any reinforcements involving this attractor
        reinforcements: (state.config.reinforcements || []).filter(
          (r) => r.fromId !== id && r.toId !== id
        )
      }
    })),

  addReinforcement: (reinforcement) =>
    set((state) => ({
      config: {
        ...state.config,
        reinforcements: [...(state.config.reinforcements || []), reinforcement]
      }
    })),

  removeReinforcement: (id) =>
    set((state) => ({
      config: {
        ...state.config,
        reinforcements: (state.config.reinforcements || []).filter((r) => r.id !== id)
      }
    })),

  updateReinforcement: (id, updates) =>
    set((state) => ({
      config: {
        ...state.config,
        reinforcements: (state.config.reinforcements || []).map((r) =>
          r.id === id ? { ...r, ...updates } : r
        )
      }
    })),

  setPlaying: (playing) => set({ isPlaying: playing }),

  setExporting: (exporting) => set({ isExporting: exporting }),

  reset: () => set({ config: DEFAULT_CONFIG, isPlaying: false })
}));
