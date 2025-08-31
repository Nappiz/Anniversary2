import type { Metadata } from 'next';
import { Nunito, Playfair_Display } from 'next/font/google';
import './globals.css';

const nunito = Nunito({ subsets: ['latin'], variable: '--font-sans' });
const playfair = Playfair_Display({ subsets: ['latin'], variable: '--font-display' });

export const metadata: Metadata = {
  title: 'Happy 2nd Anniversary!',
  description: 'A special page for our 2nd anniversary.',
  themeColor: '#ec4899',
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="id" className={`${nunito.variable} ${playfair.variable}`}>
      <body
        style={{ fontFamily: 'var(--font-sans)' }}
        className="antialiased text-slate-800 selection:bg-pink-200/60 selection:text-pink-900"
      >
        <div className="pointer-events-none fixed inset-0 -z-10">
          <div className="absolute inset-0 bg-gradient-to-b from-rose-50 via-white to-pink-50" />
        </div>

        {children}
      </body>
    </html>
  );
}
