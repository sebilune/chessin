import type {
  Piece,
  Position,
  Move,
  GameStatus,
  Level,
  Difficulty,
} from "../types";
import {
  getPieceAt,
  getLegalCapturesForPiece,
  getAllLegalCaptures,
  executeCapture,
} from "./chess";
import { LEVELS } from "./levels";
import { getHintTargets } from "./solver";
import { sound } from "./audio";
import { loadPersistedState, savePersistedState } from "./storage";

export type BoardAnimation =
  | {
      type: "slide";
      piece: Piece;
      from: Position;
      to: Position;
      wobbleOnLand: boolean;
      key: number;
    }
  | {
      type: "take_wobble";
      at: Position;
      key: number;
    }
  | {
      type: "reset_wobble";
      key: number;
    };

export class GameStore {
  levelIndex = $state<number>(0);
  pieces = $state<Piece[]>([]);
  selectedPiece = $state<Piece | null>(null);
  validTargets = $state<Position[]>([]);
  moveHistory = $state<Move[]>([]);
  undoneMoves = $state<Move[]>([]);
  hintTargets = $state<Position[]>([]);
  completedLevels = $state<number[]>([]);
  status = $state<GameStatus>("in_progress");
  justCleared = $state<boolean>(false);
  soundEnabled = $state<boolean>(true);
  theme = $state<"dark" | "light">("dark");
  showPuzzlePicker = $state<boolean>(false);
  isAdmin = $state<boolean>(false);
  boardAnimation = $state<BoardAnimation | null>(null);

  private advanceTimeout: ReturnType<typeof setTimeout> | null = null;
  private animationCounter = 0;

  currentLevel = $derived<Level>(LEVELS[this.levelIndex] || LEVELS[0]);
  totalLevels = $derived<number>(LEVELS.length);
  piecesRemaining = $derived<number>(this.pieces.length);
  initialPieceCount = $derived<number>(this.currentLevel.pieces.length);
  canUndo = $derived<boolean>(this.moveHistory.length > 0);
  canRedo = $derived<boolean>(this.undoneMoves.length > 0);
  areHintsDisabled = $derived<boolean>(
    Boolean(
      this.currentLevel.hintsDisabled ||
        (this.currentLevel.id >= 49 && this.currentLevel.id <= 64),
    ),
  );
  hintDisabledReason = $derived<string | null>(
    this.currentLevel.id === 64
      ? "I hate chess"
      : this.areHintsDisabled
        ? "Prove yourself"
        : null,
  );
  canHint = $derived<boolean>(
    !this.showPuzzlePicker &&
      this.status === "in_progress" &&
      !this.areHintsDisabled,
  );
  isLevelCompleted = $derived<boolean>(
    this.completedLevels.includes(this.currentLevel.id),
  );
  maxUnlockedLevelIndex = $derived<number>(
    (() => {
      if (this.isAdmin) return LEVELS.length - 1;
      const firstUncompleted = LEVELS.findIndex(
        (l) => !this.completedLevels.includes(l.id),
      );
      return firstUncompleted === -1 ? LEVELS.length - 1 : firstUncompleted;
    })(),
  );
  canNext = $derived<boolean>(this.levelIndex < this.maxUnlockedLevelIndex);

  constructor() {
    this.init();
  }

  init() {
    const persisted = loadPersistedState();
    this.completedLevels = persisted.completedLevels;
    this.soundEnabled = persisted.soundEnabled;
    sound.enabled = this.soundEnabled;
    this.theme = persisted.theme === "light" ? "light" : "dark";
    this.applyTheme();

    const initialLvlIdx = LEVELS.findIndex(
      (l) => l.id === persisted.currentLevelId,
    );
    const clampedIdx = initialLvlIdx !== -1 ? initialLvlIdx : 0;
    this.levelIndex = Math.min(clampedIdx, this.maxUnlockedLevelIndex);
    this.loadCurrentLevel();
  }

  loadCurrentLevel() {
    if (this.advanceTimeout) {
      clearTimeout(this.advanceTimeout);
      this.advanceTimeout = null;
    }

    const lvl = this.currentLevel;
    this.pieces = lvl.pieces.map((p, idx) => ({
      id: `${lvl.id}-${p.type}-${idx}-${Date.now()}`,
      type: p.type,
      row: p.row,
      col: p.col,
    }));
    this.selectedPiece = null;
    this.validTargets = [];
    this.moveHistory = [];
    this.undoneMoves = [];
    this.hintTargets = [];
    this.status = "in_progress";
    this.justCleared = false;
    this.boardAnimation = null;

    savePersistedState({ currentLevelId: lvl.id });
  }

  setLevel(index: number) {
    if (
      index < 0 ||
      index >= LEVELS.length ||
      index > this.maxUnlockedLevelIndex
    ) {
      return;
    }
    this.levelIndex = index;
    this.showPuzzlePicker = false;
    this.loadCurrentLevel();
  }

  togglePuzzlePicker() {
    this.showPuzzlePicker = !this.showPuzzlePicker;
  }

  nextLevel() {
    if (this.levelIndex < LEVELS.length - 1) {
      this.setLevel(this.levelIndex + 1);
    }
  }

  prevLevel() {
    if (this.levelIndex > 0) {
      this.setLevel(this.levelIndex - 1);
    }
  }

