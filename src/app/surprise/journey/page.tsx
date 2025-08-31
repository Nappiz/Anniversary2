'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import clsx from 'clsx';
import { Calendar, MapPin, Heart, Lock, Sparkles, ArrowRight } from 'lucide-react';
import { useLock } from '../../context/LockContext';

type Year = '2023' | '2024' | '2025';

type JourneyEvent = {
  id: number;
  date: string;
  title: string;
  caption: string;
  image: string;
  location?: string;
  year: Year;
};

/* ========= 10 EVENT: 3 (2023) + 3 (2024) + 4 (2025) ========= */
const EVENTS: JourneyEvent[] = [
  // 2023 (3)
  { id: 1, date: 'Aug 2023', title: 'First Sparks ✨', caption: 'Pertama kali aku ngefollow kamu langsung aku chat hihi.', image: '/images/20231.jpg', location: '', year: '2023' },
  { id: 2, date: 'Sep 2023', title: 'Nembak', caption: 'Ga lama setelahnya aku satset lgsg gaspol tembak.', image: '/images/20232.jpg', location: '', year: '2023' },
  { id: 3, date: 'Nov 2023', title: 'Masalah Besar', caption: 'Disini kita dihadapi masalah besar.', image: '/images/20233.jpg', year: '2023' },

  // 2024 (3)
  { id: 4, date: 'Jan 2024', title: 'First Love', caption: 'Setelah memutuskan untuk lanjut, aku baru sadar kamu itu First Love ku.', image: '/images/20241.jpg', location: '', year: '2024' },
  { id: 5, date: 'Jun 2024', title: 'Makin Sayang', caption: 'Aku makin gabisa lepas sama kamu, Makin sayang banget.', image: '/images/20242.jpg', year: '2024' },
  { id: 6, date: 'Oct 2024', title: 'Masalah Besar Lagi', caption: 'Disini kita dihadapi masalah yang jauh lebih besar dari sebelumnya.', image: '/images/20243.jpg', year: '2024' },

  // 2025 (4)
  { id: 7, date: 'Jan 2025', title: 'Balikan', caption: 'Disini aku memutuskan untuk nerima kamu lagi dan nyoba sama kamu lagi.', image: '/images/20251.jpg', year: '2025' },
  { id: 8, date: 'Mar 2025', title: 'New Favorite Place', caption: 'Aku sadar kamu udah sabar dan baik banget nunggu aku untuk nyoba sama kamu lagi.', image: '/images/20252.jpg', year: '2025' },
  { id: 9, date: 'Jun 2025', title: 'Kembali Semula', caption: 'Disini kita udah balik kayak semula tanpa ada bedanya.', image: '/images/20253.jpg', year: '2025' },
  { id: 10, date: '1 Sep 2025', title: 'Two Years In Love', caption: 'Selamat 2 tahun! Sehat, bahagia, dan semoga kita bisa bareng terus.', image: '/images/20254.jpg', year: '2025' },
];

const YEARS: Year[] = ['2023', '2024', '2025'];

/* ===== helper reveal hook ===== */
function useReveal<T extends HTMLElement>() {
  const ref = useRef<T | null>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && setVisible(true)),
      { threshold: 0.15 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return { ref, visible };
}

