'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/components/AuthProvider';
import { contactService } from '@/lib/contact-service';
import { Contact } from '@/types/contact';
import Link from 'next/link';
import { Search, Mail, Phone, Building2, Tag as TagIcon, Calendar } from 'lucide-react';
import { format } from 'date-fns';

export default function DashboardPage() {
  const { user } = useAuth();
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [filteredContacts, setFilteredContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadContacts();
  }, [user]);

  useEffect(() => {
    if (searchTerm) {
      const filtered = contacts.filter(contact => 
        contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        contact.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        contact.company?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        contact.phone?.includes(searchTerm)
      );
      setFilteredContacts(filtered);
    } else {
      setFilteredContacts(contacts);
    }
  }, [searchTerm, contacts]);

  const loadContacts = async () => {
    if (!user) return;
    
    try {
      const data = await contactService.getAll(user.uid);
      setContacts(data);
      setFilteredContacts(data);
    } catch (error) {
      console.error('Error loading contacts:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-600">Loading contacts...</div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">All Contacts</h1>
        <p className="text-gray-600">
          {filteredContacts.length} {filteredContacts.length === 1 ? 'contact' : 'contacts'}
        </p>
      </div>

      {/* Search Bar */}
      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Search contacts..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
          />
        </div>
      </div>

      {/* Contacts Grid */}
      {filteredContacts.length === 0 ? (
        <div className="text-center py-12">
          <Users className="mx-auto text-gray-400 mb-4" size={48} />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            {searchTerm ? 'No contacts found' : 'No contacts yet'}
          </h3>
          <p className="text-gray-600 mb-6">
            {searchTerm ? 'Try a different search term' : 'Get started by adding your first contact'}
          </p>
          {!searchTerm && (
            <Link href="/dashboard/add" className="btn-primary inline-block">
              Add Your First Contact
            </Link>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredContacts.map((contact) => (
            <Link
              key={contact.id}
              href={`/dashboard/contact/${contact.id}`}
              className="card hover:shadow-lg transition-shadow duration-200 cursor-pointer"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">
                    {contact.name}
                  </h3>
                  {contact.role && contact.company && (
                    <p className="text-sm text-gray-600">
                      {contact.role} at {contact.company}
                    </p>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                {contact.email && (
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Mail size={16} className="text-gray-400" />
                    <span className="truncate">{contact.email}</span>
                  </div>
                )}
                {contact.phone && (
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Phone size={16} className="text-gray-400" />
                    <span>{contact.phone}</span>
                  </div>
                )}
                {contact.company && !contact.role && (
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Building2 size={16} className="text-gray-400" />
                    <span>{contact.company}</span>
                  </div>
                )}
              </div>

              {contact.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-4">
                  {contact.tags.map((tag) => (
                    <span
                      key={tag}
                      className="inline-flex items-center gap-1 px-2 py-1 bg-primary-50 text-primary-700 text-xs font-medium rounded-full"
                    >
                      <TagIcon size={12} />
                      {tag}
                    </span>
                  ))}
                </div>
              )}

              {contact.nextFollowUp && (
                <div className="flex items-center gap-2 mt-4 pt-4 border-t border-gray-100">
                  <Calendar size={14} className="text-gray-400" />
                  <span className="text-xs text-gray-600">
                    Follow up: {format(contact.nextFollowUp, 'MMM d, yyyy')}
                  </span>
                </div>
              )}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

function Users(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  );
}
