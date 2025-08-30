// app/context/GameProgressContext.tsx
'use client';

// IMPORT useCallback dan useMemo
import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback, useMemo } from 'react';

interface GameProgress {
  quizCompleted: boolean;
  puzzleCompleted: boolean;
}

interface GameProgressContextType extends GameProgress {
  completeQuiz: () => void;
  completePuzzle: () => void;
}

const GameProgressContext = createContext<GameProgressContextType | undefined>(undefined);

const getInitialState = (): GameProgress => {
  if (typeof window === 'undefined') {
    return { quizCompleted: false, puzzleCompleted: false };
  }
  const savedProgress = localStorage.getItem('gameProgress');
  return savedProgress ? JSON.parse(savedProgress) : { quizCompleted: false, puzzleCompleted: false };
};

export function GameProgressProvider({ children }: { children: ReactNode }) {
  const [progress, setProgress] = useState<GameProgress>(getInitialState);

  useEffect(() => {
    localStorage.setItem('gameProgress', JSON.stringify(progress));
  }, [progress]);

  // Bungkus fungsi dengan useCallback
  const completeQuiz = useCallback(() => {
    setProgress(p => ({ ...p, quizCompleted: true }));
  }, []); // Dependensi kosong berarti fungsi ini hanya dibuat sekali

  // Bungkus fungsi dengan useCallback
  const completePuzzle = useCallback(() => {
    setProgress(p => ({ ...p, puzzleCompleted: true }));
  }, []); // Dependensi kosong berarti fungsi ini hanya dibuat sekali

  // Bungkus nilai context dengan useMemo untuk stabilitas
  const value = useMemo(() => ({
    ...progress,
    completeQuiz,
    completePuzzle,
  }), [progress, completeQuiz, completePuzzle]);

  return (
    <GameProgressContext.Provider value={value}>
      {children}
    </GameProgressContext.Provider>
  );
}

export function useGameProgress() {
  const context = useContext(GameProgressContext);
  if (!context) {
    throw new Error('useGameProgress must be used within a GameProgressProvider');
  }
  return context;
}