import { BG_48_BASE64, BG_96_BASE64 } from './watermarkAssets';

export interface WatermarkSettings {
  offsetX: number;
  offsetY: number;
  sizeScale: number;
  gain: number;
}

export interface DetectionResult {
  matchFound: boolean;
  score: number;
  presetKey: string;
  name: string;
  offsetX: number;
  offsetY: number;
  sizeScale: number;
  gain: number;
  detectedX: number;
  detectedY: number;
  detectedSize: number;
}

export interface ProcessResult {
  cleanedImageDataUrl: string;
  originalImageDataUrl: string;
  width: number;
  height: number;
  processingTimeMs: number;
  detected: DetectionResult;
  currentSettings: WatermarkSettings;
  watermarkBox: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
}

// Global cached image templates
let cachedBg48: HTMLImageElement | null = null;
let cachedBg96: HTMLImageElement | null = null;
let bgLoadingPromise: Promise<[HTMLImageElement, HTMLImageElement]> | null = null;

function loadTemplateImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    if (typeof window === 'undefined') {
      return reject(new Error('Window is not defined'));
    }
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => resolve(img);
    img.onerror = (e) => reject(e);
    img.src = src;
  });
}

export async function getWatermarkTemplates(): Promise<{ bg48: HTMLImageElement; bg96: HTMLImageElement }> {
  if (cachedBg48 && cachedBg96) {
    return { bg48: cachedBg48, bg96: cachedBg96 };
  }
  if (!bgLoadingPromise) {
    bgLoadingPromise = Promise.all([
      loadTemplateImage(BG_48_BASE64),
      loadTemplateImage(BG_96_BASE64),
    ]);
  }
  const [bg48, bg96] = await bgLoadingPromise;
  cachedBg48 = bg48;
  cachedBg96 = bg96;
  return { bg48, bg96 };
}

export function getWatermarkInfo(width: number, height: number) {
  const minDim = Math.min(width, height);
  const ratio = minDim / 1536;
  const size = Math.max(16, Math.round(96 * ratio));
  const margin = Math.max(8, Math.round(64 * ratio));

  return {
    size,
    x: Math.max(0, width - margin - size),
    y: Math.max(0, height - margin - size),
    width: size,
    height: size,
  };
}

export function getRoi(width: number, height: number, wm: { x: number; y: number; width: number; height: number; size: number }) {
  const pad = Math.round(wm.size * 0.6);
  const rx = Math.max(0, Math.min(width - 1, wm.x - pad));
  const ry = Math.max(0, Math.min(height - 1, wm.y - pad));
  const rw = Math.max(1, Math.min(width - rx, wm.width + pad * 2));
  const rh = Math.max(1, Math.min(height - ry, wm.height + pad * 2));
  return { x: rx, y: ry, width: rw, height: rh };
}

export function resolveBox(
  base: { size: number; x: number; y: number },
  width: number,
  height: number,
  opts: { sizeScale?: number; offsetX?: number; offsetY?: number } = {}
) {
  const sizeScale = opts.sizeScale || 1;
  const size = Math.max(8, Math.min(Math.round(base.size * sizeScale), Math.min(width, height)));
  const x = Math.max(0, Math.min(base.x + Math.round(opts.offsetX || 0), width - size));
  const y = Math.max(0, Math.min(base.y + Math.round(opts.offsetY || 0), height - size));
  return { size, x, y, width: size, height: size };
}

export function buildAlpha(
  bgImg: HTMLImageElement | HTMLCanvasElement,
  roi: { x: number; y: number; width: number; height: number },
  wm: { x: number; y: number; size: number },
  gain: number = 1
) {
  const count = roi.width * roi.height;
  const alphaMap = new Float32Array(count);
  const offX = wm.x - roi.x;
  const offY = wm.y - roi.y;

  const c = document.createElement('canvas');
  c.width = wm.size;
  c.height = wm.size;
  const cx = c.getContext('2d', { willReadFrequently: true });
  if (!cx) return alphaMap;

  cx.imageSmoothingEnabled = true;
  cx.imageSmoothingQuality = 'high';
  cx.drawImage(bgImg, 0, 0, wm.size, wm.size);
  const data = cx.getImageData(0, 0, wm.size, wm.size).data;

  for (let row = 0; row < wm.size; row++) {
    for (let col = 0; col < wm.size; col++) {
      const ri = (offY + row) * roi.width + (offX + col);
      if (ri < 0 || ri >= count) continue;
      const o = (row * wm.size + col) * 4;
      const a = (Math.max(data[o], data[o + 1], data[o + 2]) / 255.0) * gain;
      alphaMap[ri] = a > 0 ? Math.min(a, 0.99) : 0;
    }
  }
  return alphaMap;
}

