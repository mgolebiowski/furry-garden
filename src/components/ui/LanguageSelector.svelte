<script lang="ts">
  import { locale, _ } from 'svelte-i18n';
  
  function toggleLanguage() {
    $locale = $locale === 'en' ? 'pl-PL' : 'en';
    localStorage.setItem('locale', $locale);
  }
</script>

<button 
  class="flex items-center justify-center p-2 rounded-full bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors focus:outline-none focus:ring-2 focus:ring-green-500"
  on:click={toggleLanguage} 
  aria-label="{$_('ui.language')}: {$locale === 'en' ? 'Switch to Polish' : 'Switch to English'}"
  title="{$_('ui.language')}: {$locale === 'en' ? 'Switch to Polish' : 'Switch to English'}"
>
  <span class="font-medium text-sm" aria-hidden="true">{$locale === 'en' ? 'PL' : 'EN'}</span>
</button>