<script lang="ts">
  import { game } from '$lib/game/gameStore.svelte';
  import { i18n, m } from '$lib/i18n.svelte';
  import { Button } from '$lib/components/ui/button';
  import AnimateIcon from '$lib/components/AnimateIcon.svelte';
  import { ChevronLeft, ChevronRight, Puzzle } from '@animateicons/vanilla/lucide';

  interface Props {
    class?: string;
  }

  let { class: className = '' }: Props = $props();
</script>

<div class="space-y-2 {className}">
  <Button
    variant={game.showPuzzlePicker ? 'default' : 'outline'}
    size="lg"
    class="w-full"
    onclick={() => game.togglePuzzlePicker()}
    title={m.puzzles({}, { locale: i18n.locale })}
  >
    <AnimateIcon icon={Puzzle} size={22} class="size-5.5" />
    {m.puzzles({}, { locale: i18n.locale })}
  </Button>

  <div class="grid grid-cols-2 gap-2">
    <Button
      variant="outline"
      size="lg"
      disabled={game.levelIndex === 0}
      onclick={() => game.prevLevel()}
      title={m.previous_puzzle({}, { locale: i18n.locale })}
    >
      <AnimateIcon icon={ChevronLeft} size={24} class="size-6" />
      {m.prev({}, { locale: i18n.locale })}
    </Button>

    <Button
      variant="outline"
      size="lg"
      disabled={!game.canNext}
      onclick={() => game.nextLevel()}
      title={m.next_puzzle({}, { locale: i18n.locale })}
    >
      {m.next({}, { locale: i18n.locale })}
      <AnimateIcon icon={ChevronRight} size={24} class="size-6" />
    </Button>
  </div>
</div>