const ALPHA_THRESHOLD = 0.002;
const MAX_ALPHA = 0.99;
const LOGO_VALUE = 255;

export function removeWatermark(
  imageData: ImageData,
  alphaMap: Float32Array,
  position: { x: number; y: number; width: number; height: number },
  options: { alphaGain?: number } = {}
) {
  const { x, y, width, height } = position;
  const gain = Number.isFinite(options.alphaGain) && (options.alphaGain ?? 1) > 0
    ? (options.alphaGain ?? 1)
    : 1;

  for (let row = 0; row < height; row++) {
    for (let col = 0; col < width; col++) {
      const imgIdx = ((y + row) * imageData.width + (x + col)) * 4;
      const alphaIdx = row * width + col;

      let alpha = alphaMap[alphaIdx] * gain;
      if (alpha < ALPHA_THRESHOLD) continue;
      alpha = Math.min(alpha, MAX_ALPHA);

      for (let c = 0; c < 3; c++) {
        const watermarked = imageData.data[imgIdx + c];
        const original = (watermarked - alpha * LOGO_VALUE) / (1.0 - alpha);
        imageData.data[imgIdx + c] = Math.max(0, Math.min(255, Math.round(original)));
      }
    }
  }
}

export function cleanFrame(
  bgImg: HTMLImageElement | HTMLCanvasElement,
  imageData: ImageData,
  width: number,
  height: number,
  base: { size: number; x: number; y: number },
  opts: { sizeScale?: number; offsetX?: number; offsetY?: number; gain?: number } = {}
) {
  const wm = resolveBox(base, width, height, opts);
  const roi = getRoi(width, height, wm);
  const alpha = buildAlpha(bgImg, roi, wm, opts.gain ?? 1);
  removeWatermark(imageData, alpha, {
    x: roi.x,
    y: roi.y,
    width: roi.width,
    height: roi.height,
  });
  return { wm, roi };
}

const alphaTemplateCache = new Map<number, { raw: Uint8ClampedArray; alphas: Float32Array; gradMag: Float32Array; size: number }>();

export function getAlphaTemplateData(bgImg: HTMLImageElement | HTMLCanvasElement, size: number) {
  if (alphaTemplateCache.has(size)) {
    return alphaTemplateCache.get(size)!;
  }
  const c = document.createElement('canvas');
  c.width = size;
  c.height = size;
  const cx = c.getContext('2d', { willReadFrequently: true });
  if (!cx) throw new Error('Cannot create 2d context for template');
  cx.imageSmoothingEnabled = true;
  cx.imageSmoothingQuality = 'high';
  cx.drawImage(bgImg, 0, 0, size, size);
  const raw = cx.getImageData(0, 0, size, size).data;

  const alphas = new Float32Array(size * size);
  for (let i = 0; i < alphas.length; i++) {
    const o = i * 4;
    alphas[i] = Math.max(raw[o], raw[o + 1], raw[o + 2]) / 255.0;
  }

  const gradMag = new Float32Array(size * size);
  for (let r = 1; r < size - 1; r++) {
    for (let col = 1; col < size - 1; col++) {
      const idx = r * size + col;
      const gx = alphas[idx + 1] - alphas[idx - 1];
      const gy = alphas[(r + 1) * size + col] - alphas[(r - 1) * size + col];
      gradMag[idx] = Math.sqrt(gx * gx + gy * gy);
    }
  }

  const template = { raw, alphas, gradMag, size };
  alphaTemplateCache.set(size, template);
  return template;
}

