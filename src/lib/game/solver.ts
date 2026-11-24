import type { Piece, Position } from '../types';
import { getAllLegalCaptures, executeCapture } from './chess';

export interface SolverResult {
  solvable: boolean;
  solutionMoves: { from: Position; to: Position }[];
  solutionCount: number;
}

export function solveBoard(pieces: Piece[], maxSolutions: number = 10): SolverResult {
  const result: SolverResult = {
    solvable: false,
    solutionMoves: [],
    solutionCount: 0,
  };

  const path: { from: Position; to: Position }[] = [];

  function dfs(currentPieces: Piece[]): boolean {
    if (currentPieces.length === 1) {
      result.solutionCount++;
      if (!result.solvable) {
        result.solvable = true;
        result.solutionMoves = [...path];
      }
      return result.solutionCount >= maxSolutions;
    }

    const legalCaptures = getAllLegalCaptures(currentPieces);
    if (legalCaptures.length === 0) {
      return false;
    }

    for (const cap of legalCaptures) {
      const fromPos = { row: cap.attacker.row, col: cap.attacker.col };
      const toPos = { row: cap.target.row, col: cap.target.col };

      const outcome = executeCapture(currentPieces, fromPos, toPos);
      if (!outcome) continue;

      path.push({ from: fromPos, to: toPos });
      const shouldStop = dfs(outcome.nextPieces);
      path.pop();

      if (shouldStop) return true;
    }

    return false;
  }

  dfs(pieces);
  return result;
}

export function isBoardSolvable(pieces: Piece[]): boolean {
  if (pieces.length <= 1) return true;

  function dfs(currentPieces: Piece[]): boolean {
    if (currentPieces.length === 1) return true;

    const legalCaptures = getAllLegalCaptures(currentPieces);
    if (legalCaptures.length === 0) return false;

    for (const cap of legalCaptures) {
      const fromPos = { row: cap.attacker.row, col: cap.attacker.col };
      const toPos = { row: cap.target.row, col: cap.target.col };

      const outcome = executeCapture(currentPieces, fromPos, toPos);
      if (!outcome) continue;

      if (dfs(outcome.nextPieces)) return true;
    }

    return false;
  }

  return dfs(pieces);
}

export function getHintTargets(pieces: Piece[]): Position[] {
  if (pieces.length <= 1) return [];

  const legalCaptures = getAllLegalCaptures(pieces);
  if (legalCaptures.length === 0) return [];

  const winningTargets: Position[] = [];

  for (const cap of legalCaptures) {
    const fromPos = { row: cap.attacker.row, col: cap.attacker.col };
    const toPos = { row: cap.target.row, col: cap.target.col };

    if (winningTargets.some(t => t.row === toPos.row && t.col === toPos.col)) {
      continue;
    }

    const outcome = executeCapture(pieces, fromPos, toPos);
    if (!outcome) continue;

    if (outcome.nextPieces.length === 1 || isBoardSolvable(outcome.nextPieces)) {
      winningTargets.push(toPos);
    }
  }

  return winningTargets;
}

export function getHint(pieces: Piece[]): { from: Position; to: Position } | null {
  if (pieces.length <= 1) return null;
  const result = solveBoard(pieces, 1);
  if (result.solvable && result.solutionMoves.length > 0) {
    return result.solutionMoves[0];
  }
  return null;
}
