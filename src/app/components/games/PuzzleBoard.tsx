'use client';

import clsx from 'clsx';

type Piece = { id: number };
type Slot = { id: number; piece: Piece | null };

export default function PuzzleBoard({
  board,
  onCellClick,
  pieceSize,
  imageSrc,
  boardDimension,
  selectedPieceId,
  selectedFrom,
  selectedOriginSlotId,
  hoveredSlotId,
  setHoveredSlotId,
  gridSize,
}: {
  board: Slot[];
  onCellClick: (slotId: number) => void;
  pieceSize: number;
  imageSrc: string;
  boardDimension: number;
  selectedPieceId: number | null;
  selectedFrom: 'tray' | 'board' | null;
  selectedOriginSlotId: number | null;
  hoveredSlotId: number | null;
  setHoveredSlotId: (id: number | null) => void;
  gridSize: number;
}) {
  return (
    <div
      className="relative select-none"
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
            pieceSize={pieceSize}
            imageSrc={imageSrc}
            boardDimension={boardDimension}
            onClick={() => onCellClick(slot.id)}
            isHovered={hoveredSlotId === slot.id}
            onHover={(v) => setHoveredSlotId(v ? slot.id : null)}
            isSelectedOrigin={selectedFrom === 'board' && selectedOriginSlotId === slot.id}
            selectedPieceId={selectedPieceId}
            gridSize={gridSize}
          />
        ))}
      </div>
    </div>
  );
}

function BoardCell({
  slot,
  pieceSize,
  imageSrc,
  boardDimension,
  onClick,
  isHovered,
  onHover,
  isSelectedOrigin,
  selectedPieceId,
  gridSize,
}: {
  slot: Slot;
  pieceSize: number;
  imageSrc: string;
  boardDimension: number;
  onClick: () => void;
  isHovered: boolean;
  onHover: (hovering: boolean) => void;
  isSelectedOrigin: boolean;
  selectedPieceId: number | null;
  gridSize: number;
}) {
  // posisi background untuk potongan yang terpasang
  const idForBG = slot.piece?.id ?? slot.id; // placeholder grid pakai slot.id
  const bgX = ((idForBG - 1) % gridSize) * pieceSize;
  const bgY = Math.floor((idForBG - 1) / gridSize) * pieceSize;

  const showPreview = selectedPieceId !== null && isHovered && !slot.piece;
  const correctPreview = showPreview && selectedPieceId === slot.id;

  return (
    <button
      onClick={onClick}
      onMouseEnter={() => onHover(true)}
      onMouseLeave={() => onHover(false)}
      onTouchStart={() => onHover(true)}
      onTouchEnd={() => onHover(false)}
      className={clsx(
        'relative',
        'border border-neutral-200 bg-white/60',
        'transition-all duration-150 ease-out',
        isSelectedOrigin && 'ring-2 ring-pink-500',
        'focus:outline-none focus:ring-2 focus:ring-pink-500'
      )}
      style={{ width: pieceSize, height: pieceSize }}
      aria-label={`Slot ${slot.id}`}
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

      {/* Ghost preview saat hover & ada selection dari tray */}
      {showPreview && (
        <div
          className={clsx(
            'absolute inset-0 rounded-sm opacity-30',
            correctPreview ? 'bg-emerald-400' : 'bg-rose-400'
          )}
        />
      )}
    </button>
  );
}
