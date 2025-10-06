'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import NewEntryForm from '@/components/NewEntryForm';
import { VaultEntry } from '@/components/Dashboard';

interface User {
  _id: string;
  email: string;
}

export default function EditEntryPage() {
  const router = useRouter();
  const params = useParams();
  const { id } = params;

  const [user, setUser] = useState<User | null>(null);
  const [entry, setEntry] = useState<VaultEntry | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchUserAndEntry = async () => {
      try {
        // Fetch user
        const userRes = await fetch('/api/auth/me');
        if (!userRes.ok) {
          router.push('/login');
          return;
        }
        const userData = await userRes.json();
        setUser(userData.data);

        // Fetch entry
        const entryRes = await fetch(`/api/vault/${id}`);
        if (!entryRes.ok) {
          throw new Error('Failed to fetch entry');
        }
        const entryData = await entryRes.json();
        setEntry(entryData.data);

      } catch (err: any) {
        setError(err.message || 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
        fetchUserAndEntry();
    }
  }, [router, id]);

  const handleFormSubmit = () => {
    router.push('/');
  };

  if (loading) {
    return <div className="flex items-center justify-center">Loading...</div>;
  }

  if (error) {
    return <div className="flex items-center justify-center text-destructive">Error: {error}</div>;
  }

  return (
    <div className="w-full max-w-md mx-auto">
        {entry && (
            <NewEntryForm 
                userId={user?._id}
                entryToEdit={entry}
                onFormSubmit={handleFormSubmit} 
            />
        )}
    </div>
  );
}
