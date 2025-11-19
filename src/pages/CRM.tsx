/**
 * CRM Page
 *
 * Engagement tracking dashboard and contact management
 */

import { useState } from 'react';
import { EngagementDashboard } from '../components/EngagementDashboard';
import { AddEngagementModal } from '../components/AddEngagementModal';

// TODO: Get actual user ID from auth context
const USER_ID = 'donspeedie@gmail.com';

export default function CRM() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  const handleEngagementAdded = () => {
    // Refresh dashboard
    setRefreshKey((prev) => prev + 1);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-6 md:flex md:items-center md:justify-between">
            <div className="flex-1 min-w-0">
              <h1 className="text-3xl font-bold text-gray-900">
                CRM & Engagement Tracking
              </h1>
              <p className="mt-1 text-sm text-gray-500">
                Track all interactions with prospects, investors, and clients
              </p>
            </div>
            <div className="mt-4 flex md:mt-0 md:ml-4">
              <button
                onClick={() => setIsModalOpen(true)}
                className="ml-3 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <svg
                  className="mr-2 -ml-1 h-5 w-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 4v16m8-8H4"
                  />
                </svg>
                Add Engagement
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <EngagementDashboard key={refreshKey} userId={USER_ID} days={30} />

        {/* Info Cards */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <InfoCard
            icon="📧"
            title="Gmail Sync"
            description="Emails labeled 'RealDeal' are automatically tracked"
            status="Active"
            statusColor="green"
          />
          <InfoCard
            icon="🤖"
            title="Daily Automation"
            description="Syncs run every morning at 7:00 AM"
            status="Enabled"
            statusColor="blue"
          />
          <InfoCard
            icon="📊"
            title="SendGrid"
            description="Automated email sending ready to configure"
            status="Pending"
            statusColor="orange"
          />
        </div>

        {/* Quick Links */}
        <div className="mt-8 bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <QuickLink
              title="View Firestore"
              description="Check engagement events in Firebase"
              href="https://console.firebase.google.com/project/habu-1gxak2/firestore"
              external
            />
            <QuickLink
              title="Setup SendGrid"
              description="Complete email sending configuration"
              href="/docs/sendgrid-setup"
            />
            <QuickLink
              title="Gmail Labels"
              description="Manage your RealDeal label in Gmail"
              href="https://mail.google.com/"
              external
            />
            <QuickLink
              title="Documentation"
              description="View complete CRM system guide"
              href="/docs/crm-complete"
            />
          </div>
        </div>
      </div>

      {/* Add Engagement Modal */}
      <AddEngagementModal
        userId={USER_ID}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={handleEngagementAdded}
      />
    </div>
  );
}

interface InfoCardProps {
  icon: string;
  title: string;
  description: string;
  status: string;
  statusColor: 'green' | 'blue' | 'orange';
}

function InfoCard({ icon, title, description, status, statusColor }: InfoCardProps) {
  const statusColors = {
    green: 'bg-green-100 text-green-800',
    blue: 'bg-blue-100 text-blue-800',
    orange: 'bg-orange-100 text-orange-800',
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="text-4xl mb-3">{icon}</div>
      <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
      <p className="mt-1 text-sm text-gray-500">{description}</p>
      <span
        className={`mt-3 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusColors[statusColor]}`}
      >
        {status}
      </span>
    </div>
  );
}

interface QuickLinkProps {
  title: string;
  description: string;
  href: string;
  external?: boolean;
}

function QuickLink({ title, description, href, external }: QuickLinkProps) {
  return (
    <a
      href={href}
      target={external ? '_blank' : undefined}
      rel={external ? 'noopener noreferrer' : undefined}
      className="block p-4 border border-gray-200 rounded-lg hover:border-blue-500 hover:shadow-md transition-all"
    >
      <div className="flex items-start justify-between">
        <div>
          <h4 className="font-medium text-gray-900">{title}</h4>
          <p className="mt-1 text-sm text-gray-500">{description}</p>
        </div>
        {external && (
          <svg
            className="w-5 h-5 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
            />
          </svg>
        )}
      </div>
    </a>
  );
}
