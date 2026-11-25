<script lang="ts">
  import { game } from '$lib/game/gameStore.svelte';
  import { Button } from '$lib/components/ui/button';
  import AnimateIcon from '$lib/components/AnimateIcon.svelte';
  import { Undo, Redo, RotateCcw, Eye, EyeClosed } from '@animateicons/vanilla/lucide';

  interface Props {
    showShortcuts?: boolean;
  }

  let { showShortcuts = false }: Props = $props();

  const isHintActive = $derived(game.hintTargets.length > 0);
  let hasToggledHint = $state(false);

  $effect(() => {
    if (isHintActive) {
      hasToggledHint = true;
    }
  });
</script>

<div class="space-y-2">
  <!-- Row 1: Undo / Redo -->
  <div class="grid grid-cols-2 gap-2">
    <Button
      variant="outline"
      size="lg"
      disabled={game.showPuzzlePicker || !game.canUndo}
      onclick={() => game.undo()}
      title={showShortcuts ? 'Undo Move (Z)' : 'Undo Move'}
    >
      <AnimateIcon icon={Undo} size={22} class="size-5.5" />
      Undo
    </Button>

    <Button
      variant="outline"
      size="lg"
      disabled={game.showPuzzlePicker || !game.canRedo}
      onclick={() => game.redo()}
      title={showShortcuts ? 'Redo Move (Y)' : 'Redo Move'}
    >
      <AnimateIcon icon={Redo} size={22} class="size-5.5" />
      Redo
    </Button>
  </div>

  <!-- Row 2: Reset / Hint -->
  <div class="grid grid-cols-2 gap-2">
    <Button
      variant={game.status === 'stuck' ? 'default' : 'outline'}
      size="lg"
      class={game.status === 'stuck' ? 'border-primary' : ''}
      disabled={game.showPuzzlePicker || game.moveHistory.length === 0}
      onclick={() => game.reset()}
      title={showShortcuts ? 'Reset Puzzle (R)' : 'Reset Puzzle'}
    >
      <AnimateIcon icon={RotateCcw} size={22} class="size-5.5" />
      Reset
    </Button>

    <Button
      variant="default"
      size="lg"
      class="shadow-xs disabled:pointer-events-auto"
      disabled={!game.canHint}
      onclick={() => game.requestHint()}
      title={game.hintDisabledReason ?? (showShortcuts ? 'Get Hint (H)' : 'Get Hint')}
    >
      {#key isHintActive}
        <AnimateIcon
          icon={isHintActive ? Eye : EyeClosed}
          size={22}
          class="size-5.5"
          autoplay={hasToggledHint}
        />
      {/key}
      Hint
    </Button>
  </div>
</div>
