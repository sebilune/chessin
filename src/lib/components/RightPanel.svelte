<script lang="ts">
  import { game } from '$lib/game/gameStore.svelte';
  import { Button } from '$lib/components/ui/button';
  import AnimateIcon from '$lib/components/AnimateIcon.svelte';
  import { Undo, Redo, RotateCcw, Sparkles } from '@animateicons/vanilla/lucide';
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
        class="h-12 text-sm sm:text-base font-bold justify-center rounded-xl border-4"
        disabled={game.showPuzzlePicker || !game.canUndo}
        onclick={() => game.undo()}
        title="Undo Move (Z)"
      >
        <AnimateIcon icon={Undo} size={22} class="size-5.5 mr-2" />
        Undo
      </Button>

      <Button
        variant="outline"
        size="lg"
        class="h-12 text-sm sm:text-base font-bold justify-center rounded-xl border-4"
        disabled={game.showPuzzlePicker || !game.canRedo}
        onclick={() => game.redo()}
        title="Redo Move (Y)"
      >
        <AnimateIcon icon={Redo} size={22} class="size-5.5 mr-2" />
        Redo
      </Button>
    </div>

    <!-- Row 2: Reset / Hint -->
    <div class="grid grid-cols-2 gap-2">
      <Button
        variant={game.status === 'stuck' ? 'default' : 'outline'}
        size="lg"
        class="h-12 text-sm sm:text-base font-bold justify-center rounded-xl border-4 {game.status === 'stuck' ? 'border-primary' : ''}"
        disabled={game.showPuzzlePicker || game.moveHistory.length === 0}
        onclick={() => game.reset()}
        title="Reset Puzzle (R)"
      >
        <AnimateIcon icon={RotateCcw} size={22} class="size-5.5 mr-2" />
        Reset
      </Button>

      <Button
        variant="default"
        size="lg"
        class="h-12 text-sm sm:text-base font-bold justify-center rounded-xl border-4 shadow-xs disabled:pointer-events-auto"
        disabled={!game.canHint}
        onclick={() => game.requestHint()}
        title={game.currentLevel.hintsDisabled ? 'Prove yourself.' : 'Get Hint (H)'}
      >
        <AnimateIcon icon={Sparkles} size={22} class="size-5.5 mr-2" />
        Hint
      </Button>
    </div>
  </div>

  <!-- Move History Card with Transparent Background on Outer Box -->
  <MoveHistory class="flex-1 mt-3" />
</aside>
