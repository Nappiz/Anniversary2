// app/components/surprise/Navbar.tsx
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import clsx from 'clsx';
import { Heart, Lock, Menu, X } from 'lucide-react';
import { useLock } from '../../context/LockContext';

const navLinks = [
  { name: 'Home', href: '/surprise', isLocked: false },
  { name: 'Games', href: '/surprise/games', isLocked: false },
  { name: 'Journey', href: '/surprise/journey', isLocked: true },
  { name: 'Future', href: '/surprise/future', isLocked: true },
  { name: 'Gallery', href: '/surprise/gallery', isLocked: true },
  { name: 'Untuk Kamu', href: '/surprise/untuk-kamu', isLocked: true },
];

export default function Navbar() {
  const pathname = usePathname();
  const { isUnlocked } = useLock();
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => { if (isOpen) setIsOpen(false); }, [pathname]);

  return (
    <header
      className={clsx(
        'fixed inset-x-0 top-0 z-[1200]',           // PALING DEPAN
        'bg-white/70 backdrop-blur-lg border-b border-white/60 shadow-sm'
      )}
    >
      <nav className="mx-auto flex h-16 max-w-5xl items-center justify-between px-4">
        {/* Brand */}
        <Link href="/surprise" className="flex items-center gap-2 text-pink-600 font-bold">
          <span className="inline-flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-tr from-pink-500 to-rose-400 text-white shadow">
            <Heart size={18} />
          </span>
          <span>Our Story</span>
        </Link>

        {/* Desktop */}
        <ul className="hidden md:flex items-center gap-2">
          {navLinks.map((link) => {
            const locked = link.isLocked && !isUnlocked;
            const active = pathname === link.href;
            if (locked) {
              return (
                <li key={link.name}>
                  <span className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold text-pink-700/40 cursor-not-allowed">
                    <Lock size={14} /> {link.name}
                  </span>
                </li>
              );
            }
            return (
              <li key={link.name}>
                <Link
                  href={link.href}
                  className={clsx(
                    'px-4 py-2 rounded-lg text-sm font-semibold transition-colors duration-200',
                    active ? 'bg-pink-500 text-white shadow' : 'text-pink-700 hover:bg-pink-100'
                  )}
                >
                  {link.name}
                </Link>
              </li>
            );
          })}
        </ul>

        {/* Mobile toggle */}
        <button
          onClick={() => setIsOpen((v) => !v)}
          aria-label="Toggle Menu"
          aria-expanded={isOpen}
          className="md:hidden rounded-lg p-2 text-pink-700 hover:bg-pink-100 active:scale-95 transition"
        >
          {isOpen ? <X /> : <Menu />}
        </button>
      </nav>

      {/* Mobile overlay + dropdown (SOLID, NON-TRANSPARENT) */}
      {isOpen && (
        <>
          {/* overlay di bawah header, nutup konten tapi bukan header */}
          <div
            className="fixed inset-x-0 top-16 bottom-0 z-[1100] bg-black/30"
            onClick={() => setIsOpen(false)}
          />
          {/* panel menu: solid putih, tidak transparan */}
          <div
            className="fixed inset-x-0 top-16 z-[1150] bg-white border-t border-gray-200 shadow-xl
                       max-h-[calc(100vh-64px)] overflow-y-auto md:hidden"
            role="dialog"
            aria-modal="true"
          >
            <ul className="flex flex-col items-stretch gap-2 p-4">
              {navLinks.map((link) => {
                const locked = link.isLocked && !isUnlocked;
                const active = pathname === link.href;
                if (locked) {
                  return (
                    <li key={link.name}>
                      <span className="flex w-full justify-center items-center gap-2 px-4 py-3 rounded-lg text-pink-700/40 bg-gray-50 cursor-not-allowed">
                        <Lock size={14} /> {link.name}
                      </span>
                    </li>
                  );
                }
                return (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className={clsx(
                        'block w-full text-center px-4 py-3 rounded-lg font-semibold transition-colors duration-200',
                        active ? 'bg-pink-500 text-white shadow' : 'text-pink-700 hover:bg-pink-100'
                      )}
                    >
                      {link.name}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        </>
      )}
    </header>
  );
}
