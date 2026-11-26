<script lang="ts">
  import type { Snippet } from 'svelte';
  import { fly } from 'svelte/transition';
  import type { PieceType } from '../types';
  import ChessPiece from './ChessPiece.svelte';

  interface CrownSlot {
    minLevel: number;
    type: PieceType;
    sizeClass: string;
  }

  const CROWN_FORMATION: CrownSlot[] = [
    { minLevel: 64, type: 'pawn', sizeClass: 'size-6' },
    { minLevel: 63, type: 'pawn', sizeClass: 'size-8' },
    { minLevel: 62, type: 'pawn', sizeClass: 'size-10' },
    { minLevel: 61, type: 'bishop', sizeClass: 'size-12' },
    { minLevel: 60, type: 'knight', sizeClass: 'size-14' },
    { minLevel: 59, type: 'rook', sizeClass: 'size-16' },
    { minLevel: 58, type: 'king', sizeClass: 'size-20' },
    { minLevel: 59, type: 'rook', sizeClass: 'size-16' },
    { minLevel: 60, type: 'knight', sizeClass: 'size-14' },
    { minLevel: 61, type: 'bishop', sizeClass: 'size-12' },
    { minLevel: 62, type: 'pawn', sizeClass: 'size-10' },
    { minLevel: 63, type: 'pawn', sizeClass: 'size-8' },
    { minLevel: 64, type: 'pawn', sizeClass: 'size-6' },
  ];

  interface Props {
    class?: string;
    surfaceClass?: string;
    surfaceElement?: HTMLDivElement | null;
    levelId?: number;
    animateCrown?: boolean;
    header?: Snippet;
    children: Snippet;
    footer?: Snippet;
  }

  let {
    class: className = '',
    surfaceClass = '',
    surfaceElement = $bindable(null),
    levelId = 0,
    animateCrown = false,
    header,
    children,
    footer,
  }: Props = $props();
</script>

<div
  class="relative flex flex-col items-center justify-center w-full max-w-[480px] xl:max-w-[540px] select-none mx-auto {className}"
>
  {#if header}
    <div class="absolute bottom-full mb-3 inset-x-0">
      {@render header()}
    </div>
  {/if}

  <!-- Concentric 2-layer board frame: p-1 (4px) bg-border outer frame + rounded-xl inner surface avoids subpixel border gaps without covering perimeter tiles -->
  <div
    class="relative w-full aspect-square shrink-0 rounded-2xl bg-border p-1 shadow-xs"
    style="aspect-ratio: 1 / 1;"
  >
    {#if levelId >= 58}
      <div class="pointer-events-none absolute bottom-full left-1/2 -translate-x-1/2 -mb-3 z-0 flex items-end justify-center -space-x-2 text-border">
        {#each CROWN_FORMATION as slot}
          {#if levelId >= slot.minLevel}
            <div in:fly|global={{ y: 40, duration: animateCrown ? 600 : 0, opacity: 1 }}>
              <ChessPiece type={slot.type} class={slot.sizeClass} />
            </div>
          {/if}
        {/each}
      </div>
    {/if}
    <div
      bind:this={surfaceElement}
      class="relative z-10 w-full h-full rounded-xl overflow-hidden bg-board-square-dark {surfaceClass}"
    >
      {@render children()}
    </div>
  </div>

  {#if footer}
    <div class="absolute top-full mt-3 inset-x-0">
      {@render footer()}
    </div>
  {/if}
</div>
