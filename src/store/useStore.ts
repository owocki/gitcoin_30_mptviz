import { create } from 'zustand';
import { SceneConfig, Attractor } from '../types/config';
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
        attractors: state.config.attractors.filter((a) => a.id !== id)
      }
    })),

  setPlaying: (playing) => set({ isPlaying: playing }),

  setExporting: (exporting) => set({ isExporting: exporting }),

  reset: () => set({ config: DEFAULT_CONFIG, isPlaying: false })
}));
