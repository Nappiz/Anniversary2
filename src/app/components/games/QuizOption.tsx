'use client';

import clsx from 'clsx';
import { CheckCircle2, XCircle } from 'lucide-react';

type QuizOptionProps = {
  choiceLetter: 'A' | 'B' | 'C' | 'D';
  choiceText: string;
  onClick: () => void;
  isSelected: boolean;
  isCorrect: boolean;
  isIncorrect: boolean;
  disabled: boolean;
};

export default function QuizOption({
  choiceLetter,
  choiceText,
  onClick,
  isSelected,
  isCorrect,
  isIncorrect,
  disabled,
}: QuizOptionProps) {
  const getIcon = () => {
    if (isCorrect) return <CheckCircle2 />;
    if (isIncorrect) return <XCircle />;
    return null;
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={clsx(
        'flex w-full items-center justify-between p-4 rounded-xl border-2 text-left transition-all duration-300 text-gray-600 cursor-pointer',
        {
          'border-green-500 bg-green-100 text-green-800 shadow-lg': isCorrect,
          'border-red-500 bg-red-100 text-red-800 shadow-lg': isIncorrect,
          'border-pink-500 bg-pink-100 text-pink-800 scale-105 shadow-md': isSelected && !isCorrect && !isIncorrect,
          'border-pink-200 bg-white hover:bg-pink-50 hover:border-pink-400': !isSelected,
          'cursor-not-allowed opacity-60': disabled && !isSelected,
        }
      )}
    >
      <div className="flex items-center gap-4">
        <span className="font-bold">{choiceLetter}.</span>
        <span>{choiceText}</span>
      </div>
      <div className="text-2xl">{getIcon()}</div>
    </button>
  );
}