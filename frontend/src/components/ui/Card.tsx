import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  onClick?: () => void;
}

export const Card: React.FC<CardProps> = ({
  children,
  className = '',
  hover = false,
  onClick,
}) => {
  return (
    <div
      className={`bg-white rounded-2xl shadow-sm border border-gray-100 ${
        hover ? 'hover:shadow-lg hover:border-gray-200 transition-all duration-300 cursor-pointer transform hover:-translate-y-1' : ''
      } ${className}`}
      onClick={onClick}
    >
      {children}
    </div>
  );
};