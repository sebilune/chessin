<script lang="ts">
  import { game } from '$lib/game/gameStore.svelte';
  import { Button } from '$lib/components/ui/button';
  import AnimateIcon from '$lib/components/AnimateIcon.svelte';
  import { Undo, Redo, Puzzle, Eye, EyeClosed } from '@animateicons/vanilla/lucide';

  const isHintActive = $derived(game.hintTargets.length > 0);
  let hasToggledHint = $state(false);

  $effect(() => {
    if (isHintActive) {
      hasToggledHint = true;
    }
  });
</script>

<div class="grid grid-cols-4 gap-2 w-full">
  <Button
    variant="outline"
    size="lg"
    disabled={game.showPuzzlePicker || !game.canUndo}
    onclick={() => game.undo()}
    title="Undo Move"
    aria-label="Undo Move"
  >
    <AnimateIcon icon={Undo} size={22} class="size-5.5" />
  </Button>

  <Button
    variant={game.showPuzzlePicker ? 'default' : 'outline'}
    size="lg"
    onclick={() => game.togglePuzzlePicker()}
    title="Puzzles"
    aria-label="Puzzles"
  >
    <AnimateIcon icon={Puzzle} size={22} class="size-5.5" />
  </Button>

  <Button
    variant="default"
    size="lg"
    class="shadow-xs disabled:pointer-events-auto"
    disabled={!game.canHint}
    onclick={() => game.requestHint()}
    title={game.hintDisabledReason ?? 'Get Hint'}
    aria-label={game.hintDisabledReason ?? 'Get Hint'}
  >
    {#key isHintActive}
      <AnimateIcon
        icon={isHintActive ? Eye : EyeClosed}
        size={22}
        class="size-5.5"
        autoplay={hasToggledHint}
      />
    {/key}
  </Button>

  <Button
    variant="outline"
    size="lg"
    disabled={game.showPuzzlePicker || !game.canRedo}
    onclick={() => game.redo()}
    title="Redo Move"
    aria-label="Redo Move"
  >
    <AnimateIcon icon={Redo} size={22} class="size-5.5" />
  </Button>
</div>
