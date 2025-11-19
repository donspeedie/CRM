'use client';

import { useAuth } from '@/components/AuthProvider';
import { EngagementDashboard } from '@/components/EngagementDashboard';

export default function EngagementPage() {
  const { user } = useAuth();

  if (!user) {
    return <div className="flex items-center justify-center h-64">
      <div className="text-gray-600">Loading...</div>
    </div>;
  }

  return <EngagementDashboard userId={user.uid} />;
}
