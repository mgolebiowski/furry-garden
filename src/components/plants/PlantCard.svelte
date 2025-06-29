<script lang="ts">
  import type { Plant } from '../../types/plant';
  import { _ } from 'svelte-i18n';
  import { locale } from 'svelte-i18n';
  import HighlightedText from '../ui/HighlightedText.svelte';

  export let plant: Plant;
  
  let expanded = false;

  // Format additional names for display
  $: additionalNames = plant.additionalNames && plant.additionalNames.length
    ? plant.additionalNames.join(', ')
    : '';
</script>

<div class="max-w-full bg-white border rounded-lg shadow-sm dark:bg-gray-800 dark:border-gray-700 overflow-hidden" role="article" aria-labelledby="plant-name-{plant.latinName}">
  <button on:click={() => expanded = !expanded} class="w-full text-left p-4">
    <div class="flex items-center justify-between mb-2 min-h-[28px]">
      <h2 id="plant-name-{plant.latinName}" class="text-xl font-bold text-gray-900 dark:text-white min-h-[28px]">
        {#if $locale === 'pl-PL' && plant.polishName}
          {#if plant.matches && plant.matches.find(m => m.key === 'polishName')}
            <HighlightedText text={plant.polishName} indices={plant.matches.find(m => m.key === 'polishName')?.indices || []} />
          {:else}
            {plant.polishName}
          {/if}
        {:else if plant.commonName}
          {#if plant.matches && plant.matches.find(m => m.key === 'commonName')}
            <HighlightedText text={plant.commonName} indices={plant.matches.find(m => m.key === 'commonName')?.indices || []} />
          {:else}
            {plant.commonName}
          {/if}
        {:else}
          &nbsp; <!-- Non-breaking space to maintain height -->
        {/if}
      </h2>
      
      <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium {plant.isSafe 
        ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' 
        : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'}">
        {plant.isSafe ? '✅' : '☠️'} {plant.isSafe ? $_('plant.safe') : $_('plant.toxic')}
      </span>
    </div>
  </button>
  
  {#if expanded}
    <div class="p-4 border-t border-gray-200 dark:border-gray-700">
      {#if additionalNames}
        <p class="text-sm text-gray-600 dark:text-gray-400 mb-2 min-h-[20px]">
          <span class="font-medium">{$_('plant.additionalNames')}: </span>
          {#if plant.matches && plant.matches.find(m => m.key === 'additionalNames')}
            <HighlightedText text={additionalNames} indices={plant.matches.find(m => m.key === 'additionalNames')?.indices || []} />
          {:else}
            {additionalNames}
          {/if}
        </p>
      {:else}
        <p class="text-sm text-gray-600 dark:text-gray-400 mb-2 min-h-[20px]">&nbsp;</p>
      {/if}
      
      <p class="text-sm text-gray-600 dark:text-gray-400 mb-2 italic">
        <span class="font-medium not-italic">{$_('plant.latinName')}: </span>
        {#if plant.matches && plant.matches.find(m => m.key === 'latinName')}
          <HighlightedText text={plant.latinName} indices={plant.matches.find(m => m.key === 'latinName')?.indices || []} />
        {:else}
          {plant.latinName}
        {/if}
      </p>
      
      <p class="text-sm text-gray-600 dark:text-gray-400 mb-2">
        <span class="font-medium">{$_('plant.family')}: </span>
        {plant.family}
      </p>
    </div>
  {/if}
</div>