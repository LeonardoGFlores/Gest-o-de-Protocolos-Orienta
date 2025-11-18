
import React from 'react';

interface ToastProps {
  message: string;
}

export const Toast: React.FC<ToastProps> = ({ message }) => {
  return (
    <div 
      className="fixed bottom-8 right-8 z-50 bg-brand-green text-white rounded-lg shadow-2xl p-4 flex items-center space-x-3 animate-fade-in-up"
      role="alert"
      aria-live="assertive"
    >
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-brand-gold flex-shrink-0">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
      </svg>
      <span className="text-base font-medium">{message}</span>
    </div>
  );
};
