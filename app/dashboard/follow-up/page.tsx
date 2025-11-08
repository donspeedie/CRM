'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/components/AuthProvider';
import { contactService } from '@/lib/contact-service';
import { Contact } from '@/types/contact';
import Link from 'next/link';
import { Calendar, Mail, Phone, AlertCircle } from 'lucide-react';
import { format, isPast, isToday, isTomorrow } from 'date-fns';

export default function FollowUpPage() {
  const { user } = useAuth();
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadFollowUps();
  }, [user]);

  const loadFollowUps = async () => {
    if (!user) return;
    
    try {
      const data = await contactService.getNeedingFollowUp(user.uid);
      setContacts(data);
    } catch (error) {
      console.error('Error loading follow-ups:', error);
    } finally {
      setLoading(false);
    }
  };

  const getFollowUpStatus = (date: Date) => {
    if (isPast(date) && !isToday(date)) {
      return { label: 'Overdue', color: 'text-red-600 bg-red-50 border-red-200' };
    }
    if (isToday(date)) {
      return { label: 'Today', color: 'text-orange-600 bg-orange-50 border-orange-200' };
    }
    if (isTomorrow(date)) {
      return { label: 'Tomorrow', color: 'text-yellow-600 bg-yellow-50 border-yellow-200' };
    }
    return { label: format(date, 'MMM d'), color: 'text-green-600 bg-green-50 border-green-200' };
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-600">Loading follow-ups...</div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Follow-Up Needed</h1>
        <p className="text-gray-600">
          {contacts.length} {contacts.length === 1 ? 'contact needs' : 'contacts need'} your attention
        </p>
      </div>

      {contacts.length === 0 ? (
        <div className="card text-center py-12">
          <Calendar className="mx-auto text-gray-400 mb-4" size={48} />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            All caught up!
          </h3>
          <p className="text-gray-600 mb-6">
            No follow-ups needed right now. Great job staying on top of things!
          </p>
          <Link href="/dashboard" className="btn-primary inline-block">
            View All Contacts
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {contacts.map((contact) => {
            const status = contact.nextFollowUp ? getFollowUpStatus(contact.nextFollowUp) : null;
            
            return (
              <div key={contact.id} className="card hover:shadow-lg transition-shadow duration-200">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <Link 
                        href={`/dashboard/contact/${contact.id}`}
                        className="text-lg font-semibold text-gray-900 hover:text-primary-600 transition-colors"
                      >
                        {contact.name}
                      </Link>
                      {status && (
                        <span className={`px-3 py-1 text-xs font-medium rounded-full border ${status.color}`}>
                          {status.label}
                        </span>
                      )}
                    </div>

                    {contact.role && contact.company && (
                      <p className="text-sm text-gray-600 mb-3">
                        {contact.role} at {contact.company}
                      </p>
                    )}

                    <div className="flex flex-wrap gap-4 mb-4">
                      {contact.email && (
                        <a
                          href={`mailto:${contact.email}`}
                          className="flex items-center gap-2 text-sm text-gray-600 hover:text-primary-600 transition-colors"
                        >
                          <Mail size={16} />
                          <span>{contact.email}</span>
                        </a>
                      )}
                      {contact.phone && (
                        <a
                          href={`tel:${contact.phone}`}
                          className="flex items-center gap-2 text-sm text-gray-600 hover:text-primary-600 transition-colors"
                        >
                          <Phone size={16} />
                          <span>{contact.phone}</span>
                        </a>
                      )}
                    </div>

                    {contact.notes && (
                      <div className="bg-gray-50 rounded-lg p-3 mb-4">
                        <p className="text-sm text-gray-700 line-clamp-2">{contact.notes}</p>
                      </div>
                    )}

                    {contact.tags.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {contact.tags.map((tag) => (
                          <span
                            key={tag}
                            className="px-2 py-1 bg-primary-50 text-primary-700 text-xs font-medium rounded-full"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="ml-4">
                    <Link
                      href={`/dashboard/contact/${contact.id}`}
                      className="btn-primary"
                    >
                      View Contact
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
