import { ColorRGB, hexToRgb } from './colorUtils';

export interface ColorCluster {
  key: string; // 'primary' | 'secondary' | 'accent' | 'bgMain' | 'bgSurface' | 'textPrimary'
  hex: string;
  rgb: ColorRGB;
}

// Extract dominant colors from an image canvas
export function extractColorsFromCanvas(canvas: HTMLCanvasElement, count = 6): string[] {
  const ctx = canvas.getContext('2d');
  if (!ctx) return [];
  const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
  
  // Count color frequencies (bucketed for grouping)
  const colorBuckets: Record<string, number> = {};
  const step = 8; // sample every 8th pixel for speed
  for (let i = 0; i < imgData.length; i += 4 * step) {
    const r = imgData[i];
    const g = imgData[i + 1];
    const b = imgData[i + 2];
    const a = imgData[i + 3];
    if (a < 200) continue; // skip transparent

    // Quantize to group similar colors
    const qr = Math.round(r / 16) * 16;
    const qg = Math.round(g / 16) * 16;
    const qb = Math.round(b / 16) * 16;
    const key = `${qr},${qg},${qb}`;
    
    colorBuckets[key] = (colorBuckets[key] || 0) + 1;
  }

  // Sort buckets
  const sorted = Object.entries(colorBuckets)
    .sort((a, b) => b[1] - a[1])
    .slice(0, count);

  // Convert buckets back to hex
  return sorted.map(([key]) => {
    const [r, g, b] = key.split(',').map(Number);
    const toHex = (c: number) => {
      const hex = c.toString(16);
      return hex.length === 1 ? '0' + hex : hex;
    };
    return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
  });
}

// Distance between two RGB colors
function colorDistance(c1: ColorRGB, c2: ColorRGB): number {
  return Math.sqrt(
    Math.pow(c1.r - c2.r, 2) +
    Math.pow(c1.g - c2.g, 2) +
    Math.pow(c1.b - c2.b, 2)
  );
}

// Recolors canvas based on diffs between original clustered colors and new palette colors
export function recolorImage(
  originalData: ImageData,
  targetCanvas: HTMLCanvasElement,
  originalClusters: ColorCluster[],
  newPalette: Record<string, string>,
  tolerance = 65 // sensitivity slider
) {
  const ctx = targetCanvas.getContext('2d');
  if (!ctx) return;

  const width = originalData.width;
  const height = originalData.height;
  targetCanvas.width = width;
  targetCanvas.height = height;

  const targetData = ctx.createImageData(width, height);
  const srcPixels = originalData.data;
  const dstPixels = targetData.data;

  // Prepare RGB mapping
  const mappings = originalClusters.map(cluster => {
    const newHex = newPalette[cluster.key];
    return {
      original: cluster.rgb,
      target: newHex ? hexToRgb(newHex) : cluster.rgb,
      key: cluster.key
    };
  });

  for (let i = 0; i < srcPixels.length; i += 4) {
    const r = srcPixels[i];
    const g = srcPixels[i + 1];
    const b = srcPixels[i + 2];
    const a = srcPixels[i + 3];

    // Default: copy original pixel
    let nr = r;
    let ng = g;
    let nb = b;

    if (a > 10) {
      const pixelRgb = { r, g, b };
      
      // Find closest original cluster color
      let closestCluster = null;
      let minDistance = Infinity;

      for (const m of mappings) {
        const d = colorDistance(pixelRgb, m.original);
        if (d < minDistance) {
          minDistance = d;
          closestCluster = m;
        }
      }

      // If within tolerance range, shift pixel color proportionally
      if (closestCluster && minDistance < tolerance) {
        // Linear interpolation/blend factor based on distance
        const blend = (tolerance - minDistance) / tolerance; // 1 at center, 0 at border
        
        // Calculate shift vector
        const shiftR = closestCluster.target.r - closestCluster.original.r;
        const shiftG = closestCluster.target.g - closestCluster.original.g;
        const shiftB = closestCluster.target.b - closestCluster.original.b;

        nr = Math.max(0, Math.min(255, r + shiftR * blend));
        ng = Math.max(0, Math.min(255, g + shiftG * blend));
        nb = Math.max(0, Math.min(255, b + shiftB * blend));
      }
    }

    dstPixels[i] = nr;
    dstPixels[i + 1] = ng;
    dstPixels[i + 2] = nb;
    dstPixels[i + 3] = a;
  }

  ctx.putImageData(targetData, 0, 0);
}
