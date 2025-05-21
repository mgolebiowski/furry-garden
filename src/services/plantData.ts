import type { Plant } from '../types/plant';
import Fuse from 'fuse.js';

// Load CSV data as text (we'll use fetch since direct imports are causing issues)
async function loadCSVData(): Promise<{safe: Plant[], toxic: Plant[]}> {
  try {
    const safeResponse = await fetch('/furry-garden/data/safe.csv');
    const toxicResponse = await fetch('/furry-garden/data/toxic.csv');
    
    if (!safeResponse.ok || !toxicResponse.ok) {
      throw new Error('Failed to load CSV data');
    }
    
    const safeCSV = await safeResponse.text();
    const toxicCSV = await toxicResponse.text();
    
    return {
      safe: parseCSV(safeCSV, true),
      toxic: parseCSV(toxicCSV, false)
    };
  } catch (error) {
    console.error('Error loading CSV data:', error);
    return { safe: [], toxic: [] };
  }
}

// Parse CSV data into Plant objects
function parseCSV(csvData: string, isSafe: boolean): Plant[] {
  const lines = csvData.trim().split('\n');
  const headers = lines[0].split(',');
  
  return lines.slice(1).map(line => {
    // Handle quoted fields with commas inside them
    const matches = line.match(/(".*?"|[^",]+)(?=\s*,|\s*$)/g) || [];
    const values = matches.map(val => val.replace(/^"|"$/g, ''));
    
    const plant: Plant = {
      commonName: values[0] || '',
      additionalNames: values[1] ? values[1].split(',').map(name => name.trim()) : [],
      latinName: values[2] || '',
      family: values[3] || '',
      polishName: values[4] || '',
      isSafe: isSafe
    };
    
    return plant;
  });
}

// Create empty initial states
export let safePlants: Plant[] = [];
export let toxicPlants: Plant[] = [];
export let allPlants: Plant[] = [];
export let plantSearchEngine: Fuse<Plant>;

// Initialize plant data
export async function initPlantData(): Promise<void> {
  const { safe, toxic } = await loadCSVData();
  safePlants = safe;
  toxicPlants = toxic;
  allPlants = [...safePlants, ...toxicPlants];
  
  // Configure Fuse.js for fuzzy search
  const fuseOptions = {
    keys: [
      'commonName',
      'additionalNames',
      'latinName',
      'polishName'
    ],
    threshold: 0.3,
    ignoreLocation: true,
  };
  
  // Create a Fuse instance for fuzzy search
  plantSearchEngine = new Fuse(allPlants, fuseOptions);
}

// Search plants by query
export function searchPlants(query: string): Plant[] {
  if (!plantSearchEngine || !query.trim()) {
    return allPlants;
  }
  return plantSearchEngine.search(query).map(result => result.item);
}

// Filter plants by safety
export function filterPlantsBySafety(plants: Plant[], isSafe?: boolean): Plant[] {
  if (isSafe === undefined) return plants;
  return plants.filter(plant => plant.isSafe === isSafe);
}