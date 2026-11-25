<script lang="ts">
  import type { Snippet } from 'svelte';

  interface Props {
    class?: string;
    surfaceClass?: string;
    surfaceElement?: HTMLDivElement | null;
    children: Snippet;
    footer?: Snippet;
  }

  let {
    class: className = '',
    surfaceClass = '',
    surfaceElement = $bindable(null),
    children,
    footer,
  }: Props = $props();
</script>

<div
  class="relative flex flex-col items-center justify-center w-full max-w-[480px] lg:max-w-[520px] xl:max-w-[540px] select-none mx-auto {className}"
>
  <!-- Concentric 2-layer board frame: p-1 (4px) bg-border outer frame + rounded-xl inner surface avoids subpixel border gaps without covering perimeter tiles -->
  <div
    class="relative w-full aspect-square shrink-0 rounded-2xl bg-border p-1 shadow-xs"
    style="aspect-ratio: 1 / 1;"
  >
    <div
      bind:this={surfaceElement}
      class="relative w-full h-full rounded-xl overflow-hidden bg-board-square-dark {surfaceClass}"
    >
      {@render children()}
    </div>
  </div>

  {#if footer}
    {@render footer()}
  {/if}
</div>
