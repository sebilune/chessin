export type PieceType = 'king' | 'queen' | 'rook' | 'bishop' | 'knight' | 'pawn';

export interface Position {
  row: number; // 0..4 (0 = top / rank 5, 4 = bottom / rank 1)
  col: number; // 0..4 (0 = left / file a, 4 = right / file e)
}

export interface Piece {
  id: string;
  type: PieceType;
  row: number;
  col: number;
}

export interface Move {
  from: Position;
  to: Position;
  attackerType: PieceType;
  capturedPiece: Piece;
  notation: string;
}

export type Difficulty = 'easy' | 'medium' | 'hard';

export interface Level {
  id: number;
  name: string;
  difficulty: Difficulty;
  pieces: { type: PieceType; row: number; col: number }[];
}

export type GameStatus = 'in_progress' | 'cleared' | 'stuck';
