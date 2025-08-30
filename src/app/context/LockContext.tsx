// app/context/LockContext.tsx
'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface LockContextType {
  isUnlocked: boolean;
  unlock: () => void;
}

const LockContext = createContext<LockContextType | undefined>(undefined);

export function LockProvider({ children }: { children: ReactNode }) {
  // 1. Render pertama SELALU 'false' agar konsisten dengan server.
  const [isUnlocked, setIsUnlocked] = useState(false);

  // 2. useEffect HANYA berjalan di client SETELAH render pertama.
  //    Di sinilah kita aman untuk mengecek localStorage.
  useEffect(() => {
    const unlockedStatus = localStorage.getItem('isUnlocked');
    if (unlockedStatus === 'true') {
      setIsUnlocked(true);
    }
  }, []); // Dependensi kosong '[]' berarti hanya berjalan sekali saat mount.

  const unlock = () => {
    localStorage.setItem('isUnlocked', 'true');
    setIsUnlocked(true);
  };

  return (
    <LockContext.Provider value={{ isUnlocked, unlock }}>
      {children}
    </LockContext.Provider>
  );
}

export function useLock() {
  const context = useContext(LockContext);
  if (context === undefined) {
    throw new Error('useLock must be used within a LockProvider');
  }
  return context;
}