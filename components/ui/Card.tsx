
import React, { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  className?: string;
}

// FIX: Wrapped component in React.forwardRef to allow the `ref` prop to be passed to the underlying div. This is required by FarmManagement.tsx to scroll to the form card.
export const Card = React.forwardRef<HTMLDivElement, CardProps>(({ children, className = '' }, ref) => {
  return (
    <div ref={ref} className={`bg-white rounded-lg shadow-sm p-6 ${className}`}>
      {children}
    </div>
  );
});
Card.displayName = 'Card';
