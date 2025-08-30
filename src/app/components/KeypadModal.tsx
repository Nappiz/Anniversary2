// app/components/KeypadModal.tsx
'use client';

import React, { useState, useEffect } from 'react';
import KeypadButton from './ui/KeypadButton';
import { useRouter } from 'next/navigation';
import { ArrowRight, Delete, X } from 'lucide-react'; 
import clsx from 'clsx'; 

type KeypadModalProps = {
  isOpen: boolean;
  onClose: () => void;
  correctCode: string;
  onSuccess: () => void;
};

const KeypadModal: React.FC<KeypadModalProps> = ({ isOpen, onClose, correctCode, onSuccess }) => {
  const [input, setInput] = useState('');
  const [feedback, setFeedback] = useState({ message: '', type: 'idle' }); 
  const [isShaking, setIsShaking] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setInput('');
      setFeedback({ message: '', type: 'idle' });
    }
  }, [isOpen]);

  const handleDigitClick = (digit: string) => {
    if (input.length >= correctCode.length || feedback.type !== 'idle') return;
    setInput(input + digit);
  };

  const handleBackspace = () => {
    if (feedback.type !== 'idle') return;
    setInput(input.slice(0, -1));
  };

  const handleClear = () => {
    setInput('');
    setFeedback({ message: '', type: 'idle' });
  };

  const handleSubmit = () => {
    if (input.length === 0) return;

    if (input === correctCode) {
      setFeedback({ message: 'Benar! ✨', type: 'success' });
      setTimeout(() => {
        onSuccess();
      }, 1000);
    } else {
      setFeedback({ message: 'Salah, yang bener dongg', type: 'error' });
      setIsShaking(true);
      setTimeout(() => {
        setInput('');
        setFeedback({ message: '', type: 'idle' });
        setIsShaking(false);
      }, 2000);
    }
  };


  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-md flex justify-center items-center z-50 p-4">
      <div
        className={clsx(
          'relative w-full max-w-xs bg-gradient-to-br from-pink-200 to-pink-300 p-6 rounded-2xl shadow-2xl transform transition-transform duration-300',
          { 'animate-shake': isShaking }
        )}
      >
        <button onClick={onClose} className="absolute top-3 right-3 text-pink-600 hover:text-pink-800">
          <X size={24} />
        </button>

        <h2 className="text-center font-bold text-pink-700 text-2xl mb-4">
          hayoo tebak
        </h2>

        <div className="bg-white/50 backdrop-blur-sm w-full h-16 rounded-lg mb-6 flex items-center justify-center shadow-inner px-4">
          <p className={clsx('font-mono text-xl text-center truncate', {
              'text-pink-600 tracking-[0.3em]': feedback.type === 'idle',
              'text-red-500 font-semibold': feedback.type === 'error',
              'text-green-500 font-semibold': feedback.type === 'success',
            })}
          >
            {feedback.type === 'idle' ? '*'.repeat(input.length) || <span className="text-pink-400/70">Enter code</span> : feedback.message}
          </p>
        </div>

        <div className="grid grid-cols-3 gap-3">
          {[ '1', '2', '3', '4', '5', '6', '7', '8', '9'].map((digit) => (
            <KeypadButton key={digit} onClick={() => handleDigitClick(digit)}>
              {digit}
            </KeypadButton>
          ))}
          <KeypadButton onClick={handleClear} className="text-lg font-sans">C</KeypadButton>
          <KeypadButton onClick={() => handleDigitClick('0')}>0</KeypadButton>
          <KeypadButton 
            onClick={handleSubmit} 
            className="!bg-pink-500 !text-white hover:!bg-pink-600"
          >
            <ArrowRight size={24} />
          </KeypadButton>
        </div>
      </div>
    </div>
  );
};

export default KeypadModal;