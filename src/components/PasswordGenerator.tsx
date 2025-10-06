'use client';
import { useState, useEffect } from "react";
import { motion } from "framer-motion";

export default function PasswordGenerator() {
  const [length, setLength] = useState(12);
  const [includeUppercase, setIncludeUppercase] = useState(true);
  const [includeNumbers, setIncludeNumbers] = useState(true);
  const [includeSymbols, setIncludeSymbols] = useState(true);
  const [excludeLookalikes, setExcludeLookalikes] = useState(true);
  const [password, setPassword] = useState("");
  const [copied, setCopied] = useState(false);
  const [strength, setStrength] = useState(0);

  const calculateStrength = () => {
    let score = 0;
    if (length >= 12) score++;
    if (length >= 16) score++;
    if (includeUppercase) score++;
    if (includeNumbers) score++;
    if (includeSymbols) score++;
    setStrength(score);
  };

  useEffect(() => {
    calculateStrength();
  }, [length, includeUppercase, includeNumbers, includeSymbols]);

  const generatePassword = () => {
    const lowercaseChars = "abcdefghijkmnopqrstuvwxyz";
    const uppercaseChars = "ABCDEFGHJKLMNPQRSTUVWXYZ";
    const numberChars = "23456789";
    const symbolChars = "!@#$%^&*()_+-=[]{}|;:,.<>?";
    
    let charPool = lowercaseChars;
    if (includeUppercase) charPool += uppercaseChars;
    if (includeNumbers) charPool += numberChars;
    if (includeSymbols) charPool += symbolChars;

    if (excludeLookalikes) {
        charPool = charPool.replace(/[iloIO01]/g, '');
    }

    let newPassword = "";
    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * charPool.length);
      newPassword += charPool[randomIndex];
    }
    setPassword(newPassword);
    setCopied(false);
  };

  const copyToClipboard = () => {
    if (password) {
      navigator.clipboard.writeText(password);
      setCopied(true);
      setTimeout(() => {
        navigator.clipboard.writeText('');
        setCopied(false);
      }, 10000); // Clear after 10 seconds
    }
  };

  const strengthColors = [
    "bg-red-500",
    "bg-orange-500",
    "bg-yellow-500",
    "bg-lime-500",
    "bg-green-500",
  ];

  return (
    <div className="p-6 bg-card rounded-lg border shadow-sm">
      <h2 className="text-2xl font-bold text-foreground mb-4">Password Generator</h2>
      
      <div className="relative mb-4">
        <input
          type="text"
          readOnly
          value={password}
          className="w-full pr-20 py-3 pl-4 text-lg font-mono bg-muted rounded-lg border-0"
          placeholder="Your password here"
        />
        <button
          onClick={copyToClipboard}
          className="absolute right-2 top-1/2 -translate-y-1/2 px-4 py-2 text-sm font-medium text-primary-foreground bg-primary rounded-md hover:bg-primary/90 transition-colors"
        >
          {copied ? "Copied!" : "Copy"}
        </button>
      </div>

      <div className="flex items-center justify-between mb-4">
        <span className="text-sm font-medium text-muted-foreground">Strength</span>
        <div className="flex items-center gap-2">
          {Array.from({ length: 5 }).map((_, index) => (
            <div
              key={index}
              className={`h-2 w-8 rounded-full ${strength > index ? strengthColors[strength-1] : 'bg-muted'}`}
            />
          ))}
        </div>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <label htmlFor="length" className="flex justify-between text-sm font-medium text-muted-foreground">
            Password Length <span>{length}</span>
          </label>
          <input
            id="length"
            type="range"
            min="8"
            max="64"
            value={length}
            onChange={(e) => setLength(parseInt(e.target.value))}
            className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer accent-primary"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex items-center gap-3">
                <input id="uppercase" type="checkbox" checked={includeUppercase} onChange={(e) => setIncludeUppercase(e.target.checked)} className="w-5 h-5 text-primary rounded border-gray-300 focus:ring-primary focus:ring-2" />
                <label htmlFor="uppercase" className="text-sm font-medium text-foreground">Include Uppercase</label>
            </div>
            <div className="flex items-center gap-3">
                <input id="numbers" type="checkbox" checked={includeNumbers} onChange={(e) => setIncludeNumbers(e.target.checked)} className="w-5 h-5 text-primary rounded border-gray-300 focus:ring-primary focus:ring-2" />
                <label htmlFor="numbers" className="text-sm font-medium text-foreground">Include Numbers</label>
            </div>
            <div className="flex items-center gap-3">
                <input id="symbols" type="checkbox" checked={includeSymbols} onChange={(e) => setIncludeSymbols(e.target.checked)} className="w-5 h-5 text-primary rounded border-gray-300 focus:ring-primary focus:ring-2" />
                <label htmlFor="symbols" className="text-sm font-medium text-foreground">Include Symbols</label>
            </div>
            <div className="flex items-center gap-3">
                <input id="lookalikes" type="checkbox" checked={excludeLookalikes} onChange={(e) => setExcludeLookalikes(e.target.checked)} className="w-5 h-5 text-primary rounded border-gray-300 focus:ring-primary focus:ring-2" />
                <label htmlFor="lookalikes" className="text-sm font-medium text-foreground">Exclude Look-Alikes</label>
            </div>
        </div>

        <button
          onClick={generatePassword}
          className="w-full inline-flex items-center justify-center px-4 py-3 text-base font-medium text-primary-foreground bg-primary rounded-md hover:bg-primary/90 transition-colors"
        >
          Generate New Password
        </button>
      </div>
    </div>
  );
}