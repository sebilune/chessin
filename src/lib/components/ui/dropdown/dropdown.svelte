<script lang="ts">
  import { onMount, type Snippet } from 'svelte';
  import { cn } from '$lib/utils.js';

  interface Props {
    open?: boolean;
    hoverable?: boolean;
    closeDelay?: number;
    ariaLabel?: string;
    class?: string;
    panelClass?: string;
    preventClose?: () => boolean;
    trigger: Snippet<[{ open: boolean; toggle: () => void; close: () => void }]>;
    children?: Snippet<[{ close: () => void }]>;
    content?: Snippet<[{ close: () => void }]>;
    onopenchange?: (open: boolean) => void;
  }

  let {
    open = $bindable(false),
    hoverable = true,
    closeDelay = 150,
    ariaLabel,
    class: className,
    panelClass,
    preventClose,
    trigger,
    children,
    content,
    onopenchange,
  }: Props = $props();

  let containerEl = $state<HTMLElement | null>(null);
  let isHovered = $state(false);
  let closeTimer: ReturnType<typeof setTimeout> | null = null;
  const dropdownId = Math.random().toString(36).slice(2);

  function clearCloseTimer() {
    if (closeTimer) {
      clearTimeout(closeTimer);
      closeTimer = null;
    }
  }

  function openDropdown() {
    clearCloseTimer();
    if (!open) {
      open = true;
      onopenchange?.(true);
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('chessin:dropdown-open', { detail: dropdownId }));
      }
    }
  }

  function closeDropdown() {
    clearCloseTimer();
    if (open) {
      open = false;
      onopenchange?.(false);
    }
  }

  function scheduleClose() {
    if (preventClose?.()) return;
    clearCloseTimer();
    closeTimer = setTimeout(() => {
      if (!preventClose?.() && !isHovered) {
        closeDropdown();
      }
    }, closeDelay);
  }

  function toggleDropdown() {
    if (open) {
      closeDropdown();
    } else {
      openDropdown();
    }
  }

  function handleOtherDropdownOpen(e: Event) {
    const customEvent = e as CustomEvent<string>;
    if (customEvent.detail !== dropdownId && open) {
      closeDropdown();
    }
  }

  function handlePointerDown(e: PointerEvent) {
    if (!open) return;
    if (preventClose?.()) return;
    const target = e.target as Node | null;
    if (!target || !containerEl) return;
    if (!containerEl.contains(target)) {
      closeDropdown();
    }
  }

  function handleKeyDown(e: KeyboardEvent) {
    if (e.key === 'Escape' && open) {
      closeDropdown();
    }
  }

  onMount(() => {
    window.addEventListener('chessin:dropdown-open', handleOtherDropdownOpen);
    window.addEventListener('pointerdown', handlePointerDown);
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      clearCloseTimer();
      window.removeEventListener('chessin:dropdown-open', handleOtherDropdownOpen);
      window.removeEventListener('pointerdown', handlePointerDown);
      window.removeEventListener('keydown', handleKeyDown);
    };
  });
</script>

<div
  bind:this={containerEl}
  class={cn('relative', className)}
  role="group"
  aria-label={ariaLabel}
  onpointerenter={(e) => {
    if (hoverable && e.pointerType !== 'touch') {
      isHovered = true;
      openDropdown();
    }
  }}
  onpointerleave={(e) => {
    if (hoverable && e.pointerType !== 'touch') {
      isHovered = false;
      scheduleClose();
    }
  }}
  onfocusin={openDropdown}
  onfocusout={(e) => {
    const next = e.relatedTarget as Node | null;
    if (!next || !containerEl?.contains(next)) {
      if (!preventClose?.()) {
        closeDropdown();
      }
    }
  }}
>
  {@render trigger({ open, toggle: toggleDropdown, close: closeDropdown })}

  {#if open}
    <div class="absolute top-full pt-2 left-1/2 -translate-x-1/2 z-50">
      <div
        class={cn(
          'rounded-xl border-4 border-border bg-background text-foreground shadow-xs',
          panelClass
        )}
      >
        {#if content}
          {@render content({ close: closeDropdown })}
        {:else if children}
          {@render children({ close: closeDropdown })}
        {/if}
      </div>
    </div>
  {/if}
</div>
