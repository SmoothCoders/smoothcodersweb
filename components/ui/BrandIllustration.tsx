export function HeroIllustration() {
  return (
    <svg
      viewBox="0 0 800 600"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="w-full h-full"
    >
      {/* Gradient Definitions */}
      <defs>
        <linearGradient id="blueGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#3b82f6" />
          <stop offset="100%" stopColor="#2563eb" />
        </linearGradient>
        <linearGradient id="purpleGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#8b5cf6" />
          <stop offset="100%" stopColor="#7c3aed" />
        </linearGradient>
        <linearGradient id="mixedGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#3b82f6" />
          <stop offset="50%" stopColor="#8b5cf6" />
          <stop offset="100%" stopColor="#ec4899" />
        </linearGradient>
      </defs>

      {/* Background Circles */}
      <circle cx="200" cy="150" r="120" fill="url(#blueGrad)" opacity="0.1" />
      <circle cx="600" cy="450" r="150" fill="url(#purpleGrad)" opacity="0.1" />
      
      {/* Laptop/Screen */}
      <rect x="250" y="200" width="300" height="200" rx="8" fill="url(#blueGrad)" opacity="0.2" />
      <rect x="260" y="210" width="280" height="160" rx="4" fill="white" />
      
      {/* Code Lines */}
      <rect x="280" y="230" width="120" height="8" rx="4" fill="url(#purpleGrad)" opacity="0.6" />
      <rect x="280" y="250" width="200" height="8" rx="4" fill="url(#blueGrad)" opacity="0.4" />
      <rect x="280" y="270" width="160" height="8" rx="4" fill="url(#mixedGrad)" opacity="0.5" />
      <rect x="280" y="290" width="180" height="8" rx="4" fill="url(#purpleGrad)" opacity="0.4" />
      
      {/* Floating Elements */}
      <circle cx="150" cy="300" r="30" fill="url(#blueGrad)" opacity="0.3" />
      <circle cx="650" cy="200" r="40" fill="url(#purpleGrad)" opacity="0.3" />
      <rect x="100" y="450" width="60" height="60" rx="8" fill="url(#mixedGrad)" opacity="0.2" />
      <rect x="640" cy="100" width="80" height="80" rx="12" fill="url(#blueGrad)" opacity="0.2" />
    </svg>
  );
}

export function CodeIllustration() {
  return (
    <svg viewBox="0 0 400 300" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
      <defs>
        <linearGradient id="codeBlue" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#3b82f6" />
          <stop offset="100%" stopColor="#2563eb" />
        </linearGradient>
      </defs>
      
      {/* Browser Window */}
      <rect x="50" y="50" width="300" height="200" rx="8" fill="white" stroke="url(#codeBlue)" strokeWidth="2" />
      <rect x="50" y="50" width="300" height="30" rx="8" fill="url(#codeBlue)" opacity="0.1" />
      
      {/* Browser Dots */}
      <circle cx="70" cy="65" r="4" fill="#ef4444" />
      <circle cx="85" cy="65" r="4" fill="#f59e0b" />
      <circle cx="100" cy="65" r="4" fill="#10b981" />
      
      {/* Code Lines */}
      <rect x="70" y="100" width="80" height="6" rx="3" fill="url(#codeBlue)" opacity="0.6" />
      <rect x="70" y="120" width="150" height="6" rx="3" fill="url(#codeBlue)" opacity="0.4" />
      <rect x="70" y="140" width="120" height="6" rx="3" fill="url(#codeBlue)" opacity="0.5" />
      <rect x="70" y="160" width="100" height="6" rx="3" fill="url(#codeBlue)" opacity="0.6" />
      <rect x="70" y="180" width="140" height="6" rx="3" fill="url(#codeBlue)" opacity="0.4" />
    </svg>
  );
}

export function TeamIllustration() {
  return (
    <svg viewBox="0 0 400 300" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
      <defs>
        <linearGradient id="teamBlue" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#3b82f6" />
          <stop offset="100%" stopColor="#8b5cf6" />
        </linearGradient>
      </defs>
      
      {/* People Icons */}
      <circle cx="120" cy="120" r="30" fill="url(#teamBlue)" opacity="0.3" />
      <circle cx="120" cy="100" r="20" fill="url(#teamBlue)" opacity="0.6" />
      
      <circle cx="200" cy="120" r="30" fill="url(#teamBlue)" opacity="0.3" />
      <circle cx="200" cy="100" r="20" fill="url(#teamBlue)" opacity="0.6" />
      
      <circle cx="280" cy="120" r="30" fill="url(#teamBlue)" opacity="0.3" />
      <circle cx="280" cy="100" r="20" fill="url(#teamBlue)" opacity="0.6" />
      
      {/* Connection Lines */}
      <line x1="140" y1="110" x2="180" y2="110" stroke="url(#teamBlue)" strokeWidth="2" opacity="0.4" />
      <line x1="220" y1="110" x2="260" y2="110" stroke="url(#teamBlue)" strokeWidth="2" opacity="0.4" />
    </svg>
  );
}

export function RocketIllustration() {
  return (
    <svg viewBox="0 0 400 400" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
      <defs>
        <linearGradient id="rocketGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#3b82f6" />
          <stop offset="50%" stopColor="#8b5cf6" />
          <stop offset="100%" stopColor="#ec4899" />
        </linearGradient>
      </defs>
      
      {/* Rocket Body */}
      <ellipse cx="200" cy="150" rx="40" ry="80" fill="url(#rocketGrad)" opacity="0.3" />
      <path d="M 200,100 L 220,80 L 200,60 L 180,80 Z" fill="url(#rocketGrad)" opacity="0.5" />
      
      {/* Flames */}
      <path d="M 180,220 Q 180,250 200,280 Q 220,250 220,220 Z" fill="#f59e0b" opacity="0.4" />
      <path d="M 190,220 Q 190,240 200,260 Q 210,240 210,220 Z" fill="#ef4444" opacity="0.6" />
      
      {/* Stars */}
      <circle cx="100" cy="100" r="3" fill="url(#rocketGrad)" opacity="0.8" />
      <circle cx="300" cy="150" r="4" fill="url(#rocketGrad)" opacity="0.6" />
      <circle cx="120" cy="250" r="3" fill="url(#rocketGrad)" opacity="0.7" />
      <circle cx="280" cy="280" r="4" fill="url(#rocketGrad)" opacity="0.8" />
    </svg>
  );
}
