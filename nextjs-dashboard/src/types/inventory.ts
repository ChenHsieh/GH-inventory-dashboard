// Plant inventory types based on your Streamlit app structure
export interface PlantInventory {
  id?: number;
  'Plant #': number;
  'Group': string;
  'Standardized name (2nd tag by CJ)': string;
  'Bench #': string | number;
  'Original date (date of soil transplanting from TC or cutting)': string;
  'Date cutback'?: string;
  'Date to killing bench'?: string;
  'Termination date & composite site temp'?: string;
  'Parent plant (for cuttings)'?: string;
  'Other notes'?: string;
}

export interface ProcessedPlant extends PlantInventory {
  status: 'Active' | 'Cut Back' | 'Killed';
  daysOld: number;
  needsAttention: boolean;
}

export interface DashboardFilters {
  genotype: string;
  status: string;
  bench: string;
}

export interface SummaryMetrics {
  totalPlants: number;
  uniqueGenotypes: number;
  activePlants: number;
  killedPlants: number;
  cutBackPlants: number;
}

export interface GenotypeCount {
  name: string;
  count: number;
}

export interface StatusCount {
  status: string;
  count: number;
  color: string;
}

export interface BenchCount {
  bench: string;
  count: number;
}

export interface MonthlyPlanting {
  month: string;
  count: number;
}