  selectSquare(pos: Position) {
    if (this.status === "cleared") return;

    this.hintTargets = [];

    const clickedPiece = getPieceAt(this.pieces, pos.row, pos.col);

    if (this.selectedPiece) {
      const isTarget = this.validTargets.some(
        (t) => t.row === pos.row && t.col === pos.col,
      );
      if (isTarget && clickedPiece) {
        this.makeMove(
          { row: this.selectedPiece.row, col: this.selectedPiece.col },
          { row: pos.row, col: pos.col },
        );
        return;
      }

      if (clickedPiece && clickedPiece.id === this.selectedPiece.id) {
        this.selectedPiece = null;
        this.validTargets = [];
        return;
      }

      if (clickedPiece) {
        const targets = getLegalCapturesForPiece(clickedPiece, this.pieces);
        this.selectedPiece = clickedPiece;
        this.validTargets = targets;
        return;
      }

      this.selectedPiece = null;
      this.validTargets = [];
      return;
    }

    if (clickedPiece) {
      const targets = getLegalCapturesForPiece(clickedPiece, this.pieces);
      this.selectedPiece = clickedPiece;
      this.validTargets = targets;
    }
  }

  private handlePostMoveState() {
    if (this.pieces.length === 1) {
      this.status = "cleared";
      this.justCleared = true;
      if (!this.completedLevels.includes(this.currentLevel.id)) {
        this.completedLevels = [...this.completedLevels, this.currentLevel.id];
        savePersistedState({ completedLevels: this.completedLevels });
      }
      sound.playVictory();

      // Automatically advance to the next level
      this.advanceTimeout = setTimeout(() => {
        if (this.levelIndex < this.totalLevels - 1) {
          this.nextLevel();
        }
      }, 700);
    } else {
      const remainingCaptures = getAllLegalCaptures(this.pieces);
      if (remainingCaptures.length === 0) {
        this.status = "stuck";
        sound.playStuck();
      }
    }
  }

  makeMove(from: Position, to: Position) {
    const outcome = executeCapture(this.pieces, from, to);
    if (!outcome) return;

    this.pieces = outcome.nextPieces;
    this.moveHistory = [...this.moveHistory, outcome.move];
    this.undoneMoves = [];
    this.selectedPiece = null;
    this.validTargets = [];
    this.hintTargets = [];
    this.boardAnimation = {
      type: "take_wobble",
      at: { ...to },
      key: ++this.animationCounter,
    };

    sound.playCapture();
    this.handlePostMoveState();
  }

  undo() {
    if (this.advanceTimeout) {
      clearTimeout(this.advanceTimeout);
      this.advanceTimeout = null;
    }

    if (this.moveHistory.length === 0) return;

    const lastMove = this.moveHistory[this.moveHistory.length - 1];
    this.moveHistory = this.moveHistory.slice(0, -1);
    this.undoneMoves = [...this.undoneMoves, lastMove];

    const attacker = getPieceAt(this.pieces, lastMove.to.row, lastMove.to.col);
    if (!attacker) return;

    const movedBackPiece: Piece = {
      ...attacker,
      row: lastMove.from.row,
      col: lastMove.from.col,
    };
    const restoredPieces = this.pieces.map((p) =>
      p.id === attacker.id ? movedBackPiece : p,
    );
    restoredPieces.push(lastMove.capturedPiece);

    this.pieces = restoredPieces;
    this.selectedPiece = null;
    this.validTargets = [];
    this.hintTargets = [];
    this.status = "in_progress";
    this.justCleared = false;
    this.boardAnimation = {
      type: "slide",
      piece: movedBackPiece,
      from: { ...lastMove.to },
      to: { ...lastMove.from },
      wobbleOnLand: false,
      key: ++this.animationCounter,
    };
    sound.playUndo();
  }

  redo() {
    if (this.undoneMoves.length === 0) return;

    const move = this.undoneMoves[this.undoneMoves.length - 1];
    this.undoneMoves = this.undoneMoves.slice(0, -1);

    const outcome = executeCapture(this.pieces, move.from, move.to);
    if (!outcome) return;

    this.pieces = outcome.nextPieces;
    this.moveHistory = [...this.moveHistory, outcome.move];
    this.selectedPiece = null;
    this.validTargets = [];
    this.hintTargets = [];

    const movedPiece = getPieceAt(outcome.nextPieces, move.to.row, move.to.col);
    this.boardAnimation = movedPiece
      ? {
          type: "slide",
          piece: { ...movedPiece },
          from: { ...move.from },
          to: { ...move.to },
          wobbleOnLand: true,
          key: ++this.animationCounter,
        }
      : null;

    sound.playRedo();
    this.handlePostMoveState();
  }

  reset() {
    if (this.advanceTimeout) {
      clearTimeout(this.advanceTimeout);
      this.advanceTimeout = null;
    }
    const hadMoves = this.moveHistory.length > 0;
    this.loadCurrentLevel();
    if (hadMoves) {
      this.boardAnimation = {
        type: "reset_wobble",
        key: ++this.animationCounter,
      };
      sound.playReset();
    }
  }

  clearHints() {
    this.hintTargets = [];
  }

  requestHint() {
    if (!this.canHint) return;
    if (this.hintTargets.length > 0) {
      this.hintTargets = [];
      return;
    }
    const targets = getHintTargets(this.pieces);
    if (targets.length > 0) {
      this.hintTargets = targets;
      this.selectedPiece = null;
      this.validTargets = [];
      sound.playHint();
    }
  }

  toggleSound() {
    this.soundEnabled = !this.soundEnabled;
    sound.enabled = this.soundEnabled;
    savePersistedState({ soundEnabled: this.soundEnabled });
  }

  toggleTheme() {
    this.theme = this.theme === "dark" ? "light" : "dark";
    this.applyTheme();
    savePersistedState({ theme: this.theme });
  }

  applyTheme() {
    if (typeof document === "undefined") return;
    const root = document.documentElement;
    if (this.theme === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
  }
}

export const game = new GameStore();

if (typeof window !== "undefined") {
  (window as unknown as { admin: (enable?: boolean) => boolean }).admin = (
    enable = true,
  ) => {
    game.isAdmin = Boolean(enable);
    return game.isAdmin;
  };
}
