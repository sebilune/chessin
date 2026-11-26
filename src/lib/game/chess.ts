import type { Piece, PieceType, Position, Move } from "../types";

export const BOARD_SIZE = 5;

export const FILES = ["a", "b", "c", "d", "e"] as const;
export const RANKS = ["5", "4", "3", "2", "1"] as const;

export function isOnBoard(row: number, col: number): boolean {
  return row >= 0 && row < BOARD_SIZE && col >= 0 && col < BOARD_SIZE;
}

export function positionToNotation(pos: Position): string {
  if (!isOnBoard(pos.row, pos.col)) return "";
  return `${FILES[pos.col]}${RANKS[pos.row]}`;
}

export function getPieceSymbol(type: PieceType): string {
  switch (type) {
    case "king":
      return "K";
    case "queen":
      return "Q";
    case "rook":
      return "R";
    case "bishop":
      return "B";
    case "knight":
      return "N";
    case "pawn":
      return "P";
  }
}

export function getPieceAt(
  pieces: Piece[],
  row: number,
  col: number,
): Piece | undefined {
  return pieces.find((p) => p.row === row && p.col === col);
}

const KNIGHT_DELTAS: [number, number][] = [
  [-2, -1],
  [-2, 1],
  [-1, -2],
  [-1, 2],
  [1, -2],
  [1, 2],
  [2, -1],
  [2, 1],
];

const KING_DELTAS: [number, number][] = [
  [-1, -1],
  [-1, 0],
  [-1, 1],
  [0, -1],
  [0, 1],
  [1, -1],
  [1, 0],
  [1, 1],
];

const ROOK_DIRS: [number, number][] = [
  [-1, 0],
  [1, 0],
  [0, -1],
  [0, 1],
];

const BISHOP_DIRS: [number, number][] = [
  [-1, -1],
  [-1, 1],
  [1, -1],
  [1, 1],
];

export function getLegalCapturesForPiece(
  piece: Piece,
  pieces: Piece[],
): Position[] {
  if (piece.isGhost) return [];

  const targets: Position[] = [];

  switch (piece.type) {
    case "pawn": {
      // Pawns capture one square diagonally upwards (towards rank 5 / row 0)
      const targetRow = piece.row - 1;
      for (const targetCol of [piece.col - 1, piece.col + 1]) {
        if (isOnBoard(targetRow, targetCol)) {
          const targetPiece = getPieceAt(pieces, targetRow, targetCol);
          if (targetPiece) {
            targets.push({ row: targetRow, col: targetCol });
          }
        }
      }
      break;
    }

    case "knight": {
      for (const [dr, dc] of KNIGHT_DELTAS) {
        const r = piece.row + dr;
        const c = piece.col + dc;
        if (isOnBoard(r, c)) {
          const targetPiece = getPieceAt(pieces, r, c);
          if (targetPiece) {
            targets.push({ row: r, col: c });
          }
        }
      }
      break;
    }

    case "king": {
      for (const [dr, dc] of KING_DELTAS) {
        const r = piece.row + dr;
        const c = piece.col + dc;
        if (isOnBoard(r, c)) {
          const targetPiece = getPieceAt(pieces, r, c);
          if (targetPiece) {
            targets.push({ row: r, col: c });
          }
        }
      }
      break;
    }

    case "rook": {
      for (const [dr, dc] of ROOK_DIRS) {
        let r = piece.row + dr;
        let c = piece.col + dc;
        while (isOnBoard(r, c)) {
          const targetPiece = getPieceAt(pieces, r, c);
          if (targetPiece) {
            targets.push({ row: r, col: c });
            break; // Cannot jump over pieces
          }
          r += dr;
          c += dc;
        }
      }
      break;
    }

    case "bishop": {
      for (const [dr, dc] of BISHOP_DIRS) {
        let r = piece.row + dr;
        let c = piece.col + dc;
        while (isOnBoard(r, c)) {
          const targetPiece = getPieceAt(pieces, r, c);
          if (targetPiece) {
            targets.push({ row: r, col: c });
            break; // Cannot jump over pieces
          }
          r += dr;
          c += dc;
        }
      }
      break;
    }

    case "queen": {
      const dirs = [...ROOK_DIRS, ...BISHOP_DIRS];
      for (const [dr, dc] of dirs) {
        let r = piece.row + dr;
        let c = piece.col + dc;
        while (isOnBoard(r, c)) {
          const targetPiece = getPieceAt(pieces, r, c);
          if (targetPiece) {
            targets.push({ row: r, col: c });
            break; // Cannot jump over pieces
          }
          r += dr;
          c += dc;
        }
      }
      break;
    }
  }

  return targets;
}

export interface LegalCapture {
  attacker: Piece;
  target: Piece;
}

export function getAllLegalCaptures(pieces: Piece[]): LegalCapture[] {
  const captures: LegalCapture[] = [];
  for (const piece of pieces) {
    const targetPositions = getLegalCapturesForPiece(piece, pieces);
    for (const pos of targetPositions) {
      const targetPiece = getPieceAt(pieces, pos.row, pos.col);
      if (targetPiece) {
        captures.push({ attacker: piece, target: targetPiece });
      }
    }
  }
  return captures;
}

export function executeCapture(
  pieces: Piece[],
  fromPos: Position,
  toPos: Position,
): { nextPieces: Piece[]; move: Move } | null {
  const attacker = getPieceAt(pieces, fromPos.row, fromPos.col);
  const target = getPieceAt(pieces, toPos.row, toPos.col);

  if (!attacker || !target) return null;

  // Validate that this capture is legal
  const legalTargets = getLegalCapturesForPiece(attacker, pieces);
  const isLegal = legalTargets.some(
    (t) => t.row === toPos.row && t.col === toPos.col,
  );
  if (!isLegal) return null;

  // Notation e.g. "Nxe4" or "pxd4"
  const attackerSymbol = getPieceSymbol(attacker.type);
  const toSquare = positionToNotation(toPos);
  const notation = `${attackerSymbol}x${toSquare}`;

  const nextPieces: Piece[] = pieces
    .filter((p) => p.id !== target.id)
    .map((p) =>
      p.id === attacker.id ? { ...p, row: toPos.row, col: toPos.col } : p,
    );

  const move: Move = {
    from: { row: fromPos.row, col: fromPos.col },
    to: { row: toPos.row, col: toPos.col },
    attackerType: attacker.type,
    capturedPiece: { ...target },
    notation,
  };

  return { nextPieces, move };
}
