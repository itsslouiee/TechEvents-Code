import React from 'react';

function Avatar({ children, className = '', ...props }) {
  return (
    <div 
      className={`inline-flex items-center justify-center h-10 w-10 rounded-full bg-gray-200 text-gray-600 ${className}`} 
      {...props}
    >
      {children}
    </div>
  );
}

export default Avatar;