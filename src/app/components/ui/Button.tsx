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
      className={`
        transform active:scale-95 transition-transform
        font-bold text-white text-lg 
        py-3 px-6 rounded-xl shadow-lg
        bg-pink-500 hover:bg-pink-600
        focus:outline-none focus:ring-2 focus:ring-pink-400 focus:ring-opacity-75 cursor-pointer
        ${className} 
      `}
    >
      {children}
    </button>
  );
};

export default Button;