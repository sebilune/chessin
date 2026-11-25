<script lang="ts">
  import { game } from '$lib/game/gameStore.svelte';
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
    title="Puzzles"
  >
    <AnimateIcon icon={Puzzle} size={22} class="size-5.5" />
    Puzzles
  </Button>

  <div class="grid grid-cols-2 gap-2">
    <Button
      variant="outline"
      size="lg"
      disabled={game.levelIndex === 0}
      onclick={() => game.prevLevel()}
      title="Previous Puzzle"
    >
      <AnimateIcon icon={ChevronLeft} size={24} class="size-6" />
      Prev
    </Button>

    <Button
      variant="outline"
      size="lg"
      disabled={!game.canNext}
      onclick={() => game.nextLevel()}
      title="Next Puzzle"
    >
      Next
      <AnimateIcon icon={ChevronRight} size={24} class="size-6" />
    </Button>
  </div>
</div>
