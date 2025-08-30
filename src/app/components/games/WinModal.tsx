// app/components/games/WinModal.tsx
'use client';

import Button from '../ui/Button';
import { PartyPopper, ArrowRight } from 'lucide-react';

type WinModalProps = {
  isOpen: boolean;
  onConfirm: () => void;
};

export default function WinModal({ isOpen, onConfirm }: WinModalProps) {
  if (!isOpen) {
    return null;
  }
  
  return (
    // UBAH z-50 MENJADI z-[60] DI SINI
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex justify-center items-center z-[60] p-4">
      <div className="bg-white p-8 rounded-2xl shadow-2xl text-center max-w-sm w-full transform transition-transform duration-300 scale-100">
        <PartyPopper size={64} className="text-pink-500 mx-auto animate-bounce" />
        <h2 className="text-3xl font-bold text-gray-800 mt-6 font-serif">
          Yey, Kamu Menang!
        </h2>
        <p className="text-gray-600 mt-2">
          Semua halaman rahasia sekarang terbuka. Saatnya melanjutkan petualangan!
        </p>
        <Button onClick={onConfirm} className="mt-8">
          <div className="flex items-center gap-2">
            <span>Lanjutkan Petualangan</span>
            <ArrowRight size={20} />
          </div>
        </Button>
      </div>
    </div>
  );
}