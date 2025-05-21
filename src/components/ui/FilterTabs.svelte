<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import { _ } from 'svelte-i18n';
  
  export let activeFilter: 'all' | 'safe' | 'toxic' = 'all';
  
  const dispatch = createEventDispatcher<{
    change: 'all' | 'safe' | 'toxic';
  }>();
  
  function setFilter(filter: 'all' | 'safe' | 'toxic') {
    activeFilter = filter;
    dispatch('change', filter);
  }
</script>

<div class="flex flex-wrap gap-2">
  <button 
    class="px-4 py-2 text-sm font-medium rounded-lg transition-colors {activeFilter === 'all' 
      ? 'bg-green-600 text-white' 
      : 'bg-gray-200 text-gray-800 hover:bg-gray-300 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600'}"
    on:click={() => setFilter('all')}
  >
    {$_('ui.filter.all')}
  </button>
  
  <button 
    class="px-4 py-2 text-sm font-medium rounded-lg transition-colors {activeFilter === 'safe' 
      ? 'bg-green-600 text-white' 
      : 'bg-gray-200 text-gray-800 hover:bg-gray-300 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600'}"
    on:click={() => setFilter('safe')}
  >
    {$_('ui.filter.safe')}
  </button>
  
  <button 
    class="px-4 py-2 text-sm font-medium rounded-lg transition-colors {activeFilter === 'toxic' 
      ? 'bg-red-600 text-white' 
      : 'bg-gray-200 text-gray-800 hover:bg-gray-300 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600'}"
    on:click={() => setFilter('toxic')}
  >
    {$_('ui.filter.toxic')}
  </button>
</div>