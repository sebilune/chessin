import type { Position } from "$lib/types";

export interface ArrowPath {
  d: string;
}

export interface ArrowOptions {
  startPad?: number;
  endPad?: number;
  headLen?: number;
  headWidth?: number;
  shaftWidth?: number;
}

/**
 * Computes a single closed SVG path for a directional arrow between two board squares.
 * Coordinates are mapped to a 100x100 viewBox for a 5x5 board (each square is 20x20).
 */
export function computeArrow(
  from: Position,
  to: Position,
  options: ArrowOptions = {},
): ArrowPath | null {
  const {
    startPad = 7.0,
    endPad = 6.2,
    headLen = 4.8,
    headWidth = 3.6,
    shaftWidth = 1.35,
  } = options;

  const x1 = from.col * 20 + 10;
  const y1 = from.row * 20 + 10;
  const x2 = to.col * 20 + 10;
  const y2 = to.row * 20 + 10;
  const dx = x2 - x1;
  const dy = y2 - y1;
  const dist = Math.hypot(dx, dy);
  if (dist === 0) return null;

  const ux = dx / dist;
  const uy = dy / dist;
  const px = -uy;
  const py = ux;

  const sx = x1 + ux * startPad;
  const sy = y1 + uy * startPad;
  const tipX = x2 - ux * endPad;
  const tipY = y2 - uy * endPad;
  const baseX = tipX - ux * headLen;
  const baseY = tipY - uy * headLen;

  const tlX = sx + px * shaftWidth;
  const tlY = sy + py * shaftWidth;
  const trX = sx - px * shaftWidth;
  const trY = sy - py * shaftWidth;

  const nrX = baseX - px * shaftWidth;
  const nrY = baseY - py * shaftWidth;
  const wrX = baseX - px * headWidth;
  const wrY = baseY - py * headWidth;

  const wlX = baseX + px * headWidth;
  const wlY = baseY + py * headWidth;
  const nlX = baseX + px * shaftWidth;
  const nlY = baseY + py * shaftWidth;

  const d = `M ${tlX.toFixed(2)} ${tlY.toFixed(2)} A ${shaftWidth.toFixed(2)} ${shaftWidth.toFixed(2)} 0 0 1 ${trX.toFixed(2)} ${trY.toFixed(2)} L ${nrX.toFixed(2)} ${nrY.toFixed(2)} L ${wrX.toFixed(2)} ${wrY.toFixed(2)} L ${tipX.toFixed(2)} ${tipY.toFixed(2)} L ${wlX.toFixed(2)} ${wlY.toFixed(2)} L ${nlX.toFixed(2)} ${nlY.toFixed(2)} Z`;

  return { d };
}
