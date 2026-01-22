import React from 'react';
import { NavLink } from 'react-router-dom';

const Button = ({ to, onClick, children, variant = 'primary', type = 'button', className = '' }) => {
  const baseClasses = "flex items-center justify-center px-6 py-2 rounded-md text-sm font-medium transition-colors hover:cursor-pointer";

  const variants = {
    primary: "bg-blue-600 text-white hover:bg-blue-700 focus:outline-none active:bg-blue-800 focus-visible:bg-blue-700",
    secondary: "border border-gray-300 text-gray-700 hover:bg-gray-100 focus:outline-none active:bg-gray-200 focus-visible:bg-gray-700",
    ghost: "bg-gray-200 text-gray-700 hover:bg-gray-300 focus:outline-none active:bg-gray-400 focus-visible:bg-gray-700",
    danger: "bg-red-600 text-white hover:bg-red-700 focus:outline-none active:bg-red-800 focus-visible:bg-red-700",
    outline: "border-2 border-blue-600 text-blue-600 hover:bg-blue-100 focus:outline-none active:bg-blue-200 focus-visible:bg-blue-700",
  };

  const combinedClasses = `${baseClasses} ${variants[variant] || variants.primary} ${className}`;

  if (to) {
    return (
      <NavLink to={to} className={combinedClasses}>
        {children}
      </NavLink>
    );
  }

  return (
    <button type={type} onClick={onClick} className={combinedClasses}>
      {children}
    </button>
  );
};

export default Button;
