'use client';

import { useState, useEffect } from 'react';
import { PlantInventory, ProcessedPlant, DashboardFilters } from '@/types/inventory';
import { fetchPlantInventory } from '@/lib/supabase';
import { 
  processPlantData, 
  calculateSummaryMetrics,
  getGenotypeDistribution,
  getStatusDistribution,
  getBenchDistribution
} from '@/lib/utils';

import SummaryMetrics from '@/components/SummaryMetrics';
import FilterSection from '@/components/FilterSection';
import GenotypeChart from '@/components/GenotypeChart';
import StatusChart from '@/components/StatusChart';
import PlantTable from '@/components/PlantTable';

export default function Dashboard() {
  const [allPlants, setAllPlants] = useState<ProcessedPlant[]>([]);
  const [filteredPlants, setFilteredPlants] = useState<ProcessedPlant[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [dataSource, setDataSource] = useState<string>('Unknown');
  
  const [filters, setFilters] = useState<DashboardFilters>({
    genotype: 'All',
    status: 'All',
    bench: 'All'
  });

  // Load data on component mount
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const rawData = await fetchPlantInventory();
        const processedData = processPlantData(rawData);
        setAllPlants(processedData);
        setDataSource('Supabase Database');
      } catch (err) {
        console.error('Failed to load data:', err);
        setError('Failed to load plant inventory data. Please check your connection.');
        setDataSource('Error');
        // You could implement a fallback to local CSV data here
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  // Apply filters whenever plants or filters change
  useEffect(() => {
    let filtered = allPlants;

    if (filters.genotype !== 'All') {
      filtered = filtered.filter(plant => 
        plant['Standardized name (2nd tag by CJ)'] === filters.genotype
      );
    }

    if (filters.status !== 'All') {
      filtered = filtered.filter(plant => plant.status === filters.status);
    }

    if (filters.bench !== 'All') {
      filtered = filtered.filter(plant => 
        String(plant['Bench #']) === filters.bench
      );
    }

    setFilteredPlants(filtered);
  }, [allPlants, filters]);

  // Get unique values for filter options
  const uniqueGenotypes = Array.from(
    new Set(allPlants.map(p => p['Standardized name (2nd tag by CJ)']).filter(Boolean))
  ).sort();

  const uniqueStatuses = Array.from(
    new Set(allPlants.map(p => p.status))
  ).sort();

  const uniqueBenches = Array.from(
    new Set(allPlants.map(p => String(p['Bench #'])).filter(Boolean))
  ).sort((a, b) => {
    const aNum = parseInt(a);
    const bNum = parseInt(b);
    if (!isNaN(aNum) && !isNaN(bNum)) {
      return aNum - bNum;
    }
    return a.localeCompare(b);
  });

  // Calculate metrics and chart data
  const metrics = calculateSummaryMetrics(filteredPlants);
  const genotypeData = getGenotypeDistribution(filteredPlants);
  const statusData = getStatusDistribution(filteredPlants);
  const benchData = getBenchDistribution(filteredPlants);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-lg text-gray-600">Loading plant inventory...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Error Loading Data</h1>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            🌱 LSG Project Plant Inventory Dashboard
          </h1>
          <p className="text-xl text-gray-600 mb-4">
            Comprehensive analysis of plant genotypes and their management status
          </p>
          <div className="text-sm text-gray-500">
            <span className="font-medium">📊 Data Source:</span> 
            {dataSource === 'Supabase Database' && (
              <span className="text-green-600"> 🌐 Supabase Database (Real-time)</span>
            )}
            {dataSource === 'Error' && (
              <span className="text-red-600"> ❌ Connection Error</span>
            )}
          </div>
        </div>

        {/* Summary Metrics */}
        <SummaryMetrics metrics={metrics} />

        {/* Filters */}
        <FilterSection
          filters={filters}
          onFiltersChange={setFilters}
          genotypes={uniqueGenotypes}
          statuses={uniqueStatuses}
          benches={uniqueBenches}
        />

        {/* Charts */}
        {filteredPlants.length > 0 ? (
          <>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
              <GenotypeChart data={genotypeData} />
              <StatusChart data={statusData} />
            </div>

            {/* Plant Table */}
            <PlantTable plants={filteredPlants} />
          </>
        ) : (
          <div className="chart-container text-center py-12">
            <p className="text-gray-500 text-lg">
              No plants match the selected filters. Please adjust your filter criteria.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
