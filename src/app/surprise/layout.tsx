// app/surprise/layout.tsx
import Navbar from '../components/surprise/Navbar';
import { LockProvider } from '../context/LockContext';
import { GameProgressProvider } from '../context/GameProgressContext'; // <-- IMPORT

export default function SurpriseLayout({ children }: { children: React.Node }) {
  return (
    <LockProvider>
      <GameProgressProvider> {/* <-- BUNGKUS DENGAN PROVIDER BARU */}
        <div className="min-h-screen w-full bg-rose-50">
          <Navbar />
          <main>{children}</main>
        </div>
      </GameProgressProvider>
    </LockProvider>
  );
}