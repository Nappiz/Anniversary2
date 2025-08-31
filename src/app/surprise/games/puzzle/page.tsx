'use client';

import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import Image from 'next/image';
import clsx from 'clsx';
import { useRouter } from 'next/navigation';
import { useGameProgress } from '../../../context/GameProgressContext';
import PuzzleBoard from '../../../components/games/PuzzleBoard';
import TrayPiece from '../../../components/games/PuzzlePiece'; // NEW: kini jadi komponen potongan di tray
import WinModal from '../../../components/games/WinModal';

const IMAGE_SRC = '/images/puzzle.jpg';
const GRID_SIZE = 3;

// --- Hook kecil untuk menghitung dimensi papan secara responsif
function useResponsiveBoardDim(max = 480, min = 220) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [dim, setDim] = useState<number>(max);

  useLayoutEffect(() => {
    const calc = () => {
      const w = wrapperRef.current?.clientWidth ?? window.innerWidth;
      // kurangi margin/padding kira-kira 32px
      const target = Math.min(max, Math.max(min, Math.floor(w - 32)));
      setDim(target);
    };
    calc();
    window.addEventListener('resize', calc);
    return () => window.removeEventListener('resize', calc);
  }, [max, min]);

  return { wrapperRef, dim };
}

type Piece = { id: number };
type Slot = { id: number; piece: Piece | null };

