'use client';

import { useGameProgress } from '../../context/GameProgressContext';
import { useLock } from '../../context/LockContext';
import GameCard from '../../components/games/GameCard';
import Button from '../../components/ui/Button';
import { Puzzle, HelpCircle, PartyPopper } from 'lucide-react';

export default function GameHubPage() {
  const { quizCompleted, puzzleCompleted } = useGameProgress();
  const { unlock } = useLock();
  const allGamesCompleted = quizCompleted && puzzleCompleted;

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-8 text-center">
      <h1 className="font-serif text-4xl font-bold tracking-tight text-pink-800 sm:text-5xl">
        Pilih Games
      </h1>
      <p className="mt-4 text-lg leading-8 text-gray-600">
        Untuk buka semua petualangan kita, kamu harus selesaiin gamesnya dulu!
      </p>

      <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-8">
        <GameCard
          title="Kuis Kita"
          description="Seberapa baik kamu mengenalku dan cerita kita?"
          href="/surprise/games/quiz"
          isCompleted={quizCompleted}
          icon={<HelpCircle size={32} />}
        />
        <GameCard
          title="Susun Puzzle"
          description="Satukan kembali kepingan kenangan kita."
          href="/surprise/games/puzzle"
          isCompleted={puzzleCompleted}
          icon={<Puzzle size={32} />}
        />
      </div>

      {allGamesCompleted && (
        <div className="mt-16 bg-white p-8 rounded-2xl shadow-2xl animate-pulse">
          <h2 className="text-2xl font-bold text-gray-800">Semua Games Selesai!</h2>
          <p className="text-gray-600 mt-2 mb-8">Keren bangett sayangg! Karena kamu udah menang, ini kuncinya! 🔑</p>
          <Button onClick={unlock}>
            <div className="flex items-center gap-2">
              <PartyPopper size={20} />
              <span>Aku Menang! Buka Kuncinya</span>
            </div>
          </Button>
        </div>
      )}
    </div>
  );
}