import { useEffect, useRef } from 'react';
import p5 from 'p5';

// Configuration constants
const SPHERE_RADIUS = 300;
const LAT_LINES = 16;
const LON_LINES = 32;
const SMOOTH_STEP = 2;
const TILT_DEG = 15;
const SPIN_SPEED_DEG = 0.173;

const WIREFRAME_COLOR = "#CDF3A3";
const INNER_SPHERE_RADIUS = SPHERE_RADIUS * 0.45;
const INNER_SPHERE_COLOR = "#EF7E5F";
const INNER_SPHERE_ALPHA = 150;
const INNER_SPLIT_RADIUS = 8;
const INNER_SPLIT_COUNT = 1000;
const INNER_SPLIT_SIZE_RANGE = [0.4, 2];
const INNER_SPLIT_ACTIVATION_RANGE = [0.01, 0.035];
const ATTRACTION_STRENGTH = 0.2;
const RETURN_STRENGTH = 0.2;
const REPULSION_STRENGTH = 0.2;

interface GlobeAnimationProps {
  width?: number;
  height?: number;
}

export function GlobeAnimation({ width = 400, height = 400 }: GlobeAnimationProps = {}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const p5Instance = useRef<p5 | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const sketch = (p: p5) => {
      // Scale the sphere to fit the canvas (original was 900x900 with radius 300)
      const scaleFactor = width / 900;
      const sphereRadius = SPHERE_RADIUS * scaleFactor;
      const innerSphereRadius = sphereRadius * 0.45;
      // Scale particle count proportionally to canvas area
      const particleCount = Math.floor(INNER_SPLIT_COUNT * scaleFactor * scaleFactor);
      // Scale movement speeds UP to maintain visual speed in smaller canvas
      // Since distances are scaled down, we need to compensate by scaling speeds up
      const speedScale = 1 / scaleFactor;
      const attractionStrength = ATTRACTION_STRENGTH * speedScale;
      const returnStrength = RETURN_STRENGTH * speedScale;
      const repulsionStrength = REPULSION_STRENGTH * speedScale;
      let spinAngle = 0;
      let innerSplitPositions: p5.Vector[] = [];
      let innerSplitBasePositions: p5.Vector[] = [];
      let innerSplitSizes: number[] = [];
      let innerSplitActivation: number[] = [];
      let innerSplitActivationRates: number[] = [];

      const generateInnerSplitPositions = (count: number) => {
        innerSplitPositions = [];
        innerSplitBasePositions = [];
        innerSplitSizes = [];
        innerSplitActivation = [];
        innerSplitActivationRates = [];

        for (let i = 0; i < count; i++) {
          let direction = p5.Vector.random3D();
          let radiusFactor = p.random(0.1, 2);
          let basePos = direction.mult(innerSphereRadius * radiusFactor);
          innerSplitPositions.push(basePos.copy());
          innerSplitBasePositions.push(basePos);
          innerSplitSizes.push(p.random(INNER_SPLIT_SIZE_RANGE[0], INNER_SPLIT_SIZE_RANGE[1]));
          innerSplitActivation.push(0);
          innerSplitActivationRates.push(
            p.random(INNER_SPLIT_ACTIVATION_RANGE[0], INNER_SPLIT_ACTIVATION_RANGE[1])
          );
        }
      };

      const getPointerVector = () => {
        let pointer = p.createVector(p.mouseX - p.width / 2, p.mouseY - p.height / 2, 0);
        let limitRadius = innerSphereRadius * 1.2;
        if (pointer.mag() > limitRadius) {
          pointer.setMag(limitRadius);
        }
        return pointer;
      };

      const updateInnerSplitPositions = (
        isHovering: boolean,
        pointerVec: p5.Vector | null,
        pointerInsideSphere: boolean
      ) => {
        for (let i = 0; i < innerSplitPositions.length; i++) {
          let current = innerSplitPositions[i];
          let activation = innerSplitActivation[i];
          let activationRate = innerSplitActivationRates[i];

          if (!pointerVec) {
            let baseDir = p5.Vector.sub(innerSplitBasePositions[i], current);
            baseDir.mult(returnStrength);
            current.add(baseDir);
            innerSplitActivation[i] = p.max(0, activation - activationRate);
            continue;
          }

          if (isHovering && !pointerInsideSphere) {
            activation = p.min(1, activation + activationRate);
            innerSplitActivation[i] = activation;
            let direction = p5.Vector.sub(pointerVec, current);
            direction.mult(attractionStrength * activation);
            current.add(direction);
          } else {
            activation = p.max(0, activation - activationRate * 1.5);
            innerSplitActivation[i] = activation;
            let away = p5.Vector.sub(current, pointerVec);
            if (away.magSq() !== 0) {
              away.normalize();
              away.mult(repulsionStrength * innerSphereRadius * (0.5 + activation));
              current.add(away);
            }
            let baseDir = p5.Vector.sub(innerSplitBasePositions[i], current);
            baseDir.mult(returnStrength);
            current.add(baseDir);
          }
        }
      };

      const drawLatitudeLines = (lineColor: string) => {
        for (let i = 1; i < LAT_LINES; i++) {
          let phi = p.map(i, 0, LAT_LINES, -90, 90);
          let cosPhi = p.cos(phi);
          let sinPhi = p.sin(phi);
          p.stroke(lineColor);
          p.beginShape();
          for (let deg = 0; deg <= 360; deg += SMOOTH_STEP) {
            let theta = deg;
            let cosTheta = p.cos(theta);
            let sinTheta = p.sin(theta);
            let x = sphereRadius * cosPhi * cosTheta;
            let y = sphereRadius * sinPhi;
            let z = sphereRadius * cosPhi * sinTheta;
            p.vertex(x, y, z);
          }
          p.endShape();
        }
      };

      const drawLongitudeLines = (lineColor: string) => {
        for (let i = 0; i < LON_LINES; i++) {
          let theta = p.map(i, 0, LON_LINES, 0, 360);
          let cosTheta = p.cos(theta);
          let sinTheta = p.sin(theta);
          p.stroke(lineColor);
          p.beginShape();
          for (let deg = -90; deg <= 90; deg += SMOOTH_STEP) {
            let phi = deg;
            let cosPhi = p.cos(phi);
            let sinPhi = p.sin(phi);
            let x = sphereRadius * cosPhi * cosTheta;
            let y = sphereRadius * sinPhi;
            let z = sphereRadius * cosPhi * sinTheta;
            p.vertex(x, y, z);
          }
          p.endShape();
        }
      };

      const getInnerCircleColor = () => {
        let c = p.color(INNER_SPHERE_COLOR);
        c.setAlpha(INNER_SPHERE_ALPHA);
        return c;
      };

      const drawInnerCore = (splitCount: number) => {
        p.push();
        p.noStroke();
        p.fill(getInnerCircleColor());
        if (splitCount <= 1) {
          p.circle(0, 0, innerSphereRadius * 2);
        } else {
          const scaledSplitRadius = INNER_SPLIT_RADIUS * scaleFactor;
          for (let i = 0; i < innerSplitPositions.length; i++) {
            let pos = innerSplitPositions[i];
            let sizeFactor = innerSplitSizes[i] ?? 1;
            p.push();
            p.translate(pos.x, pos.y, pos.z);
            p.circle(0, 0, scaledSplitRadius * 2 * sizeFactor);
            p.pop();
          }
        }
        p.pop();
      };

      p.setup = () => {
        const canvas = p.createCanvas(width, height, p.WEBGL);
        canvas.parent(containerRef.current!);
        p.pixelDensity(1);
        p.angleMode(p.DEGREES);
        p.strokeWeight(1);
        generateInnerSplitPositions(particleCount);
      };

      p.draw = () => {
        p.clear();
        spinAngle += SPIN_SPEED_DEG;

        let isHovering =
          p.mouseX >= 0 && p.mouseX <= p.width && p.mouseY >= 0 && p.mouseY <= p.height;
        let pointerVec = getPointerVector();
        let pointerInsideSphere = pointerVec.mag() <= innerSphereRadius;

        if (particleCount > 1) {
          updateInnerSplitPositions(isHovering, pointerVec, pointerInsideSphere);
        }

        p.push();
        p.noFill();
        p.rotateZ(TILT_DEG);
        p.rotateY(spinAngle);
        drawLatitudeLines(WIREFRAME_COLOR);
        drawLongitudeLines(WIREFRAME_COLOR);
        p.pop();

        drawInnerCore(particleCount);
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
      className="flex items-center justify-center w-full max-w-[280px] mx-auto sm:max-w-[400px]"
      style={{ aspectRatio: '1 / 1', maxHeight: width }}
    />
  );
}
