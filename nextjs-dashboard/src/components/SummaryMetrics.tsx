'use client';

import { SummaryMetrics } from '@/types/inventory';
import { TrendingUp, Users, Activity, AlertTriangle } from 'lucide-react';

interface MetricCardProps {
  title: string;
  value: number;
  icon: React.ReactNode;
  color: string;
}

const MetricCard = ({ title, value, icon, color }: MetricCardProps) => (
  <div className="metric-card">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm font-medium text-gray-600">{title}</p>
        <p className="text-2xl font-bold text-gray-900">{value.toLocaleString()}</p>
      </div>
      <div className={`p-3 rounded-full ${color}`}>
        {icon}
      </div>
    </div>
  </div>
);

interface SummaryMetricsProps {
  metrics: SummaryMetrics;
}

export default function SummaryMetricsComponent({ metrics }: SummaryMetricsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <MetricCard
        title="Total LSG Plants"
        value={metrics.totalPlants}
        icon={<TrendingUp className="w-6 h-6 text-white" />}
        color="bg-blue-500"
      />
      <MetricCard
        title="Unique Genotypes"
        value={metrics.uniqueGenotypes}
        icon={<Users className="w-6 h-6 text-white" />}
        color="bg-purple-500"
      />
      <MetricCard
        title="Active Plants"
        value={metrics.activePlants}
        icon={<Activity className="w-6 h-6 text-white" />}
        color="bg-green-500"
      />
      <MetricCard
        title="Killed Plants"
        value={metrics.killedPlants}
        icon={<AlertTriangle className="w-6 h-6 text-white" />}
        color="bg-red-500"
      />
    </div>
  );
}
