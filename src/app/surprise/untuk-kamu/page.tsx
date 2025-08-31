'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { Heart, Sparkles, PartyPopper } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Variants } from 'framer-motion';
import { useLock } from '../../context/LockContext';

type Burst = { id: number; x: number; y: number; r: number };

// Easing tuples (cubic-bezier)
// easeOut:  [0.16, 1, 0.3, 1]
// easeInOut:[0.45, 0, 0.55, 1]
const EASE_OUT: [number, number, number, number] = [0.16, 1, 0.3, 1];
const EASE_IN_OUT: [number, number, number, number] = [0.45, 0, 0.55, 1];

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 12 },
  show: (i: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: { delay: 0.05 * i, duration: 0.45, ease: EASE_OUT },
  }),
};

export default function UntukKamuPage() {
  const { isUnlocked } = useLock();

  // mouse parallax
  const [mx, setMx] = useState(0);
  const [my, setMy] = useState(0);
  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      const x = e.clientX / window.innerWidth - 0.5;
      const y = e.clientY / window.innerHeight - 0.5;
      setMx(x);
      setMy(y);
    };
    window.addEventListener('mousemove', onMove);
    return () => window.removeEventListener('mousemove', onMove);
  }, []);

  // heart bursts
  const [bursts, setBursts] = useState<Burst[]>([]);
  const [nextId, setNextId] = useState(1);
  const addBurst = () => {
    const id = nextId;
    setNextId(id + 1);
    const x = Math.random() * 80 + 10; // 10–90%
    const y = Math.random() * 30 + 35; // 35–65%
    const r = Math.random() * 40 - 20; // -20..20
    setBursts((b) => [...b, { id, x, y, r }]);
    setTimeout(() => setBursts((b) => b.filter((v) => v.id !== id)), 1100);
  };

  const [open, setOpen] = useState(false);
  const yearText = useMemo(() => new Date().getFullYear(), []);

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
            Hai sayang, ini khusus yang sudah menang 💖
          </h1>
          <p className="text-gray-600 mt-3">
            Untuk membaca surat spesial ini, kamu harus menyelesaikan gamenya dulu yaa, bib.
            Semangat! ✨
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

  return (
    <div className="relative mt-16 overflow-hidden">
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute inset-0 opacity-[0.04] [background-image:linear-gradient(to_right,#000_1px,transparent_1px),linear-gradient(to_bottom,#000_1px,transparent_1px)] [background-size:48px_48px]" />
        <motion.div
          className="absolute -top-20 -left-20 h-72 w-72 rounded-full blur-3xl"
          style={{ background: 'radial-gradient(120px 120px at 50% 50%, #fb7185, transparent)' }}
          animate={{ x: mx * 40, y: my * 40, scale: [1, 1.05, 1] }}
          transition={{ repeat: Infinity, duration: 6, ease: EASE_IN_OUT }}
        />
        <motion.div
          className="absolute -bottom-20 -right-20 h-80 w-80 rounded-full blur-3xl"
          style={{ background: 'radial-gradient(140px 140px at 50% 50%, #fca5a5, transparent)' }}
          animate={{ x: mx * -50, y: my * -50, scale: [1.05, 1, 1.05] }}
          transition={{ repeat: Infinity, duration: 7, ease: EASE_IN_OUT }}
        />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55 }}
        className="relative mx-auto max-w-2xl"
      >
        <motion.div
          className="mx-auto w-max rounded-full bg-pink-100/70 text-pink-700 text-sm font-semibold px-4 py-1 shadow-sm flex items-center gap-2"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1, duration: 0.4 }}
        >
          <PartyPopper size={16} /> 01 September • {yearText}
        </motion.div>

        <div className="bg-gradient-to-r from-pink-200 via-rose-200 to-fuchsia-200 p-[1px] rounded-3xl shadow-[0_10px_30px_rgba(244,114,182,0.25)] mt-6 mb-16">
          <div className="bg-white/90 backdrop-blur rounded-3xl p-8 md:p-10">
            <div className="flex items-center justify-center gap-3">
              <Sparkles className="text-pink-500" />
              <motion.h1
                className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-pink-600 to-rose-500 text-center"
                initial={{ letterSpacing: '0.05em' }}
                animate={{ letterSpacing: '0.02em' }}
                transition={{ duration: 0.8, ease: EASE_OUT }}
              >
                Untuk Kamu
              </motion.h1>
              <Sparkles className="text-pink-500" />
            </div>

            <motion.p
              className="text-gray-600 text-center mt-4"
              variants={fadeUp}
              initial="hidden"
              animate="show"
            >
              Selamat <span className="font-semibold text-pink-600">anniversary ke-2</span>, sayang.
              Dua tahun ini ada banyak tawa, drama, sedih, dan
              senang, aku bersyukur bisa terus sama kamu.
            </motion.p>

            <button
              onClick={() => setOpen((v) => !v)}
              className="mt-6 w-full rounded-xl border cursor-pointer border-pink-200 bg-pink-50/60 p-4 md:p-5 hover:bg-pink-50 transition-colors flex items-center justify-between"
            >
              <span className="font-semibold text-pink-800">
                {open ? 'Tutup' : 'Buka'} surat kecil dari aku ✨
              </span>
              <motion.span
                animate={{ rotate: open ? 20 : 0 }}
                transition={{ type: 'spring', stiffness: 300, damping: 15 }}
              >
                <Heart className="text-pink-500" />
              </motion.span>
            </button>

            <AnimatePresence initial={false}>
              {open && (
                <motion.div
                  key="letter"
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.35, ease: EASE_IN_OUT }}
                  className="overflow-hidden"
                >
                  <div className="mt-4 space-y-4 leading-relaxed text-gray-700">
                    <motion.p variants={fadeUp} initial="hidden" animate="show">
                      Halo sayang, ga kerasa banget yaa tiba tiba udah 2 tahun aja, perasaan baru kemarin kita kenalan dan jadian.
                      Aku bener bener ga nyangka kita bisa sejauh ini, aku gapernah berfikir orang yang aku deketin karena nemu di hashtag
                      bakal bareng sama aku terus selama 2 tahun. Walaupun ada banyak suka duka, aku tetep seneng banget bisa terus sama kamu.
                    </motion.p>
                    <motion.p variants={fadeUp} initial="hidden" animate="show" custom={1}>
                      Semoga di tahun kedua ini kita bisa belajar dari kesalahan sebelum sebelumnya yaa, semoga kita bisa jadi lebih
                      baik lagi dari yang sebelumnya dan ga ngulangin kesalahan yang sama lagi, I Love You Babee!
                    </motion.p>
                    <motion.p
                      variants={fadeUp}
                      initial="hidden"
                      animate="show"
                      custom={2}
                      className="italic text-pink-700"
                    >
                      – Dari aku
                    </motion.p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="mt-8">
              <h2 className="text-xl font-bold text-pink-700 text-center">
                10 hal kecil yang bikin aku sayang kamu
              </h2>
              <motion.div
                className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3"
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, margin: '-80px' }}
              >
                {[
                  'Kamu pengertian banget dalam segala hal dari kekuranganku.',
                  'Selalu inget detail kecil dari kita.',
                  'Cuma chat “udah makan belum?” udah bikin hari cerah.',
                  'Cara marah kamu yang lucuu ituu.',
                  'Sabar pas aku kadang marah marah gajelas.',
                  'Nenangin aku pas aku sedih akan suatu hal.',
                  'Mau diajak receh dari meme sampe jokes asep knalpot.',
                  'Semangat gamau kalahmu yang bikin aku lebih semangat lagi.',
                  'Mau diajak hemat dan susah wkwkwk.',
                  'Suka peluk peluk hihihi.',
                ].map((txt, i) => (
                  <motion.div
                    key={i}
                    variants={fadeUp}
                    custom={i * 0.6}
                    className="rounded-xl border border-pink-100 bg-white p-4 shadow-sm hover:shadow-md transition-shadow flex items-start gap-3"
                  >
                    <Heart size={16} className="mt-1 text-pink-500" />
                    <p className="text-gray-700">{txt}</p>
                  </motion.div>
                ))}
              </motion.div>
            </div>

            <div className="mt-8">
              <h2 className="text-xl font-bold text-pink-700 text-center">
                Janjiku untuk tahun ini
              </h2>
              <motion.ul
                className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3 text-gray-700"
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, margin: '-80px' }}
              >
                {[
                  'Dengerin dulu, debatnya nanti.',
                  'Perlahan gak marah marah gajelas lagi.',
                  'Sering sering jajanin kamu.',
                  'Jadi lebih baik dari sebelumnya.',
                  'Lebih sabar lagi menghadapi kamu.',
                ].map((txt, i) => (
                  <motion.li
                    key={i}
                    variants={fadeUp}
                    custom={i * 0.6}
                    className="rounded-xl bg-pink-50/70 border border-pink-100 px-4 py-3"
                  >
                    {txt}
                  </motion.li>
                ))}
              </motion.ul>
            </div>

            <div className="mt-10 flex flex-col items-center">
              <motion.button
                whileTap={{ scale: 0.95 }}
                whileHover={{ scale: 1.03 }}
                onClick={addBurst}
                className="cursor-pointer inline-flex items-center gap-2 bg-pink-500 text-white font-bold px-6 py-3 rounded-xl shadow-md hover:bg-pink-600 transition-colors"
              >
                <Heart className="fill-current" />
                Peluk Virtual
              </motion.button>
            </div>
          </div>
        </div>
      </motion.div>

      <div className="pointer-events-none fixed inset-0 z-40">
        <AnimatePresence>
          {bursts.map((b) => (
            <motion.div
              key={b.id}
              initial={{ opacity: 0, scale: 0.6, y: 0, rotate: 0 }}
              animate={{ opacity: 1, scale: 1, y: -120, rotate: b.r }}
              exit={{ opacity: 0, scale: 0.6 }}
              transition={{ duration: 1, ease: EASE_OUT }}
              className="absolute -translate-x-1/2 -translate-y-1/2 pointer-events-none"
              style={{ left: `${b.x}%`, top: `${b.y}%` }}
            >
              <Heart className="h-8 w-8 text-pink-400" />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
