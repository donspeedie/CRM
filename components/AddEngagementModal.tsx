/**
 * Add Engagement Modal
 *
 * Quick-add form for manual engagement tracking (social posts, meetings, etc.)
 */

import { useState } from 'react';
import { trackSocialPost, createEngagement } from '../lib/engagement-service';
import type { EngagementEventType } from '../types/engagement';

interface Props {
  userId: string;
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export function AddEngagementModal({ userId, isOpen, onClose, onSuccess }: Props) {
  const [tab, setTab] = useState<'social' | 'email' | 'meeting'>('social');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Social post form state
  const [platform, setPlatform] = useState<'linkedin' | 'facebook'>('linkedin');
  const [postUrl, setPostUrl] = useState('');
  const [likes, setLikes] = useState('');
  const [comments, setComments] = useState('');
  const [shares, setShares] = useState('');
  const [reach, setReach] = useState('');
  const [impressions, setImpressions] = useState('');
  const [newContacts, setNewContacts] = useState('');
  const [notes, setNotes] = useState('');

  if (!isOpen) return null;

  const handleSocialSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await trackSocialPost({
        userId,
        platform,
        postUrl: postUrl || undefined,
        likes: likes ? parseInt(likes) : undefined,
        comments: comments ? parseInt(comments) : undefined,
        shares: shares ? parseInt(shares) : undefined,
        reach: reach ? parseInt(reach) : undefined,
        impressions: impressions ? parseInt(impressions) : undefined,
        newContacts: newContacts ? parseInt(newContacts) : undefined,
        notes: notes || undefined,
      });

      // Reset form
      setPostUrl('');
      setLikes('');
      setComments('');
      setShares('');
      setReach('');
      setImpressions('');
      setNewContacts('');
      setNotes('');

      onSuccess?.();
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to track engagement');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="p-6 border-b">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-900">Add Engagement</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Tabs */}
          <div className="flex gap-4 mt-4">
            <button
              onClick={() => setTab('social')}
              className={`px-4 py-2 rounded-md font-medium ${
                tab === 'social'
                  ? 'bg-blue-100 text-blue-700'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              📱 Social Post
            </button>
            <button
              onClick={() => setTab('email')}
              className={`px-4 py-2 rounded-md font-medium ${
                tab === 'email'
                  ? 'bg-blue-100 text-blue-700'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              📧 Email
            </button>
            <button
              onClick={() => setTab('meeting')}
              className={`px-4 py-2 rounded-md font-medium ${
                tab === 'meeting'
                  ? 'bg-blue-100 text-blue-700'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              🤝 Meeting
            </button>
          </div>
        </div>

        {/* Form */}
        <div className="p-6">
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md text-red-700 text-sm">
              {error}
            </div>
          )}

          {tab === 'social' && (
            <form onSubmit={handleSocialSubmit} className="space-y-4">
              {/* Platform */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Platform
                </label>
                <div className="flex gap-4">
                  <button
                    type="button"
                    onClick={() => setPlatform('linkedin')}
                    className={`flex-1 p-3 rounded-lg border-2 font-medium ${
                      platform === 'linkedin'
                        ? 'border-blue-500 bg-blue-50 text-blue-700'
                        : 'border-gray-200 text-gray-600'
                    }`}
                  >
                    LinkedIn
                  </button>
                  <button
                    type="button"
                    onClick={() => setPlatform('facebook')}
                    className={`flex-1 p-3 rounded-lg border-2 font-medium ${
                      platform === 'facebook'
                        ? 'border-blue-500 bg-blue-50 text-blue-700'
                        : 'border-gray-200 text-gray-600'
                    }`}
                  >
                    Facebook
                  </button>
                </div>
              </div>

              {/* Post URL */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Post URL (optional)
                </label>
                <input
                  type="url"
                  value={postUrl}
                  onChange={(e) => setPostUrl(e.target.value)}
                  className="w-full px-3 py-2 border rounded-md"
                  placeholder="https://linkedin.com/posts/..."
                />
              </div>

              {/* Metrics Grid */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Likes
                  </label>
                  <input
                    type="number"
                    value={likes}
                    onChange={(e) => setLikes(e.target.value)}
                    className="w-full px-3 py-2 border rounded-md"
                    placeholder="0"
                    min="0"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Comments
                  </label>
                  <input
                    type="number"
                    value={comments}
                    onChange={(e) => setComments(e.target.value)}
                    className="w-full px-3 py-2 border rounded-md"
                    placeholder="0"
                    min="0"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Shares
                  </label>
                  <input
                    type="number"
                    value={shares}
                    onChange={(e) => setShares(e.target.value)}
                    className="w-full px-3 py-2 border rounded-md"
                    placeholder="0"
                    min="0"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Reach
                  </label>
                  <input
                    type="number"
                    value={reach}
                    onChange={(e) => setReach(e.target.value)}
                    className="w-full px-3 py-2 border rounded-md"
                    placeholder="0"
                    min="0"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Impressions
                  </label>
                  <input
                    type="number"
                    value={impressions}
                    onChange={(e) => setImpressions(e.target.value)}
                    className="w-full px-3 py-2 border rounded-md"
                    placeholder="0"
                    min="0"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    New Contacts
                  </label>
                  <input
                    type="number"
                    value={newContacts}
                    onChange={(e) => setNewContacts(e.target.value)}
                    className="w-full px-3 py-2 border rounded-md"
                    placeholder="0"
                    min="0"
                  />
                </div>
              </div>

              {/* Notes */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Notes (optional)
                </label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full px-3 py-2 border rounded-md"
                  rows={3}
                  placeholder="Additional context about this engagement..."
                />
              </div>

              {/* Submit */}
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 px-4 py-2 border rounded-md text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
                >
                  {loading ? 'Saving...' : 'Add Engagement'}
                </button>
              </div>
            </form>
          )}

          {tab === 'email' && (
            <div className="text-center py-8 text-gray-500">
              <p>Email tracking is automated via Gmail sync.</p>
              <p className="text-sm mt-2">Label emails with "RealDeal" to track them.</p>
            </div>
          )}

          {tab === 'meeting' && (
            <div className="text-center py-8 text-gray-500">
              <p>Meeting tracking coming soon!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