export function evaluateCandidateMatch(
  imageData: ImageData,
  width: number,
  height: number,
  bgImg: HTMLImageElement | HTMLCanvasElement,
  box: { x: number; y: number; size: number }
) {
  const { x, y, size } = box;
  if (x < 0 || y < 0 || x + size > width || y + size > height || size <= 0) {
    return { score: -1, variance: 0 };
  }

  const template = getAlphaTemplateData(bgImg, size);
  const { alphas, gradMag } = template;

  let sumL = 0, sumA = 0;
  let sumL2 = 0, sumA2 = 0;
  let sumLA = 0;

  let sumInvL = 0;
  let sumInvL2 = 0;
  let sumInvLA = 0;

  let sumG = 0, sumGA = 0;
  let sumG2 = 0, sumGA2 = 0;
  let sumGGA = 0;

  let n = 0;
  let nGrad = 0;

  const step = size > 80 ? 2 : 1;

  for (let r = 0; r < size; r += step) {
    const imgRow = y + r;
    for (let col = 0; col < size; col += step) {
      const imgCol = x + col;
      const imgIdx = (imgRow * width + imgCol) * 4;
      const alphaIdx = r * size + col;

      const rVal = imageData.data[imgIdx];
      const gVal = imageData.data[imgIdx + 1];
      const bVal = imageData.data[imgIdx + 2];
      const lum = 0.299 * rVal + 0.587 * gVal + 0.114 * bVal;
      const invLum = 255.0 - lum;
      const alpha = alphas[alphaIdx];

      sumL += lum;
      sumA += alpha;
      sumL2 += lum * lum;
      sumA2 += alpha * alpha;
      sumLA += lum * alpha;

      sumInvL += invLum;
      sumInvL2 += invLum * invLum;
      sumInvLA += invLum * alpha;
      n++;

      // Gradient analysis (high-frequency sparkle edges)
      if (
        r > 0 && r < size - 1 &&
        col > 0 && col < size - 1 &&
        imgRow > 0 && imgRow < height - 1 &&
        imgCol > 0 && imgCol < width - 1
      ) {
        const leftIdx = (imgRow * width + (imgCol - 1)) * 4;
        const rightIdx = (imgRow * width + (imgCol + 1)) * 4;
        const upIdx = ((imgRow - 1) * width + imgCol) * 4;
        const downIdx = ((imgRow + 1) * width + imgCol) * 4;

        const lumLeft = 0.299 * imageData.data[leftIdx] + 0.587 * imageData.data[leftIdx + 1] + 0.114 * imageData.data[leftIdx + 2];
        const lumRight = 0.299 * imageData.data[rightIdx] + 0.587 * imageData.data[rightIdx + 1] + 0.114 * imageData.data[rightIdx + 2];
        const lumUp = 0.299 * imageData.data[upIdx] + 0.587 * imageData.data[upIdx + 1] + 0.114 * imageData.data[upIdx + 2];
        const lumDown = 0.299 * imageData.data[downIdx] + 0.587 * imageData.data[downIdx + 1] + 0.114 * imageData.data[downIdx + 2];

        const gx = lumRight - lumLeft;
        const gy = lumDown - lumUp;
        const imgGrad = Math.sqrt(gx * gx + gy * gy);
        const aGrad = gradMag[alphaIdx];

        sumG += imgGrad;
        sumGA += aGrad;
        sumG2 += imgGrad * imgGrad;
        sumGA2 += aGrad * aGrad;
        sumGGA += imgGrad * aGrad;
        nGrad++;
      }
    }
  }

  if (n === 0) return { score: -1, variance: 0 };

  const meanL = sumL / n;
  const meanA = sumA / n;
  const varL = Math.max(0, sumL2 / n - meanL * meanL);
  const varA = Math.max(0, sumA2 / n - meanA * meanA);

  if (varA <= 0.0001) {
    return { score: 0, variance: varL };
  }

  // White polarity NCC
  let nccWhite = 0;
  if (varL > 0.5) {
    const covLA = sumLA / n - meanL * meanA;
    nccWhite = covLA / Math.sqrt(varL * varA);
  }

  // Dark polarity NCC (for bright white backgrounds)
  let nccDark = 0;
  const meanInvL = sumInvL / n;
  const varInvL = Math.max(0, sumInvL2 / n - meanInvL * meanInvL);
  if (varInvL > 0.5 && meanL > 160) {
    const covInvLA = sumInvLA / n - meanInvL * meanA;
    nccDark = covInvLA / Math.sqrt(varInvL * varA);
  }

  const nccLum = Math.max(nccWhite, nccDark);

  // Gradient edge NCC
  let nccGrad = 0;
  if (nGrad > 10) {
    const meanG = sumG / nGrad;
    const meanGA = sumGA / nGrad;
    const varG = Math.max(0, sumG2 / nGrad - meanG * meanG);
    const varGA = Math.max(0, sumGA2 / nGrad - meanGA * meanGA);
    if (varG > 0.5 && varGA > 0.0001) {
      const covGGA = sumGGA / nGrad - meanG * meanGA;
      nccGrad = Math.max(0, covGGA / Math.sqrt(varG * varGA));
    }
  }

  let fusedScore = (nccLum * 0.65) + (nccGrad * 0.35);
  if (varL < 20) {
    fusedScore = Math.max(fusedScore, (nccLum * 0.40) + (nccGrad * 0.60));
  }

  return { score: Math.max(0, fusedScore), variance: varL };
}

