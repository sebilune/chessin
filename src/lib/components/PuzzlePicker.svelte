<script lang="ts">
  import { game } from '$lib/game/gameStore.svelte';
  import { Check } from '@lucide/svelte';

  function selectPuzzle(num: number) {
    if (num <= game.totalLevels) {
      game.setLevel(num - 1);
      game.showPuzzlePicker = false;
    }
  }
</script>

<div class="relative flex flex-col items-center justify-center w-full max-w-[460px] sm:max-w-[480px] lg:max-w-[520px] xl:max-w-[540px] select-none mx-auto">
  <!-- 8x8 Chessboard Grid (Strictly 1:1 Aspect Ratio) -->
  <div
    class="w-full aspect-square shrink-0 p-2.5 sm:p-3 bg-muted/40 border-2 border-border rounded-2xl flex flex-col"
    style="aspect-ratio: 1 / 1;"
  >
    <div
      class="relative flex-1 grid grid-cols-8 grid-rows-8 w-full h-full rounded-xl overflow-hidden border border-border/80"
    >
      {#each Array(64) as _, idx}
        {@const puzzleNumber = idx + 1}
        {@const row = Math.floor(idx / 8)}
        {@const col = idx % 8}
        {@const isDark = (row + col) % 2 === 1}
        {@const isCompleted = game.completedLevels.includes(puzzleNumber)}
        {@const isCurrent = game.currentLevel.id === puzzleNumber}
        {@const isAvailable = puzzleNumber <= game.totalLevels}

        <button
          type="button"
          class="relative flex items-center justify-center w-full h-full transition-none outline-none select-none
            {isAvailable ? 'cursor-pointer' : 'cursor-default'}
            {isCurrent
              ? 'bg-foreground text-background'
              : (isDark ? 'bg-zinc-300/80 dark:bg-zinc-800/90' : 'bg-zinc-100 dark:bg-zinc-700/60')}"
          disabled={!isAvailable}
          onclick={() => selectPuzzle(puzzleNumber)}
          aria-label={isCompleted ? `Puzzle ${puzzleNumber} (Completed)` : `Puzzle ${puzzleNumber}`}
        >
          {#if isCompleted}
            <span
              class="size-5 sm:size-6 rounded-full flex items-center justify-center shrink-0 shadow-xs
                {isCurrent ? 'bg-background text-foreground' : 'bg-foreground text-background'}"
            >
              <Check class="size-3 sm:size-3.5 stroke-[3.5]" />
            </span>
          {:else}
            <span
              class="font-mono font-bold text-xs sm:text-sm lg:text-base
                {isCurrent ? 'text-background' : (isAvailable ? 'text-foreground' : 'text-foreground/45')}"
            >
              {puzzleNumber}
            </span>
          {/if}
        </button>
      {/each}
    </div>
  </div>

  <!-- Height placeholder matching capture progress bar to maintain exact board container height -->
  <div class="h-3 w-full mt-3 px-1 invisible" aria-hidden="true"></div>
</div>
