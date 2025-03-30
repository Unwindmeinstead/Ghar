import React, { memo } from 'react';
import { motion } from 'framer-motion';

interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'premium' | 'success';
  className?: string;
  type?: 'button' | 'submit' | 'reset';
  disabled?: boolean;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  delay?: number;
}

// Fast transition for better performance
const fastTransition = {
  type: "tween",
  duration: 0.15,
  ease: "easeOut"
};

const Button: React.FC<ButtonProps> = memo(({
  children,
  onClick,
  variant = 'primary',
  className = '',
  type = 'button',
  disabled = false,
  icon,
  iconPosition = 'left',
  size = 'md',
  fullWidth = false,
  delay = 0
}) => {
  const baseVariants = {
    primary: 'bg-primary hover:bg-primary-dark text-white',
    secondary: 'bg-secondary hover:bg-secondary-dark text-white',
    outline: 'border border-primary text-primary hover:bg-primary hover:text-white',
    ghost: 'text-primary hover:bg-gray-100',
    danger: 'bg-red-500 hover:bg-red-600 text-white',
    success: 'bg-green-500 hover:bg-green-600 text-white',
    premium: 'bg-gradient-to-r from-primary to-secondary text-white',
  };

  const sizeClasses = {
    sm: 'text-xs px-3 py-1.5',
    md: 'text-sm px-4 py-2',
    lg: 'text-base px-5 py-2.5',
  };

  const getShadow = () => {
    if (disabled) return '';
    
    switch (variant) {
      case 'primary':
        return 'shadow-sm hover:shadow-md';
      case 'secondary':
        return 'shadow-sm hover:shadow-md';
      case 'premium':
        return 'shadow-md hover:shadow-lg';
      case 'danger':
        return 'shadow-sm hover:shadow-md';
      case 'success':
        return 'shadow-sm hover:shadow-md';
      default:
        return '';
    }
  };

  return (
    <motion.button
      initial={{ opacity: 0.9 }}
      animate={{ opacity: 1 }}
      transition={{ 
        ...fastTransition,
        delay: delay * 0.1
      }}
      whileHover={{ 
        scale: disabled ? 1 : 1.02,
        y: disabled ? 0 : -1,
      }}
      whileTap={{ scale: disabled ? 1 : 0.98 }}
      onClick={onClick}
      className={`
        ${baseVariants[variant]} 
        ${sizeClasses[size]} 
        ${getShadow()}
        font-medium rounded-full 
        transition-colors duration-150
        flex items-center justify-center
        ${fullWidth ? 'w-full' : ''}
        ${disabled ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer'}
        ${className}
      `}
      type={type}
      disabled={disabled}
      style={{ 
        willChange: 'transform',
        ...(variant === 'premium' && !disabled ? {
          backgroundSize: '200% auto',
          backgroundPosition: '0% 50%',
          transition: 'background-position 0.3s ease',
          backgroundImage: 'linear-gradient(45deg, #6366f1, #10b981, #6366f1)'
        } : {})
      }}
      onMouseEnter={variant === 'premium' && !disabled ? 
        (e) => {
          e.currentTarget.style.backgroundPosition = '100% 50%';
        } : undefined
      }
      onMouseLeave={variant === 'premium' && !disabled ? 
        (e) => {
          e.currentTarget.style.backgroundPosition = '0% 50%';
        } : undefined
      }
    >
      {icon && iconPosition === 'left' && (
        <span className="mr-2">{icon}</span>
      )}
      <span>{children}</span>
      {icon && iconPosition === 'right' && (
        <span className="ml-2">{icon}</span>
      )}
    </motion.button>
  );
});

Button.displayName = 'Button';

export default Button; 