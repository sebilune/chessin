import { BOARD_SIZE } from "$lib/game/chess";
import type { Piece, Position } from "$lib/types";

export interface DragState {
  piece: Piece;
  startRow: number;
  startCol: number;
  startX: number;
  startY: number;
  currentX: number;
  currentY: number;
  isDragging: boolean;
  size: number;
}

/**
 * Builds an SVG path for a target/hint square outline that rounds into the
 * board's outer corners when hovered during drag.
 */
export function getOutlinePath(
  isHovered: boolean,
  row: number,
  col: number,
): string {
  const min = 2.5;
  const max = 97.5;
  const last = BOARD_SIZE - 1;
  const tl = isHovered ? (row === 0 && col === 0 ? 13 : 0) : 9;
  const tr = isHovered ? (row === 0 && col === last ? 13 : 0) : 9;
  const br = isHovered ? (row === last && col === last ? 13 : 0) : 9;
  const bl = isHovered ? (row === last && col === 0 ? 13 : 0) : 9;

  // Clockwise rounded-rect path so negative stroke-dashoffset marches clockwise
  return [
    `M ${min + tl} ${min}`,
    `L ${max - tr} ${min}`,
    tr ? `A ${tr} ${tr} 0 0 1 ${max} ${min + tr}` : "",
    `L ${max} ${max - br}`,
    br ? `A ${br} ${br} 0 0 1 ${max - br} ${max}` : "",
    `L ${min + bl} ${max}`,
    bl ? `A ${bl} ${bl} 0 0 1 ${min} ${max - bl}` : "",
    `L ${min} ${min + tl}`,
    tl ? `A ${tl} ${tl} 0 0 1 ${min + tl} ${min}` : "",
    "Z",
  ]
    .filter(Boolean)
    .join(" ");
}

/**
 * Creates the initial pointer drag state anchored to a piece's board square.
 */
export function createDragState(
  e: PointerEvent,
  piece: Piece,
  row: number,
  col: number,
): DragState {
  const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
  return {
    piece,
    startRow: row,
    startCol: col,
    startX: e.clientX,
    startY: e.clientY,
    currentX: e.clientX,
    currentY: e.clientY,
    isDragging: false,
    size: rect.width * 0.64,
  };
}

/**
 * Maps viewport pointer coordinates to a board square, or null if outside the grid.
 */
export function getSquareAtPointer(
  gridElement: HTMLElement | null,
  clientX: number,
  clientY: number,
): Position | null {
  if (!gridElement) return null;
  const rect = gridElement.getBoundingClientRect();
  if (
    clientX < rect.left ||
    clientX > rect.right ||
    clientY < rect.top ||
    clientY > rect.bottom
  ) {
    return null;
  }
  const col = Math.floor(((clientX - rect.left) / rect.width) * BOARD_SIZE);
  const row = Math.floor(((clientY - rect.top) / rect.height) * BOARD_SIZE);
  return {
    row: Math.max(0, Math.min(BOARD_SIZE - 1, row)),
    col: Math.max(0, Math.min(BOARD_SIZE - 1, col)),
  };
}
