<script lang="ts">
  import type { Plant } from '../../types/plant';
  import PlantCard from './PlantCard.svelte';
  import { _ } from 'svelte-i18n';
  import { onMount, onDestroy } from 'svelte';

  export let plants: Plant[] = [];

  const PLANTS_PER_LOAD = 20;
  let visiblePlantsCount = PLANTS_PER_LOAD;
  let loadingMore = false;
  let observer: IntersectionObserver;
  let loadMoreTarget: HTMLDivElement;

  // Reactive statement to reset visiblePlantsCount when plants prop changes
  $: if (plants) {
    visiblePlantsCount = PLANTS_PER_LOAD;
    loadingMore = false;
  }

  // Function to load more plants
  function loadMorePlants() {
    if (loadingMore || visiblePlantsCount >= plants.length) {
      return;
    }
    loadingMore = true;
    // Simulate a delay for loading, in a real app this might be an API call
    setTimeout(() => {
      visiblePlantsCount += PLANTS_PER_LOAD;
      loadingMore = false;
    }, 300);
  }

  onMount(() => {
    observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          loadMorePlants();
        }
      },
      { threshold: 1.0 }
    );

    if (loadMoreTarget) {
      observer.observe(loadMoreTarget);
    }
  });

  onDestroy(() => {
    if (observer) {
      observer.disconnect();
    }
  });
</script>

<div class="w-full">
  {#if plants.length === 0}
    <div class="p-8 text-center text-gray-600 dark:text-gray-400">
      <p>{$_('plant.noResults')}</p>
    </div>
  {:else}
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 min-h-[600px]">
      {#each plants.slice(0, visiblePlantsCount) as plant (`${plant.commonName || ''}-${plant.latinName || ''}-${plant.family || ''}-${plant.polishName || ''}-${plant.isSafe}`)}
        <PlantCard {plant} />
      {/each}
    </div>

    {#if visiblePlantsCount < plants.length}
      <div bind:this={loadMoreTarget} class="flex justify-center py-4">
        {#if loadingMore}
          <p class="text-gray-500 dark:text-gray-400">Loading more plants...</p>
        {:else}
          <!-- Optional: A button to manually load more if observer fails or for UX -->
          <button on:click={loadMorePlants} class="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">
            Load More
          </button>
        {/if}
      </div>
    {/if}
  {/if}
</div>
