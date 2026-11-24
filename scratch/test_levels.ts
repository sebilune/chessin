import { solveBoard } from "../src/lib/game/solver";
import type { Piece, PieceType } from "../src/lib/types";

interface RawLevel {
  id: number;
  name: string;
  difficulty: "beginner" | "intermediate" | "advanced";
  pieces: { type: PieceType; row: number; col: number }[];
}

const candidateLevels: RawLevel[] = [
  // BEGINNER (Levels 1-10: 3 to 4 pieces)
  {
    id: 1,
    name: "First Blood",
    difficulty: "beginner",
    pieces: [
      { type: "rook", row: 2, col: 1 },
      { type: "bishop", row: 2, col: 3 },
      { type: "knight", row: 4, col: 3 },
    ],
  },
  {
    id: 2,
    name: "The Cross",
    difficulty: "beginner",
    pieces: [
      { type: "rook", row: 0, col: 2 },
      { type: "rook", row: 2, col: 0 },
      { type: "knight", row: 2, col: 2 },
    ],
  },
  {
    id: 3,
    name: "Diagonal Thrust",
    difficulty: "beginner",
    pieces: [
      { type: "bishop", row: 1, col: 1 },
      { type: "knight", row: 3, col: 3 },
      { type: "pawn", row: 4, col: 2 },
    ],
  },
  {
    id: 4,
    name: "Knight's Path",
    difficulty: "beginner",
    pieces: [
      { type: "knight", row: 4, col: 1 },
      { type: "pawn", row: 2, col: 2 },
      { type: "king", row: 1, col: 4 },
      { type: "rook", row: 3, col: 4 },
    ],
  },
  {
    id: 5,
    name: "Pawn Advance",
    difficulty: "beginner",
    pieces: [
      { type: "pawn", row: 3, col: 2 },
      { type: "rook", row: 2, col: 1 },
      { type: "queen", row: 2, col: 3 },
      { type: "king", row: 1, col: 2 },
    ],
  },
  {
    id: 6,
    name: "Corner Trap",
    difficulty: "beginner",
    pieces: [
      { type: "rook", row: 0, col: 0 },
      { type: "bishop", row: 0, col: 4 },
      { type: "knight", row: 4, col: 0 },
      { type: "queen", row: 4, col: 4 },
    ],
  },
  {
    id: 7,
    name: "Royal Court",
    difficulty: "beginner",
    pieces: [
      { type: "king", row: 2, col: 2 },
      { type: "queen", row: 0, col: 2 },
      { type: "rook", row: 2, col: 4 },
      { type: "bishop", row: 4, col: 2 },
    ],
  },
  {
    id: 8,
    name: "Twin Steeds",
    difficulty: "beginner",
    pieces: [
      { type: "knight", row: 1, col: 1 },
      { type: "knight", row: 3, col: 2 },
      { type: "bishop", row: 2, col: 4 },
      { type: "rook", row: 4, col: 4 },
    ],
  },
  {
    id: 9,
    name: "Pin & Needle",
    difficulty: "beginner",
    pieces: [
      { type: "bishop", row: 0, col: 0 },
      { type: "pawn", row: 2, col: 2 },
      { type: "rook", row: 1, col: 3 },
      { type: "king", row: 2, col: 4 },
    ],
  },
  {
    id: 10,
    name: "Perimeter",
    difficulty: "beginner",
    pieces: [
      { type: "rook", row: 1, col: 1 },
      { type: "queen", row: 1, col: 3 },
      { type: "bishop", row: 3, col: 1 },
      { type: "knight", row: 3, col: 3 },
    ],
  },

  // INTERMEDIATE (Levels 11-20: 5 pieces)
  {
    id: 11,
    name: "Five Star",
    difficulty: "intermediate",
    pieces: [
      { type: "queen", row: 2, col: 2 },
      { type: "rook", row: 0, col: 2 },
      { type: "rook", row: 4, col: 2 },
      { type: "bishop", row: 2, col: 0 },
      { type: "bishop", row: 2, col: 4 },
    ],
  },
  {
    id: 12,
    name: "Gauntlet",
    difficulty: "intermediate",
    pieces: [
      { type: "rook", row: 0, col: 1 },
      { type: "knight", row: 2, col: 1 },
      { type: "queen", row: 2, col: 3 },
      { type: "bishop", row: 4, col: 1 },
      { type: "pawn", row: 3, col: 4 },
    ],
  },
  {
    id: 13,
    name: "Ambush",
    difficulty: "intermediate",
    pieces: [
      { type: "knight", row: 0, col: 2 },
      { type: "bishop", row: 2, col: 4 },
      { type: "rook", row: 2, col: 1 },
      { type: "king", row: 3, col: 1 },
      { type: "pawn", row: 4, col: 2 },
    ],
  },
  {
    id: 14,
    name: "Zig-Zag",
    difficulty: "intermediate",
    pieces: [
      { type: "rook", row: 0, col: 0 },
      { type: "rook", row: 0, col: 4 },
      { type: "bishop", row: 2, col: 2 },
      { type: "queen", row: 4, col: 0 },
      { type: "knight", row: 4, col: 4 },
    ],
  },
  {
    id: 15,
    name: "Iron Fortress",
    difficulty: "intermediate",
    pieces: [
      { type: "king", row: 2, col: 2 },
      { type: "rook", row: 2, col: 0 },
      { type: "knight", row: 4, col: 1 },
      { type: "bishop", row: 0, col: 4 },
      { type: "pawn", row: 3, col: 3 },
    ],
  },
  {
    id: 16,
    name: "Cavalry Charge",
    difficulty: "intermediate",
    pieces: [
      { type: "knight", row: 1, col: 0 },
      { type: "knight", row: 3, col: 4 },
      { type: "queen", row: 1, col: 3 },
      { type: "bishop", row: 3, col: 1 },
      { type: "pawn", row: 4, col: 0 },
    ],
  },
  {
    id: 17,
    name: "Bishop's Domain",
    difficulty: "intermediate",
    pieces: [
      { type: "bishop", row: 0, col: 1 },
      { type: "bishop", row: 4, col: 3 },
      { type: "rook", row: 2, col: 3 },
      { type: "knight", row: 2, col: 0 },
      { type: "pawn", row: 3, col: 2 },
    ],
  },
  {
    id: 18,
    name: "Crossfire",
    difficulty: "intermediate",
    pieces: [
      { type: "queen", row: 1, col: 1 },
      { type: "rook", row: 1, col: 4 },
      { type: "bishop", row: 4, col: 1 },
      { type: "knight", row: 3, col: 3 },
      { type: "king", row: 2, col: 2 },
    ],
  },
  {
    id: 19,
    name: "The Enclosure",
    difficulty: "intermediate",
    pieces: [
      { type: "rook", row: 0, col: 3 },
      { type: "rook", row: 4, col: 1 },
      { type: "bishop", row: 1, col: 2 },
      { type: "knight", row: 3, col: 0 },
      { type: "queen", row: 3, col: 4 },
    ],
  },
  {
    id: 20,
    name: "Narrow Escape",
    difficulty: "intermediate",
    pieces: [
      { type: "pawn", row: 3, col: 1 },
      { type: "pawn", row: 3, col: 3 },
      { type: "knight", row: 1, col: 2 },
      { type: "bishop", row: 2, col: 0 },
      { type: "queen", row: 2, col: 4 },
    ],
  },

  // ADVANCED (Levels 21-30: 6 to 7 pieces)
  {
    id: 21,
    name: "Six Feet Under",
    difficulty: "advanced",
    pieces: [
      { type: "queen", row: 0, col: 0 },
      { type: "rook", row: 0, col: 4 },
      { type: "bishop", row: 2, col: 2 },
      { type: "knight", row: 4, col: 1 },
      { type: "rook", row: 4, col: 4 },
      { type: "pawn", row: 3, col: 3 },
    ],
  },
  {
    id: 22,
    name: "Grand Melee",
    difficulty: "advanced",
    pieces: [
      { type: "king", row: 1, col: 1 },
      { type: "queen", row: 1, col: 3 },
      { type: "rook", row: 3, col: 1 },
      { type: "bishop", row: 3, col: 3 },
      { type: "knight", row: 2, col: 4 },
      { type: "pawn", row: 4, col: 2 },
    ],
  },
  {
    id: 23,
    name: "Shadow Labyrinth",
    difficulty: "advanced",
    pieces: [
      { type: "queen", row: 0, col: 2 },
      { type: "knight", row: 1, col: 0 },
      { type: "bishop", row: 2, col: 4 },
      { type: "rook", row: 3, col: 1 },
      { type: "king", row: 4, col: 3 },
      { type: "pawn", row: 4, col: 0 },
    ],
  },
  {
    id: 24,
    name: "The Web",
    difficulty: "advanced",
    pieces: [
      { type: "rook", row: 0, col: 1 },
      { type: "bishop", row: 0, col: 3 },
      { type: "knight", row: 2, col: 0 },
      { type: "queen", row: 2, col: 4 },
      { type: "pawn", row: 3, col: 2 },
      { type: "king", row: 4, col: 2 },
    ],
  },
  {
    id: 25,
    name: "Deadly Dance",
    difficulty: "advanced",
    pieces: [
      { type: "knight", row: 0, col: 1 },
      { type: "knight", row: 1, col: 3 },
      { type: "rook", row: 2, col: 1 },
      { type: "bishop", row: 3, col: 3 },
      { type: "queen", row: 4, col: 2 },
      { type: "pawn", row: 3, col: 0 },
    ],
  },
  {
    id: 26,
    name: "Total Eclipse",
    difficulty: "advanced",
    pieces: [
      { type: "queen", row: 0, col: 4 },
      { type: "rook", row: 1, col: 1 },
      { type: "bishop", row: 2, col: 2 },
      { type: "knight", row: 3, col: 0 },
      { type: "king", row: 3, col: 4 },
      { type: "rook", row: 4, col: 2 },
    ],
  },
  {
    id: 27,
    name: "The Vortex",
    difficulty: "advanced",
    pieces: [
      { type: "rook", row: 0, col: 0 },
      { type: "queen", row: 1, col: 2 },
      { type: "knight", row: 1, col: 4 },
      { type: "bishop", row: 3, col: 0 },
      { type: "king", row: 3, col: 3 },
      { type: "pawn", row: 4, col: 1 },
      { type: "rook", row: 4, col: 4 },
    ],
  },
  {
    id: 28,
    name: "Chaos Matrix",
    difficulty: "advanced",
    pieces: [
      { type: "queen", row: 0, col: 2 },
      { type: "knight", row: 1, col: 1 },
      { type: "bishop", row: 1, col: 3 },
      { type: "rook", row: 2, col: 0 },
      { type: "rook", row: 2, col: 4 },
      { type: "knight", row: 3, col: 2 },
      { type: "pawn", row: 4, col: 1 },
    ],
  },
  {
    id: 29,
    name: "Trial by Fire",
    difficulty: "advanced",
    pieces: [
      { type: "bishop", row: 0, col: 1 },
      { type: "queen", row: 0, col: 3 },
      { type: "knight", row: 2, col: 2 },
      { type: "rook", row: 3, col: 0 },
      { type: "king", row: 3, col: 4 },
      { type: "pawn", row: 4, col: 2 },
      { type: "rook", row: 4, col: 3 },
    ],
  },
  {
    id: 30,
    name: "There Can Be Only One",
    difficulty: "advanced",
    pieces: [
      { type: "queen", row: 0, col: 2 },
      { type: "rook", row: 1, col: 0 },
      { type: "rook", row: 1, col: 4 },
      { type: "bishop", row: 2, col: 1 },
      { type: "bishop", row: 2, col: 3 },
      { type: "knight", row: 3, col: 2 },
      { type: "pawn", row: 4, col: 1 },
      { type: "king", row: 4, col: 3 },
    ],
  },
];

console.log(`Testing ${candidateLevels.length} candidate levels...`);

let failed = 0;
for (const lvl of candidateLevels) {
  const pieces: Piece[] = lvl.pieces.map((p, idx) => ({
    id: `p-${idx}`,
    type: p.type,
    row: p.row,
    col: p.col,
  }));

  const res = solveBoard(pieces, 5);
  if (!res.solvable) {
    console.error(`FAILED: Level ${lvl.id} (${lvl.name}) is NOT solvable!`);
    failed++;
  } else {
    console.log(
      `OK: Level ${lvl.id} (${lvl.name}) - ${lvl.pieces.length} pieces, ${res.solutionCount} solution(s) found. Moves: ${res.solutionMoves.length}`,
    );
  }
}

if (failed === 0) {
  console.log("ALL LEVELS PASSED SOLVABILITY VERIFICATION!");
} else {
  console.error(`${failed} levels failed!`);
  process.exit(1);
}