export function detectWatermarkCandidate(
  imageData: ImageData,
  width: number,
  height: number,
  bgImg: HTMLImageElement | HTMLCanvasElement
): DetectionResult {
  const minDim = Math.min(width, height);
  const baseRatio = minDim / 1536;
  const base = getWatermarkInfo(width, height);

  const layoutFamilies = [
    // 1. Gemini Adaptive Inset (12.5% Inset)
    {
      presetKey: 'new',
      name: 'Gemini Adaptive Inset (12.5%)',
      baseSize: base.size,
      calcPos: (s: number) => {
        const m = Math.max(8, Math.round(192 * baseRatio));
        return { x: Math.max(0, width - m - s), y: Math.max(0, height - m - s) };
      },
      gain: 0.6,
      prior: 1.08,
    },
    // 2. Classic Corner Adaptive (4.16% Margin)
    {
      presetKey: 'classic',
      name: 'Classic Corner Adaptive',
      baseSize: base.size,
      calcPos: (s: number) => {
        const m = Math.max(8, Math.round(64 * baseRatio));
        return { x: Math.max(0, width - m - s), y: Math.max(0, height - m - s) };
      },
      gain: 1.0,
      prior: 1.04,
    },
    // 3. Fixed Standard (96px watermark regardless of crop/resize)
    {
      presetKey: 'fixed_inset',
      name: 'Gemini Fixed 96px Inset',
      baseSize: 96,
      calcPos: (s: number) => {
        const m = minDim >= 1400 ? 192 : Math.round(128 * Math.max(0.5, minDim / 1024));
        return { x: Math.max(0, width - m - s), y: Math.max(0, height - m - s) };
      },
      gain: 0.6,
      prior: 1.02,
    },
    // 4. Fixed 96px Classic Corner
    {
      presetKey: 'fixed_corner',
      name: 'Classic Corner Fixed 96px',
      baseSize: 96,
      calcPos: (s: number) => {
        const m = minDim >= 1024 ? 64 : 32;
        return { x: Math.max(0, width - m - s), y: Math.max(0, height - m - s) };
      },
      gain: 1.0,
      prior: 1.01,
    },
  ];

  const scalePyramid = [0.55, 0.70, 0.85, 1.00, 1.15, 1.30, 1.50, 1.70];

  let bestMatch: any = null;
  let bestScore = -1;

  for (const layout of layoutFamilies) {
    for (const scale of scalePyramid) {
      const s = Math.max(16, Math.min(Math.round(layout.baseSize * scale), Math.min(width, height) - 8));
      const pos = layout.calcPos(s);
      const { score } = evaluateCandidateMatch(imageData, width, height, bgImg, { x: pos.x, y: pos.y, size: s });
      const weightedScore = score * (layout.prior || 1.0);

      if (weightedScore > bestScore) {
        bestScore = weightedScore;
        bestMatch = {
          layout,
          size: s,
          scale,
          x: pos.x,
          y: pos.y,
          score: weightedScore,
        };
      }
    }
  }

  // Refinement: Joint 2D Position (±16px) and Scale fine-tuning (±10%)
  if (bestMatch && bestMatch.score > 0.05) {
    let refinedX = bestMatch.x;
    let refinedY = bestMatch.y;
    let refinedSize = bestMatch.size;
    let refinedScore = bestMatch.score;

    const fineSizes = [
      Math.max(16, Math.round(bestMatch.size * 0.90)),
      Math.max(16, Math.round(bestMatch.size * 0.95)),
      bestMatch.size,
      Math.min(Math.min(width, height) - 8, Math.round(bestMatch.size * 1.05)),
      Math.min(Math.min(width, height) - 8, Math.round(bestMatch.size * 1.10)),
    ];
    const uniqueSizes = Array.from(new Set(fineSizes));

    for (const testSize of uniqueSizes) {
      for (let dy = -16; dy <= 16; dy += 4) {
        for (let dx = -16; dx <= 16; dx += 4) {
          const testX = Math.max(0, Math.min(width - testSize, bestMatch.x + dx));
          const testY = Math.max(0, Math.min(height - testSize, bestMatch.y + dy));
          const { score } = evaluateCandidateMatch(imageData, width, height, bgImg, { x: testX, y: testY, size: testSize });
          const weightedScore = score * (bestMatch.layout.prior || 1.0);

          if (weightedScore > refinedScore) {
            refinedScore = weightedScore;
            refinedX = testX;
            refinedY = testY;
            refinedSize = testSize;
          }
        }
      }
    }

    const calculatedScale = Math.round((refinedSize / base.size) * 100) / 100;

    return {
      matchFound: refinedScore >= 0.10,
      score: Math.min(1.0, refinedScore),
      presetKey: bestMatch.layout.presetKey,
      name: `${bestMatch.layout.name} (${refinedSize}px)`,
      offsetX: refinedX - base.x,
      offsetY: refinedY - base.y,
      sizeScale: Math.max(0.5, Math.min(2.5, calculatedScale)),
      gain: bestMatch.layout.gain || 0.6,
      detectedX: refinedX,
      detectedY: refinedY,
      detectedSize: refinedSize,
    };
  }

  const fallbackOffset = Math.round(-128 * baseRatio);
  return {
    matchFound: false,
    score: bestScore > 0 ? bestScore : 0,
    presetKey: 'new',
    name: 'Gemini Adaptive Inset (Default)',
    offsetX: fallbackOffset,
    offsetY: fallbackOffset,
    sizeScale: 1.0,
    gain: 0.6,
    detectedX: Math.max(0, width - base.size - Math.round(192 * baseRatio)),
    detectedY: Math.max(0, height - base.size - Math.round(192 * baseRatio)),
    detectedSize: base.size,
  };
}

