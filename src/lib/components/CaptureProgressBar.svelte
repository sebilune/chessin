<script lang="ts">
  interface Props {
    totalCaptures: number;
    capturesCompleted: number;
    class?: string;
  }

  let { totalCaptures, capturesCompleted, class: className = 'mt-3 px-1' }: Props = $props();
</script>

<div class="flex items-center gap-1.5 w-full {className}">
  {#each Array(Math.max(0, totalCaptures)) as _, idx}
    {@const isFilled = idx < capturesCompleted}
    <div
      class="h-3 flex-1 rounded-md transition-none {isFilled ? 'bg-foreground' : 'bg-board-progress-empty'}"
    ></div>
  {/each}
</div>
