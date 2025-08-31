'use client';

import { useState } from 'react';
import { useGameProgress } from '../../context/GameProgressContext';
import { useLock } from '../../context/LockContext';
import GameCard from '../../components/games/GameCard';
import Button from '../../components/ui/Button';
import { Puzzle, HelpCircle, PartyPopper, Heart, Sparkles } from 'lucide-react';
import clsx from 'clsx';

export default function GameHubPage() {
  const { quizCompleted, puzzleCompleted } = useGameProgress();
  const { unlock } = useLock();
  const allGamesCompleted = quizCompleted && puzzleCompleted;
  const [celebrate, setCelebrate] = useState(false);

  const handleUnlock = () => {
    setCelebrate(true);
    setTimeout(() => {
      unlock();
      setCelebrate(false);
    }, 900); // beri waktu confetti tampil
  };

  return (
    <div className="relative mx-auto max-w-5xl px-4 sm:px-6 pb-12">
      {/* dekorasi lembut */}
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -top-20 -left-24 h-72 w-72 rounded-full bg-pink-200/50 blur-3xl" />
        <div className="absolute top-48 -right-16 h-80 w-80 rounded-full bg-rose-200/60 blur-3xl" />
        <div className="absolute bottom-[-80px] left-1/2 -translate-x-1/2 h-72 w-[28rem] rounded-full bg-pink-100/70 blur-3xl" />
      </div>

      {/* hero */}
      <header className="text-center pt-2">
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-tr from-pink-500 to-rose-400 text-white shadow">
          <Heart />
        </div>
        <h1 className="font-serif text-4xl sm:text-5xl font-extrabold tracking-tight text-pink-800">
          Pilih Games
        </h1>
        <p className="mt-3 text-gray-700">
          Untuk buka semua petualangan kita, kamu harus selesaiin gamesnya dulu!
        </p>

        {/* progress pills */}
        <div className="mt-5 flex flex-wrap items-center justify-center gap-2">
          <StatusPill label="Kuis Kita" done={quizCompleted} />
          <StatusPill label="Susun Puzzle" done={puzzleCompleted} />
        </div>
      </header>

      {/* grid */}
      <section className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
        <GameCard
          title="Kuis Kita"
          description="Seberapa baik kamu inget cerita kita?"
          href="/surprise/games/quiz"
          isCompleted={quizCompleted}
          icon={<HelpCircle size={32} />}
        />
        <GameCard
          title="Susun Puzzle"
          description="Satukan kembali kepingan kita."
          href="/surprise/games/puzzle"
          isCompleted={puzzleCompleted}
          icon={<Puzzle size={32} />}
        />
      </section>

      {/* celebrate / unlock */}
      <section className="mt-12">
        {allGamesCompleted ? (
          <div className="relative overflow-hidden rounded-3xl border border-white/60 bg-white/70 backdrop-blur p-8 shadow-[0_18px_50px_rgba(236,72,153,0.15)]">
            <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-tr from-pink-500 to-rose-400 text-white shadow">
              <Sparkles />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 text-center">Semua Games Selesai! 🎉</h2>
            <p className="text-gray-600 mt-2 mb-6 text-center">
              Keren bangett sayangg! Karena kamu udah menang, ini kuncinya! 🔑
            </p>

            <div className="flex justify-center">
              <Button onClick={handleUnlock}>
                <div className="flex items-center gap-2">
                  <PartyPopper size={20} />
                  <span>Aku Menang! Buka Kuncinya</span>
                </div>
              </Button>
            </div>

            {celebrate && <HeartsConfetti />}
          </div>
        ) : (
          <div className="rounded-3xl border border-white/60 bg-white/70 backdrop-blur p-6 text-center text-sm text-pink-800/80">
            Tip: selesaikan kedua game untuk membuka <b>Journey</b>, <b>Future</b>, <b>Gallery</b>, dan <b>Untuk Kamu</b> ✨
          </div>
        )}
      </section>

      {/* keyframes inline */}
      <style jsx global>{`
        @keyframes heart-fall {
          0% { transform: translateY(-20px) scale(.8) rotate(0deg); opacity: 0; }
          10% { opacity: 1; }
          100% { transform: translateY(140px) scale(1) rotate(18deg); opacity: 0; }
        }
      `}</style>
    </div>
  );
}

/* ====== kecil2 ====== */

function StatusPill({ label, done }: { label: string; done: boolean }) {
  return (
    <span
      className={clsx(
        'inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-sm font-semibold shadow-sm ring-1',
        done
          ? 'bg-emerald-50 text-emerald-700 ring-emerald-200'
          : 'bg-pink-50 text-pink-700 ring-pink-200'
      )}
    >
      <span
        className={clsx(
          'h-2 w-2 rounded-full',
          done ? 'bg-emerald-500' : 'bg-pink-500'
        )}
      />
      {label} {done ? '• Selesai' : '• Belum'}
    </span>
  );
}

function HeartsConfetti() {
  const items = Array.from({ length: 16 }).map((_, i) => {
    const left = 10 + (i * 80) % 80; // base offset
    const delay = 30 * i;
    const size = 14 + (i % 3) * 3;
    const emoji = ['💖','💕','💗','💞'][i % 4];
    return { left: `${left}%`, delay: `${delay}ms`, size, emoji };
  });

  return (
    <div className="pointer-events-none absolute inset-0">
      {items.map((h, i) => (
        <span
          key={i}
          className="absolute top-0 select-none"
          style={{
            left: h.left,
            fontSize: h.size,
            animation: `heart-fall 900ms ease-out ${h.delay} both`,
            filter: 'drop-shadow(0 8px 20px rgba(236,72,153,.35))',
          }}
        >
          {h.emoji}
        </span>
      ))}
    </div>
  );
}
