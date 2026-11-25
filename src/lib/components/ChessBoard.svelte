<script lang="ts">
  import { game } from '$lib/game/gameStore.svelte';
  import { FILES, RANKS, getPieceAt } from '$lib/game/chess';
  import type { Piece, Position } from '$lib/types';
  import { computeArrow } from '$lib/arrow';
  import BoardFrame from './BoardFrame.svelte';
  import CaptureProgressBar from './CaptureProgressBar.svelte';
  import ChessPiece from './ChessPiece.svelte';

  const rows = [0, 1, 2, 3, 4];
  const cols = [0, 1, 2, 3, 4];

  function getOutlinePath(isHovered: boolean, row: number, col: number): string {
    const min = 2.5;
    const max = 97.5;
    const tl = isHovered ? (row === 0 && col === 0 ? 13 : 0) : 9;
    const tr = isHovered ? (row === 0 && col === 4 ? 13 : 0) : 9;
    const br = isHovered ? (row === 4 && col === 4 ? 13 : 0) : 9;
    const bl = isHovered ? (row === 4 && col === 0 ? 13 : 0) : 9;

    // Clockwise rounded-rect path so negative stroke-dashoffset marches clockwise
    return [
      `M ${min + tl} ${min}`,
      `L ${max - tr} ${min}`,
      tr ? `A ${tr} ${tr} 0 0 1 ${max} ${min + tr}` : '',
      `L ${max} ${max - br}`,
      br ? `A ${br} ${br} 0 0 1 ${max - br} ${max}` : '',
      `L ${min + bl} ${max}`,
      bl ? `A ${bl} ${bl} 0 0 1 ${min} ${max - bl}` : '',
      `L ${min} ${min + tl}`,
      tl ? `A ${tl} ${tl} 0 0 1 ${min + tl} ${min}` : '',
      'Z',
    ]
      .filter(Boolean)
      .join(' ');
  }

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

  interface AnimatingMove {
    attacker: Piece;
    from: Position;
    to: Position;
  }

  let dragState = $state<DragState | null>(null);
  let hoveredTarget = $state<{ row: number; col: number } | null>(null);
  let animatingMove = $state<AnimatingMove | null>(null);
  let slideActive = $state<boolean>(false);
  let animationTimer: ReturnType<typeof setTimeout> | null = null;
  let takeWobble = $state<{ row: number; col: number; key: number } | null>(null);
  let prevMoveCount = 0;

  function isSquareSelected(r: number, c: number): boolean {
    return game.selectedPiece !== null && game.selectedPiece.row === r && game.selectedPiece.col === c;
  }

  function isValidTarget(r: number, c: number): boolean {
    return game.validTargets.some(t => t.row === r && t.col === c);
  }

  function isHintTarget(r: number, c: number): boolean {
    return game.hintTargets.some(t => t.row === r && t.col === c);
  }

  const TUTORIAL_ARROW_OPTIONS = {
    startPad: 11.5,
    endPad: 11.0,
    headLen: 3.5,
    headWidth: 2.5,
    shaftWidth: 0.9,
  } as const;

  const tutorialArrow = $derived.by(() => {
    if (game.currentLevel.id !== 1 || game.status === 'cleared') return null;
    if (game.moveHistory.length === 0) {
      return computeArrow({ row: 2, col: 1 }, { row: 2, col: 3 }, TUTORIAL_ARROW_OPTIONS);
    }
    if (game.moveHistory.length === 1) {
      return computeArrow({ row: 2, col: 3 }, { row: 4, col: 3 }, TUTORIAL_ARROW_OPTIONS);
    }
    return null;
  });

  function clearAnimation() {
    if (animationTimer) {
      clearTimeout(animationTimer);
      animationTimer = null;
    }
    animatingMove = null;
    slideActive = false;
  }

  $effect(() => {
    // Cancel in-flight animation on level switch
    void game.levelIndex;
    clearAnimation();
    takeWobble = null;
  });

  $effect(() => {
    const count = game.moveHistory.length;
    if (count > prevMoveCount) {
      const lastMove = game.moveHistory[count - 1];
      takeWobble = { row: lastMove.to.row, col: lastMove.to.col, key: count };
    } else if (count < prevMoveCount) {
      takeWobble = null;
    }
    prevMoveCount = count;
  });

  $effect(() => {
    if (dragState?.isDragging) {
      document.body.classList.add('cursor-grabbing');
      return () => {
        document.body.classList.remove('cursor-grabbing');
      };
    }
  });

  function animateAndMove(from: Position, to: Position) {
    if (animatingMove) return;

    const attacker = getPieceAt(game.pieces, from.row, from.col);
    if (!attacker) {
      game.makeMove(from, to);
      return;
    }

    animatingMove = {
      attacker: { ...attacker },
      from: { ...from },
      to: { ...to },
    };
    slideActive = false;

    // Clear board highlights so target boxes vanish during glide
    game.selectedPiece = null;
    game.validTargets = [];

    // Trigger CSS transform on next paint
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        if (animatingMove) {
          slideActive = true;
        }
      });
    });

    animationTimer = setTimeout(() => {
      if (animatingMove) {
        const moveFrom = animatingMove.from;
        const moveTo = animatingMove.to;
        animatingMove = null;
        slideActive = false;
        animationTimer = null;
        game.makeMove(moveFrom, moveTo);
      }
    }, 180);
  }

  function createDragState(e: PointerEvent, piece: Piece, row: number, col: number): DragState {
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

  function handlePointerDown(e: PointerEvent, piece: Piece, r: number, c: number) {
    if (e.button !== 0) return; // Only primary button
    if (game.status === 'cleared' || animatingMove !== null) return;

    if (game.hintTargets.length > 0) {
      game.clearHints();
    }

    // Check if this piece is a valid capture target for an already selected piece
    if (game.selectedPiece && game.selectedPiece.id !== piece.id) {
      const isTarget = game.validTargets.some(t => t.row === r && t.col === c);
      if (isTarget) {
        // Record drag state without switching selection yet
        dragState = createDragState(e, piece, r, c);
        return;
      }
    }

    // Select this piece and prepare drag
    game.selectSquare({ row: r, col: c });
    dragState = createDragState(e, piece, r, c);
  }

  function getSquareAtPointer(clientX: number, clientY: number): Position | null {
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
    const col = Math.floor(((clientX - rect.left) / rect.width) * 5);
    const row = Math.floor(((clientY - rect.top) / rect.height) * 5);
    return {
      row: Math.max(0, Math.min(4, row)),
      col: Math.max(0, Math.min(4, col)),
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

    if (currentDrag.isDragging) {
      const square = getSquareAtPointer(e.clientX, e.clientY);
      const isValid =
        square !== null &&
        game.validTargets.some(t => t.row === square.row && t.col === square.col);
      hoveredTarget = isValid ? square : null;
    }
  }

  function handlePointerUp(e: PointerEvent) {
    const currentDrag = dragState;
    if (!currentDrag) return;

    if (currentDrag.isDragging) {
      if (hoveredTarget) {
        game.makeMove(
          { row: currentDrag.startRow, col: currentDrag.startCol },
          { row: hoveredTarget.row, col: hoveredTarget.col }
        );
      } else {
        const releaseSquare = getSquareAtPointer(e.clientX, e.clientY);
        const releasedOnOrigin =
          releaseSquare !== null &&
          releaseSquare.row === currentDrag.startRow &&
          releaseSquare.col === currentDrag.startCol;
        if (!releasedOnOrigin) {
          game.selectedPiece = null;
          game.validTargets = [];
        }
      }
    } else {
      // Short click: if previously selected piece has this as valid target, execute capture with slide animation
      if (
        game.selectedPiece &&
        game.selectedPiece.id !== currentDrag.piece.id &&
        game.validTargets.some(t => t.row === currentDrag.startRow && t.col === currentDrag.startCol)
      ) {
        animateAndMove(
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

<BoardFrame
  class="touch-none"
  surfaceClass="grid grid-rows-5 touch-none"
  bind:surfaceElement={gridElement}
>
  {#each rows as r (r)}
    <div class="grid grid-cols-5 w-full h-full">
      {#each cols as c (c)}
        {@const isDark = (r + c) % 2 === 1}
        {@const piece = getPieceAt(game.pieces, r, c)}
        {@const isSelected = isSquareSelected(r, c)}
        {@const isTarget = isValidTarget(r, c)}
        {@const isHint = isHintTarget(r, c)}
        {@const isHovered = hoveredTarget !== null && hoveredTarget.row === r && hoveredTarget.col === c}
        {@const isBeingDragged = dragState !== null && dragState.isDragging && dragState.piece.id === piece?.id}
        {@const isAttackerOrigin = animatingMove !== null && animatingMove.from.row === r && animatingMove.from.col === c}
        {@const isTakeWobble = takeWobble !== null && takeWobble.row === r && takeWobble.col === c}

        <button
          type="button"
          class="relative flex items-center justify-center w-full h-full transition-none outline-none select-none
            {dragState?.isDragging ? 'cursor-grabbing' : (piece ? 'cursor-pointer' : (isTarget ? 'cursor-pointer' : 'cursor-default'))}
            {isDark ? 'bg-board-square-dark' : 'bg-board-square-light'}"
          onpointerdown={(e) => {
            if (animatingMove) return;
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

          <!-- Dotted outline on capturable pieces or hint targets: marches clockwise and follows board corner radii on drag hover -->
          {#if isTarget || isHint}
            <span
              class="absolute pointer-events-none z-10 text-foreground transition-all duration-150 ease-out {isHovered ? 'inset-0 opacity-100' : 'inset-1.5 opacity-80'}"
              aria-hidden="true"
            >
              <svg class="w-full h-full overflow-visible" viewBox="0 0 100 100">
                <path
                  d={getOutlinePath(isHovered, r, c)}
                  pathLength="100"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="4"
                  stroke-dasharray="5.5 4.5"
                  stroke-linecap="butt"
                  vector-effect="non-scaling-stroke"
                  class="animate-outline-march"
                />
              </svg>
            </span>
          {/if}

          <!-- Chess Piece SVG: Proportional to square size -->
          {#if piece}
            {#key isTakeWobble ? takeWobble?.key : 0}
              <div
                class="relative z-0 flex items-center justify-center w-full h-full text-foreground transition-opacity
                  {isBeingDragged ? 'opacity-20' : ''}
                  {isAttackerOrigin ? 'opacity-0' : 'opacity-100'}
                  {isTakeWobble ? 'animate-piece-take-wobble' : ''}"
              >
                <ChessPiece
                  type={piece.type}
                  class="w-[64%] h-[64%] max-w-[65px] max-h-[65px] pointer-events-none"
                />
              </div>
            {/key}
          {/if}
        </button>
      {/each}
    </div>
  {/each}

  <!-- Animating capturing piece gliding across the board -->
  {#if animatingMove}
    {@const dx = (animatingMove.to.col - animatingMove.from.col) * 100}
    {@const dy = (animatingMove.to.row - animatingMove.from.row) * 100}
    <div
      class="absolute pointer-events-none z-30 flex items-center justify-center text-foreground will-change-transform"
      style="
        left: {animatingMove.from.col * 20}%;
        top: {animatingMove.from.row * 20}%;
        width: 20%;
        height: 20%;
        transform: translate3d({slideActive ? dx : 0}%, {slideActive ? dy : 0}%, 0);
        transition: transform 180ms cubic-bezier(0.2, 0, 0.2, 1);
      "
    >
      <ChessPiece
        type={animatingMove.attacker.type}
        class="w-[64%] h-[64%] max-w-[65px] max-h-[65px] animate-piece-travel-arc"
      />
    </div>
  {/if}

  <!-- Tutorial guidance arrow for Level 1 -->
  {#if tutorialArrow && !animatingMove}
    <svg
      class="absolute inset-0 pointer-events-none w-full h-full z-20 text-foreground"
      viewBox="0 0 100 100"
      aria-hidden="true"
    >
      <path d={tutorialArrow} fill="currentColor" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round" stroke-linecap="round" />
    </svg>
  {/if}

  {#snippet footer()}
    <CaptureProgressBar
      totalCaptures={game.initialPieceCount - 1}
      capturesCompleted={game.initialPieceCount - game.piecesRemaining}
    />
  {/snippet}
</BoardFrame>

<!-- Floating dragged piece following mouse cursor -->
{#if dragState?.isDragging}
  <div
    class="fixed pointer-events-none z-50 -translate-x-1/2 -translate-y-1/2 will-change-transform text-foreground"
    style="left: {dragState.currentX}px; top: {dragState.currentY}px; width: {dragState.size}px; height: {dragState.size}px;"
  >
    <ChessPiece type={dragState.piece.type} class="w-full h-full drop-shadow-xl animate-piece-drag-wobble" />
  </div>
{/if}
