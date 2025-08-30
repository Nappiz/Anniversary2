// app/components/games/GameCard.tsx
import Link from 'next/link';
import clsx from 'clsx';
import { CheckCircle2 } from 'lucide-react';

type GameCardProps = {
  title: string;
  description: string;
  href: string;
  isCompleted: boolean;
  icon: React.ReactNode;
};

export default function GameCard({ title, description, href, isCompleted, icon }: GameCardProps) {
  return (
    <Link href={href} 
      className={clsx(
        'relative block w-full p-8 rounded-2xl shadow-lg text-center transition-all duration-300 transform hover:-translate-y-2',
        {
          'bg-gradient-to-br from-green-400 to-emerald-500 text-white': isCompleted,
          'bg-white hover:shadow-xl': !isCompleted,
        }
      )}
    >
      {isCompleted && (
        <div className="absolute top-4 right-4 flex items-center gap-2 bg-white/20 text-white text-xs font-bold px-2 py-1 rounded-full">
          <CheckCircle2 size={14} />
          <span>Selesai</span>
        </div>
      )}
      <div className={clsx("mx-auto mb-4 w-16 h-16 rounded-full flex items-center justify-center", {
        'bg-white/20 text-white': isCompleted,
        'bg-pink-100 text-pink-500': !isCompleted
      })}>
        {icon}
      </div>
      <h3 className={clsx("text-2xl font-bold", { 'text-white': isCompleted, 'text-gray-800': !isCompleted })}>
        {title}
      </h3>
      <p className={clsx("mt-2", { 'text-white/80': isCompleted, 'text-gray-500': !isCompleted })}>
        {description}
      </p>
    </Link>
  );
}