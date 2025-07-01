<script lang="ts">
  import { _ } from 'svelte-i18n';

  let { activeFilter = 'all', onchange } = $props();

  function setFilter(filter: 'all' | 'safe' | 'toxic') {
    activeFilter = filter;
    onchange?.({ detail: filter });
  }
</script>

<div class="flex flex-wrap gap-2" role="group" aria-label={$_('ui.filter.group')}>
  <button 
    class="px-4 py-2 text-sm font-medium rounded-lg transition-colors {activeFilter === 'all' 
      ? 'bg-green-700 text-white' 
      : 'bg-gray-200 text-gray-800 hover:bg-gray-300 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600'}"
    onclick={() => setFilter('all')}
    aria-pressed={activeFilter === 'all'}
    aria-label={$_('ui.filter.all')}
  >
    {$_('ui.filter.all')}
  </button>
  
  <button 
    class="px-4 py-2 text-sm font-medium rounded-lg transition-colors {activeFilter === 'safe' 
      ? 'bg-green-700 text-white' 
      : 'bg-gray-200 text-gray-800 hover:bg-gray-300 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600'}"
    onclick={() => setFilter('safe')}
    aria-pressed={activeFilter === 'safe'}
    aria-label={$_('ui.filter.safe')}
  >
    {$_('ui.filter.safe')}
  </button>
  
  <button 
    class="px-4 py-2 text-sm font-medium rounded-lg transition-colors {activeFilter === 'toxic' 
      ? 'bg-red-700 text-white' 
      : 'bg-gray-200 text-gray-800 hover:bg-gray-300 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600'}"
    onclick={() => setFilter('toxic')}
    aria-pressed={activeFilter === 'toxic'}
    aria-label={$_('ui.filter.toxic')}
  >
    {$_('ui.filter.toxic')}
  </button>
</div>