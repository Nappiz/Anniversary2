// app/components/games/PuzzlePiece.tsx
'use client';
import { useDrag } from 'react-dnd';
import { useRef } from 'react';

// Tambahkan boardDimension di sini
type PuzzlePieceProps = {
  id: number;
  src: string;
  position: {x: number, y: number};
  pieceSize: number;
  boardDimension: number; 
};

export default function PuzzlePiece({ id, src, position, pieceSize, boardDimension }: PuzzlePieceProps) {
  const ref = useRef<HTMLDivElement>(null);
  
  const [{ isDragging }, drag] = useDrag(() => ({
    type: 'puzzle-piece',
    item: { id },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }));

  drag(ref);

  return (
    <div
      ref={ref}
      className="cursor-grab active:cursor-grabbing"
      style={{
        opacity: isDragging ? 0.5 : 1,
        width: pieceSize,
        height: pieceSize,
        backgroundImage: `url(${src})`,
        backgroundPosition: `-${position.x}px -${position.y}px`,
        backgroundSize: `${boardDimension}px ${boardDimension}px`,
        border: '1px solid #fff',
      }}
    />
  );
}