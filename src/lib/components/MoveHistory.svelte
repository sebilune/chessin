<script lang="ts">
  import { game } from '$lib/game/gameStore.svelte';
  import { positionToNotation } from '$lib/game/chess';
  import ChessPiece from '$lib/components/ChessPiece.svelte';
  import AnimateIcon from '$lib/components/AnimateIcon.svelte';
  import { ArrowRight } from '@lucide/svelte';
  import { Footprints } from '@animateicons/vanilla/lucide';

  let { class: className = '' }: { class?: string } = $props();

  const hasMoves = $derived(game.moveHistory.length > 0);
</script>

<div
  class="w-full rounded-2xl border-4 border-border bg-background text-foreground flex flex-col min-h-0 overflow-hidden shadow-xs {hasMoves ? 'p-4 sm:p-5 max-h-80 xl:max-h-full' : 'h-14 px-4 sm:px-5 justify-center'} {className}"
>
  <!-- Header: Title -->
  <div class="flex items-center justify-center shrink-0 {hasMoves ? 'pb-3 mb-3 border-b-4 border-border' : ''}">
    <div class="flex items-center gap-2">
      <AnimateIcon
        icon={Footprints}
        size={20}
        strokeWidth={2.5}
        class="size-5 text-foreground cursor-pointer"
      />
      <span class="font-black text-sm sm:text-base text-foreground tracking-wide">Moves</span>
    </div>
  </div>

  {#if hasMoves}
    <!-- Move Rows List -->
    <div class="flex-1 overflow-y-auto space-y-2.5 min-h-0 pr-0.5">
      {#each game.moveHistory as move, idx}
        {@const targetSquare = positionToNotation(move.to)}
        <div
          class="flex items-center justify-between h-12 px-3.5 rounded-xl bg-card border-4 border-border text-foreground font-bold shadow-xs transition-none"
        >
          <!-- Move Index Number (Matches button text size) -->
          <span class="text-muted-foreground font-black text-sm sm:text-base">
            {idx + 1}
          </span>

          <!-- Visual move: Attacking Piece -> Target Square -->
          <div class="flex items-center gap-2.5">
            <span class="size-5.5 flex items-center justify-center text-foreground">
              <ChessPiece type={move.attackerType} class="size-5.5" />
            </span>

            <ArrowRight class="size-5.5 stroke-[3.5] text-muted-foreground" />

            <span class="font-black text-sm sm:text-base text-foreground">
              {targetSquare}
            </span>
          </div>
        </div>
      {/each}
    </div>
  {/if}
</div>
