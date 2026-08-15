import React from 'react';

interface FritzingCircuitProps {
  expNum: number;
  title: string;
}

export default function FritzingCircuit({ expNum, title }: FritzingCircuitProps) {
  const wireColors = ['#dc2626', '#2563eb', '#16a34a', '#d97706', '#9333ea'];
  const wireColor = wireColors[(expNum - 1) % wireColors.length];
  const ledColors = ['#22c55e', '#ef4444', '#eab308', '#38bdf8'];
  const ledColor = ledColors[(expNum - 1) % ledColors.length];

  return (
    <div className="w-full bg-[#0b132b] rounded-xl p-3 border border-slate-700 shadow-inner flex flex-col items-center">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 950 420"
        className="w-full h-auto max-h-72 object-contain"
        style={{ fontFamily: "'Consolas', 'Segoe UI', monospace" }}
      >
        <defs>
          <linearGradient id="unoGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#0081a7" />
            <stop offset="100%" stopColor="#005f73" />
          </linearGradient>
          <linearGradient id="bbGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#f8fafc" />
            <stop offset="100%" stopColor="#e2e8f0" />
          </linearGradient>
          <filter id="glow shadow">
            <feDropShadow dx="1" dy="3" stdDeviation="2" floodOpacity="0.3" />
          </filter>
        </defs>

        {/* Outer Frame */}
        <rect width="950" height="420" fill="#070c18" rx="14" stroke="#1e293b" strokeWidth="2" />
        
        {/* Header Banner */}
        <rect x="20" y="15" width="910" height="36" rx="8" fill="#0f172a" stroke="#2563eb" strokeWidth="1.5" />
        <text x="35" y="38" fill="#38bdf8" fontSize="13" fontWeight="bold">
          FRITZING WIRING SCHEMATIC — EXP #{expNum}: {title.toUpperCase()}
        </text>
        <text x="910" y="38" fill="#94a3b8" fontSize="11" textAnchor="end">ElectronLearners STEM Platform</text>

        {/* ARDUINO UNO BOARD GRAPHIC */}
        <g transform="translate(30, 65)">
          <path d="M 0,15 Q 0,0 15,0 L 250,0 Q 265,0 265,15 L 265,290 Q 265,305 250,305 L 15,305 Q 0,305 0,290 Z" fill="url(#unoGrad)" stroke="#00bfff" strokeWidth="2" />
          <rect x="-25" y="25" width="40" height="45" fill="#94a3b8" stroke="#64748b" strokeWidth="2" rx="3" />
          <rect x="-15" y="215" width="50" height="50" fill="#1e293b" rx="4" />
          <circle cx="5" cy="240" r="10" fill="#0f172a" />
          <circle cx="40" cy="30" r="10" fill="#ef4444" stroke="#991b1b" strokeWidth="2" />
          <text x="40" y="52" fill="#ffffff" fontSize="8" fontWeight="bold" textAnchor="middle">RESET</text>

          <circle cx="160" cy="100" r="18" fill="none" stroke="#ffffff" strokeWidth="2.5" />
          <text x="160" y="130" fill="#ffffff" fontSize="15" fontWeight="bold" textAnchor="middle">UNO</text>
          <text x="160" y="148" fill="#00e5ff" fontSize="11" fontWeight="bold" textAnchor="middle">Arduino™</text>

          <rect x="70" y="5" width="185" height="18" fill="#1e293b" rx="2" />
          <circle cx="80" cy="14" r="3" fill="#000" /><text x="80" y="32" fill="#fff" fontSize="8">13</text>
          <circle cx="93" cy="14" r="3" fill="#000" /><text x="93" y="32" fill="#fff" fontSize="8">12</text>
          <circle cx="106" cy="14" r="3" fill="#000" /><text x="106" y="32" fill="#fff" fontSize="8">11</text>
          <circle cx="119" cy="14" r="3" fill="#000" /><text x="119" y="32" fill="#fff" fontSize="8">10</text>

          <rect x="80" y="282" width="170" height="18" fill="#1e293b" rx="2" />
          <circle cx="110" cy="291" r="3" fill="#000" /><text x="110" y="278" fill="#fff" fontSize="8">5V</text>
          <circle cx="125" cy="291" r="3" fill="#000" /><text x="125" y="278" fill="#fff" fontSize="8">GND</text>
          <circle cx="170" cy="291" r="3" fill="#000" /><text x="170" y="278" fill="#fff" fontSize="8">A0</text>
        </g>

        {/* FRITZING BREADBOARD GRAPHIC */}
        <g transform="translate(410, 65)">
          <rect x="0" y="0" width="500" height="305" rx="8" fill="url(#bbGrad)" stroke="#cbd5e1" strokeWidth="2" />
          <line x1="20" y1="18" x2="480" y2="18" stroke="#ef4444" strokeWidth="2" />
          <line x1="20" y1="288" x2="480" y2="288" stroke="#ef4444" strokeWidth="2" />
          <line x1="20" y1="32" x2="480" y2="32" stroke="#3b82f6" strokeWidth="2" />
          <line x1="20" y1="272" x2="480" y2="272" stroke="#3b82f6" strokeWidth="2" />

          <rect x="15" y="142" width="470" height="20" fill="#cbd5e1" />
          
          {/* Breadboard Holes */}
          <g fill="#475569">
            {Array.from({ length: 24 }).map((_, colIdx) => (
              <g key={colIdx} transform={`translate(${30 + colIdx * 19}, 0)`}>
                <circle cx="0" cy="55" r="2.5" />
                <circle cx="0" cy="73" r="2.5" />
                <circle cx="0" cy="91" r="2.5" />
                <circle cx="0" cy="109" r="2.5" />
                <circle cx="0" cy="127" r="2.5" />

                <circle cx="0" cy="177" r="2.5" />
                <circle cx="0" cy="195" r="2.5" />
                <circle cx="0" cy="213" r="2.5" />
                <circle cx="0" cy="231" r="2.5" />
                <circle cx="0" cy="249" r="2.5" />
              </g>
            ))}
          </g>

          {/* 90-DEGREE BENT WIRES */}
          <path d="M -230 14 L -230 -25 L 144 -25 L 144 91" stroke={wireColor} strokeWidth="4" fill="none" strokeLinejoin="round" />
          <circle cx="-230" cy="14" r="4" fill={wireColor} />
          <circle cx="144" cy="91" r="4" fill={wireColor} />

          <path d="M -255 291 L -255 325 L 182 325 L 182 272" stroke="#000000" strokeWidth="4" fill="none" strokeLinejoin="round" />
          <circle cx="-255" cy="291" r="4" fill="#000000" />
          <circle cx="182" cy="272" r="4" fill="#000000" />

          {/* Resistor Component */}
          <g transform="translate(105 109)">
            <line x1="0" y1="0" x2="39" y2="0" stroke="#64748b" strokeWidth="2" />
            <rect x="8" y="-5" width="22" height="10" fill="#fef08a" rx="2" stroke="#d97706" />
            <line x1="12" y1="-5" x2="12" y2="5" stroke="#dc2626" strokeWidth="2" />
            <line x1="16" y1="-5" x2="16" y2="5" stroke="#dc2626" strokeWidth="2" />
            <line x1="20" y1="-5" x2="20" y2="5" stroke="#78350f" strokeWidth="2" />
          </g>

          {/* LED Component */}
          <g transform="translate(144 55)">
            <line x1="-4" y1="36" x2="-4" y2="0" stroke="#94a3b8" strokeWidth="2" />
            <line x1="4" y1="36" x2="4" y2="0" stroke="#94a3b8" strokeWidth="2" />
            <circle cx="0" cy="-8" r="13" fill={ledColor} opacity="0.9" stroke="#ffffff" strokeWidth="1.5" />
            <rect x="-9" y="-3" width="18" height="9" fill={ledColor} rx="2" />
          </g>

          {/* Hardware Badge */}
          <rect x="250" y="210" width="225" height="70" rx="8" fill="#ffffff" stroke="#94a3b8" strokeWidth="1" />
          <text x="262" y="232" fill="#0f172a" fontSize="11" fontWeight="bold">FRITZING HARDWARE WIRING:</text>
          <text x="262" y="250" fill="#475569" fontSize="10">• Pin {14 - expNum} Signal Wire → Resistor</text>
          <text x="262" y="266" fill="#475569" fontSize="10">• LED Cathode Leg → GND Rail</text>
        </g>
      </svg>
    </div>
  );
}
