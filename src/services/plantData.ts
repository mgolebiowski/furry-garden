import type { Plant } from '../types/plant';
import Fuse from 'fuse.js';
import safeJson from '../data/safe.json';
import toxicJson from '../data/toxic.json';

// Load CSV data as text (we'll use fetch since direct imports are causing issues)
async function loadData(): Promise<{safe: Plant[], toxic: Plant[]}> {
  try {
    return {
      safe: safeJson.map(p => ({
        commonName: p.common_name,
        additionalNames: p.additional_names ? p.additional_names.split(',').map(name => name.trim()) : [],
        latinName: p.latin_name,
        family: p.family,
        polishName: p.polish_name,
        isSafe: true
      })),
      toxic: toxicJson.map(p => ({
        commonName: p.common_name,
        additionalNames: p.additional_names ? p.additional_names.split(',').map(name => name.trim()) : [],
        latinName: p.latin_name,
        family: p.family,
        polishName: p.polish_name,
        isSafe: false
      }))
    };
  } catch (error) {
    console.error('Error loading data:', error);
    return { safe: [], toxic: [] };
  }
}



// Create empty initial states
export let safePlants: Plant[] = [];
export let toxicPlants: Plant[] = [];
export let allPlants: Plant[] = [];
export let plantSearchEngine: Fuse<Plant>;

// Initialize plant data
export async function initPlantData(): Promise<void> {
  const { safe, toxic } = await loadData();
  safePlants = safe;
  toxicPlants = toxic;
  allPlants = [...safePlants, ...toxicPlants];
  
  // Configure Fuse.js for fuzzy search
  const fuseOptions: Fuse.IFuseOptions<Plant> = {
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
  
  // Create a Fuse instance for fuzzy search
  plantSearchEngine = new Fuse(allPlants, fuseOptions);
}

// Search plants by query
export function searchPlants(query: string): Fuse.FuseResult<Plant>[] {
  if (!plantSearchEngine || !query.trim()) {
    return allPlants.map(p => ({ item: p, refIndex: 0 }));
  }
  return plantSearchEngine.search(query);
}

// Filter plants by safety
export function filterPlantsBySafety(plants: Plant[], isSafe?: boolean): Plant[] {
  if (isSafe === undefined) return plants;
  return plants.filter(plant => plant.isSafe === isSafe);
}