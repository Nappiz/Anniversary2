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

  useEffect(() => {
    if (isOpen) {
      setIsOpen(false);
    }
  }, [pathname]);

  return (
    <header className="top-0 z-50 w-full bg-white/50 backdrop-blur-lg shadow-sm">
      <nav className="relative mx-auto flex max-w-4xl items-center justify-between p-4">
        <Link href="/surprise" className="flex items-center gap-2 text-pink-600 font-bold">
          <Heart className="fill-current" />
          <span>Our Story</span>
        </Link>

        <ul className="hidden md:flex items-center gap-2">
          {navLinks.map((link) => {
            const isLocked = link.isLocked && !isUnlocked;
            if (isLocked) {
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
                    { 'bg-pink-500 text-white shadow': pathname === link.href,
                      'text-pink-700 hover:bg-pink-100': pathname !== link.href }
                  )}
                >
                  {link.name}
                </Link>
              </li>
            );
          })}
        </ul>

        <div className="md:hidden">
          <button onClick={() => setIsOpen(!isOpen)} aria-label="Toggle Menu">
            {isOpen ? <X className="text-pink-600" /> : <Menu className="text-pink-600" />}
          </button>
        </div>
      </nav>

      {isOpen && (
        <div className="md:hidden absolute left-0 w-full bg-white/95 backdrop-blur-lg shadow-md z-50">
          <ul className="flex flex-col items-center gap-2 p-4">
            {navLinks.map((link) => {
              const isLocked = link.isLocked && !isUnlocked;
              if (isLocked) {
                return (
                  <li key={link.name}>
                    <span className="flex w-full justify-center items-center gap-2 px-4 py-3 rounded-lg text-pink-700/40 cursor-not-allowed">
                      <Lock size={14} /> {link.name}
                    </span>
                  </li>
                );
              }
              return (
                <li key={link.name} className="w-full">
                  <Link
                    href={link.href}
                    className={clsx(
                      'block w-full text-center px-4 py-3 rounded-lg font-semibold transition-colors duration-200',
                      { 'bg-pink-500 text-white shadow': pathname === link.href,
                        'text-pink-700 hover:bg-pink-100': pathname !== link.href }
                    )}
                  >
                    {link.name}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </header>
  );
}
