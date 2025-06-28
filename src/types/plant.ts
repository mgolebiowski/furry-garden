import type { FuseResult } from 'fuse.js';

export interface Plant {
  commonName: string;
  additionalNames: string[];
  latinName: string;
  family: string;
  polishName: string;
  isSafe: boolean;
  matches?: readonly FuseResult<Plant>['matches'];
}