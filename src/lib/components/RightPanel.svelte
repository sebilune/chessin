<script lang="ts">
  import ActionControls from '$lib/components/ActionControls.svelte';
  import MoveHistory from '$lib/components/MoveHistory.svelte';
</script>

<aside class="flex flex-col gap-2 h-full select-none">
  <div class="shrink-0">
    <ActionControls showShortcuts={true} />
  </div>

  <!-- Move History Card with Dynamic Height Expansion (capped at chessboard height) -->
  <div class="flex-1 min-h-0 flex flex-col justify-start overflow-hidden">
    <MoveHistory class="max-h-full" />
  </div>
</aside>
