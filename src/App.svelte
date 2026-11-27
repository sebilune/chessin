<script lang="ts">
  import { onMount } from 'svelte';
  import { game } from '$lib/game/gameStore.svelte';
  import { getLevelName, i18n, LOCALE_LABELS, m, orderedLocales } from '$lib/i18n.svelte';
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
  import { Dropdown } from '$lib/components/ui/dropdown';
  import ChessPiece from '$lib/components/ChessPiece.svelte';
  import VolumeSlider from '$lib/components/VolumeSlider.svelte';
  import AnimateIcon from '$lib/components/AnimateIcon.svelte';
  import { Volume2, VolumeX, Sun, Moon, Github, RotateCcw, Languages } from '@animateicons/vanilla/lucide';

  let volumeDragging = $state(false);
  let boardHeight = $state<number>(0);

  const isChessinOrg =
    typeof window !== 'undefined' &&
    window.location.hostname.toLowerCase().replace(/^www\./, '') === 'chessin.org';
  const brandTitle = isChessinOrg ? 'CHESSIN.ORG' : 'CHESSIN';

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
      <ChessPiece type="queen" class="size-6 text-foreground shrink-0" />
      <span class="text-lg sm:text-xl font-black tracking-tight text-foreground">
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
        title={m.github_repo({}, { locale: i18n.locale })}
        aria-label={m.github_repo({}, { locale: i18n.locale })}
      >
        <AnimateIcon icon={Github} size={24} class="size-6" />
      </Button>

      <Dropdown
        ariaLabel={m.change_language({}, { locale: i18n.locale })}
        panelClass="min-w-36 sm:min-w-40 w-max p-1.5 flex flex-col gap-1"
      >
        {#snippet trigger({ open, toggle })}
          <Button
            variant="ghost"
            size="icon"
            class="size-10 sm:size-11 rounded-xl xl:border-border xl:bg-background text-foreground"
            onclick={toggle}
            title={m.change_language({}, { locale: i18n.locale })}
            aria-label={m.change_language({}, { locale: i18n.locale })}
            aria-expanded={open}
          >
            <AnimateIcon icon={Languages} size={24} class="size-6" />
          </Button>
        {/snippet}

        {#snippet content({ close })}
          {#each orderedLocales as loc}
            {@const isActive = i18n.locale === loc}
            <button
              type="button"
              class="w-full px-3 py-2 rounded-lg text-sm sm:text-base font-bold text-left flex items-center justify-between gap-3 cursor-pointer transition-none
                {isActive
                  ? 'bg-primary text-primary-foreground'
                  : 'text-foreground hover:bg-border'}"
              onclick={() => {
                i18n.setLocale(loc);
                close();
              }}
            >
              <span>{LOCALE_LABELS[loc].name}</span>
              <span class="text-xs sm:text-sm opacity-70">{LOCALE_LABELS[loc].code}</span>
            </button>
          {/each}
        {/snippet}
      </Dropdown>

      <Dropdown
        ariaLabel={m.audio_controls({}, { locale: i18n.locale })}
        panelClass="w-10 sm:w-11 py-2 flex flex-col items-center"
        preventClose={() => volumeDragging}
      >
        {#snippet trigger({ open })}
          <Button
            variant="ghost"
            size="icon"
            class="size-10 sm:size-11 rounded-xl xl:border-border xl:bg-background text-foreground"
            onclick={() => game.toggleSound()}
            title={game.soundEnabled ? m.mute_audio({}, { locale: i18n.locale }) : m.unmute_audio({}, { locale: i18n.locale })}
            aria-label={game.soundEnabled ? m.mute_audio({}, { locale: i18n.locale }) : m.unmute_audio({}, { locale: i18n.locale })}
            aria-expanded={open}
          >
            {#if game.soundEnabled}
              <AnimateIcon icon={Volume2} size={24} class="size-6" />
            {:else}
              <AnimateIcon icon={VolumeX} size={24} class="size-6" />
            {/if}
          </Button>
        {/snippet}

        {#snippet content()}
          <VolumeSlider
            value={game.soundEnabled ? game.soundVolume : 0}
            onchange={(value) => game.setSoundVolume(value)}
            ondragchange={(dragging) => {
              volumeDragging = dragging;
            }}
            aria-label={m.audio_volume({}, { locale: i18n.locale })}
          />
        {/snippet}
      </Dropdown>

      <Button
        variant="ghost"
        size="icon"
        class="size-10 sm:size-11 rounded-xl xl:border-border xl:bg-background text-foreground"
        onclick={() => game.toggleTheme()}
        title={m.toggle_theme({}, { locale: i18n.locale })}
        aria-label={m.toggle_theme({}, { locale: i18n.locale })}
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
        title={m.reset_puzzle({}, { locale: i18n.locale })}
        aria-label={m.reset_puzzle({}, { locale: i18n.locale })}
      >
        <AnimateIcon icon={RotateCcw} size={24} class="size-6" />
      </Button>

      {#if game.showPuzzlePicker}
        <MorseBar class="flex-1 mt-0 px-0" />
      {:else}
        <CaptureProgressBar
          totalCaptures={game.initialPieceCount - 1}
          capturesCompleted={game.initialPieceCount - game.piecesRemaining}
          isHard={game.currentLevel.difficulty === 'hard'}
          class="flex-1 mt-0 px-0"
        />
      {/if}
    </div>

    <!-- Title & Puzzle Number directly above the board -->
    <h2 class="w-full text-2xl sm:text-3xl font-black tracking-tight text-left">
      {#if !game.isDailyMode}
        <span class="text-muted-foreground">#{game.currentLevel.id}</span>
      {/if}
      <span class="text-foreground">
        {game.isDailyMode
          ? m.daily_puzzle({}, { locale: i18n.locale })
          : getLevelName(game.currentLevel.id, game.currentLevel.name)}
      </span>
    </h2>

    <!-- Chess Board in Center (aspect-square, never squished) -->
    <div class="w-full flex justify-center">
      {#if game.showPuzzlePicker}
        <PuzzlePicker />
      {:else}
        <ChessBoard />
      {/if}
    </div>

    <!-- Mobile Action Controls & Move History -->
    <div class="w-full pt-0.5">
      <MobileActionBar />
    </div>
  </div>

  <!-- Desktop Arena Layout (>= xl): 3-column side-by-side view -->
  <div class="relative z-10 hidden xl:flex flex-1 items-center justify-center min-h-0 w-full max-w-7xl mx-auto pt-6 pb-2">
    <div
      class="w-full flex items-stretch justify-center"
      style={boardHeight > 0 ? `height: ${boardHeight}px; max-height: ${boardHeight}px;` : ''}
    >
      <!-- Left Controls Panel: spans between left edge and board with min-w-72 -->
      <div class="flex-1 min-w-72 min-h-0 flex flex-col justify-between pr-8 xl:pr-10">
        <LeftPanel />
      </div>

      <!-- Chess Board in Center -->
      <div
        bind:clientHeight={boardHeight}
        class="flex flex-col items-center justify-center shrink-0 w-[500px] xl:w-[540px] px-2"
      >
        {#if game.showPuzzlePicker}
          <PuzzlePicker />
        {:else}
          <ChessBoard />
        {/if}
      </div>

      <!-- Right Controls Panel: spans between board and right edge with matching balance -->
      <div class="flex-1 min-w-72 min-h-0 flex flex-col justify-between items-end pl-8 xl:pl-10">
        <div class="w-full max-w-80 h-full">
          <RightPanel />
        </div>
      </div>
    </div>
  </div>
</main>
