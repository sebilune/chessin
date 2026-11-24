<script lang="ts">
  import { game } from '$lib/game/gameStore.svelte';
  import { Button } from '$lib/components/ui/button';
  import AnimateIcon from '$lib/components/AnimateIcon.svelte';
  import { ChevronLeft, ChevronRight, Check, Puzzle } from '@animateicons/vanilla/lucide';
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
            class="size-7 rounded-full bg-foreground text-background flex items-center justify-center shrink-0 shadow-xs animate-pop-in"
            title="Cleared"
            aria-label="Cleared"
          >
            <AnimateIcon icon={Check} size={18} class="size-4.5" autoplay={true} />
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
        <AnimateIcon icon={Puzzle} size={22} class="size-5.5 mr-2" />
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
          <AnimateIcon icon={ChevronLeft} size={24} class="size-6 mr-1.5" />
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
          <AnimateIcon icon={ChevronRight} size={24} class="size-6 ml-1.5" />
        </Button>
      </div>
    </div>
  </div>
</aside>
