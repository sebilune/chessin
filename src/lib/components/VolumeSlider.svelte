<script lang="ts">
  import { Slider } from 'bits-ui';

  interface Props {
    value: number;
    onchange: (value: number) => void;
    ondragchange?: (dragging: boolean) => void;
    'aria-label'?: string;
  }

  let {
    value,
    onchange,
    ondragchange,
    'aria-label': ariaLabel = 'Volume',
  }: Props = $props();
</script>

<Slider.Root
  type="single"
  orientation="vertical"
  min={0}
  max={100}
  step={1}
  {value}
  onValueChange={onchange}
  onValueCommit={() => ondragchange?.(false)}
  onpointerdown={() => ondragchange?.(true)}
  aria-label={ariaLabel}
  class="relative flex justify-center w-6 h-28 py-2 cursor-pointer touch-none select-none outline-none group focus-visible:ring-2 focus-visible:ring-ring rounded-full"
>
  <span class="relative w-2 h-full rounded-full bg-border">
    <Slider.Range class="absolute inset-x-0 bottom-0 rounded-full bg-primary" />
  </span>
  <Slider.Thumb
    index={0}
    class="block size-4 rounded-full border-[3px] border-primary bg-background shadow-xs outline-none focus-visible:ring-2 focus-visible:ring-ring"
  />
</Slider.Root>
