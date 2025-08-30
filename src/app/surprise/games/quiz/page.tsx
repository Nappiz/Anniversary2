'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useGameProgress } from '../../../context/GameProgressContext';
import Button from '../../../components/ui/Button';
import QuizOption from '../../../components/games/QuizOption';
import WinModal from '../../../components/games/WinModal'; 
import { Heart, PartyPopper, RotateCcw } from 'lucide-react';

const quizData = [
  { id: 1, question: "Dimana First Date kita?", options: ["GM", "UKEX", "PM", "Cipcip"], answer: "A" },
  { id: 2, question: "Tanggal berapa First Date kita?", options: ["1 September", "25 Agustus", "20 Agustus", "25 Juli"], answer: "B" },
  { id: 3, question: "Film apa yang pertama kali kita tonton bersama?", options: ["Pocong Gundul", "Sumala", "Pamali", "The Marvels"], answer: "A" },
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
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [isWinModalOpen, setIsWinModalOpen] = useState(false); 

  const currentQuestion = quizData[currentQuestionIndex];
  const progressPercentage = ((currentQuestionIndex + 1) / quizData.length) * 100;

  const handleSelectOption = (choice: string) => { if (showFeedback) return; setSelectedAnswer(choice); };
  const handleSubmitAnswer = () => {
    if (!selectedAnswer) return;
    setShowFeedback(true);
    if (selectedAnswer !== currentQuestion.answer) {
      setLives(prev => prev - 1);
      if (lives - 1 <= 0) { setTimeout(() => setGameState('gameOver'), 1500); }
    }
  };
  const handleNextQuestion = () => {
    if (currentQuestionIndex < quizData.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      setSelectedAnswer(null); setShowFeedback(false);
    } else { setGameState('won'); }
  };
  const handleRestart = () => {
    setGameState('playing'); setLives(2); setCurrentQuestionIndex(0);
    setSelectedAnswer(null); setShowFeedback(false);
  };
  const handleWinGame = () => {
    completeQuiz();
    setIsWinModalOpen(true);
  };
  const handleConfirmWin = () => {
    router.push('/surprise/games');
  };

  return (
    <>
      <div className="w-full">
        {gameState === 'playing' && (
          <div className="max-w-2xl mx-auto p-4 sm:p-8">
            <div className="mb-8">
              <div className="flex justify-between items-center mb-2">
                <p className="text-gray-700 font-semibold">Pertanyaan {currentQuestionIndex + 1} dari {quizData.length}</p>
                <div className="flex items-center gap-2">
                  {Array.from({ length: lives }).map((_, i) => <Heart key={i} className="text-red-500 fill-current" />)}
                  {Array.from({ length: 2 - lives }).map((_, i) => <Heart key={i} className="text-gray-300" />)}
                </div>
              </div>
              <div className="w-full bg-pink-200 rounded-full h-2.5">
                <div className="bg-pink-500 h-2.5 rounded-full transition-all duration-500" style={{ width: `${progressPercentage}%` }}></div>
              </div>
            </div>
            <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-xl">
              <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center font-serif">{currentQuestion.question}</h2>
              <div className="space-y-4">
                {currentQuestion.options.map((option, index) => {
                  const choiceLetter = String.fromCharCode(65 + index) as 'A' | 'B' | 'C' | 'D';
                  const isCorrect = showFeedback && choiceLetter === currentQuestion.answer;
                  const isIncorrect = showFeedback && selectedAnswer === choiceLetter && choiceLetter !== currentQuestion.answer;
                  return <QuizOption key={index} choiceLetter={choiceLetter} choiceText={option} onClick={() => handleSelectOption(choiceLetter)} isSelected={selectedAnswer === choiceLetter} isCorrect={isCorrect} isIncorrect={isIncorrect} disabled={showFeedback} />;
                })}
              </div>
              <div className="mt-8 text-center">
                {!showFeedback && selectedAnswer && (<Button onClick={handleSubmitAnswer} className="!bg-green-500 hover:!bg-green-600">Jawab</Button>)}
                {showFeedback && (<Button onClick={handleNextQuestion}>{currentQuestionIndex < quizData.length - 1 ? 'Lanjut' : 'Selesai'}</Button>)}
              </div>
            </div>
          </div>
        )}
        {gameState === 'gameOver' && (
          <div className="flex flex-col items-center justify-center text-center mt-16 p-4">
            <div className="bg-white p-10 rounded-2xl shadow-xl max-w-md mx-auto">
              <h1 className="text-4xl font-bold text-red-500">Game Over</h1>
              <p className="text-gray-700 mt-4">Aduu gimana sii sayangg, coba lagi deh!</p>
              <Button onClick={handleRestart} className="mt-8 !bg-red-500 hover:!bg-red-600"><div className="flex items-center gap-2"><RotateCcw size={20} /> <span>Coba Lagi</span></div></Button>
            </div>
          </div>
        )}
        {gameState === 'won' && (
          <div className="mt-8">
            <div className="bg-white p-8 rounded-2xl shadow-xl max-w-4xl mx-auto text-center">
              <h1 className="text-3xl font-bold text-gray-800">Kamu Menang!</h1>
              <p className="text-gray-600 mt-2 mb-8">OMO! Kamu menang sayang. Sekarang, buka hadiahnya! 😉</p>
              <Button onClick={handleWinGame}><div className="flex items-center gap-2"><PartyPopper size={20}/> <span>Lanjut</span></div></Button>
            </div>
          </div>
        )}
      </div>
      <WinModal isOpen={isWinModalOpen} onConfirm={handleConfirmWin} />
    </>
  );
}