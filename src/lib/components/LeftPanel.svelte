<script lang="ts">
  import { game } from '$lib/game/gameStore.svelte';
  import { getLevelName, i18n, m } from '$lib/i18n.svelte';
  import LevelNavigation from '$lib/components/LevelNavigation.svelte';
</script>

<aside class="flex flex-col justify-between h-full select-none">
  <!-- Top: Level Name, Counter, and Navigation -->
  <div class="space-y-4">
    <div class="space-y-1.5 w-full">
      <h2
        class="text-4xl lg:text-5xl xl:text-[3.5rem] font-black tracking-tight text-foreground leading-[1.05] hyphens-auto break-words [overflow-wrap:anywhere]"
        lang={i18n.locale}
      >
        {getLevelName(game.currentLevel.id, game.currentLevel.name)}
      </h2>

      <span class="text-sm sm:text-base font-bold text-muted-foreground uppercase tracking-wider block">
        {m.puzzle_counter({ current: String(game.currentLevel.id).padStart(2, '0'), total: String(game.totalLevels) }, { locale: i18n.locale })}
      </span>
    </div>

    <LevelNavigation class="pt-1" />
  </div>
</aside>