/**
 * Main function: Process Gemini image locally using Canvas & exact Reverse Alpha Unblending
 */
export async function removeGeminiWatermark(
  imageElement: HTMLImageElement,
  customSettings?: Partial<WatermarkSettings>
): Promise<ProcessResult> {
  const startTime = performance.now();
  const width = imageElement.naturalWidth || imageElement.width;
  const height = imageElement.naturalHeight || imageElement.height;

  const { bg96 } = await getWatermarkTemplates();

  // Draw source image to canvas
  const srcCanvas = document.createElement('canvas');
  srcCanvas.width = width;
  srcCanvas.height = height;
  const srcCtx = srcCanvas.getContext('2d', { willReadFrequently: true });
  if (!srcCtx) throw new Error('Failed to initialize 2D canvas context');
  srcCtx.drawImage(imageElement, 0, 0);

  const originalImageDataUrl = srcCanvas.toDataURL('image/png');
  const base = getWatermarkInfo(width, height);
  const srcImageData = srcCtx.getImageData(0, 0, width, height);

  // Auto-detect watermark location & properties
  const detected = detectWatermarkCandidate(srcImageData, width, height, bg96);

  // Resolve final settings (user overrides > detected)
  const currentSettings: WatermarkSettings = {
    offsetX: customSettings?.offsetX !== undefined ? customSettings.offsetX : detected.offsetX,
    offsetY: customSettings?.offsetY !== undefined ? customSettings.offsetY : detected.offsetY,
    sizeScale: customSettings?.sizeScale !== undefined ? customSettings.sizeScale : detected.sizeScale,
    gain: customSettings?.gain !== undefined ? customSettings.gain : detected.gain,
  };

  // Perform pristine reverse alpha unblending
  const copyImageData = srcCtx.getImageData(0, 0, width, height);
  const { wm } = cleanFrame(bg96, copyImageData, width, height, base, currentSettings);

  const destCanvas = document.createElement('canvas');
  destCanvas.width = width;
  destCanvas.height = height;
  const destCtx = destCanvas.getContext('2d');
  if (!destCtx) throw new Error('Failed to create dest canvas context');
  destCtx.putImageData(copyImageData, 0, 0);

  const cleanedImageDataUrl = destCanvas.toDataURL('image/png', 1.0);
  const processingTimeMs = Math.round(performance.now() - startTime);

  return {
    cleanedImageDataUrl,
    originalImageDataUrl,
    width,
    height,
    processingTimeMs,
    detected,
    currentSettings,
    watermarkBox: wm,
  };
}
