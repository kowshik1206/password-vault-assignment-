'use client';

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import PasswordGenerator from "./PasswordGenerator";
import Vault from "./Vault";
import NewEntryForm from "./NewEntryForm";

import { ThemeToggleButton } from "./ThemeToggleButton";
import { toast } from "sonner";

import { encrypt } from "@/lib/crypto";

// Define types for our data
interface User {
  id: string;
  email: string;
}

export interface VaultEntry {
  _id: string;
  title: string;
  username: string;
  password: string; // Encrypted
  url: string;
  notes?: string;
}

export default function Dashboard() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [entries, setEntries] = useState<VaultEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEntry, setEditingEntry] = useState<VaultEntry | null>(null);
  

  const sampleEntries: VaultEntry[] = [
    {
      _id: 'sample-1',
      title: 'Google',
      username: 'user@gmail.com',
      password: encrypt('password123'),
      url: 'https://google.com',
      notes: 'This is a sample entry.'
    },
    {
      _id: 'sample-2',
      title: 'Facebook',
      username: 'user@facebook.com',
      password: encrypt('password123'),
      url: 'https://facebook.com',
      notes: 'This is a sample entry.'
    },
    {
      _id: 'sample-3',
      title: 'Twitter',
      username: 'user@twitter.com',
      password: encrypt('password123'),
      url: 'https://twitter.com',
      notes: 'This is a sample entry.'
    },
  ];

  const fetchEntries = async (userId: string) => {
    try {
      const entriesRes = await fetch(`/api/vault?userId=${userId}`);
      if (!entriesRes.ok) throw new Error('Failed to fetch vault entries');
      const entriesData = await entriesRes.json();
      const userEntries = entriesData.data;
      const combinedEntries = [...sampleEntries, ...userEntries.filter((entry: VaultEntry) => !sampleEntries.find(se => se._id === entry._id))];
      setEntries(combinedEntries);
    } catch (err: any) {
      toast.error(err.message || 'An error occurred while fetching entries');
    }
  };

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
        await fetchEntries(userData.data.id);
      } catch (err: any) {
        toast.error(err.message || 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [router, isModalOpen]);

  

  const handleAddEntryClick = () => {
    setEditingEntry(null);
    setIsModalOpen(true);
  };

  const handleEditEntryClick = (entry: VaultEntry) => {
    setEditingEntry(entry);
    setIsModalOpen(true);
  };

  const handleFormSubmit = async () => {
    if (user) {
      await fetchEntries(user.id);
    }
    setIsModalOpen(false);
    setEditingEntry(null);
  };

  const handleDeleteEntry = async (entryId: string) => {
    if (entryId.startsWith('sample-')) {
        setEntries(prevEntries => prevEntries.filter(entry => entry._id !== entryId));
        toast.success('Sample entry removed.');
        return;
    }

    toast('Are you sure you want to delete this entry?', {
      action: {
        label: 'Delete',
        onClick: async () => {
          try {
            const res = await fetch(`/api/vault/${entryId}`, {
              method: 'DELETE',
            });
      
            if (res.ok) {
              setEntries(prevEntries => prevEntries.filter(entry => entry._id !== entryId));
              toast.success('Entry deleted successfully!');
            } else {
              toast.error('Failed to delete entry.');
            }
          } catch (err) {
            toast.error('An error occurred while deleting the entry.');
          }
        },
      },
      cancel: {
        label: 'Cancel',
      },
    });
  };

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      router.push('/login');
    } catch (err) {
      toast.error('Logout failed.');
    }
  };

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="aurora-bg"></div>
      <header className="py-4 px-8 flex justify-between items-center border-b border-border/20 shadow-sm">
        <h1 className="text-3xl font-bold text-primary">Password Vault</h1>
        <div className="flex items-center space-x-4">
          <p className="text-muted-foreground hidden sm:block">Welcome, {user?.email}</p>
          <ThemeToggleButton />
          <button onClick={handleLogout} className="px-4 py-2 font-medium text-white bg-destructive rounded-md hover:bg-destructive/90 transition-colors">
            Logout
          </button>
        </div>
      </header>
      <main className="p-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-4">
            <PasswordGenerator />
          </div>
          <div className="lg:col-span-8">
            <Vault 
              entries={entries} 
              onAddEntry={handleAddEntryClick}
              onEditEntry={handleEditEntryClick}
              onDeleteEntry={handleDeleteEntry}
            />
          </div>
        </div>
      </main>
{isModalOpen && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4 animate-fade-in">
          <NewEntryForm 
            userId={user?.id}
            entryToEdit={editingEntry}
            onFormSubmit={handleFormSubmit} 
            onClose={() => setIsModalOpen(false)} 
          />
        </div>
      )}
    </div>
  );
}
