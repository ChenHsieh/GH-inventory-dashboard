'use client';

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { GenotypeCount } from '@/types/inventory';

interface GenotypeChartProps {
  data: GenotypeCount[];
}

export default function GenotypeChart({ data }: GenotypeChartProps) {
  if (!data || data.length === 0) {
    return (
      <div className="chart-container">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">📊 Genotype Distribution</h3>
        <div className="flex items-center justify-center h-64">
          <p className="text-gray-500">No data available</p>
        </div>
      </div>
    );
  }

  return (
    <div className="chart-container">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">📊 Top 15 Genotypes by Plant Count</h3>
      <ResponsiveContainer width="100%" height={400}>
        <BarChart
          data={data}
          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
          layout="horizontal"
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis type="number" />
          <YAxis 
            type="category" 
            dataKey="name" 
            width={150}
            tick={{ fontSize: 12 }}
          />
          <Tooltip />
          <Bar dataKey="count" fill="#3b82f6" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
