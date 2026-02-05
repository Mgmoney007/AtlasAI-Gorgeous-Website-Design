
import React from 'react';

interface LogoProps {
  className?: string;
  size?: number;
}

const Logo: React.FC<LogoProps> = ({ className = "", size = 32 }) => {
  return (
    <div className={`relative flex items-center justify-center ${className}`} style={{ width: size, height: size }}>
      <svg 
        width={size} 
        height={size} 
        viewBox="0 0 40 40" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
        className="drop-shadow-[0_0_8px_rgba(191,245,73,0.15)]"
      >
        {/* Main geometric 'A' structure */}
        <path 
          d="M20 4L34 32H28L20 16L12 32H6L20 4Z" 
          fill="white" 
          className="transition-colors duration-300"
        />
        {/* Precision AI Point */}
        <rect 
          x="18" 
          y="22" 
          width="4" 
          height="4" 
          rx="1" 
          fill="#BFF549" 
          className="animate-pulse"
        />
        {/* Secondary detail line */}
        <path 
          d="M16 28H24" 
          stroke="white" 
          strokeWidth="1.5" 
          strokeLinecap="round"
          opacity="0.3"
        />
      </svg>
    </div>
  );
};

export default Logo;
