import React from 'react';

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const Logo: React.FC<LogoProps> = ({ className = '', size = 'md' }) => {
  const sizeClasses = {
    sm: 'h-8 w-8',
    md: 'h-11 w-11',
    lg: 'h-20 w-20'
  };

  return (
    <div className={`relative flex items-center justify-center ${sizeClasses[size]} ${className}`}>
      <svg 
        xmlns="http://www.w3.org/2000/svg" 
        viewBox="0 0 100 100" 
        className="w-full h-full filter drop-shadow-[0_0_8px_rgba(56,189,248,0.3)]"
      >
        <defs>
          <linearGradient id="logoGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#1E293B" />
            <stop offset="100%" stopColor="#0F172A" />
          </linearGradient>
          <linearGradient id="glowBorder" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#38BDF8" />
            <stop offset="50%" stopColor="#06B6D4" />
            <stop offset="100%" stopColor="#F97316" />
          </linearGradient>
        </defs>

        {/* Outer Ring */}
        <rect 
          x="4" 
          y="4" 
          width="92" 
          height="92" 
          rx="22" 
          fill="url(#logoGrad)" 
          stroke="url(#glowBorder)" 
          strokeWidth="3.5" 
        />

        {/* Circuit Track Lines */}
        <path 
          d="M 22,22 L 52,22 L 52,52 L 78,52" 
          fill="none" 
          stroke="#F97316" 
          strokeWidth="4" 
          strokeLinecap="round" 
          opacity="0.85"
        />
        <path 
          d="M 22,78 L 52,78 L 52,52" 
          fill="none" 
          stroke="#06B6D4" 
          strokeWidth="4" 
          strokeLinecap="round" 
          opacity="0.85"
        />

        {/* Glowing Circuit Nodes */}
        <circle cx="22" cy="22" r="5.5" fill="#F97316" />
        <circle cx="22" cy="78" r="5.5" fill="#06B6D4" />
        <circle cx="78" cy="52" r="7" fill="#38BDF8">
          <animate 
            attributeName="opacity" 
            values="0.4;1;0.4" 
            dur="2s" 
            repeatCount="indefinite" 
          />
        </circle>

        {/* Stylized Text 'JR' inside logo */}
        <text 
          x="50%" 
          y="63%" 
          fill="#FFFFFF" 
          fontSize="28" 
          fontWeight="900" 
          fontFamily="'Poppins', 'Inter', sans-serif" 
          textAnchor="middle"
          style={{ letterSpacing: '0px' }}
        >
          JR
        </text>
      </svg>
    </div>
  );
};

export default Logo;
