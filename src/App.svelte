<script lang="ts">
  import { onMount } from 'svelte';
  import { game } from '$lib/game/gameStore.svelte';
  import ChessBoard from '$lib/components/ChessBoard.svelte';
  import PuzzlePicker from '$lib/components/PuzzlePicker.svelte';
  import LeftPanel from '$lib/components/LeftPanel.svelte';
  import RightPanel from '$lib/components/RightPanel.svelte';
  import MoveHistory from '$lib/components/MoveHistory.svelte';
  import { Button } from '$lib/components/ui/button';
  import AnimateIcon from '$lib/components/AnimateIcon.svelte';
  import {
    Volume2,
    VolumeX,
    Sun,
    Moon,
    Undo,
    Redo,
    RotateCcw,
    Sparkles,
    ChevronLeft,
    ChevronRight,
    Puzzle,
  } from '@animateicons/vanilla/lucide';

  function handleKeyDown(event: KeyboardEvent) {
    if (['INPUT', 'TEXTAREA', 'SELECT'].includes((event.target as HTMLElement)?.tagName)) {
      return;
    }

    const key = event.key.toLowerCase();

    if ((event.ctrlKey || event.metaKey) && key === 'z' && !event.shiftKey) {
      event.preventDefault();
      game.undo();
      return;
    }

    if ((event.ctrlKey || event.metaKey) && (key === 'y' || (key === 'z' && event.shiftKey))) {
      event.preventDefault();
      game.redo();
      return;
    }

    if (!event.ctrlKey && !event.metaKey && !event.altKey) {
      switch (key) {
        case 'z':
          game.undo();
          break;
        case 'y':
          game.redo();
          break;
        case 'r':
          game.reset();
          break;
        case 'h':
          game.requestHint();
          break;
        case 'arrowleft':
          game.prevLevel();
          break;
        case 'arrowright':
          game.nextLevel();
          break;
        case 'escape':
          if (game.showPuzzlePicker) {
            game.showPuzzlePicker = false;
          } else {
            game.selectedPiece = null;
            game.validTargets = [];
          }
          break;
      }
    }
  }

  onMount(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  });
</script>

