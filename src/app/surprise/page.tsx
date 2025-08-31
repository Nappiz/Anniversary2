'use client';

import { Gift, Gamepad2, HeartHandshake, Images, Map } from 'lucide-react';
import Link from 'next/link';
import { useLock } from '../context/LockContext';

export default function SurpriseHomePage() {
  const { isUnlocked } = useLock();

  return (
    <div className="mx-auto max-w-5xl">
      {/* Hero */}
      <section className="mt-6 sm:mt-10 text-center">
        <div className="mx-auto max-w-3xl rounded-3xl p-6 sm:p-10 bg-white/70 backdrop-blur border border-white/60 shadow-[0_10px_30px_rgba(0,0,0,0.06)]">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-tr from-pink-500 to-rose-400 text-white shadow">
            <Gift className="animate-pulse" />
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-pink-700">
            Happy 2nd Anniversary, Sayang! 💞
          </h1>
          <p className="mt-3 sm:mt-4 text-gray-700 text-base sm:text-lg leading-relaxed">
            Ini dunia kecil kita—tempat kenangan, mimpi, dan rencana masa depan.
            Buka tiap halaman, selesaikan tantangan, dan nikmati perjalanan cinta kita. 🫶
          </p>

          {!isUnlocked && (
            <div className="mt-6 sm:mt-8 rounded-2xl border border-pink-200 bg-pink-50/80 p-4 sm:p-6">
              <p className="font-semibold text-pink-800">
                Untuk membuka halaman spesial, kamu harus menuntaskan game dulu ya! ✨
              </p>
              <p className="text-pink-700/80 mt-1 text-sm">
                Hint: sabar, teliti, dan jangan menyerah~
              </p>
              <Link href="/surprise/games" className="inline-block mt-4">
                <button className="cursor-pointer bg-pink-600 text-white font-semibold py-2.5 px-5 rounded-xl shadow-md hover:bg-pink-700 active:scale-95 transition flex items-center gap-2">
                  <Gamepad2 size={20} />
                  <span>Mainkan Game</span>
                </button>
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* Quick Links / Bento */}
      <section className="mt-8 sm:mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        <CardLink
          href="/surprise/games"
          title="Games"
          desc="Pemanasan seru sebelum buka gerbang rahasia 💌"
          icon={<Gamepad2 />}
        />
        <CardLink
          href="/surprise/journey"
          title="Journey"
          desc="Timeline kenangan kita dari awal sampai sekarang"
          icon={<Map />}
          locked={!isUnlocked}
        />
        <CardLink
          href="/surprise/future"
          title="Future"
          desc="Bucket list, rencana liburan, dan mimpi bareng"
          icon={<HeartHandshake />}
          locked={!isUnlocked}
        />
        <CardLink
          href="/surprise/gallery"
          title="Gallery"
          desc="Kumpulan foto favorit kita (biar bisa senyum-senyum sendiri)"
          icon={<Images />}
          locked={!isUnlocked}
        />
        <CardLink
          href="/surprise/untuk-kamu"
          title="Untuk Kamu"
          desc="Surat dan pesan khusus buat kamu"
          icon={<HeartHandshake />}
          locked={!isUnlocked}
        />
      </section>
    </div>
  );
}

function CardLink({
  href,
  title,
  desc,
  icon,
  locked,
}: {
  href: string;
  title: string;
  desc: string;
  icon: React.ReactNode;
  locked?: boolean;
}) {
  const inner = (
    <div className="relative h-full rounded-2xl border border-white/60 bg-white/70 backdrop-blur p-5 shadow-[0_10px_30px_rgba(0,0,0,0.06)] transition hover:-translate-y-0.5 active:translate-y-0">
      <div className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-pink-500 to-rose-400 text-white shadow">
        {icon}
      </div>
      <h3 className="text-lg font-bold text-pink-800">{title}</h3>
      <p className="mt-1 text-sm text-gray-600">{desc}</p>
      {locked && (
        <span className="absolute right-4 top-4 inline-flex items-center gap-1 rounded-full bg-pink-100 px-2 py-1 text-xs font-semibold text-pink-700">
          <svg width="12" height="12" viewBox="0 0 24 24" className="opacity-80"><path fill="currentColor" d="M12 17a2 2 0 1 0 0-4a2 2 0 0 0 0 4m6-6h-1V9a5 5 0 1 0-10 0v2H6a2 2 0 0 0-2 2v7a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-7a2 2 0 0 0-2-2m-3 0H9V9a3 3 0 0 1 6 0z"/></svg>
          Locked
        </span>
      )}
    </div>
  );

  return locked ? (
    <div className="opacity-60 cursor-not-allowed">{inner}</div>
  ) : (
    <Link href={href} className="block">{inner}</Link>
  );
}
