'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/components/AuthProvider';
import { contactService } from '@/lib/contact-service';
import { Contact, ContactTag } from '@/types/contact';
import { useRouter, useParams } from 'next/navigation';
import { ArrowLeft, Mail, Phone, Building2, Calendar, Trash2, Edit2, Save, X } from 'lucide-react';
import Link from 'next/link';
import { format } from 'date-fns';

export default function ContactDetailPage() {
  const { user } = useAuth();
  const router = useRouter();
  const params = useParams();
  const contactId = params.id as string;

  const [contact, setContact] = useState<Contact | null>(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState<Partial<Contact>>({});

  useEffect(() => {
    loadContact();
  }, [contactId]);

  const loadContact = async () => {
    try {
      const data = await contactService.get(contactId);
      setContact(data);
      if (data) {
        setEditData(data);
      }
    } catch (error) {
      console.error('Error loading contact:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!contact) return;

    try {
      await contactService.update(contactId, {
        name: editData.name || contact.name,
        email: editData.email,
        phone: editData.phone,
        company: editData.company,
        role: editData.role,
        notes: editData.notes,
        tags: editData.tags || [],
        nextFollowUp: editData.nextFollowUp,
      });
      
      setIsEditing(false);
      loadContact();
    } catch (error) {
      console.error('Error updating contact:', error);
    }
  };

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this contact? This action cannot be undone.')) {
      return;
    }

    try {
      await contactService.delete(contactId);
      router.push('/dashboard');
    } catch (error) {
      console.error('Error deleting contact:', error);
    }
  };

  const toggleTag = (tag: ContactTag) => {
    setEditData(prev => ({
      ...prev,
      tags: prev.tags?.includes(tag)
        ? prev.tags.filter(t => t !== tag)
        : [...(prev.tags || []), tag]
    }));
  };

  const availableTags: ContactTag[] = ['Nimble Development', 'Real Deal', 'Personal'];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-600">Loading contact...</div>
      </div>
    );
  }

  if (!contact) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Contact not found</h2>
        <Link href="/dashboard" className="btn-primary">
          Back to Contacts
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <Link href="/dashboard" className="inline-flex items-center gap-2 text-primary-600 hover:text-primary-700 mb-4">
          <ArrowLeft size={20} />
          Back to Contacts
        </Link>
      </div>

      <div className="card">
        {/* Header with Actions */}
        <div className="flex items-start justify-between mb-6 pb-6 border-b border-gray-200">
          <div>
            {isEditing ? (
              <input
                type="text"
                value={editData.name}
                onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                className="text-3xl font-bold text-gray-900 border-b-2 border-primary-500 outline-none"
              />
            ) : (
              <h1 className="text-3xl font-bold text-gray-900">{contact.name}</h1>
            )}
            {!isEditing && contact.role && contact.company && (
              <p className="text-gray-600 mt-2">
                {contact.role} at {contact.company}
              </p>
            )}
          </div>

          <div className="flex gap-2">
            {isEditing ? (
              <>
                <button onClick={handleSave} className="btn-primary flex items-center gap-2">
                  <Save size={18} />
                  Save
                </button>
                <button onClick={() => setIsEditing(false)} className="btn-secondary flex items-center gap-2">
                  <X size={18} />
                  Cancel
                </button>
              </>
            ) : (
              <>
                <button onClick={() => setIsEditing(true)} className="btn-primary flex items-center gap-2">
                  <Edit2 size={18} />
                  Edit
                </button>
                <button onClick={handleDelete} className="btn-secondary flex items-center gap-2 text-red-600 hover:bg-red-50">
                  <Trash2 size={18} />
                  Delete
                </button>
              </>
            )}
          </div>
        </div>

        {/* Contact Info */}
        <div className="space-y-6">
          {isEditing ? (
            <>
              {/* Edit Mode */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Company</label>
                  <input
                    type="text"
                    value={editData.company || ''}
                    onChange={(e) => setEditData({ ...editData, company: e.target.value })}
                    className="input-field"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Role</label>
                  <input
                    type="text"
                    value={editData.role || ''}
                    onChange={(e) => setEditData({ ...editData, role: e.target.value })}
                    className="input-field"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                <input
                  type="email"
                  value={editData.email || ''}
                  onChange={(e) => setEditData({ ...editData, email: e.target.value })}
                  className="input-field"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                <input
                  type="tel"
                  value={editData.phone || ''}
                  onChange={(e) => setEditData({ ...editData, phone: e.target.value })}
                  className="input-field"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">Tags</label>
                <div className="flex flex-wrap gap-2">
                  {availableTags.map((tag) => (
                    <button
                      key={tag}
                      type="button"
                      onClick={() => toggleTag(tag)}
                      className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                        editData.tags?.includes(tag)
                          ? 'bg-primary-600 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Next Follow-Up</label>
                <input
                  type="date"
                  value={editData.nextFollowUp ? format(editData.nextFollowUp, 'yyyy-MM-dd') : ''}
                  onChange={(e) => setEditData({ ...editData, nextFollowUp: e.target.value ? new Date(e.target.value) : undefined })}
                  className="input-field"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Notes</label>
                <textarea
                  value={editData.notes || ''}
                  onChange={(e) => setEditData({ ...editData, notes: e.target.value })}
                  className="input-field"
                  rows={6}
                />
              </div>
            </>
          ) : (
            <>
              {/* View Mode */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-3">Contact Information</h3>
                  <div className="space-y-3">
                    {contact.email && (
                      <a
                        href={`mailto:${contact.email}`}
                        className="flex items-center gap-3 text-gray-700 hover:text-primary-600 transition-colors"
                      >
                        <Mail size={20} className="text-gray-400" />
                        <span>{contact.email}</span>
                      </a>
                    )}
                    {contact.phone && (
                      <a
                        href={`tel:${contact.phone}`}
                        className="flex items-center gap-3 text-gray-700 hover:text-primary-600 transition-colors"
                      >
                        <Phone size={20} className="text-gray-400" />
                        <span>{contact.phone}</span>
                      </a>
                    )}
                    {contact.company && (
                      <div className="flex items-center gap-3 text-gray-700">
                        <Building2 size={20} className="text-gray-400" />
                        <span>{contact.company}</span>
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-3">Details</h3>
                  <div className="space-y-3">
                    {contact.nextFollowUp && (
                      <div className="flex items-center gap-3 text-gray-700">
                        <Calendar size={20} className="text-gray-400" />
                        <div>
                          <p className="text-sm text-gray-500">Next Follow-Up</p>
                          <p className="font-medium">{format(contact.nextFollowUp, 'MMM d, yyyy')}</p>
                        </div>
                      </div>
                    )}
                    <div className="flex items-center gap-3 text-gray-700">
                      <div>
                        <p className="text-sm text-gray-500">Source</p>
                        <p className="font-medium">{contact.source}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {contact.tags.length > 0 && (
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-3">Tags</h3>
                  <div className="flex flex-wrap gap-2">
                    {contact.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-3 py-1 bg-primary-50 text-primary-700 text-sm font-medium rounded-full"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {contact.notes && (
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-3">Notes</h3>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="text-gray-700 whitespace-pre-wrap">{contact.notes}</p>
                  </div>
                </div>
              )}

              <div className="pt-6 border-t border-gray-200">
                <p className="text-sm text-gray-500">
                  Added {format(contact.createdAt, 'MMM d, yyyy')} • 
                  Last updated {format(contact.updatedAt, 'MMM d, yyyy')}
                </p>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
