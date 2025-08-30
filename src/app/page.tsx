'use client';

import { useState } from 'react';
import Button from './components/ui/Button';
import KeypadModal from './components/KeypadModal';
import { useRouter } from 'next/navigation';

export default function HomePage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const correctPassword = "010923";
  const router = useRouter(); 

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleSuccess = () => {
    setIsModalOpen(false); 
    router.push('/surprise');
  };

  return (
    <>
      <main className="flex flex-col items-center justify-center min-h-screen bg-pink-100">
        <h1 className="text-4xl font-bold text-pink-700 mb-8">
          Happy 2nd Anniversary sayang !!
        </h1>
        
        <Button onClick={handleOpenModal}>
          Klik Aku 💌
        </Button>
      </main>

      <KeypadModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        correctCode={correctPassword}
        onSuccess={handleSuccess}
      />
    </>
  );
}