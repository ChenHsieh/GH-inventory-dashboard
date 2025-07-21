'use client';

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { StatusCount } from '@/types/inventory';

interface StatusChartProps {
  data: StatusCount[];
}

export default function StatusChart({ data }: StatusChartProps) {
  if (!data || data.length === 0) {
    return (
      <div className="chart-container">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">🎯 Plant Status Overview</h3>
        <div className="flex items-center justify-center h-64">
          <p className="text-gray-500">No data available</p>
        </div>
      </div>
    );
  }

  return (
    <div className="chart-container">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">🎯 Plant Status Overview</h3>
      <ResponsiveContainer width="100%" height={400}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            outerRadius={120}
            fill="#8884d8"
            dataKey="count"
            label={({ status, count }) => `${status}: ${count}`}
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
