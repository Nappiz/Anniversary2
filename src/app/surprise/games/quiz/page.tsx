'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useGameProgress } from '../../../context/GameProgressContext';
import Button from '../../../components/ui/Button';
import QuizOption from '../../../components/games/QuizOption';
import WinModal from '../../../components/games/WinModal';
import { Heart, PartyPopper, RotateCcw } from 'lucide-react';
import clsx from 'clsx';

const quizData = [
  { id: 1, question: "Dimana First Date kita?", options: ["GM", "UKEX", "PM", "Cipcip"], answer: "A" },
  { id: 2, question: "Tanggal berapa First Date kita?", options: ["1 September", "25 Agustus", "20 Agustus", "25 Juli"], answer: "B" },
  { id: 3, question: "Film apa yang pertama kali kita tonton?", options: ["Pocong Gundul", "Sumala", "Pamali", "The Marvels"], answer: "A" },
  { id: 4, question: "Apa panggilan sayang kita pertama kali?", options: ["Cingku", "Bib", "Beb", "Sayang"], answer: "D" },
  { id: 5, question: "Dimana aku jemput kamu pertama kali setelah pacaran?", options: ["Serlok", "Despro", "Kos", "GM1"], answer: "D" },
  { id: 6, question: "Dimana tempat kita mulai pacaran?", options: ["Cipcip", "Mixue", "AADK", "Despro"], answer: "C" },
  { id: 7, question: "Lagu apa yang jadi 'lagu kita'?", options: ["Arjuna - Dewa19", "Fearless - Taylor Swift", "White Tee - Summer Walker", "Binks Sake - One Piece"], answer: "B" },
  { id: 8, question: "Lagu apa yang selalu ku nyanyiin selama libur Smt 1 ke 2?", options: ["Binks Sake", "Himawari no Yakusoku", "Nekomamushi", "Marigold"], answer: "C" },
  { id: 9, question: "Pada bulan apa biasanya kita punya masalah serius?", options: ["November", "Oktober", "Juni", "Januari"], answer: "A" },
  { id: 10, question: "Dimana tempat paling sering yang kita kunjungi di tahun 2023?", options: ["GM", "PM", "Unair C", "Kaza"], answer: "C" },
];

type GameState = 'playing' | 'gameOver' | 'won';

