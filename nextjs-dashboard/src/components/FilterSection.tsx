'use client';

import { DashboardFilters } from '@/types/inventory';

interface FilterSectionProps {
  filters: DashboardFilters;
  onFiltersChange: (filters: DashboardFilters) => void;
  genotypes: string[];
  statuses: string[];
  benches: string[];
}

export default function FilterSection({ 
  filters, 
  onFiltersChange, 
  genotypes, 
  statuses, 
  benches 
}: FilterSectionProps) {
  const updateFilter = (key: keyof DashboardFilters, value: string) => {
    onFiltersChange({
      ...filters,
      [key]: value
    });
  };

  return (
    <div className="filter-card mb-8">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">🔍 Filters</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label htmlFor="genotype" className="block text-sm font-medium text-gray-700 mb-2">
            Genotype
          </label>
          <select
            id="genotype"
            value={filters.genotype}
            onChange={(e) => updateFilter('genotype', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="All">All Genotypes</option>
            {genotypes.map(genotype => (
              <option key={genotype} value={genotype}>{genotype}</option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-2">
            Status
          </label>
          <select
            id="status"
            value={filters.status}
            onChange={(e) => updateFilter('status', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="All">All Statuses</option>
            {statuses.map(status => (
              <option key={status} value={status}>{status}</option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="bench" className="block text-sm font-medium text-gray-700 mb-2">
            Bench
          </label>
          <select
            id="bench"
            value={filters.bench}
            onChange={(e) => updateFilter('bench', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="All">All Benches</option>
            {benches.map(bench => (
              <option key={bench} value={bench}>{bench}</option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}
