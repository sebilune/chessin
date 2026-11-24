<script lang="ts">
  import { game } from '$lib/game/gameStore.svelte';
  import { Button } from '$lib/components/ui/button';
  import { CheckCircle2, AlertCircle, ArrowRight, RotateCcw, Undo2 } from '@lucide/svelte';
</script>

{#if game.status === 'cleared'}
  <div class="w-full max-w-[500px] mt-4 p-4 bg-card border-2 border-border rounded-2xl flex items-center justify-between shadow-sm">
    <div class="flex items-center gap-3">
      <CheckCircle2 class="size-6 text-foreground shrink-0 stroke-[2.5]" />
      <div>
        <p class="text-base font-black text-foreground leading-tight">Puzzle Cleared!</p>
        <p class="text-xs font-medium text-muted-foreground mt-0.5">There can be only one</p>
      </div>
    </div>
    <div class="flex items-center gap-2">
      <Button
        variant="outline"
        size="lg"
        class="h-11 px-3.5 text-sm font-bold rounded-xl border-2"
        onclick={() => game.reset()}
      >
        <RotateCcw class="size-4 mr-1.5 stroke-[2.5]" />
        Replay
      </Button>
      {#if game.levelIndex < game.totalLevels - 1}
        <Button
          variant="default"
          size="lg"
          class="h-11 px-4 text-sm font-black rounded-xl border-2 shadow-xs"
          onclick={() => game.nextLevel()}
        >
          Next
          <ArrowRight class="size-4 ml-1.5 stroke-[2.5]" />
        </Button>
      {/if}
    </div>
  </div>
{:else if game.status === 'stuck'}
  <div class="w-full max-w-[500px] mt-4 p-4 bg-muted/70 border-2 border-border rounded-2xl flex items-center justify-between shadow-sm">
    <div class="flex items-center gap-3">
      <AlertCircle class="size-6 text-foreground shrink-0 stroke-[2.5]" />
      <div>
        <p class="text-base font-black text-foreground leading-tight">No Moves Left</p>
        <p class="text-xs font-medium text-muted-foreground mt-0.5">Pieces isolated</p>
      </div>
    </div>
    <div class="flex items-center gap-2">
      <Button
        variant="outline"
        size="lg"
        class="h-11 px-3.5 text-sm font-bold rounded-xl border-2"
        onclick={() => game.undo()}
      >
        <Undo2 class="size-4 mr-1.5 stroke-[2.5]" />
        Undo
      </Button>
      <Button
        variant="default"
        size="lg"
        class="h-11 px-3.5 text-sm font-bold rounded-xl border-2"
        onclick={() => game.reset()}
      >
        <RotateCcw class="size-4 mr-1.5 stroke-[2.5]" />
        Reset
      </Button>
    </div>
  </div>
{/if}
