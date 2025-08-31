'use client';

import clsx from 'clsx';
import { useDrop } from 'react-dnd';

type DragItem = { id: number; type: 'puzzle-piece' };
type Slot = { id: number; piece: { id: number } | null };

export default function PuzzleBoard({
  board,
  onDrop,
  pieceSize,
  imageSrc,
  boardDimension,
}: {
  board: Slot[];
  onDrop: (slotId: number, pieceId: number) => void;
  pieceSize: number;
  imageSrc: string;
  boardDimension: number;
}) {
  const gridSize = Math.round(Math.sqrt(board.length));

  return (
    <div
      className="relative"
      style={{ width: boardDimension, height: boardDimension }}
    >
      <div
        className="grid"
        style={{
          gridTemplateColumns: `repeat(${gridSize}, ${pieceSize}px)`,
          gridTemplateRows: `repeat(${gridSize}, ${pieceSize}px)`,
        }}
      >
        {board.map((slot) => (
          <BoardCell
            key={slot.id}
            slot={slot}
            gridSize={gridSize}
            pieceSize={pieceSize}
            imageSrc={imageSrc}
            boardDimension={boardDimension}
            onDrop={onDrop}
          />
        ))}
      </div>
    </div>
  );
}

function BoardCell({
  slot,
  gridSize,
  pieceSize,
  imageSrc,
  boardDimension,
  onDrop,
}: {
  slot: Slot;
  gridSize: number;
  pieceSize: number;
  imageSrc: string;
  boardDimension: number;
  onDrop: (slotId: number, pieceId: number) => void;
}) {
  const [{ isOver, draggedId }, drop] = useDrop<
    DragItem,
    void,
    { isOver: boolean; draggedId?: number }
  >(() => ({
    accept: 'puzzle-piece',
    drop: (item) => onDrop(slot.id, item.id),
    collect: (monitor) => ({
      isOver: monitor.isOver({ shallow: true }),
      draggedId: (monitor.getItem() as any)?.id,
    }),
  }));

  const correctHover = isOver && draggedId === slot.id;
  const wrongHover = isOver && draggedId !== slot.id;

  // posisi background untuk potongan yang terpasang
  const idForBG = slot.piece?.id ?? slot.id; // fallback: slot.id untuk placeholder grid
  const bgX = ((idForBG - 1) % gridSize) * pieceSize;
  const bgY = Math.floor((idForBG - 1) / gridSize) * pieceSize;

  return (
    <div
      ref={drop}
      className={clsx(
        'relative border border-neutral-200 bg-white/60',
        'transition-all duration-150 ease-out',
        isOver && 'ring-2',
        correctHover && 'ring-emerald-500 scale-[1.02] bg-emerald-50',
        wrongHover && 'ring-rose-400 bg-rose-50',
      )}
      style={{ width: pieceSize, height: pieceSize }}
    >
      {/* Potongan yang sudah ditempatkan */}
      {slot.piece && (
        <div
          className="absolute inset-0 rounded-sm"
          style={{
            backgroundImage: `url(${imageSrc})`,
            backgroundSize: `${boardDimension}px ${boardDimension}px`,
            backgroundPosition: `-${bgX}px -${bgY}px`,
          }}
        />
      )}

      {/* Ghost preview halus saat hover di slot kosong */}
      {!slot.piece && isOver && (
        <div
          className={clsx(
            'absolute inset-0 rounded-sm opacity-25',
            correctHover ? 'bg-emerald-400' : 'bg-rose-400',
          )}
        />
      )}
    </div>
  );
}
