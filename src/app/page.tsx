'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Button from './components/ui/Button';
import KeypadModal from './components/KeypadModal';
import { Gift, Heart, Sparkles } from 'lucide-react';

export default function HomePage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const correctPassword = '010923';
  const router = useRouter();

  const handleOpenModal = () => setIsModalOpen(true);
  const handleSuccess = () => { setIsModalOpen(false); router.push('/surprise'); };

  return (
    <>
      <main className="relative min-h-[100svh] overflow-hidden">
        <HeartsBackground />
        <section className="relative mx-auto max-w-4xl px-4 pt-20 pb-16 sm:pt-28 sm:pb-24">
          <div className="mx-auto max-w-3xl rounded-3xl border border-white/60 bg-white/70 backdrop-blur shadow-[0_10px_30px_rgba(0,0,0,0.06)] p-6 sm:p-10">
            <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-tr from-pink-500 to-rose-400 text-white shadow">
              <Gift className="animate-pulse" />
            </div>
            <h1
              className="text-center text-4xl sm:text-6xl font-black tracking-tight text-pink-700"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              Happy 2nd Anniversary, Sayang! <span className="inline-block animate-heartbeat">💞</span>
            </h1>

            <p className="mt-4 sm:mt-6 text-center text-base sm:text-lg leading-relaxed text-gray-700">
              Ini dunia kecil kita! tempat kenangan, mimpi, dan rencana kita nanti.
              Buka semua halaman, mainin gamesnya, dan semoga kamu suka yaaa 🫶
            </p>

            <div className="mt-8 flex items-center justify-center gap-3">
              <GlowRing>
                <Button onClick={handleOpenModal}>Klik Aku 💌</Button>
              </GlowRing>
            </div>

            <p className="mt-3 text-center text-xs text-gray-500">
              (Ada kode rahasia kecil dulu, abis itu kita masuk ke dunia “Our Story” ✨)
            </p>
          </div>
        </section>
      </main>

      <KeypadModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        correctCode={correctPassword}
        onSuccess={handleSuccess}
      />

      <style jsx global>{`
        @keyframes floatUp {
          0% { transform: translateY(0) scale(1); opacity: var(--op, .35); }
          50% { transform: translateY(-14px) scale(1.03); }
          100% { transform: translateY(0) scale(1); opacity: var(--op, .35); }
        }
        @keyframes heartbeat {
          0%, 40%, 80%, 100% { transform: scale(1); }
          20%, 60% { transform: scale(1.12); }
        }
        .animate-heartbeat { animation: heartbeat 1.8s ease-in-out infinite; transform-origin: center; }
      `}</style>
    </>
  );
}

function GlowRing({ children }: { children: React.ReactNode }) {
  return (
    <span className="relative inline-flex">
      <span className="absolute -inset-0.5 rounded-2xl bg-gradient-to-r from-pink-500 to-rose-400 opacity-60 blur transition group-hover:opacity-80" />
      <span className="relative">{children}</span>
    </span>
  );
}

function Feature({ icon, text }: { icon: React.ReactNode; text: string }) {
  return (
    <li className="flex items-center justify-center gap-2 rounded-2xl border border-white/60 bg-white/70 backdrop-blur px-4 py-3 shadow-[0_6px_18px_rgba(0,0,0,0.04)]">
      <span className="inline-flex h-7 w-7 items-center justify-center rounded-xl bg-gradient-to-tr from-pink-500 to-rose-400 text-white">
        {icon}
      </span>
      <span>{text}</span>
    </li>
  );
}

function HeartsBackground() {
  const hearts = [
    { left: '6%',  top: '68%', size: 18, dur: '9s',  delay: '0s',  op: .30, emoji: '💖' },
    { left: '14%', top: '22%', size: 14, dur: '11s', delay: '0.5s', op: .28, emoji: '💕' },
    { left: '28%', top: '78%', size: 16, dur: '10s', delay: '0.2s', op: .26, emoji: '💗' },
    { left: '44%', top: '18%', size: 20, dur: '12s', delay: '0.8s', op: .24, emoji: '💓' },
    { left: '58%', top: '72%', size: 16, dur: '9.5s', delay: '0.1s', op: .28, emoji: '💞' },
    { left: '72%', top: '26%', size: 18, dur: '11.5s', delay: '0.6s', op: .30, emoji: '💖' },
    { left: '84%', top: '64%', size: 14, dur: '10.5s', delay: '0.3s', op: .26, emoji: '💕' },
  ];

  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
      <div className="absolute -top-24 -left-24 h-72 w-72 rounded-full bg-pink-200/50 blur-3xl" />
      <div className="absolute -bottom-20 right-10 h-72 w-72 rounded-full bg-rose-200/60 blur-3xl" />
      {hearts.map((h, i) => (
        <span
          key={i}
          className="absolute select-none"
          style={{
            left: h.left,
            top: h.top,
            fontSize: h.size,
            animation: `floatUp ${h.dur} ease-in-out ${h.delay} infinite`,
            filter: 'drop-shadow(0 6px 18px rgba(236,72,153,0.25))',
            opacity: h.op as number,
          }}
        >
          {h.emoji}
        </span>
      ))}
    </div>
  );
}
