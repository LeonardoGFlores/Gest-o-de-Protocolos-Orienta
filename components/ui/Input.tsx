
import React, { InputHTMLAttributes } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
}

export const Input: React.FC<InputProps> = ({ label, id, ...props }) => {
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-brand-gray mb-1">
        {label}
      </label>
      <input
        id={id}
        {...props}
        className="w-full px-3 py-2 border border-brand-light-gray rounded-md shadow-sm focus:ring-brand-gold focus:border-brand-gold sm:text-sm text-brand-green bg-white"
      />
    </div>
  );
};
