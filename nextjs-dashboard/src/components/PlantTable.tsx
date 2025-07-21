'use client';

import { ProcessedPlant } from '@/types/inventory';
import { formatDate, cn } from '@/lib/utils';

interface PlantTableProps {
  plants: ProcessedPlant[];
}

export default function PlantTable({ plants }: PlantTableProps) {
  if (!plants || plants.length === 0) {
    return (
      <div className="chart-container">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">📋 Plant Inventory Data</h3>
        <div className="flex items-center justify-center py-12">
          <p className="text-gray-500">No plants match the selected filters</p>
        </div>
      </div>
    );
  }

  const getStatusClassName = (status: string) => {
    switch (status) {
      case 'Active':
        return 'status-active';
      case 'Cut Back':
        return 'status-cutback';
      case 'Killed':
        return 'status-killed';
      default:
        return 'bg-gray-100 text-gray-800 px-2 py-1 rounded-full text-sm font-medium';
    }
  };

  return (
    <div className="chart-container">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">📋 Plant Inventory Data</h3>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Plant #
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Genotype
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Bench
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Plant Date
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Days Old
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Parent Plant
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Notes
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {plants.map((plant, index) => (
              <tr key={plant.id || index} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {plant['Plant #']}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {plant['Standardized name (2nd tag by CJ)'] || 'N/A'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {plant['Bench #'] || 'N/A'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {formatDate(plant['Original date (date of soil transplanting from TC or cutting)'])}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={getStatusClassName(plant.status)}>
                    {plant.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {plant.daysOld}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {plant['Parent plant (for cuttings)'] || 'N/A'}
                </td>
                <td className="px-6 py-4 text-sm text-gray-900 max-w-xs truncate">
                  {plant['Other notes'] || 'N/A'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
