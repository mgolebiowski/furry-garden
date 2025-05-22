<script lang="ts">
  import type { Plant } from '../../types/plant';
  import { _ } from 'svelte-i18n';
  import { locale } from 'svelte-i18n';

  export let plant: Plant;
  
  // Format additional names for display
  $: additionalNames = plant.additionalNames && plant.additionalNames.length
    ? plant.additionalNames.join(', ')
    : '';
</script>

<div class="max-w-full bg-white border rounded-lg shadow-sm dark:bg-gray-800 dark:border-gray-700 overflow-hidden">
  <div class="p-4">
    <div class="flex items-center justify-between mb-2">
      <h3 class="text-xl font-bold text-gray-900 dark:text-white">
        {#if $locale === 'pl-PL' && plant.polishName}
          {plant.polishName}
        {:else}
          {plant.commonName}
        {/if}
        
      </h3>
      
      <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium {plant.isSafe 
        ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' 
        : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'}">
        {plant.isSafe ? $_('plant.safe') : $_('plant.toxic')}
      </span>
    </div>
    
    {#if additionalNames}
      <p class="text-sm text-gray-600 dark:text-gray-400 mb-2">
        <span class="font-medium">{$_('plant.additionalNames')}: </span>
        {additionalNames}
      </p>
    {/if}
    
    <p class="text-sm text-gray-600 dark:text-gray-400 mb-2 italic">
      <span class="font-medium not-italic">{$_('plant.latinName')}: </span>
      {plant.latinName}
    </p>
    
    <p class="text-sm text-gray-600 dark:text-gray-400 mb-2">
      <span class="font-medium">{$_('plant.family')}: </span>
      {plant.family}
    </p>
  </div>
</div>