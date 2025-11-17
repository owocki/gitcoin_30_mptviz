import React, { useState } from "react";
import { useStore } from "../store/useStore";
import { Attractor, Reinforcement } from "../types/config";
import { Button } from "./button";

export const Controls: React.FC = () => {
  const {
    config,
    updateAttractor,
    addAttractor,
    removeAttractor,
    addReinforcement,
    removeReinforcement,
    updateReinforcement,
    setConfig,
  } = useStore();
  const [newReinforcementFrom, setNewReinforcementFrom] = useState<string>("");
  const [newReinforcementTo, setNewReinforcementTo] = useState<string>("");

  const handleAddAttractor = () => {
    const newId = `a${Date.now()}`;
    const newAttractor: Attractor = {
      id: newId,
      pos: { x: 0, y: 0 },
      strength: 3.0,
      sigma: 0.12,
      color: "#66ccff",
    };
    addAttractor(newAttractor);
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setConfig({ labels: { ...config.labels, title: e.target.value } });
  };

  const handleAddReinforcement = () => {
    if (!newReinforcementFrom || !newReinforcementTo) {
      alert("Please select both From and To attractors");
      return;
    }
    if (newReinforcementFrom === newReinforcementTo) {
      alert("Cannot create reinforcement to the same attractor");
      return;
    }
    const newReinforcement: Reinforcement = {
      id: `r${Date.now()}`,
      fromId: newReinforcementFrom,
      toId: newReinforcementTo,
      strength: 1.0,
    };
    addReinforcement(newReinforcement);
    setNewReinforcementFrom("");
    setNewReinforcementTo("");
  };

  const getAttractorLabel = (id: string) => {
    const attractor = config.attractors.find((a) => a.id === id);
    return attractor?.label || id;
  };

  return (
    <div className="p-5 bg-moss-900 text-moss-100 h-screen overflow-y-auto font-sans">
      <h2 className="mt-0 mb-5 text-2xl font-semibold">Controls</h2>

      {/* Title */}
      <div className="mb-5">
        <label className="block mb-2 text-sm font-medium">Title</label>
        <input
          type="text"
          value={config.labels.title}
          onChange={handleTitleChange}
          className="w-full px-3 py-2 bg-moss-500 rounded text-moss-100 text-sm"
        />
      </div>

      {/* Axis Labels */}
      <div className="mb-5">
        <label className="block mb-2 text-sm font-medium">X Axis</label>
        <input
          type="text"
          value={config.labels.x}
          onChange={(e) =>
            setConfig({ labels: { ...config.labels, x: e.target.value } })
          }
          className="w-full px-3 py-2 bg-moss-500 rounded text-moss-100 text-sm"
        />
      </div>

      <div className="mb-5">
        <label className="block mb-2 text-sm font-medium">Y Axis</label>
        <input
          type="text"
          value={config.labels.y}
          onChange={(e) =>
            setConfig({ labels: { ...config.labels, y: e.target.value } })
          }
          className="w-full px-3 py-2 bg-moss-500 rounded text-moss-100 text-sm"
        />
      </div>

      <div className="mb-5">
        <label className="block mb-2 text-sm font-medium">Z Axis</label>
        <input
          type="text"
          value={config.labels.z}
          onChange={(e) =>
            setConfig({ labels: { ...config.labels, z: e.target.value } })
          }
          className="w-full px-3 py-2 bg-moss-500 rounded text-moss-100 text-sm"
        />
      </div>

      {/* Display Settings */}
      <div className="mb-5">
        <h3 className="text-lg font-medium mb-2.5">Display Settings</h3>

        <div className="mb-3">
          <label className="flex items-center text-sm cursor-pointer select-none">
            <input
              type="checkbox"
              checked={config.render.showAxes}
              onChange={(e) =>
                setConfig({
                  render: { ...config.render, showAxes: e.target.checked },
                })
              }
              className="mr-2.5 cursor-pointer w-[18px] h-[18px]"
            />
            Show Axis Lines
          </label>
        </div>

        <div className="mb-3">
          <label className="flex items-center text-sm cursor-pointer select-none">
            <input
              type="checkbox"
              checked={config.render.grid.show}
              onChange={(e) =>
                setConfig({
                  render: {
                    ...config.render,
                    grid: { ...config.render.grid, show: e.target.checked },
                  },
                })
              }
              className="mr-2.5 cursor-pointer w-[18px] h-[18px]"
            />
            Show Grid
          </label>
        </div>
      </div>

      {/* Mesh Configuration */}
      <div className="mb-5">
        <h3 className="text-lg font-medium mb-2.5">Mesh Settings</h3>

        <div className="mb-2.5">
          <label className="block mb-2 text-sm font-medium">
            Grid Density ({config.surface.resolution})
          </label>
          <input
            type="range"
            value={config.surface.resolution}
            onChange={(e) =>
              setConfig({
                surface: {
                  ...config.surface,
                  resolution: parseInt(e.target.value, 10),
                },
              })
            }
            min="16"
            max="256"
            step="16"
            className="w-full cursor-pointer"
          />
        </div>

        <div className="mb-2.5">
          <label className="block mb-2 text-sm font-medium">
            Wire Thickness (
            {(config.surface.wireframeLinewidth || 1).toFixed(1)})
          </label>
          <input
            type="range"
            value={config.surface.wireframeLinewidth || 1}
            onChange={(e) =>
              setConfig({
                surface: {
                  ...config.surface,
                  wireframeLinewidth: parseFloat(e.target.value),
                },
              })
            }
            min="0.5"
            max="8"
            step="0.5"
            className="w-full cursor-pointer"
          />
        </div>
      </div>

      {/* Attractors */}
      <div className="mb-5">
        <h3 className="text-lg font-medium mb-2.5">Attractors</h3>
        <Button className="mb-4 w-full" size="s" onClick={handleAddAttractor}>
          Add Attractor
        </Button>

        {config.attractors.map((attractor) => (
          <div
            key={attractor.id}
            className="bg-moss-900 p-4 rounded-lg mb-4 border border-moss-100/40"
          >
            <div className="flex justify-between items-center mb-3">
              <span className="text-xs font-semibold text-[#8a8d95]">
                ID: {attractor.id}
              </span>
              <Button
                variant="destructive"
                size="s"
                onClick={() => removeAttractor(attractor.id)}
              >
                Remove
              </Button>
            </div>

            <div className="mb-2.5">
              <label className="block mb-1 text-xs text-[#a0a3ab]">
                X Position
              </label>
              <input
                type="number"
                value={attractor.pos.x}
                onChange={(e) =>
                  updateAttractor(attractor.id, {
                    pos: { ...attractor.pos, x: parseFloat(e.target.value) },
                  })
                }
                step="0.1"
                className="w-full px-2.5 py-1.5 bg-moss-500 rounded text-moss-100 text-[13px]"
              />
            </div>

            <div className="mb-2.5">
              <label className="block mb-1 text-xs text-[#a0a3ab]">
                Y Position
              </label>
              <input
                type="number"
                value={attractor.pos.y}
                onChange={(e) =>
                  updateAttractor(attractor.id, {
                    pos: { ...attractor.pos, y: parseFloat(e.target.value) },
                  })
                }
                step="0.1"
                className="w-full px-2.5 py-1.5 bg-moss-500 rounded text-moss-100 text-[13px]"
              />
            </div>

            <div className="mb-2.5">
              <label className="block mb-1 text-xs text-[#a0a3ab]">
                Strength ({attractor.strength.toFixed(1)})
              </label>
              <input
                type="range"
                value={attractor.strength}
                onChange={(e) =>
                  updateAttractor(attractor.id, {
                    strength: parseFloat(e.target.value),
                  })
                }
                min="-10"
                max="10"
                step="0.1"
                className="w-full cursor-pointer"
              />
            </div>

            <div className="mb-2.5">
              <label className="block mb-1 text-xs text-[#a0a3ab]">
                Sigma ({attractor.sigma.toFixed(3)})
              </label>
              <input
                type="range"
                value={attractor.sigma}
                onChange={(e) =>
                  updateAttractor(attractor.id, {
                    sigma: parseFloat(e.target.value),
                  })
                }
                min="0.01"
                max="0.5"
                step="0.01"
                className="w-full cursor-pointer text-red-500"
              />
            </div>

            <div className="mb-2.5">
              <label className="block mb-1 text-xs text-[#a0a3ab]">Color</label>
              <input
                type="color"
                value={attractor.color}
                onChange={(e) =>
                  updateAttractor(attractor.id, { color: e.target.value })
                }
                className="w-full h-9 bg-moss-500 rounded cursor-pointer"
              />
            </div>

            <div className="mb-2.5">
              <label className="block mb-1 text-xs text-[#a0a3ab]">Label</label>
              <input
                type="text"
                value={attractor.label || ""}
                onChange={(e) =>
                  updateAttractor(attractor.id, { label: e.target.value })
                }
                placeholder="Optional label"
                className="w-full px-2.5 py-1.5 bg-moss-500 rounded text-moss-100 text-[13px]"
              />
            </div>
          </div>
        ))}
      </div>

      {/* Reinforcements */}
      <div className="mb-5">
        <h3 className="text-lg font-medium mb-2.5">Reinforcements</h3>
        <p className="text-xs text-[#8a8d95] -mt-1 mb-4">
          Connect attractors with circular arrows to show reinforcement
        </p>

        <div className="mb-2.5">
          <label className="block mb-1 text-xs text-[#a0a3ab]">
            From Attractor
          </label>
          <select
            value={newReinforcementFrom}
            onChange={(e) => setNewReinforcementFrom(e.target.value)}
            className="w-full px-3 py-2 bg-moss-500 rounded text-moss-100 text-sm cursor-pointer"
          >
            <option value="">Select attractor...</option>
            {config.attractors.map((a) => (
              <option key={a.id} value={a.id}>
                {a.label || a.id}
              </option>
            ))}
          </select>
        </div>

        <div className="mb-2.5">
          <label className="block mb-1 text-xs text-[#a0a3ab]">
            To Attractor
          </label>
          <select
            value={newReinforcementTo}
            onChange={(e) => setNewReinforcementTo(e.target.value)}
            className="w-full px-3 py-2 bg-moss-500 rounded text-moss-100 text-sm cursor-pointer"
          >
            <option value="">Select attractor...</option>
            {config.attractors.map((a) => (
              <option key={a.id} value={a.id}>
                {a.label || a.id}
              </option>
            ))}
          </select>
        </div>

        <Button
          onClick={handleAddReinforcement}
          size="s"
          className="w-full mb-4"
        >
          Add Reinforcement
        </Button>

        {(config.reinforcements || []).map((reinforcement) => (
          <div
            key={reinforcement.id}
            className="bg-moss-900 p-4 rounded-lg mt-2.5 border border-moss-100/40"
          >
            <div className="flex justify-between items-center mb-3">
              <span className="text-xs font-semibold text-[#8a8d95]">
                {getAttractorLabel(reinforcement.fromId)} →{" "}
                {getAttractorLabel(reinforcement.toId)}
              </span>
              <Button
                variant="destructive"
                size="s"
                onClick={() => removeReinforcement(reinforcement.id)}
              >
                Remove
              </Button>
            </div>

            <div className="mb-2.5">
              <label className="block mb-1 text-xs text-[#a0a3ab]">
                Strength ({reinforcement.strength.toFixed(2)})
              </label>
              <input
                type="range"
                value={reinforcement.strength}
                onChange={(e) =>
                  updateReinforcement(reinforcement.id, {
                    strength: parseFloat(e.target.value),
                  })
                }
                min="0"
                max="2"
                step="0.1"
                className="w-full cursor-pointer"
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
