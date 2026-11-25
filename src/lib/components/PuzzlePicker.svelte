<script lang="ts">
  import { game } from '$lib/game/gameStore.svelte';
  import BoardFrame from './BoardFrame.svelte';
  import ChessPiece from './ChessPiece.svelte';
  import { Check } from '@lucide/svelte';

  function selectPuzzle(num: number) {
    if (num <= game.totalLevels) {
      game.setLevel(num - 1);
      game.showPuzzlePicker = false;
    }
  }
</script>

<BoardFrame surfaceClass="grid grid-cols-8 grid-rows-8">
  {#each Array(64) as _, idx}
    {@const puzzleNumber = idx + 1}
    {@const row = Math.floor(idx / 8)}
    {@const col = idx % 8}
    {@const isDark = (row + col) % 2 === 1}
    {@const isCompleted = game.completedLevels.includes(puzzleNumber)}
    {@const isCurrent = game.currentLevel.id === puzzleNumber}
    {@const isAvailable = puzzleNumber <= game.totalLevels}
    {@const isChallengeTier = puzzleNumber >= 49 && puzzleNumber <= 64}
    {@const isKingLevel = puzzleNumber === 64}

    <button
      type="button"
      class="group relative flex items-center justify-center w-full h-full transition-none outline-none select-none
        {isAvailable ? 'cursor-pointer' : 'cursor-default'}
        {isCurrent
          ? 'bg-foreground text-background'
          : (isDark ? 'bg-board-square-dark' : 'bg-board-square-light')}"
      disabled={!isAvailable}
      onclick={() => selectPuzzle(puzzleNumber)}
      aria-label={isCompleted ? `Puzzle ${puzzleNumber} (Completed)` : `Puzzle ${puzzleNumber}`}
    >
      {#if isCompleted}
        <!-- Checkmark shown by default; hidden on hover -->
        <span
          class="size-5 sm:size-6 rounded-full flex items-center justify-center shrink-0 shadow-xs group-hover:hidden
            {isCurrent ? 'bg-background text-foreground' : 'bg-foreground text-background'}"
        >
          <Check class="size-3 sm:size-3.5 stroke-[3.5]" />
        </span>

        <!-- Number (or King icon for 64) shown on hover -->
        {#if isKingLevel}
          <span
            class="hidden group-hover:flex items-center justify-center
              {isCurrent ? 'text-challenge-active' : 'text-challenge'}"
          >
            <ChessPiece type="king" class="size-4 sm:size-5 lg:size-6" />
          </span>
        {:else}
          <span
            class="hidden group-hover:inline font-mono font-bold text-xs sm:text-sm lg:text-base
              {isCurrent
                ? (isChallengeTier ? 'text-challenge-active' : 'text-background')
                : (isChallengeTier ? 'text-challenge' : 'text-foreground')}"
          >
            {puzzleNumber}
          </span>
        {/if}
      {:else if isKingLevel}
        <span
          class="flex items-center justify-center
            {isCurrent ? 'text-challenge-active' : 'text-challenge'}"
        >
          <ChessPiece type="king" class="size-4 sm:size-5 lg:size-6" />
        </span>
      {:else}
        <span
          class="font-mono font-bold text-xs sm:text-sm lg:text-base
            {isCurrent
              ? (isChallengeTier ? 'text-challenge-active' : 'text-background')
              : (isAvailable
                ? (isChallengeTier ? 'text-challenge' : 'text-foreground')
                : 'text-foreground/45')}"
        >
          {puzzleNumber}
        </span>
      {/if}
    </button>
  {/each}

  {#snippet footer()}
    <!-- Height placeholder matching capture progress bar to maintain exact board container height -->
    <div class="h-3 w-full mt-3 px-1 invisible" aria-hidden="true"></div>
  {/snippet}
</BoardFrame>
