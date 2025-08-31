'use client';

import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { DndProvider, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import {TouchBackend} from 'react-dnd-touch-backend'; // NEW: backend untuk perangkat sentuh
import { useRouter } from 'next/navigation';
import { useGameProgress } from '../../../context/GameProgressContext';
import PuzzleBoard from '../../../components/games/PuzzleBoard';
import PuzzlePiece from '../../../components/games/PuzzlePiece';
import WinModal from '../../../components/games/WinModal';
import Image from 'next/image';
import clsx from 'clsx';

const IMAGE_SRC = '/images/puzzle.jpg';
const GRID_SIZE = 3;

// --- Hook kecil untuk menghitung dimensi papan secara responsif
function useResponsiveBoardDim(max = 450, min = 220) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [dim, setDim] = useState<number>(max);

  useLayoutEffect(() => {
    const calc = () => {
      const w = wrapperRef.current?.clientWidth ?? window.innerWidth;
      // margin/padding kira-kira 32px
      const target = Math.min(max, Math.max(min, Math.floor(w - 32)));
      setDim(target);
    };
    calc();
    window.addEventListener('resize', calc);
    return () => window.removeEventListener('resize', calc);
  }, [max, min]);

  return { wrapperRef, dim };
}

function PieceTray({
  pieces,
  onDrop,
  children,
}: {
  pieces: { id: number }[];
  onDrop: (pieceId: number) => void;
  children: React.ReactNode;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [{ isOver }, drop] = useDrop(() => ({
    accept: 'puzzle-piece',
    drop: (item: { id: number }) => onDrop(item.id),
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
    }),
  }));

  drop(ref);

  return (
    <div
      ref={ref}
      className={clsx(
        'bg-white p-4 rounded-xl shadow-lg transition-colors',
        { 'bg-pink-100': isOver },
      )}
    >
      {children}
    </div>
  );
}

