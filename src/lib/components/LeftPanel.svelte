<script lang="ts">
  import { game } from '$lib/game/gameStore.svelte';
  import { Button } from '$lib/components/ui/button';
  import AnimateIcon from '$lib/components/AnimateIcon.svelte';
  import ChessPiece from '$lib/components/ChessPiece.svelte';
  import { ChevronLeft, ChevronRight, Puzzle, CircleCheckBig } from '@animateicons/vanilla/lucide';
  import { getLevelAnimatedIcon } from '$lib/game/levelIcons';

  let titleWrapperEl = $state<HTMLElement | null>(null);
  let anchorEl = $state<HTMLElement | null>(null);
  let titleHeight = $state(0);
  let anchorX = $state<number | null>(null);

  const isMultiLine = $derived(titleHeight > 65);
  const isFischersRiddle = $derived(
    game.currentLevel.id === 64 || game.currentLevel.name.toLowerCase().includes('fischer')
  );
  const customAnimatedIcon = $derived(getLevelAnimatedIcon(game.currentLevel.id));

  $effect(() => {
    const _ = game.currentLevel.name;
    const __ = isFischersRiddle;
    const ___ = customAnimatedIcon;
    function updateAnchor() {
      if (anchorEl && titleWrapperEl) {
        const parentRect = titleWrapperEl.getBoundingClientRect();
        const aRect = anchorEl.getBoundingClientRect();
        const rawAnchorX = aRect.left - parentRect.left;
        // Clamp so the right edge of the watermark never overflows past the panel box
        const rightEdgeMargin = 62;
        const maxAnchorX = Math.max(0, parentRect.width - rightEdgeMargin);
        anchorX = Math.min(rawAnchorX, maxAnchorX);
      }
    }
    updateAnchor();
    window.addEventListener('resize', updateAnchor);
    return () => window.removeEventListener('resize', updateAnchor);
  });
</script>

<aside class="flex flex-col justify-between h-[500px] lg:h-[520px] max-h-[70vh] py-2 select-none">
  <!-- Top: Level Name with Dynamic Checkmark Underlay, Counter, and Navigation -->
  <div class="space-y-4">
    <div class="space-y-1.5">
      <!-- Title block with dynamic adaptive underlay watermark -->
      <div bind:this={titleWrapperEl} class="relative overflow-visible">
        <!-- Custom Animated Lucide underlay watermark for levels 48-63 -->
        {#if customAnimatedIcon && !game.isLevelCompleted}
          {#key game.currentLevel.id}
            <div
              class="absolute top-1/2 -translate-y-1/2 pointer-events-none z-0 text-border transition-all duration-200
                {isMultiLine
                  ? 'left-[58%] -translate-x-1/2 size-32 lg:size-36'
                  : '-translate-x-[45%] size-24 lg:size-28'}"
              style={isMultiLine ? '' : (anchorX !== null ? `left: ${anchorX}px;` : 'left: 70%;')}
              aria-hidden="true"
            >
              <div class="w-full h-full flex items-center justify-center">
                <AnimateIcon
                  icon={customAnimatedIcon}
                  size={isMultiLine ? 144 : 112}
                  class="w-full h-full text-border"
                  autoplay={true}
                />
              </div>
            </div>
          {/key}
        {/if}

        <!-- King underlay watermark for Fischer's Riddle (normally) using updateAnchor -->
        {#if isFischersRiddle && !game.isLevelCompleted}
          <div
            class="absolute top-1/2 -translate-y-1/2 pointer-events-none z-0 text-border transition-all duration-200
              {isMultiLine
                ? 'left-[58%] -translate-x-1/2 size-32 lg:size-36'
                : '-translate-x-[45%] size-24 lg:size-28'}"
            style={isMultiLine ? '' : (anchorX !== null ? `left: ${anchorX}px;` : 'left: 70%;')}
            aria-hidden="true"
          >
            <div class="w-full h-full flex items-center justify-center">
              <ChessPiece
                type="king"
                class="w-full h-full text-border"
              />
            </div>
          </div>
        {/if}

        {#if game.isLevelCompleted}
          <div
            class="absolute top-1/2 -translate-y-1/2 pointer-events-none z-0 text-border transition-all duration-200
              {isMultiLine
                ? 'left-[58%] -translate-x-1/2 size-32 lg:size-36'
                : '-translate-x-[45%] size-24 lg:size-28'}"
            style={isMultiLine ? '' : (anchorX !== null ? `left: ${anchorX}px;` : 'left: 70%;')}
            aria-hidden="true"
          >
            <div class={game.justCleared ? 'animate-pop-in' : ''}>
              <AnimateIcon
                icon={CircleCheckBig}
                size={isMultiLine ? 144 : 112}
                class="w-full h-full"
                autoplay={game.justCleared}
              />
            </div>
          </div>
        {/if}

        <h2
          bind:clientHeight={titleHeight}
          class="relative z-10 text-3xl lg:text-4xl xl:text-[2.65rem] font-black tracking-tight text-foreground leading-tight"
        >
          {game.currentLevel.name}<span bind:this={anchorEl} class="inline-block w-0 h-0 invisible"></span>
        </h2>
      </div>

      <!-- Puzzle Counter under the name -->
      <span class="text-xs sm:text-sm font-mono font-bold text-muted-foreground uppercase tracking-wider block">
        Puzzle {String(game.currentLevel.id).padStart(2, '0')} / {game.totalLevels}
      </span>
    </div>

    <!-- Navigation Controls (Puzzles & Prev / Next) -->
    <div class="space-y-2 pt-1">
      <!-- Puzzles Button above Prev / Next -->
      <Button
        variant={game.showPuzzlePicker ? 'default' : 'outline'}
        size="lg"
        class="w-full h-12 text-sm sm:text-base font-bold justify-center rounded-xl border-4"
        onclick={() => game.togglePuzzlePicker()}
        title="Puzzles"
      >
        <AnimateIcon icon={Puzzle} size={22} class="size-5.5 mr-2" />
        Puzzles
      </Button>

      <div class="grid grid-cols-2 gap-2">
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
      </div>
    </div>
  </div>
</aside>
