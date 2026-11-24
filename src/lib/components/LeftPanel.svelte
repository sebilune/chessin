<script lang="ts">
  import { game } from '$lib/game/gameStore.svelte';
  import { positionToNotation } from '$lib/game/chess';
  import ChessPiece from '$lib/components/ChessPiece.svelte';
  import { Check, ArrowRight } from '@lucide/svelte';
</script>

<aside class="flex flex-col justify-between h-[500px] max-h-[65vh] py-2 select-none">
  <!-- Top: Level Name + Cleared Bubble, and Counter -->
  <div class="space-y-1">
    <div class="flex items-center gap-2.5">
      <h2 class="text-xl sm:text-2xl font-black tracking-tight text-foreground truncate">
        {game.currentLevel.name}
      </h2>
      {#if game.isLevelCompleted}
        <span
          class="size-6 rounded-full bg-foreground text-background flex items-center justify-center shrink-0 shadow-xs"
          title="Cleared"
          aria-label="Cleared"
        >
          <Check class="size-3.5 stroke-[3.5]" />
        </span>
      {/if}
    </div>

    <!-- Puzzle Counter under the name -->
    <span class="text-xs sm:text-sm font-mono font-bold text-muted-foreground uppercase tracking-wider block">
      Puzzle {String(game.currentLevel.id).padStart(2, '0')} / {game.totalLevels}
    </span>
  </div>

  <!-- Move History Card with Transparent Background on Outer Box -->
  <div class="flex-1 my-4 p-4 rounded-2xl border-2 border-border bg-transparent flex flex-col min-h-0 overflow-hidden shadow-xs">
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
