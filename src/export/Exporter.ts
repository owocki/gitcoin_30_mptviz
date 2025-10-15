import { ExportConfig } from '../types/config';

export class Exporter {
  /**
   * Export current canvas as PNG
   */
  static async exportPNG(canvas: HTMLCanvasElement, filename: string = 'attractor-field.png'): Promise<void> {
    return new Promise((resolve, reject) => {
      canvas.toBlob((blob) => {
        if (!blob) {
          reject(new Error('Failed to create blob'));
          return;
        }

        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = filename;
        link.click();
        URL.revokeObjectURL(url);
        resolve();
      }, 'image/png');
    });
  }

  /**
   * Capture frames for GIF/WebM export
   * Returns array of frame data URLs
   */
  static async captureFrames(
    canvas: HTMLCanvasElement,
    onFrame: () => void,
    exportConfig: ExportConfig
  ): Promise<string[]> {
    const { durationSec, fps } = exportConfig;
    const totalFrames = Math.floor(durationSec * fps);
    const frames: string[] = [];

    for (let i = 0; i < totalFrames; i++) {
      // Call animation frame
      onFrame();

      // Capture frame
      const dataUrl = canvas.toDataURL('image/png');
      frames.push(dataUrl);

      // Wait for next frame time
      await new Promise(resolve => setTimeout(resolve, 1000 / fps));
    }

    return frames;
  }

  /**
   * Basic GIF export using canvas frames
   * Note: This is a simplified version. For production, consider using a library like gif.js
   */
  static async exportFramesAsZip(
    frames: string[],
    filename: string = 'frames.zip'
  ): Promise<void> {
    // For now, just download the first frame as a sample
    // In production, you'd bundle all frames or use a GIF encoder
    if (frames.length > 0) {
      const link = document.createElement('a');
      link.href = frames[0];
      link.download = 'frame-000.png';
      link.click();
    }
  }

  /**
   * Convert canvas to video blob using MediaRecorder
   * Works in modern browsers that support canvas.captureStream
   */
  static async exportWebM(
    canvas: HTMLCanvasElement,
    onFrame: () => void,
    exportConfig: ExportConfig,
    onProgress?: (progress: number) => void
  ): Promise<void> {
    const { durationSec, fps } = exportConfig;

    // Check if captureStream is supported
    if (!canvas.captureStream) {
      throw new Error('Canvas.captureStream not supported in this browser');
    }

    const stream = canvas.captureStream(fps);
    const mediaRecorder = new MediaRecorder(stream, {
      mimeType: 'video/webm;codecs=vp9',
      videoBitsPerSecond: 5000000
    });

    const chunks: Blob[] = [];

    return new Promise((resolve, reject) => {
      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunks.push(e.data);
        }
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunks, { type: 'video/webm' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'attractor-field.webm';
        link.click();
        URL.revokeObjectURL(url);
        resolve();
      };

      mediaRecorder.onerror = (e) => {
        reject(e);
      };

      mediaRecorder.start();

      // Animate for duration
      const frameInterval = 1000 / fps;
      const totalFrames = durationSec * fps;
      let frameCount = 0;

      const animateFrame = () => {
        if (frameCount >= totalFrames) {
          mediaRecorder.stop();
          return;
        }

        onFrame();
        frameCount++;

        if (onProgress) {
          onProgress(frameCount / totalFrames);
        }

        setTimeout(animateFrame, frameInterval);
      };

      animateFrame();
    });
  }
}
