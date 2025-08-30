// app/components/games/PuzzleBoard.tsx
'use client';
import { useDrop } from 'react-dnd';
import PuzzlePiece from './PuzzlePiece';
import { useRef } from 'react';

type Slot = { id: number; piece: { id: number } | null };

// Tambahkan boardDimension di sini
type PuzzleBoardProps = {
  board: Slot[];
  onDrop: (slotId: number, pieceId: number) => void;
  pieceSize: number;
  imageSrc: string;
  boardDimension: number;
};

// Tambahkan boardDimension di sini juga
type DropSlotProps = {
  slot: Slot;
  onDrop: (slotId: number, pieceId: number) => void;
  pieceSize: number;
  imageSrc: string;
  boardDimension: number;
};


export default function PuzzleBoard({ board, onDrop, pieceSize, imageSrc, boardDimension }: PuzzleBoardProps) {
  return (
    <div className="grid grid-cols-3 w-max shadow-2xl border-4 border-white rounded-lg">
      {board.map((slot) => (
        <DropSlot key={slot.id} slot={slot} onDrop={onDrop} pieceSize={pieceSize} imageSrc={imageSrc} boardDimension={boardDimension} />
      ))}
    </div>
  );
}

function DropSlot({ slot, onDrop, pieceSize, imageSrc, boardDimension }: DropSlotProps) {
  const ref = useRef<HTMLDivElement>(null);
  
  const [{ isOver }, drop] = useDrop(() => ({
    accept: 'puzzle-piece',
    drop: (item: { id: number }) => onDrop(slot.id, item.id),
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
    }),
  }));

  drop(ref);

  return (
    <div
      ref={ref}
      className="relative flex items-center justify-center bg-pink-100/50"
      style={{ width: pieceSize, height: pieceSize, outline: isOver ? '2px dashed #ec4899' : '1px solid #fbcfe8' }}
    >
      {slot.piece && (
        <PuzzlePiece
          id={slot.piece.id}
          src={imageSrc}
          pieceSize={pieceSize}
          boardDimension={boardDimension}
          position={{
            x: ((slot.piece.id - 1) % 3) * pieceSize,
            y: Math.floor((slot.piece.id - 1) / 3) * pieceSize,
          }}
        />
      )}
    </div>
  );
}