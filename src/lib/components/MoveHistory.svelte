<script lang="ts">
  import { game } from '$lib/game/gameStore.svelte';
  import { positionToNotation } from '$lib/game/chess';
  import ChessPiece from '$lib/components/ChessPiece.svelte';
  import { ArrowRight } from '@lucide/svelte';

  let { class: className = '' }: { class?: string } = $props();

  const hasMoves = $derived(game.moveHistory.length > 0);
</script>

<div
  class="w-full rounded-2xl border-4 border-border bg-background text-foreground flex flex-col min-h-0 overflow-hidden shadow-xs {hasMoves ? 'p-4 sm:p-5 max-h-80 lg:max-h-full' : 'h-14 px-4 sm:px-5 justify-center'} {className}"
>
  <!-- Header: Title and Counter Badge -->
  <div class="flex items-center justify-between shrink-0 {hasMoves ? 'pb-3 mb-3 border-b-4 border-border' : ''}">
    <span class="font-black text-base sm:text-lg text-zinc-400 dark:text-zinc-400 uppercase tracking-wide">Moves</span>
    <span
      class="h-7 min-w-7 px-1.5 rounded-full bg-foreground text-background text-sm sm:text-base font-black flex items-center justify-center leading-none shadow-xs"
    >
      {game.moveHistory.length}
    </span>
  </div>

  {#if hasMoves}
    <!-- Move Rows List -->
    <div class="flex-1 overflow-y-auto space-y-2.5 min-h-0 pr-0.5">
      {#each game.moveHistory as move, idx}
        {@const targetSquare = positionToNotation(move.to)}
        <div
          class="flex items-center justify-between h-12 px-3.5 rounded-xl bg-card border-4 border-border text-foreground font-bold shadow-xs transition-none"
        >
          <!-- Move Index Number (Matches solid outline gray tone) -->
          <span class="text-zinc-400 dark:text-zinc-400 font-black text-base sm:text-lg">
            {idx + 1}
          </span>

          <!-- Visual move: Attacking Piece -> Target Square -->
          <div class="flex items-center gap-2.5">
            <span class="size-7 flex items-center justify-center text-foreground">
              <ChessPiece type={move.attackerType} class="size-6" />
            </span>

            <ArrowRight class="size-5 stroke-[3.5] text-muted-foreground" />

            <span class="font-black text-base sm:text-lg text-foreground">
              {targetSquare}
            </span>
          </div>
        </div>
      {/each}
    </div>
  {/if}
</div>
