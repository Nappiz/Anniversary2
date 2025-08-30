'use client';

import { Gift, Gamepad2 } from 'lucide-react';
import Link from 'next/link';
import { useLock } from '../context/LockContext'; 

export default function SurpriseHomePage() {
  const { isUnlocked } = useLock(); 

  return (
    <div className="flex flex-col items-center justify-center text-center mt-16">
      <div className="bg-white p-10 md:p-16 rounded-2xl shadow-xl max-w-2xl mx-auto">
        <Gift size={64} className="text-pink-500 mx-auto animate-bounce" />
        <h1 className="text-4xl md:text-5xl font-bold text-pink-600 mt-6">
          Welcome to Our World!
        </h1>
        <p className="text-gray-600 mt-4 text-lg">
          Halo sayang!! Hayoo bingung yaa ini apaa hihi, ini adalah petualangan journey dunia kita, Penasaran?? mainin dulu gamenya! 
        </p>
        { !isUnlocked && (
          <div className="mt-8 bg-pink-50 p-6 rounded-lg border border-pink-200 transition-opacity duration-500">
            <p className="font-semibold text-pink-800">
              Kalo mau buka yang lain lain, kamu harus mainin gamesnya dulu bib, harus menang loh yaa!
            </p>
            <p className="text-pink-700/80 mt-1 text-sm">
              Yuu, main gamenya dulu!
            </p>
            <Link href="/surprise/games">
              <button className="cursor-pointer mt-4 bg-pink-500 text-white font-bold py-2 px-5 rounded-lg shadow-md hover:bg-pink-600 transition-all transform hover:scale-105 flex items-center gap-2 mx-auto">
                <Gamepad2 size={20} />
                <span>Mainkan Game</span>
              </button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}