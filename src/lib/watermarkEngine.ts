/**
 * Gemini Watermark Remover Engine
 * 100% Client-side Reverse Alpha Blending & Boundary Reconstruction
 * Zero server dependencies, runs locally in HTML5 Canvas.
 */

export interface WatermarkConfig {
  x: number;
  y: number;
  width: number;
  height: number;
  corner: 'bottom-right' | 'bottom-left' | 'top-right';
}

export interface ProcessResult {
  cleanedImageDataUrl: string;
  originalImageDataUrl: string;
  width: number;
  height: number;
  processingTimeMs: number;
  detectedCorner: string;
}

/**
 * Generates an analytical alpha mask for the Gemini 4-pointed sparkle watermark.
 * Google uses a 4-pointed star with smooth falloff and slight glow.
 */
function createSparkleAlphaMap(size: number): Float32Array {
  const map = new Float32Array(size * size);
  const center = size / 2;
  const radius = size * 0.42;

  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const dx = (x - center) / radius;
      const dy = (y - center) / radius;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist >= 1.0) {
        map[y * size + x] = 0;
        continue;
      }

      // 4-pointed star mathematical equation: |x|^0.5 + |y|^0.5 <= 1
      const p1 = Math.pow(Math.abs(dx), 0.55) + Math.pow(Math.abs(dy), 0.55);
      
      // Central core glow
      const core = Math.max(0, 1 - dist * 1.8);
      const star = Math.max(0, 1 - p1);

      let alpha = star * 0.85 + core * 0.45;
      alpha = Math.min(0.92, Math.max(0, alpha));
      
      // Smooth edge attenuation
      map[y * size + x] = alpha;
    }
  }

  return map;
}

/**
 * Detects the most likely corner containing the Gemini watermark
 */
export function detectWatermarkRegion(width: number, height: number): WatermarkConfig {
  // Determine watermark size based on image resolution
  const minDim = Math.min(width, height);
  let size = 96;
  let padding = 32;

  if (minDim < 600) {
    size = 48;
    padding = 16;
  } else if (minDim > 1600) {
    size = 128;
    padding = 48;
  }

  // Google Gemini default is bottom-right corner
  const x = Math.max(0, width - size - padding);
  const y = Math.max(0, height - size - padding);

  return {
    x,
    y,
    width: size,
    height: size,
    corner: 'bottom-right'
  };
}

/**
 * Executes Reverse Alpha Blending to mathematically restore the original background pixels.
 * Formula: P_original = (P_watermarked - alpha * 255) / (1 - alpha)
 */
export async function removeGeminiWatermark(
  imageElement: HTMLImageElement,
  customConfig?: Partial<WatermarkConfig>
): Promise<ProcessResult> {
  const startTime = performance.now();

  const width = imageElement.naturalWidth || imageElement.width;
  const height = imageElement.naturalHeight || imageElement.height;

  // Offscreen canvas for pristine pixel manipulation
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d', { willReadFrequently: true });

  if (!ctx) {
    throw new Error('Canvas 2D context is not supported');
  }

  // Draw original image
  ctx.drawImage(imageElement, 0, 0);

  // Original data URL for comparison slider
  const originalImageDataUrl = canvas.toDataURL('image/png');

  // Detect configuration
  const defaultCfg = detectWatermarkRegion(width, height);
  const cfg: WatermarkConfig = {
    ...defaultCfg,
    ...customConfig
  };

  const { x, y, width: wSize, height: hSize } = cfg;
  const imgData = ctx.getImageData(x, y, wSize, hSize);
  const pixels = imgData.data;

  // Generate alpha map for the star
  const alphaMap = createSparkleAlphaMap(wSize);

  // Step 1: Reverse Alpha Blending on each RGB channel
  for (let py = 0; py < hSize; py++) {
    for (let px = 0; px < wSize; px++) {
      const idx = (py * wSize + px) * 4;
      const alpha = alphaMap[py * wSize + px];

      if (alpha > 0.03) {
        const factor = Math.max(0.08, 1 - alpha);

        // Watermark color in Gemini is pure white (255, 255, 255) with alpha transparency
        for (let c = 0; c < 3; c++) {
          const originalEstimated = (pixels[idx + c] - alpha * 255) / factor;
          pixels[idx + c] = Math.min(255, Math.max(0, Math.round(originalEstimated)));
        }
      }
    }
  }

  // Step 2: Edge-aware bilinear smoothing to eliminate residual artifacts
  for (let py = 1; py < hSize - 1; py++) {
    for (let px = 1; px < wSize - 1; px++) {
      const alpha = alphaMap[py * wSize + px];
      // Only smooth areas where the watermark was strong
      if (alpha > 0.35) {
        const idx = (py * wSize + px) * 4;
        
        // Sample surrounding neighbor pixels
        for (let c = 0; c < 3; c++) {
          const up = pixels[((py - 1) * wSize + px) * 4 + c];
          const down = pixels[((py + 1) * wSize + px) * 4 + c];
          const left = pixels[(py * wSize + (px - 1)) * 4 + c];
          const right = pixels[(py * wSize + (px + 1)) * 4 + c];

          const avg = (up + down + left + right) / 4;
          const blendWeight = Math.min(0.45, alpha * 0.5);
          pixels[idx + c] = Math.round(pixels[idx + c] * (1 - blendWeight) + avg * blendWeight);
        }
      }
    }
  }

  // Put cleaned pixels back
  ctx.putImageData(imgData, x, y);

  const cleanedImageDataUrl = canvas.toDataURL('image/png', 1.0);
  const processingTimeMs = Math.round(performance.now() - startTime);

  return {
    cleanedImageDataUrl,
    originalImageDataUrl,
    width,
    height,
    processingTimeMs,
    detectedCorner: cfg.corner
  };
}
