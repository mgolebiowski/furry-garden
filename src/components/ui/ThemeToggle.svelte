<script lang="ts">
  import { theme, toggleTheme } from '../../stores/theme';
  import { _ } from 'svelte-i18n';
</script>

<button
  on:click={toggleTheme}
  class="p-2 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700"
  aria-label="Toggle Theme"
>
  {#if $theme === 'dark'}
    <span>☀️</span>
  {:else}
    <span>🌙</span>
  {/if}
</button>
