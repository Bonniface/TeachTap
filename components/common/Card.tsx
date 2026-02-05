import React from 'react';
import { cn } from '../../utils/classNames';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  hoverable?: boolean;
  padding?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
}

const Card: React.FC<CardProps> = ({
  children,
  className,
  hoverable = false,
  padding = 'md',
  ...props
}) => {
  const paddings = {
    none: 'p-0',
    sm: 'p-3',
    md: 'p-4',
    lg: 'p-6',
    xl: 'p-8',
  };
  
  return (
    <div
      className={cn(
        'bg-[#1e1828]/90 backdrop-blur-xl rounded-2xl border border-white/10 shadow-xl overflow-hidden',
        hoverable && 'transition-all duration-200 hover:shadow-2xl hover:-translate-y-0.5 hover:border-white/20',
        paddings[padding],
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};

export default Card;