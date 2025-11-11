import { useEffect, useRef } from 'react';
import p5 from 'p5';

const chars = "  .°oO0Q@●"; // darkest -> brightest
const DEFAULT_FONT_SIZE = 18;
const DEFAULT_SPEED = 0.5;
const GAMMA = 0.7;

export function HeroAnimation() {
  const containerRef = useRef<HTMLDivElement>(null);
  const p5Instance = useRef<p5 | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const sketch = (p: p5) => {
      let fontSize = DEFAULT_FONT_SIZE;
      let charWidth = fontSize * 0.5;
      let lineHeight = fontSize;
      let cols = 0;
      let rows = 0;
      let startMillis = 0;

      // Update font metrics helper
      const updateFontMetrics = (size: number) => {
        fontSize = size;
        lineHeight = fontSize;
        charWidth = fontSize * 0.7;
        p.textSize(fontSize);
        p.textLeading(lineHeight);
        computeGrid();
      };

      // Compute character grid dimensions
      const computeGrid = () => {
        cols = p.floor(p.width / charWidth);
        rows = p.floor(p.height / lineHeight);
      };

      // Plasma function
      const plasma = (x: number, y: number, t: number) => {
        const waveX = Math.sin(x * 0.1 + t * 0.5);
        const waveY = Math.sin(y * 0.1 - t * 0.5);
        const diag = Math.sin((x + y) * 0.02 + t * 0.5);
        return ((waveX + waveY + diag) / 3 + 1) * 0.5;
      };

      // Map value to character
      const mapToChar = (v: number) => {
        const g = Math.pow(p.constrain(v, 0, 1), GAMMA);
        const idx = p.floor(g * (chars.length - 1) + 0.5);
        return chars[idx];
      };

      // Render one ASCII layer
      const renderLayer = (
        sampleShiftX: number,
        sampleShiftY: number,
        timeOffset: number,
        drawShiftX: number,
        drawShiftY: number,
        timeBase: number
      ) => {
        for (let y = 0; y < rows; y++) {
          for (let x = 0; x < cols; x++) {
            const sx = x * 1 + sampleShiftX;
            const sy = y * 1 + sampleShiftY;
            const ch = mapToChar(plasma(sx, sy, timeBase + timeOffset));
            const px = x * charWidth + drawShiftX;
            const py = y * lineHeight + drawShiftY;
            p.text(ch, px, py);
          }
        }
      };

      // p5.js setup
      p.setup = () => {
        const canvas = p.createCanvas(
          containerRef.current?.clientWidth || window.innerWidth,
          containerRef.current?.clientHeight || window.innerHeight
        );
        canvas.parent(containerRef.current!);

        p.textFont("monospace");
        p.textAlign(p.LEFT, p.TOP);
        p.noStroke();

        updateFontMetrics(DEFAULT_FONT_SIZE);
        startMillis = p.millis();
      };

      // p5.js draw loop
      p.draw = () => {
        p.background(12, 39, 37); // moss-900 color

        const elapsed = ((p.millis() - startMillis) / 1000) * DEFAULT_SPEED;

        // Base layer (moss-500 color)
        p.fill(31, 80, 74);
        renderLayer(0, 0, 0, 0, 0, elapsed);
      };

      // Handle window resize
      p.windowResized = () => {
        if (containerRef.current) {
          p.resizeCanvas(
            containerRef.current.clientWidth,
            containerRef.current.clientHeight
          );
          computeGrid();
        }
      };
    };

    // Create p5 instance
    p5Instance.current = new p5(sketch);

    // Cleanup on unmount
    return () => {
      if (p5Instance.current) {
        p5Instance.current.remove();
        p5Instance.current = null;
      }
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="w-full h-screen"
      style={{ overflow: 'hidden' }}
    />
  );
}
