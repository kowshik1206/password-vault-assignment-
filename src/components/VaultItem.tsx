'use client';

import { useState } from 'react';
import { VaultEntry } from './Dashboard';
import { decrypt } from '@/lib/crypto';

interface VaultItemProps {
  entry: VaultEntry;
  onEdit: () => void;
  onDelete: () => void;
}

export default function VaultItem({ entry, onEdit, onDelete }: VaultItemProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [decryptedPassword, setDecryptedPassword] = useState('');
  const [copied, setCopied] = useState(false);

  const handleShowPassword = () => {
    if (!showPassword && !decryptedPassword) {
      try {
        const decrypted = decrypt(entry.password);
        setDecryptedPassword(decrypted);
      } catch (e) {
        console.error("Decryption failed:", e);
        setDecryptedPassword("DECRYPTION FAILED");
      }
    }
    setShowPassword(!showPassword);
  };

  const copyPassword = () => {
    let passwordToCopy = decryptedPassword;
    if (!passwordToCopy) {
      try {
        passwordToCopy = decrypt(entry.password);
        setDecryptedPassword(passwordToCopy); // Cache for later
      } catch (e) {
        console.error("Decryption failed:", e);
        alert("Failed to decrypt password for copying.");
        return;
      }
    }

    navigator.clipboard.writeText(passwordToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  return (
    <div className="bg-card border border-border rounded-lg shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col h-full group p-6">
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-primary/10 text-primary rounded-lg flex items-center justify-center transition-transform duration-300 group-hover:scale-110">
              <svg className="w-6 h-6" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
          </div>
          <div>
            <h3 className="text-lg font-bold text-foreground group-hover:text-primary transition-colors duration-300">{entry.title}</h3>
            <p className="text-sm text-muted-foreground">{entry.username}</p>
          </div>
        </div>
        <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <button onClick={onEdit} className="p-2 text-muted-foreground hover:text-primary transition-colors rounded-full"><svg className="w-5 h-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"></path></svg></button>
          <button onClick={onDelete} className="p-2 text-destructive hover:text-destructive/80 transition-colors rounded-full"><svg className="w-5 h-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg></button>
        </div>
      </div>

      {entry.url && (
        <a href={entry.url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sm text-primary hover:underline break-all mb-4">
          <svg className="w-4 h-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.72"></path><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.72-1.72"></path></svg>
          {entry.url}
        </a>
      )}

      <div className="flex items-center justify-between bg-muted/50 p-3 rounded-md">
        <p className="text-sm font-mono text-muted-foreground break-all select-none" onDoubleClick={handleShowPassword}>
          {showPassword ? decryptedPassword : '********'}
        </p>
        <div className="flex items-center gap-2">
          <button onClick={handleShowPassword} className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
            {showPassword ? 
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg> :
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5"><path d="M9.88 9.88a3 3 0 1 0 4.24 4.24"/><path d="M10.73 10.73C12.55 9.24 15.4 8.5 18.5 9.5c3.1.99 5.5 3.1 6.5 5.5.5 1.2.5 2.8 0 4-.5 1.2-1.4 2.3-2.5 3-1.1.7-2.5.9-4 .5-1.5-.4-2.9-1.2-4-2.2"/><path d="m2 2 20 20"/></svg>
            }
          </button>
          <button onClick={copyPassword} className="px-3 py-1 text-sm font-medium text-primary-foreground bg-primary rounded-md hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed" disabled={!decryptedPassword && !showPassword}>
            {copied ? 'Copied!' : 'Copy'}
          </button>
        </div>
      </div>
    </div>
  );
}