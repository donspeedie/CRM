/**
 * CRM Engagement Dashboard
 *
 * Shows engagement metrics across all channels
 */

import { useEffect, useState } from 'react';
import { getEngagementMetrics } from '../lib/engagement-service';
import type { EngagementMetrics } from '../types/engagement';

interface Props {
  userId: string;
  days?: number;
}

export function EngagementDashboard({ userId, days = 30 }: Props) {
  const [metrics, setMetrics] = useState<EngagementMetrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadMetrics() {
      try {
        setLoading(true);
        const data = await getEngagementMetrics(userId, days);
        setMetrics(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load metrics');
      } finally {
        setLoading(false);
      }
    }

    if (userId) {
      loadMetrics();
    }
  }, [userId, days]);

  if (loading) {
    return (
      <div className="p-6 bg-white rounded-lg shadow">
        <p className="text-gray-500">Loading engagement metrics...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 bg-white rounded-lg shadow">
        <p className="text-red-500">Error: {error}</p>
      </div>
    );
  }

  if (!metrics) {
    return null;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">
          CRM Engagement Tracking
        </h2>
        <p className="text-sm text-gray-500">
          Last {days} days
        </p>
      </div>

      {/* Total Engagements */}
      <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg shadow-lg p-6 text-white">
        <p className="text-sm font-medium opacity-90">Total Engagements</p>
        <p className="text-4xl font-bold mt-2">{metrics.total}</p>
        <p className="text-sm mt-2 opacity-75">
          {new Date(metrics.timeRange.start).toLocaleDateString()} -{' '}
          {new Date(metrics.timeRange.end).toLocaleDateString()}
        </p>
      </div>

      {/* Funnel Stages */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <MetricCard
          title="Awareness"
          value={metrics.byStage.awareness}
          color="purple"
          description="New prospects"
        />
        <MetricCard
          title="Follow-up"
          value={metrics.byStage['follow-up']}
          color="blue"
          description="Active engagement"
        />
        <MetricCard
          title="Converted"
          value={metrics.byStage.converted}
          color="green"
          description="Deals closed"
        />
        <MetricCard
          title="Recommendation"
          value={metrics.byStage.recommendation}
          color="orange"
          description="Referrals & repeat"
        />
      </div>

      {/* Source Breakdown */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold mb-4">Engagement by Source</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <SourceStat label="Web" value={metrics.bySource.web} icon="🌐" />
          <SourceStat label="Email" value={metrics.bySource.email} icon="📧" />
          <SourceStat label="Social" value={metrics.bySource.social} icon="📱" />
          <SourceStat label="Direct" value={metrics.bySource.direct} icon="🤝" />
        </div>
      </div>
    </div>
  );
}

interface MetricCardProps {
  title: string;
  value: number;
  color: 'purple' | 'blue' | 'green' | 'orange';
  description: string;
}

function MetricCard({ title, value, color, description }: MetricCardProps) {
  const colorClasses = {
    purple: 'bg-purple-50 border-purple-200 text-purple-900',
    blue: 'bg-blue-50 border-blue-200 text-blue-900',
    green: 'bg-green-50 border-green-200 text-green-900',
    orange: 'bg-orange-50 border-orange-200 text-orange-900',
  };

  return (
    <div className={`rounded-lg border-2 p-4 ${colorClasses[color]}`}>
      <p className="text-sm font-medium opacity-75">{title}</p>
      <p className="text-3xl font-bold mt-1">{value}</p>
      <p className="text-xs mt-1 opacity-60">{description}</p>
    </div>
  );
}

interface SourceStatProps {
  label: string;
  value: number;
  icon: string;
}

function SourceStat({ label, value, icon }: SourceStatProps) {
  return (
    <div className="text-center">
      <div className="text-3xl mb-1">{icon}</div>
      <p className="text-2xl font-bold text-gray-900">{value}</p>
      <p className="text-sm text-gray-500">{label}</p>
    </div>
  );
}
