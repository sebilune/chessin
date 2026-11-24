<script lang="ts">
  import { game } from '$lib/game/gameStore.svelte';
  import { Button } from '$lib/components/ui/button';
  import { Undo2, Redo2, RotateCcw, Sparkles } from '@lucide/svelte';
  import MoveHistory from '$lib/components/MoveHistory.svelte';
</script>

<aside class="flex flex-col justify-between h-[500px] lg:h-[520px] max-h-[70vh] py-2 select-none">
  <!-- Action Controls -->
  <div class="space-y-2">
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
  </div>

  <!-- Move History Card with Transparent Background on Outer Box -->
  <MoveHistory class="flex-1 mt-3" />
</aside>
