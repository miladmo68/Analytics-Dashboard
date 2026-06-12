/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';

interface LogoProps {
  className?: string;
  size?: number | string;
}

export function MilinkLogo({ className = "w-9 h-9", size }: LogoProps) {
  return (
    <svg 
      viewBox="0 0 1000 680" 
      className={className} 
      style={size ? { width: size, height: size } : undefined}
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* High-fidelity vector recreation of the Milink Stylized Vibrant M-Link Logo */}
      {/* Outer arched stylized M columns */}
      <path 
        d="M247.5 186.4C260.1 158.5 292.1 143.8 340.5 143.8C380.2 143.8 415.6 156.9 446.8 183.2C478.1 209.5 495.8 222.7 500 222.7C504.2 222.7 521.9 209.5 553.2 183.2C584.4 156.9 619.8 143.8 659.5 143.8C707.9 143.8 739.9 158.5 752.5 186.4C771.8 229.2 775.9 277.2 759.5 330.4C735.6 408.0 681.4 468.2 626.8 468.2C590.2 468.2 562.9 442.2 562.9 403.5C562.9 331.7 635.4 268.4 635.4 188.4C635.4 152.9 605.3 125.8 564.3 125.8C528.1 125.8 497.8 151.6 484.7 184.1C471.6 151.6 441.3 125.8 405.1 125.8C364.1 125.8 334 152.9 334 188.4C334 268.4 406.5 331.7 406.5 403.5C406.5 442.2 379.2 468.2 342.6 468.2C288 468.2 233.8 408.0 209.9 330.4C193.5 277.2 197.6 229.2 247.5 186.4Z" 
        fill="#0070ff" 
      />
      {/* Perfect matching script spiral cursive loops in center base */}
      <path 
        d="M500 480C460 480 420 440 420 390C420 340 460 300 500 300C540 300 580 340 580 390C580 415 555 440 530 440C505 440 490 420 490 400C490 380 505 365 525 365C538 365 545 372 545 380C545 390 538 395 530 395" 
        stroke="#0070ff" 
        strokeWidth="32" 
        strokeLinecap="round" 
        strokeLinejoin="round" 
        fill="none" 
      />
    </svg>
  );
}
