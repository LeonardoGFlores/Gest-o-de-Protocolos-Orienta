import React from 'react';

export const Logo: React.FC<{ className?: string }> = ({ className }) => (
  <img
    src="/logo orienta.jpg"
    alt="Orienta Logo"
    className={className}
  />
);
