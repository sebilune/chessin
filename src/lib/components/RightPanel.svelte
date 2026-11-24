<script lang="ts">
  import { game } from '$lib/game/gameStore.svelte';
  import { Button } from '$lib/components/ui/button';
  import { Undo2, Redo2, RotateCcw, Sparkles, ArrowRight } from '@lucide/svelte';
  import { positionToNotation } from '$lib/game/chess';
  import ChessPiece from '$lib/components/ChessPiece.svelte';
</script>

<aside class="flex flex-col justify-between h-[500px] max-h-[65vh] py-2 select-none">
  <!-- Action Controls -->
  <div class="space-y-2">
    <!-- Row 1: Undo / Redo -->
    <div class="grid grid-cols-2 gap-2">
      <Button
        variant="outline"
        size="lg"
        class="h-12 text-sm sm:text-base font-bold justify-center rounded-xl border-2"
        disabled={!game.canUndo}
        onclick={() => game.undo()}
        title="Undo Move (Z)"
      >
        <Undo2 class="size-4 sm:size-5 mr-1.5 stroke-[2.5]" />
        Undo
      </Button>

      <Button
        variant="outline"
        size="lg"
        class="h-12 text-sm sm:text-base font-bold justify-center rounded-xl border-2"
        disabled={!game.canRedo}
        onclick={() => game.redo()}
        title="Redo Move (Y)"
      >
        <Redo2 class="size-4 sm:size-5 mr-1.5 stroke-[2.5]" />
        Redo
      </Button>
    </div>

    <!-- Row 2: Reset / Hint -->
    <div class="grid grid-cols-2 gap-2">
      <Button
        variant={game.status === 'stuck' ? 'default' : 'outline'}
        size="lg"
        class="h-12 text-sm sm:text-base font-bold justify-center rounded-xl border-2 {game.status === 'stuck' ? 'border-primary' : ''}"
        disabled={game.moveHistory.length === 0}
        onclick={() => game.reset()}
        title="Reset Puzzle (R)"
      >
        <RotateCcw class="size-4 sm:size-5 mr-1.5 stroke-[2.5]" />
        Reset
      </Button>

      <Button
        variant="default"
        size="lg"
        class="h-12 text-sm sm:text-base font-bold justify-center rounded-xl border-2 shadow-xs"
        disabled={game.status !== 'in_progress'}
        onclick={() => game.requestHint()}
        title="Get Hint (H)"
      >
        <Sparkles class="size-4 sm:size-5 mr-1.5 stroke-[2.5]" />
        Hint
      </Button>
    </div>
  </div>

  <!-- Move History Card with Transparent Background on Outer Box -->
  <div class="flex-1 mt-3 p-4 rounded-2xl border-2 border-border bg-transparent flex flex-col min-h-0 overflow-hidden shadow-xs">
    <div class="flex items-center justify-between pb-2 mb-2 border-b-2 border-border/80">
      <span class="font-bold text-sm sm:text-base text-foreground uppercase tracking-wide">Moves</span>
      <!-- Roomy, well-proportioned counter badge -->
      <span class="min-w-7 h-7 px-2 rounded-lg bg-muted text-foreground font-mono text-xs font-bold flex items-center justify-center leading-none">
        {game.moveHistory.length}
      </span>
    </div>

    <div class="flex-1 overflow-y-auto space-y-2 pr-1">
      {#if game.moveHistory.length === 0}
        <div class="h-full flex items-center justify-center text-center text-muted-foreground text-xs sm:text-sm px-2 font-medium">
          Captures played will appear here
        </div>
      {:else}
        {#each game.moveHistory as move, idx}
          {@const targetSquare = positionToNotation(move.to)}
          <div class="flex items-center justify-between py-1.5 px-3 rounded-xl bg-card border border-border/80 text-foreground text-sm font-bold shadow-2xs">
            <span class="text-muted-foreground font-mono text-xs font-bold leading-none translate-y-px">#{idx + 1}</span>

            <!-- Friendly visual move: (piece) -> square -->
            <div class="flex items-center gap-2">
              <span class="size-6 flex items-center justify-center text-foreground">
                <ChessPiece type={move.attackerType} class="size-5" />
              </span>

              <ArrowRight class="size-3.5 stroke-[3] text-muted-foreground" />

              <span class="font-mono font-black text-sm uppercase leading-none translate-y-0.5">
                {targetSquare}
              </span>
            </div>
          </div>
        {/each}
      {/if}
    </div>
  </div>
</aside>
