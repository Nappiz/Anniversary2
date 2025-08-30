import Image from "next/image";
import { Heart } from "lucide-react";
import clsx from "clsx";

export type PhotoCardProps = {
  src: string;
  caption: string;
  isActive?: boolean;
  onClick?: () => void;
};

export default function PhotoCard({ src, caption, isActive, onClick }: PhotoCardProps) {
  return (
    <div
      className={clsx(
        "card group relative flex-shrink-0",
        "w-[200px] h-[280px] sm:w-[240px] sm:h-[320px] md:w-[280px] md:h-[380px] lg:w-[320px] lg:h-[440px]",
        "rounded-2xl bg-white shadow-[0_20px_60px_-20px_rgba(244,114,182,0.35)]",
        "transition-transform duration-500 will-change-transform select-none",
        "ring-1 ring-rose-100/60",
        isActive ? "scale-[1.02]" : "scale-[0.98] hover:scale-[1.01]"
      )}
      onClick={onClick}
    >
      <div
        className={clsx(
          "pointer-events-none absolute -inset-1 rounded-3xl opacity-0 blur-2xl transition-opacity duration-700",
          isActive && "opacity-100",
          "bg-[conic-gradient(at_50%_50%,rgba(244,114,182,.35),rgba(244,114,182,0)_40%,rgba(236,72,153,.35)_70%,rgba(244,114,182,.35))]"
        )}
        aria-hidden
      />

      <div className="relative m-3 rounded-xl bg-white overflow-hidden shadow-inner">
        <div
          className={clsx(
            "relative w-full",
            "h-[220px] sm:h-[260px] md:h-[300px] lg:h-[360px]"
          )}
        >
          <Image
            src={src}
            alt={caption}
            fill
            className="object-cover transition-transform duration-[900ms] ease-[cubic-bezier(0.2,0.6,0,1)] group-hover:scale-[1.03]"
            sizes="(max-width: 640px) 80vw, (max-width: 1024px) 48vw, 33vw"
            priority={false}
          />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/10 via-transparent to-black/20" />
        </div>

        <div className="relative px-3 sm:px-4 py-2 sm:py-3">
          <p className="text-center font-serif text-rose-700/90 italic text-sm sm:text-base md:text-lg">
            {caption}
          </p>

          <div className="absolute -top-3 -right-2 rotate-6">
            <span className="inline-flex items-center gap-1 rounded-full bg-rose-100/90 px-2 py-1 text-rose-500 text-[10px] sm:text-xs font-semibold shadow-sm ring-1 ring-rose-200/60">
              <Heart className="h-3 w-3 fill-rose-400/70" />
              us ❤
            </span>
          </div>
        </div>
      </div>

      <div
        className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{ background: "linear-gradient(120deg, rgba(255,255,255,0.12), rgba(255,255,255,0) 45%)" }}
      />
    </div>
  );
}
