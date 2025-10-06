'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import NewEntryForm from '@/components/NewEntryForm';

interface User {
  _id: string;
  email: string;
}

export default function AddEntryPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userRes = await fetch('/api/auth/me');
        if (!userRes.ok) {
          router.push('/login');
          return;
        }
        const userData = await userRes.json();
        setUser(userData.data);
      } catch (err: any) {
        setError(err.message || 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [router]);

  const handleFormSubmit = () => {
    router.push('/dashboard');
  };

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  if (error) {
    return <div className="flex items-center justify-center min-h-screen text-destructive">Error: {error}</div>;
  }

  return (
    <div className="w-full max-w-md mx-auto">
      <NewEntryForm 
        userId={user?._id}
        onFormSubmit={handleFormSubmit} 
      />
    </div>
  );
}
