import React from 'react';

export function SimpleScrollArea({ children, className = '' }) {
  return <div className={`overflow-auto ${className}`}>{children}</div>;
}
