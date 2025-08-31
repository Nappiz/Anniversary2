'use client';

import { useDrag } from 'react-dnd';
import clsx from 'clsx';

export default function PuzzlePiece({
  id,
  src,
  pieceSize,
  boardDimension,
  position,
}: {
  id: number;
  src: string;
  pieceSize: number;
  boardDimension: number;
  position: { x: number; y: number };
}) {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: 'puzzle-piece',
    item: { id },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }), [id]);

  return (
    <div
      ref={drag}
      className={clsx(
        'relative rounded-md select-none touch-none',
        'transition-transform duration-150 ease-out cursor-grab active:cursor-grabbing',
        isDragging && 'opacity-80 scale-105 ring-2 ring-pink-400 shadow-xl z-20',
      )}
      style={{ width: pieceSize, height: pieceSize }}
    >
      <div
        className="absolute inset-0 rounded-[6px]"
        style={{  
          backgroundImage: `url(${src})`,
          backgroundSize: `${boardDimension}px ${boardDimension}px`,
          backgroundPosition: `-${position.x}px -${position.y}px`,
        }}
      />
    </div>
  );
}
