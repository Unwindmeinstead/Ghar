import React, { memo } from 'react';
import { motion } from 'framer-motion';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  noPadding?: boolean;
  hoverEffect?: 'lift' | 'glow' | 'subtle' | 'none';
  delay?: number;
}

// Simpler, faster transition
const fastTransition = {
  type: "tween",
  duration: 0.15,
  ease: "easeOut"
};

const Card: React.FC<CardProps> = memo(({ 
  children, 
  className = '', 
  noPadding = false, 
  hoverEffect = 'lift',
  delay = 0
}) => {
  const getHoverAnimation = () => {
    if (hoverEffect === 'none') return {};
    
    // Simplified hover animations with fewer properties
    switch (hoverEffect) {
      case 'lift':
        return { y: -5 };
      case 'glow':
        return { boxShadow: "0 0 15px rgba(99, 102, 241, 0.15)" };
      case 'subtle':
        return { y: -2 };
      default:
        return { y: -3 };
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0.8, y: 5 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ 
        ...fastTransition,
        delay: delay * 0.1, // Shorter delay multiplier
      }}
      whileHover={getHoverAnimation()}
      className={`
        bg-white rounded-xl shadow-card 
        transition-all duration-200
        border border-gray-50
        ${noPadding ? '' : 'p-5'} 
        ${className}
      `}
      style={{ willChange: 'transform, opacity' }}
    >
      {children}
    </motion.div>
  );
});

Card.displayName = 'Card';

export default Card; 