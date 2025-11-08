'use client';

import { useState } from 'react';
import { useAuth } from '@/components/AuthProvider';
import { contactService } from '@/lib/contact-service';
import { useRouter } from 'next/navigation';
import { ContactTag, ContactSource } from '@/types/contact';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function AddContactPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    role: '',
    notes: '',
    source: 'Manual Entry' as ContactSource,
    tags: [] as ContactTag[],
    nextFollowUp: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setLoading(true);
    setError('');

    try {
      const contactData = {
        name: formData.name,
        email: formData.email || undefined,
        phone: formData.phone || undefined,
        company: formData.company || undefined,
        role: formData.role || undefined,
        notes: formData.notes || undefined,
        source: formData.source,
        tags: formData.tags,
        nextFollowUp: formData.nextFollowUp ? new Date(formData.nextFollowUp) : undefined,
      };

      await contactService.create(user.uid, contactData);
      router.push('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Failed to create contact');
    } finally {
      setLoading(false);
    }
  };

  const toggleTag = (tag: ContactTag) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.includes(tag)
        ? prev.tags.filter(t => t !== tag)
        : [...prev.tags, tag]
    }));
  };

  const availableTags: ContactTag[] = ['Nimble Development', 'Real Deal', 'Personal'];

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-6">
        <Link href="/dashboard" className="inline-flex items-center gap-2 text-primary-600 hover:text-primary-700 mb-4">
          <ArrowLeft size={20} />
          Back to Contacts
        </Link>
        <h1 className="text-3xl font-bold text-gray-900">Add New Contact</h1>
      </div>

      <form onSubmit={handleSubmit} className="card space-y-6">
        {/* Name (Required) */}
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
            Name <span className="text-red-500">*</span>
          </label>
          <input
            id="name"
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="input-field"
            required
            placeholder="John Doe"
          />
        </div>

        {/* Email */}
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
            Email
          </label>
          <input
            id="email"
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            className="input-field"
            placeholder="john@example.com"
          />
        </div>

        {/* Phone */}
        <div>
          <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
            Phone
          </label>
          <input
            id="phone"
            type="tel"
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            className="input-field"
            placeholder="(555) 123-4567"
          />
        </div>

        {/* Company & Role - Side by Side */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="company" className="block text-sm font-medium text-gray-700 mb-2">
              Company
            </label>
            <input
              id="company"
              type="text"
              value={formData.company}
              onChange={(e) => setFormData({ ...formData, company: e.target.value })}
              className="input-field"
              placeholder="Acme Corp"
            />
          </div>

          <div>
            <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-2">
              Role
            </label>
            <input
              id="role"
              type="text"
              value={formData.role}
              onChange={(e) => setFormData({ ...formData, role: e.target.value })}
              className="input-field"
              placeholder="CEO"
            />
          </div>
        </div>

        {/* Tags */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Tags
          </label>
          <div className="flex flex-wrap gap-2">
            {availableTags.map((tag) => (
              <button
                key={tag}
                type="button"
                onClick={() => toggleTag(tag)}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  formData.tags.includes(tag)
                    ? 'bg-primary-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>

        {/* Source */}
        <div>
          <label htmlFor="source" className="block text-sm font-medium text-gray-700 mb-2">
            How did you meet?
          </label>
          <select
            id="source"
            value={formData.source}
            onChange={(e) => setFormData({ ...formData, source: e.target.value as ContactSource })}
            className="input-field"
          >
            <option value="Manual Entry">Manual Entry</option>
            <option value="Email Import">Email Import</option>
            <option value="Meeting Notes">Meeting Notes</option>
            <option value="Business Card">Business Card</option>
            <option value="LinkedIn">LinkedIn</option>
            <option value="Referral">Referral</option>
            <option value="Other">Other</option>
          </select>
        </div>

        {/* Next Follow-Up */}
        <div>
          <label htmlFor="nextFollowUp" className="block text-sm font-medium text-gray-700 mb-2">
            Next Follow-Up Date
          </label>
          <input
            id="nextFollowUp"
            type="date"
            value={formData.nextFollowUp}
            onChange={(e) => setFormData({ ...formData, nextFollowUp: e.target.value })}
            className="input-field"
          />
        </div>

        {/* Notes */}
        <div>
          <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-2">
            Notes
          </label>
          <textarea
            id="notes"
            value={formData.notes}
            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
            className="input-field"
            rows={4}
            placeholder="Add any relevant notes about this contact..."
          />
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
            {error}
          </div>
        )}

        {/* Submit Button */}
        <div className="flex gap-4">
          <button
            type="submit"
            disabled={loading}
            className="btn-primary flex-1 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Adding...' : 'Add Contact'}
          </button>
          <Link href="/dashboard" className="btn-secondary">
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
}
