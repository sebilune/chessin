<script lang="ts">
  import { mountIcon, type IconData, type MountedIcon } from '@animateicons/vanilla';

  interface Props {
    icon: IconData;
    size?: number;
    color?: string;
    class?: string;
    duration?: number;
    strokeWidth?: number;
    triggerParent?: boolean;
    autoplay?: boolean;
  }

  let {
    icon,
    size = 22,
    color = 'currentColor',
    class: className = '',
    duration = 1,
    strokeWidth = 2.25,
    triggerParent = true,
    autoplay = false,
  }: Props = $props();

  let hostEl = $state<HTMLSpanElement | null>(null);

  $effect(() => {
    if (!hostEl) return;

    let mounted: MountedIcon | null = null;
    let parentCleanup: (() => void) | null = null;

    mounted = mountIcon(hostEl, icon, {
      size,
      color,
      duration,
    });

    const svg = hostEl.querySelector('svg');
    if (svg) {
      // Mark with size-full to prevent Button's [&_svg:not([class*='size-'])]:size-4 from forcing 16px
      svg.classList.add('size-full');
      if (strokeWidth) {
        svg.setAttribute('stroke-width', String(strokeWidth));
      }
    }

    if (autoplay) {
      requestAnimationFrame(() => {
        mounted?.startAnimation();
      });
    }

    if (triggerParent) {
      const parent = hostEl.closest('button, a, [role="button"]');
      if (parent && parent !== hostEl) {
        const onEnter = () => {
          if (parent instanceof HTMLButtonElement && parent.disabled) return;
          mounted?.startAnimation();
        };
        const onLeave = () => {
          mounted?.stopAnimation();
        };
        parent.addEventListener('mouseenter', onEnter);
        parent.addEventListener('mouseleave', onLeave);
        parentCleanup = () => {
          parent.removeEventListener('mouseenter', onEnter);
          parent.removeEventListener('mouseleave', onLeave);
        };
      }
    }

    return () => {
      mounted?.destroy();
      parentCleanup?.();
    };
  });
</script>

<span
  bind:this={hostEl}
  class="inline-flex shrink-0 items-center justify-center {className}"
  style="width: {size}px; height: {size}px;"
  aria-hidden="true"
></span>
