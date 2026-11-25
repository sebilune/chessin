<script lang="ts">
  import ActionControls from '$lib/components/ActionControls.svelte';
  import MoveHistory from '$lib/components/MoveHistory.svelte';
</script>

<aside class="flex flex-col h-full select-none">
  <div class="shrink-0">
    <ActionControls showShortcuts={true} />
  </div>

  <!-- Move History Card with Dynamic Height Expansion -->
  <div class="flex-1 min-h-0 mt-3 flex flex-col justify-start">
    <MoveHistory class="max-h-full" />
  </div>
</aside>
