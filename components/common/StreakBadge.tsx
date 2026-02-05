import React from 'react';

interface StreakBadgeProps {
  streak: number;
  className?: string;
  onClick?: () => void;
}

const StreakBadge: React.FC<StreakBadgeProps> = ({ streak, className, onClick }) => {
  const Component = onClick ? 'button' : 'div';
  
  return (
    <Component 
      onClick={onClick}
      className={`flex items-center gap-1.5 px-3 py-1.5 bg-orange-500/20 border border-orange-500/30 rounded-full backdrop-blur-md shadow-lg shadow-orange-500/10 transition-transform active:scale-95 ${className} ${onClick ? 'cursor-pointer hover:bg-orange-500/30' : ''}`}
    >
      <span className="text-lg animate-pulse">🔥</span>
      <span className="text-xs font-bold text-orange-400 font-display">{streak} Day Streak</span>
    </Component>
  );
};

export default StreakBadge;