<script lang="ts">
  import { onMount } from 'svelte';
  import { game } from '$lib/game/gameStore.svelte';
  import ChessBoard from '$lib/components/ChessBoard.svelte';
  import PuzzlePicker from '$lib/components/PuzzlePicker.svelte';
  import LeftPanel from '$lib/components/LeftPanel.svelte';
  import RightPanel from '$lib/components/RightPanel.svelte';
  import ActionControls from '$lib/components/ActionControls.svelte';
  import MobileActionBar from '$lib/components/MobileActionBar.svelte';
  import CaptureProgressBar from '$lib/components/CaptureProgressBar.svelte';
  import MorseBar from '$lib/components/MorseBar.svelte';
  import MoveHistory from '$lib/components/MoveHistory.svelte';
  import { Button } from '$lib/components/ui/button';
  import ChessPiece from '$lib/components/ChessPiece.svelte';
  import VolumeSlider from '$lib/components/VolumeSlider.svelte';
  import AnimateIcon from '$lib/components/AnimateIcon.svelte';
  import { Volume2, VolumeX, Sun, Moon, Github, RotateCcw } from '@animateicons/vanilla/lucide';

  let volumeOpen = $state(false);
  let volumeHovered = $state(false);
  let volumeDragging = $state(false);
  let volumeCloseTimer: ReturnType<typeof setTimeout> | null = null;

  const isChessinOrg =
    typeof window !== 'undefined' &&
    window.location.hostname.toLowerCase().replace(/^www\./, '') === 'chessin.org';
  const brandTitle = isChessinOrg ? 'CHESSIN.ORG' : 'CHESSIN';

  function openVolumeMenu() {
    if (volumeCloseTimer) {
      clearTimeout(volumeCloseTimer);
      volumeCloseTimer = null;
    }
    volumeOpen = true;
  }

  function scheduleCloseVolumeMenu() {
    if (volumeDragging) return;
    if (volumeCloseTimer) clearTimeout(volumeCloseTimer);
    volumeCloseTimer = setTimeout(() => {
      if (!volumeDragging && !volumeHovered) {
        volumeOpen = false;
      }
      volumeCloseTimer = null;
    }, 150);
  }

  function handleKeyDown(event: KeyboardEvent) {
    if (['INPUT', 'TEXTAREA', 'SELECT'].includes((event.target as HTMLElement)?.tagName)) {
      return;
    }

    const key = event.key.toLowerCase();

    if ((event.ctrlKey || event.metaKey) && key === 'z' && !event.shiftKey) {
      if (game.showPuzzlePicker) return;
      event.preventDefault();
      game.undo();
      return;
    }

    if ((event.ctrlKey || event.metaKey) && (key === 'y' || (key === 'z' && event.shiftKey))) {
      if (game.showPuzzlePicker) return;
      event.preventDefault();
      game.redo();
      return;
    }

    if (!event.ctrlKey && !event.metaKey && !event.altKey) {
      switch (key) {
        case 'z':
          if (!game.showPuzzlePicker) game.undo();
          break;
        case 'arrowleft':
          if (game.showPuzzlePicker) break;
          event.preventDefault();
          game.undo();
          break;
        case 'y':
          if (!game.showPuzzlePicker) game.redo();
          break;
        case 'arrowright':
          if (game.showPuzzlePicker) break;
          event.preventDefault();
          game.redo();
          break;
        case 'r':
          if (!game.showPuzzlePicker) game.reset();
          break;
        case 'h':
          if (!game.showPuzzlePicker) game.requestHint();
          break;
        case 'arrowup':
          event.preventDefault();
          game.nextLevel();
          break;
        case 'arrowdown':
          event.preventDefault();
          game.prevLevel();
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

<main class="relative min-h-screen w-full bg-background text-foreground select-none flex flex-col xl:justify-between p-3 sm:p-5 md:p-6 overflow-y-auto xl:h-screen xl:overflow-hidden">
  <!-- Static ambient chess pattern background -->
  <div
    class="fixed inset-0 pointer-events-none z-0 chess-bg-pattern opacity-[0.018] dark:opacity-[0.0175]"
    aria-hidden="true"
  ></div>

  <!-- Header: Logo on Left, Sound and Theme Toggles on Right -->
  <header class="relative z-30 w-full max-w-[480px] xl:max-w-none mx-auto flex items-center justify-between pb-3 xl:pb-2 shrink-0">
    <!-- Top Left Site Branding -->
    <div class="flex items-center gap-1.5">
      <ChessPiece type="queen" class="size-5 sm:size-6 text-foreground shrink-0" />
      <span class="text-xl sm:text-2xl font-black tracking-tight text-foreground font-mono">
        {brandTitle}{game.isAdmin ? ' (ADMIN)' : ''}
      </span>
    </div>

    <!-- Top Right Utility Buttons -->
    <div class="flex items-center gap-1 sm:gap-2">
      <Button
        variant="ghost"
        size="icon"
        class="size-10 sm:size-11 rounded-xl xl:border-border xl:bg-background text-foreground"
        href="https://github.com/sebilune/chessin"
        target="_blank"
        rel="noopener noreferrer"
        title="GitHub Repository"
        aria-label="GitHub Repository"
      >
        <AnimateIcon icon={Github} size={24} class="size-6" />
      </Button>

      <div
        class="relative"
        role="group"
        aria-label="Audio Controls"
        onpointerenter={(e) => {
          if (e.pointerType !== 'touch') {
            volumeHovered = true;
            openVolumeMenu();
          }
        }}
        onpointerleave={(e) => {
          if (e.pointerType !== 'touch') {
            volumeHovered = false;
            scheduleCloseVolumeMenu();
          }
        }}
        onfocusin={openVolumeMenu}
        onfocusout={(e) => {
          const next = e.relatedTarget as Node | null;
          if (!next || !e.currentTarget.contains(next)) {
            volumeOpen = false;
          }
        }}
      >
        <Button
          variant="ghost"
          size="icon"
          class="size-10 sm:size-11 rounded-xl xl:border-border xl:bg-background text-foreground"
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

        {#if volumeOpen}
          <div
            class="absolute top-full pt-2 left-1/2 -translate-x-1/2 z-50"
          >
            <div
              class="w-10 sm:w-11 rounded-xl border-4 border-border bg-background text-foreground py-2 flex flex-col items-center shadow-xs"
            >
              <VolumeSlider
                value={game.soundEnabled ? game.soundVolume : 0}
                onchange={(value) => game.setSoundVolume(value)}
                ondragchange={(dragging) => {
                  volumeDragging = dragging;
                  if (!dragging && !volumeHovered) {
                    scheduleCloseVolumeMenu();
                  }
                }}
                aria-label="Audio Volume"
              />
            </div>
          </div>
        {/if}
      </div>

      <Button
        variant="ghost"
        size="icon"
        class="size-10 sm:size-11 rounded-xl xl:border-border xl:bg-background text-foreground"
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

  <!-- Mobile & Tablet Vertical Flow (< xl): Sketch layout -->
  <div class="relative z-10 xl:hidden flex flex-col items-center w-full max-w-[480px] mx-auto py-1 space-y-3">
    <!-- Top Row: Reset Button + Capture Progress Bar -->
    <div class="flex items-center gap-2.5 w-full">
      <Button
        variant="ghost"
        size="icon"
        class="relative size-6 border-0 rounded-md shrink-0 text-foreground after:absolute after:-inset-2.5"
        disabled={game.showPuzzlePicker || game.moveHistory.length === 0}
        onclick={() => game.reset()}
        title="Reset Puzzle"
        aria-label="Reset Puzzle"
      >
        <AnimateIcon icon={RotateCcw} size={24} class="size-6" />
      </Button>

      {#if game.showPuzzlePicker}
        <MorseBar class="flex-1 mt-0 px-0" />
      {:else}
        <CaptureProgressBar
          totalCaptures={game.initialPieceCount - 1}
          capturesCompleted={game.initialPieceCount - game.piecesRemaining}
          class="flex-1 mt-0 px-0"
        />
      {/if}
    </div>

    <!-- Title & Puzzle Number directly above the board -->
    <h2 class="w-full text-2xl sm:text-3xl font-black tracking-tight text-left">
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

    <!-- Single row of 4 icon controls under the board -->
    <div class="w-full pt-0.5">
      <MobileActionBar />
    </div>

    <!-- Move History Box underneath the buttons -->
    <div class="w-full">
      <MoveHistory />
    </div>
  </div>

  <!-- Desktop Arena Layout (>= xl): 3-column side-by-side view -->
  <div class="relative z-10 hidden xl:flex flex-1 items-center justify-center min-h-0 w-full max-w-7xl mx-auto pt-6 pb-2">
    <div class="w-full flex items-stretch justify-center gap-12 xl:gap-14">
      <!-- Left Controls Panel -->
      <div class="w-72 shrink-0">
        <LeftPanel />
      </div>

      <!-- Chess Board in Center -->
      <div class="flex flex-col items-center justify-center flex-1 max-w-[540px] px-2">
        {#if game.showPuzzlePicker}
          <PuzzlePicker />
        {:else}
          <ChessBoard />
        {/if}
      </div>

      <!-- Right Controls Panel -->
      <div class="w-72 shrink-0">
        <RightPanel />
      </div>
    </div>
  </div>
</main>
