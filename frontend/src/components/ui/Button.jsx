import React from "react";

function Button({
  children,
  variant = "primary",
  size = "default",
  className = "",
  disabled = false,
  ...props
}) {
  const baseClasses =
    "inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50";

  const variantClasses = {
    primary:
      "bg-indigo-600 text-white hover:bg-indigo-700 focus-visible:ring-indigo-500",
    destructive:
      "bg-red-600 text-white hover:bg-red-700 focus-visible:ring-red-500",
    outline:
      "border border-gray-300 bg-transparent hover:bg-gray-100 focus-visible:ring-gray-500",
    ghost: "bg-transparent hover:bg-gray-100 focus-visible:ring-gray-500",
    link: "bg-transparent text-indigo-600 underline-offset-4 hover:underline focus-visible:ring-indigo-500",
  };

  const sizeClasses = {
    default: "h-10 px-4 py-2",
    sm: "h-8 px-3 text-sm",
    lg: "h-12 px-6",
    icon: "h-10 w-10 p-2",
  };

  const classes = `
    ${baseClasses} 
    ${variantClasses[variant] || ""} 
    ${sizeClasses[size] || ""} 
    ${disabled ? "opacity-50 cursor-not-allowed" : ""}
    ${className}
  `;

  return (
    <button className={classes} disabled={disabled} {...props}>
      {children}
    </button>
  );
}

export default Button;
