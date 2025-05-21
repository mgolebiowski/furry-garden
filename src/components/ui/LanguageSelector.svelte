<script lang="ts">
  import { locale, _ } from 'svelte-i18n';
  
  function toggleLanguage() {
    $locale = $locale === 'en' ? 'pl' : 'en';
    localStorage.setItem('locale', $locale);
  }
</script>

<button 
  class="flex items-center justify-center p-2 rounded-full bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
  on:click={toggleLanguage} 
  aria-label={$_('ui.language')}
>
  <span class="font-medium text-sm">{$locale === 'en' ? 'PL' : 'EN'}</span>
</button>