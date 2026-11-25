<script lang="ts">
  interface Props {
    value: number;
    onchange: (value: number) => void;
    'aria-label'?: string;
  }

  let { value, onchange, 'aria-label': ariaLabel = 'Volume' }: Props = $props();

  let sliderEl = $state<HTMLDivElement | null>(null);
  let trackEl = $state<HTMLDivElement | null>(null);
  let isDragging = $state(false);

  function updateFromPointer(clientY: number) {
    if (!trackEl) return;
    const rect = trackEl.getBoundingClientRect();
    const ratio = 1 - (clientY - rect.top) / rect.height;
    const next = Math.max(0, Math.min(100, Math.round(ratio * 100)));
    onchange(next);
  }

  function handlePointerDown(e: PointerEvent) {
    if (e.button !== 0 || !sliderEl) return;
    e.preventDefault();
    isDragging = true;
    sliderEl.setPointerCapture(e.pointerId);
    updateFromPointer(e.clientY);
  }

  function handlePointerMove(e: PointerEvent) {
    if (!isDragging) return;
    updateFromPointer(e.clientY);
  }

  function handlePointerUp(e: PointerEvent) {
    if (!isDragging || !sliderEl) return;
    isDragging = false;
    if (sliderEl.hasPointerCapture(e.pointerId)) {
      sliderEl.releasePointerCapture(e.pointerId);
    }
  }

  function handleKeyDown(e: KeyboardEvent) {
    const step = e.shiftKey ? 10 : 5;
    switch (e.key) {
      case 'ArrowUp':
      case 'ArrowRight':
        e.preventDefault();
        e.stopPropagation();
        onchange(Math.min(100, value + step));
        break;
      case 'ArrowDown':
      case 'ArrowLeft':
        e.preventDefault();
        e.stopPropagation();
        onchange(Math.max(0, value - step));
        break;
      case 'Home':
        e.preventDefault();
        e.stopPropagation();
        onchange(0);
        break;
      case 'End':
        e.preventDefault();
        e.stopPropagation();
        onchange(100);
        break;
    }
  }
</script>

<div
  bind:this={sliderEl}
  role="slider"
  tabindex="0"
  aria-label={ariaLabel}
  aria-valuemin={0}
  aria-valuemax={100}
  aria-valuenow={value}
  aria-orientation="vertical"
  class="relative flex justify-center w-6 py-2 cursor-pointer touch-none select-none outline-none group focus-visible:ring-2 focus-visible:ring-ring rounded-full"
  onpointerdown={handlePointerDown}
  onpointermove={handlePointerMove}
  onpointerup={handlePointerUp}
  onpointercancel={handlePointerUp}
  onkeydown={handleKeyDown}
>
  <!-- Track (py-2 on wrapper keeps the 16px thumb inside the slider bounds at 0% and 100%) -->
  <div bind:this={trackEl} class="relative w-2 h-24 rounded-full bg-border">
    <!-- Active fill -->
    <div
      class="absolute inset-x-0 bottom-0 rounded-full bg-primary"
      style="height: {value}%;"
    ></div>

    <!-- Centered Thumb -->
    <div
      class="absolute left-1/2 -translate-x-1/2 translate-y-1/2 size-4 rounded-full border-[3px] border-primary bg-background shadow-xs pointer-events-none"
      style="bottom: {value}%;"
    ></div>
  </div>
</div>
