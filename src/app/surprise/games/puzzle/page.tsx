// app/surprise/games/puzzle/page.tsx
'use client';

import { useEffect, useState, useRef } from 'react';
import { DndProvider, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { useRouter } from 'next/navigation';
import { useGameProgress } from '../../../context/GameProgressContext';
import PuzzleBoard from '../../../components/games/PuzzleBoard';
import PuzzlePiece from '../../../components/games/PuzzlePiece';
import WinModal from '../../../components/games/WinModal';
import Image from 'next/image';
import clsx from 'clsx';

const IMAGE_SRC = '/images/puzzle.jpg';
const GRID_SIZE = 3;
const BOARD_DIMENSION = 450;
const PIECE_SIZE = BOARD_DIMENSION / GRID_SIZE;

const TRAY_SCALE_FACTOR = 0.5; 
const TRAY_PIECE_SIZE = PIECE_SIZE * TRAY_SCALE_FACTOR;
const TRAY_BOARD_DIMENSION = BOARD_DIMENSION * TRAY_SCALE_FACTOR;

const initialPieces = Array.from({ length: GRID_SIZE * GRID_SIZE }, (_, i) => ({ id: i + 1 }));

function PieceTray({ pieces, onDrop, children }: { pieces: {id: number}[], onDrop: (pieceId: number) => void, children: React.ReactNode }) {
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
    <div ref={ref} className={clsx("bg-white p-4 rounded-xl shadow-lg transition-colors", { 'bg-pink-100': isOver })}>
      {children}
    </div>
  )
}

export default function PuzzlePage() {
  const router = useRouter();
  const { completePuzzle } = useGameProgress();
  
  const [puzzleState, setPuzzleState] = useState({
    board: Array.from({ length: GRID_SIZE * GRID_SIZE }, (_, i) => ({ id: i + 1, piece: null as { id: number } | null })),
    tray: initialPieces,
  });

  const [isWinModalOpen, setIsWinModalOpen] = useState(false);

  useEffect(() => {
    setPuzzleState(currentState => ({
      ...currentState,
      tray: [...currentState.tray].sort(() => Math.random() - 0.5),
    }));
  }, []);

  const handleDrop = (targetSlotId: number | null, droppedPieceId: number) => {
    setPuzzleState(currentState => {
      const newBoard = currentState.board.map(slot => ({ ...slot, piece: slot.piece ? { ...slot.piece } : null }));
      let newTray = [...currentState.tray];
      const sourceSlotIndex = newBoard.findIndex(s => s.piece?.id === droppedPieceId);

      if (sourceSlotIndex > -1) {
        newBoard[sourceSlotIndex].piece = null;
      } else {
        newTray = newTray.filter(p => p.id !== droppedPieceId);
      }

      if (targetSlotId !== null) {
        const targetIndex = targetSlotId - 1;
        const displacedPiece = newBoard[targetIndex].piece;
        
        if (displacedPiece) {
          newTray.push(displacedPiece);
        }
        newBoard[targetIndex].piece = { id: droppedPieceId };
      } else {
        newTray.push({ id: droppedPieceId });
      }

      return { board: newBoard, tray: newTray };
    });
  };
  
  useEffect(() => {
    const isWon = puzzleState.board.every(slot => slot.piece && slot.piece.id === slot.id);
    if (isWon) {
      completePuzzle();
      setTimeout(() => setIsWinModalOpen(true), 500);
    }
  }, [puzzleState.board, completePuzzle]);

  const handleConfirmWin = () => {
    router.push('/surprise/games');
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="w-full p-4 sm:p-8 flex flex-col items-center">
        <h1 className="font-serif text-3xl font-bold text-pink-800 mb-2">Susun Foto Ini</h1>
        <p className="text-gray-600 mb-8">Seret potongan puzzle ke papan yang benar.</p>
        
        <div className="flex flex-col lg:flex-row gap-8 items-start">
          <PuzzleBoard board={puzzleState.board} onDrop={(slotId, pieceId) => handleDrop(slotId, pieceId)} pieceSize={PIECE_SIZE} imageSrc={IMAGE_SRC} boardDimension={BOARD_DIMENSION}/>
          
          <div className="w-full lg:w-[300px] space-y-4">
            <div className="bg-white p-4 rounded-xl shadow-lg">
              <h3 className="font-bold text-gray-700 mb-2 text-center">Gambar Asli</h3>
              <div className="relative w-full aspect-square rounded-md overflow-hidden">
                <Image src={IMAGE_SRC} alt="Reference" fill className="object-cover" />
              </div>
            </div>

            <PieceTray pieces={puzzleState.tray} onDrop={(pieceId) => handleDrop(null, pieceId)}>
              <h3 className="font-bold text-gray-700 mb-4 text-center">Potongan Puzzle</h3>
              <div className="flex flex-wrap gap-2 justify-center min-h-[50px]">
                {puzzleState.tray.map((piece) => (
                  <PuzzlePiece
                    key={piece.id}
                    id={piece.id}
                    src={IMAGE_SRC}
                    pieceSize={TRAY_PIECE_SIZE}
                    boardDimension={TRAY_BOARD_DIMENSION}
                    position={{
                      x: ((piece.id - 1) % GRID_SIZE) * TRAY_PIECE_SIZE,
                      y: Math.floor((piece.id - 1) / GRID_SIZE) * TRAY_PIECE_SIZE,
                    }}
                  />
                ))}
              </div>
            </PieceTray>
          </div>
        </div>
      </div>
      <WinModal isOpen={isWinModalOpen} onConfirm={handleConfirmWin} />
    </DndProvider>
  );
}