export default function JourneyPage() {
  const { isUnlocked } = useLock();

  // SELANG-SELING GLOBAL
  const ordered = YEARS.flatMap((y) => EVENTS.filter((e) => e.year === y));
  const globalIndexById = new Map<number, number>(ordered.map((e, i) => [e.id, i]));

  return (
    <div className="relative">
      <BackgroundBlobs />

      {/* hero */}
      <section className="mx-auto max-w-4xl px-4 sm:px-6 pt-16 text-center">
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-tr from-pink-500 to-rose-400 text-white shadow">
          <Heart />
        </div>
        <h1 className="font-serif text-3xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-pink-800">
          Our Journey
        </h1>
        <p className="mt-3 sm:mt-4 text-gray-700 text-base sm:text-lg leading-relaxed">
          Langkah demi langkah, cerita demi cerita—semuanya kita jalani bareng. 💞
        </p>
      </section>

      {!isUnlocked ? (
        <LockedPanel />
      ) : (
        <>
          {/* chips tahun — mobile: scroll horizontal, sticky, solid bg */}
          <nav className="sticky top-[68px] md:top-20 z-30 px-3 pt-3">
            <div className="mx-auto max-w-5xl rounded-2xl bg-white/95 backdrop-blur-sm ring-1 ring-white/70 shadow-sm px-3 py-2 flex items-center gap-2 overflow-x-auto no-scrollbar">
              <div className="flex flex-nowrap gap-2">
                {YEARS.map((y) => (
                  <a
                    key={y}
                    href={`#y${y}`}
                    className="cursor-pointer rounded-full px-4 py-1.5 text-sm font-semibold text-pink-700 hover:bg-pink-100 transition"
                  >
                    {y}
                  </a>
                ))}
              </div>
            </div>
          </nav>

          {/* timeline */}
          <section className="mx-auto max-w-5xl px-4 sm:px-6 py-8 sm:py-10">
            <div className="relative">
              {/* garis tengah hanya di ≥md */}
              <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-rose-200 via-rose-300 to-rose-100" />
              <ol className="space-y-8 sm:space-y-12">
                {YEARS.map((year) => (
                  <li key={year} id={`y${year}`} className="scroll-mt-28 md:scroll-mt-36">
                    <YearHeader year={year} />
                    <ul className="mt-5 sm:mt-6 space-y-8 sm:space-y-12">
                      {EVENTS.filter((e) => e.year === year).map((ev) => {
                        const gi = globalIndexById.get(ev.id) ?? 0;
                        const flip = gi % 2 === 1; // global alternating
                        return <EventItem key={ev.id} event={ev} flip={flip} />;
                      })}
                    </ul>
                  </li>
                ))}
              </ol>
            </div>
          </section>

          {/* CTA */}
          <section className="pb-14 px-4 sm:px-6">
            <div className="mx-auto max-w-3xl text-center rounded-3xl border border-white/60 bg-white/90 backdrop-blur p-7 sm:p-8 shadow-[0_18px_50px_rgba(236,72,153,0.15)]">
              <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-pink-500 to-rose-400 text-white shadow">
                <Sparkles size={18} />
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-gray-800">And the story continues…</h3>
              <p className="mt-2 text-gray-600">
                Kita tulis bab-bab baru, dengan doa yang sama: semoga selalu sejalan dan bareng.
              </p>
              <Link
                href="/surprise/future"
                className="mt-5 inline-flex items-center gap-2 rounded-2xl bg-gradient-to-tr from-pink-600 to-rose-500 px-5 py-3 font-semibold text-white shadow-md hover:brightness-105 active:translate-y-px transition"
              >
                Future <ArrowRight size={18} />
              </Link>
            </div>
          </section>
        </>
      )}

      {/* keyframes & utilities */}
      <style jsx global>{`
        @keyframes fadeUp {
          0% { opacity: 0; transform: translateY(16px) scale(.98); }
          100% { opacity: 1; transform: translateY(0) scale(1); }
        }
        .reveal { opacity: 0; transform: translateY(16px) scale(.98); }
        .reveal.show { animation: fadeUp .6s ease-out forwards; }
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
}

/* ===== Components ===== */

function LockedPanel() {
  return (
    <section className="mx-auto max-w-3xl px-4 sm:px-6 py-14">
      <div className="rounded-3xl bg-white/95 backdrop-blur ring-1 ring-white/70 shadow-[0_18px_50px_rgba(0,0,0,0.08)] p-7 sm:p-8 text-center">
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-pink-100 text-pink-600">
          <Lock />
        </div>
        <h2 className="text-2xl font-bold text-gray-800">Masih Terkunci</h2>
        <p className="mt-2 text-gray-600">
          Selesaikan dulu semua game yaa, baru kita bisa buka kenangan-kenangan ini bareng. 💌
        </p>
        <Link
          href="/surprise/games"
          className="mt-5 inline-flex items-center gap-2 rounded-2xl bg-gradient-to-tr from-pink-600 to-rose-500 px-5 py-3 font-semibold text-white shadow-md hover:brightness-105 active:translate-y-px transition"
        >
          Mainkan Games
        </Link>
      </div>
    </section>
  );
}

function YearHeader({ year }: { year: string }) {
  const { ref, visible } = useReveal<HTMLDivElement>();
  return (
    <div ref={ref} className={`reveal ${visible ? 'show' : ''}`}>
      <div className="relative flex items-center gap-3 md:gap-4">
        {/* dot di tengah hanya di md+ */}
        <span className="hidden md:block absolute left-1/2 -translate-x-1/2 h-3 w-3 rounded-full bg-gradient-to-tr from-pink-500 to-rose-400 ring-4 ring-white/70 shadow" />
        <h2 className="md:pl-8 font-serif text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight text-pink-700">
          {year}
        </h2>
      </div>
    </div>
  );
}

function EventItem({ event, flip }: { event: JourneyEvent; flip?: boolean }) {
  // ref harus HTMLLIElement untuk <li>
  const { ref, visible } = useReveal<HTMLLIElement>();

  return (
    <li
      ref={ref}
      className={`reveal ${visible ? 'show' : ''} relative grid grid-cols-1 md:grid-cols-12 md:gap-6`}
    >
      {/* garis tipis ke tengah (md+) */}
      <div className="hidden md:block absolute left-1/2 -translate-x-1/2 top-3 bottom-0 w-px bg-rose-100" />

      {/* kartu foto */}
      <div className={clsx('md:col-span-5', flip ? 'md:order-2' : 'md:order-1')}>
        <MemoryCard event={event} />
        {/* meta khusus mobile: tampil di bawah kartu */}
        <div className="mt-3 md:hidden">
          <EventMeta event={event} />
        </div>
      </div>

      {/* spacer */}
      <div className="hidden md:block md:col-span-2 md:order-2" />

      {/* meta sisi berlawanan (md+) */}
      <div className={clsx('hidden md:flex md:col-span-5 items-center', flip ? 'md:order-1 md:justify-end' : 'md:order-3')}>
        <EventMeta event={event} alignRight={flip} />
      </div>
    </li>
  );
}

function MemoryCard({ event }: { event: JourneyEvent }) {
  return (
    <div className="rounded-2xl border border-white/60 bg-white/90 backdrop-blur shadow-[0_18px_50px_rgba(236,72,153,0.15)] overflow-hidden">
      <div className="relative aspect-[4/3] sm:aspect-[16/10] md:aspect-[4/3]">
        <Image
          src={event.image}
          alt={event.title}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 92vw, (max-width: 1024px) 45vw, 40vw"
          priority={false}
        />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/10 via-transparent to-black/20" />
      </div>
      <div className="p-4 sm:p-5">
        <h3 className="font-serif text-lg sm:text-xl md:text-2xl font-bold text-pink-800">{event.title}</h3>
        <p className="mt-1 text-gray-700 text-sm sm:text-base">{event.caption}</p>
      </div>
    </div>
  );
}

function EventMeta({ event, alignRight }: { event: JourneyEvent; alignRight?: boolean }) {
  return (
    <div
      className={clsx(
        'rounded-2xl bg-white/85 backdrop-blur ring-1 ring-white/60 shadow-sm px-4 py-3 w-full md:w-auto',
        alignRight ? 'text-right' : 'text-left'
      )}
    >
      <p className="inline-flex items-center gap-2 font-semibold text-rose-600">
        <Calendar size={16} />
        <span>{event.date}</span>
      </p>
      {event.location && (
        <p
          className={clsx(
            'mt-1 inline-flex items-center gap-2 text-sm text-gray-600',
            alignRight && 'flex-row-reverse'
          )}
        >
          <MapPin size={14} />
          <span>{event.location}</span>
        </p>
      )}
    </div>
  );
}

function BackgroundBlobs() {
  return (
    <div className="pointer-events-none absolute inset-0 -z-10">
      <div className="absolute -top-24 left-1/3 h-[32rem] w-[32rem] rounded-full blur-3xl opacity-40 bg-gradient-to-tr from-rose-300 via-pink-200 to-fuchsia-200" />
      <div className="absolute bottom-0 right-1/4 h-[24rem] w-[24rem] rounded-full blur-3xl opacity-40 bg-gradient-to-tr from-rose-200 via-pink-300 to-rose-100" />
      <div className="absolute top-1/4 right-0 h-[18rem] w-[18rem] rounded-full blur-3xl opacity-40 bg-gradient-to-tr from-fuchsia-200 via-pink-100 to-rose-100" />
      <div className="absolute inset-0 bg-gradient-to-b from-rose-50 via-white/70 to-pink-50" />
    </div>
  );
}
