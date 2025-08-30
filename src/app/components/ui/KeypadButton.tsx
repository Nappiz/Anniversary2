import React from 'react';

type KeypadButtonProps = {
  onClick: () => void;
  children: React.ReactNode;
  className?: string;
};

const KeypadButton: React.FC<KeypadButtonProps> = ({ onClick, children, className }) => {
  return (
    <button
      onClick={onClick}
      className={`
        bg-white/70 backdrop-blur-sm text-pink-500 font-bold text-2xl 
        rounded-full w-16 h-16 shadow-md
        flex items-center justify-center
        transform transition-all duration-150
        hover:bg-white hover:shadow-lg
        active:scale-90 active:bg-pink-100 cursor-pointer
        ${className}
      `}
    >
      {children}
    </button>
  );
};

export default KeypadButton;