<script lang="ts">
  import { game } from '$lib/game/gameStore.svelte';
  import { Button } from '$lib/components/ui/button';
  import { ChevronLeft, ChevronRight, Check } from '@lucide/svelte';
  import type { Difficulty } from '$lib/types';

  const difficulties: { label: string; value: Difficulty }[] = [
    { label: 'Easy', value: 'easy' },
    { label: 'Medium', value: 'medium' },
    { label: 'Hard', value: 'hard' },
  ];
</script>

<aside class="flex flex-col justify-between h-[500px] max-h-[65vh] py-2 select-none">
  <!-- Level Info Section -->
  <div class="space-y-4">
    <div class="space-y-3">
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

      <!-- 3 Buttons Side by Side (Easy Medium Hard) -->
      <div class="grid grid-cols-3 gap-1.5 pt-1">
        {#each difficulties as diff}
          {@const isActive = game.currentLevel.difficulty === diff.value}
          <Button
            variant={isActive ? 'default' : 'outline'}
            size="sm"
            class="h-10 text-xs sm:text-sm font-bold rounded-xl border-2 px-1 justify-center {isActive ? 'border-primary' : 'border-border'}"
            onclick={() => game.setDifficulty(diff.value)}
          >
            {diff.label}
          </Button>
        {/each}
      </div>
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
