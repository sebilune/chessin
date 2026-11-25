<script lang="ts">
  import { onMount } from 'svelte';
  import { game } from '$lib/game/gameStore.svelte';
  import ChessBoard from '$lib/components/ChessBoard.svelte';
  import PuzzlePicker from '$lib/components/PuzzlePicker.svelte';
  import LeftPanel from '$lib/components/LeftPanel.svelte';
  import RightPanel from '$lib/components/RightPanel.svelte';
  import ActionControls from '$lib/components/ActionControls.svelte';
  import LevelNavigation from '$lib/components/LevelNavigation.svelte';
  import MoveHistory from '$lib/components/MoveHistory.svelte';
  import { Button } from '$lib/components/ui/button';
  import AnimateIcon from '$lib/components/AnimateIcon.svelte';
  import { Volume2, VolumeX, Sun, Moon } from '@animateicons/vanilla/lucide';

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

  <!-- Header: Logo on Left, Sound and Theme Toggles on Right (Bottom on mobile, Top on desktop) -->
  <header class="relative z-10 w-full max-w-[480px] lg:max-w-none mx-auto flex items-center justify-between order-2 lg:order-1 pt-4 lg:pt-0 lg:pb-2 shrink-0">
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
  <div class="relative z-10 lg:hidden order-1 flex flex-col items-center w-full max-w-[480px] mx-auto py-2 space-y-4">
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
    <div class="w-full space-y-2 pt-1">
      <ActionControls />
      <LevelNavigation />
    </div>

    <!-- Move History Box underneath the buttons -->
    <div class="w-full pt-1">
      <MoveHistory />
    </div>
  </div>

  <!-- Desktop Arena Layout (>= lg): 3-column side-by-side view -->
  <div class="relative z-10 hidden lg:flex lg:order-2 flex-1 items-center justify-center min-h-0 w-full max-w-7xl mx-auto py-2">
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
