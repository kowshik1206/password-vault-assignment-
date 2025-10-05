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
    const lowercaseChars = "abcdefghijkmnopqrstuvwxyz"; // Excluded l
    const uppercaseChars = "ABCDEFGHJKLMNPQRSTUVWXYZ"; // Excluded I, O
    const numberChars = "23456789"; // Excluded 0, 1
    const symbolChars = "!@#$%^&*()_+-=[]{}|;:,.<>?";
    const lookalikeChars = "lIO01";

    let charPool = lowercaseChars;
    if (includeUppercase) charPool += uppercaseChars;
    if (includeNumbers) charPool += numberChars;
    if (includeSymbols) charPool += symbolChars;
    if (!excludeLookalikes) charPool += lookalikeChars;

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
      setTimeout(() => setCopied(false), 3000);
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
    <div className="w-full p-6 space-y-6 glass-card rounded-2xl shadow-lg">
      <h2 className="text-2xl font-bold text-center text-foreground">Password Generator</h2>

      <div className="relative flex items-center">
        <input
          type="text"
          readOnly
          value={password}
          placeholder="Your generated password"
          className="w-full p-4 pr-24 text-lg bg-muted/50 border border-input rounded-lg font-mono focus:outline-none focus:ring-2 focus:ring-primary truncate"
        />
        <button
          onClick={copyToClipboard}
          className="absolute inset-y-0 right-0 px-4 text-sm font-medium text-primary-foreground bg-primary rounded-r-lg hover:bg-primary/90 transition-colors flex items-center disabled:opacity-50"
          disabled={!password}
        >
          {copied ? "Copied!" : "Copy"}
        </button>
      </div>

      <div className="space-y-5">
        <div className="flex items-center justify-between">
          <label htmlFor="length" className="font-medium text-muted-foreground">
            Password Length
          </label>
          <span className="text-lg font-semibold">{length}</span>
        </div>
        <input
          id="length"
          type="range"
          min="6"
          max="64"
          value={length}
          onChange={(e) => setLength(parseInt(e.target.value))}
          className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer accent-primary"
        />

        <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
          <motion.div 
            className={`h-full ${strengthColors[strength -1]}`}
            initial={{ width: 0 }}
            animate={{ width: `${(strength / 5) * 100}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
          <label className="flex items-center space-x-3 p-3 bg-muted/50 rounded-lg cursor-pointer hover:bg-muted transition-colors">
            <input
              type="checkbox"
              checked={includeUppercase}
              onChange={(e) => setIncludeUppercase(e.target.checked)}
              className="w-5 h-5 text-primary rounded border-gray-300 focus:ring-primary focus:ring-2"
            />
            <span className="text-sm font-medium text-muted-foreground">Include Uppercase</span>
          </label>

          <label className="flex items-center space-x-3 p-3 bg-muted/50 rounded-lg cursor-pointer hover:bg-muted transition-colors">
            <input
              type="checkbox"
              checked={includeNumbers}
              onChange={(e) => setIncludeNumbers(e.target.checked)}
              className="w-5 h-5 text-primary rounded border-gray-300 focus:ring-primary focus:ring-2"
            />
            <span className="text-sm font-medium text-muted-foreground">Include Numbers</span>
          </label>

          <label className="flex items-center space-x-3 p-3 bg-muted/50 rounded-lg cursor-pointer hover:bg-muted transition-colors">
            <input
              type="checkbox"
              checked={includeSymbols}
              onChange={(e) => setIncludeSymbols(e.target.checked)}
              className="w-5 h-5 text-primary rounded border-gray-300 focus:ring-primary focus:ring-2"
            />
            <span className="text-sm font-medium text-muted-foreground">Include Symbols</span>
          </label>

          <label className="flex items-center space-x-3 p-3 bg-muted/50 rounded-lg cursor-pointer hover:bg-muted transition-colors">
            <input
              type="checkbox"
              checked={excludeLookalikes}
              onChange={(e) => setExcludeLookalikes(e.target.checked)}
              className="w-5 h-5 text-primary rounded border-gray-300 focus:ring-primary focus:ring-2"
            />
            <span className="text-sm font-medium text-muted-foreground">Exclude Look-Alikes</span>
          </label>
        </div>
      </div>

      <button
        onClick={generatePassword}
        className="w-full flex items-center justify-center px-4 py-3 font-bold text-lg text-primary-foreground bg-primary rounded-lg hover:bg-primary/90 transition-colors shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
      >
        <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h5M20 20v-5h-5M4 20h5v-5M20 4h-5v5"></path></svg>
        Generate New Password
      </button>
    </div>
  );
}