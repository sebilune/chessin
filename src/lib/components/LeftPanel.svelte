<script lang="ts">
  import { game } from '$lib/game/gameStore.svelte';
  import { Button } from '$lib/components/ui/button';
  import { ChevronLeft, ChevronRight, Check } from '@lucide/svelte';
  import type { Difficulty } from '$lib/types';

  function onDifficultyChange(event: Event) {
    const val = (event.target as HTMLSelectElement).value as Difficulty;
    game.setDifficulty(val);
  }
</script>

<aside class="flex flex-col justify-between h-[500px] max-h-[65vh] py-2 select-none">
  <!-- Level Info Section -->
  <div class="space-y-5">
    <div class="space-y-2">
      <div class="flex items-center gap-2">
        <span class="text-xs sm:text-sm font-mono font-bold text-muted-foreground uppercase tracking-wider">
          Puzzle {String(game.currentLevel.id).padStart(2, '0')} / {game.totalLevels}
        </span>
        {#if game.isLevelCompleted}
          <span class="inline-flex items-center gap-1 text-xs font-bold text-foreground bg-muted px-2 py-0.5 rounded-full border border-border">
            <Check class="size-3.5 stroke-[3]" />
            Cleared
          </span>
        {/if}
      </div>
      <h2 class="text-xl sm:text-2xl font-black tracking-tight text-foreground truncate">
        {game.currentLevel.name}
      </h2>

      <!-- Difficulty Dropdown -->
      <div class="pt-1">
        <label for="difficulty-select" class="block text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1.5">
          Difficulty
        </label>
        <select
          id="difficulty-select"
          class="w-full h-11 px-3 text-sm font-bold bg-background text-foreground border-2 border-border rounded-xl cursor-pointer outline-none capitalize"
          value={game.currentLevel.difficulty}
          onchange={onDifficultyChange}
        >
          <option value="easy">Easy (1-10)</option>
          <option value="medium">Medium (11-20)</option>
          <option value="hard">Hard (21-30)</option>
        </select>
      </div>
    </div>

    <!-- Minimal Stats Card -->
    <div class="p-4 rounded-xl border-2 border-border bg-card shadow-xs space-y-1.5">
      <p class="text-xs font-bold text-muted-foreground uppercase tracking-wider">
        Progression
      </p>
      <p class="text-base font-black text-foreground">
        {game.completedLevels.length} / {game.totalLevels} Puzzles Cleared
      </p>
    </div>
  </div>

  <!-- Navigation Controls -->
  <div class="space-y-3">
    <div class="flex items-center gap-2">
      <Button
        variant="outline"
        size="lg"
        class="flex-1 h-12 text-sm sm:text-base font-bold justify-center rounded-xl border-2"
        disabled={game.levelIndex === 0}
        onclick={() => game.prevLevel()}
        title="Previous Puzzle"
      >
        <ChevronLeft class="size-5 mr-1 stroke-[2.5]" />
        Prev
      </Button>
      <Button
        variant="outline"
        size="lg"
        class="flex-1 h-12 text-sm sm:text-base font-bold justify-center rounded-xl border-2"
        disabled={game.levelIndex === game.totalLevels - 1}
        onclick={() => game.nextLevel()}
        title="Next Puzzle"
      >
        Next
        <ChevronRight class="size-5 ml-1 stroke-[2.5]" />
      </Button>
    </div>
  </div>
</aside>