export default function QuizPage() {
  const router = useRouter();
  const { completeQuiz } = useGameProgress();

  const [gameState, setGameState] = useState<GameState>('playing');
  const [lives, setLives] = useState(2);
  const [lostIndex, setLostIndex] = useState<number | null>(null); // animasi pop saat nyawa berkurang
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [shake, setShake] = useState(false); // animasi shake saat salah
  const [justWonBurst, setJustWonBurst] = useState(false); // confetti saat menang (masuk state 'won')
  const [isWinModalOpen, setIsWinModalOpen] = useState(false);

  const currentQuestion = quizData[currentQuestionIndex];
  const progressPercentage = ((currentQuestionIndex + 1) / quizData.length) * 100;
  const isWrong = showFeedback && selectedAnswer !== currentQuestion.answer;

  // keyboard support simpel (A/B/C/D + Enter) di desktop
  useEffect(() => {
    if (gameState !== 'playing') return;
    const handle = (e: KeyboardEvent) => {
      if (showFeedback) {
        if (e.key === 'Enter') handleNextQuestion();
        return;
      }
      const key = e.key.toUpperCase();
      if (['A','B','C','D'].includes(key)) setSelectedAnswer(key);
      if (e.key === 'Enter' && selectedAnswer) handleSubmitAnswer();
    };
    window.addEventListener('keydown', handle);
    return () => window.removeEventListener('keydown', handle);
  }, [gameState, showFeedback, selectedAnswer]);

  // confetti kecil saat masuk state 'won'
  useEffect(() => {
    if (gameState === 'won') {
      setJustWonBurst(true);
      const t = setTimeout(() => setJustWonBurst(false), 1100);
      return () => clearTimeout(t);
    }
  }, [gameState]);

  const handleSelectOption = (choice: string) => {
    if (showFeedback || gameState !== 'playing') return;
    setSelectedAnswer(choice);
  };

  const handleSubmitAnswer = () => {
    if (!selectedAnswer || showFeedback || gameState !== 'playing') return;
    setShowFeedback(true);

    const correct = selectedAnswer === currentQuestion.answer;
    if (!correct) {
      setShake(true);
      setTimeout(() => setShake(false), 400);
      // kurangi nyawa dengan animasi pop pada "hati terakhir"
      setLostIndex(lives - 1);
      setTimeout(() => setLostIndex(null), 500);

      setLives(prev => {
        const next = prev - 1;
        if (next <= 0) {
          setTimeout(() => setGameState('gameOver'), 900);
        }
        return next;
      });
    }
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < quizData.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      setSelectedAnswer(null);
      setShowFeedback(false);
    } else {
      setGameState('won');
    }
  };

  const handleRestart = () => {
    setGameState('playing');
    setLives(2);
    setLostIndex(null);
    setCurrentQuestionIndex(0);
    setSelectedAnswer(null);
    setShowFeedback(false);
    setShake(false);
  };

  const handleWinGame = () => {
    // confetti singkat sebelum modal
    setJustWonBurst(true);
    setTimeout(() => {
      completeQuiz();
      setIsWinModalOpen(true);
      setJustWonBurst(false);
    }, 900);
  };

  const handleConfirmWin = () => {
    router.push('/surprise/games');
  };

  // dekorasi background lembut
  const SoftBackdrop = useMemo(() => (
    <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
      <div className="absolute -top-24 -left-24 h-72 w-72 rounded-full bg-pink-200/50 blur-3xl" />
      <div className="absolute top-32 -right-20 h-80 w-80 rounded-full bg-rose-200/60 blur-3xl" />
      <div className="absolute bottom-[-80px] left-1/2 -translate-x-1/2 h-72 w-[28rem] rounded-full bg-pink-100/70 blur-3xl" />
    </div>
  ), []);

  return (
    <>
      <div className="relative mx-auto max-w-5xl px-4 sm:px-6 pb-12">
        {SoftBackdrop}

        {/* Header ringkas */}
        <div className="text-center pt-2">
          <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-tr from-pink-500 to-rose-400 text-white shadow">
            <Heart />
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl font-extrabold tracking-tight text-pink-800">
            Kuis Kita
          </h1>
          <p className="mt-2 text-gray-700">Jawab yang bener yaa sayangg ! </p>
        </div>

        {gameState === 'playing' && (
          <div className="mx-auto mt-6 max-w-2xl">
            {/* Progress + Lives */}
            <div className="mb-5">
              <div className="flex items-center justify-between mb-2">
                <p className="text-gray-700 font-semibold">
                  Pertanyaan {currentQuestionIndex + 1} dari {quizData.length}
                </p>
                <div className="flex items-center gap-2">
                  {Array.from({ length: 2 }).map((_, i) => {
                    const alive = i < lives;
                    const willPop = lostIndex === i;
                    return (
                      <span
                        key={i}
                        className={clsx(
                          'inline-flex items-center justify-center',
                          willPop && 'animate-[pop_0.45s_ease-out]'
                        )}
                        aria-label={alive ? 'Nyawa tersisa' : 'Nyawa hilang'}
                      >
                        <Heart
                          className={clsx(
                            'h-6 w-6',
                            alive ? 'text-rose-500 fill-current drop-shadow' : 'text-gray-300'
                          )}
                        />
                      </span>
                    );
                  })}
                </div>
              </div>
              <div className="w-full h-2.5 rounded-full bg-pink-200 overflow-hidden">
                <div
                  className="h-2.5 rounded-full bg-gradient-to-r from-pink-500 to-rose-400 transition-all duration-500"
                  style={{ width: `${progressPercentage}%` }}
                  aria-hidden
                />
              </div>
            </div>

            {/* Card soal */}
            <div
              className={clsx(
                'bg-white/70 backdrop-blur p-6 sm:p-8 rounded-2xl shadow-[0_12px_36px_rgba(236,72,153,0.12)] ring-1 ring-white/60',
                shake && 'animate-[shake_0.35s_ease-in-out]'
              )}
            >
              <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center font-serif">
                {currentQuestion.question}
              </h2>

              <div className="space-y-4">
                {currentQuestion.options.map((option, index) => {
                  const choiceLetter = String.fromCharCode(65 + index) as 'A' | 'B' | 'C' | 'D';
                  const isCorrect = showFeedback && choiceLetter === currentQuestion.answer;
                  const isIncorrect = showFeedback && selectedAnswer === choiceLetter && choiceLetter !== currentQuestion.answer;
                  return (
                    <QuizOption
                      key={index}
                      choiceLetter={choiceLetter}
                      choiceText={option}
                      onClick={() => handleSelectOption(choiceLetter)}
                      isSelected={selectedAnswer === choiceLetter}
                      isCorrect={isCorrect}
                      isIncorrect={isIncorrect}
                      disabled={showFeedback}
                    />
                  );
                })}
              </div>

              {/* Feedback kecil */}
              <div className="min-h-8 mt-3 text-center" aria-live="polite">
                {showFeedback && isWrong && (
                  <p className="text-sm font-semibold text-rose-600">Ups, salah sayang. Kamu bisaa! 🫶</p>
                )}
                {showFeedback && !isWrong && (
                  <p className="text-sm font-semibold text-emerald-600">Yay! Jawabanmu benar ✨</p>
                )}
              </div>

              <div className="mt-6 text-center">
                {!showFeedback && selectedAnswer && (
                  <Button onClick={handleSubmitAnswer} className="!bg-emerald-600 hover:!bg-emerald-700">
                    Jawab
                  </Button>
                )}
                {showFeedback && (
                  <Button onClick={handleNextQuestion}>
                    {currentQuestionIndex < quizData.length - 1 ? 'Lanjut' : 'Selesai'}
                  </Button>
                )}
              </div>
            </div>
          </div>
        )}

        {gameState === 'gameOver' && (
          <div className="flex flex-col items-center justify-center text-center mt-12 p-4">
            <div className="bg-white/80 backdrop-blur p-8 rounded-2xl shadow-[0_12px_36px_rgba(0,0,0,0.08)] ring-1 ring-white/60 max-w-md mx-auto">
              <h1 className="text-4xl font-bold text-rose-600">Game Over</h1>
              <p className="text-gray-700 mt-3">Aduu gimana sii sayangg, coba lagi yaa—aku yakin bisa 💗</p>
              <Button onClick={handleRestart} className="mt-6 !bg-rose-600 hover:!bg-rose-700">
                <div className="flex items-center gap-2">
                  <RotateCcw size={20} /> <span>Coba Lagi</span>
                </div>
              </Button>
            </div>
          </div>
        )}

        {gameState === 'won' && (
          <div className="relative mt-8">
            <div className="bg-white/80 backdrop-blur p-8 rounded-2xl shadow-[0_18px_50px_rgba(236,72,153,0.15)] ring-1 ring-white/60 max-w-4xl mx-auto text-center">
              <h1 className="text-3xl font-bold text-gray-800">Kamu Menang! 🥳</h1>
              <p className="text-gray-600 mt-2 mb-8">OMO! Kamu menang sayang. Sekarang, buka hadiahnya! 😉</p>
              <Button onClick={handleWinGame}>
                <div className="flex items-center gap-2">
                  <PartyPopper size={20} /> <span>Lanjut</span>
                </div>
              </Button>
            </div>
            {(justWonBurst) && <HeartsConfetti />}
          </div>
        )}
      </div>

      <WinModal isOpen={isWinModalOpen} onConfirm={handleConfirmWin} />

      {/* Keyframes kecil (inline biar tanpa ubah file lain) */}
      <style jsx global>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          20% { transform: translateX(-6px); }
          40% { transform: translateX(6px); }
          60% { transform: translateX(-4px); }
          80% { transform: translateX(4px); }
        }
        @keyframes pop {
          0% { transform: scale(.8); opacity: .6; }
          60% { transform: scale(1.15); opacity: 1; }
          100% { transform: scale(1); opacity: 1; }
        }
        @keyframes heart-fall {
          0% { transform: translateY(-20px) scale(.8) rotate(0deg); opacity: 0; }
          10% { opacity: 1; }
          100% { transform: translateY(140px) scale(1) rotate(18deg); opacity: 0; }
        }
      `}</style>
    </>
  );
}

/* ====== Confetti kecil saat menang ====== */
function HeartsConfetti() {
  const items = Array.from({ length: 18 }).map((_, i) => {
    const left = 5 + (i * 12) % 90;
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
