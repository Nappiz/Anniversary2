import type { Metadata } from 'next';
import { Nunito } from 'next/font/google'; // Import font Nunito
import './globals.css';

const nunito = Nunito({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Happy 2nd Anniversary!',
  description: 'A special page for our 2nd anniversary.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={nunito.className}>{children}</body>
    </html>
  );
}