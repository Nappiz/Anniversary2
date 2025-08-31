import React from 'react';

type ButtonProps = {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
};

const Button: React.FC<ButtonProps> = ({ children, onClick, className = '' }) => {
  return (
    <button
      onClick={onClick}
      className={[
        'relative inline-flex items-center justify-center cursor-pointer',
        'rounded-2xl px-6 py-3 font-semibold text-white',
        'bg-gradient-to-tr from-pink-600 to-rose-500',
        'shadow-[0_10px_30px_rgba(236,72,153,0.35)]',
        'transition-all active:translate-y-px hover:brightness-105',
        'focus:outline-none focus-visible:ring-2 focus-visible:ring-pink-300',
        'before:absolute before:-inset-0.5 before:rounded-3xl before:bg-gradient-to-r before:from-pink-400/40 before:to-rose-400/40 before:blur before:opacity-60 before:-z-10',
        className,
      ].join(' ')}
    >
      {children}
    </button>
  );
};

export default Button;