<main class="relative min-h-screen w-full bg-background text-foreground select-none flex flex-col justify-between p-3 sm:p-5 md:p-6 overflow-y-auto lg:h-screen lg:overflow-hidden">
  <!-- Static ambient chess pattern background -->
  <div
    class="fixed inset-0 pointer-events-none z-0 chess-bg-pattern opacity-[0.018] dark:opacity-[0.01]"
    aria-hidden="true"
  ></div>

  <!-- Top Header: Logo on Left, Sound and Theme Toggles on Right -->
  <header class="relative z-10 w-full flex items-center justify-between pb-2 shrink-0">
    <!-- Top Left Site Branding -->
    <div class="flex items-center">
      <span class="text-xl sm:text-2xl font-black tracking-tight text-foreground font-mono">
        CHESSIN
      </span>
    </div>

    <!-- Top Right Utility Buttons -->
    <div class="flex items-center gap-2">
      <Button
        variant="outline"
        size="icon"
        class="size-10 sm:size-11 rounded-xl border-4 text-foreground"
        onclick={() => game.toggleSound()}
        title={game.soundEnabled ? 'Mute Audio' : 'Unmute Audio'}
        aria-label={game.soundEnabled ? 'Mute Audio' : 'Unmute Audio'}
      >
        {#if game.soundEnabled}
          <AnimateIcon icon={Volume2} size={24} class="size-6" />
        {:else}
          <AnimateIcon icon={VolumeX} size={24} class="size-6" />
        {/if}
      </Button>

      <Button
        variant="outline"
        size="icon"
        class="size-10 sm:size-11 rounded-xl border-4 text-foreground"
        onclick={() => game.toggleTheme()}
        title="Toggle Theme"
        aria-label="Toggle Theme"
      >
        {#if game.theme === 'dark'}
          <AnimateIcon icon={Sun} size={24} class="size-6" />
        {:else}
          <AnimateIcon icon={Moon} size={24} class="size-6" />
        {/if}
      </Button>
    </div>
  </header>

  <!-- Mobile & Tablet Vertical Flow (< lg): Single continuous column matching wireframe -->
  <div class="relative z-10 lg:hidden flex flex-col items-center w-full max-w-[480px] mx-auto py-2 space-y-4">
    <!-- Title & Puzzle Number directly above the board -->
    <h2 class="text-xl sm:text-2xl font-black tracking-tight text-center">
      <span class="text-muted-foreground">#{game.currentLevel.id}</span>
      <span class="text-foreground">{game.currentLevel.name}</span>
    </h2>

    <!-- Chess Board in Center (aspect-square, never squished) -->
    <div class="w-full flex justify-center">
      {#if game.showPuzzlePicker}
        <PuzzlePicker />
      {:else}
        <ChessBoard />
      {/if}
    </div>

    <!-- Controls falling cleanly under the board -->
    <div class="w-full grid grid-cols-2 gap-2 pt-1">
      <!-- Row 1: Puzzles (above Prev / Next) -->
      <Button
        variant={game.showPuzzlePicker ? 'default' : 'outline'}
        size="lg"
        class="w-full col-span-2 h-12 text-sm sm:text-base font-bold justify-center rounded-xl border-4"
        onclick={() => game.togglePuzzlePicker()}
        title="Puzzles"
      >
        <AnimateIcon icon={Puzzle} size={22} class="size-5.5 mr-2" />
        Puzzles
      </Button>

      <!-- Row 2: Prev / Next -->
      <Button
        variant="outline"
        size="lg"
        class="h-12 text-sm sm:text-base font-bold justify-center rounded-xl border-4"
        disabled={game.levelIndex === 0}
        onclick={() => game.prevLevel()}
        title="Previous Puzzle"
      >
        <AnimateIcon icon={ChevronLeft} size={24} class="size-6 mr-1.5" />
        Prev
      </Button>
      <Button
        variant="outline"
        size="lg"
        class="h-12 text-sm sm:text-base font-bold justify-center rounded-xl border-4"
        disabled={game.levelIndex === game.totalLevels - 1}
        onclick={() => game.nextLevel()}
        title="Next Puzzle"
      >
        Next
        <AnimateIcon icon={ChevronRight} size={24} class="size-6 ml-1.5" />
      </Button>

      <!-- Row 3: Undo / Redo -->
      <Button
        variant="outline"
        size="lg"
        class="h-12 text-sm sm:text-base font-bold justify-center rounded-xl border-4"
        disabled={game.showPuzzlePicker || !game.canUndo}
        onclick={() => game.undo()}
        title="Undo Move"
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
        title="Redo Move"
      >
        <AnimateIcon icon={Redo} size={22} class="size-5.5 mr-2" />
        Redo
      </Button>

      <!-- Row 4: Reset / Hint -->
      <Button
        variant={game.status === 'stuck' ? 'default' : 'outline'}
        size="lg"
        class="h-12 text-sm sm:text-base font-bold justify-center rounded-xl border-4 {game.status === 'stuck' ? 'border-primary' : ''}"
        disabled={game.showPuzzlePicker || game.moveHistory.length === 0}
        onclick={() => game.reset()}
        title="Reset Puzzle"
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
        title={game.currentLevel.hintsDisabled ? 'Prove yourself.' : 'Get Hint'}
      >
        <AnimateIcon icon={Sparkles} size={22} class="size-5.5 mr-2" />
        Hint
      </Button>
    </div>

    <!-- Move History Box underneath the buttons -->
    <div class="w-full pt-1 pb-6">
      <MoveHistory />
    </div>
  </div>

  <!-- Desktop Arena Layout (>= lg): 3-column side-by-side view -->
  <div class="relative z-10 hidden lg:flex flex-1 items-center justify-center min-h-0 w-full max-w-7xl mx-auto py-2">
    <div class="w-full flex items-center justify-center gap-8 lg:gap-12 xl:gap-14">
      <!-- Left Controls Panel -->
      <div class="w-56 lg:w-64 xl:w-72 shrink-0">
        <LeftPanel />
      </div>

      <!-- Chess Board in Center -->
      <div class="flex flex-col items-center justify-center flex-1 max-w-[500px] lg:max-w-[520px] xl:max-w-[540px] px-2">
        {#if game.showPuzzlePicker}
          <PuzzlePicker />
        {:else}
          <ChessBoard />
        {/if}
      </div>

      <!-- Right Controls Panel -->
      <div class="w-56 lg:w-64 xl:w-72 shrink-0">
        <RightPanel />
      </div>
    </div>
  </div>
</main>
