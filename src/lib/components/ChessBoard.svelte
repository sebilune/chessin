<script lang="ts">
  import { game } from '$lib/game/gameStore.svelte';
  import { FILES, RANKS, getPieceAt } from '$lib/game/chess';
  import ChessPiece from './ChessPiece.svelte';

  const rows = [0, 1, 2, 3, 4];
  const cols = [0, 1, 2, 3, 4];

  function isSquareSelected(r: number, c: number): boolean {
    return game.selectedPiece !== null && game.selectedPiece.row === r && game.selectedPiece.col === c;
  }

  function isValidTarget(r: number, c: number): boolean {
    return game.validTargets.some(t => t.row === r && t.col === c);
  }
</script>

<div class="relative flex flex-col items-center justify-center w-full max-w-[500px] select-none">
  <!-- 5x5 Grid with File & Rank notations (no shadow) -->
  <div class="w-full aspect-square p-2.5 bg-muted/40 border-2 border-border rounded-2xl flex flex-col">
    <div class="flex-1 grid grid-rows-5 w-full h-full rounded-xl overflow-hidden border border-border/80">
      {#each rows as r (r)}
        <div class="grid grid-cols-5 w-full h-full">
          {#each cols as c (c)}
            {@const isDark = (r + c) % 2 === 1}
            {@const piece = getPieceAt(game.pieces, r, c)}
            {@const selected = isSquareSelected(r, c)}
            {@const target = isValidTarget(r, c)}

            <button
              type="button"
              class="relative flex items-center justify-center w-full h-full cursor-pointer transition-none outline-none
                {isDark ? 'bg-zinc-300/80 dark:bg-zinc-800/90' : 'bg-zinc-100 dark:bg-zinc-700/60'}"
              onclick={() => game.selectSquare({ row: r, col: c })}
              aria-label="{FILES[c]}{RANKS[r]}{piece ? ` - ${piece.type}` : ''}"
            >
              <!-- Rank label on col 0 (top-left of square): larger, bolder, identical size to file labels, more opaque -->
              {#if c === 0}
                <span class="absolute top-1.5 left-2 text-sm sm:text-base font-mono font-black leading-none pointer-events-none {isDark ? 'text-zinc-800 dark:text-zinc-200' : 'text-zinc-700 dark:text-zinc-300'}">
                  {RANKS[r]}
                </span>
              {/if}

              <!-- File label on row 4 (bottom-right of square): larger, bolder, identical size to rank labels, more opaque -->
              {#if r === 4}
                <span class="absolute bottom-1.5 right-2 text-sm sm:text-base font-mono font-black leading-none pointer-events-none {isDark ? 'text-zinc-800 dark:text-zinc-200' : 'text-zinc-700 dark:text-zinc-300'}">
                  {FILES[c]}
                </span>
              {/if}

              <!-- Only Dotted border on pieces that can be captured -->
              {#if target}
                <span class="absolute inset-1.5 rounded-lg border-2 border-dashed border-foreground/90 pointer-events-none z-10"></span>
              {/if}

              <!-- Chess Piece SVG -->
              {#if piece}
                <div class="relative z-0 flex items-center justify-center p-2 text-foreground">
                  <ChessPiece
                    type={piece.type}
                    class="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14"
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
