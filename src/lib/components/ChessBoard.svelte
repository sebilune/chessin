<script lang="ts">
  import { game } from '$lib/game/gameStore.svelte';
  import { FILES, RANKS, getPieceAt } from '$lib/game/chess';
  import type { Piece } from '$lib/types';
  import ChessPiece from './ChessPiece.svelte';

  const rows = [0, 1, 2, 3, 4];
  const cols = [0, 1, 2, 3, 4];

  let gridElement: HTMLDivElement | null = $state(null);

  interface DragState {
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

  let dragState = $state<DragState | null>(null);
  let hoveredTarget = $state<{ row: number; col: number } | null>(null);

  function isSquareSelected(r: number, c: number): boolean {
    return game.selectedPiece !== null && game.selectedPiece.row === r && game.selectedPiece.col === c;
  }

  function isValidTarget(r: number, c: number): boolean {
    return game.validTargets.some(t => t.row === r && t.col === c);
  }

  function handlePointerDown(e: PointerEvent, piece: Piece, r: number, c: number) {
    if (e.button !== 0) return; // Only primary button
    if (game.status === 'cleared') return;

    // Check if this piece is a valid capture target for an already selected piece
    if (game.selectedPiece && game.selectedPiece.id !== piece.id) {
      const isTarget = game.validTargets.some(t => t.row === r && t.col === c);
      if (isTarget) {
        // User might be clicking to capture, or might want to drag this piece instead.
        // Record drag state without switching selection yet.
        const targetEl = (e.currentTarget as HTMLElement);
        const rect = targetEl.getBoundingClientRect();
        dragState = {
          piece,
          startRow: r,
          startCol: c,
          startX: e.clientX,
          startY: e.clientY,
          currentX: e.clientX,
          currentY: e.clientY,
          isDragging: false,
          size: rect.width * 0.75,
        };
        return;
      }
    }

    // Select this piece and prepare drag
    game.selectSquare({ row: r, col: c });

    const targetEl = (e.currentTarget as HTMLElement);
    const rect = targetEl.getBoundingClientRect();

    dragState = {
      piece,
      startRow: r,
      startCol: c,
      startX: e.clientX,
      startY: e.clientY,
      currentX: e.clientX,
      currentY: e.clientY,
      isDragging: false,
      size: rect.width * 0.75,
    };
  }

  function handlePointerMove(e: PointerEvent) {
    const currentDrag = dragState;
    if (!currentDrag) return;

    currentDrag.currentX = e.clientX;
    currentDrag.currentY = e.clientY;

    if (!currentDrag.isDragging) {
      const dist = Math.hypot(e.clientX - currentDrag.startX, e.clientY - currentDrag.startY);
      if (dist > 4) {
        currentDrag.isDragging = true;
        // If selection was on a different piece, activate the dragged piece as selected
        if (!game.selectedPiece || game.selectedPiece.id !== currentDrag.piece.id) {
          game.selectSquare({ row: currentDrag.startRow, col: currentDrag.startCol });
        }
      }
    }

    if (currentDrag.isDragging && gridElement) {
      const rect = gridElement.getBoundingClientRect();
      if (
        e.clientX >= rect.left &&
        e.clientX <= rect.right &&
        e.clientY >= rect.top &&
        e.clientY <= rect.bottom
      ) {
        const col = Math.floor(((e.clientX - rect.left) / rect.width) * 5);
        const row = Math.floor(((e.clientY - rect.top) / rect.height) * 5);
        const clampedRow = Math.max(0, Math.min(4, row));
        const clampedCol = Math.max(0, Math.min(4, col));
        const isValid = game.validTargets.some(t => t.row === clampedRow && t.col === clampedCol);
        hoveredTarget = isValid ? { row: clampedRow, col: clampedCol } : null;
      } else {
        hoveredTarget = null;
      }
    }
  }

  function handlePointerUp() {
    const currentDrag = dragState;
    if (!currentDrag) return;

    if (currentDrag.isDragging) {
      if (hoveredTarget) {
        game.makeMove(
          { row: currentDrag.startRow, col: currentDrag.startCol },
          { row: hoveredTarget.row, col: hoveredTarget.col }
        );
      }
    } else {
      // Short click: if previously selected piece has this as valid target, execute capture
      if (
        game.selectedPiece &&
        game.selectedPiece.id !== currentDrag.piece.id &&
        game.validTargets.some(t => t.row === currentDrag.startRow && t.col === currentDrag.startCol)
      ) {
        game.makeMove(
          { row: game.selectedPiece.row, col: game.selectedPiece.col },
          { row: currentDrag.startRow, col: currentDrag.startCol }
        );
      }
    }

    dragState = null;
    hoveredTarget = null;
  }

  function handlePointerCancel() {
    dragState = null;
    hoveredTarget = null;
  }
</script>

<svelte:window
  onpointermove={handlePointerMove}
  onpointerup={handlePointerUp}
  onpointercancel={handlePointerCancel}
/>

<div class="relative flex flex-col items-center justify-center w-full max-w-[500px] select-none touch-none">
  <!-- 5x5 Grid with File & Rank notations -->
  <div class="w-full aspect-square p-2.5 bg-muted/40 border-2 border-border rounded-2xl flex flex-col">
    <div
      bind:this={gridElement}
      class="flex-1 grid grid-rows-5 w-full h-full rounded-xl overflow-hidden border border-border/80 touch-none"
    >
      {#each rows as r (r)}
        <div class="grid grid-cols-5 w-full h-full">
          {#each cols as c (c)}
            {@const isDark = (r + c) % 2 === 1}
            {@const piece = getPieceAt(game.pieces, r, c)}
            {@const isSelected = isSquareSelected(r, c)}
            {@const isTarget = isValidTarget(r, c)}
            {@const isHovered = hoveredTarget !== null && hoveredTarget.row === r && hoveredTarget.col === c}
            {@const isBeingDragged = dragState !== null && dragState.isDragging && dragState.piece.id === piece?.id}

            <button
              type="button"
              class="relative flex items-center justify-center w-full h-full transition-none outline-none select-none
                {piece ? (dragState?.isDragging ? 'cursor-grabbing' : 'cursor-grab') : 'cursor-default'}
                {isDark ? 'bg-zinc-300/80 dark:bg-zinc-800/90' : 'bg-zinc-100 dark:bg-zinc-700/60'}"
              onpointerdown={(e) => {
                if (piece) {
                  handlePointerDown(e, piece, r, c);
                } else if (!dragState?.isDragging) {
                  game.selectSquare({ row: r, col: c });
                }
              }}
              aria-label="{FILES[c]}{RANKS[r]}{piece ? ` - ${piece.type}` : ''}"
            >
              <!-- Rank label on col 0 (top-left of square): subtle & transparent -->
              {#if c === 0}
                <span class="absolute top-1.5 left-2 text-sm sm:text-base font-mono font-black leading-none pointer-events-none text-foreground/40">
                  {RANKS[r]}
                </span>
              {/if}

              <!-- File label on row 4 (bottom-right of square): subtle & transparent -->
              {#if r === 4}
                <span class="absolute bottom-1.5 right-2 text-sm sm:text-base font-mono font-black leading-none pointer-events-none text-foreground/40">
                  {FILES[c]}
                </span>
              {/if}

              <!-- Dotted / Highlighted border on capturable pieces -->
              {#if isTarget}
                <span
                  class="absolute inset-1.5 rounded-lg border-2 pointer-events-none z-10 transition-colors
                    {isHovered ? 'border-foreground bg-foreground/15 border-solid' : 'border-dashed border-foreground/90'}"
                ></span>
              {/if}

              <!-- Chess Piece SVG -->
              {#if piece}
                <div
                  class="relative z-0 flex items-center justify-center p-2 text-foreground transition-opacity
                    {isBeingDragged ? 'opacity-20' : 'opacity-100'}"
                >
                  <ChessPiece
                    type={piece.type}
                    class="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 pointer-events-none"
                  />
                </div>
              {/if}
            </button>
          {/each}
        </div>
      {/each}
    </div>
  </div>

  <!-- Capture Progress Bars (Under the chess board, reverse bar: captures completed) -->
  <div class="flex items-center gap-1.5 w-full mt-3 px-1">
    {#each Array(game.initialPieceCount - 1) as _, idx}
      {@const capturesCompleted = game.initialPieceCount - game.piecesRemaining}
      {@const isFilled = idx < capturesCompleted}
      <div
        class="h-3 flex-1 rounded-md transition-none {isFilled ? 'bg-foreground' : 'bg-muted-foreground/20'}"
      ></div>
    {/each}
  </div>
</div>

<!-- Floating dragged piece following mouse cursor -->
{#if dragState?.isDragging}
  <div
    class="fixed pointer-events-none z-50 -translate-x-1/2 -translate-y-1/2 will-change-transform text-foreground"
    style="left: {dragState.currentX}px; top: {dragState.currentY}px; width: {dragState.size}px; height: {dragState.size}px;"
  >
    <ChessPiece type={dragState.piece.type} class="w-full h-full drop-shadow-xl" />
  </div>
{/if}
