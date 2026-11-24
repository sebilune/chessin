import type { Piece, Position, Move, GameStatus, Level, Difficulty } from '../types';
import { getPieceAt, getLegalCapturesForPiece, getAllLegalCaptures, executeCapture } from './chess';
import { LEVELS } from './levels';
import { getHint } from './solver';
import { sound } from './audio';
import { loadPersistedState, savePersistedState } from './storage';

export class GameStore {
  levelIndex = $state<number>(0);
  pieces = $state<Piece[]>([]);
  selectedPiece = $state<Piece | null>(null);
  validTargets = $state<Position[]>([]);
  moveHistory = $state<Move[]>([]);
  undoneMoves = $state<Move[]>([]);
  hintMove = $state<{ from: Position; to: Position } | null>(null);
  completedLevels = $state<number[]>([]);
  status = $state<GameStatus>('in_progress');
  soundEnabled = $state<boolean>(true);
  theme = $state<'dark' | 'light'>('dark');
  showPuzzlePicker = $state<boolean>(false);

  private advanceTimeout: ReturnType<typeof setTimeout> | null = null;

  currentLevel = $derived<Level>(LEVELS[this.levelIndex] || LEVELS[0]);
  totalLevels = $derived<number>(LEVELS.length);
  piecesRemaining = $derived<number>(this.pieces.length);
  initialPieceCount = $derived<number>(this.currentLevel.pieces.length);
  canUndo = $derived<boolean>(this.moveHistory.length > 0);
  canRedo = $derived<boolean>(this.undoneMoves.length > 0);
  isLevelCompleted = $derived<boolean>(this.completedLevels.includes(this.currentLevel.id));

  constructor() {
    this.init();
  }

  init() {
    const persisted = loadPersistedState();
    this.completedLevels = persisted.completedLevels;
    this.soundEnabled = persisted.soundEnabled;
    sound.enabled = this.soundEnabled;
    this.theme = persisted.theme === 'light' ? 'light' : 'dark';
    this.applyTheme();

    const initialLvlIdx = LEVELS.findIndex(l => l.id === persisted.currentLevelId);
    this.levelIndex = initialLvlIdx !== -1 ? initialLvlIdx : 0;
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
    this.hintMove = null;
    this.status = 'in_progress';

    savePersistedState({ currentLevelId: lvl.id });
  }

  setLevel(index: number) {
    if (index < 0 || index >= LEVELS.length) return;
    this.levelIndex = index;
    this.showPuzzlePicker = false;
    this.loadCurrentLevel();
  }

  togglePuzzlePicker() {
    this.showPuzzlePicker = !this.showPuzzlePicker;
  }

  setDifficulty(diff: Difficulty) {
    const firstIdx = LEVELS.findIndex(l => l.difficulty === diff);
    if (firstIdx !== -1) {
      this.setLevel(firstIdx);
    }
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
    if (this.status === 'cleared') return;

    const clickedPiece = getPieceAt(this.pieces, pos.row, pos.col);

    if (this.selectedPiece) {
      const isTarget = this.validTargets.some(t => t.row === pos.row && t.col === pos.col);
      if (isTarget && clickedPiece) {
        this.makeMove(
          { row: this.selectedPiece.row, col: this.selectedPiece.col },
          { row: pos.row, col: pos.col }
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
        sound.playSelect();
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
      sound.playSelect();
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
    this.hintMove = null;

    sound.playCapture();

    // Check completion
    if (this.pieces.length === 1) {
      this.status = 'cleared';
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
        this.status = 'stuck';
        sound.playStuck();
      }
    }
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

    const restoredPieces = this.pieces.map(p =>
      p.id === attacker.id ? { ...p, row: lastMove.from.row, col: lastMove.from.col } : p
    );
    restoredPieces.push(lastMove.capturedPiece);

    this.pieces = restoredPieces;
    this.selectedPiece = null;
    this.validTargets = [];
    this.hintMove = null;
    this.status = 'in_progress';

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
    this.hintMove = null;

    sound.playCapture();

    if (this.pieces.length === 1) {
      this.status = 'cleared';
      if (!this.completedLevels.includes(this.currentLevel.id)) {
        this.completedLevels = [...this.completedLevels, this.currentLevel.id];
        savePersistedState({ completedLevels: this.completedLevels });
      }
      sound.playVictory();

      this.advanceTimeout = setTimeout(() => {
        if (this.levelIndex < this.totalLevels - 1) {
          this.nextLevel();
        }
      }, 700);
    } else {
      const remainingCaptures = getAllLegalCaptures(this.pieces);
      if (remainingCaptures.length === 0) {
        this.status = 'stuck';
        sound.playStuck();
      }
    }
  }

  reset() {
    if (this.advanceTimeout) {
      clearTimeout(this.advanceTimeout);
      this.advanceTimeout = null;
    }
    this.loadCurrentLevel();
    sound.playUndo();
  }

  requestHint() {
    if (this.status !== 'in_progress') return;
    const hint = getHint(this.pieces);
    if (hint) {
      this.hintMove = hint;
      const piece = getPieceAt(this.pieces, hint.from.row, hint.from.col);
      if (piece) {
        this.selectedPiece = piece;
        this.validTargets = getLegalCapturesForPiece(piece, this.pieces);
      }
      sound.playSelect();
    }
  }

  toggleSound() {
    this.soundEnabled = !this.soundEnabled;
    sound.enabled = this.soundEnabled;
    savePersistedState({ soundEnabled: this.soundEnabled });
  }

  toggleTheme() {
    this.theme = this.theme === 'dark' ? 'light' : 'dark';
    this.applyTheme();
    savePersistedState({ theme: this.theme });
  }

  applyTheme() {
    if (typeof document === 'undefined') return;
    const root = document.documentElement;
    if (this.theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }
}

export const game = new GameStore();
