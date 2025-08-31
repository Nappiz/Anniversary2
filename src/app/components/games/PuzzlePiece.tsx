'use client';

import clsx from 'clsx';

export default function PuzzlePiece({
  id,
  size,
  imageSrc,
  gridSize,
  boardDimension,
  isSelected,
}: {
  id: number;
  size: number;                  // ukuran potongan di tray
  imageSrc: string;
  gridSize: number;
  boardDimension: number;        // ukuran papan versi "tray" (scaled)
  isSelected?: boolean;
}) {
  const bgX = ((id - 1) % gridSize) * size;
  const bgY = Math.floor((id - 1) / gridSize) * size;

  return (
    <div
      className={clsx(
        'relative',
        'rounded-lg overflow-hidden',
        'transition-transform duration-100',
        isSelected ? 'ring-2 ring-pink-500' : 'ring-1 ring-gray-200',
        'active:scale-[0.98]'
      )}
      style={{ width: size, height: size }}
    >
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: `url(${imageSrc})`,
          backgroundSize: `${boardDimension}px ${boardDimension}px`,
          backgroundPosition: `-${bgX}px -${bgY}px`,
        }}
      />
    </div>
  );
}
