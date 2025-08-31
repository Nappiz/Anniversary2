// app/surprise/layout.tsx
import Navbar from '../components/surprise/Navbar';
import { LockProvider } from '../context/LockContext';
import { GameProgressProvider } from '../context/GameProgressContext';

export default function SurpriseLayout({ children }: { children: React.ReactNode }) {
  return (
    <LockProvider>
      <GameProgressProvider>
        <div className="min-h-screen w-full bg-rose-50">
          <Navbar />
          {/* ruang di bawah navbar fixed (h-16 = 64px) */}
          <main className="pt-16">{children}</main>
        </div>
      </GameProgressProvider>
    </LockProvider>
  );
}
