import type { Plant } from '../types/plant';
import Fuse, { type FuseResult, type IFuseOptions } from 'fuse.js';
import safeJson from '../data/safe.json';
import toxicJson from '../data/toxic.json';

// Cache for data loading
let dataCache: {safe: Plant[], toxic: Plant[]} | null = null;
let loadingPromise: Promise<{safe: Plant[], toxic: Plant[]}> | null = null;

// Helper function to safely map plant data
function mapPlantData(data: any[], isSafe: boolean): Plant[] {
  return data.map(p => ({
    commonName: p.common_name || '',
    link: p.link || '',
    additionalNames: p.additional_names 
      ? p.additional_names.split(',').map((name: string) => name.trim()).filter(Boolean)
      : [],
    latinName: p.latin_name || '',
    family: p.family || '',
    polishName: p.polish_name || '',
    isSafe
  })).filter(plant => plant.commonName || plant.latinName); // Filter out invalid entries
}

// Load CSV data as text (we'll use fetch since direct imports are causing issues)
async function loadData(): Promise<{safe: Plant[], toxic: Plant[]}> {
  // Return cached data if available
  if (dataCache) {
    return dataCache;
  }
  
  // Return existing promise if already loading
  if (loadingPromise) {
    return loadingPromise;
  }
  
  loadingPromise = (async () => {
    try {
      const result = {
        safe: mapPlantData(safeJson, true),
        toxic: mapPlantData(toxicJson, false)
      };
      
      // Cache the result
      dataCache = result;
      return result;
    } catch (error) {
      console.error('Error loading data:', error);
      const fallback = { safe: [], toxic: [] };
      dataCache = fallback;
      return fallback;
    } finally {
      loadingPromise = null;
    }
  })();
  
  return loadingPromise;
}

// Create empty initial states
export let safePlants: Plant[] = [];
export let toxicPlants: Plant[] = [];
export let allPlants: Plant[] = [];
export let plantSearchEngine: Fuse<Plant>;

// Configure Fuse.js options
const fuseOptions: IFuseOptions<Plant> = {
  keys: [
    'commonName',
    'additionalNames',
    'latinName',
    'polishName'
  ],
  threshold: 0.3,
  ignoreLocation: true,
  includeMatches: true,
};

// Initialize with empty data first
plantSearchEngine = new Fuse([], fuseOptions);

// Initialize plant data
export async function initPlantData(): Promise<void> {
  const { safe, toxic } = await loadData();
  safePlants = safe;
  toxicPlants = toxic;
  allPlants = [...safePlants, ...toxicPlants];
  
  // Update the search engine with loaded data
  plantSearchEngine = new Fuse(allPlants, fuseOptions);
}

// Search plants by query
export function searchPlants(query: string): FuseResult<Plant>[] {
  if (!query.trim()) {
    return allPlants.map((item, refIndex) => ({ item, refIndex }));
  }
  return plantSearchEngine.search(query);
}

// Filter plants by safety
export function filterPlantsBySafety(plants: Plant[], isSafe?: boolean): Plant[] {
  if (isSafe === undefined) return plants;
  return plants.filter(plant => plant.isSafe === isSafe);
}