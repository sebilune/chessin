<script lang="ts">
  import { onMount } from 'svelte';
  import { game } from '$lib/game/gameStore.svelte';
  import ChessBoard from '$lib/components/ChessBoard.svelte';
  import LeftPanel from '$lib/components/LeftPanel.svelte';
  import RightPanel from '$lib/components/RightPanel.svelte';
  import { Button } from '$lib/components/ui/button';
  import {
    Volume2,
    VolumeX,
    Sun,
    Moon,
    Undo2,
    RotateCcw,
    Sparkles,
    ChevronLeft,
    ChevronRight,
    Check,
  } from '@lucide/svelte';

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
          game.selectedPiece = null;
          game.validTargets = [];
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

<main class="h-screen w-screen overflow-hidden flex flex-col justify-between bg-background text-foreground p-3 sm:p-5 md:p-6 select-none">
  <!-- Top Header: Logo on Left, Sound and Theme Toggles on Right -->
  <header class="w-full flex items-center justify-between pb-2">
    <!-- Top Left Site Branding -->
    <div class="flex items-center gap-3">
      <span class="text-xl sm:text-2xl font-black tracking-tight text-foreground font-mono">
        CHESSIN
      </span>
    </div>

    <!-- Top Right Utility Buttons -->
    <div class="flex items-center gap-2">
      <Button
        variant="outline"
        size="icon"
        class="size-10 sm:size-11 rounded-xl border-2 text-foreground"
        onclick={() => game.toggleSound()}
        title={game.soundEnabled ? 'Mute Audio' : 'Unmute Audio'}
        aria-label={game.soundEnabled ? 'Mute Audio' : 'Unmute Audio'}
      >
        {#if game.soundEnabled}
          <Volume2 class="size-5 stroke-[2.5]" />
        {:else}
          <VolumeX class="size-5 stroke-[2.5]" />
        {/if}
      </Button>

      <Button
        variant="outline"
        size="icon"
        class="size-10 sm:size-11 rounded-xl border-2 text-foreground"
        onclick={() => game.toggleTheme()}
        title="Toggle Theme"
        aria-label="Toggle Theme"
      >
        {#if game.theme === 'dark'}
          <Sun class="size-5 stroke-[2.5]" />
        {:else}
          <Moon class="size-5 stroke-[2.5]" />
        {/if}
      </Button>
    </div>
  </header>

  <!-- Mobile Only Level Header (< md) -->
  <div class="md:hidden flex items-center justify-between py-2 border-b-2 border-border text-sm">
    <div class="flex items-center gap-2">
      <span class="font-bold text-base text-foreground">
        {game.currentLevel.name}
      </span>
      <span class="font-mono font-bold text-muted-foreground text-xs">
        #{String(game.currentLevel.id).padStart(2, '0')}
      </span>
      {#if game.isLevelCompleted}
        <span class="size-4 rounded-full bg-foreground text-background flex items-center justify-center shrink-0">
          <Check class="size-2.5 stroke-[3.5]" />
        </span>
      {/if}
    </div>
    <div class="flex items-center gap-1.5">
      <Button
        variant="outline"
        size="icon"
        class="size-8 rounded-lg border-2"
        disabled={game.levelIndex === 0}
        onclick={() => game.prevLevel()}
      >
        <ChevronLeft class="size-4 stroke-[2.5]" />
      </Button>
      <Button
        variant="outline"
        size="icon"
        class="size-8 rounded-lg border-2"
        disabled={game.levelIndex === game.totalLevels - 1}
        onclick={() => game.nextLevel()}
      >
        <ChevronRight class="size-4 stroke-[2.5]" />
      </Button>
    </div>
  </div>

  <!-- Center Game Arena: Side Controls + Chess Board in Middle -->
  <div class="flex-1 flex items-center justify-center min-h-0 w-full max-w-6xl mx-auto py-2">
    <div class="w-full flex items-center justify-center gap-8 lg:gap-14">
      <!-- Left Controls Panel (Desktop view) -->
      <div class="hidden md:block w-56 lg:w-64 shrink-0">
        <LeftPanel />
      </div>

      <!-- Chess Board in Center -->
      <div class="flex flex-col items-center justify-center flex-1 max-w-[500px] px-2">
        <ChessBoard />
      </div>

      <!-- Right Controls Panel (Desktop view) -->
      <div class="hidden md:block w-56 lg:w-64 shrink-0">
        <RightPanel />
      </div>
    </div>
  </div>

  <!-- Mobile Only Bottom Controls (< md) -->
  <div class="md:hidden flex items-center justify-around py-3 border-t-2 border-border gap-2">
    <Button
      variant="outline"
      size="lg"
      class="flex-1 h-11 text-sm font-bold rounded-xl border-2"
      disabled={!game.canUndo}
      onclick={() => game.undo()}
    >
      <Undo2 class="size-4 mr-1 stroke-[2.5]" />
      Undo
    </Button>
    <Button
      variant={game.status === 'stuck' ? 'default' : 'outline'}
      size="lg"
      class="flex-1 h-11 text-sm font-bold rounded-xl border-2 {game.status === 'stuck' ? 'border-primary' : ''}"
      onclick={() => game.reset()}
    >
      <RotateCcw class="size-4 mr-1 stroke-[2.5]" />
      Reset
    </Button>
    <Button
      variant="default"
      size="lg"
      class="flex-1 h-11 text-sm font-bold rounded-xl border-2"
      disabled={game.status !== 'in_progress'}
      onclick={() => game.requestHint()}
    >
      <Sparkles class="size-4 mr-1 stroke-[2.5]" />
      Hint
    </Button>
  </div>
</main>
