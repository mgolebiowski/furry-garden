<script lang="ts">
  import { onMount } from 'svelte';
  import { _ } from 'svelte-i18n';
  import { initI18n } from './i18n';
  import { theme } from './stores/theme';
  import LanguageSelector from './components/ui/LanguageSelector.svelte';
  import SearchBar from './components/ui/SearchBar.svelte';
  import FilterTabs from './components/ui/FilterTabs.svelte';
  import PlantList from './components/plants/PlantList.svelte';
  import { allPlants, searchPlants, filterPlantsBySafety, initPlantData } from './services/plantData';
  import type { Plant } from './types/plant';

  // Initialize i18n
  initI18n();

  // Search and filter state
  let searchQuery = '';
  let activeFilter: 'all' | 'safe' | 'toxic' = 'all';
  let filteredPlants: Plant[] = [];
  let isLoading = true;
  
  // Track current theme
  let currentTheme: 'light' | 'dark';

  // Initialize data when component mounts
  onMount(async () => {
    await initPlantData();
    updateFilteredPlants();
    isLoading = false;
  });
  
  // Subscribe to theme changes
  theme.subscribe(value => {
    currentTheme = value;
    if (typeof document !== 'undefined') {
      if (value === 'dark') {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    }
  });

  // Function to update filtered plants based on search and filter
  function updateFilteredPlants() {
    const searchResults = searchQuery.trim() 
      ? searchPlants(searchQuery) 
      : allPlants;
    
    filteredPlants = activeFilter === 'all' 
      ? searchResults 
      : filterPlantsBySafety(searchResults, activeFilter === 'safe');
  }

  // Watch for changes to search query and filter
  $: if (!isLoading && (searchQuery || activeFilter)) {
    updateFilteredPlants();
  }

  // Handle search input changes
  function handleSearch(event: CustomEvent<string>) {
    searchQuery = event.detail;
  }

  // Handle filter changes
  function handleFilterChange(event: CustomEvent<'all' | 'safe' | 'toxic'>) {
    activeFilter = event.detail;
  }
</script>

<main class="min-h-screen w-full pb-24 md:pb-0">
  <!-- Header with title and controls -->
  <header class="bg-white dark:bg-gray-800 shadow-sm sticky top-0 z-10">
    <div class="container mx-auto px-4 py-4 flex flex-col gap-4">
      <!-- Top row with title and theme/language controls -->
      <div class="flex flex-wrap items-center justify-between">
        <div>
          <h1 class="text-2xl md:text-3xl font-bold text-green-600 dark:text-green-400">
            {$_('app.title')}
          </h1>
          <p class="text-sm text-gray-600 dark:text-gray-300">
            {$_('app.subtitle')}
          </p>
        </div>
        
        <div class="flex items-center space-x-2">
          <LanguageSelector />
        </div>
      </div>
      
      <!-- Search and filters - Desktop -->
      <div class="hidden md:flex flex-col md:flex-row gap-4">
        <div class="flex-1">
          <SearchBar value={searchQuery} on:input={handleSearch} />
        </div>
        <div class="flex justify-start md:justify-end">
          <FilterTabs activeFilter={activeFilter} on:change={handleFilterChange} />
        </div>
      </div>
    </div>
  </header>

  <!-- Plant list -->
  <div class="container mx-auto px-4 py-6">
    {#if isLoading}
      <p class="text-center text-gray-500 dark:text-gray-400">{$_('app.loading')}</p>
    {:else if filteredPlants.length === 0}
      <p class="text-center text-gray-500 dark:text-gray-400">{$_('app.noResults')}</p>
    {:else}
      <PlantList plants={filteredPlants} />
    {/if}
  </div>

  <!-- Floating search and filter bar for mobile -->
  <div class="md:hidden fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-800 p-4 shadow-lg z-20 flex flex-col gap-3">
    <div class="flex-1">
      <SearchBar value={searchQuery} on:input={handleSearch} />
    </div>
    <div class="flex justify-center">
      <FilterTabs activeFilter={activeFilter} on:change={handleFilterChange} />
    </div>
  </div>
</main>
