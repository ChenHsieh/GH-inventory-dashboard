import { PlantInventory, ProcessedPlant, SummaryMetrics, GenotypeCount, StatusCount, BenchCount, MonthlyPlanting } from '@/types/inventory';
import { format, parseISO } from 'date-fns';

export const processPlantData = (data: PlantInventory[]): ProcessedPlant[] => {
  return data.map(plant => ({
    ...plant,
    status: getPlantStatus(plant),
    daysOld: getDaysOld(plant['Original date (date of soil transplanting from TC or cutting)']),
    needsAttention: needsAttention(plant)
  }));
};

export const getPlantStatus = (plant: PlantInventory): 'Active' | 'Cut Back' | 'Killed' => {
  if (plant['Date to killing bench'] || plant['Termination date & composite site temp']) {
    return 'Killed';
  } else if (plant['Date cutback']) {
    return 'Cut Back';
  }
  return 'Active';
};

export const getDaysOld = (plantDate: string): number => {
  if (!plantDate) return 0;
  try {
    const date = parseISO(plantDate);
    const now = new Date();
    return Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
  } catch {
    return 0;
  }
};

export const needsAttention = (plant: PlantInventory): boolean => {
  if (!plant['Original date (date of soil transplanting from TC or cutting)']) return false;
  
  const daysOld = getDaysOld(plant['Original date (date of soil transplanting from TC or cutting)']);
  const status = getPlantStatus(plant);
  
  // Plants older than 60 days without cutback might need attention
  if (status === 'Active' && daysOld > 60) return true;
  
  // Plants that have been cut back but are still active for too long
  if (status === 'Cut Back' && daysOld > 90) return true;
  
  return false;
};

export const calculateSummaryMetrics = (plants: ProcessedPlant[]): SummaryMetrics => {
  const totalPlants = plants.length;
  const uniqueGenotypes = new Set(plants.map(p => p['Standardized name (2nd tag by CJ)'])).size;
  const activePlants = plants.filter(p => p.status === 'Active').length;
  const killedPlants = plants.filter(p => p.status === 'Killed').length;
  const cutBackPlants = plants.filter(p => p.status === 'Cut Back').length;

  return {
    totalPlants,
    uniqueGenotypes,
    activePlants,
    killedPlants,
    cutBackPlants
  };
};

export const getGenotypeDistribution = (plants: ProcessedPlant[]): GenotypeCount[] => {
  const counts = new Map<string, number>();
  
  plants.forEach(plant => {
    const genotype = plant['Standardized name (2nd tag by CJ)'] || 'Unknown';
    counts.set(genotype, (counts.get(genotype) || 0) + 1);
  });

  return Array.from(counts.entries())
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 15);
};

export const getStatusDistribution = (plants: ProcessedPlant[]): StatusCount[] => {
  const statusColors = {
    'Active': '#22c55e',
    'Cut Back': '#f59e0b', 
    'Killed': '#ef4444'
  };

  const counts = new Map<string, number>();
  plants.forEach(plant => {
    counts.set(plant.status, (counts.get(plant.status) || 0) + 1);
  });

  return Array.from(counts.entries())
    .map(([status, count]) => ({
      status,
      count,
      color: statusColors[status as keyof typeof statusColors] || '#6b7280'
    }));
};

export const getBenchDistribution = (plants: ProcessedPlant[]): BenchCount[] => {
  const counts = new Map<string, number>();
  
  plants.forEach(plant => {
    const bench = String(plant['Bench #']) || 'Unknown';
    counts.set(bench, (counts.get(bench) || 0) + 1);
  });

  return Array.from(counts.entries())
    .map(([bench, count]) => ({ bench, count }))
    .sort((a, b) => {
      // Try to sort numerically if possible
      const aNum = parseInt(a.bench);
      const bNum = parseInt(b.bench);
      if (!isNaN(aNum) && !isNaN(bNum)) {
        return aNum - bNum;
      }
      return a.bench.localeCompare(b.bench);
    });
};

export const getPlantingTimeline = (plants: ProcessedPlant[]): MonthlyPlanting[] => {
  const counts = new Map<string, number>();
  
  plants.forEach(plant => {
    const plantDate = plant['Original date (date of soil transplanting from TC or cutting)'];
    if (plantDate) {
      try {
        const date = parseISO(plantDate);
        const monthKey = format(date, 'yyyy-MM');
        counts.set(monthKey, (counts.get(monthKey) || 0) + 1);
      } catch {
        // Skip invalid dates
      }
    }
  });

  return Array.from(counts.entries())
    .map(([month, count]) => ({ month, count }))
    .sort((a, b) => a.month.localeCompare(b.month));
};

export const formatDate = (dateString: string): string => {
  if (!dateString) return 'N/A';
  try {
    return format(parseISO(dateString), 'MMM dd, yyyy');
  } catch {
    return 'Invalid Date';
  }
};

export const cn = (...classes: string[]) => {
  return classes.filter(Boolean).join(' ');
};
