
import React, { SelectHTMLAttributes } from 'react';

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  children: React.ReactNode;
}

export const Select: React.FC<SelectProps> = ({ label, id, children, ...props }) => {
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-brand-gray mb-1">
        {label}
      </label>
      <select
        id={id}
        {...props}
        className="w-full px-3 py-2 border border-brand-light-gray rounded-md shadow-sm focus:ring-brand-gold focus:border-brand-gold sm:text-sm text-brand-green bg-white"
      >
        {children}
      </select>
    </div>
  );
};
