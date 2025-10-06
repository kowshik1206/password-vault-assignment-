
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Plus, Lock, Settings, LogOut } from 'lucide-react';
import { ThemeToggleButton } from './ThemeToggleButton';
import { useRouter } from 'next/navigation';

const Sidebar = () => {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      router.push('/login');
    } catch (err) {
      alert('Logout failed.');
    }
  };

  const navItems = [
    { href: '/dashboard', label: 'Dashboard', icon: Home },
    { href: '/dashboard/add-entry', label: 'Add Entry', icon: Plus },
    { href: '/dashboard/password-generator', label: 'Password Generator', icon: Lock },
    { href: '/dashboard/settings', label: 'Settings', icon: Settings },
  ];

  return (
    <aside className="w-64 bg-card border-r border-border flex flex-col">
      <div className="p-6">
        <h2 className="text-2xl font-bold text-primary">Password Vault</h2>
      </div>
      <nav className="flex-grow px-4">
        {navItems.map((item) => (
          <Link
            key={item.label}
            href={item.href}
            className={`flex items-center px-4 py-3 my-1 text-lg rounded-lg transition-colors ${
              pathname === item.href
                ? 'bg-primary text-primary-foreground'
                : 'hover:bg-muted'
            }`}
          >
            <item.icon className="w-6 h-6 mr-4" />
            {item.label}
          </Link>
        ))}
      </nav>
      <div className="p-4 border-t border-border">
        <ThemeToggleButton />
        <button
          onClick={handleLogout}
          className="flex items-center w-full px-4 py-3 mt-2 text-lg text-left text-red-500 rounded-lg hover:bg-muted"
        >
          <LogOut className="w-6 h-6 mr-4" />
          Logout
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
