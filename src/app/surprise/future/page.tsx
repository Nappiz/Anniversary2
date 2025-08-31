'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import {
  CalendarDays,
  Heart,
  PartyPopper,
  Plane,
  Home,
  PawPrint,
  Camera,
  PiggyBank,
  Sparkles,
  Target,
  Compass,
  Stars,
  Quote,
  Wand2,
  NotebookPen,
  ArrowRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Variants } from 'framer-motion';
import { useLock } from '../../context/LockContext';

const EASE_OUT: [number, number, number, number] = [0.16, 1, 0.3, 1];
const EASE_IN_OUT: [number, number, number, number] = [0.45, 0, 0.55, 1];

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 14 },
  show: (i: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: { delay: 0.06 * i, duration: 0.55, ease: EASE_OUT },
  }),
};

type Confetti = { id: number; x: number; y: number; r: number; s: number; type: 'heart' | 'spark' };

const BASE_DATE = new Date('2025-09-01T00:00:00'); // tanggal jadian fix
const TARGET_DATE = new Date('2026-09-01T00:00:00');

function nextAnniversary(fromDate: Date): Date {
  const now = new Date();
  const target = TARGET_DATE;
  if (target.getTime() <= now.getTime()) target.setFullYear(now.getFullYear() + 1);
  return target;
}

function diffToDHMS(target: Date) {
  const now = Date.now();
  const t = Math.max(0, target.getTime() - now);
  const d = Math.floor(t / (1000 * 60 * 60 * 24));
  const h = Math.floor((t / (1000 * 60 * 60)) % 24);
  const m = Math.floor((t / (1000 * 60)) % 60);
  const s = Math.floor((t / 1000) % 60);
  return { d, h, m, s };
}
const fmt2 = (n: number) => n.toString().padStart(2, '0');

