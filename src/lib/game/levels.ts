import type { Level } from '../types';

export const LEVELS: Level[] = [
  // EASY (1-10: 3 to 4 pieces, no queen)
  {
    id: 1,
    name: "First Blood",
    difficulty: "easy",
    pieces: [
      { type: "rook", row: 2, col: 1 },
      { type: "bishop", row: 2, col: 3 },
      { type: "knight", row: 4, col: 3 },
    ]
  },
  {
    id: 2,
    name: "The Cross",
    difficulty: "easy",
    pieces: [
      { type: "rook", row: 0, col: 2 },
      { type: "rook", row: 2, col: 0 },
      { type: "knight", row: 2, col: 2 },
    ]
  },
  {
    id: 3,
    name: "Diagonal Thrust",
    difficulty: "easy",
    pieces: [
      { type: "bishop", row: 1, col: 1 },
      { type: "knight", row: 3, col: 3 },
      { type: "pawn", row: 4, col: 2 },
    ]
  },
  {
    id: 4,
    name: "Knight Path",
    difficulty: "easy",
    pieces: [
      { type: "knight", row: 4, col: 1 },
      { type: "pawn", row: 2, col: 2 },
      { type: "king", row: 1, col: 4 },
      { type: "rook", row: 3, col: 4 },
    ]
  },
  {
    id: 5,
    name: "Pawn Advance",
    difficulty: "easy",
    pieces: [
      { type: "pawn", row: 3, col: 2 },
      { type: "rook", row: 2, col: 1 },
      { type: "bishop", row: 2, col: 3 },
      { type: "king", row: 1, col: 2 },
    ]
  },
  {
    id: 6,
    name: "Corner Trap",
    difficulty: "easy",
    pieces: [
      { type: "rook", row: 0, col: 0 },
      { type: "bishop", row: 0, col: 4 },
      { type: "knight", row: 4, col: 0 },
      { type: "rook", row: 4, col: 4 },
    ]
  },
  {
    id: 7,
    name: "Royal Guard",
    difficulty: "easy",
    pieces: [
      { type: "king", row: 2, col: 2 },
      { type: "rook", row: 0, col: 2 },
      { type: "rook", row: 2, col: 4 },
      { type: "bishop", row: 4, col: 2 },
    ]
  },
  {
    id: 8,
    name: "Twin Steeds",
    difficulty: "easy",
    pieces: [
      { type: "knight", row: 1, col: 1 },
      { type: "knight", row: 3, col: 2 },
      { type: "bishop", row: 2, col: 4 },
      { type: "rook", row: 4, col: 4 },
    ]
  },
  {
    id: 9,
    name: "Pin & Needle",
    difficulty: "easy",
    pieces: [
      { type: "bishop", row: 0, col: 0 },
      { type: "pawn", row: 2, col: 2 },
      { type: "rook", row: 1, col: 3 },
      { type: "king", row: 2, col: 4 },
    ]
  },
  {
    id: 10,
    name: "Perimeter",
    difficulty: "easy",
    pieces: [
      { type: "rook", row: 1, col: 1 },
      { type: "rook", row: 1, col: 3 },
      { type: "bishop", row: 3, col: 1 },
      { type: "knight", row: 3, col: 3 },
    ]
  },

  // MEDIUM (11-20: 5 pieces, no queen)
  {
    id: 11,
    name: "Five Star",
    difficulty: "medium",
    pieces: [
      { type: "rook", row: 2, col: 2 },
      { type: "rook", row: 0, col: 2 },
      { type: "rook", row: 4, col: 2 },
      { type: "bishop", row: 2, col: 0 },
      { type: "bishop", row: 2, col: 4 },
    ]
  },
  {
    id: 12,
    name: "Gauntlet",
    difficulty: "medium",
    pieces: [
      { type: "rook", row: 0, col: 1 },
      { type: "knight", row: 2, col: 1 },
      { type: "bishop", row: 2, col: 3 },
      { type: "bishop", row: 4, col: 1 },
      { type: "pawn", row: 3, col: 4 },
    ]
  },
  {
    id: 13,
    name: "Ambush",
    difficulty: "medium",
    pieces: [
      { type: "knight", row: 0, col: 2 },
      { type: "bishop", row: 2, col: 4 },
      { type: "rook", row: 2, col: 1 },
      { type: "king", row: 3, col: 1 },
      { type: "pawn", row: 4, col: 2 },
    ]
  },
  {
    id: 14,
    name: "Zig-Zag",
    difficulty: "medium",
    pieces: [
      { type: "rook", row: 0, col: 0 },
      { type: "rook", row: 0, col: 4 },
      { type: "bishop", row: 2, col: 2 },
      { type: "bishop", row: 4, col: 0 },
      { type: "knight", row: 4, col: 4 },
    ]
  },
  {
    id: 15,
    name: "Iron Fortress",
    difficulty: "medium",
    pieces: [
      { type: "king", row: 2, col: 2 },
      { type: "rook", row: 2, col: 0 },
      { type: "knight", row: 4, col: 1 },
      { type: "bishop", row: 0, col: 4 },
      { type: "pawn", row: 3, col: 3 },
    ]
  },
  {
    id: 16,
    name: "Cavalry Charge",
    difficulty: "medium",
    pieces: [
      { type: "knight", row: 1, col: 0 },
      { type: "knight", row: 2, col: 2 },
      { type: "rook", row: 0, col: 2 },
      { type: "bishop", row: 3, col: 1 },
      { type: "pawn", row: 4, col: 0 },
    ]
  },
  {
    id: 17,
    name: "Bishop Domain",
    difficulty: "medium",
    pieces: [
      { type: "bishop", row: 0, col: 1 },
      { type: "bishop", row: 4, col: 3 },
      { type: "rook", row: 2, col: 3 },
      { type: "knight", row: 2, col: 0 },
      { type: "pawn", row: 3, col: 2 },
    ]
  },
  {
    id: 18,
    name: "Crossfire",
    difficulty: "medium",
    pieces: [
      { type: "rook", row: 1, col: 1 },
      { type: "rook", row: 1, col: 4 },
      { type: "bishop", row: 4, col: 1 },
      { type: "knight", row: 3, col: 3 },
      { type: "king", row: 2, col: 2 },
    ]
  },
  {
    id: 19,
    name: "The Enclosure",
    difficulty: "medium",
    pieces: [
      { type: "rook", row: 0, col: 3 },
      { type: "rook", row: 4, col: 1 },
      { type: "bishop", row: 1, col: 2 },
      { type: "knight", row: 3, col: 0 },
      { type: "rook", row: 3, col: 4 },
    ]
  },
  {
    id: 20,
    name: "Narrow Escape",
    difficulty: "medium",
    pieces: [
      { type: "pawn", row: 3, col: 1 },
      { type: "pawn", row: 3, col: 3 },
      { type: "knight", row: 1, col: 2 },
      { type: "bishop", row: 2, col: 0 },
      { type: "rook", row: 0, col: 1 },
    ]
  },

  // HARD (21-30: 6 to 8 pieces, no queen)
  {
    id: 21,
    name: "Six Feet Under",
    difficulty: "hard",
    pieces: [
      { type: "rook", row: 0, col: 0 },
      { type: "rook", row: 0, col: 4 },
      { type: "bishop", row: 2, col: 2 },
      { type: "knight", row: 4, col: 1 },
      { type: "rook", row: 4, col: 4 },
      { type: "pawn", row: 3, col: 3 },
    ]
  },
  {
    id: 22,
    name: "Grand Melee",
    difficulty: "hard",
    pieces: [
      { type: "king", row: 1, col: 1 },
      { type: "rook", row: 1, col: 3 },
      { type: "rook", row: 3, col: 1 },
      { type: "bishop", row: 3, col: 3 },
      { type: "knight", row: 2, col: 4 },
      { type: "pawn", row: 4, col: 2 },
    ]
  },
  {
    id: 23,
    name: "Shadow Labyrinth",
    difficulty: "hard",
    pieces: [
      { type: "rook", row: 0, col: 0 },
      { type: "knight", row: 1, col: 0 },
      { type: "bishop", row: 2, col: 4 },
      { type: "rook", row: 3, col: 1 },
      { type: "king", row: 4, col: 3 },
      { type: "pawn", row: 4, col: 0 },
    ]
  },
  {
    id: 24,
    name: "The Web",
    difficulty: "hard",
    pieces: [
      { type: "rook", row: 0, col: 1 },
      { type: "bishop", row: 0, col: 3 },
      { type: "knight", row: 2, col: 0 },
      { type: "rook", row: 2, col: 4 },
      { type: "pawn", row: 3, col: 2 },
      { type: "king", row: 4, col: 2 },
    ]
  },
  {
    id: 25,
    name: "Deadly Dance",
    difficulty: "hard",
    pieces: [
      { type: "knight", row: 0, col: 1 },
      { type: "knight", row: 1, col: 3 },
      { type: "rook", row: 2, col: 1 },
      { type: "bishop", row: 3, col: 3 },
      { type: "rook", row: 4, col: 2 },
      { type: "pawn", row: 3, col: 0 },
    ]
  },
  {
    id: 26,
    name: "Total Eclipse",
    difficulty: "hard",
    pieces: [
      { type: "bishop", row: 0, col: 0 },
      { type: "rook", row: 1, col: 1 },
      { type: "bishop", row: 2, col: 2 },
      { type: "knight", row: 3, col: 0 },
      { type: "king", row: 3, col: 4 },
      { type: "rook", row: 4, col: 2 },
    ]
  },
  {
    id: 27,
    name: "The Vortex",
    difficulty: "hard",
    pieces: [
      { type: "rook", row: 0, col: 0 },
      { type: "rook", row: 0, col: 2 },
      { type: "knight", row: 1, col: 4 },
      { type: "bishop", row: 3, col: 0 },
      { type: "king", row: 3, col: 3 },
      { type: "pawn", row: 4, col: 1 },
      { type: "rook", row: 4, col: 4 },
    ]
  },
  {
    id: 28,
    name: "Chaos Matrix",
    difficulty: "hard",
    pieces: [
      { type: "rook", row: 0, col: 2 },
      { type: "knight", row: 1, col: 1 },
      { type: "bishop", row: 1, col: 3 },
      { type: "rook", row: 2, col: 0 },
      { type: "rook", row: 2, col: 4 },
      { type: "knight", row: 3, col: 2 },
      { type: "pawn", row: 4, col: 1 },
    ]
  },
  {
    id: 29,
    name: "Trial by Fire",
    difficulty: "hard",
    pieces: [
      { type: "bishop", row: 0, col: 1 },
      { type: "rook", row: 0, col: 3 },
      { type: "knight", row: 2, col: 2 },
      { type: "rook", row: 3, col: 0 },
      { type: "king", row: 3, col: 4 },
      { type: "pawn", row: 4, col: 2 },
      { type: "rook", row: 4, col: 3 },
    ]
  },
  {
    id: 30,
    name: "Final Stand",
    difficulty: "hard",
    pieces: [
      { type: "rook", row: 0, col: 2 },
      { type: "rook", row: 1, col: 0 },
      { type: "rook", row: 1, col: 4 },
      { type: "bishop", row: 2, col: 1 },
      { type: "bishop", row: 2, col: 3 },
      { type: "knight", row: 3, col: 2 },
      { type: "pawn", row: 4, col: 1 },
      { type: "king", row: 4, col: 3 },
    ]
  }
];
