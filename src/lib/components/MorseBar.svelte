<script lang="ts">
  interface Props {
    class?: string;
  }

  let { class: className = '' }: Props = $props();

  // Morse code for "e4" (e = ".", 4 = "....-") separated by an empty bar
  const SEGMENTS = [
    { filled: true, weight: 1 },
    { filled: false, weight: 1 },
    { filled: true, weight: 1 },
    { filled: true, weight: 1 },
    { filled: true, weight: 1 },
    { filled: true, weight: 1 },
    { filled: true, weight: 3 },
  ] as const;
</script>

<div class="flex items-center gap-1.5 w-full {className}" aria-hidden="true">
  {#each SEGMENTS as seg}
    <div
      class="h-3 rounded-md transition-none {seg.filled ? 'bg-foreground' : 'bg-board-progress-empty'}"
      style="flex: {seg.weight} 1 0%;"
    ></div>
  {/each}
</div>
