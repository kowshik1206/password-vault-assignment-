'use client';

import { useState, useEffect } from 'react';
import { encrypt } from '@/lib/crypto';
import { VaultEntry } from './Dashboard';
import { toast } from 'sonner';

interface EntryFormProps {
  userId?: string;
  entryToEdit?: VaultEntry | null;
  onFormSubmit: () => void;
  onClose: () => void;
}

export default function NewEntryForm({ userId, entryToEdit, onFormSubmit, onClose }: EntryFormProps) {
  const [title, setTitle] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [url, setUrl] = useState('');
  const [notes, setNotes] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const isEditMode = !!entryToEdit;

  useEffect(() => {
    if (isEditMode) {
      setTitle(entryToEdit.title);
      setUsername(entryToEdit.username);
      setUrl(entryToEdit.url);
      setNotes(entryToEdit.notes || '');
      setPassword('');
    }
  }, [entryToEdit, isEditMode]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userId) {
      setError('User not found. Please log in again.');
      return;
    }
    setLoading(true);
    setError('');

    try {
      let encryptedPassword = entryToEdit?.password;
      if (password) {
        encryptedPassword = encrypt(password);
      }

      if (!encryptedPassword) {
        setError("Password is required.");
        setLoading(false);
        return;
      }

      const entryData = {
        user: userId,
        title,
        username,
        password: encryptedPassword,
        url,
        notes,
      };

      const url_ = isEditMode ? `/api/vault/${entryToEdit._id}` : '/api/vault';
      const method = isEditMode ? 'PUT' : 'POST';

      const res = await fetch(url_, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(entryData),
      });

      if (res.ok) {
        toast.success(isEditMode ? 'Entry updated successfully!' : 'Entry added successfully!');
        onFormSubmit();
      } else {
        const data = await res.json();
        toast.error(data.message || `Failed to ${isEditMode ? 'update' : 'add'} entry`);
      }
    } catch (err) {
      toast.error('An unexpected error occurred');
    }

    setLoading(false);
  };

  return (
    <div className="w-full max-w-md p-8 space-y-6 bg-card rounded-lg shadow-lg relative">
      <button onClick={onClose} className="absolute top-4 right-4 text-muted-foreground hover:text-foreground">&times;</button>
      
      <h2 className="text-2xl font-bold text-center text-card-foreground">{isEditMode ? 'Edit Entry' : 'Add New Entry'}</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-muted-foreground">Title</label>
          <input type="text" required value={title} onChange={(e) => setTitle(e.target.value)} className="w-full px-3 py-2 mt-1 bg-transparent border rounded-md border-input text-card-foreground focus:outline-none focus:ring-2 focus:ring-ring" autoFocus />
        </div>
        <div>
          <label className="block text-sm font-medium text-muted-foreground">Username</label>
          <input type="text" required value={username} onChange={(e) => setUsername(e.target.value)} className="w-full px-3 py-2 mt-1 bg-transparent border rounded-md border-input text-card-foreground focus:outline-none focus:ring-2 focus:ring-ring" />
        </div>
        <div>
          <label className="block text-sm font-medium text-muted-foreground">Password</label>
          <input type="password" placeholder={isEditMode ? "Leave blank to keep unchanged" : ""} value={password} onChange={(e) => setPassword(e.target.value)} className="w-full px-3 py-2 mt-1 bg-transparent border rounded-md border-input text-card-foreground focus:outline-none focus:ring-2 focus:ring-ring" />
        </div>
        <div>
          <label className="block text-sm font-medium text-muted-foreground">URL</label>
          <input type="url" value={url} onChange={(e) => setUrl(e.target.value)} className="w-full px-3 py-2 mt-1 bg-transparent border rounded-md border-input text-card-foreground focus:outline-none focus:ring-2 focus:ring-ring" />
        </div>
        <div>
          <label className="block text-sm font-medium text-muted-foreground">Notes</label>
          <textarea value={notes} onChange={(e) => setNotes(e.target.value)} className="w-full px-3 py-2 mt-1 bg-transparent border rounded-md border-input text-card-foreground focus:outline-none focus:ring-2 focus:ring-ring"></textarea>
        </div>
        
        <button type="submit" disabled={loading} className="w-full px-4 py-2 font-medium text-primary-foreground bg-primary rounded-md hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-ring disabled:opacity-50 transition-colors">
          {loading ? (isEditMode ? 'Saving...' : 'Adding...') : (isEditMode ? 'Save Changes' : 'Add Entry')}
        </button>
      </form>
    </div>
  );
}
