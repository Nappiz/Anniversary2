import React from 'react';

type KeypadButtonProps = {
  onClick: () => void;
  children: React.ReactNode;
  className?: string;
  ariaLabel?: string;
};

const KeypadButton: React.FC<KeypadButtonProps> = ({ onClick, children, className = '', ariaLabel }) => {
  return (
    <button
      onClick={onClick}
      aria-label={ariaLabel}
      className={[
        'relative rounded-2xl w-16 h-16 sm:w-18 sm:h-18 cursor-pointer',
        'bg-white/70 backdrop-blur-md',
        'text-pink-600 font-bold text-2xl',
        'shadow-[0_8px_24px_rgba(0,0,0,0.06)] ring-1 ring-white/60',
        'flex items-center justify-center',
        'transition-all duration-150 hover:bg-white active:scale-95 active:shadow-md',
        'focus:outline-none focus-visible:ring-2 focus-visible:ring-pink-300',
        'after:absolute after:inset-0 after:rounded-2xl after:pointer-events-none after:shadow-[inset_0_1px_0_rgba(255,255,255,0.6)]',
        className,
      ].join(' ')}
    >
      {children}
    </button>
  );
};

export default KeypadButton;
