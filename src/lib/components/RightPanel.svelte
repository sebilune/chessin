<script lang="ts">
  import { game } from '$lib/game/gameStore.svelte';
  import { Button } from '$lib/components/ui/button';
  import { Undo2, Redo2, RotateCcw, Sparkles, ChevronLeft, ChevronRight } from '@lucide/svelte';
</script>

<aside class="flex flex-col justify-between h-[500px] max-h-[65vh] py-2 select-none">
  <!-- All Action & Navigation Controls Grouped Together -->
  <div class="space-y-2.5">
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

    <!-- Row 3: Prev / Next directly under the action buttons -->
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

  <!-- Bottom: Keyboard Shortcuts Hint -->
  <div class="text-xs text-muted-foreground font-mono font-bold flex items-center justify-between px-1">
    <span>Z: Undo</span>
    <span>R: Reset</span>
    <span>H: Hint</span>
  </div>
</aside>
