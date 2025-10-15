import React from 'react';
import { useStore } from '../store/useStore';
import { Attractor } from '../types/config';

export const Controls: React.FC = () => {
  const { config, updateAttractor, addAttractor, removeAttractor, setConfig } = useStore();

  const handleAddAttractor = () => {
    const newId = `a${Date.now()}`;
    const newAttractor: Attractor = {
      id: newId,
      pos: { x: 0, y: 0 },
      strength: 3.0,
      sigma: 0.12,
      color: '#66ccff'
    };
    addAttractor(newAttractor);
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setConfig({ labels: { ...config.labels, title: e.target.value } });
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.header}>Controls</h2>

      {/* Title */}
      <div style={styles.section}>
        <label style={styles.label}>Title</label>
        <input
          type="text"
          value={config.labels.title}
          onChange={handleTitleChange}
          style={styles.input}
        />
      </div>

      {/* Axis Labels */}
      <div style={styles.section}>
        <label style={styles.label}>X Axis</label>
        <input
          type="text"
          value={config.labels.x}
          onChange={(e) => setConfig({ labels: { ...config.labels, x: e.target.value } })}
          style={styles.input}
        />
      </div>

      <div style={styles.section}>
        <label style={styles.label}>Y Axis</label>
        <input
          type="text"
          value={config.labels.y}
          onChange={(e) => setConfig({ labels: { ...config.labels, y: e.target.value } })}
          style={styles.input}
        />
      </div>

      <div style={styles.section}>
        <label style={styles.label}>Z Axis</label>
        <input
          type="text"
          value={config.labels.z}
          onChange={(e) => setConfig({ labels: { ...config.labels, z: e.target.value } })}
          style={styles.input}
        />
      </div>

      {/* Mesh Configuration */}
      <div style={styles.section}>
        <h3 style={styles.subheader}>Mesh Settings</h3>

        <div style={styles.row}>
          <label style={styles.label}>
            Grid Density ({config.surface.resolution})
          </label>
          <input
            type="range"
            value={config.surface.resolution}
            onChange={(e) =>
              setConfig({
                surface: { ...config.surface, resolution: parseInt(e.target.value, 10) }
              })
            }
            min="16"
            max="256"
            step="16"
            style={styles.slider}
          />
        </div>

        <div style={styles.row}>
          <label style={styles.label}>
            Wire Thickness ({(config.surface.wireframeLinewidth || 1).toFixed(1)})
          </label>
          <input
            type="range"
            value={config.surface.wireframeLinewidth || 1}
            onChange={(e) =>
              setConfig({
                surface: { ...config.surface, wireframeLinewidth: parseFloat(e.target.value) }
              })
            }
            min="0.5"
            max="8"
            step="0.5"
            style={styles.slider}
          />
        </div>
      </div>

      {/* Attractors */}
      <div style={styles.section}>
        <h3 style={styles.subheader}>Attractors</h3>
        <button onClick={handleAddAttractor} style={styles.button}>
          Add Attractor
        </button>

        {config.attractors.map((attractor) => (
          <div key={attractor.id} style={styles.attractorCard}>
            <div style={styles.attractorHeader}>
              <span style={styles.attractorId}>ID: {attractor.id}</span>
              <button
                onClick={() => removeAttractor(attractor.id)}
                style={styles.removeButton}
              >
                Remove
              </button>
            </div>

            <div style={styles.row}>
              <label style={styles.smallLabel}>X Position</label>
              <input
                type="number"
                value={attractor.pos.x}
                onChange={(e) =>
                  updateAttractor(attractor.id, {
                    pos: { ...attractor.pos, x: parseFloat(e.target.value) }
                  })
                }
                step="0.1"
                style={styles.smallInput}
              />
            </div>

            <div style={styles.row}>
              <label style={styles.smallLabel}>Y Position</label>
              <input
                type="number"
                value={attractor.pos.y}
                onChange={(e) =>
                  updateAttractor(attractor.id, {
                    pos: { ...attractor.pos, y: parseFloat(e.target.value) }
                  })
                }
                step="0.1"
                style={styles.smallInput}
              />
            </div>

            <div style={styles.row}>
              <label style={styles.smallLabel}>
                Strength ({attractor.strength.toFixed(1)})
              </label>
              <input
                type="range"
                value={attractor.strength}
                onChange={(e) =>
                  updateAttractor(attractor.id, { strength: parseFloat(e.target.value) })
                }
                min="-10"
                max="10"
                step="0.1"
                style={styles.slider}
              />
            </div>

            <div style={styles.row}>
              <label style={styles.smallLabel}>Sigma ({attractor.sigma.toFixed(3)})</label>
              <input
                type="range"
                value={attractor.sigma}
                onChange={(e) =>
                  updateAttractor(attractor.id, { sigma: parseFloat(e.target.value) })
                }
                min="0.01"
                max="0.5"
                step="0.01"
                style={styles.slider}
              />
            </div>

            <div style={styles.row}>
              <label style={styles.smallLabel}>Color</label>
              <input
                type="color"
                value={attractor.color}
                onChange={(e) => updateAttractor(attractor.id, { color: e.target.value })}
                style={styles.colorInput}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const styles: Record<string, React.CSSProperties> = {
  container: {
    padding: '20px',
    backgroundColor: '#1a1d23',
    color: '#e0e0e0',
    height: '100vh',
    overflowY: 'auto',
    fontFamily: 'system-ui, -apple-system, sans-serif'
  },
  header: {
    marginTop: 0,
    marginBottom: '20px',
    fontSize: '24px',
    fontWeight: 600
  },
  subheader: {
    fontSize: '18px',
    fontWeight: 500,
    marginBottom: '10px'
  },
  section: {
    marginBottom: '20px'
  },
  label: {
    display: 'block',
    marginBottom: '8px',
    fontSize: '14px',
    fontWeight: 500
  },
  input: {
    width: '100%',
    padding: '8px 12px',
    backgroundColor: '#2a2d35',
    border: '1px solid #3a3d45',
    borderRadius: '4px',
    color: '#e0e0e0',
    fontSize: '14px',
    boxSizing: 'border-box'
  },
  button: {
    padding: '10px 16px',
    backgroundColor: '#4a7dff',
    border: 'none',
    borderRadius: '4px',
    color: 'white',
    fontSize: '14px',
    fontWeight: 500,
    cursor: 'pointer',
    width: '100%',
    marginBottom: '15px'
  },
  attractorCard: {
    backgroundColor: '#242730',
    padding: '15px',
    borderRadius: '8px',
    marginBottom: '15px',
    border: '1px solid #3a3d45'
  },
  attractorHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '12px'
  },
  attractorId: {
    fontSize: '12px',
    fontWeight: 600,
    color: '#8a8d95'
  },
  removeButton: {
    padding: '4px 10px',
    backgroundColor: '#ff4a4a',
    border: 'none',
    borderRadius: '4px',
    color: 'white',
    fontSize: '12px',
    cursor: 'pointer'
  },
  row: {
    marginBottom: '10px'
  },
  smallLabel: {
    display: 'block',
    marginBottom: '4px',
    fontSize: '12px',
    color: '#a0a3ab'
  },
  smallInput: {
    width: '100%',
    padding: '6px 10px',
    backgroundColor: '#2a2d35',
    border: '1px solid #3a3d45',
    borderRadius: '4px',
    color: '#e0e0e0',
    fontSize: '13px',
    boxSizing: 'border-box'
  },
  slider: {
    width: '100%',
    cursor: 'pointer'
  },
  colorInput: {
    width: '100%',
    height: '36px',
    backgroundColor: '#2a2d35',
    border: '1px solid #3a3d45',
    borderRadius: '4px',
    cursor: 'pointer'
  }
};
