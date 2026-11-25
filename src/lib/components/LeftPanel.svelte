<script lang="ts">
  import { game } from '$lib/game/gameStore.svelte';
  import AnimateIcon from '$lib/components/AnimateIcon.svelte';
  import ChessPiece from '$lib/components/ChessPiece.svelte';
  import LevelNavigation from '$lib/components/LevelNavigation.svelte';
  import { CircleCheckBig } from '@animateicons/vanilla/lucide';
  import { getLevelAnimatedIcon, isKingLevel } from '$lib/game/levelIcons';

  let titleWrapperEl = $state<HTMLElement | null>(null);
  let anchorEl = $state<HTMLElement | null>(null);
  let titleHeight = $state(0);
  let anchorX = $state<number | null>(null);

  const isMultiLine = $derived(titleHeight > 65);
  const isFischersRiddle = $derived(
    isKingLevel(game.currentLevel.id) || game.currentLevel.name.toLowerCase().includes('fischer')
  );
  const customAnimatedIcon = $derived(getLevelAnimatedIcon(game.currentLevel.id));
  const showWatermark = $derived(
    game.isLevelCompleted || isFischersRiddle || customAnimatedIcon !== null
  );

  $effect(() => {
    void [game.currentLevel.name, isFischersRiddle, customAnimatedIcon];

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
  <!-- Top: Level Name with Dynamic Underlay, Counter, and Navigation -->
  <div class="space-y-4">
    <div bind:this={titleWrapperEl} class="relative overflow-visible flex items-center {isMultiLine ? 'min-h-36' : 'min-h-28'}">
      {#if showWatermark}
        <div
          class="absolute top-1/2 -translate-y-1/2 pointer-events-none z-0 text-border transition-all duration-200
            {isMultiLine
              ? 'left-[58%] -translate-x-1/2 size-32 lg:size-36'
              : '-translate-x-[45%] size-24 lg:size-28'}"
          style={isMultiLine ? '' : (anchorX !== null ? `left: ${anchorX}px;` : 'left: 70%;')}
          aria-hidden="true"
        >
          {#if game.isLevelCompleted}
            <div class={game.justCleared ? 'animate-pop-in' : ''}>
              <AnimateIcon
                icon={CircleCheckBig}
                size={isMultiLine ? 144 : 112}
                class="w-full h-full"
                autoplay={game.justCleared}
              />
            </div>
          {:else if isFischersRiddle}
            {#key game.currentLevel.id}
              <div class="w-full h-full flex items-center justify-center animate-king-watermark">
                <ChessPiece type="king" class="w-full h-full text-border" />
              </div>
            {/key}
          {:else if customAnimatedIcon}
            {#key game.currentLevel.id}
              <div class="w-full h-full flex items-center justify-center">
                <AnimateIcon
                  icon={customAnimatedIcon}
                  size={isMultiLine ? 144 : 112}
                  class="w-full h-full text-border"
                  autoplay={true}
                />
              </div>
            {/key}
          {/if}
        </div>
      {/if}

      <div class="relative z-10 space-y-1.5">
        <h2
          bind:clientHeight={titleHeight}
          class="text-3xl lg:text-4xl xl:text-[2.65rem] font-black tracking-tight text-foreground leading-tight"
        >
          {game.currentLevel.name}<span bind:this={anchorEl} class="inline-block w-0 h-0 invisible"></span>
        </h2>

        <span class="text-xs sm:text-sm font-mono font-bold text-muted-foreground uppercase tracking-wider block">
          Puzzle {String(game.currentLevel.id).padStart(2, '0')} / {game.totalLevels}
        </span>
      </div>
    </div>

    <LevelNavigation class="pt-1" />
  </div>
</aside>
