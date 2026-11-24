<script lang="ts">
  import { game } from '$lib/game/gameStore.svelte';
  import { Button } from '$lib/components/ui/button';
  import { Undo2, Redo2, RotateCcw, Sparkles } from '@lucide/svelte';
</script>

<aside class="flex flex-col justify-between h-[500px] max-h-[65vh] py-2 select-none">
  <!-- Action Buttons -->
  <div class="space-y-2.5">
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

    <div class="grid grid-cols-2 gap-2">
      <Button
        variant="outline"
        size="lg"
        class="h-12 text-sm sm:text-base font-bold justify-center rounded-xl border-2"
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

  <!-- Move History Card -->
  <div class="flex-1 my-3 p-4 rounded-xl border-2 border-border bg-card flex flex-col min-h-0 overflow-hidden shadow-xs">
    <div class="flex items-center justify-between pb-2 mb-2 border-b-2 border-border/80">
      <span class="font-bold text-sm sm:text-base text-foreground uppercase tracking-wide">Captures</span>
      <span class="font-mono text-xs font-bold text-muted-foreground bg-muted px-2 py-0.5 rounded-md">{game.moveHistory.length} moves</span>
    </div>

    <div class="flex-1 overflow-y-auto space-y-1.5 pr-1 font-mono text-sm">
      {#if game.moveHistory.length === 0}
        <div class="h-full flex items-center justify-center text-center text-muted-foreground text-xs sm:text-sm px-2 font-sans font-medium">
          Select a piece to view valid capture targets
        </div>
      {:else}
        {#each game.moveHistory as move, idx}
          <div class="flex items-center justify-between py-1 px-2.5 rounded-lg bg-muted/60 text-foreground text-xs sm:text-sm">
            <span class="text-muted-foreground font-bold">#{idx + 1}</span>
            <span class="font-extrabold">{move.notation}</span>
          </div>
        {/each}
      {/if}
    </div>
  </div>

  <!-- Keyboard Shortcuts Hint -->
  <div class="text-xs text-muted-foreground font-mono font-bold flex items-center justify-between px-1">
    <span>Z: Undo</span>
    <span>R: Reset</span>
    <span>H: Hint</span>
  </div>
</aside>
