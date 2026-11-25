<script lang="ts">
  import { game } from '$lib/game/gameStore.svelte';
  import { i18n, m } from '$lib/i18n.svelte';
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
      title={showShortcuts ? m.undo_move_shortcut({}, { locale: i18n.locale }) : m.undo_move({}, { locale: i18n.locale })}
    >
      <AnimateIcon icon={Undo} size={22} class="size-5.5" />
      {m.undo({}, { locale: i18n.locale })}
    </Button>

    <Button
      variant="outline"
      size="lg"
      disabled={game.showPuzzlePicker || !game.canRedo}
      onclick={() => game.redo()}
      title={showShortcuts ? m.redo_move_shortcut({}, { locale: i18n.locale }) : m.redo_move({}, { locale: i18n.locale })}
    >
      <AnimateIcon icon={Redo} size={22} class="size-5.5" />
      {m.redo({}, { locale: i18n.locale })}
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
      title={showShortcuts ? m.reset_puzzle_shortcut({}, { locale: i18n.locale }) : m.reset_puzzle({}, { locale: i18n.locale })}
    >
      <AnimateIcon icon={RotateCcw} size={22} class="size-5.5" />
      {m.reset({}, { locale: i18n.locale })}
    </Button>

    <Button
      variant="default"
      size="lg"
      class="shadow-xs disabled:pointer-events-auto"
      disabled={!game.canHint}
      onclick={() => game.requestHint()}
      title={game.hintDisabledReason ?? (showShortcuts ? m.get_hint_shortcut({}, { locale: i18n.locale }) : m.get_hint({}, { locale: i18n.locale }))}
    >
      {#key isHintActive}
        <AnimateIcon
          icon={isHintActive ? Eye : EyeClosed}
          size={22}
          class="size-5.5"
          autoplay={hasToggledHint}
        />
      {/key}
      {m.hint({}, { locale: i18n.locale })}
    </Button>
  </div>
</div>
