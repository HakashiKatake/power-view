
import React from 'react';

export const Gauge = ({ value, max = 5, label, unit = "kW" }) => {
  const radius = 80;
  const stroke = 12;
  const normalizedValue = Math.min(Math.max(value, 0), max);
  const circumference = 2 * Math.PI * radius;
  // We want a semi-circle gauge (180 degrees)
  // So we only use half the circumference for the offset calculation relative to a full circle
  // But actually, it's easier to do a simple dasharray trick for a 180 degree gauge.
  
  // Let's do a simple 180 degree gauge.
  // 0 at left (180 deg), max at right (0 deg) ? No, typically 180 (left) to 0 (right).
  // Standard SVG circle starts at 3 o'clock (0 deg).
  // We want 9 o'clock (180 deg) to 3 o'clock (0 deg).
  
  const percentage = normalizedValue / max;
  const rotation = -180 + (percentage * 180); // -180 to 0

  return (
    <div className="flex flex-col items-center justify-center p-4">
      <div className="relative w-48 h-24 overflow-hidden">
        {/* Background Arc */}
        <div className="absolute top-0 left-0 w-48 h-48 rounded-full border-[12px] border-gray-200 border-b-0 box-border bg-transparent"></div>
        
        {/* Needle/Fill - Using rotation for a needle is easier than stroke-dashoffset for a complex look */}
        {/* Let's try a filled arc approach with CSS transforms or just a needle */}
        
        <div 
            className="absolute top-0 left-0 w-48 h-48 rounded-full border-[12px] border-b-0 box-border transition-all duration-300 ease-out"
            style={{
                borderColor: 'transparent',
                borderTopColor: 'black',
                borderLeftColor: 'black',
                transform: `rotate(${rotation}deg)`,
                opacity: 0 // This approach is tricky for just a segment. 
            }}
        ></div>
        
        {/* Simple Needle Approach */}
        <div className="absolute bottom-0 left-1/2 w-full h-1 bg-transparent origin-left"
             style={{
                transform: `translateX(-50%) rotate(${rotation}deg)` 
             }}
        >
             {/* The Needle itself */}
        </div>

        {/* Let's use SVG for precision */}
        <svg viewBox="0 0 200 110" className="w-full h-full">
            {/* Background Track */}
            <path d="M 20 100 A 80 80 0 0 1 180 100" fill="none" stroke="#e5e7eb" strokeWidth="20" strokeLinecap="butt" />
            
            {/* Active Trace - Calculate path based on value? Hard with simple path d. 
                Let's use stroke-dasharray.
                Arc length = PI * R = 3.14 * 80 ~= 251.
            */}
            <path 
                d="M 20 100 A 80 80 0 0 1 180 100" 
                fill="none" 
                stroke="black" 
                strokeWidth="20" 
                strokeLinecap="butt"
                strokeDasharray="251.2"
                strokeDashoffset={251.2 * (1 - percentage)}
                className="transition-all duration-500 ease-out"
            />
        </svg>
        
        {/* Value Text */}
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 text-center mb-2">
            <span className="text-2xl font-black">{value.toFixed(2)}</span>
            <span className="text-xs font-bold block">{unit}</span>
        </div>
      </div>
      <div className="mt-2 text-sm font-black uppercase text-center">{label}</div>
    </div>
  );
};

export default Gauge;
