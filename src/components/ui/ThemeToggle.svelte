<script lang="ts">
  import { theme, toggleTheme } from '../../stores/theme';
  import { _ } from 'svelte-i18n';
</script>

<button
  on:click={toggleTheme}
  class="flex items-center justify-center p-2 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-green-500"
  aria-label={$_($theme === 'dark' ? 'theme.light' : 'theme.dark')}
  title={$_($theme === 'dark' ? 'theme.light' : 'theme.dark')}
>
  {#if $theme === 'dark'}
    <span aria-hidden="true">☀️</span>
  {:else}
    <span aria-hidden="true">🌙</span>
  {/if}
</button>
