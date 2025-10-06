'use client';

import CryptoJS from 'crypto-js';

// Ensure the secret key is a string and is handled securely.
// It's critical that this key is not hard-coded in a real application.
// For this example, we'll use a placeholder key. In a real app, this should
// be derived from the user's password or managed in a secure way.
const secretKey = process.env.NEXT_PUBLIC_CRYPTO_SECRET || 'default-secret-key-that-is-not-secure';

if (process.env.NODE_ENV !== 'production' && secretKey === 'default-secret-key-that-is-not-secure') {
  console.warn('Warning: Using a default, insecure secret key for encryption. Please set NEXT_PUBLIC_CRYPTO_SECRET in your environment.');
}

// Encrypt function
export const encrypt = (text: string): string => {
  if (!text) return '';
  return CryptoJS.AES.encrypt(text, secretKey).toString();
};

// Decrypt function
export const decrypt = (ciphertext: string): string => {
  if (!ciphertext) return '';
  const bytes = CryptoJS.AES.decrypt(ciphertext, secretKey);
  return bytes.toString(CryptoJS.enc.Utf8);
};