export default function PuzzlePage() {
  const router = useRouter();
  const { completePuzzle } = useGameProgress();

  // --- Responsive sizing
  const { wrapperRef, dim: boardDimension } = useResponsiveBoardDim(480, 220);
  const pieceSize = useMemo(() => boardDimension / GRID_SIZE, [boardDimension]);
  const trayScale = boardDimension < 340 ? 0.42 : 0.5;
  const trayPieceSize = useMemo(() => pieceSize * trayScale, [pieceSize, trayScale]);
  const trayBoardDimension = useMemo(
    () => boardDimension * trayScale,
    [boardDimension, trayScale]
  );

  // --- Inisialisasi state
  const initialPieces = useMemo(
    () => Array.from({ length: GRID_SIZE * GRID_SIZE }, (_, i) => ({ id: i + 1 })),
    []
  );

  const [puzzleState, setPuzzleState] = useState<{
    board: Slot[];
    tray: Piece[];
  }>(() => ({
    board: Array.from({ length: GRID_SIZE * GRID_SIZE }, (_, i) => ({
      id: i + 1,
      piece: null,
    })),
    tray: initialPieces,
  }));

  // pilihan saat ini (tap untuk pick up dari tray/board, tap lagi ke target)
  const [selection, setSelection] = useState<
    | { source: 'tray'; pieceId: number }
    | { source: 'board'; pieceId: number; originSlotId: number }
    | null
  >(null);

  const [hoveredSlotId, setHoveredSlotId] = useState<number | null>(null);
  const [isWinModalOpen, setIsWinModalOpen] = useState(false);
  const [showReference, setShowReference] = useState(true);

  // acak tray di awal
  useEffect(() => {
    setPuzzleState((s) => ({ ...s, tray: [...s.tray].sort(() => Math.random() - 0.5) }));
  }, []);

  // cek menang
  useEffect(() => {
    const isWon = puzzleState.board.every((slot) => slot.piece && slot.piece.id === slot.id);
    if (isWon) {
      completePuzzle();
      setTimeout(() => setIsWinModalOpen(true), 400);
    }
  }, [puzzleState.board, completePuzzle]);

  // helper
  const findSlot = (slotId: number) => puzzleState.board.find((s) => s.id === slotId)!;

  // --- Interaksi tray
  const handleTrayPieceClick = (pieceId: number) => {
    if (selection?.source === 'tray' && selection.pieceId === pieceId) {
      setSelection(null); // tap lagi untuk batal
    } else {
      setSelection({ source: 'tray', pieceId });
    }
  };

  // --- Interaksi board (tap pada cell)
  const handleBoardCellClick = (targetSlotId: number) => {
    const targetSlot = findSlot(targetSlotId);

    // 1) Jika belum memilih apa-apa dan target ada piece => pick up dari board
    if (!selection) {
      if (targetSlot.piece) {
        setSelection({ source: 'board', pieceId: targetSlot.piece.id, originSlotId: targetSlotId });
      }
      return;
    }

    // 2) Memindahkan dari TRAY ke BOARD
    if (selection.source === 'tray') {
      const movingPieceId = selection.pieceId;
      setPuzzleState((state) => {
        const board = state.board.map((slot) => ({ ...slot }));
        const tray = state.tray.filter((p) => p.id !== movingPieceId);

        const targetIdx = board.findIndex((s) => s.id === targetSlotId);
        const displaced = board[targetIdx].piece;
        if (displaced) tray.push(displaced);
        board[targetIdx].piece = { id: movingPieceId };

        return { board, tray };
      });
      setSelection(null);
      return;
    }

    // 3) Memindahkan dari BOARD (swap / pindah)
    if (selection.source === 'board') {
      const originId = selection.originSlotId;
      const movingPieceId = selection.pieceId;
      if (originId === targetSlotId) {
        setSelection(null); // tap di slot yang sama => batal
        return;
      }
      setPuzzleState((state) => {
        const board = state.board.map((slot) => ({ ...slot }));
        const aIdx = board.findIndex((s) => s.id === originId);
        const bIdx = board.findIndex((s) => s.id === targetSlotId);

        const tmp = board[bIdx].piece;
        board[bIdx].piece = board[aIdx].piece; // pindahkan
        board[aIdx].piece = tmp;               // swap

        return { board, tray: state.tray };
      });
      setSelection(null);
    }
  };

  const handleClearBoard = () => {
    // Kembalikan semua piece di board ke tray, lalu acak
    setPuzzleState((state) => {
      const backToTray: Piece[] = [
        ...state.tray,
        ...state.board.flatMap((slot) => (slot.piece ? [slot.piece] : [])),
      ];
      return {
        board: state.board.map((s) => ({ ...s, piece: null })),
        tray: backToTray.sort(() => Math.random() - 0.5),
      };
    });
    setSelection(null);
  };

  const handleConfirmWin = () => {
    router.push('/surprise/games');
  };

  const placedCount = puzzleState.board.filter((s) => s.piece).length;

  return (
    <div className="min-h-[100dvh] w-full bg-gradient-to-b from-rose-50 via-white to-pink-50">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 py-6 sm:py-10">
        {/* Header */}
        <div className="text-center mb-6 sm:mb-8">
          <h1 className="font-serif text-2xl sm:text-3xl md:text-4xl font-bold text-pink-800">
            Susun Foto Ini
          </h1>
          <p className="text-gray-600 mt-2">
            Tap potongan lalu tap kotak papan untuk menaruhnya. Tap potongan di papan
            untuk memindahkannya ke kotak lain (swap).
          </p>
        </div>

        <div className="flex w-full flex-col lg:flex-row gap-5 sm:gap-8 items-start">
          {/* BOARD WRAPPER */}
          <div className="lg:flex-1 w-full">
            <div
              ref={wrapperRef}
              className={clsx(
                'w-full flex justify-center',
                'rounded-2xl p-3 sm:p-4',
                'bg-white/60 backdrop-blur shadow-[0_10px_30px_rgba(0,0,0,0.06)]'
              )}
            >
              <PuzzleBoard
                board={puzzleState.board}
                onCellClick={handleBoardCellClick}
                pieceSize={pieceSize}
                imageSrc={IMAGE_SRC}
                boardDimension={boardDimension}
                selectedPieceId={selection?.pieceId ?? null}
                selectedFrom={selection?.source ?? null}
                selectedOriginSlotId={selection && selection.source === 'board' ? selection.originSlotId : null}
                hoveredSlotId={hoveredSlotId}
                setHoveredSlotId={setHoveredSlotId}
                gridSize={GRID_SIZE}
              />
            </div>

            {/* Progress + Actions */}
            <div className="mt-4 flex flex-wrap items-center gap-3 justify-center">
              <span className="text-sm sm:text-base text-gray-600">
                Tertaruh: <span className="font-semibold text-pink-700">{placedCount}</span> / {GRID_SIZE * GRID_SIZE}
              </span>
              <button
                onClick={handleClearBoard}
                className="px-3 py-2 rounded-xl text-sm font-medium bg-rose-600 text-white hover:bg-rose-700 active:scale-[0.99] transition"
              >
                Acak Ulang
              </button>
              <button
                onClick={() => setShowReference((v) => !v)}
                className="px-3 py-2 rounded-xl text-sm font-medium bg-gray-800 text-white hover:bg-black active:scale-[0.99] transition"
              >
                {showReference ? 'Sembunyikan Referensi' : 'Tampilkan Referensi'}
              </button>
            </div>
          </div>

          {/* SIDE PANEL / TRAY */}
          <div className="w-full lg:max-w-sm space-y-4">
            {/* Gambar Asli (diperkecil di mobile) */}
            {showReference && (
              <div className="bg-white/70 backdrop-blur rounded-2xl shadow-[0_10px_30px_rgba(0,0,0,0.06)] p-3 sm:p-4 max-w-[220px] sm:max-w-none mx-auto">
                <h3 className="font-semibold text-gray-700 mb-2 text-center text-sm">
                  Gambar Asli
                </h3>
                <div className="relative w-full aspect-square rounded-xl overflow-hidden ring-1 ring-gray-200">
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
            )}

            {/* Tray */}
            <div className="bg-white/70 backdrop-blur rounded-2xl shadow-[0_10px_30px_rgba(0,0,0,0.06)] p-3 sm:p-4">
              <h3 className="font-semibold text-gray-700 mb-3 text-center">
                Potongan Puzzle
              </h3>
              <div className="flex flex-wrap gap-2 justify-center max-h-64 overflow-y-auto">
                {puzzleState.tray.map((piece) => (
                  <button
                    key={piece.id}
                    onClick={() => handleTrayPieceClick(piece.id)}
                    className={clsx(
                      'rounded-lg ring-1 ring-gray-200 hover:ring-pink-300 focus:outline-none focus:ring-2 focus:ring-pink-500 transition',
                      selection?.source === 'tray' && selection.pieceId === piece.id
                        ? 'ring-2 ring-pink-500'
                        : ''
                    )}
                    aria-label={`Pilih potongan ${piece.id}`}
                  >
                    <TrayPiece
                      id={piece.id}
                      size={trayPieceSize}
                      imageSrc={IMAGE_SRC}
                      gridSize={GRID_SIZE}
                      boardDimension={trayBoardDimension}
                      isSelected={selection?.source === 'tray' && selection.pieceId === piece.id}
                    />
                  </button>
                ))}
              </div>
              <p className="text-xs text-gray-400 mt-2 text-center">
                * Di HP: tap potongan lalu tap kotak papan.
              </p>
            </div>
          </div>
        </div>
      </div>

      <WinModal isOpen={isWinModalOpen} onConfirm={handleConfirmWin} />
    </div>
  );
}
