import type { FuseResult } from 'fuse.js';

export interface Plant {
  commonName: string;
  link: string;
  additionalNames: string[];
  latinName: string;
  family: string;
  polishName: string;
  isSafe: boolean;
  matches?: FuseResult<Plant>['matches'];
}