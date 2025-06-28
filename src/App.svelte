<script lang="ts">
  import { onMount } from 'svelte';
  import { _ } from 'svelte-i18n';
  import { initI18n } from './i18n';
  import { theme } from './stores/theme';
  import LanguageSelector from './components/ui/LanguageSelector.svelte';
  import ThemeToggle from './components/ui/ThemeToggle.svelte';
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
  let searchTimeout: number | undefined;
  
  // Track current theme
  let currentTheme: 'light' | 'dark';

  // Initialize data when component mounts
  onMount(async () => {
    await initPlantData();
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

  // Watch for changes to search query and filter - optimize with debouncing
  $: filteredPlants = (() => {
    if (isLoading) return [];
    
    // Clear previous timeout
    if (searchTimeout) clearTimeout(searchTimeout);
    
    // For empty search, return immediately
    if (!searchQuery.trim()) {
      const plants = allPlants.map(p => ({ ...p, matches: undefined }));
      return activeFilter === 'all' ? plants : filterPlantsBySafety(plants, activeFilter === 'safe');
    }
    
    // For search queries, use the existing logic
    const searchResults = searchPlants(searchQuery);
    const plantsWithMatches = searchResults.map(result => ({ ...result.item, matches: result.matches }));
    return activeFilter === 'all' ? plantsWithMatches : filterPlantsBySafety(plantsWithMatches, activeFilter === 'safe');
  })();

  // Handle search input changes
  function handleSearch(event: CustomEvent<string>) {
    searchQuery = event.detail;
  }

  // Handle filter changes
  let handleFilterChange = (event: CustomEvent<'all' | 'safe' | 'toxic'>) => {
    activeFilter = event.detail;
  };

  // New: reference to the floating bar for keyboard adjustments
  let floatingBar: HTMLDivElement;

  // New: adjust floating bar bottom when mobile keyboard appears/disappears
  onMount(() => {
    if (typeof window !== 'undefined' && window.visualViewport) {
      const updateBottom = () => {
        // calculate bottom offset relative to visible viewport (keyboard and scroll)
        const bottom = window.innerHeight - (window!.visualViewport!.height + window!.visualViewport!.offsetTop);
        floatingBar.style.bottom = `${Math.max(bottom, 0)}px`;
      };
      // listen to viewport resize (keyboard) and scroll
      window.visualViewport.addEventListener('resize', updateBottom);
      window.visualViewport.addEventListener('scroll', updateBottom);
      updateBottom();
      return () => {
        window!.visualViewport!.removeEventListener('resize', updateBottom);
        window!.visualViewport!.removeEventListener('scroll', updateBottom);
      };
    }
  });
</script>

<main class="min-h-screen w-full pb-24 md:pb-0">
  <!-- Skip to main content link for keyboard users -->
  <a href="#main-content" class="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-green-700 text-white px-4 py-2 rounded-md z-50">
    Skip to main content
  </a>
  
  <!-- Header with title and controls -->
  <header class="bg-white dark:bg-gray-800 shadow-sm sticky top-0 z-10">
    <div class="container mx-auto px-4 py-2 flex flex-col gap-2">
      <!-- Top row with title and theme/language controls -->
      <div class="flex flex-wrap items-center justify-between">
        <div>
          <h1 class="text-xl md:text-2xl font-bold text-green-600 dark:text-green-400">
            {$_('app.title')}
          </h1>
          <p class="hidden md:block text-sm text-gray-600 dark:text-gray-300">
            {$_('app.subtitle')}
          </p>
        </div>
        
        <nav class="flex items-center space-x-2" aria-label="User preferences">
          <ThemeToggle />
          <LanguageSelector />
        </nav>
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
  <section id="main-content" class="container mx-auto px-4 py-6" aria-label="Plant database" tabindex="-1">
    {#if isLoading}
      <p class="text-center text-gray-500 dark:text-gray-400" aria-live="polite">{$_('app.loading')}</p>
    {:else if filteredPlants.length === 0}
      <p class="text-center text-gray-500 dark:text-gray-400" aria-live="polite">{$_('app.noResults')}</p>
    {:else}
      <PlantList plants={filteredPlants} />
    {/if}
  </section>

  <!-- Floating search and filter bar for mobile -->
  <div bind:this={floatingBar} class="md:hidden fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-800 p-4 shadow-lg z-20 flex flex-col gap-3" role="search" aria-label="Mobile search and filter">
    <div class="flex-1">
      <SearchBar value={searchQuery} on:input={handleSearch} />
    </div>
    <div class="flex justify-center">
      <FilterTabs activeFilter={activeFilter} on:change={handleFilterChange} />
    </div>
  </div>
</main>
