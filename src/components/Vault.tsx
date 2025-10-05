'use client';

import { useState } from 'react';
import VaultItem from './VaultItem';
import { VaultEntry } from './Dashboard'; // Import the type from Dashboard

interface VaultProps {
  entries: VaultEntry[];
  onAddEntry: () => void;
  onEditEntry: (entry: VaultEntry) => void;
  onDeleteEntry: (entryId: string) => void;
}

export default function Vault({ entries, onAddEntry, onEditEntry, onDeleteEntry }: VaultProps) {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredEntries = entries.filter(entry => 
    entry.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (entry.username && entry.username.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (entry.url && entry.url.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold text-foreground">My Vault</h2>
        <button 
          onClick={onAddEntry}
          className="inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-primary-foreground bg-primary rounded-md hover:bg-primary/90 transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 shadow-sm hover:shadow-md"
        >
          Add New Entry
        </button>
      </div>

      <div className="relative">
        <input 
          type="text"
          placeholder="Search vault..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-3 bg-card border rounded-lg border-input focus:outline-none focus:ring-2 focus:ring-primary transition-shadow duration-300 shadow-sm"
        />
        <svg className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-4">
        {entries.length === 0 ? (
          <p className='col-span-full text-center text-muted-foreground py-12'>Your vault is empty. Add a new entry to get started.</p>
        ) : filteredEntries.length === 0 ? (
          <p className='col-span-full text-center text-muted-foreground py-12'>No entries match your search.</p>
        ) : (
          filteredEntries.map(entry => (
            <VaultItem 
              key={entry._id} 
              entry={entry} 
              onEdit={() => onEditEntry(entry)}
              onDelete={() => onDeleteEntry(entry._id)}
            />
          ))
        )}
      </div>
    </div>
  );
}