export default function FuturePage() {
  const { isUnlocked } = useLock();

  const [tick, setTick] = useState(0);
  const target = useMemo(() => nextAnniversary(BASE_DATE), []);
  useEffect(() => {
    const id = setInterval(() => setTick((t) => t + 1), 1000);
    return () => clearInterval(id);
  }, []);
  const left = diffToDHMS(target);
  const progressYear = useMemo(() => {
    const last = new Date(target);
    last.setFullYear(target.getFullYear() - 1);
    const total = target.getTime() - last.getTime();
    const gone = Date.now() - last.getTime();
    return Math.min(100, Math.max(0, (gone / total) * 100));
  }, [tick, target]);

  const [confetti, setConfetti] = useState<Confetti[]>([]);
  const burst = (at?: { x: number; y: number }) => {
    const originX = at?.x ?? 50;
    const originY = at?.y ?? 62;
    const N = 22;
    const items: Confetti[] = Array.from({ length: N }).map((_, i) => ({
      id: Date.now() + i,
      x: originX + (Math.random() * 28 - 14),
      y: originY + (Math.random() * 10 - 5),
      r: Math.random() * 40 - 20,
      s: Math.random() * 0.5 + 0.8,
      type: Math.random() < 0.75 ? 'heart' : 'spark',
    }));
    setConfetti((c) => [...c, ...items]);
    setTimeout(() => {
      setConfetti((c) => c.filter((p) => !items.find((i) => i.id === p.id)));
    }, 1300);
  };

  const QUOTES = [
    'I choose you. Always.',
    'We’re a lover today, tomorrow, always.',
    'Kita sering berantem, tapi terus bareng.',
    'Your hand fits in mine like it’s made just for me.',
    'The best is yet to be.',
    'I Love You more than yesterday.'
  ];

  const TL = [
    { year: '2026', icon: Plane,  title: 'BSD', desc: 'Magang di BSD, aku mau tunjukkin banyak hal di BSD ke kamu!.' },
    { year: '2027', icon: Home,   title: 'Lulus + Dapet Kerja', desc: 'Kerja dengan gaji diatas > 7 juta kita pasti bisa jalan teruss.' },
    { year: '2028', icon: PawPrint, title: 'Nabung Bareng', desc: 'Nabung bareng sampe kita punya 100 juta pertama.' },
    { year: '2029', icon: Camera, title: 'Rumah', desc: 'Punya rumah untuk kita setelah nikah nanti.' },
    { year: '2030', icon: PiggyBank, title: 'Nikah', desc: 'Di tahun ini aku usahain lamar kamu dan nikahin kamu.' },
  ];

  const IDEAS = [
    { title: 'Nonton', emoji: '🍿', text: 'Nonton Bioskop di PM? PTC? GM? PCM? TP? Bebass.' },
    { title: 'Masak Masak', emoji: '🍳', text: 'Masak menu yang belum pernah kita coba.' },
    { title: 'Photo Walk', emoji: '📸', text: 'Keliling kota cari spot lucu, foto candid tiap belokan.' },
    { title: 'Netflix n Chill', emoji: '🎬', text: 'Netflix n Chill di tempatku.' },
    { title: 'Jatim Park', emoji: '🎡', text: 'Aku mau ke Jatim Park jugaa.' },
    { title: 'Roblox Date', emoji: '🎮', text: 'Ayo kita cari map map lucu terus foto.' },
    { title: 'Shopping', emoji: '🛍️', text: 'Semoga kamu ga dapet ini, aku cuma bingung mau isi apa lagi.' },
    { title: 'Makan Makan', emoji: '🍽️', text: 'Ayo jajan dan makan makanan enak lagi.' },
  ];
  const [ideaIndex, setIdeaIndex] = useState(0);
  const shuffleIdea = () => {
    let idx = Math.floor(Math.random() * IDEAS.length);
    if (idx === ideaIndex) idx = (idx + 1) % IDEAS.length;
    setIdeaIndex(idx);
  };

  const copyIdea = async () => {
    const i = IDEAS[ideaIndex];
    try {
      await navigator.clipboard.writeText(`${i.emoji} ${i.title} — ${i.text}`);
    } catch (e) {
      // ignore
    }
  };

  const VOWS = [
    { title: 'Respect', text: 'Aku akan dengar dan menghargai perasaanmu, bahkan saat kita berbeda pendapat.' },
    { title: 'Presence', text: 'Aku akan hadir sepenuhnya—di saat seru, juga di saat sulit.' },
    { title: 'Growth', text: 'Kita saling dorong untuk tumbuh, tanpa mengubah siapa diri kita.' },
  ];
  const [flipped, setFlipped] = useState<Record<string, boolean>>({});

  if (!isUnlocked) {
    return (
      <div className="flex flex-col items-center justify-center text-center mt-16">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white p-10 md:p-16 rounded-2xl shadow-xl max-w-2xl mx-auto"
        >
          <Sparkles size={56} className="text-pink-500 mx-auto animate-bounce" />
          <h1 className="text-3xl md:text-4xl font-bold text-pink-600 mt-4">
            Future kebuka setelah kamu menang 💖
          </h1>
          <p className="text-gray-600 mt-3">
            Yuk selesaikan gamenya dulu, nanti kita buka mimpi-mimpi masa depan bareng ✨
          </p>
          <Link href="/surprise/games">
            <button className="mt-6 bg-pink-500 text-white font-bold py-2 px-5 rounded-lg shadow-md hover:bg-pink-600 transition-all transform hover:scale-105">
              Mainkan Game
            </button>
          </Link>
        </motion.div>
      </div>
    );
  }

  const R = 56; // radius
  const C = 2 * Math.PI * R; // circumference
  const progressOffset = C * (1 - progressYear / 100);

  return (
    <div className="relative mt-16 overflow-hidden">
      <BackgroundAurora />

      <div className="mx-auto max-w-3xl px-4">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mx-auto w-max rounded-full bg-pink-100/70 text-pink-700 text-sm font-semibold px-4 py-1 shadow-sm flex items-center gap-2"
        >
          <PartyPopper size={16} /> Our Future • {new Date().getFullYear()}
        </motion.div>

        <div className="relative mt-6 rounded-3xl p-[1px] bg-gradient-to-r from-pink-200 via-rose-200 to-fuchsia-200 shadow-[0_10px_30px_rgba(244,114,182,0.25)]">
          <div className="relative overflow-hidden rounded-3xl bg-white/90 backdrop-blur p-8 md:p-10">
            <ParallaxHearts />

            <div className="flex items-center justify-center gap-3">
              <Sparkles className="text-pink-500" />
              <motion.h1
                className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-pink-600 to-rose-500 text-center"
                initial={{ letterSpacing: '0.05em' }}
                animate={{ letterSpacing: '0.02em' }}
                transition={{ duration: 0.8, ease: EASE_OUT }}
              >
                Our Future Together
              </motion.h1>
              <Sparkles className="text-pink-500" />
            </div>
            <p className="text-gray-600 text-center mt-4 max-w-2xl mx-auto">
              Mimpi-mimpi kecil yang bikin masa depan jadi seru. Semoga bisa kita wujudkan yaa.
            </p>

            <div className="mt-6 relative rounded-2xl border border-pink-100 bg-pink-50/60 p-3 overflow-hidden">
              <div className="absolute inset-0 pointer-events-none [mask-image:linear-gradient(to_right,transparent,black_15%,black_85%,transparent)]" />
              <div className="flex items-center gap-2 text-pink-800 font-semibold mb-2"><Quote size={18} /> Love Lines</div>
              <div className="whitespace-nowrap" style={{ animation: 'marquee 22s linear infinite' }}>
                {QUOTES.concat(QUOTES).map((q, i) => (
                  <span key={i} className="mx-6 inline-flex items-center text-sm text-pink-700/90">{q} <span className="mx-3 opacity-40">•</span></span>
                ))}
              </div>
            </div>

            <div className="mt-8 grid grid-cols-1 md:grid-cols-[auto,1fr] md:items-center gap-6">
              <div className="relative mx-auto w-[160px] h-[160px]">
                <svg viewBox="0 0 140 140" className="-rotate-90">
                  <circle cx="70" cy="70" r={R} stroke="#fce7f3" strokeWidth="14" fill="none" />
                  <motion.circle
                    cx="70"
                    cy="70"
                    r={R}
                    stroke="#ec4899"
                    strokeWidth="14"
                    strokeLinecap="round"
                    fill="none"
                    strokeDasharray={C}
                    animate={{ strokeDashoffset: progressOffset }}
                    transition={{ duration: 0.8, ease: EASE_IN_OUT }}
                  />
                </svg>
                <div className="absolute inset-0 grid place-items-center text-center">
                  <div>
                    <div className="text-3xl font-extrabold text-pink-600">{fmt2(left.d)}</div>
                    <div className="text-xs text-gray-500">hari</div>
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border border-pink-100 bg-pink-50/60 p-5">
                <div className="flex items-center gap-2 font-semibold text-pink-800">
                  <CalendarDays size={18} /> Hitung mundur
                </div>
                <div className="mt-3 grid grid-cols-4 gap-2 text-center">
                  {[{k:'Hari',v:left.d},{k:'Jam',v:left.h},{k:'Menit',v:left.m},{k:'Detik',v:left.s}].map((b, i) => (
                    <div key={i} className="rounded-xl bg-white p-3 shadow-sm">
                      <div className="text-2xl font-extrabold text-pink-600">{fmt2(b.v)}</div>
                      <div className="text-xs text-gray-500">{b.k}</div>
                    </div>
                  ))}
                </div>
                <div className="mt-4">
                  <div className="h-2 w-full rounded-full bg-pink-100 overflow-hidden">
                    <motion.div
                      className="h-full bg-pink-500"
                      initial={{ width: 0 }}
                      animate={{ width: `${progressYear}%` }}
                      transition={{ duration: 0.6, ease: EASE_OUT }}
                    />
                  </div>
                  <div className="mt-2 text-xs text-gray-500">Menuju Anniv ke-3 kita: {progressYear.toFixed(1)}%</div>
                </div>
              </div>
            </div>

            <div className="mt-10">
              <SectionTitle>Our Vision Pillars</SectionTitle>
              <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-3">
                {[
                  { icon: Compass, title: 'Adventure', text: 'Selalu mencoba hal baru bareng—tempat, cerita, makanan.' },
                  { icon: Target,  title: 'Growth',    text: 'Saling dukung mimpi & karir. Jadi versi terbaik.' },
                  { icon: Stars,   title: 'Warmth',    text: 'Rumah yang hangat: cerita, jujur, dan banyak peluk.' },
                ].map((v, i) => {
                  const Icon = v.icon;
                  return (
                    <motion.div
                      key={v.title}
                      variants={fadeUp}
                      initial="hidden"
                      whileInView="show"
                      viewport={{ once: true, margin: '-80px' }}
                      custom={i}
                      className="group relative rounded-2xl border border-pink-100 bg-white p-5 shadow-sm hover:shadow-lg transition-shadow"
                    >
                      <div className="absolute -inset-px rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity [background:radial-gradient(60%_60%_at_50%_0%,rgba(244,114,182,0.15),transparent)]" />
                      <div className="relative">
                        <div className="mx-auto w-10 h-10 grid place-items-center rounded-xl bg-gradient-to-b from-pink-100 to-rose-100 text-pink-500 shadow-inner">
                          <Icon size={18} />
                        </div>
                        <div className="mt-2 font-bold text-pink-700 text-center">{v.title}</div>
                        <p className="text-gray-600 mt-1 text-sm text-center">{v.text}</p>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>

            <div className="mt-10">
              <SectionTitle>Timeline Mimpi</SectionTitle>
              <div className="mt-4 relative">
                <div className="absolute left-3 top-0 bottom-0 w-px bg-pink-200/70" />
                <ul className="space-y-5 pl-8">
                  {TL.map((item, i) => {
                    const Icon = item.icon;
                    return (
                      <motion.li
                        key={item.year}
                        variants={fadeUp}
                        initial="hidden"
                        whileInView="show"
                        viewport={{ once: true, margin: '-40px' }}
                        custom={i}
                        className="relative"
                      >
                        <div className="absolute -left-[1.625rem] top-2 grid place-items-center w-8 h-8 rounded-full bg-white border border-pink-200 text-pink-600 shadow">
                          <Icon size={16} />
                        </div>
                        <div className="rounded-2xl border border-pink-100 bg-white p-5 shadow-sm hover:shadow-md transition-shadow">
                          <div className="flex items-center gap-2 text-pink-700 font-semibold">
                            <span>{item.year}</span>
                          </div>
                          <div className="mt-1 text-lg font-bold text-pink-600">{item.title}</div>
                          <p className="text-gray-600 mt-1">{item.desc}</p>
                        </div>
                      </motion.li>
                    );
                  })}
                </ul>
              </div>
            </div>

            <div className="mt-10">
              <SectionTitle>Date Idea Generator</SectionTitle>
              <div className="mt-4 bg-pink-50/60 border border-pink-100 rounded-2xl p-5">
                <div className="flex items-center justify-center gap-2 text-pink-800 font-semibold">
                  <Sparkles size={18} /> “Malam Minggu ini ngapain ya?”
                </div>

                <div className="mt-4 relative h-[150px]">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={IDEAS[ideaIndex].title}
                      initial={{ opacity: 0, y: 10, scale: 0.98 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -10, scale: 0.98 }}
                      transition={{ duration: 0.35, ease: EASE_OUT }}
                      className="absolute inset-0 rounded-xl bg-white shadow-sm border border-pink-100 p-5 flex flex-col items-center justify-center text-center"
                    >
                      <div className="text-3xl">{IDEAS[ideaIndex].emoji}</div>
                      <div className="mt-1 font-bold text-pink-700">{IDEAS[ideaIndex].title}</div>
                      <p className="text-gray-600 text-sm max-w-md">{IDEAS[ideaIndex].text}</p>
                    </motion.div>
                  </AnimatePresence>
                </div>

                <div className="mt-4 flex items-center justify-center gap-2">
                  <motion.button
                    whileTap={{ scale: 0.95 }}
                    whileHover={{ scale: 1.03 }}
                    onClick={shuffleIdea}
                    className="rounded-xl bg-white px-4 py-2 border border-pink-200 shadow-sm hover:shadow-md text-pink-700 font-semibold"
                  >
                    Shuffle Idea
                  </motion.button>
                  <motion.button
                    whileTap={{ scale: 0.95 }}
                    whileHover={{ scale: 1.03 }}
                    onClick={() => burst()}
                    className="inline-flex items-center gap-2 bg-pink-500 text-white font-bold px-4 py-2 rounded-xl shadow-md hover:bg-pink-600"
                  >
                    <Heart className="text-white" />
                    Ayooo
                  </motion.button>
                </div>
              </div>
            </div>

            {/* CTA */}
            <div className="mt-12 flex flex-col items-center gap-2">
              <motion.div whileTap={{ scale: 0.97 }} whileHover={{ scale: 1.02 }}>
                <Link
                  href="/surprise/journey"
                  className="inline-flex items-center gap-2 bg-pink-500 text-white font-bold px-6 py-3 rounded-xl shadow-md hover:bg-pink-600"
                  onClick={(e) => {
                    const rect = (e.target as HTMLElement).getBoundingClientRect();
                    burst({ x: ((rect.left + rect.width / 2) / window.innerWidth) * 100, y: ((rect.top + rect.height / 2) / window.innerHeight) * 100 });
                  }}
                >
                  I Love You
                </Link>
              </motion.div>
              <Link href="/surprise/untuk-kamu" className="text-xs text-pink-700 hover:underline">
                Aku ada kata kata untuk kamu ✍️
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* confetti overlay */}
      <div className="pointer-events-none fixed inset-0 z-40">
        <AnimatePresence>
          {confetti.map((c) => (
            <motion.div
              key={c.id}
              className="absolute -translate-x-1/2 -translate-y-1/2 pointer-events-none"
              style={{ left: `${c.x}%`, top: `${c.y}%` }}
              initial={{ opacity: 0, scale: 0.6, rotate: 0 }}
              animate={{ opacity: 1, scale: c.s, y: -140, rotate: c.r }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.15, ease: EASE_OUT }}
            >
              {c.type === 'heart' ? (
                <Heart className="h-6 w-6 text-pink-400" />
              ) : (
                <Stars className="h-5 w-5 text-rose-300" />
              )}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* local styles */}
      <style jsx global>{`
        /* marquee */
        @keyframes marquee { from { transform: translateX(0); } to { transform: translateX(-50%); } }
        /* flip helpers */
        .backface-hidden { backface-visibility: hidden; transform-style: preserve-3d; }
        .rotate-y-180 { transform: rotateY(180deg); }
      `}</style>
    </div>
  );
}

// ------------------- components -------------------
function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="text-xl font-bold text-pink-700 text-center flex items-center justify-center gap-2">
      {children}
    </h2>
  );
}

function BackgroundAurora() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
      {/* soft grid */}
      <div className="absolute inset-0 opacity-[0.035] [background-image:linear-gradient(to_right,#000_1px,transparent_1px),linear-gradient(to_bottom,#000_1px,transparent_1px)] [background-size:48px_48px]" />
      {/* aurora blobs */}
      <motion.div
        className="absolute -top-24 -left-24 h-80 w-80 rounded-full blur-3xl"
        style={{ background: 'radial-gradient(140px 140px at 50% 50%, #fb7185, transparent)' }}
        animate={{ scale: [1, 1.06, 1], x: [0, 10, 0], y: [0, 8, 0] }}
        transition={{ repeat: Infinity, duration: 9, ease: [0.45, 0, 0.55, 1] }}
      />
      <motion.div
        className="absolute -bottom-24 -right-24 h-96 w-96 rounded-full blur-3xl"
        style={{ background: 'radial-gradient(160px 160px at 50% 50%, #fca5a5, transparent)' }}
        animate={{ scale: [1.04, 1, 1.04], x: [0, -10, 0], y: [0, -8, 0] }}
        transition={{ repeat: Infinity, duration: 10, ease: [0.45, 0, 0.55, 1] }}
      />
      {/* subtle vignette */}
      <div className="absolute inset-0 [mask-image:radial-gradient(60%_60%_at_50%_40%,black,transparent)] bg-[radial-gradient(80%_60%_at_50%_-10%,rgba(244,114,182,0.10),transparent_70%)]" />
    </div>
  );
}

function ParallaxHearts() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
      <motion.div
        className="absolute left-[10%] top-6 text-rose-200"
        animate={{ y: [0, 8, 0] }}
        transition={{ repeat: Infinity, duration: 6, ease: [0.45, 0, 0.55, 1] }}
      >
        <Heart className="w-6 h-6" />
      </motion.div>
      <motion.div
        className="absolute right-[12%] top-10 text-rose-300/90"
        animate={{ y: [0, -10, 0] }}
        transition={{ repeat: Infinity, duration: 7.5, ease: [0.45, 0, 0.55, 1] }}
      >
        <Heart className="w-8 h-8" />
      </motion.div>
      <motion.div
        className="absolute left-[18%] bottom-8 text-rose-300/70"
        animate={{ y: [0, 6, 0] }}
        transition={{ repeat: Infinity, duration: 5.5, ease: [0.45, 0, 0.55, 1] }}
      >
        <Sparkles className="w-6 h-6" />
      </motion.div>
    </div>
  );
}
