import React from 'react';

function Alert({ children, variant = 'default', className = '', ...props }) {
  const variantClasses = {
    default: 'bg-blue-50 text-blue-800 border-blue-200',
    destructive: 'bg-red-50 text-red-800 border-red-200',
    success: 'bg-green-50 text-green-800 border-green-200',
  };
  
  return (
    <div 
      className={`p-4 border rounded-md ${variantClasses[variant]} ${className}`} 
      role="alert" 
      {...props}
    >
      {children}
    </div>
  );
}

function AlertTitle({ children, className = '', ...props }) {
  return (
    <h5 className={`font-medium mb-1 ${className}`} {...props}>
      {children}
    </h5>
  );
}

function AlertDescription({ children, className = '', ...props }) {
  return (
    <div className={`text-sm ${className}`} {...props}>
      {children}
    </div>
  );
}

export { Alert, AlertTitle, AlertDescription };