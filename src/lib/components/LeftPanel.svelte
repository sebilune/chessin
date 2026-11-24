<script lang="ts">
  import { game } from '$lib/game/gameStore.svelte';
  import { Button } from '$lib/components/ui/button';
  import { ChevronLeft, ChevronRight, Check, Puzzle } from '@lucide/svelte';
</script>

<aside class="flex flex-col justify-between h-[500px] lg:h-[520px] max-h-[70vh] py-2 select-none">
  <!-- Top: Level Name + Cleared Bubble, Counter, and Navigation -->
  <div class="space-y-4">
    <div class="space-y-1.5">
      <div class="flex items-center gap-2.5">
        <h2 class="text-2xl lg:text-3xl font-black tracking-tight text-foreground leading-tight">
          {game.currentLevel.name}
        </h2>
        {#if game.isLevelCompleted}
          <span
            class="size-7 rounded-full bg-foreground text-background flex items-center justify-center shrink-0 shadow-xs"
            title="Cleared"
            aria-label="Cleared"
          >
            <Check class="size-4 stroke-[3.5]" />
          </span>
        {/if}
      </div>

      <!-- Puzzle Counter under the name -->
      <span class="text-xs sm:text-sm font-mono font-bold text-muted-foreground uppercase tracking-wider block">
        Puzzle {String(game.currentLevel.id).padStart(2, '0')} / {game.totalLevels}
      </span>
    </div>

    <!-- Navigation Controls (Puzzles & Prev / Next) -->
    <div class="space-y-2 pt-1">
      <!-- Puzzles Button above Prev / Next -->
      <Button
        variant={game.showPuzzlePicker ? 'default' : 'outline'}
        size="lg"
        class="w-full h-12 text-sm sm:text-base font-bold justify-center rounded-xl border-2"
        onclick={() => game.togglePuzzlePicker()}
        title="Puzzles"
      >
        <Puzzle class="size-4 sm:size-5 mr-1.5 stroke-[2.5]" />
        Puzzles
      </Button>

      <div class="grid grid-cols-2 gap-2">
        <Button
          variant="outline"
          size="lg"
          class="h-12 text-sm sm:text-base font-bold justify-center rounded-xl border-2"
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
          class="h-12 text-sm sm:text-base font-bold justify-center rounded-xl border-2"
          disabled={game.levelIndex === game.totalLevels - 1}
          onclick={() => game.nextLevel()}
          title="Next Puzzle"
        >
          Next
          <ChevronRight class="size-5 ml-1 stroke-[2.5]" />
        </Button>
      </div>
    </div>
  </div>
</aside>
