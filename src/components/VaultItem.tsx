'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { VaultEntry } from './Dashboard';
import { decrypt } from '@/lib/crypto';

interface VaultItemProps {
  entry: VaultEntry;
  onEdit: () => void;
  onDelete: () => void;
}

export default function VaultItem({ entry, onEdit, onDelete }: VaultItemProps) {
  const [isFlipped, setIsFlipped] = useState(false);
  const [decryptedPassword, setDecryptedPassword] = useState('');
  const [copied, setCopied] = useState(false);

  const handleCardClick = () => {
    if (!isFlipped && !decryptedPassword) {
      try {
        const decrypted = decrypt(entry.password);
        setDecryptedPassword(decrypted);
      } catch (e) {
        console.error("Decryption failed:", e);
        setDecryptedPassword("DECRYPTION FAILED");
      }
    }
    setIsFlipped(!isFlipped);
  };

  const copyPassword = (e: React.MouseEvent) => {
    e.stopPropagation();
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
    <div className="perspective-1000">
      <motion.div 
        className="relative w-full h-full transition-transform duration-700 transform-style-preserve-3d"
        initial={false}
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        onClick={handleCardClick}
      >
        {/* Front of the card */}
        <div className="absolute w-full h-full backface-hidden">
          <div className="bg-card glass-card border border-border/20 rounded-lg shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col h-full group p-6">
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
            </div>

            {entry.url && (
              <a href={entry.url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sm text-primary hover:underline break-all mb-4">
                <svg className="w-4 h-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.72"></path><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.72-1.72"></path></svg>
                {entry.url}
              </a>
            )}
          </div>
        </div>

        {/* Back of the card */}
        <div className="absolute w-full h-full backface-hidden transform rotate-y-180">
          <div className="bg-card glass-card border border-border/20 rounded-lg shadow-lg flex flex-col h-full p-6 items-center justify-center">
            <p className="text-lg font-mono text-foreground break-all">{decryptedPassword}</p>
            <div className="flex items-center gap-4 mt-4">
              <button onClick={copyPassword} className="px-4 py-2 text-sm font-medium text-primary-foreground bg-primary rounded-md hover:bg-primary/90 transition-colors">
                {copied ? 'Copied!' : 'Copy'}
              </button>
              <button onClick={onEdit} className="p-2 text-muted-foreground hover:text-primary transition-colors rounded-full"><svg className="w-5 h-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"></path></svg></button>
              <button onClick={onDelete} className="p-2 text-destructive hover:text-destructive/80 transition-colors rounded-full"><svg className="w-5 h-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg></button>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}