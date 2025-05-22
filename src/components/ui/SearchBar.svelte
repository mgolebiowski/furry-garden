<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import { _ } from 'svelte-i18n';

  export let value = '';
  
  const dispatch = createEventDispatcher<{
    input: string;
  }>();
  
  function handleInput(event: Event) {
    const target = event.target as HTMLInputElement;
    value = target.value;
    dispatch('input', value);
  }
</script>

<div class="relative w-full">
  <div class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
    <svg class="w-4 h-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
      <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"/>
    </svg>
  </div>
  <input
    type="search"
    class="w-full p-3 pl-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-white focus:ring-green-500 focus:border-green-500 dark:bg-gray-800 dark:border-gray-600 dark:text-white dark:focus:ring-green-600 dark:focus:border-green-600 text-base"
    placeholder={$_('ui.search')}
    {value}
    on:input={handleInput}
  />
</div>