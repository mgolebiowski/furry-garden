<script lang="ts">
  import type { Plant } from '../../types/plant';
  import PlantCard from './PlantCard.svelte';
  import { _ } from 'svelte-i18n';

  export let plants: Plant[] = [];
</script>

<div class="w-full">
  {#if plants.length === 0}
    <div class="p-8 text-center text-gray-600 dark:text-gray-400">
      <p>{$_('plant.noResults')}</p>
    </div>
  {:else}
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 min-h-[600px]">
      {#each plants as plant}
        <PlantCard {plant} />
      {/each}
    </div>
  {/if}
</div>