export default function PuzzlePage() {
  const router = useRouter();
  const { completePuzzle } = useGameProgress();

  // --- RESPONSIVE SIZE CALC
  const { wrapperRef, dim: boardDimension } = useResponsiveBoardDim(450, 220);
  const pieceSize = useMemo(() => boardDimension / GRID_SIZE, [boardDimension]);
  const trayScale = boardDimension < 340 ? 0.45 : 0.5;
  const trayPieceSize = useMemo(() => pieceSize * trayScale, [pieceSize, trayScale]);
  const trayBoardDimension = useMemo(() => boardDimension * trayScale, [boardDimension, trayScale]);

  // --- BACKEND: Touch di HP, HTML5 di desktop
  const isTouchDevice =
    typeof window !== 'undefined' &&
    ('ontouchstart' in window || navigator.maxTouchPoints > 0);
  const Backend = isTouchDevice ? (TouchBackend as any) : HTML5Backend;
  const backendOptions = isTouchDevice ? { enableMouseEvents: true } : undefined;

  // --- STATE PUZZLE
  const initialPieces = useMemo(
    () => Array.from({ length: GRID_SIZE * GRID_SIZE }, (_, i) => ({ id: i + 1 })),
    [],
  );

  const [puzzleState, setPuzzleState] = useState(() => ({
    board: Array.from({ length: GRID_SIZE * GRID_SIZE }, (_, i) => ({
      id: i + 1,
      piece: null as { id: number } | null,
    })),
    tray: initialPieces,
  }));

  const [isWinModalOpen, setIsWinModalOpen] = useState(false);

  useEffect(() => {
    setPuzzleState((currentState) => ({
      ...currentState,
      tray: [...currentState.tray].sort(() => Math.random() - 0.5),
    }));
  }, []);

  const handleDrop = (targetSlotId: number | null, droppedPieceId: number) => {
    setPuzzleState((currentState) => {
      const newBoard = currentState.board.map((slot) => ({
        ...slot,
        piece: slot.piece ? { ...slot.piece } : null,
      }));
      let newTray = [...currentState.tray];
      const sourceSlotIndex = newBoard.findIndex((s) => s.piece?.id === droppedPieceId);

      if (sourceSlotIndex > -1) {
        newBoard[sourceSlotIndex].piece = null;
      } else {
        newTray = newTray.filter((p) => p.id !== droppedPieceId);
      }

      if (targetSlotId !== null) {
        const targetIndex = targetSlotId - 1;
        const displacedPiece = newBoard[targetIndex].piece;

        if (displacedPiece) newTray.push(displacedPiece);

        newBoard[targetIndex].piece = { id: droppedPieceId };
      } else {
        newTray.push({ id: droppedPieceId });
      }

      return { board: newBoard, tray: newTray };
    });
  };

  useEffect(() => {
    const isWon = puzzleState.board.every((slot) => slot.piece && slot.piece.id === slot.id);
    if (isWon) {
      completePuzzle();
      setTimeout(() => setIsWinModalOpen(true), 500);
    }
  }, [puzzleState.board, completePuzzle]);

  const handleConfirmWin = () => {
    router.push('/surprise/games');
  };

  return (
    <DndProvider backend={Backend} options={backendOptions}>
      <div className="w-full p-4 sm:p-6 md:p-8 flex flex-col items-center">
        <h1 className="font-serif text-2xl sm:text-3xl font-bold text-pink-800 mb-2 text-center">
          Susun Foto Ini
        </h1>
        <p className="text-gray-600 mb-6 sm:mb-8 text-center">
          Seret potongan puzzle ke papan yang benar.
        </p>

        <div className="flex w-full max-w-5xl flex-col lg:flex-row gap-4 sm:gap-6 lg:gap-8 items-start">
          {/* BOARD WRAPPER: ukur lebar untuk hitung dimensi */}
          <div ref={wrapperRef} className="w-full lg:flex-1 flex justify-center">
            <PuzzleBoard
              board={puzzleState.board}
              onDrop={(slotId, pieceId) => handleDrop(slotId, pieceId)}
              pieceSize={pieceSize}
              imageSrc={IMAGE_SRC}
              boardDimension={boardDimension}
            />
          </div>

          {/* SIDE PANEL / TRAY */}
          <div className="w-full lg:max-w-sm space-y-4">
            <div className="bg-white p-3 sm:p-4 rounded-xl shadow-lg max-w-[300px] sm:max-w-none mx-auto">
              <h3 className="font-bold text-gray-700 mb-2 text-center text-sm sm:text-base">
                Gambar Asli
              </h3>
              <div className="relative w-full aspect-square rounded-md overflow-hidden">
                <Image
                  src={IMAGE_SRC}
                  alt="Reference"
                  fill
                  className="object-cover select-none"
                  draggable={false}
                  priority
                />
              </div>
            </div>

            <PieceTray pieces={puzzleState.tray} onDrop={(pieceId) => handleDrop(null, pieceId)}>
              <h3 className="font-bold text-gray-700 mb-3 text-center">Potongan Puzzle</h3>
              <div className="flex flex-wrap gap-2 justify-center sm:justify-center min-h-[50px] max-h-60 overflow-y-auto">
                {puzzleState.tray.map((piece) => (
                  <PuzzlePiece
                    key={piece.id}
                    id={piece.id}
                    src={IMAGE_SRC}
                    pieceSize={trayPieceSize}
                    boardDimension={trayBoardDimension}
                    position={{
                      x: ((piece.id - 1) % GRID_SIZE) * trayPieceSize,
                      y: Math.floor((piece.id - 1) / GRID_SIZE) * trayPieceSize,
                    }}
                  />
                ))}
              </div>
              {/* Tips kecil di mobile */}
              <p className="text-xs text-gray-400 mt-2 text-center">
                * Di HP: sentuh & tarik potongan untuk memindahkan.
              </p>
            </PieceTray>
          </div>
        </div>
      </div>

      <WinModal isOpen={isWinModalOpen} onConfirm={handleConfirmWin} />
    </DndProvider>
  );
}
